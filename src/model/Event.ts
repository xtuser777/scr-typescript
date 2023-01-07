import FreightOrder from './FreightOrder';
import SalesOrder from './SalesOrder';
import User from './User';

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
}
