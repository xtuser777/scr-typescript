import QueryBuilder from '../util/QueryBuilder';
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
    const states: State[] = [];
    const parameters = [];

    let builder = new QueryBuilder();

    builder = builder.select('est_id,est_nome,est_sigla').from('estado');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('est_id = ?');
      }

      if (fields.name) {
        parameters.push(fields.name);
        builder =
          parameters.length > 1
            ? builder.and('est_nome = ?')
            : builder.where('est_nome = ?');
      }

      if (fields.acronym) {
        parameters.push(fields.acronym);
        builder =
          parameters.length > 1
            ? builder.and('est_sigla = ?')
            : builder.where('est_sigla = ?');
      }
    }

    const query = builder.build();

    const result = await db.select(query, parameters);

    for (const row of result) {
      states.push(new State(row.est_id, row.est_nome, row.est_sigla));
    }

    return states;
  }
}
