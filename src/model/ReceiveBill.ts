import FreightOrder from './FreightOrder';
import PaymentForm from './PaymentForm';
import Representation from './Representation';
import SalesOrder from './SalesOrder';
import User from './User';

export default class ReceiveBill {
  private _id: number;
  private _date: Date;
  private _bill: number;
  private _description: string;
  private _payer: string;
  private _amount: number;
  private _comission: boolean;
  private _situation: number;
  private _dueDate: Date;
  private _receiveDate: Date;
  private _amountReceived: number;
  private _pendency?: ReceiveBill;
  private _paymentForm?: PaymentForm;
  private _representation?: Representation;
  private _salesOrder?: SalesOrder;
  private _freightOrder?: FreightOrder;
  private _author?: User;

  constructor(
    id = 0,
    date = new Date(),
    bill = 0,
    description = '',
    payer = '',
    amount = 0,
    comission = false,
    situation = 0,
    dueDate = new Date(),
    receiveDate = new Date(),
    amountReceived = 0,
    pendency = undefined,
    paymentForm = undefined,
    representation = undefined,
    salesOrder = undefined,
    freightOrder = undefined,
    author = undefined,
  ) {
    this._id = id;
    this._date = date;
    this._bill = bill;
    this._description = description;
    this._payer = payer;
    this._amount = amount;
    this._comission = comission;
    this._situation = situation;
    this._dueDate = dueDate;
    this._receiveDate = receiveDate;
    this._amountReceived = amountReceived;
    this._pendency = pendency;
    this._paymentForm = paymentForm;
    this._representation = representation;
    this._salesOrder = salesOrder;
    this._freightOrder = freightOrder;
    this._author = author;
  }

  get id(): number {
    return this._id;
  }

  get date(): Date {
    return this._date;
  }

  get bill(): number {
    return this._bill;
  }

  get description(): string {
    return this._description;
  }

  get payer(): string {
    return this._payer;
  }

  get amount(): number {
    return this._amount;
  }

  get isComission(): boolean {
    return this._comission;
  }

  get situation(): number {
    return this._situation;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  get receiveDate(): Date {
    return this._receiveDate;
  }

  get amountReceived(): number {
    return this._amountReceived;
  }

  get pendency(): ReceiveBill | undefined {
    return this._pendency;
  }

  get paymentForm(): PaymentForm | undefined {
    return this._paymentForm;
  }

  get representation(): Representation | undefined {
    return this._representation;
  }

  get salesOrder(): SalesOrder | undefined {
    return this._salesOrder;
  }

  get freightOrder(): FreightOrder | undefined {
    return this._freightOrder;
  }

  get author(): User | undefined {
    return this._author;
  }
}
