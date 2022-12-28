import Representation from './Representation';
import TruckType from './TruckType';

export default class Product {
  private _id: number;
  private _description: string;
  private _measure: string;
  private _weight: number;
  private _price: number;
  private _priceOut: number;
  private _representation: Representation;
  private _truckTypes: TruckType[];

  constructor(
    id = 0,
    description = '',
    measure = '',
    weight = 0,
    price = 0,
    priceOut = 0,
    representation = new Representation(),
    truckTypes = [],
  ) {
    this._id = id;
    this._description = description;
    this._measure = measure;
    this._weight = weight;
    this._price = price;
    this._priceOut = priceOut;
    this._representation = representation;
    this._truckTypes = truckTypes;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get measure(): string {
    return this._measure;
  }

  get weight(): number {
    return this._weight;
  }

  get price(): number {
    return this._price;
  }

  get priceOut(): number {
    return this._priceOut;
  }

  get representation(): Representation {
    return this._representation;
  }

  get truckTypes(): TruckType[] {
    return this._truckTypes;
  }
}
