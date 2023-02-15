import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

import express from 'express';

import state from './router/state';

class App {
  app: express.Express;
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // this.app.use(Cors(corsOptions));
    // this.app.use(Helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    //this.app.use(express.static(resolve(__dirname, 'uploads')));
  }

  routes() {
    this.app.use('/state', state);
  }
}

export default new App().app;
