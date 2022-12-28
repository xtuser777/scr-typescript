export default class TruckType {
  private _id: number;
  private _description: string;
  private _axes: number;
  private _capacity: number;

  constructor(id = 0, description = '', axes = 0, capacity = 0) {
    this._id = id;
    this._description = description;
    this._axes = axes;
    this._capacity = capacity;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get axes(): number {
    return this._axes;
  }

  get capacity(): number {
    return this._capacity;
  }
}
