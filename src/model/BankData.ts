import Database from '../util/database';
import QueryBuilder from '../util/QueryBuilder';

interface IFields {
  id?: number;
}

export default class BankData {
  private _id: number;
  private _bank: string;
  private _agency: string;
  private _acount: string;
  private _type: number;

  constructor(id = 0, bank = '', agency = '', acount = '', type = 0) {
    this._id = id;
    this._bank = bank;
    this._agency = agency;
    this._acount = acount;
    this._type = type;
  }

  get id(): number {
    return this._id;
  }

  get bank(): string {
    return this._bank;
  }

  get agency(): string {
    return this._agency;
  }

  get acount(): string {
    return this._acount;
  }

  get type(): number {
    return this._type;
  }

  async save(): Promise<number> {
    if (
      this._id != 0 ||
      this._bank.trim().length <= 0 ||
      this._agency.trim().length <= 0 ||
      this._acount.trim().length <= 0 ||
      this._type <= 0
    )
      return -5;

    const parameters = [this._bank, this._agency, this._acount, this._type];

    const query = new QueryBuilder()
      .insert(
        'dados_bancarios',
        'dad_ban_banco, dad_ban_agencia, dad_ban_conta, dad_ban_tipo',
        '?,?,?,?',
      )
      .build();

    const result = await Database.instance.insert(query, parameters);

    return result;
  }

  async get(fields?: IFields): Promise<BankData[]> {
    const datas: BankData[] = [];
    const parameters = [];

    let builder = new QueryBuilder()
      .select('dad_ban_id, dad_ban_banco, dad_ban_agencia, dad_ban_conta, dad_ban_tipo')
      .from('dados_bancarios');

    if (fields) {
      if (fields.id) {
        parameters.push(fields.id);
        builder = builder.where('dad_ban_id = ?');
      }
    }

    const query = builder.build();

    const rows = await Database.instance.select(query, parameters);

    for (const row of rows) {
      datas.push(
        new BankData(
          row.dad_ban_id,
          row.dad_ban_banco,
          row.dad_ban_agencia,
          row.dad_ban_conta,
          row.dad_ban_tipo,
        ),
      );
    }

    return datas;
  }

  async update(): Promise<number> {
    if (
      this._id <= 0 ||
      this._bank.trim().length <= 0 ||
      this._agency.trim().length <= 0 ||
      this._acount.trim().length <= 0 ||
      this._type <= 0
    )
      return -5;

    const parameters = [this._bank, this._agency, this._acount, this._type, this._id];

    const query = new QueryBuilder()
      .update('dados_bancarios')
      .set('dad_ban_banco = ?, dad_ban_agencia = ?, dad_ban_conta = ?, dad_ban_tipo = ?')
      .where('dad_ban_id = ?')
      .build();

    const result = await Database.instance.update(query, parameters);

    return result;
  }

  async delete(): Promise<number> {
    if (this._id <= 0) return -5;

    const query = new QueryBuilder()
      .delete('dados_bancarios')
      .where('dad_ban_id = ?')
      .build();

    const result = await Database.instance.delete(query, [this._id]);

    return result;
  }
}
