import City from './City';
import Client from './Client';
import Representation from './Representation';
import SaleBudget from './SaleBudget';
import TruckType from './TruckType';
import User from './User';

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
    saleBudget = undefined,
    representation = undefined,
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
}
