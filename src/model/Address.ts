import City from './City';

export default class Address {
  private _id: number;
  private _street: string;
  private _number: number;
  private _neighborhood: string;
  private _complement: string;
  private _code: string;
  private _city: City;

  constructor(
    id = 0,
    street = '',
    number = 0,
    neighborhood = '',
    complement = '',
    code = '',
    city = new City(),
  ) {
    this._id = id;
    this._street = street;
    this._number = number;
    this._neighborhood = neighborhood;
    this._complement = complement;
    this._code = code;
    this._city = city;
  }

  get id(): number {
    return this._id;
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }

  get complement(): string {
    return this._complement;
  }

  get code(): string {
    return this._code;
  }

  get city(): City {
    return this._city;
  }
}
