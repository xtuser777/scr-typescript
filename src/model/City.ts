import Database from '../util/database';
import State from './State';

interface Fields {
  id?: number;
  name?: string;
  state?: number;
}

export default class City {
  private _id: number;
  private _name: string;
  private _state: State;

  constructor(id = 0, name = '', state = new State()) {
    this._id = id;
    this._name = name;
    this._state = state;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get static(): State {
    return this._state;
  }

  async get(fields?: Fields): Promise<City[] | null> {
    const db = Database.instance as Database;
    if (await db.open()) {
      const cities: City[] = [];
      const parameters = [];

      let builder = new QueryBuilder();

      builder = builder
        .select('e.est_id,e.est_nome,e.est_sigla,c.cid_id,c.cid_nome')
        .from('cidade c')
        .innerJoin('estado e')
        .on('e.est_id = c.est_id');

      if (fields) {
        if (fields.id) {
          parameters.push(fields.id);
          builder = builder.where('c.cid_id = ?');
        }

        if (fields.name) {
          parameters.push(fields.name);
          builder =
            parameters.length > 1
              ? builder.and('c.cid_nome = ?')
              : builder.where('c.cid_nome = ?');
        }

        if (fields.state) {
          parameters.push(fields.state);
          builder =
            parameters.length > 1
              ? builder.and('c.est_id = ?')
              : builder.where('c.est_id = ?');
        }
      }

      const query = builder.build();

      const result = await db.select(query, parameters);

      for (const row of result) {
        cities.push(
          new City(
            row.cid_id,
            row.cid_nome,
            new State(row.est_id, row.est_nome, row.est_sigla),
          ),
        );
      }

      db.close();

      return cities;
    } else {
      console.log('Erro devido a falha na conexão com o banco de dados.');
      return null;
    }
  }
}

class QueryBuilder {
  private _query: string;

  constructor() {
    this._query = '';

    return this;
  }

  select(columns: string): this {
    if (this._query.length > 0) return this;
    this._query += 'SELECT ' + columns;

    return this;
  }

  from(table: string): this {
    if (this._query.length <= 7) return this;
    this._query += ' FROM ' + table;

    return this;
  }

  innerJoin(table: string): this {
    if (!this._query.search('FROM')) return this;
    this._query += ' INNER JOIN ' + table;

    return this;
  }

  on(expression: string): this {
    if (!this._query.search('FROM')) return this;
    this._query += ' ON ' + expression;

    return this;
  }

  where(condition: string): this {
    if (!this._query.search('FROM')) return this;
    this._query += ' WHERE ' + condition;

    return this;
  }

  and(condition: string): this {
    if (!this._query.search('WHERE') && !this._query.search('= ?')) return this;

    this._query += ' AND ' + condition;

    return this;
  }

  or(condition: string): this {
    if (!this._query.search('WHERE') && !this._query.search('= ?')) return this;

    this._query += ' OR ' + condition;

    return this;
  }

  build(): string {
    if (this._query.length <= 7) return '';

    return this._query;
  }
}
