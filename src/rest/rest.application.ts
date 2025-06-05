import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { LoggingMiddleware } from '../shared/libs/rest/middleware/logging.middleware.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './index.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController)
    private readonly offerController: Controller,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.FavoriteController)
    private readonly favoriteController: Controller,
    @inject(Component.CommentController)
    private readonly commentsController: Controller,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: ExceptionFilter,
    @inject(Component.HttpExceptionFilter)
    private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter)
    private readonly validationExceptionFilter: ExceptionFilter
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/auth', this.userController.router);
    this.server.use('/favorites', this.favoriteController.router);
    this.server.use('/comments', this.commentsController.router);
  }

  private async _initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(
      this.config.get('JWT_SECRET')
    );
    const loggingMiddleware = new LoggingMiddleware(this.logger);
    this.server.use(loggingMiddleware.execute.bind(loggingMiddleware));
    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    this.server.use(
      authenticateMiddleware.execute.bind(authenticateMiddleware)
    );
    this.server.use(cors());
  }

  private async _initExceptionFilters() {
    this.server.use(
      this.authExceptionFilter.catch.bind(this.authExceptionFilter)
    );
    this.server.use(
      this.validationExceptionFilter.catch.bind(this.validationExceptionFilter)
    );
    this.server.use(
      this.httpExceptionFilter.catch.bind(this.httpExceptionFilter)
    );
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter)
    );
  }

  public async init() {
    this.logger.info('[Init] Application initialization');
    this.logger.info(
      `[Init] Get value from env $PORT: ${this.config.get('PORT')}`
    );
    this.logger.info(
      `[Init] Get value from env $DB_HOST: ${this.config.get('DB_HOST')}`
    );
    this.logger.info('[Init] Init database…');
    await this._initDb();
    this.logger.info('[Init] Init database completed');

    this.logger.info('[Init] Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('[Init] App-level middleware initialization completed');

    this.logger.info('[Init] Init controllers');
    await this._initControllers();
    this.logger.info('[Init] Controller initialization completed');

    this.logger.info('[Init] Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('[Init] Exception filters initialization completed');

    this.logger.info('[Init] Try to init server…');
    await this._initServer();
    this.logger.info(
      `🚀 Server started on ${getFullServerPath(
        this.config.get('HOST'),
        this.config.get('PORT')
      )}`
    );
  }
}
