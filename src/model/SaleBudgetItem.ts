import Product from './Product';
import SaleBudget from './SaleBudget';

export default class SaleBudgetItem {
  private _budget: SaleBudget;
  private _product: Product;
  private _quantity: number;
  private _weight: number;

  constructor(
    budget = new SaleBudget(),
    product = new Product(),
    quantity = 0,
    weight = 0,
  ) {
    this._budget = budget;
    this._product = product;
    this._quantity = quantity;
    this._weight = weight;
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
}
