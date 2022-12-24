import Address from './Address';

export default class Contact {
  private _id: number;
  private _phone: string;
  private _cellphone: string;
  private _email: string;
  private _address: Address;

  constructor(id = 0, phone = '', cellphone = '', email = '', address = new Address()) {
    this._id = id;
    this._phone = phone;
    this._cellphone = cellphone;
    this._email = email;
    this._address = address;
  }

  get id(): number {
    return this._id;
  }

  get phone(): string {
    return this._phone;
  }

  get cellphone(): string {
    return this._cellphone;
  }

  get email(): string {
    return this._email;
  }

  get address(): Address {
    return this._address;
  }
}
