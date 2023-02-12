import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import City from './City';
import Client from './Client';
import Driver from './Driver';
import FreightBudget from './FreightBudget';
import FreightOrderItem from './FreightOrderItem';
import LoadStep from './LoadStep';
import OrderStatus from './OrderStatus';
import PaymentForm from './PaymentForm';
import Proprietary from './Proprietary';
import Representation from './Representation';
import SalesOrder from './SalesOrder';
import Truck from './Truck';
import TruckType from './TruckType';
import User from './User';

interface IFields {
  id?: number;
  filter?: string;
  initial?: string;
  end?: string;
  price?: number;
  budget?: number;
  client?: number;
  status?: number;
  orderBy?: string;
}

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
  private _status?: OrderStatus;
  private _paymentFormFreight?: PaymentForm;
  private _paymentFormDriver?: PaymentForm;
  private _author?: User;
  private _items: FreightOrderItem[];
  private _steps: LoadStep[];

  constructor(
    id = 0,
    date = new Date(),
    description = '',
    distance = 0,
    weight = 0,
    value = 0,
    driverValue = 0,
    driverEntry = 0,
    shipping = '',
    budget = undefined,
    order = undefined,
    representation = undefined,
    client = undefined,
    destiny = undefined,
    truckType = undefined,
    proprietary = undefined,
    driver = undefined,
    truck = undefined,
    status = undefined,
    paymentFormFreight = undefined,
    paymentFormDriver = undefined,
    author = undefined,
    items = [],
    steps = [],
  ) {
    this._id = id;
    this._date = date;
    this._description = description;
    this._distance = distance;
    this._weight = weight;
    this._value = value;
    this._driverValue = driverValue;
    this._driverEntry = driverEntry;
    this._shipping = shipping;
    this._budget = budget;
    this._order = order;
    this._representation = representation;
    this._client = client;
    this._destiny = destiny;
    this._truckType = truckType;
    this._proprietary = proprietary;
    this._driver = driver;
    this._truck = truck;
    this._status = status;
    this._paymentFormFreight = paymentFormFreight;
    this._paymentFormDriver = paymentFormDriver;
    this._author = author;
    this._items = items;
    this._steps = steps;
  }

  get id(): number {
    return this._id;
  }

  get date(): Date {
    return this._date;
  }

  get description(): string {
    return this._description;
  }

  get distance(): number {
    return this._distance;
  }

  get weight(): number {
    return this._weight;
  }

  get value(): number {
    return this._value;
  }

  get driverValue(): number {
    return this._driverValue;
  }

  get driverEntry(): number {
    return this._driverEntry;
  }

  get shipping(): string {
    return this._shipping;
  }

  get budget(): FreightBudget | undefined {
    return this._budget;
  }

  get order(): SalesOrder | undefined {
    return this._order;
  }

  get representation(): Representation | undefined {
    return this._representation;
  }

  get client(): Client | undefined {
    return this._client;
  }

  get destiny(): City | undefined {
    return this._destiny;
  }

  get truckType(): TruckType | undefined {
    return this._truckType;
  }

  get proprietary(): Proprietary | undefined {
    return this._proprietary;
  }

  get driver(): Driver | undefined {
    return this._driver;
  }

  get truck(): Truck | undefined {
    return this._truck;
  }

  get status(): OrderStatus | undefined {
    return this._status;
  }

  get paymentFormFreight(): PaymentForm | undefined {
    return this._paymentFormFreight;
  }

  get paymentFormDriver(): PaymentForm | undefined {
    return this._paymentFormDriver;
  }

  get author(): User | undefined {
    return this._author;
  }

  get items(): FreightOrderItem[] {
    return this._items;
  }

  get steps(): LoadStep[] {
    return this._steps;
  }

  calculateMinimumFloor(km: number, axes: number): number {
    let floor = 0.0;

    if (km <= 0.0 || axes <= 0) return floor;

    switch (axes) {
      case 4:
        floor = km * 2.3041;
        break;
      case 5:
        floor = km * 2.7446;
        break;
      case 6:
        floor = km * 3.1938;
        break;
      case 7:
        floor = km * 3.3095;
        break;
      case 9:
        floor = km * 3.6542;
        break;
    }

    return floor;
  }

  async getRelationsByPF(form: number): Promise<number> {
    if (form <= 0) return -5;

    const query = new QueryBuilder()
      .select('COUNT(ped_fre_id) as FORMAS')
      .from('pedido_frete')
      .where('for_pag_fre = ?')
      .build();

    const rows = await Database.instance.select(query, [form]);

    return rows[0].FORMAS;
  }

  async getRelationsByDPF(form: number): Promise<number> {
    if (form <= 0) return -5;

    const query = new QueryBuilder()
      .select('COUNT(ped_fre_id) as FORMAS')
      .from('pedido_frete')
      .where('for_pag_mot = ?')
      .build();

    const rows = await Database.instance.select(query, [form]);

    return rows[0].FORMAS;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._description.length === 0 ||
      this._distance <= 0 ||
      this._weight <= 0 ||
      this._value <= 0 ||
      this._driverValue <= 0 ||
      this._shipping.length <= 0 ||
      !this._client ||
      !this._destiny ||
      !this._truckType ||
      !this._proprietary ||
      !this._driver ||
      !this._truck ||
      !this._paymentFormFreight ||
      !this._author
    )
      return -5;

    const parameters = [
      this._date,
      this._description,
      this._distance,
      this._weight,
      this._value,
      this._driverValue,
      this._driverEntry,
      this._shipping,
      this._budget?.id,
      this._order?.id,
      this._representation?.id,
      this._client.id,
      this._destiny.id,
      this._truckType.id,
      this._truck.id,
      this._proprietary.id,
      this._driver.id,
      this._paymentFormFreight.id,
      this._paymentFormDriver?.id,
      this._author.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'pedido_frete',
        `ped_fre_data,ped_fre_descricao,ped_fre_distancia,ped_fre_peso,ped_fre_valor,ped_fre_valor_motorista,
         ped_fre_entrada_motorista,ped_fre_entrega,orc_fre_id,ped_ven_id,rep_id,cli_id,cid_id,tip_cam_id,
         cam_id,prp_id,mot_id,for_pag_fre,for_pag_mot,usu_id`,
        '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<FreightOrder[]> {
    const orders: FreightOrder[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select('*')
      .from('pedido_frete pfr')
      .innerJoin('usuario autor')
      .on('autor.usu_id = pfr.usu_id')
      .innerJoin('funcionario autor_fun')
      .on('autor_fun.fun_id = autor.fun_id')
      .innerJoin('pessoa_fisica autor_pf')
      .on('autor_pf.pf_id = autor_fun.pf_id')
      .innerJoin('forma_pagamento fp')
      .on('fp.for_pag_id = pfr.for_pag_fre')
      .innerJoin('pedido_frete_status pfs')
      .on('pfr.ped_fre_id = pfs.ped_fre_id')
      .innerJoin('status st')
      .on('pfs.sts_id = st.sts_id');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('pfr.ped_fre_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`);
        builder = builder
          .where('pfr.ped_fre_descricao LIKE ?')
          .and('pfr.ped_fre_descricao LIKE ?');
      }

      if (fields.initial && fields.end) {
        parameters.push(fields.initial, fields.end);
        builder = builder
          .where('(pfr.ped_fre_data >= ? AND pfr.ped_fre_data <= ?)')
          .and('(pfr.ped_fre_data >= ? AND pfr.ped_fre_data <= ?)');
      }

      if (fields.price) {
        parameters.push(fields.price);
        builder = builder.where('pfr.ped_fre_valor = ?');
      }

      if (fields.budget) {
        parameters.push(fields.budget);
        builder = builder.where('pfr.orc_fre_id = ?');
      }

      if (fields.client) {
        parameters.push(fields.client);
        builder = builder.where('pfr.cli_id = ?');
      }

      if (fields.status) {
        parameters.push(fields.status);
        builder = builder
          .where('st.sts_id = ? AND pfs.ped_fre_sts_atual IS TRUE')
          .and('st.sts_id = ? AND pfs.ped_fre_sts_atual IS TRUE');
      }

      if (fields.orderBy) {
        builder = builder.orderBy(fields.orderBy);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const order = new FreightOrder();
      await order.convertRow(row);
      orders.push(order);
    }

    return orders;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('pedido_frete')
      .where('ped_fre_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  private async convertRow(row: any): Promise<void> {
    this._id = row.ped_fre_id;
    this._date = new Date(row.ped_fre_data);
    this._description = row.ped_fre_descricao;
    this._distance = row.ped_fre_distancia;
    this._weight = row.ped_fre_peso;
    this._value = row.ped_fre_valor;
    this._driverValue = row.ped_fre_valor_motorista;
    this._driverEntry = row.ped_fre_entrada_motorista;
    this._shipping = row.ped_fre_entrega;
    this._budget = row.orc_fre_id
      ? (await new FreightBudget().get({ id: row.orc_fre_id }))[0]
      : undefined;
    this._order = row.ped_ven_id
      ? (await new SalesOrder().get({ id: row.ped_ven_id }))[0]
      : undefined;
    this._representation = row.rep_id
      ? (await new Representation().get({ id: row.rep_id }))[0]
      : undefined;
    this._client = (await new Client().get({ id: row.cli_id }))[0];
    this._destiny = (await new City().get({ id: row.cid_id }))[0];
    this._truckType = (await new TruckType().get({ id: row.tip_cam_id }))[0];
    this._proprietary = (await new Proprietary().get({ id: row.prp_id }))[0];
    this._driver = (await new Driver().get({ id: row.mot_id }))[0];
    this._truck = (await new Truck().get({ id: row.cam_id }))[0];
    this._paymentFormFreight = (await new PaymentForm().get({ id: row.for_pag_fre }))[0];
    this._paymentFormDriver = row.for_pag_mot
      ? (await new PaymentForm().get({ id: row.for_pag_fre }))[0]
      : undefined;
    this._author = (await new User().get({ id: row.usu_id }))[0];
    this._status = (
      await new OrderStatus().get({ order: this._id, orderBy: 'ped_fre_sts_hora' })
    )[0];
    this._items = await new FreightOrderItem().get({ order: this._id });
    this._steps = await new LoadStep().get({ order: this._id });
  }
}
