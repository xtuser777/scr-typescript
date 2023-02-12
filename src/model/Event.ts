import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import FreightOrder from './FreightOrder';
import SalesOrder from './SalesOrder';
import User from './User';

interface IFields {
  id?: number;
  filter?: string;
  date?: string;
  type?: number;
  orderBy?: string;
}

export default class Event {
  private _id: number;
  private _description: string;
  private _date: Date;
  private _time: Date;
  private _salesOrder?: SalesOrder;
  private _freightOrder?: FreightOrder;
  private _author?: User;

  constructor(
    id = 0,
    description = '',
    date = new Date(),
    time = new Date(),
    salesOrder = undefined,
    freightOrder = undefined,
    author = undefined,
  ) {
    this._id = id;
    this._description = description;
    this._date = date;
    this._time = time;
    this._salesOrder = salesOrder;
    this._freightOrder = freightOrder;
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

  get time(): Date {
    return this._time;
  }

  get salesOrder(): SalesOrder | undefined {
    return this._salesOrder;
  }

  get freightOrder(): FreightOrder | undefined {
    return this._freightOrder;
  }

  get author(): User | undefined {
    return this._author;
  }

  async save(): Promise<number> {
    if (this._id != 0 || this._description.length === 0 || !this._author) return -5;

    const parameters = [
      this._description,
      this._date,
      this._time,
      this._salesOrder?.id,
      this._freightOrder?.id,
      this._author.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'evento',
        'evt_descricao, evt_data, evt_hora, ped_ven_id, ped_fre_id, usu_id',
        '?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<Event[]> {
    const events: Event[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('event');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('evt_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`);
        builder = builder.where('evt_descricao LIKE ?');
      }

      if (fields.date) {
        parameters.push(fields.date);
        builder = builder.where('evt_data = ?').and('evt_data = ?');
      }

      if (fields.type) {
        const order = fields.type == 1 ? 'ped_ven_id' : 'ped_fre_id';
        builder = builder.where(`${order} IS NOT NULL`).and(`${order} IS NOT NULL`);
      }

      if (fields.orderBy) builder = builder.orderBy(fields.orderBy);
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const event = new Event();
      await event.convertRow(row);
      events.push(event);
    }

    return events;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder().delete('evento').where('evt_id = ?').build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  private async convertRow(row: any): Promise<void> {
    this._id = row.evt_id;
    this._date = new Date(row.evt_data);
    this._time = new Date(row.evt_hora);
    this._description = row.evt_descricao;
    this._freightOrder = row.ped_fre_id
      ? (await new FreightOrder().get({ id: row.ped_fre_id }))[0]
      : undefined;
    this._salesOrder = row.ped_ven_id
      ? (await new SalesOrder().get({ id: row.ped_ven_id }))[0]
      : undefined;
    this._author = (await new User().get({ id: row.usu_id }))[0];
  }
}
