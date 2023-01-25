import QueryBuilder from '../util/QueryBuilder';
import Database from '../util/database';

interface IFields {
  id?: number;
}

export default class Level {
  private _id: number;
  private _description: string;

  constructor(id = 0, description = '') {
    this._id = id;
    this._description = description;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  async get(fields?: IFields): Promise<Level[]> {
    const levels: Level[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('niv_id,niv_descricao').from('nivel');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('niv_id = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      levels.push(new Level(row.niv_id, row.niv_descricao));
    }

    return levels;
  }
}
