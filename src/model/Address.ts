import QueryBuilder from '../util/QueryBuilder';
import Database from '../util/database';
import City from './City';
import State from './State';

interface Fields {
  id?: number;
  street?: string;
  number?: number;
  neighborhood?: string;
  complement?: string;
  code?: string;
  city?: number;
}

export default class Address {
  private _id: number;
  private _street: string;
  private _number: number;
  private _neighborhood: string;
  private _complement: string;
  private _code: string;
  private _city: City;

  constructor(
    id = 0,
    street = '',
    number = 0,
    neighborhood = '',
    complement = '',
    code = '',
    city = new City(),
  ) {
    this._id = id;
    this._street = street;
    this._number = number;
    this._neighborhood = neighborhood;
    this._complement = complement;
    this._code = code;
    this._city = city;
  }

  get id(): number {
    return this._id;
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }

  get complement(): string {
    return this._complement;
  }

  get code(): string {
    return this._code;
  }

  get city(): City {
    return this._city;
  }

  async get(fields?: Fields): Promise<Address[] | null> {
    const db = Database.instance as Database;
    if (await db.open()) {
      const addresses: Address[] = [];
      const parameters = [];

      let builder = new QueryBuilder();

      builder = builder
        .select(
          `e.est_id,e.est_nome,e.est_sigla,
           c.cid_id,c.cid_nome,
           en.end_id,en.end_rua,en.end_numero,en.end_bairro,en.end_complemento,en.end_cep`,
        )
        .from('endereco en')
        .innerJoin('cidade c')
        .on('c.cid_id = en.cid_id')
        .innerJoin('estado e')
        .on('e.est_id = c.est_id');

      if (fields) {
        if (fields.id) {
          parameters.push(fields.id);
          builder = builder.where('en.end_id = ?');
        }
      }

      const query = builder.build();

      const result = await db.select(query, parameters);

      for (const row of result) {
        addresses.push(
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
        );
      }

      await db.close();

      return addresses;
    } else {
      console.log('Erro devido a falha na conexão com o banco de dados.');
      return null;
    }
  }

  async save(): Promise<number> {
    const db = Database.instance as Database;
    if (await db.open()) {
      let result = 0;
      const parameters = [
        this._street,
        this._number,
        this._neighborhood,
        this._complement,
        this._code,
        this._city.id,
      ];

      let builder = new QueryBuilder();

      builder = builder.insert(
        'endereco',
        'end_rua,end_numero,end_bairro,end_complemento,end_cep,cid_id',
        '?,?,?,?,?,?',
      );

      const query = builder.build();

      await db.beginTransaction();

      result = await db.insert(query, parameters);

      await db.commit();

      await db.close();

      return result;
    } else {
      console.log('Erro devido a falha na conexão com o banco de dados.');
      return -1;
    }
  }
}
