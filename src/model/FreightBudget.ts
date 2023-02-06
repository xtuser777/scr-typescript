import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import City from './City';
import Client from './Client';
import Representation from './Representation';
import SaleBudget from './SaleBudget';
import TruckType from './TruckType';
import User from './User';

interface IFields {
  id?: number;
  date?: string;
  filter?: string;
  initial?: string;
  end?: string;
  price?: number;
  client?: number;
  order?: string;
}

export default class FreightBudget {
  private _id: number;
  private _description: string;
  private _date: Date;
  private _distance: number;
  private _weight: number;
  private _value: number;
  private _shipping: string;
  private _validate: Date;
  private _saleBudget?: SaleBudget;
  private _representation?: Representation;
  private _client: Client;
  private _truckType: TruckType;
  private _destiny: City;
  private _author: User;

  constructor(
    id = 0,
    description = '',
    date = new Date(),
    distance = 0,
    weight = 0,
    value = 0,
    shipping = '',
    validate = new Date(),
    saleBudget: SaleBudget | undefined = undefined,
    representation: Representation | undefined = undefined,
    client = new Client(),
    truckType = new TruckType(),
    destiny = new City(),
    author = new User(),
  ) {
    this._id = id;
    this._description = description;
    this._date = date;
    this._distance = distance;
    this._weight = weight;
    this._value = value;
    this._shipping = shipping;
    this._validate = validate;
    this._saleBudget = saleBudget;
    this._representation = representation;
    this._client = client;
    this._truckType = truckType;
    this._destiny = destiny;
    this._author = author;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get date(): Date {
    return this._date;
  }

  get distance(): number {
    return this._distance;
  }

  get weight(): number {
    return this._weight;
  }

  get value(): number {
    return this._value;
  }

  get shipping(): string {
    return this._shipping;
  }

  get validate(): Date {
    return this._validate;
  }

  get salebudget(): SaleBudget | undefined {
    return this._saleBudget;
  }

  get representation(): Representation | undefined {
    return this._representation;
  }

  get client(): Client {
    return this._client;
  }

  get truckType(): TruckType {
    return this._truckType;
  }

  get destiny(): City {
    return this._destiny;
  }

  get author(): User {
    return this._author;
  }

  calculateMinimumFloor(km: number, axes: number): number {
    let floor = 0.0;

    if (km <= 0.0 || axes <= 0) return floor;

    switch (axes) {
      case 4:
        floor = km * 2.3041;
        break;
      case 5:
        floor = km * 2.7446;
        break;
      case 6:
        floor = km * 3.1938;
        break;
      case 7:
        floor = km * 3.3095;
        break;
      case 9:
        floor = km * 3.6542;
        break;
    }

    return floor;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._description.trim().length <= 0 ||
      this._distance <= 0 ||
      this._value <= 0 ||
      this._weight <= 0 ||
      this._destiny.id == 0 ||
      this._truckType.id == 0 ||
      this._author.id == 0
    )
      return -5;

    const parameters = [
      this._description,
      this._date,
      this._distance,
      this._weight,
      this._value,
      this._shipping,
      this._validate,
      !this._saleBudget ? null : this._saleBudget.id,
      !this._representation ? null : this._representation.id,
      this._client.id,
      this._truckType.id,
      this._destiny.id,
      this._author.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'orcamento_frete',
        ' orc_fre_descricao,orc_fre_data,orc_fre_distancia,orc_fre_peso,orc_fre_valor,orc_fre_entrega,orc_fre_validade,orc_ven_id,rep_id,cli_id,tip_cam_id,cid_id,usu_id',
        '?,?,?,?,?,?,?,?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<FreightBudget[]> {
    const budgets: FreightBudget[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `o.orc_fre_id, o.orc_fre_descricao, o.orc_fre_data, o.orc_fre_distancia, o.orc_fre_peso,
        o.orc_fre_valor, o.orc_fre_entrega, o.orc_fre_validade,
        o.orc_ven_id, o.rep_id, o.cli_id, o.tip_cam_id, o.cid_id, o.usu_id`,
      )
      .from('orcamento_frete o');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('o.orc_fre_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`);
        builder = builder
          .where('o.orc_fre_descricao like ?')
          .and('o.orc_fre_descricao like ?');
      }

      if (fields.date) {
        parameters.push(fields.date);
        builder = builder.where('o.orc_fre_data = ?').and('o.orc_fre_data = ?');
      }

      if (fields.initial && fields.end) {
        parameters.push(fields.initial, fields.end);
        builder = builder
          .where('(o.orc_fre_data >= ? and o.orc_fre_data <= ?)')
          .and('(o.orc_fre_data >= ? and o.orc_fre_data <= ?)');
      }

      if (fields.price) {
        parameters.push(fields.price);
        builder = builder.where('o.orc_fre_valor = ?').and('o.orc_fre_valor = ?');
      }

      if (fields.client) {
        parameters.push(fields.client);
        builder = builder.where('o.cli_id = ?').and('o.cli_id = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      budgets.push(
        new FreightBudget(
          row.orc_fre_id,
          row.orc_fre_descricao,
          row.orc_fre_data,
          row.orc_fre_distancia,
          row.orc_fre_peso,
          row.orc_fre_valor,
          row.orc_fre_entrega,
          row.orc_fre_validade,
          !row.orc_ven_id
            ? undefined
            : (await new SaleBudget().get({ id: row.orc_ven_id }))[0],
          !row.rep_id
            ? undefined
            : (await new Representation().get({ id: row.rep_id }))[0],
          (await new Client().get({ id: row.cli_id }))[0],
          (await new TruckType().get({ id: row.tip_cam_id }))[0],
          (await new City().get({ id: row.cid_id }))[0],
          (await new User().get({ id: row.usu_id }))[0],
        ),
      );
    }

    return budgets;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._description.trim().length <= 0 ||
      this._distance <= 0 ||
      this._value <= 0 ||
      this._weight <= 0 ||
      this._destiny.id == 0 ||
      this._truckType.id == 0
    )
      return -5;

    const parameters = [
      this._description,
      this._date,
      this._distance,
      this._weight,
      this._value,
      this._shipping,
      this._validate,
      !this._saleBudget ? null : this._saleBudget.id,
      !this._representation ? null : this._representation.id,
      this._client.id,
      this._truckType.id,
      this._destiny.id,
      this._id,
    ];

    const query = new QueryBuilder()
      .update('orcamento_frete')
      .set(
        `orc_fre_descricao = ?,orc_fre_distancia = ?,orc_fre_peso = ?,orc_fre_valor = ?,orc_fre_entrega = ?,
        orc_fre_validade = ?,orc_ven_id = ?,rep_id = ?,cli_id = ?,tip_cam_id = ?,cid_id = ?`,
      )
      .where('orc_fre_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('orcamento_frete')
      .where('orc_fre_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }
}
