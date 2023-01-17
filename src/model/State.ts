import Database from '../util/database';

interface Fields {
  id?: number;
  name?: string;
  acronym?: string;
}

export default class State {
  private _id: number;
  private _name: string;
  private _acronym: string;

  constructor(id = 0, name = '', acronym = '') {
    this._id = id;
    this._name = name;
    this._acronym = acronym;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get acronym(): string {
    return this._acronym;
  }

  async get(fields?: Fields): Promise<State[] | null> {
    const db = Database.instance as Database;
    if (await db.open()) {
      const states: State[] = [];
      const parameters = [];

      let builder = new StateSelectBuilder().select().all().fromState();

      if (fields) {
        if (fields.id) {
          parameters.push(fields.id);
          builder = builder.where().id().equals('?');
        }

        if (fields.name) {
          parameters.push(fields.name);
          builder = builder.where().and().name().equals('?');
        }

        if (fields.acronym) {
          parameters.push(fields.acronym);
          builder = builder.where().and().acronym().equals('?');
        }
      }

      const query = builder.build();

      const result = await db.select(query, parameters);

      for (const row of result) {
        states.push(new State(row.est_id, row.est_nome, row.est_sigla));
      }

      db.close();

      return states;
    } else {
      console.log('Erro devido a falha na conexão com o banco de dados.');
      return null;
    }
  }
}

class StateSelectBuilder {
  private _query: string;

  constructor() {
    this._query = '';

    return this;
  }

  select(): this {
    if (this._query.length > 0) return this;
    this._query += 'SELECT ';

    return this;
  }

  all(): this {
    if (this._query.length > 7) return this;
    this._query += '*';

    return this;
  }

  id(): this {
    if (this._query.length > 0 && this._query.search('WHERE')) this._query += ' ';
    if (this._query.length > 7 && !this._query.search('WHERE')) this._query += ',';
    this._query += 'est_id';

    return this;
  }

  name(): this {
    if (this._query.length > 7) this._query += ',';
    this._query += 'est_nome';

    return this;
  }

  acronym(): this {
    if (this._query.length > 7) this._query += ',';
    this._query += 'est_sigla';

    return this;
  }

  fromState(): this {
    if (this._query.length <= 7) return this;
    this._query += ' FROM estado';

    return this;
  }

  where(): this {
    if (this._query.substring(this._query.length - 6, this._query.length) !== 'estado')
      return this;

    this._query += ' WHERE';

    return this;
  }

  and(): this {
    if (!this._query.search('WHERE') && !this._query.search('= ?')) return this;

    this._query += ' AND';

    return this;
  }

  or(): this {
    if (!this._query.search('WHERE') && !this._query.search('= ?')) return this;

    this._query += ' OR';

    return this;
  }

  equals(value: string): this {
    if (!this._query.search('WHERE')) return this;
    this._query += ' = ' + value;

    return this;
  }

  build(): string {
    if (this._query.length <= 7) return '';

    return this._query;
  }
}
