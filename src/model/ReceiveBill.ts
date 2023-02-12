import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import FreightOrder from './FreightOrder';
import PaymentForm from './PaymentForm';
import Representation from './Representation';
import SalesOrder from './SalesOrder';
import User from './User';

interface IFields {
  id?: number; //
  date?: string; //
  initial?: string; //
  end?: string; //
  filter?: string; //
  due?: string; //
  comission?: number; //
  representation?: number; //
  situation?: number; //
  freight?: number;
  sale?: number;
  saleComissioned?: number;
  order?: string;
}

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
  private _receiveDate?: Date;
  private _amountReceived: number;
  private _pendency?: ReceiveBill;
  private _paymentForm?: PaymentForm;
  private _representation?: Representation;
  private _salesOrder?: SalesOrder;
  private _freightOrder?: FreightOrder;
  private _author: User;

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
    receiveDate: Date | undefined = undefined,
    amountReceived = 0,
    pendency = undefined,
    paymentForm = undefined,
    representation = undefined,
    salesOrder = undefined,
    freightOrder = undefined,
    author = new User(),
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

  get receiveDate(): Date | undefined {
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

  get author(): User {
    return this._author;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._bill <= 0 ||
      this._description.length === 0 ||
      this._payer.length === 0 ||
      this._amount <= 0 ||
      this._situation <= 0 ||
      this._author.id == 0
    )
      return -5;

    const parameters = [
      this._bill,
      this._date,
      this._description,
      this._payer,
      this._amount,
      this._comission,
      this._situation,
      this._dueDate,
      this._representation?.id,
      this._salesOrder?.id,
      this._freightOrder?.id,
      this._author.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'conta_receber',
        `con_rec_conta,con_rec_data,con_rec_descricao,con_rec_pagador,con_rec_valor,con_rec_comissao,
         con_rec_situacao,con_rec_vencimento,rep_id,ped_ven_id,ped_fre_id,usu_id`,
        '?,?,?,?,?,?,?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<ReceiveBill[]> {
    const bills: ReceiveBill[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('conta_receber');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('con_rec_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`);
        builder = builder.where('con_rec_descricao like ?');
      }

      if (fields.date) {
        parameters.push(fields.date);
        builder = builder.where('con_rec_data = ?').and('con_rec_data = ?');
      }

      if (fields.initial && fields.end) {
        parameters.push(fields.initial, fields.end);
        builder = builder
          .where('(con_rec_data >= ? AND con_rec_data <= ?)')
          .and('(con_rec_data >= ? AND con_rec_data <= ?)');
      }

      if (fields.due) {
        parameters.push(fields.due);
        builder = builder.where('con_rec_vencimento = ?').and('con_rec_vencimento = ?');
      }

      if (fields.situation) {
        parameters.push(fields.situation);
        builder = builder.where('con_rec_situacao = ?').and('con_rec_situacao = ?');
      }

      if (fields.comission) {
        parameters.push(fields.comission);
        builder = builder.where('con_rec_comissao = ?').and('con_rec_comissao = ?');
      }

      if (fields.representation) {
        parameters.push(fields.representation);
        builder = builder.where('rep_id = ?').and('rep_id = ?');
      }

      if (fields.freight) {
        parameters.push(fields.freight);
        builder = builder.where('ped_fre_id = ?').and('ped_fre_id = ?');
      }

      if (fields.sale) {
        parameters.push(fields.sale);
        builder = builder
          .where('con_rec_comissao = FALSE AND ped_ven_id = ?')
          .and('con_rec_comissao = FALSE AND ped_ven_id = ?');
      }

      if (fields.saleComissioned) {
        parameters.push(fields.saleComissioned);
        builder = builder
          .where('con_rec_comissao = TRUE AND rep_id IS NOT NULL AND ped_ven_id = ?')
          .and('con_rec_comissao = TRUE AND rep_id IS NOT NULL AND ped_ven_id = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const bill = new ReceiveBill();
      await bill.convertRow(row);
      bills.push(bill);
    }

    return bills;
  }

  async getNewBill(): Promise<number> {
    const query = new QueryBuilder()
      .select('MAX(con_rec_conta) AS CONTA')
      .from('conta_receber')
      .build();

    const rows = await Database.instance.select(query);

    const count = rows[0].CONTA ? rows[0].CONTA : 0;

    return count + 1;
  }

  async receive(
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
      .update('conta_receber')
      .set(
        'con_rec_valor_recebido = ?,con_rec_data_recebimento = ?,con_rec_situacao = ?,con_rec_pendencia = ?,for_pag_id = ?',
      )
      .where('con_rec_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async reversal(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .update('conta_receber')
      .set(
        'con_rec_valor_recebido = null,con_rec_data_recebimento = null,con_rec_situacao = 1,con_rec_pendencia = null,for_pag_id = null',
      )
      .where('con_rec_id = ?')
      .build();

    const result = await Database.instance.update(query, [this._id]);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('conta_receber')
      .where('con_rec_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  private async convertRow(row: any): Promise<void> {
    this._id = row.con_rec_id;
    this._bill = row.con_rec_conta;
    this._date = new Date(row.con_rec_data);
    this._description = row.con_rec_descricao;
    this._payer = row.con_rec_pagador;
    this._amount = row.con_rec_valor;
    this._comission = row.con_rec_comissao;
    this._situation = row.con_rec_situacao;
    this._dueDate = new Date(row.con_rec_vencimento);
    if (row.con_rec_data_recebimento)
      this._receiveDate = new Date(row.con_rec_data_recebimento);
    if (row.con_rec_valor_recebido) this._amountReceived = row.con_rec_valor_recebido;
    if (row.con_rec_pendencia)
      this._pendency = (await this.get({ id: row.con_rec_pendencia }))[0];
    if (row.for_pag_id)
      this._paymentForm = (await new PaymentForm().get({ id: row.for_pag_id }))[0];
    if (row.rep_id)
      this._representation = (await new Representation().get({ id: row.rep_id }))[0];
    if (row.ped_ven_id)
      this._salesOrder = (await new SalesOrder().get({ id: row.ped_ven_id }))[0];
    if (row.ped_fre_id)
      this._freightOrder = (await new FreightOrder().get({ id: row.ped_fre_id }))[0];
    this._author = (await new User().get({ id: row.usu_id }))[0];
  }
}
