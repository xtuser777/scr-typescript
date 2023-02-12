import { addAbortSignal } from 'stream';
import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import BillPayCategory from './BillPayCategory';
import Driver from './Driver';
import Employee from './Employee';
import FreightOrder from './FreightOrder';
import PaymentForm from './PaymentForm';
import SalesOrder from './SalesOrder';
import User from './User';

interface IFields {
  id?: number;
  bill?: number;
  initial?: string;
  end?: string;
  filter?: string;
  dueDate?: string;
  comission?: number;
  situation?: number;
  salesman?: number;
  freight?: number;
  saleComissioned?: number;
  orderBy?: string;
}

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
  private _paymentDate?: Date;
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
    paymentDate: Date | undefined = undefined,
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

  get paymentDate(): Date | undefined {
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

  async getNewBill(): Promise<number> {
    const query = new QueryBuilder()
      .select('MAX(con_pag_conta) AS CONTA')
      .from('conta_pagar')
      .build();

    const result = await Database.instance.select(query);

    const bill = result[0].CONTA ? result[0].CONTA : 0;

    return bill + 1;
  }

  async getRelationsByPF(form: number): Promise<number> {
    if (form <= 0) return -5;

    const query = new QueryBuilder()
      .select('COUNT(con_pag_id) as FORMAS')
      .from('conta_pagar')
      .where('for_pag_id = ?')
      .build();

    const result = await Database.instance.select(query, [form]);

    const forms: number = result[0].FORMAS ? result[0].FORMAS : 0;

    return forms;
  }

  async save(): Promise<number> {
    if (
      this._id !== 0 ||
      this._bill <= 0 ||
      this._description.length === 0 ||
      this._enterprise.length === 0 ||
      this._installment <= 0 ||
      this._amount <= 0 ||
      this._situation === 0 ||
      !this._category ||
      !this._author
    )
      return -5;

    const parameters = [
      this._bill,
      this._date,
      this._type,
      this._description,
      this._enterprise,
      this._installment,
      this._amount,
      this._comission,
      this._dueDate,
      this._situation,
      this._driver?.id,
      this._salesman?.id,
      this._category.id,
      this._freightOrder?.id,
      this._salesOrder?.id,
      this._author.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'conta_pagar',
        `con_pag_conta,con_pag_data,con_pag_tipo,con_pag_descricao,con_pag_empresa,con_pag_parcela,
         con_pag_valor,con_pag_comissao,con_pag_vencimento,con_pag_situacao,mot_id,fun_id,cat_con_pag_id,
         ped_fre_id,ped_ven_id,usu_id`,
        '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<BillPay[]> {
    const bills: BillPay[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('conta_pagar');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('con_pag_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`);
        builder = builder.where('con_pag_descricao like ?');
      }

      if (fields.initial && fields.end) {
        parameters.push(fields.initial, fields.end);
        builder = builder
          .where('(con_pag_data >= ? AND con_pag_data <= ?)')
          .and('(con_pag_data >= ? AND con_pag_data <= ?)');
      }

      if (fields.dueDate) {
        parameters.push(fields.dueDate);
        builder = builder.where('con_pag_vencimento = ?').and('con_pag_vencimento = ?');
      }

      if (fields.bill) {
        parameters.push(fields.bill);
        builder = builder.where('con_pag_conta = ?').and('con_pag_conta = ?');
      }

      if (fields.situation) {
        parameters.push(fields.situation);
        builder = builder.where('con_pag_situacao = ?').and('con_pag_situacao = ?');
      }

      if (fields.comission) {
        parameters.push(fields.comission);
        builder = builder.where('con_pag_comissao = ?').and('con_pag_comissao = ?');
      }

      if (fields.salesman) {
        parameters.push(fields.salesman);
        builder = builder.where('fun_id = ?').and('fun_id = ?');
      }

      if (fields.freight) {
        parameters.push(fields.freight);
        builder = builder.where('ped_fre_id = ?').and('ped_fre_id = ?');
      }

      if (fields.saleComissioned) {
        parameters.push(fields.saleComissioned);
        builder = builder
          .where('con_pag_comissao = TRUE AND ped_ven_id = ?')
          .and('con_pag_comissao = TRUE AND ped_ven_id = ?');
      }

      if (fields.orderBy) builder = builder.orderBy(fields.orderBy);
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const bill = new BillPay();
      await bill.convertRow(row);
      bills.push(bill);
    }

    return bills;
  }

  async payOff(
    form: number,
    amount: number,
    date: string,
    situation: number,
    pendency: number,
  ): Promise<number> {
    if (
      this._id <= 0 ||
      amount <= 0 ||
      date.length === 0 ||
      situation === 0 ||
      form === 0
    )
      return -5;

    const parameters = [
      amount,
      date,
      situation,
      pendency > 0 ? pendency : null,
      form,
      this._id,
    ];

    const query = new QueryBuilder()
      .update('conta_pagar')
      .set(
        'con_pag_valor_pago = ?,con_pag_data_pagamento = ?,con_pag_situacao = ?,con_pag_pendencia = ?,for_pag_id = ?',
      )
      .where('con_pag_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async reversal(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .update('conta_receber')
      .set(
        'con_pag_valor_pago = null,con_pag_data_pagamento = null,con_pag_situacao = 1,con_pag_pendencia = null,for_pag_id = null',
      )
      .where('con_pag_id = ?')
      .build();

    const result = await Database.instance.update(query, [this._id]);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('conta_pagar')
      .where('con_pag_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  private async convertRow(row: any): Promise<void> {
    this._id = row.con_pag_id;
    this._bill = row.con_pag_conta;
    this._date = new Date(row.con_pag_data);
    this._type = row.con_pag_tipo;
    this._description = row.con_pag_descricao;
    this._enterprise = row.con_pag_empresa;
    this._installment = row.con_pag_parcela;
    this._amount = row.con_pag_valor;
    this._comission = row.con_pag_comissao;
    this._situation = row.con_pag_situacao;
    this._dueDate = new Date(row.con_pag_vencimento);
    this._paymentDate = row.con_pag_data_pagamento
      ? new Date(row.con_pag_data_pagamento)
      : undefined;
    this._amountPaid = row.con_pag_valor_pago ? row.con_pag_valor_pago : 0.0;
    this._pendency = row.con_pag_pendencia
      ? (await this.get({ id: row.con_pag_pendencia }))[0]
      : undefined;
    this._paymentForm = row.for_pag_id
      ? (await new PaymentForm().get({ id: row.for_pag_id }))[0]
      : undefined;
    this._driver = row.mot_id
      ? (await new Driver().get({ id: row.mot_id }))[0]
      : undefined;
    this._salesman = row.fun_id
      ? (await new Employee().get({ id: row.fun_id }))[0]
      : undefined;
    this._category = (await new BillPayCategory().get({ id: row.cat_con_pag_id }))[0];
    this._freightOrder = row.ped_fre_id
      ? (await new FreightOrder().get({ id: row.ped_fre_id }))[0]
      : undefined;
    this._salesOrder = row.ped_ven_id
      ? (await new SalesOrder().get({ id: row.ped_ven_id }))[0]
      : undefined;
    this._author = (await new User().get({ id: row.usu_id }))[0];
  }
}
