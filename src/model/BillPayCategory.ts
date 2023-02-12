import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';

interface IFields {
  id?: number;
  filter?: string;
  orderBy?: string;
}

export default class BillPayCategory {
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

  async save(): Promise<number> {
    if (this._id != 0 || this._description.length == 0) return -5;

    const query = new QueryBuilder()
      .insert('categoria_conta_pagar', 'cat_con_pag_descricao', '?')
      .build();

    const result = await Database.instance.insert(query, [this._description]);

    return result;
  }

  async get(fields?: IFields): Promise<BillPayCategory[]> {
    const categories: BillPayCategory[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('categoria_conta_pagar');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('cat_con_pag_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`);
        builder = builder
          .where('cat_con_pag_descricao LIKE ?')
          .and('cat_con_pag_descricao LIKE ?');
      }

      if (fields.orderBy) builder = builder.orderBy(fields.orderBy);
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const category = new BillPayCategory();
      category.convertRow(row);
      categories.push(category);
    }

    return categories;
  }

  async update(): Promise<number> {
    if (this._id <= 0 || this._description.length == 0) return -5;

    const query = new QueryBuilder()
      .update('categoris_conta_pagar')
      .set('cat_con_pag_descricao = ?')
      .where('cat_con_pag_id = ?')
      .build();

    const result = await Database.instance.update(query, [this._description, this._id]);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('categoria_conta_pagar')
      .where('cat_con_pag_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  private convertRow(row: any): void {
    this._id = row.cat_con_pag_id;
    this._description = row.cat_con_pag_descricao;
  }
}
