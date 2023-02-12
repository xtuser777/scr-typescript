import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Product from './Product';

interface IFields {
  order?: number;
  product?: number;
  orderBy?: string;
}

export default class FreightOrderItem {
  private _product?: Product;
  private _quantity: number;
  private _weight: number;

  constructor(product = undefined, quantity = 0, weight = 0) {
    this._product = product;
    this._quantity = quantity;
    this._weight = weight;
  }

  get product(): Product | undefined {
    return this._product;
  }

  get quantity(): number {
    return this._quantity;
  }

  get weight(): number {
    return this._weight;
  }

  async save(order: number): Promise<number> {
    if (
      order <= 0 ||
      this._product?.id === null ||
      this._quantity <= 0 ||
      this._weight <= 0
    )
      return -5;

    const parameters = [order, this._product?.id, this._quantity, this._weight];

    const query = new QueryBuilder()
      .insert(
        'pedido_frete_produto',
        'ped_fre_id, pro_id, ped_fre_pro_quantidade, ped_fre_pro_peso',
        '?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields: IFields): Promise<FreightOrderItem[]> {
    const items: FreightOrderItem[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('pedido_frete_produto');

    if (fields) {
      if (fields.order) {
        parameters.push(fields.order);
        builder = builder.where('ped_fre_id = ?');
      }

      if (fields.product) {
        parameters.push(fields.product);
        builder = builder.where('pro_id = ?').and('pro_id = ?');
      }

      if (fields.orderBy) {
        builder = builder.orderBy(fields.orderBy);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const item = new FreightOrderItem();
      await item.convertRow(row);
      items.push(item);
    }

    return items;
  }

  async delete(order: number, product: number): Promise<number> {
    if (order <= 0 && product <= 0) return -5;

    const query = new QueryBuilder()
      .delete('pedido_frete_produto')
      .where('ped_fre_id = ?')
      .and('pro_id = ?')
      .build();

    const result = await Database.instance.delete(query, [order, product]);

    return result;
  }

  private async convertRow(row: any): Promise<void> {
    this._product = (await new Product().get({ id: row.ped_fre_id }))[0];
    this._quantity = row.ped_fre_pro_quantidade;
    this._weight = row.ped_fre_pro_peso;
  }
}
