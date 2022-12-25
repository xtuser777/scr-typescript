export default class BankData {
  private _id: number;
  private _bank: string;
  private _agency: string;
  private _acount: string;
  private _type: number;

  constructor(id = 0, bank = '', agency = '', acount = '', type = 0) {
    this._id = id;
    this._bank = bank;
    this._agency = agency;
    this._acount = acount;
    this._type = type;
  }

  get id(): number {
    return this._id;
  }

  get bank(): string {
    return this._bank;
  }

  get agency(): string {
    return this._agency;
  }

  get acount(): string {
    return this._acount;
  }

  get type(): number {
    return this._type;
  }
}
