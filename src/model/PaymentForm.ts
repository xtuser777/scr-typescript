export default class PaymentForm {
  private _id: number;
  private _description: string;
  private _link: number;
  private _deadline: number;

  constructor(id = 0, description = '', link = 0, deadline = 0) {
    this._id = id;
    this._description = description;
    this._link = link;
    this._deadline = deadline;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get link(): number {
    return this._link;
  }

  get deadline(): number {
    return this._deadline;
  }
}
