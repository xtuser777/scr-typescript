import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';
import Address from './Address';
import City from './City';
import Contact from './Contact';
import LegalPerson from './LegalPerson';
import PhysicalPerson from './PhysicalPerson';
import State from './State';

interface IFields {
  id?: number;
  register?: string;
  type?: number;
  initial?: string;
  end?: string;
  name?: string;
  fantasyName?: string;
  email?: string;
  order?: string;
}

export default class Client {
  private _id: number;
  private _register: string;
  private _type: number;
  private _physicalPerson: PhysicalPerson;
  private _legalPerson: LegalPerson;

  constructor(
    id = 0,
    register = '',
    type = 0,
    physicalPerson = new PhysicalPerson(),
    legalPerson = new LegalPerson(),
  ) {
    this._id = id;
    this._register = register;
    this._type = type;
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

  get physicalPerson(): PhysicalPerson {
    return this._physicalPerson;
  }

  get legalPerson(): LegalPerson {
    return this._legalPerson;
  }

  async save(): Promise<number> {
    if (this._id != 0 || this._register.trim().length == 0 || this._type <= 0) return -5;

    const parameters = [this._register, this._type];

    const query = new QueryBuilder()
      .insert('cliente', 'cli_cadastro, cli_tipo', '?,?')
      .build();

    const result = await Database.instance.insert(query, parameters);

    if (result <= 0) return result;

    return await this.addPerson(
      result,
      this.type,
      this.physicalPerson.id,
      this.legalPerson.id,
    );
  }

  async addPerson(
    id: number,
    type: number,
    physical: number,
    legal: number,
  ): Promise<number> {
    let builder = new QueryBuilder();
    const parameters = [id];
    if (type == 1) {
      parameters.push(physical);
      builder = builder.insert('cliente_pessoa_fisica', 'cli_id, pf_id', '?,?');
    }
    if (type == 2) {
      parameters.push(legal);
      builder = builder.insert('cliente_pessoa_juridica', 'cli_id, pj_id', '?,?');
    }

    const query = builder.build();

    const result = await Database.instance.insert(query, parameters);

    return result >= 0 ? id : -10;
  }

  async get(fields?: IFields): Promise<Client[]> {
    const clients: Client[] = [];
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
      cl.cli_id,cl.cli_cadastro,cl.cli_tipo
    `,
      )
      .from('cliente cl')
      .leftJoin('cliente_pessoa_fisica cpf')
      .on('cl.cli_id = cpf.cli_id')
      .leftJoin('cliente_pessoa_juridica cpj')
      .on('cl.cli_id = cpj.cli_id')
      .leftJoin('pessoa_fisica pf')
      .on('cpf.pf_id = pf.pf_id')
      .leftJoin('pessoa_juridica pj')
      .on('cpj.pj_id = pj.pj_id')
      .innerJoin('contato ct')
      .on('ct.ctt_id = pf.ctt_id or ct.ctt_id = pj.ctt_id')
      .innerJoin('endereco en')
      .on('en.end_id = ct.end_id')
      .innerJoin('cidade c')
      .on('c.cid_id = en.cid_id')
      .innerJoin('estado e')
      .on('e.est_id = c.est_id');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('cl.cli_id = ?');
      }

      if (fields.name && fields.fantasyName && fields.email) {
        if (fields.register) {
          parameters.push(fields.name, fields.fantasyName, fields.email, fields.register);
          builder = builder
            .where(
              '(pf.pf_nome like ? or pj.pj_nome_fantasia like ? or ct.ctt_email like ?)',
            )
            .and('cl.cli_cadastro = ?');
        } else if (fields.initial && fields.end) {
          if (fields.type) {
            parameters.push(
              fields.name,
              fields.fantasyName,
              fields.email,
              fields.initial,
              fields.end,
              fields.type,
            );
            builder = builder
              .where(
                '(pf.pf_nome like ? or pj.pj_nome_fantasia like ? or ct.ctt_email like ?)',
              )
              .and('(cl.cli_cadastro >= ? and cl.cli_cadastro <= ?)')
              .and('cl.cli_tipo = ?');
          } else {
            parameters.push(
              fields.name,
              fields.fantasyName,
              fields.email,
              fields.initial,
              fields.end,
            );
            builder = builder
              .where(
                '(pf.pf_nome like ? or pj.pj_nome_fantasia like ? or ct.ctt_email like ?)',
              )
              .and('(cl.cli_cadastro >= ? and cl.cli_cadastro <= ?)');
          }
        } else if (fields.type) {
          parameters.push(fields.name, fields.fantasyName, fields.email, fields.type);
          builder = builder
            .where(
              '(pf.pf_nome like ? or pj.pj_nome_fantasia like ? or ct.ctt_email like ?)',
            )
            .and('cl.cli_tipo = ?');
        } else {
          parameters.push(fields.name, fields.fantasyName, fields.email);
          builder = builder
            .where('pf.pf_nome like ?')
            .or('pj.pj_nome_fantasia like ?')
            .or('ct.ctt_email like ?');
        }
      }

      if (fields.register) {
        parameters.push(fields.register);
        builder = builder.where('cl.cli_cadastro = ?');
      }

      if (fields.initial && fields.end) {
        if (fields.type) {
          parameters.push(fields.initial, fields.end, fields.type);
          builder = builder
            .where('(cl.cli_cadastro >= ? and cl.cli_cadastro <= ?)')
            .and('cl.cli_tipo = ?');
        } else {
          parameters.push(fields.initial, fields.end);
          builder = builder.where('(cl.cli_cadastro >= ? and cl.cli_cadastro <= ?)');
        }
      }

      if (fields.type) {
        parameters.push(fields.type);
        builder = builder.where('cl.cli_tipo = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      clients.push(
        new Client(
          row.cli_id,
          row.cli_cadastro,
          row.cli_tipo,
          row.cli_tipo == 2
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
          row.cli_tipo == 1
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

    return clients;
  }

  async update(): Promise<number> {
    if (this._id <= 0 || this._register.trim().length == 0 || this._type <= 0) return -5;

    const parameters = [this._register, this._type, this._id];

    const query = new QueryBuilder()
      .update('cliente')
      .set('cli_cadastro = ?, cli_tipo = ?')
      .where('cli_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    let delPerson = 0;
    if (this._type == 1)
      delPerson = await this.delPhysicalPerson(this._id, this._physicalPerson.id);
    else delPerson = await this.delLegalPerson(this._id);

    if (delPerson <= 0) return delPerson;

    const query = new QueryBuilder().delete('cliente').where('cli_id = ?').build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }

  async delPhysicalPerson(clientId: number, personId: number): Promise<number> {
    const query = new QueryBuilder()
      .delete('cliente_pessoa_fisica')
      .where('cli_id = ?')
      .and('pf_id = ?')
      .build();

    const result = await Database.instance.delete(query, [clientId, personId]);

    return result;
  }

  async delLegalPerson(id: number): Promise<number> {
    const query = new QueryBuilder()
      .delete('cliente_pessoa_juridica')
      .where('cli_id = ?')
      .build();

    const result = await Database.instance.delete(query, [id]);

    return result;
  }
}
