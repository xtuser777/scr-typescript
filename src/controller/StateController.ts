import { Request, Response } from 'express';
import State from '../model/State';
import Database from '../util/database';

export default class StateController {
  async getById(req: Request, res: Response): Promise<Response> {
    await Database.instance.open();
    const state = (await new State().get({ id: 1 }))[0];
    await Database.instance.close();

    return res.json(state);
  }
}
