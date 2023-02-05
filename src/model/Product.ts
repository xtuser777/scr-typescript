import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Representation from './Representation';
import TruckType from './TruckType';

interface IFields {
  id?: number;
  filter?: string;
  unit?: string;
  representation?: number;
  order?: string;
}

export default class Product {
  private _id: number;
  private _description: string;
  private _measure: string;
  private _weight: number;
  private _price: number;
  private _priceOut: number;
  private _representation: Representation;
  private _truckTypes: TruckType[];

  constructor(
    id = 0,
    description = '',
    measure = '',
    weight = 0,
    price = 0,
    priceOut = 0,
    representation = new Representation(),
    truckTypes: TruckType[] = [],
  ) {
    this._id = id;
    this._description = description;
    this._measure = measure;
    this._weight = weight;
    this._price = price;
    this._priceOut = priceOut;
    this._representation = representation;
    this._truckTypes = truckTypes;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get measure(): string {
    return this._measure;
  }

  get weight(): number {
    return this._weight;
  }

  get price(): number {
    return this._price;
  }

  get priceOut(): number {
    return this._priceOut;
  }

  get representation(): Representation {
    return this._representation;
  }

  get truckTypes(): TruckType[] {
    return this._truckTypes;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._description.trim().length <= 0 ||
      this._measure.trim().length <= 0 ||
      this._weight <= 0 ||
      this._price <= 0 ||
      this._representation.id == 0
    )
      return -5;

    const parameters = [
      this._description,
      this._measure,
      this._weight,
      this._price,
      this._priceOut,
      this._representation.id,
    ];

    const query = new QueryBuilder()
      .insert(
        'produto',
        'pro_descricao,pro_medida,pro_peso,pro_preco,pro_preco_out,rep_id',
        '?,?,?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async saveType(type: number): Promise<number> {
    if (type <= 0) return -5;

    const query = new QueryBuilder()
      .insert('produto_tipo_caminhao', 'pro_id,tip_cam_id', '?,?')
      .build();

    const result = await Database.instance.insert(query, [type]);

    return result;
  }

  async get(fields?: IFields): Promise<Product[]> {
    const products: Product[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `e.est_id, e.est_nome, e.est_sigla,
        c.cid_id, c.cid_nome,
        en.end_id, en.end_rua, en.end_numero, en.end_bairro, en.end_complemento, en.end_cep,
        ct.ctt_id, ct.ctt_telefone, ct.ctt_celular, ct.ctt_email,
        pj.pj_id, pj.pj_razao_social, pj.pj_nome_fantasia, pj.pj_cnpj,
        r.rep_id, r.rep_cadastro, r.rep_unidade,
        p.pro_id, p.pro_descricao, p.pro_medida, p.pro_peso, p.pro_preco, p.pro_preco_out`,
      )
      .from('produto p')
      .innerJoin('representacao r')
      .on('r.rep_id = p.rep_id')
      .innerJoin('pessoa_juridica pj')
      .on('pj.pj_id = r.pj_id')
      .innerJoin('contato ct')
      .on('ct.ctt_id = pj.ctt_id')
      .innerJoin('endereco en')
      .on('en.end_id = ct.end_id')
      .innerJoin('cidade c')
      .on('c.cid_id = en.cid_id')
      .innerJoin('estado e')
      .on('e.est_id = c.est_id');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('p.pro_id = ?');
      }

      if (fields.filter) {
        parameters.push(`%${fields.filter}%`);
        builder = builder.where('p.pro_descricao like ?');
      }

      if (fields.unit) {
        parameters.push(`%${fields.unit}%`);
        builder = builder.where('p.pro_medida like ?').and('p.pro_medida like ?');
      }

      if (fields.representation) {
        parameters.push(fields.representation);
        builder = builder.where('p.rep_id = ?').and('p.rep_id = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      products.push(
        new Product(
          row.pro_id,
          row.pro_descricao,
          row.pro_medida,
          row.pro_peso,
          row.pro_preco,
          row.pro_preco_out,
          (await new Representation().get({ id: row.rep_id }))[0],
          await this.getTypes(row.pro_id),
        ),
      );
    }

    return products;
  }

  async getTypes(product: number): Promise<TruckType[]> {
    const types: TruckType[] = [];

    const query = new QueryBuilder()
      .select(
        'tc.tip_cam_id, tc.tip_cam_descricao, tc.tip_cam_eixos, tc.tip_cam_capacidade',
      )
      .from('tipo_caminhao tc')
      .innerJoin('produto_tipo_caminhao ptc')
      .on('ptc.tip_cam_id = tc.tip_cam_id')
      .where('ptc.pro_id = ?')
      .build();

    const rows = await Database.instance.select(query, [product]);

    for (const row of rows) {
      types.push(
        new TruckType(
          row.tip_cam_id,
          row.tip_cam_descricao,
          row.tip_cam_eixos,
          row.tip_cam_capacidade,
        ),
      );
    }

    return types;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._description.trim().length <= 0 ||
      this._measure.trim().length <= 0 ||
      this._weight <= 0 ||
      this._price <= 0 ||
      this._representation.id == 0
    )
      return -5;

    const parameters = [
      this._description,
      this._measure,
      this._weight,
      this._price,
      this._priceOut,
      this._representation.id,
      this._id,
    ];

    const query = new QueryBuilder()
      .update('produto')
      .set(
        'pro_descricao = ?, pro_medida = ?, pro_peso = ?, pro_preco = ?, pro_preco_out = ?, rep_id = ?',
      )
      .where('pro_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder().delete('produto').where('pro_id = ?').build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  async delType(type: number): Promise<number> {
    if (type <= 0) return -5;

    const query = new QueryBuilder()
      .delete('produto_tipo_caminhao')
      .where('pro_id = ?')
      .and('tip_cam_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id, type]);

    return result;
  }

  async verifyType(product: number, type: number): Promise<boolean> {
    if (type <= 0) return false;

    const query = new QueryBuilder()
      .select('count(tip_cam_id) > 0 as res')
      .from('produto_tipó_caminhao')
      .where('pro_id = ?')
      .and('tip_cam_id = ?')
      .build();

    const rows = await Database.instance.select(query, [product, type]);

    return rows[0].res;
  }
}
