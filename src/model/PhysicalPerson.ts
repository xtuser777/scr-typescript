import QueryBuilder from '../util/QueryBuilder';
import Database from '../util/database';
import Address from './Address';
import City from './City';
import Contact from './Contact';
import State from './State';

interface IFields {
  id?: number;
}

export default class PhysicalPerson {
  private _id: number;
  private _name: string;
  private _rg: string;
  private _cpf: string;
  private _birthDate: Date;
  private _contact?: Contact;

  constructor(
    id = 0,
    name = '',
    rg = '',
    cpf = '',
    birthDate = new Date(Date.now()),
    contact: Contact | undefined = undefined,
  ) {
    this._id = id;
    this._name = name;
    this._rg = rg;
    this._cpf = cpf;
    this._birthDate = birthDate;
    this._contact = contact;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rg(): string {
    return this._rg;
  }

  get cpf(): string {
    return this._cpf;
  }

  get birthDate(): Date {
    return this._birthDate;
  }

  get contact(): Contact | undefined {
    return this._contact;
  }

  validateCpf(cpf: string): boolean {
    if (cpf === '') return false;

    cpf = cpf.replaceAll('.', '');
    cpf = cpf.replace('-', '');

    // Elimina CPFs invalidos conhecidos
    if (
      cpf.length != 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    )
      return false;

    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++) {
      add += Number(cpf[i]) * (10 - i);
    }
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != Number(cpf[9])) {
      return false;
    }

    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) {
      add += Number(cpf[i]) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != Number(cpf[10])) {
      return false;
    }

    return true;
  }

  async get(fields?: IFields): Promise<PhysicalPerson[]> {
    const persons: PhysicalPerson[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `e.est_id,e.est_nome,e.est_sigla,
         c.cid_id,c.cid_nome,
         en.end_id,en.end_rua,en.end_numero,en.end_bairro,en.end_complemento,en.end_cep,
         ct.ctt_id,ct.ctt_telefone,ct.ctt_celular,ct.ctt_email,
         pf.pf_id,pf.pf_nome,pf.pf_rg,pf.pf_cpf,pf.pf_nascimento`,
      )
      .from('pessoa_fisica pf')
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
        builder = builder.where('pf.pf_id = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      persons.push(
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
          ) as Contact,
        ),
      );
    }

    return persons;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._name.trim().length <= 0 ||
      this._rg.trim().length <= 0 ||
      this._cpf.trim().length <= 0 ||
      this._contact === undefined
    )
      return -5;

    let result = 0;
    const parameters = [
      this._name,
      this._rg,
      this._cpf,
      this._birthDate,
      this._contact.id,
    ];

    const query = new QueryBuilder()
      .insert('pessoa_fisica', 'pf_nome,pf_rg,pf_cpf,pf_nascimento,ctt_id', '?,?,?,?,?')
      .build();

    result = await Database.instance.insert(query, parameters);

    return result;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._name.trim().length <= 0 ||
      this._rg.trim().length <= 0 ||
      this._cpf.trim().length <= 0 ||
      this._contact === undefined
    )
      return -5;

    let result = 0;
    const parameters = [
      this._name,
      this._rg,
      this._cpf,
      this._birthDate,
      this._contact.id,
      this._id,
    ];

    const query = new QueryBuilder()
      .update('pessoa_fisica')
      .set('pf_nome = ?, pf_rg = ?, pf_cpf = ?, pf_nascimento = ?, ctt_id = ?')
      .where('pf_id = ?')
      .build();

    result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    let result = 0;
    const parameters = [this._id];

    const query = new QueryBuilder().delete('pessoa_fisica').where('pf_id = ?').build();

    result = await Database.instance.delete(query, parameters);

    return result;
  }

  async countCpf(cpf: string): Promise<number> {
    if (cpf.trim().length < 14) return -5;
    let count = 0;
    const parameters = [cpf];

    const query = new QueryBuilder()
      .select('count(pf_id) as cnt')
      .from('pessoa_fisica')
      .where('pf_cpf = ?')
      .build();

    const result = await Database.instance.select(query, parameters);

    count = Number.parseInt(result[0].cnt);

    return count;
  }
}
