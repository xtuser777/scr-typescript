import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Address from './Address';
import City from './City';
import Contact from './Contact';
import LegalPerson from './LegalPerson';
import State from './State';

export default class Parameterization {
  private _id: number;
  private _logotype: string;
  private _person: LegalPerson;

  constructor(id = 0, logotype = '', person = new LegalPerson()) {
    this._id = id;
    this._logotype = logotype;
    this._person = person;
  }

  get id(): number {
    return this._id;
  }

  get logotype(): string {
    return this._logotype;
  }

  get person(): LegalPerson {
    return this._person;
  }

  async save(): Promise<number> {
    if (this._id != 1 || this._person.id == 0) return -5;

    const query = new QueryBuilder()
      .insert('parametrizacao', 'par_id, par_logotipo, pj_id', '?,?,?')
      .build();

    const result = await Database.instance.insert(query, [
      this._id,
      this._logotype,
      this._person.id,
    ]);

    return Number.parseInt(result.toString());
  }

  async get(): Promise<Parameterization> {
    const query = new QueryBuilder()
      .select(
        `
      e.est_id, e.est_nome, e.est_sigla,
      c.cid_id, c.cid_nome,
      en.end_id, en.end_rua, en.end_numero, en.end_bairro, en.end_complemento, en.end_cep,
      ct.ctt_id, ct.ctt_telefone, ct.ctt_celular, ct.ctt_email,
      pj.pj_id, pj.pj_razao_social, pj.pj_nome_fantasia, pj.pj_cnpj,
      p.par_id, p.par_logotipo
      `,
      )
      .from('parametrizacao p')
      .innerJoin('pessoa_juridica pj')
      .on('pj.pj_id = p.pj_id')
      .innerJoin('contato ct')
      .on('ct.ctt_id = pj.ctt_id')
      .innerJoin('endereco en')
      .on('en.end_id = ct.end_id')
      .innerJoin('cidade c')
      .on('c.cid_id = en.cid_id')
      .innerJoin('estado e')
      .on('e.est_id = c.est_id')
      .where('p.par_id = 1')
      .build();

    const rows = await Database.instance.select(query);

    const parametrization = new Parameterization(
      rows[0].par_id,
      rows[0].par_logotipo,
      new LegalPerson(
        rows[0].pj_id,
        rows[0].pj_razao_social,
        rows[0].pj_nome_fantasia,
        rows[0].pj_cnpj,
        new Contact(
          rows[0].ctt_id,
          rows[0].ctt_telefone,
          rows[0].ctt_celular,
          rows[0].ctt_email,
          new Address(
            rows[0].end_id,
            rows[0].end_rua,
            rows[0].end_numero,
            rows[0].end_bairro,
            rows[0].end_complemento,
            rows[0].end_cep,
            new City(
              rows[0].cid_id,
              rows[0].cid_nome,
              new State(rows[0].est_id, rows[0].est_nome, rows[0].est_sigla),
            ),
          ),
        ),
      ),
    );

    return parametrization;
  }

  async update(): Promise<number> {
    if (this._id <= 0 || this._person.id == 0) return -5;

    const query = new QueryBuilder()
      .update('parametrizacao')
      .set('par_logotipo = ?, pj_id = ?')
      .where('par_id = ?')
      .build();

    const result = await Database.instance.update(query, [
      this._logotype,
      this._person.id,
      this._id,
    ]);

    return Number.parseInt(result.toString());
  }
}
