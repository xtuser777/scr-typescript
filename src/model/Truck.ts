import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Proprietary from './Proprietary';
import TruckType from './TruckType';

interface IFields {
  id?: number;
  filter?: string;
  type?: number;
  proprietary?: number;
  order?: string;
}

export default class Truck {
  private _id: number;
  private _plate: string;
  private _brand: string;
  private _model: string;
  private _color: string;
  private _manufactureYear: number;
  private _modelYear: number;
  private _type: TruckType;
  private _proprietary: Proprietary;

  constructor(
    id = 0,
    plate = '',
    brand = '',
    model = '',
    color = '',
    manufactureYear = 0,
    modelYear = 0,
    type = new TruckType(),
    proprietary = new Proprietary(),
  ) {
    this._id = id;
    this._plate = plate;
    this._brand = brand;
    this._model = model;
    this._color = color;
    this._manufactureYear = manufactureYear;
    this._modelYear = modelYear;
    this._type = type;
    this._proprietary = proprietary;
  }

  get id(): number {
    return this._id;
  }

  get plate(): string {
    return this._plate;
  }

  get brand(): string {
    return this._brand;
  }

  get model(): string {
    return this._model;
  }

  get color(): string {
    return this._color;
  }

  get manufactureYear(): number {
    return this._manufactureYear;
  }

  get modelYear(): number {
    return this._modelYear;
  }

  get type(): TruckType {
    return this._type;
  }

  get proprietary(): Proprietary {
    return this._proprietary;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._plate.length <= 0 ||
      this._brand.length <= 0 ||
      this._model.length <= 0 ||
      this._color.length <= 0 ||
      this._manufactureYear <= 1900 ||
      this._modelYear <= 1900 ||
      this._type.id == 0 ||
      this._proprietary.id == 0
    )
      return -5;

    const parameters = [
      this._plate,
      this._brand,
      this._model,
      this._color,
      this._manufactureYear,
      this._modelYear,
      this._type.id,
      this._proprietary.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'caminhao',
        'cam_placa,cam_marca,cam_modelo,cam_cor,cam_ano_fabricacao,cam_ano_modelo,tip_cam_id,prp_id',
        '?,?,?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<Truck[]> {
    const trucks: Truck[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `tc.tip_cam_id,tc.tip_cam_descricao,tc.tip_cam_eixos,tc.tip_cam_capacidade,
       cm.cam_id,cm.cam_placa,cm.cam_marca,cm.cam_modelo,cm.cam_cor,cm.cam_ano_fabricacao,cm.cam_ano_modelo,cm.prp_id`,
      )
      .from('caminhao cm')
      .innerJoin('tipo_caminhao tc')
      .on('tc.tip_cam_id = cm.tip_cam_id');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('cm.cam_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`, `%${fields.filter}%`);
        builder = builder.where('cm.cam_marca like ?').or('cm.cam_modelo like ?');
      }

      if (fields.proprietary && fields.type) {
        parameters.push(fields.proprietary, fields.type);
        builder = builder.where('cm.prp_id = ?').and('cm.tip_cam_id = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      trucks.push(
        new Truck(
          row.cam_id,
          row.cam_placa,
          row.cam_marca,
          row.cam_modelo,
          row.cam_cor,
          row.cam_ano_fabricacao,
          row.cam_ano_modelo,
          new TruckType(
            row.tip_cam_id,
            row.tip_cam_descricao,
            row.tip_cam_eixos,
            row.tip_cam_capacidade,
          ),
          (await new Proprietary().get({ id: row.prp_id }))[0],
        ),
      );
    }

    return trucks;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._plate.length <= 0 ||
      this._brand.length <= 0 ||
      this._model.length <= 0 ||
      this._color.length <= 0 ||
      this._manufactureYear <= 1900 ||
      this._modelYear <= 1900 ||
      this._type.id == 0 ||
      this._proprietary.id == 0
    )
      return -5;

    const parameters = [
      this._plate,
      this._brand,
      this._model,
      this._color,
      this._manufactureYear,
      this._modelYear,
      this._type.id,
      this._proprietary.id,
      this._id,
    ];

    const query = new QueryBuilder()
      .update('caminhao')
      .set(
        'cam_placa = ?,cam_marca = ?,cam_modelo = ?,cam_cor = ?,cam_ano_fabricacao = ?,cam_ano_modelo = ?,tip_cam_id = ?,prp_id = ?',
      )
      .where('cam_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder().delete('caminhao').where('cam_id = ?').build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }
}
