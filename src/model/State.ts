import Database from '../util/database';

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

  async get() {
    const db = Database.instance as Database;
    if (await db.open()) {
      const states: State[] = [];
      const result = await db.select('select * from estado');

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
