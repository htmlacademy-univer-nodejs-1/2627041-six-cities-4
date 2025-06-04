import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { CityType, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { GetOfferMinimumRdo } from './rdo/get-offer-minimum.rdo.js';
import { GetSingleOfferRdo } from './rdo/get-single-offer.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';
import { CreateOrUpdateOfferDto } from './dto/create-or-update-offer.dto.js';
import { DEFAULT_OFFER_COUNT } from './offer.constants.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('[Init] Register routes for OfferController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getOffers,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOrUpdateOfferDto)
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getSingleOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.updateOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateOrUpdateOfferDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
         new ValidateObjectIdMiddleware('offerId')
      ],
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
    });
  }

  public async getOffers(
    { tokenPayload, query: { limit } }: Request,
    res: Response
  ): Promise<void> {
    const limitValue = limit
      ? parseInt(limit as string, 10)
      : DEFAULT_OFFER_COUNT;
    const allOffers = await this.offerService.find(
      limitValue,
      tokenPayload?.id
    );
    const responseData = fillDTO(GetOfferMinimumRdo, allOffers);
    this.ok(res, responseData);
  }

  public async createOffer(
    { body }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const responseData = fillDTO(GetSingleOfferRdo, result);
    this.ok(res, responseData);
  }

  public async getSingleOffer(
    { tokenPayload, params: { offerId } }: Request,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(offerId, tokenPayload?.id);
    const responseData = fillDTO(GetSingleOfferRdo, offer);
    this.ok(res, responseData);
  }

  public async updateOffer(
    { tokenPayload, body, params }: UpdateOfferRequest,
    res: Response
  ): Promise<void> {
    const canUpdate = await this.isUserOwnsOffer(tokenPayload.id, params.offerId);
    if(!canUpdate){
      throw new HttpError(StatusCodes.FORBIDDEN, `You cannot update this offer`);
    }
    const result = await this.offerService.updateById(params.offerId, body);
    const responseData = fillDTO(GetSingleOfferRdo, result);
    this.ok(res, responseData);
  }

  public async deleteOffer({ tokenPayload, params }: Request, res: Response): Promise<void> {
    const canUpdate = await this.isUserOwnsOffer(tokenPayload.id, params.offerId);
    if(!canUpdate) {
      throw new HttpError(StatusCodes.FORBIDDEN, `You cannot delete this offer`);
    }
    const offerId = params.offerId;
    await this.offerService.deleteById(offerId);
    this.noContent(res, {});
  }

  public async getPremiumOffers({tokenPayload, params: { city }}: Request, res: Response): Promise<void> {
    const cityType = this.parseCityType(city);

    if (!cityType) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `Unknown city: ${city}`);
    }

    const offers = await this.offerService.findPremiumOffersByCity(cityType, tokenPayload?.id);
    const responseData = fillDTO(GetOfferMinimumRdo, offers);
    this.ok(res, responseData);
  }

  private parseCityType(city: string): CityType | null {
    if (city in CityType) {
      return city as CityType;
    }
    return null;
  }

  private async isUserOwnsOffer(userId: string, offerId: string): Promise<boolean> {
    const offer = await this.offerService.findById(offerId);
    if(offer === null) { return false; }
    return offer.authorId._id.equals(userId);
  }
}
