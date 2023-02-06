import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import City from './City';
import Client from './Client';
import Employee from './Employee';
import User from './User';

interface IFields {
  id?: number;
  date?: string;
  initial?: string;
  end?: string;
  filter?: string;
  client?: number;
  order?: string;
}

export default class SaleBudget {
  private _id: number;
  private _description: string;
  private _date: Date;
  private _clientName: string;
  private _clientDocument: string;
  private _clientPhone: string;
  private _clientCellphone: string;
  private _clientEmail: string;
  private _weight: number;
  private _value: number;
  private _validate: Date;
  private _salesman?: Employee;
  private _client?: Client;
  private _destiny: City;
  private _author: User;

  constructor(
    id = 0,
    description = '',
    date = new Date(),
    clientName = '',
    clientDocument = '',
    clientPhone = '',
    clientCellphone = '',
    clientEmail = '',
    weight = 0,
    value = 0,
    validate = new Date(),
    salesman: Employee | undefined = undefined,
    client: Client | undefined = undefined,
    destiny = new City(),
    author = new User(),
  ) {
    this._id = id;
    this._description = description;
    this._date = date;
    this._clientName = clientName;
    this._clientDocument = clientDocument;
    this._clientPhone = clientPhone;
    this._clientCellphone = clientCellphone;
    this._clientEmail = clientEmail;
    this._weight = weight;
    this._value = value;
    this._validate = validate;
    this._salesman = salesman;
    this._client = client;
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

  get clientName(): string {
    return this._clientName;
  }

  get clientDocument(): string {
    return this._clientDocument;
  }

  get clientPhone(): string {
    return this._clientPhone;
  }

  get clientCellphone(): string {
    return this._clientCellphone;
  }

  get clientEmail(): string {
    return this._clientEmail;
  }

  get weight(): number {
    return this._weight;
  }

  get value(): number {
    return this._value;
  }

  get valitate(): Date {
    return this._validate;
  }

  get salesman(): Employee | undefined {
    return this._salesman;
  }

  get client(): Client | undefined {
    return this._client;
  }

  get destiny(): City {
    return this._destiny;
  }

  get author(): User {
    return this._author;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._description.length == 0 ||
      this._clientName.length == 0 ||
      this.clientDocument.length == 0 ||
      this._clientPhone.length == 0 ||
      this._clientCellphone.length == 0 ||
      this._clientEmail.length == 0 ||
      this._value <= 0 ||
      this._weight <= 0 ||
      this._destiny.id == 0 ||
      this._author.id == 0
    )
      return -5;

    const parameters = [
      this._description,
      this._date,
      this._clientName,
      this._clientDocument,
      this._clientPhone,
      this._clientCellphone,
      this._clientEmail,
      this._weight,
      this._value,
      this._validate,
      this._salesman?.id,
      this._client?.id,
      this._destiny.id,
      this._author.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'orcamento_venda',
        `orc_ven_descricao,orc_ven_data,orc_ven_nome_cliente,orc_ven_documento_cliente,
        orc_ven_telefone_cliente,orc_ven_celular_cliente,orc_ven_email_cliente,orc_ven_peso,orc_ven_valor,
        orc_ven_validade,
        fun_id,cli_id,cid_id,usu_id`,
        '?,?,?,?,?,?,?,?,?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields: IFields): Promise<SaleBudget[]> {
    const budgets: SaleBudget[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `orc_ven_id,orc_ven_descricao,orc_ven_data,
        orc_ven_nome_cliente,orc_ven_documento_cliente,orc_ven_telefone_cliente,orc_ven_celular_cliente,orc_ven_email_cliente,
        orc_ven_peso,orc_ven_valor,orc_ven_validade,
        fun_id,cli_id,cid_id,usu_id`,
      )
      .from('orcamento_venda');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('orc_ven_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`, `%${fields.filter}%`);
        builder = builder
          .where('(orc_ven_descricao like ? or orc_ven_nome_cliente like ?)')
          .and('(orc_ven_descricao like ? or orc_ven_nome_cliente like ?)');
      }

      if (fields.date) {
        parameters.push(fields.date);
        builder = builder.where('orc_ven_data = ?').and('orc_ven_data = ?');
      }

      if (fields.initial && fields.end) {
        parameters.push(fields.initial, fields.end);
        builder = builder
          .where('(orc_ven_data >= ? and orc_ven_data <= ?)')
          .and('(orc_ven_data >= ? and orc_ven_data <= ?)');
      }

      if (fields.client) {
        parameters.push(fields.client);
        builder = builder.where('cli_id = ?').and('cli_id = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      budgets.push(
        new SaleBudget(
          row.orc_ven_id,
          row.orc_ven_descricao,
          row.orc_ven_data,
          row.orc_ven_nome_cliente,
          row.orc_ven_documento_cliente,
          row.orc_ven_telefone_cliente,
          row.orc_ven_celular_cliente,
          row.orc_ven_email_cliente,
          row.orc_ven_peso,
          row.orc_ven_valor,
          row.orc_ven_validade,
          !row.fun_id ? undefined : (await new Employee().get({ id: row.fun_id }))[0],
          !row.cli_id ? undefined : (await new Client().get({ id: row.cli_id }))[0],
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
      this._description.length == 0 ||
      this._clientName.length == 0 ||
      this.clientDocument.length == 0 ||
      this._clientPhone.length == 0 ||
      this._clientCellphone.length == 0 ||
      this._clientEmail.length == 0 ||
      this._value <= 0 ||
      this._weight <= 0 ||
      this._destiny.id == 0
    )
      return -5;

    const parameters = [
      this._description,
      this._date,
      this._clientName,
      this._clientDocument,
      this._clientPhone,
      this._clientCellphone,
      this._clientEmail,
      this._weight,
      this._value,
      this._validate,
      this._salesman?.id,
      this._client?.id,
      this._destiny.id,
      this._id,
    ];

    const query = new QueryBuilder()
      .update('orcamento_venda')
      .set(
        `orc_ven_descricao = ?,orc_ven_data = ?,orc_ven_nome_cliente = ?,orc_ven_documento_cliente = ?,
        orc_ven_telefone_cliente = ?,orc_ven_celular_cliente = ?,orc_ven_email_cliente = ?,orc_ven_peso = ?,
        orc_ven_valor = ?,orc_ven_validade = ?,fun_id = ?,cli_id = ?,cid_id = ?,usu_id = ?`,
      )
      .where('orc_ven_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('orcamento_venda')
      .where('orc_ven_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }
}
