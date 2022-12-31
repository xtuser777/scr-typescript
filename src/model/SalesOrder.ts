import City from './City';
import Client from './Client';
import Employee from './Employee';
import PaymentForm from './PaymentForm';
import SaleBudget from './SaleBudget';
import TruckType from './TruckType';
import User from './User';

export default class SalesOrder {
  private _id: number;
  private _date: Date;
  private _description: string;
  private _weight: number;
  private _value: number;
  private _salesman?: Employee;
  private _destiny: City;
  private _budget?: SaleBudget;
  private _truckType: TruckType;
  private _client: Client;
  private _paymentForm: PaymentForm;
  private _author: User;
  //private _items: SalesOrderItem[];

  constructor(
    id = 0,
    date = new Date(),
    description = '',
    weight = 0,
    value = 0,
    salesman = undefined,
    destiny = new City(),
    budget = new SaleBudget(),
    truckType = new TruckType(),
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
    this._truckType = truckType;
    this._client = client;
    this._paymentForm = paymentForm;
    this._author = author;
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

  get truckType(): TruckType {
    return this._truckType;
  }

  get client(): Client {
    return this._client;
  }

  get paymentForm(): PaymentForm {
    return this._paymentForm;
  }

  get author(): User {
    return this._author;
  }
}
