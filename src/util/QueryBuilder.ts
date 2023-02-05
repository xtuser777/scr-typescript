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

  update(table: string): this {
    if (this._query.length > 0) return this;
    this._query += 'UPDATE ' + table;

    return this;
  }

  set(columns: string): this {
    if (!this._query.includes('UPDATE')) return this;
    this._query += ' SET ' + columns;

    return this;
  }

  delete(table: string): this {
    if (this._query.length > 0) return this;
    this._query += 'DELETE FROM ' + table;

    return this;
  }

  from(table: string): this {
    if (!this._query.includes('SELECT')) return this;
    this._query += ' FROM ' + table;

    return this;
  }

  innerJoin(table: string): this {
    if (!this._query.includes('FROM')) return this;
    this._query += ' INNER JOIN ' + table;

    return this;
  }

  leftJoin(table: string): this {
    if (!this._query.includes('FROM')) return this;
    this._query += ' LEFT JOIN ' + table;

    return this;
  }

  on(expression: string): this {
    if (!this._query.includes('JOIN')) return this;
    this._query += ' ON ' + expression;

    return this;
  }

  where(condition: string): this {
    if (
      ((this._query.includes('SELECT') || this._query.includes('DELETE')) &&
        !this._query.includes('FROM')) ||
      (this._query.includes('UPDATE') && !this._query.includes('SET')) ||
      this._query.includes('WHERE')
    )
      return this;
    this._query += ' WHERE ' + condition;

    return this;
  }

  and(condition: string): this {
    if (!this._query.includes('WHERE') && !this._query.includes('= ?')) return this;

    this._query += ' AND ' + condition;

    return this;
  }

  or(condition: string): this {
    if (!this._query.includes('WHERE') && !this._query.includes('= ?')) return this;

    this._query += ' OR ' + condition;

    return this;
  }

  orderBy(column: string): this {
    if (!this._query.includes('SELECT') && !this._query.includes('FROM')) return this;

    this._query += ' ORDER BY ' + column;

    return this;
  }

  build(): string {
    if (this._query.length <= 7) return '';

    return this._query;
  }
}
