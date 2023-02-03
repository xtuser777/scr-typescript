import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';

interface IFields {
  id?: number;
  description?: string;
  order?: string;
}

export default class TruckType {
  private _id: number;
  private _description: string;
  private _axes: number;
  private _capacity: number;

  constructor(id = 0, description = '', axes = 0, capacity = 0) {
    this._id = id;
    this._description = description;
    this._axes = axes;
    this._capacity = capacity;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get axes(): number {
    return this._axes;
  }

  get capacity(): number {
    return this._capacity;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._description.trim().length == 0 ||
      this._axes <= 0 ||
      this._capacity <= 0
    )
      return -5;

    const parameters = [this._description, this._axes, this._capacity];

    const query = new QueryBuilder()
      .insert(
        'tipo_caminhao',
        'tip_cam_descricao, tip_cam_eixos, tip_cam_capacidade',
        '?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<TruckType[]> {
    const types: TruckType[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(`tip_cam_id, tip_cam_descricao, tip_cam_eixos, tip_cam_capacidade`)
      .from('tipo_caminhao');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('tip_cam_id = ?');
      }

      if (fields.description) {
        parameters.push(`%${fields.description}%`);
        builder = builder.where('tip_cam_descricao like ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      types.push(
        new TruckType(
          row.tip_cam_id,
          row.tip_cam_descricao,
          row.tip_cam_eixos,
          row.tip_cam_capacidade,
        ),
      );
    }

    return types;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._description.trim().length == 0 ||
      this._axes <= 0 ||
      this._capacity <= 0
    )
      return -5;

    const parameters = [this._description, this._axes, this._capacity, this._id];

    const query = new QueryBuilder()
      .update('tipo_caminhao')
      .set('tip_cam_descricao = ?, tip_cam_eixos = ?, tip_cam_capacidade = ?')
      .where('tip_cam_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('tipo_caminhao')
      .where('tip_cam_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }
}
