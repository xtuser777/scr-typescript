import QueryBuilder from '../util/QueryBuilder';
import Database from '../util/database';
import Address from './Address';
import City from './City';
import Contact from './Contact';
import LegalPerson from './LegalPerson';
import State from './State';

interface IFields {
  id?: number;
  register?: string;
  fantasyName?: string;
  email?: string;
}

export default class Representation {
  private _id: number;
  private _register: string;
  private _unity: string;
  private _person: LegalPerson;

  constructor(id = 0, register = '', unity = '', person = new LegalPerson()) {
    this._id = id;
    this._register = register;
    this._unity = unity;
    this._person = person;
  }

  get id(): number {
    return this._id;
  }

  get register(): string {
    return this._register;
  }

  get unity(): string {
    return this._unity;
  }

  get person(): LegalPerson {
    return this._person;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._unity.trim() === '' ||
      this._register.trim() === '' ||
      this._person.id == 0
    )
      return -5;

    let result = 0;
    const parameters = [this._register, this._unity, this._person.id];

    const query = new QueryBuilder()
      .insert('representacao', 'rep_cadastro, rep_unidade, pj_id', '?,?,?')
      .build();

    result = await Database.instance.insert(query, parameters);

    return Number.parseInt(result.toString());
  }

  async get(fields?: IFields): Promise<Representation[]> {
    const representations: Representation[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `
      e.est_id, e.est_nome, e.est_sigla,
      c.cid_id, c.cid_nome,
      en.end_id, en.end_rua, en.end_numero, en.end_bairro, en.end_complemento, en.end_cep,
      ct.ctt_id, ct.ctt_telefone, ct.ctt_celular, ct.ctt_email,
      p.pj_id, p.pj_razao_social, p.pj_nome_fantasia, p.pj_cnpj,
      r.rep_id, r.rep_cadastro, r.rep_unidade
      `,
      )
      .from('representacao r')
      .innerJoin('pessoa_juridica p')
      .on('p.pj_id = r.pj_id')
      .innerJoin('contato ct')
      .on('ct.ctt_id = p.ctt_id')
      .innerJoin('endereco en')
      .on('en.end_id = ct.end_id')
      .innerJoin('cidade c')
      .on('c.cid_id = en.cid_id')
      .innerJoin('estado e')
      .on('e.est_id = c.est_id');

    if (fields) {
      if (fields.id) {
        parameters.push(this._id);
        builder = builder.where('r.rep_id = ?');
      }

      if (fields.fantasyName && fields.email && fields.register) {
        parameters.push(fields.fantasyName, fields.email, fields.register);
        builder = builder
          .where('(p.pj_nome_fantasia like ? or ct.ctt_email like ?)')
          .and('r.rep_cadastro = ?');
      }

      if (fields.fantasyName && fields.email) {
        parameters.push(fields.fantasyName, fields.email);
        builder = builder.where('p.pj_nome_fantasia like ?').or('ct.ctt_email like ?');
      }

      if (fields.register) {
        parameters.push(fields.register);
        builder = builder.where('r.rep_cadastro = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      representations.push(
        new Representation(
          row.rep_id,
          row.rep_cadastro,
          row.rep_unidade,
          new LegalPerson(
            row.pj_id,
            row.pj_razao_social,
            row.pj_nome_fantasia,
            row.pj_cnpj,
            new Contact(
              row.ctt_id,
              row.ctt_teltefone,
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

    return representations;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._unity.trim() === '' ||
      this._register.trim() === '' ||
      this._person.id == 0
    )
      return -5;

    let result = 0;
    const parameters = [this._unity, this._id];

    const query = new QueryBuilder()
      .update('representacao')
      .set('rep_unidade = ?')
      .where('rep_id = ?')
      .build();

    result = await Database.instance.update(query, parameters);

    return Number.parseInt(result.toString());
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    let result = 0;
    const query = new QueryBuilder().delete('representacao').where('rep_id = ?').build();

    result = await Database.instance.delete(query, [this._id]);

    return Number.parseInt(result.toString());
  }
}
