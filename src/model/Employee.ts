import QueryBuilder from '../util/QueryBuilder';
import Database from '../util/database';
import Address from './Address';
import City from './City';
import Contact from './Contact';
import PhysicalPerson from './PhysicalPerson';
import State from './State';

interface IFields {
  id?: number;
  type?: number;
}

export default class Employee {
  private _id: number;
  private _type: number;
  private _admission: Date;
  private _demission: Date;
  private _person: PhysicalPerson;

  constructor(
    id = 0,
    type = 0,
    admission = new Date(),
    demission = new Date(),
    person = new PhysicalPerson(),
  ) {
    this._id = id;
    this._type = type;
    this._admission = admission;
    this._demission = demission;
    this._person = person;
  }

  get id(): number {
    return this._id;
  }

  get type(): number {
    return this._type;
  }

  get admission(): Date {
    return this._admission;
  }

  get demission(): Date {
    return this._demission;
  }

  get person(): PhysicalPerson {
    return this._person;
  }

  async get(fields?: IFields): Promise<Employee[]> {
    const employees: Employee[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `e.est_id,e.est_nome,e.est_sigla,
       c.cid_id,c.cid_nome,
       en.end_id,en.end_rua,en.end_numero,en.end_bairro,en.end_complemento,en.end_cep,
       ct.ctt_id,ct.ctt_telefone,ct.ctt_celular,ct.ctt_email,
       pf.pf_id,pf.pf_nome,pf.pf_rg,pf.pf_cpf,pf.pf_nascimento,
       f.fun_id,f.fun_tipo,f.fun_admissao,f.fun_demissao`,
      )
      .from('funcionario f')
      .innerJoin('pessoa_fisica pf')
      .on('pf.pf_id = f.pf_id')
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
        builder = builder.where('f.fun_id = ?');
      }

      if (fields.type) {
        parameters.push(fields.type);
        builder = builder.where('f.fun_tipo = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      employees.push(
        new Employee(
          row.fun_id,
          row.fun_tipo,
          row.fun_admissao,
          row.fun_demission,
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

    return employees;
  }

  async save(): Promise<number> {
    if (
      this._id < 0 ||
      this._type <= 0 ||
      this._admission == null ||
      this._person.id === 0
    )
      return -5;

    let result = 0;
    const parameters = [this._type, this._admission, this._person.id];
    if (this._id > 0) parameters.push(this._id);

    const query =
      this._id > 0
        ? new QueryBuilder()
            .update('funcionario')
            .set('fun_tipo = ?, fun_admissao = ?, pf_id = ?')
            .where('fun_id = ?')
            .build()
        : new QueryBuilder()
            .insert('funcionario', 'fun_tipo,fun_admissao,pf_id', '?,?,?')
            .build();

    result =
      this._id > 0
        ? await Database.instance.update(query, parameters)
        : await Database.instance.insert(query, parameters);

    return Number.parseInt(result.toString());
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    let result = 0;
    const parameters = [this._id];

    const query = new QueryBuilder().delete('funcionario').where('fun_id = ?').build();

    result = await Database.instance.delete(query, parameters);

    return Number.parseInt(result.toString());
  }

  async desactivate(id: number): Promise<number> {
    if (id <= 0) return -5;

    let result = 0;
    const parameters = [id];

    const query = new QueryBuilder()
      .update('usuario u')
      .innerJoin('funcionario f')
      .on('f.fun_id = u.fun_id')
      .set('u.usu_ativo = false, f.fun_demissao = now()')
      .where('u.usu_id = ?')
      .build();

    result = await Database.instance.update(query, parameters);

    return Number.parseInt(result.toString());
  }

  async reactivate(id: number): Promise<number> {
    if (id <= 0) return -5;

    let result = 0;
    const parameters = [id];

    const query = new QueryBuilder()
      .update('usuario u')
      .innerJoin('funcionario f')
      .on('f.fun_id = u.fun_id')
      .set('u.usu_ativo = true, f.fun_demissao = null')
      .where('u.usu_id = ?')
      .build();

    result = await Database.instance.update(query, parameters);

    return Number.parseInt(result.toString());
  }
}
