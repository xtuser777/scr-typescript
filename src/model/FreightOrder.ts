import City from './City';
import Client from './Client';
import Driver from './Driver';
import FreightBudget from './FreightBudget';
import PaymentForm from './PaymentForm';
import Proprietary from './Proprietary';
import Representation from './Representation';
import SalesOrder from './SalesOrder';
import Truck from './Truck';
import TruckType from './TruckType';
import User from './User';

export default class FreightOrder {
  private _id: number;
  private _date: Date;
  private _description: string;
  private _distance: number;
  private _weight: number;
  private _value: number;
  private _driverValue: number;
  private _driverEntry: number;
  private _shipping: string;
  private _budget?: FreightBudget;
  private _order?: SalesOrder;
  private _representation?: Representation;
  private _client?: Client;
  private _destiny?: City;
  private _truckType?: TruckType;
  private _proprietary?: Proprietary;
  private _driver?: Driver;
  private _truck?: Truck;
  //private _status?: SalesOrderStatus;
  private _paymentFormFreight?: PaymentForm;
  private _paymentFormDriver?: PaymentForm;
  private _author?: User;
  private _items: FreightOrderItem[];
  private _steps: LoadStep;
}
