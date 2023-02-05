import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Address from './Address';
import City from './City';
import Contact from './Contact';
import Driver from './Driver';
import LegalPerson from './LegalPerson';
import PhysicalPerson from './PhysicalPerson';
import State from './State';

interface IFields {
  id?: number;
  register?: string;
  type?: number;
  filter?: string;
  order?: string;
}

export default class Proprietary {
  private _id: number;
  private _register: string;
  private _type: number;
  private _driver: Driver;
  private _physicalPerson: PhysicalPerson;
  private _legalPerson: LegalPerson;

  constructor(
    id = 0,
    register = '',
    type = 0,
    driver = new Driver(),
    physicalPerson = new PhysicalPerson(),
    legalPerson = new LegalPerson(),
  ) {
    this._id = id;
    this._register = register;
    this._type = type;
    this._driver = driver;
    this._physicalPerson = physicalPerson;
    this._legalPerson = legalPerson;
  }

  get id(): number {
    return this._id;
  }

  get register(): string {
    return this._register;
  }

  get type(): number {
    return this._type;
  }

  get driver(): Driver {
    return this._driver;
  }

  get physicalPerson(): PhysicalPerson {
    return this._physicalPerson;
  }

  get legalPerson(): LegalPerson {
    return this._legalPerson;
  }

  async save(): Promise<number> {
    if (this._id != 0 || this._register.trim().length == 0 || this.type <= 0) return -5;

    const parameters = [this._register, this._type, this._driver.id];

    const query = new QueryBuilder()
      .insert('proprietario', 'prp_cadastro, prp_tipo, mot_id', '?,?,?')
      .build();

    const insertedId = await Database.instance.insert(query, parameters);

    if (insertedId <= 0) return insertedId;

    if (this._type == 1) {
      const queryPF = new QueryBuilder()
        .insert('proprietario_pessoa_fisica', 'prp_id, pf_id', '?,?')
        .build();

      const result = await Database.instance.insert(query, [
        insertedId,
        this._physicalPerson.id,
      ]);

      return result;
    } else {
      const queryPJ = new QueryBuilder()
        .insert('proprietario_pessoa_juridica', 'prp_id, pj_id', '?,?')
        .build();

      const result = await Database.instance.insert(query, [
        insertedId,
        this._legalPerson.id,
      ]);

      return result;
    }
  }

  async get(fields?: IFields): Promise<Proprietary[]> {
    const proprietaries: Proprietary[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `
      e.est_id, e.est_nome, e.est_sigla,
      c.cid_id, c.cid_nome,
      en.end_id, en.end_rua, en.end_numero, en.end_bairro, en.end_complemento, en.end_cep,
      ct.ctt_id, ct.ctt_telefone, ct.ctt_celular, ct.ctt_email,
      pf.pf_id, pf.pf_nome, pf.pf_rg, pf.pf_cpf, pf.pf_nascimento,
      pj.pj_id, pj.pj_razao_social, pj.pj_nome_fantasia, pj.pj_cnpj,
      pp.prp_id,pp.prp_cadastro,pp.prp_tipo,pp.mot_id
    `,
      )
      .from('proprietario pp')
      .leftJoin('proprietario_pessoa_fisica ppf')
      .on('pp.prp_id = ppf.prp_id')
      .leftJoin('proprietario_pessoa_juridica ppj')
      .on('pp.prp_id = ppj.prp_id')
      .leftJoin('pessoa_fisica pf')
      .on('pf.pf_id = ppf.pf_id')
      .leftJoin('pessoa_juridica pj')
      .on('pj_pj_id = ppj.pj_id')
      .innerJoin('contato ct')
      .on('ct.ctt_id = pf.ctt_id')
      .or('ct.ctt_id = pj.ctt_id')
      .innerJoin('endereco en')
      .on('en.end_id = ct.end_id')
      .innerJoin('cidade c')
      .on('c.cid_id = en.cid_id')
      .innerJoin('estado e')
      .on('e.est_id = c.est_id');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('pp.prp_id = ?');
      }

