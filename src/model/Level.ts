export default class Level {
  private _id: number;
  private _description: string;

  constructor(id = 0, description = '') {
    this._id = id;
    this._description = description;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }
}
