import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import City from './City';
import Client from './Client';
import Employee from './Employee';
import PaymentForm from './PaymentForm';
import SaleBudget from './SaleBudget';
import SalesOrderItem from './SalesOrderItem';
//import TruckType from './TruckType';
import User from './User';

interface IFields {
  id?: number;
  date?: string;
  initial?: string;
  end?: string;
  filter?: string;
  client?: number;
  budget?: number;
  order?: string;
}

export default class SalesOrder {
  private _id: number;
  private _date: Date;
  private _description: string;
  private _weight: number;
  private _value: number;
  private _salesman?: Employee;
  private _destiny: City;
  private _budget?: SaleBudget;
  //private _truckType: TruckType;
  private _client: Client;
  private _paymentForm: PaymentForm;
  private _author: User;
  private _items: SalesOrderItem[];

  constructor(
    id = 0,
    date = new Date(),
    description = '',
    weight = 0,
    value = 0,
    salesman: Employee | undefined = undefined,
    destiny = new City(),
    budget: SaleBudget | undefined = undefined,
    //truckType = new TruckType(),
    client = new Client(),
    paymentForm = new PaymentForm(),
    author = new User(),
  ) {
    this._id = id;
    this._date = date;
    this._description = description;
    this._weight = weight;
    this._value = value;
    this._salesman = salesman;
    this._destiny = destiny;
    this._budget = budget;
    //this._truckType = truckType;
    this._client = client;
    this._paymentForm = paymentForm;
    this._author = author;
    this._items = [];
  }

  get id(): number {
    return this._id;
  }

  get date(): Date {
    return this._date;
  }

  get description(): string {
    return this._description;
  }

  get weight(): number {
    return this._weight;
  }

  get value(): number {
    return this._value;
  }

  get salesman(): Employee | undefined {
    return this._salesman;
  }

  get destiny(): City {
    return this._destiny;
  }

  get budget(): SaleBudget | undefined {
    return this._budget;
  }

  // get truckType(): TruckType {
  //   return this._truckType;
  // }

  get client(): Client {
    return this._client;
  }

  get paymentForm(): PaymentForm {
    return this._paymentForm;
  }

  get author(): User {
    return this._author;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._description.length === 0 ||
      this._weight <= 0 ||
      this._value <= 0 ||
      this._destiny.id === 0 ||
      this._client.id === 0 ||
      this._paymentForm.id === 0 ||
      this._author.id === 0
    )
      return -5;

    const parameters = [
      this._date,
      this._description,
      this._weight,
      this._value,
      !this._salesman ? null : this._salesman.id,
      this._destiny.id,
      !this._budget ? null : this._budget.id,
      this._client.id,
      this._paymentForm.id,
      this._author.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'pedido_venda',
        `ped_ven_data,ped_ven_descricao,ped_ven_peso,ped_ven_valor,
        fun_id,cid_id,orc_ven_id,cli_id,for_pag_id,usu_id`,
        '?,?,?,?,?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<SalesOrder[]> {
    const orders: SalesOrder[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `ped_ven_id, ped_ven_data, ped_ven_descricao, ped_ven_peso, ped_ven_valor,
           pv.fun_id, cid_id, orc_ven_id, pv.cli_id, pv.for_pag_id, pv.usu_id`,
      )
      .from('pedido_venda pv')
      .innerJoin('cliente cli')
      .on('cli.cli_id = pv.cli_id')
      .leftJoin('cliente_pessoa_fisica cpf')
      .on('cpf.cli_id = cli.cli_id')
      .leftJoin('cliente_pessoa_juridica cpj')
      .on('cpj.cli_id = cli.cli_id')
      .leftJoin('pessoa_fisica pf')
      .on('pf.pf_id = cpf.pf_id')
      .leftJoin('pessoa_juridica pj')
      .on('pj.pj_id = cpj.pj_id')
      .innerJoin('usuario autor')
      .on('autor.usu_id = pv.usu_id')
      .innerJoin('funcionario autor_fun')
      .on('autor_fun.fun_id = autor.fun_id')
      .innerJoin('pessoa_fisica autor_pf')
      .on('autor_pf.pf_id = autor_fun.pf_id')
      .innerJoin('forma_pagamento fp')
      .on('fp.for_pag_id = pv.for_pag_id');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('ped_ven_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`, `%${fields.filter}%`, `%${fields.filter}%`);
        builder = builder
          .where('ped_ven_descricao LIKE ?')
          .or('pf.pf_nome LIKE ?')
          .or('pj.pj_nome_fantasia LIKE ?');
      }

      if (fields.date) {
        parameters.push(fields.date);
        builder = builder.where('ped_ven_data = ?').and('ped_ven_data = ?');
      }

      if (fields.initial && fields.end) {
        parameters.push(fields.initial, fields.end);
        builder = builder
          .where('(ped_ven_data >= ? AND ped_ven_data <= ?)')
          .and('(ped_ven_data >= ? AND ped_ven_data <= ?)');
      }

      if (fields.budget) {
        parameters.push(fields.budget);
        builder = builder.where('pv.orc_ven_id = ?').and('pv.orc_ven_id = ?');
      }

      if (fields.client) {
        parameters.push(fields.client);
        builder = builder.where('cli.cli_id = ?').and('cli.cli_id = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      orders.push(
        new SalesOrder(
          row.ped_ven_id,
          row.ped_ven_data,
          row.ped_ven_descricao,
          row.ped_ven_peso,
          row.ped_ven_valor,
          !row.fun_id ? undefined : (await new Employee().get({ id: row.fun_id }))[0],
          (await new City().get({ id: row.cid_id }))[0],
          !row.orc_ven_id
            ? undefined
            : (await new SaleBudget().get({ id: row.orc_ven_id }))[0],
          (await new Client().get({ id: row.cli_id }))[0],
          (await new PaymentForm().get({ id: row.for_pag_id }))[0],
          (await new User().get({ id: row.usu_id }))[0],
        ),
      );
    }

    return orders;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._description.length === 0 ||
      this._weight <= 0 ||
      this._value <= 0 ||
      this._destiny.id === 0 ||
      this._client.id === 0 ||
      this._paymentForm.id === 0
    )
      return -5;

    const parameters = [
      this._date,
      this._description,
      this._weight,
      this._value,
      !this._salesman ? null : this._salesman.id,
      this._destiny.id,
      !this._budget ? null : this._budget.id,
      this._client.id,
      this._paymentForm.id,
      this._id,
    ];

    const query = new QueryBuilder()
      .update('pedido_venda')
      .set(
        `ped_ven_data = ?,ped_ven_descricao = ?,ped_ven_peso = ?,ped_ven_valor = ?,
       fun_id = ?,cid_id = ?,orc_ven_id = ?,cli_id = ?,for_pag_id = ?,usu_id = ?`,
      )
      .where('ped_ven_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('pedido_venda')
      .where('ped_ved_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }
}
