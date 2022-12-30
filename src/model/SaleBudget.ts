import City from './City';
import Client from './Client';
import Employee from './Employee';
import User from './User';

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
    salesman = undefined,
    client = undefined,
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
}
