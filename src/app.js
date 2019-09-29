import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import path from 'path';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import Youch from 'youch';

import sentryConfig from './config/sentry';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);

    this.server.use(Sentry.Handlers.errorHandler());
    // this.server.use(function onError(err, req, res, next) {
    //   // The error id is attached to `res.sentry` to be returned
    //   // and optionally displayed to the user for support.
    //   res.statusCode = 500;
    //   res.end(`${res.sentry}\n`);
    // });
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
