import Status from './Status';
import User from './User';

export default class OrderStatus {
  private _status?: Status;
  private _date: Date;
  private _time: Date;
  private _observation: string;
  private _current: boolean;
  private _author?: User;

  constructor(
    status = undefined,
    date = new Date(),
    time = new Date(),
    observation = '',
    current = false,
    author = undefined,
  ) {
    this._status = status;
    this._date = date;
    this._time = time;
    this._observation = observation;
    this._current = current;
    this._author = author;
  }

  get status(): Status | undefined {
    return this._status;
  }

  get date(): Date {
    return this._date;
  }

  get time(): Date {
    return this._time;
  }

  get observation(): string {
    return this._observation;
  }

  get current(): boolean {
    return this._current;
  }

  get author(): User | undefined {
    return this._author;
  }
}
