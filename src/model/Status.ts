import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';

interface IFields {
  id?: number;
  order?: string;
}

export default class Status {
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

  async get(fields?: IFields): Promise<Status[]> {
    const statuses: Status[] = [];
    const parameters = [];

    let builder = new QueryBuilder().select('*').from('status');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('sts_id = ?');
      }

      if (fields.order) {
        builder = builder.orderBy(fields.order);
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      const status = new Status();
      status.convertRow(row);
      statuses.push(status);
    }

    return statuses;
  }

  private convertRow(row: any): void {
    this._id = row.sts_id;
    this._description = row.sts_descricao;
  }
}
