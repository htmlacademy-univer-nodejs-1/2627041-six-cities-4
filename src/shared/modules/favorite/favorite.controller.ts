import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from '../offer/index.js';
import { fillDTO } from '../../helpers/common.js';
import { GetOfferMinimumRdo } from '../offer/rdo/get-offer-minimum.rdo.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('[Init] Register routes for FavoriteController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:offerId/',
      method: HttpMethod.Post,
      handler: this.addToFavorite,
      middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId/',
      method: HttpMethod.Delete,
      handler: this.deleteFromFavorite,
      middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async getFavorites(
    { tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const favorites = await this.offerService.getUserFavorites(tokenPayload.id);
    const responseData = fillDTO(GetOfferMinimumRdo, favorites);
    this.ok(res, responseData);
  }

  public async addToFavorite(
    { tokenPayload, params }: Request,
    res: Response
  ): Promise<void> {
    const userId = tokenPayload.id;
    const offerId = params.offerId;
    const userFavorites = await this.offerService.getUserFavorites(userId)
    if(userFavorites.some(offer => offer.id == offerId))
        this.ok(res, {})

    this.offerService.addFavorite(userId, offerId);
    this.ok(res, {})
  }

  public async deleteFromFavorite(
    { tokenPayload, params }: Request,
    res: Response
  ): Promise<void> {
    const userId = tokenPayload.id;
    const offerId = params.offerId;
    const userFavorites = await this.offerService.getUserFavorites(userId)
    if(!userFavorites.some(offer => offer.id == offerId))
        this.ok(res, {})

    this.offerService.deleteFavorite(userId, offerId);
    this.ok(res, {})
  }
}
