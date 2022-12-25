import BankData from './BankData';
import PhysicalPerson from './PhysicalPerson';

export default class Driver {
  private _id: number;
  private _register: string;
  private _cnh: string;
  private _person: PhysicalPerson;
  private _bankData: BankData;

  constructor(
    id = 0,
    register = '',
    cnh = '',
    person = new PhysicalPerson(),
    bankData = new BankData(),
  ) {
    this._id = id;
    this._register = register;
    this._cnh = cnh;
    this._person = person;
    this._bankData = bankData;
  }

  get id(): number {
    return this._id;
  }

  get register(): string {
    return this._register;
  }

  get cnh(): string {
    return this._cnh;
  }

  get person(): PhysicalPerson {
    return this._person;
  }

  get bankData(): BankData {
    return this._bankData;
  }
}
