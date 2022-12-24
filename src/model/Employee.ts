import PhysicalPerson from './PhysicalPerson';

export default class Employee {
  private _id: number;
  private _type: number;
  private _admission: Date;
  private _demission: Date;
  private _person: PhysicalPerson;

  constructor(
    id = 0,
    type = 0,
    admission = new Date(),
    demission = new Date(),
    person = new PhysicalPerson(),
  ) {
    this._id = id;
    this._type = type;
    this._admission = admission;
    this._demission = demission;
    this._person = person;
  }

  get id(): number {
    return this._id;
  }

  get type(): number {
    return this._type;
  }

  get admission(): Date {
    return this._admission;
  }

  get demission(): Date {
    return this._demission;
  }

  get person(): PhysicalPerson {
    return this._person;
  }
}
