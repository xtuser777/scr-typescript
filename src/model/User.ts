import QueryBuilder from '../util/QueryBuilder';
import Database from '../util/database';
import Address from './Address';
import City from './City';
import Contact from './Contact';
import Employee from './Employee';
import Level from './Level';
import PhysicalPerson from './PhysicalPerson';
import State from './State';

interface IFields {
  id?: number;
  login?: string;
  password?: string;
  active?: boolean;
  personName?: string;
  contactId?: number;
  employeeAdmission?: string;
}

export default class User {
  private _id: number;
  private _login: string;
  private _password: string;
  private _active: boolean;
  private _employee: Employee;
  private _level: Level;

  constructor(
    id = 0,
    login = '',
    password = '',
    active = false,
    employee = new Employee(),
    level = new Level(),
  ) {
    this._id = id;
    this._login = login;
    this._password = password;
    this._active = active;
    this._employee = employee;
    this._level = level;
  }

  get id(): number {
    return this._id;
  }

  get login(): string {
    return this._login;
  }

  get password(): string {
    return this._password;
  }

  get active(): boolean {
    return this._active;
  }

  get employee(): Employee {
    return this._employee;
  }

  get level(): Level {
    return this._level;
  }

  async save(): Promise<number> {
    if (this._id < 0 || this._employee.id === 0 || this._level.id === 0) return -5;

    let result = 0;
    const parameters = [
      this._login,
      this.password,
      this._active,
      this._employee.id,
      this._level.id,
    ];
    if (this._id > 0) parameters.push(this._id);

    const query =
      this._id > 0
        ? new QueryBuilder()
            .update('usuario')
            .set('usu_login = ?,usu_senha = ?,usu_ativo = ?,fun_id = ?,niv_id = ?')
            .where('usu_id = ?')
            .build()
        : new QueryBuilder()
            .insert('usuario', 'usu_login,usu_senha,usu_ativo,fun_id,niv_id', '?,?,?,?,?')
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

    const query = new QueryBuilder().delete('usuario').where('usu_id = ?').build();

    result = await Database.instance.delete(query, parameters);

    return Number.parseInt(result.toString());
  }

  async get(fields?: IFields): Promise<User[]> {
    const users: User[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `
          e.est_id,e.est_nome,e.est_sigla,
          c.cid_id,c.cid_nome,
          en.end_id,en.end_rua,en.end_numero,en.end_bairro,en.end_complemento,en.end_cep,
          ct.ctt_id,ct.ctt_telefone,ct.ctt_celular,ct.ctt_email,
          pf.pf_id,pf.pf_nome,pf.pf_rg,pf.pf_cpf,pf.pf_nascimento,
          f.fun_id,f.fun_tipo,f.fun_admissao,f.fun_demissao,
          n.niv_id,n.niv_descricao,
          u.usu_id,u.usu_login,u.usu_senha,u.usu_ativo
       `,
      )
      .from('usuario u')
      .innerJoin('nivel n')
      .on('n.niv_id = u.niv_id')
      .innerJoin('funcionario f')
      .on('f.fun_id = u.fun_id')
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
        builder = builder.where('u.usu_id = ?');
      }

      if (fields.login && fields.password && fields.active) {
        parameters.push(fields.login, fields.password, fields.active);
        builder = builder
          .where('u.usu_login = ?')
          .and('u.usu_senha = ?')
          .and('u.usu_ativo = true');
      }

      if (fields.employeeAdmission) {
        parameters.push(fields.employeeAdmission);
        builder = builder.where('date(f.fun_admissao) = date(?)');
      }

      if (fields.login && fields.personName && fields.contactId) {
        if (fields.employeeAdmission) {
          parameters.push(
            fields.login,
            fields.personName,
            fields.contactId,
            fields.employeeAdmission,
          );
          builder = builder
            .where('(u.usu_login like ? or pf.pf_nome like ? or ct.ctt_id like ?)')
            .and('date(f.fun_admissao) = date(?)');
        } else {
          parameters.push(fields.login, fields.personName, fields.contactId);
          builder = builder
            .where('u.usu_login like ?')
            .and('pf.pf_nome like ?')
            .and('ct.ctt_id like ?');
        }
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      users.push(
        new User(
          row.usu_id,
          row.usu_login,
          row.usu_password,
          row.usu_ativo,
          new Employee(
            row.fun_id,
            row.fun_tipo,
            row.fun_admissao,
            row.fun_demissao,
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
          new Level(row.niv_id, row.niv_descricao),
        ),
      );
    }

    return users;
  }

  async adminCount(): Promise<number> {
    let count = 0;
    const query = new QueryBuilder()
      .select('count(usuario.usu_id) as admins')
      .from('usuario')
      .innerJoin('funcionario')
      .on('usuario.fun_id = funcionario.fun_id')
      .where('usuario.niv_id = 1')
      .and('funcionario.fun_demissao is null')
      .build();

    count = (await Database.instance.select(query))[0].admins;

    return Number.parseInt(count.toString());
  }

  async loginCount(login: string): Promise<number> {
    let count = 0;
    const query = new QueryBuilder()
      .select('count(usu_id) as logins')
      .from('usuario')
      .where('usu_login = ?')
      .build();

    count = (await Database.instance.select(query, [login]))[0].logins;

    return Number.parseInt(count.toString());
  }
}
