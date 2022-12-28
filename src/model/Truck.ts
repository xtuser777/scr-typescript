import Proprietary from './Proprietary';
import TruckType from './TruckType';

export default class Truck {
  private _id: number;
  private _plate: string;
  private _brand: string;
  private _model: string;
  private _color: string;
  private _manufactureYear: number;
  private _modelYear: number;
  private _type: TruckType;
  private _proprietary: Proprietary;

  constructor(
    id = 0,
    plate = '',
    brand = '',
    model = '',
    color = '',
    manufactureYear = 0,
    modelYear = 0,
    type = new TruckType(),
    proprietary = new Proprietary(),
  ) {
    this._id = id;
    this._plate = plate;
    this._brand = brand;
    this._model = model;
    this._color = color;
    this._manufactureYear = manufactureYear;
    this._modelYear = modelYear;
    this._type = type;
    this._proprietary = proprietary;
  }

  get id(): number {
    return this._id;
  }

  get plate(): string {
    return this._plate;
  }

  get brand(): string {
    return this._brand;
  }

  get model(): string {
    return this._model;
  }

  get color(): string {
    return this._color;
  }

  get manufactureYear(): number {
    return this._manufactureYear;
  }

  get modelYear(): number {
    return this._modelYear;
  }

  get type(): TruckType {
    return this._type;
  }

  get proprietary(): Proprietary {
    return this._proprietary;
  }
}
