import FreightBudget from './FreightBudget';
import Product from './Product';

export default class FreightBudgetItem {
  private _budget;
  private _product;
  private _quantity;
  private _weight;

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
}
