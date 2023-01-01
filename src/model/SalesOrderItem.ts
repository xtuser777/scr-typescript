import Product from './Product';

export default class SalesOrderItem {
  private _product?: Product;
  private _quantity: number;
  private _price: number;
  private _weight: number;

  constructor(product = undefined, quantity = 0, price = 0, weight = 0) {
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
}
