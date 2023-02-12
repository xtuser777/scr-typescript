import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Product from './Product';

interface IFields {
  order?: number;
  product?: number;
}

export default class SalesOrderItem {
  private _product: Product;
  private _quantity: number;
  private _price: number;
  private _weight: number;

  constructor(product = new Product(), quantity = 0, price = 0, weight = 0) {
    this._product = product;
    this._quantity = quantity;
    this._price = price;
    this._weight = weight;
  }

  get product(): Product | undefined {
    return this._product;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }

  get weight(): number {
    return this._weight;
  }

  async save(order: number): Promise<number> {
    if (
      order <= 0 ||
      this.product?.id == 0 ||
      this._quantity <= 0 ||
      this._price <= 0 ||
      this._weight <= 0
    )
      return -5;

    const parameters = [
      order,
      this.product?.id,
      this._quantity,
      this._price,
      this._weight,
    ];

    const query = new QueryBuilder()
      .insert(
        'pedido_venda_produto',
        `ped_ven_id,pro_id,ped_ven_pro_quantidade,ped_ven_pro_valor,ped_ven_pro_peso`,
        '?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields: IFields): Promise<SalesOrderItem[]> {
    const items: SalesOrderItem[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('pedido_venda_produto');

    if (fields) {
      if (fields.order && fields.product) {
        parameters.push(fields.order, fields.product);
        builder = builder.where('ped_ven_id = ?').and('pro_id = ?');
      }

      if (fields.order) {
        parameters.push(fields.order);
        builder = builder.where('ped_ven_id = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      new SalesOrderItem(
        (await new Product().get({ id: row.pro_id }))[0],
        row.ped_ven_pro_quantidade,
        row.ped_ven_pro_valor,
        row.ped_ven_pro_peso,
      );
    }

    return items;
  }

  async delete(order: number): Promise<number> {
    if (order <= 0 && this._product.id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('pedido_venda_produto')
      .where('ped_ven_id = ?')
      .and('pro_id = ?')
      .build();

    const result = await Database.instance.delete(query, [order, this._product.id]);

    return result;
  }
}
