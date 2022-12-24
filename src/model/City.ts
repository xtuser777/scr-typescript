import State from './State';

export default class City {
  private _id: number;
  private _name: string;
  private _state: State;

  constructor(id = 0, name = '', state = new State()) {
    this._id = id;
    this._name = name;
    this._state = state;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get static(): State {
    return this._state;
  }
}
