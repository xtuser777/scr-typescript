import { fileURLToPath } from 'url';
import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Address from './Address';
import BankData from './BankData';
import City from './City';
import Contact from './Contact';
import PhysicalPerson from './PhysicalPerson';
import State from './State';

interface IFields {
  id?: number;
  register?: string;
  filter?: string;
  order?: string;
}

export default class Driver {
  private _id: number;
  private _register: string;
  private _cnh: string;
  private _person: PhysicalPerson;
  private _bankData: BankData;

  constructor(
    id = 0,
    register = '',
    cnh = '',
    person = new PhysicalPerson(),
    bankData = new BankData(),
  ) {
    this._id = id;
    this._register = register;
    this._cnh = cnh;
    this._person = person;
    this._bankData = bankData;
  }

  get id(): number {
    return this._id;
  }

  get register(): string {
    return this._register;
  }

  get cnh(): string {
    return this._cnh;
  }

  get person(): PhysicalPerson {
    return this._person;
  }

  get bankData(): BankData {
    return this._bankData;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._register.trim().length == 0 ||
      this._cnh.trim().length <= 0 ||
      this._person.id == 0 ||
      this._bankData.id == 0
    )
      return -5;

    const parameters = [this._register, this._cnh, this._person.id, this._bankData.id];

    const query = new QueryBuilder()
      .insert('motorista', 'mot_cadastro, mot_cnh, pf_id, dad_ban_id', '?,?,?,?')
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<Driver[]> {
    const drivers: Driver[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `
      e.est_id,e.est_nome,e.est_sigla,
      c.cid_id,c.cid_nome,
      en.end_id,en.end_rua,en.end_numero,en.end_bairro,en.end_complemento,en.end_cep,
      ct.ctt_id,ct.ctt_telefone,ct.ctt_celular,ct.ctt_email,
      pf.pf_id,pf.pf_nome,pf.pf_rg,pf.pf_cpf,pf.pf_nascimento,
      db.dad_ban_id,db.dad_ban_banco,db.dad_ban_agencia,db.dad_ban_conta,db.dad_ban_tipo,
      m.mot_id,m.mot_cadastro,m.mot_cnh
    `,
      )
      .from('motorista m')
      .innerJoin('dados_bancarios db')
      .on('db.dad_ban_id = m.dad_ban_id')
      .innerJoin('pessoa_fisica pf')
      .on('pf.pf_id = m.pf_id')
      .innerJoin('contato ct')
      .on('ct.ctt_id = pf.ctt_id')
      .innerJoin('endereco en')
      .on('en.end_id = ct.end_id')
      .innerJoin('cidade c')
      .on('c.cid_id = en.cid_id')
      .innerJoin('estado e')
      .on('e.est_id = c.est_id');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('m.mot_id = ?');
      }

      if (fields.filter && fields.register) {
        parameters.push(fields.filter, fields.filter, fields.register);
        builder = builder
          .where('(pf.pf_nome like ? or ct.ctt_email like ?)')
          .and('m.mot_cadastro = ?');
      }

      if (fields.filter) {
        parameters.push(fields.filter, fields.filter);
        builder = builder.where('pf.pf_nome like ?').or('ct.ctt_email like ?');
      }

      if (fields.register) {
        parameters.push(fields.register);
        builder = builder.where('m.mot_cadastro = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      drivers.push(
        new Driver(
          row.mot_id,
          row.mot_cadastro,
          row.mot_cnh,
          new PhysicalPerson(
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
        ),
      );
    }

    return drivers;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._register.trim().length == 0 ||
      this._cnh.trim().length <= 0 ||
      this._person.id == 0 ||
      this._bankData.id == 0
    )
      return -5;

    const parameters = [this._cnh, this._id];

    const query = new QueryBuilder()
      .update('motorista')
      .set('mot_cnh = ?')
      .where('mot_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder().delete('motorista').where('mot_id = ?').build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }
}
