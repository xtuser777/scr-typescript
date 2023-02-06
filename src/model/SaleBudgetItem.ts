import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Product from './Product';
import SaleBudget from './SaleBudget';

interface IFields {
  budget?: number;
  product?: number;
}

export default class SaleBudgetItem {
  private _budget: SaleBudget;
  private _product: Product;
  private _quantity: number;
  private _weight: number;
  private _price: number;

  constructor(
    budget = new SaleBudget(),
    product = new Product(),
    quantity = 0,
    weight = 0,
    price = 0,
  ) {
    this._budget = budget;
    this._product = product;
    this._quantity = quantity;
    this._weight = weight;
    this._price = price;
  }

  get budget(): SaleBudget {
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

  get price(): number {
    return this._price;
  }

  async save(): Promise<number> {
    if (
      this._budget.id == 0 ||
      this._product.id == 0 ||
      this._quantity <= 0 ||
      this._price <= 0 ||
      this._weight <= 0
    )
      return -5;

    const parameters = [
      this._budget.id,
      this._product.id,
      this._quantity,
      this._price,
      this._weight,
    ];

    const query = new QueryBuilder()
      .insert(
        'orcamento_venda_produto',
        'orc_ven_id,pro_id,orc_ven_pro_quantidade,orc_ven_pro_valor,orc_ven_pro_peso',
        '?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields: IFields): Promise<SaleBudgetItem[]> {
    const budgets: SaleBudgetItem[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        'orc_ven_id, pro_id, orc_ven_pro_quantidade, orc_ven_pro_valor, orc_ven_pro_peso',
      )
      .from('orcamento_venda_produto');

    if (fields) {
      if (fields.budget && fields.product) {
        parameters.push(fields.budget, fields.product);
        builder = builder.where('orc_ven_id = ?').and('pro_id = ?');
      }

      if (fields.budget) {
        parameters.push(fields.budget);
        builder = builder.where('orc_ven_id = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      budgets.push(
        new SaleBudgetItem(
          (await new SaleBudget().get({ id: row.orc_ven_id }))[0],
          (await new Product().get({ id: row.pro_id }))[0],
          row.orc_ven_pro_quantidade,
          row.orc_ven_pro_peso,
          row.orc_ven_pro_valor,
        ),
      );
    }

    return budgets;
  }

  async update(): Promise<number> {
    if (
      this._budget.id == 0 ||
      this._product.id == 0 ||
      this._quantity <= 0 ||
      this._price <= 0 ||
      this._weight <= 0
    )
      return -5;

    const parameters = [
      this._quantity,
      this._price,
      this._weight,
      this._budget.id,
      this._product.id,
    ];

    const query = new QueryBuilder()
      .update('orcamento_venda_produto')
      .set('orc_ven_pro_quantidade = ?,orc_ven_pro_valor = ?,orc_ven_pro_peso = ?')
      .where('orc_ven_id = ?')
      .and('pro_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._budget.id == 0 || this._product.id == 0) return -5;

    const query = new QueryBuilder()
      .delete('orcamento_venda_produto')
      .where('orc_ven_id = ?')
      .and('pro_id = ?')
      .build();

    const result = await Database.instance.delete(query, [
      this._budget.id,
      this._product.id,
    ]);

    return result;
  }
}
