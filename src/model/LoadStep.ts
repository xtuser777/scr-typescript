import Representation from './Representation';

export default class LoadStep {
  private _id: number;
  private _order: number;
  private _status: number;
  private _load: number;
  private _representation?: Representation;

  constructor(id = 0, order = 0, status = 0, load = 0, representation = undefined) {
    this._id = id;
    this._order = order;
    this._status = status;
    this._load = load;
    this._representation = representation;
  }

  get id(): number {
    return this._id;
  }

  get order(): number {
    return this._order;
  }

  get status(): number {
    return this._status;
  }

  get load(): number {
    return this._load;
  }

  get representation(): Representation | undefined {
    return this._representation;
  }
}
