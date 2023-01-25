import QueryBuilder from '../util/QueryBuilder';
import Database from '../util/database';
import Address from './Address';
import City from './City';
import Contact from './Contact';
import State from './State';

interface IFields {
  id?: number;
}

export default class LegalPerson {
  private _id: number;
  private _corporateName: string;
  private _fantasyName: string;
  private _cnpj: string;
  private _contact: Contact;

  constructor(
    id = 0,
    corporateName = '',
    fantasyName = '',
    cnpj = '',
    contact = new Contact(),
  ) {
    this._id = id;
    this._corporateName = corporateName;
    this._fantasyName = fantasyName;
    this._cnpj = cnpj;
    this._contact = contact;
  }

  get id(): number {
    return this._id;
  }

  get corporateName(): string {
    return this._corporateName;
  }

  get fantasyName(): string {
    return this._fantasyName;
  }

  get cnpj(): string {
    return this._cnpj;
  }

  get contact(): Contact {
    return this._contact;
  }

  validateCnpj(cnpj: string): boolean {
    cnpj = cnpj.replaceAll('.', '');
    cnpj = cnpj.replace('/', '');
    cnpj = cnpj.replace('-', '');

    if (cnpj === '') return false;

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj === '00000000000000' ||
      cnpj === '11111111111111' ||
      cnpj === '22222222222222' ||
      cnpj === '33333333333333' ||
      cnpj === '44444444444444' ||
      cnpj === '55555555555555' ||
      cnpj === '66666666666666' ||
      cnpj === '77777777777777' ||
      cnpj === '88888888888888' ||
      cnpj === '99999999999999'
    )
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += Number(numeros[tamanho - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado.toString()[0] !== digitos[0]) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += Number(numeros[tamanho - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado.toString()[0] !== digitos[1]) return false;

    return true;
  }

  async save(): Promise<number> {
    if (
      this._id < 0 ||
      this._corporateName.trim().length <= 0 ||
      this._fantasyName.trim().length <= 0 ||
      this._cnpj.trim().length < 18 ||
      this._contact.id === 0
    )
      return -5;

    let result = 0;
    const parameters =
      this._id > 0
        ? [this._corporateName, this._fantasyName, this._id]
        : [this._corporateName, this._fantasyName, this._cnpj, this._contact.id];

    const query =
      this._id > 0
        ? new QueryBuilder()
            .update('pessoa_juridica')
            .set('pj_razao_social = ?,pj_nome_fantasia = ?')
            .where('pj_id = ?')
            .build()
        : new QueryBuilder()
            .insert(
              'pessoa_juridica',
              'pj_razao_social,pj_nome_fantasia,pj_cnpj,ctt_id',
              '?,?,?,?',
            )
            .build();

    result =
      this._id > 0
        ? await Database.instance.update(query, parameters)
        : await Database.instance.insert(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    let result = 0;
    const parameters = [this._id];

    const query = new QueryBuilder().delete('pessoa_juridica').where('pj_id = ?').build();

    result = await Database.instance.delete(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<LegalPerson[]> {
    const persons: LegalPerson[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        `e.est_id, e.est_nome, e.est_sigla,
         c.cid_id, c.cid_nome,
         en.end_id, en.end_rua, en.end_numero, en.end_bairro, en.end_complemento, en.end_cep,
         ct.ctt_id, ct.ctt_telefone, ct.ctt_celular, ct.ctt_email,
         p.pj_id, p.pj_razao_social, p.pj_nome_fantasia, p.pj_cnpj`,
      )
      .from('pessoa_juridica p')
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
        parameters.push(fields.id);
        builder = builder.where('p.pj_id = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      persons.push(
        new LegalPerson(
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
      );
    }

    return persons;
  }
}
