import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getOffers });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.createOffer });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.getSingleOffer });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Put, handler: this.updateOffer });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteOffer });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumOffers });
  }

  public getOffers(_req: Request, res: Response): void {
    const allOffers = this.offerService.findById('680d3c225ae8d512bcfe03af');
    this.ok(res, allOffers);
  }

  public createOffer(_req: Request, _res: Response): void {
    // Код обработчика
  }

  public getSingleOffer(_req: Request, _res: Response): void {
    // Код обработчика
  }

  public updateOffer(_req: Request, _res: Response): void {
    // Код обработчика
  }

  public deleteOffer(_req: Request, _res: Response): void {
    // Код обработчика
  }

  public getPremiumOffers(_req: Request, _res: Response): void {
    // Код обработчика
  }
}