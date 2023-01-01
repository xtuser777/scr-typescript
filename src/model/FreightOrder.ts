import City from './City';
import Client from './Client';
import Driver from './Driver';
import FreightBudget from './FreightBudget';
import FreightOrderItem from './FreightOrderItem';
import LoadStep from './LoadStep';
import OrderStatus from './OrderStatus';
import PaymentForm from './PaymentForm';
import Proprietary from './Proprietary';
import Representation from './Representation';
import SalesOrder from './SalesOrder';
import Truck from './Truck';
import TruckType from './TruckType';
import User from './User';

export default class FreightOrder {
  private _id: number;
  private _date: Date;
  private _description: string;
  private _distance: number;
  private _weight: number;
  private _value: number;
  private _driverValue: number;
  private _driverEntry: number;
  private _shipping: string;
  private _budget?: FreightBudget;
  private _order?: SalesOrder;
  private _representation?: Representation;
  private _client?: Client;
  private _destiny?: City;
  private _truckType?: TruckType;
  private _proprietary?: Proprietary;
  private _driver?: Driver;
  private _truck?: Truck;
  private _status?: OrderStatus;
  private _paymentFormFreight?: PaymentForm;
  private _paymentFormDriver?: PaymentForm;
  private _author?: User;
  private _items: FreightOrderItem[];
  private _steps: LoadStep[];

  constructor(
    id = 0,
    date = new Date(),
    description = '',
    distance = 0,
    weight = 0,
    value = 0,
    driverValue = 0,
    driverEntry = 0,
    shipping = '',
    budget = undefined,
    order = undefined,
    representation = undefined,
    client = undefined,
    destiny = undefined,
    truckType = undefined,
    proprietary = undefined,
    driver = undefined,
    truck = undefined,
    status = undefined,
    paymentFormFreight = undefined,
    paymentFormDriver = undefined,
    author = undefined,
    items = [],
    steps = [],
  ) {
    this._id = id;
    this._date = date;
    this._description = description;
    this._distance = distance;
    this._weight = weight;
    this._value = value;
    this._driverValue = driverValue;
    this._driverEntry = driverEntry;
    this._shipping = shipping;
    this._budget = budget;
    this._order = order;
    this._representation = representation;
    this._client = client;
    this._destiny = destiny;
    this._truckType = truckType;
    this._proprietary = proprietary;
    this._driver = driver;
    this._truck = truck;
    this._status = status;
    this._paymentFormFreight = paymentFormFreight;
    this._paymentFormDriver = paymentFormDriver;
    this._author = author;
    this._items = items;
    this._steps = steps;
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

  get distance(): number {
    return this._distance;
  }

  get weight(): number {
    return this._weight;
  }

  get value(): number {
    return this._value;
  }

  get driverValue(): number {
    return this._driverValue;
  }

  get driverEntry(): number {
    return this._driverEntry;
  }

  get shipping(): string {
    return this._shipping;
  }

  get budget(): FreightBudget | undefined {
    return this._budget;
  }

  get order(): SalesOrder | undefined {
    return this._order;
  }

  get representation(): Representation | undefined {
    return this._representation;
  }

  get client(): Client | undefined {
    return this._client;
  }

  get destiny(): City | undefined {
    return this._destiny;
  }

  get truckType(): TruckType | undefined {
    return this._truckType;
  }

  get proprietary(): Proprietary | undefined {
    return this._proprietary;
  }

  get driver(): Driver | undefined {
    return this._driver;
  }

  get truck(): Truck | undefined {
    return this._truck;
  }

  get status(): OrderStatus | undefined {
    return this._status;
  }

  get paymentFormFreight(): PaymentForm | undefined {
    return this._paymentFormFreight;
  }

  get paymentFormDriver(): PaymentForm | undefined {
    return this._paymentFormDriver;
  }

  get author(): User | undefined {
    return this._author;
  }

  get items(): FreightOrderItem[] {
    return this._items;
  }

  get steps(): LoadStep[] {
    return this._steps;
  }
}
