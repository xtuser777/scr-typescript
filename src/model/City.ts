import QueryBuilder from '../util/QueryBuilder';
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

  async get(fields?: Fields): Promise<City[]> {
    const db = Database.instance as Database;
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

    return cities;
  }
}
