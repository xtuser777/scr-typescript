import LegalPerson from './LegalPerson';

export default class Parameterization {
  private _id: number;
  private _logotype: string;
  private _person: LegalPerson;

  constructor(id = 0, logotype = '', person = new LegalPerson()) {
    this._id = id;
    this._logotype = logotype;
    this._person = person;
  }

  get id(): number {
    return this._id;
  }

  get logotype(): string {
    return this._logotype;
  }

  get person(): LegalPerson {
    return this._person;
  }
}
