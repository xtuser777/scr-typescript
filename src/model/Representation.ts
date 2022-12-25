import LegalPerson from './LegalPerson';

export default class Representation {
  private _id: number;
  private _register: string;
  private _unity: string;
  private _person: LegalPerson;

  constructor(id = 0, register = '', unity = '', person = new LegalPerson()) {
    this._id = id;
    this._register = register;
    this._unity = unity;
    this._person = person;
  }

  get id(): number {
    return this._id;
  }

  get register(): string {
    return this._register;
  }

  get unity(): string {
    return this._unity;
  }

  get person(): LegalPerson {
    return this._person;
  }
}
