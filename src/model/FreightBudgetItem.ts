import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import FreightBudget from './FreightBudget';
import Product from './Product';

interface IFields {
  budget?: number;
  product?: number;
}

export default class FreightBudgetItem {
  private _budget: FreightBudget;
  private _product: Product;
  private _quantity: number;
  private _weight: number;

  constructor(
    budget = new FreightBudget(),
    product = new Product(),
    quantity = 0,
    weight = 0,
  ) {
    this._budget = budget;
    this._product = product;
    this._quantity = quantity;
    this._weight = weight;
  }

  get budget(): FreightBudget {
    return this._budget;
  }

  get product(): Product {
    return this._product;
  }

  get quantity(): number {
    return this._quantity;
  }

  get weight(): number {
    return this._weight;
  }

  async save(): Promise<number> {
    if (
      this._budget.id == 0 ||
      this._product.id == 0 ||
      this._quantity <= 0 ||
      this._weight <= 0
    )
      return -5;

    const parameters = [this._budget.id, this._product.id, this._quantity, this._weight];

    const query = new QueryBuilder()
      .insert(
        'orcamento_frete_produto',
        'orc_fre_id,pro_id,orc_fre_pro_quantidade,orc_fre_pro_peso',
        '?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<FreightBudgetItem[]> {
    const items: FreightBudgetItem[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select('orc_fre_id, pro_id, orc_fre_pro_quantidade, orc_fre_pro_peso')
      .from('orcamento_frete_produto');

    if (fields) {
      if (fields.budget) {
        parameters.push(fields.budget);
        builder = builder.where('orc_fre_id = ?');
      }

      if (fields.product) {
        parameters.push(fields.product);
        builder = builder.where('pro_id = ?').and('pro_id = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      items.push(
        new FreightBudgetItem(
          (await new FreightBudget().get({ id: row.orc_fre_id }))[0],
          (await new Product().get({ id: row.pro_id }))[0],
          row.orc_fre_pro_quantidade,
          row.orc_fre_pro_peso,
        ),
      );
    }

    return items;
  }

  async update(): Promise<number> {
    if (
      this._budget.id == 0 ||
      this._product.id == 0 ||
      this._quantity <= 0 ||
      this._weight <= 0
    )
      return -5;

    const parameters = [this._quantity, this._weight, this._budget.id, this._product.id];

    const query = new QueryBuilder()
      .update('orcamento_frete_produto')
      .set('orc_fre_pro_quantidade = ?,orc_fre_pro_peso = ?')
      .where('orc_fre_id = ?')
      .and('pro_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._budget.id == 0 || this._product.id == 0) return -5;

    const query = new QueryBuilder()
      .delete('orcamento_frete_produto')
      .where('orc_fre_id = ?')
      .and('pro_id = ?')
      .build();

    const result = await Database.instance.delete(query, [
      this._budget.id,
      this._product.id,
    ]);

    return result;
  }
}
