import Employee from './Employee';
import Level from './Level';

export default class User {
  private _id: number;
  private _login: string;
  private _password: string;
  private _active: boolean;
  private _employee: Employee;
  private _level: Level;

  constructor(
    id = 0,
    login = '',
    password = '',
    active = false,
    employee = new Employee(),
    level = new Level(),
  ) {
    this._id = id;
    this._login = login;
    this._password = password;
    this._active = active;
    this._employee = employee;
    this._level = level;
  }

  get id(): number {
    return this._id;
  }

  get login(): string {
    return this._login;
  }

  get password(): string {
    return this._password;
  }

  get active(): boolean {
    return this._active;
  }

  get employee(): Employee {
    return this._employee;
  }

  get level(): Level {
    return this._level;
  }
}
