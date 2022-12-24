export default class State {
  private _id: number;
  private _name: string;
  private _acronym: string;

  constructor(id = 0, name = '', acronym = '') {
    this._id = id;
    this._name = name;
    this._acronym = acronym;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get acronym(): string {
    return this._acronym;
  }
}
