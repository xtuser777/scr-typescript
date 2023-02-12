import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';

interface IFields {
  id?: number;
  filter?: string;
  link?: number;
  order?: string;
}

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

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._description.length <= 0 ||
      this._link <= 0 ||
      this._deadline <= 0
    )
      return -5;

    const parameters = [this._description, this._link, this._deadline];

    const query = new QueryBuilder()
      .insert(
        'forma_pagamento',
        'for_pag_descricao, for_pag_vinculo, for_pag_prazo',
        '?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<PaymentForm[]> {
    const forms: PaymentForm[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select('for_pag_id, for_pag_descricao, for_pag_vinculo, for_pag_prazo')
      .from('forma_pagamento');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('for_pag_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`);
        builder = builder.where('for_pag_descricao like ?');
      }

      if (fields.link) {
        parameters.push(fields.link);
        builder = builder.where('for_pag_vinculo = ?').and('for_pag_vinculo = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const form = new PaymentForm();
      form.convertRow(row);
      forms.push(form);
    }

    return forms;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._description.length <= 0 ||
      this._link <= 0 ||
      this._deadline <= 0
    )
      return -5;

    const parameters = [this._description, this._link, this._deadline, this._id];

    const query = new QueryBuilder()
      .update('forma_pagamento')
      .set('for_pag_descricao = ?, for_pag_vinculo = ?, for_pag_prazo = ?')
      .where('for_pag_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('forma_pagamento')
      .where('for_pag_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  private convertRow(row: any): void {
    this._id = row.for_pag_id;
    this._description = row.for_pag_descricao;
    this._link = row.for_pag_vinculo;
    this._deadline = row.for_pag_prazo;
  }
}
