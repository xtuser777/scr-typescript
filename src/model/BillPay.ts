import BillPayCategory from './BillPayCategory';
import Driver from './Driver';
import Employee from './Employee';
import FreightOrder from './FreightOrder';
import PaymentForm from './PaymentForm';
import SalesOrder from './SalesOrder';
import User from './User';

export default class BillPay {
  private _id: number;
  private _bill: number;
  private _date: Date;
  private _type: number;
  private _description: string;
  private _enterprise: string;
  private _installment: number;
  private _amount: number;
  private _comission: boolean;
  private _situation: number;
  private _dueDate: Date;
  private _paymentDate: Date;
  private _amountPaid: number;
  private _pendency?: BillPay;
  private _paymentForm?: PaymentForm;
  private _driver?: Driver;
  private _salesman?: Employee;
  private _category?: BillPayCategory;
  private _freightOrder?: FreightOrder;
  private _salesOrder?: SalesOrder;
  private _author?: User;

  constructor(
    id = 0,
    bill = 0,
    date = new Date(),
    type = 0,
    description = '',
    enterprise = '',
    installment = 0,
    amount = 0,
    comission = false,
    situation = 0,
    dueDate = new Date(),
    paymentDate = new Date(),
    amountPaid = 0,
    pendency = undefined,
    paymentForm = undefined,
    driver = undefined,
    salesman = undefined,
    category = undefined,
    freightOrder = undefined,
    salesOrder = undefined,
    author = undefined,
  ) {
    this._id = id;
    this._bill = bill;
    this._date = date;
    this._type = type;
    this._description = description;
    this._enterprise = enterprise;
    this._installment = installment;
    this._amount = amount;
    this._comission = comission;
    this._situation = situation;
    this._dueDate = dueDate;
    this._paymentDate = paymentDate;
    this._amountPaid = amountPaid;
    this._pendency = pendency;
    this._paymentForm = paymentForm;
    this._driver = driver;
    this._salesman = salesman;
    this._category = category;
    this._freightOrder = freightOrder;
    this._salesOrder = salesOrder;
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

  get type(): number {
    return this._type;
  }

  get description(): string {
    return this._description;
  }

  get enterprise(): string {
    return this._enterprise;
  }

  get installment(): number {
    return this._installment;
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

  get paymentDate(): Date {
    return this._paymentDate;
  }

  get amountPaid(): number {
    return this._amountPaid;
  }

  get pendency(): BillPay | undefined {
    return this._pendency;
  }

  get paymentForm(): PaymentForm | undefined {
    return this._paymentForm;
  }

  get driver(): Driver | undefined {
    return this._driver;
  }

  get salesman(): Employee | undefined {
    return this._salesman;
  }

  get category(): BillPayCategory | undefined {
    return this._category;
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