      if (fields.filter && fields.register) {
        parameters.push(fields.filter, fields.register);
        builder = builder
          .where('(pf.pf_nome like ? OR pj.pj_nome_fantasia like ?)')
          .and('pp.prp_cadastro = ?');
      }

      if (fields.filter) {
        parameters.push(fields.filter);
        builder = builder.where('pf.pf_nome like ?').or('pj.pj_nome_fantasia like ?');
      }

      if (fields.register) {
        parameters.push(fields.register);
        builder = builder.where('pp.prp_cadastro = ?');
      }

      if (fields.type) {
        parameters.push(fields.id);
        builder = builder
          .innerJoin('caminhao c2')
          .on('pp.prp_id = c2.prp_id')
          .where('c2.tip_cam_id = ?');
      }

      if (fields.order) {
        builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      proprietaries.push(
        new Proprietary(
          row.prp_id,
          row.prp_cadastro,
          row.prp_tipo,
          row.mot_id <= 0 ? undefined : (await new Driver().get({ id: row.mot_id }))[0],
          row.prp_tipo == 2
            ? undefined
            : new PhysicalPerson(
                row.pf_id,
                row.pf_nome,
                row.pf_rg,
                row.pf_cpf,
                row.pf_nascimento,
                new Contact(
                  row.ctt_id,
                  row.ctt_telefone,
                  row.ctt_celular,
                  row.ctt_email,
                  new Address(
                    row.end_id,
                    row.end_rua,
                    row.end_numero,
                    row.end_bairro,
                    row.end_complemento,
                    row.end_cep,
                    new City(
                      row.cid_id,
                      row.cid_nome,
                      new State(row.est_id, row.est_nome, row.est_sigla),
                    ),
                  ),
                ),
              ),
          row.prp_tipo == 1
            ? undefined
            : new LegalPerson(
                row.pj_id,
                row.pj_razao_social,
                row.pj_nome_fantasia,
                row.pj_cnpj,
                new Contact(
                  row.ctt_id,
                  row.ctt_telefone,
                  row.ctt_celular,
                  row.ctt_email,
                  new Address(
                    row.end_id,
                    row.end_rua,
                    row.end_numero,
                    row.end_bairro,
                    row.end_complemento,
                    row.end_cep,
                    new City(
                      row.cid_id,
                      row.cid_nome,
                      new State(row.est_id, row.est_nome, row.est_sigla),
                    ),
                  ),
                ),
              ),
        ),
      );
    }

    return proprietaries;
  }

  async update(): Promise<number> {
    if (this._id <= 0 || this._register.trim().length == 0 || this.type <= 0) return -5;

    const parameters = [this._type, this._driver.id, this._id];

    const query = new QueryBuilder()
      .update('proprietario')
      .set('prp_tipo = ?,mot_id = ?')
      .where('prp_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    let resultPerson = 0;
    if (this._type == 1) {
      resultPerson = await this.delPF();
    } else {
      resultPerson = await this.delPJ();
    }

    if (resultPerson < 0) return resultPerson;

    const query = new QueryBuilder().delete('proprietario').where('prp_id = ?').build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  async delPF(): Promise<number> {
    const query = new QueryBuilder()
      .delete('proprietario_pessoa_fisica')
      .where('prp_id = ?')
      .and('pf_id = ?')
      .build();

    const result = await Database.instance.delete(query, [
      this._id,
      this._physicalPerson.id,
    ]);

    return result;
  }

  async delPJ(): Promise<number> {
    const query = new QueryBuilder()
      .delete('proprietario_pessoa_juridica')
      .where('prp_id = ?')
      .and('pj_id = ?')
      .build();

    const result = await Database.instance.delete(query, [
      this._id,
      this._legalPerson.id,
    ]);

    return result;
  }
}
