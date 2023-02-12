import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Status from './Status';
import User from './User';

interface IFields {
  order?: number;
  status?: number;
  orderBy?: string;
}

export default class OrderStatus {
  private _status?: Status;
  private _date: Date;
  private _time: Date;
  private _observation: string;
  private _current: boolean;
  private _author?: User;

  constructor(
    status = undefined,
    date = new Date(),
    time = new Date(),
    observation = '',
    current = false,
    author = undefined,
  ) {
    this._status = status;
    this._date = date;
    this._time = time;
    this._observation = observation;
    this._current = current;
    this._author = author;
  }

  get status(): Status | undefined {
    return this._status;
  }

  get date(): Date {
    return this._date;
  }

  get time(): Date {
    return this._time;
  }

  get observation(): string {
    return this._observation;
  }

  get current(): boolean {
    return this._current;
  }

  get author(): User | undefined {
    return this._author;
  }

  async save(order: number): Promise<number> {
    if (order <= 0 || !this._status || !this._author) return -5;

    const parameters = [
      order,
      this._status?.id,
      this._date,
      this._time,
      this._observation,
      this._current,
      this._author?.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'status_pedido',
        'ped_fre_id, sts_id, ped_fre_sts_data, ped_fre_sts_hora, ped_fre_sts_observacoes, ped_fre_sts_atual, usu_id',
        '?,?,?,CURRENT_TIME(),?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields: IFields): Promise<OrderStatus[]> {
    const statuses: OrderStatus[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('pedido_frete_status ');

    if (fields) {
      if (fields.order) {
        parameters.push(fields.order);
        builder = builder.where('ped_fre_id = ?');
      }

      if (fields.status) {
        parameters.push(fields.status);
        builder = builder.where('sts_id = ?').and('sts_id = ?');
      }

      if (fields.orderBy) {
        builder = builder.orderBy(fields.orderBy);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const status = new OrderStatus();
      await status.convertRow(row);
      statuses.push(status);
    }

    return statuses;
  }

  async uncurrent(order: number, status: number): Promise<number> {
    if (order <= 0 || status <= 0) return -5;

    const parameters = [order, status];

    const query = new QueryBuilder()
      .update('pedido_frete_status')
      .set('ped_fre_sts_atual = false')
      .where('ped_fre_id = ?')
      .and('sts_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(order: number): Promise<number> {
    if (order <= 0) return -5;

    const query = new QueryBuilder()
      .delete('pedido_frete_status')
      .where('ped_fre_id = ?')
      .build();

    const result = await Database.instance.delete(query, [order]);

    return result;
  }

  private async convertRow(row: any): Promise<void> {
    this._status = (await new Status().get({ id: row.sts_id }))[0];
    this._date = new Date(row.ped_fre_sts_data);
    this._time = new Date(row.ped_fre_sts_hora);
    this._observation = row.ped_fre_sts_observacoes;
    this._current = row.ped_fre_sts_atual;
    this._author = (await new User().get({ id: row.usu_id }))[0];
  }
}
