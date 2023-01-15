import dotenv from 'dotenv';
import mariadb from 'mariadb';

dotenv.config();

interface IConnection {
  conn?: mariadb.Connection;
  open: boolean;
}

export default class Database {
  private static _instance: Database | null = null;
  private _connection: IConnection = { conn: undefined, open: false };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static get instance(): Database | null {
    if (Database._instance === null) {
      Database._instance = new Database();
    }

    return Database._instance as Database;
  }

  async open(): Promise<boolean> {
    const pool = mariadb.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_SCHEMA,
      charset: process.env.DATABASE_CHARSET,
      connectionLimit: 5,
    });

    try {
      this._connection.conn = await pool.getConnection();
      this._connection.open = true;

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async close(): Promise<boolean> {
    if (this._connection.conn && this._connection.open) {
      try {
        await this._connection.conn.end();
        this._connection.open = false;

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }

    return false;
  }

  getConnection(): mariadb.Connection | undefined {
    if (this._connection.conn && this._connection.open) return this._connection.conn;
    else {
      console.log('Conexão fechada... Tente abrir a connexão com a função open()');
      return undefined;
    }
  }

  async select(sql: string, parameters = []): Promise<any[]> {
    if (this._connection.conn && this._connection.open) {
      // eslint-disable-next-line no-useless-catch
      try {
        const rows = await this._connection.conn.query(sql, parameters);
        const result = [];

        for (const row of rows) {
          result.push(row);
        }

        return result;
      } catch (err) {
        console.error(err);
        return [];
      }
    } else {
      console.log('Conexão fechada... Tente abrir a conexão com a função open()');
      return [];
    }
  }
}
