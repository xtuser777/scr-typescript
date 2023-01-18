export default class QueryBuilder {
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

  insert(table: string, columns: string, values: string): this {
    if (this._query.length > 0) return this;
    this._query += 'INSERT INTO ' + table + ' (' + columns + ') VALUES (' + values + ');';

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
