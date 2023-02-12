import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Representation from './Representation';

interface IFields {
  id?: number;
  order?: number;
  orderBy?: string;
}

export default class LoadStep {
  private _id: number;
  private _order: number;
  private _status: number;
  private _load: number;
  private _representation?: Representation;

  constructor(id = 0, order = 0, status = 0, load = 0, representation = undefined) {
    this._id = id;
    this._order = order;
    this._status = status;
    this._load = load;
    this._representation = representation;
  }

  get id(): number {
    return this._id;
  }

  get order(): number {
    return this._order;
  }

  get status(): number {
    return this._status;
  }

  get load(): number {
    return this._load;
  }

  get representation(): Representation | undefined {
    return this._representation;
  }

  async save(order: number): Promise<number> {
    if (
      this._id != 0 ||
      this._order <= 0 ||
      this._status <= 0 ||
      this._load <= 0 ||
      !this._representation
    )
      return -5;

    const parameters = [
      order,
      this._order,
      this._status,
      this._load,
      this._representation.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'etapa_carregamento',
        'ped_fre_id, eta_car_ordem, eta_car_status, eta_car_carga, rep_id',
        '?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields: IFields): Promise<LoadStep[]> {
    const steps: LoadStep[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('etapa_carregamento');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('eta_car_id = ?');
      }

      if (fields.order) {
        parameters.push(fields.order);
        builder = builder.where('ped_fre_id = ?').and('ped_fre_id = ?');
      }

      if (fields.orderBy) builder = builder.orderBy(fields.orderBy);
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const step = new LoadStep();
      await step.convertRow(row);
      steps.push(step);
    }

    return steps;
  }

  async autorize(): Promise<number> {
    if (this._id) return -5;

    const query = new QueryBuilder()
      .update('etapa_carregamento')
      .set('eta_car_status = 2')
      .where('eta_car_id = ?')
      .build();

    const result = await Database.instance.update(query, [this._id]);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('etapa_carregamento')
      .where('eta_car_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  private async convertRow(row: any): Promise<void> {
    this._id = row.eta_car_id;
    this._order = row.eta_car_ordem;
    this._status = row.eta_car_status;
    this._load = row.eta_car_carga;
    this._representation = (await new Representation().get({ id: row.rep_id }))[0];
  }
}
