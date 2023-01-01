import Product from './Product';

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
}
