import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
//import { OfferService } from '../offer/index.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getFavorites,
    });
    this.addRoute({
      path: '/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.changeFavoriteStatus,
    });
  }

  public getFavorites(_req: Request, res: Response): void {
    this.ok(res, { Привет: 'Привет' });
  }

  public changeFavoriteStatus(req: Request, res: Response): void {
    this.ok(res, { asd: req.params.offerId, sfd: req.params.status });
  }
}
