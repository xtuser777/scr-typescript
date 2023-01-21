import QueryBuilder from '../util/QueryBuilder';
import Database from '../util/database';
import Address from './Address';
import City from './City';
import State from './State';

interface IParameters {
  id?: number;
}

export default class Contact {
  private _id: number;
  private _phone: string;
  private _cellphone: string;
  private _email: string;
  private _address: Address;

  constructor(id = 0, phone = '', cellphone = '', email = '', address = new Address()) {
    this._id = id;
    this._phone = phone;
    this._cellphone = cellphone;
    this._email = email;
    this._address = address;
  }

  get id(): number {
    return this._id;
  }

  get phone(): string {
    return this._phone;
  }

  get cellphone(): string {
    return this._cellphone;
  }

  get email(): string {
    return this._email;
  }

  get address(): Address {
    return this._address;
  }

  async get(params: IParameters = {}): Promise<Contact[]> {
    const contacts: Contact[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select(
        'e.est_id,e.est_nome,e.est_sigla,c.cid_id,c.cid_nome,en.end_id,en.end_rua,en.end_numero,en.end_bairro,en.end_complemento,en.end_cep,ct.ctt_id,ct.ctt_telefone,ct.ctt_celular,ct.ctt_email',
      )
      .from('contato ct')
      .innerJoin('endereco en')
      .on('en.end_id = ct.end_id')
      .innerJoin('cidade c')
      .on('c.cid_id = en.cid_id')
      .innerJoin('estado e')
      .on('e.est_id = c.est_id');

    if (params) {
      if (params.id) {
        parameters.push(params.id);
        builder = builder.where('ct.ctt_id = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      contacts.push(
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
      );
    }

    return contacts;
  }

  async save(): Promise<number> {
    let result = 0;
    const parameters = [this._phone, this._cellphone, this._email, this._address.id];

    const query = new QueryBuilder()
      .insert('contato', 'ctt_telefone,ctt_celular,ctt_email,end_id', '?,?,?,?')
      .build();

    result = await Database.instance.insert(query, parameters);

    return result;
  }

  async update(): Promise<number> {
    let result = 0;
    const parameters = [
      this._phone,
      this._cellphone,
      this._email,
      this._address.id,
      this._id,
    ];

    const query = new QueryBuilder()
      .update('contato')
      .set('ctt_telefone = ?, ctt_celular = ?, ctt_email = ?, end_id = ?')
      .where('ctt_id = ?')
      .build();

    result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    let result = 0;
    const parameters = [this._id];

    const query = new QueryBuilder().delete('contato').where('ctt_id = ?').build();

    result = await Database.instance.delete(query, parameters);

    return result;
  }
}
