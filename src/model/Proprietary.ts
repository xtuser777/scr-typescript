import Driver from './Driver';
import LegalPerson from './LegalPerson';
import PhysicalPerson from './PhysicalPerson';

export default class Proprietary {
  private _id: number;
  private _register: string;
  private _type: number;
  private _driver: Driver;
  private _physicalPerson: PhysicalPerson;
  private _legalPerson: LegalPerson;

  constructor(
    id = 0,
    register = '',
    type = 0,
    driver = new Driver(),
    physicalPerson = new PhysicalPerson(),
    legalPerson = new LegalPerson(),
  ) {
    this._id = id;
    this._register = register;
    this._type = type;
    this._driver = driver;
    this._physicalPerson = physicalPerson;
    this._legalPerson = legalPerson;
  }

  get id(): number {
    return this._id;
  }

  get register(): string {
    return this._register;
  }

  get type(): number {
    return this._type;
  }

  get driver(): Driver {
    return this._driver;
  }

  get physicalPerson(): PhysicalPerson {
    return this._physicalPerson;
  }

  get legalPerson(): LegalPerson {
    return this._legalPerson;
  }
}
