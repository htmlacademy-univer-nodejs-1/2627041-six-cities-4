import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
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

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getOffers,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [new ValidateDtoMiddleware(CreateOrUpdateOfferDto)],
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
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateOrUpdateOfferDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
    });
  }

  public async getOffers(_req: Request, res: Response): Promise<void> {
    const allOffers = await this.offerService.find();
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

  public async getSingleOffer(req: Request, res: Response): Promise<void> {
    const offerId = req.params.offerId;
    const offer = await this.offerService.findById(offerId);
    const responseData = fillDTO(GetSingleOfferRdo, offer);
    this.ok(res, responseData);
  }

  public async updateOffer(
    { body, params }: UpdateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.updateById(params.offerId, body);
    const responseData = fillDTO(GetSingleOfferRdo, result);
    this.ok(res, responseData);
  }

  public async deleteOffer(req: Request, res: Response): Promise<void> {
    const offerId = req.params.offerId;
    await this.offerService.deleteById(offerId);
    this.noContent(res, {});
  }

  public async getPremiumOffers(req: Request, res: Response): Promise<void> {
    const city = req.params.city;
    const cityType = this.parseCityType(city);

    if (!cityType) {
      throw new Error('Invalid cityType');
    }

    const offers = await this.offerService.findPremiumOffersByCity(cityType);
    const responseData = fillDTO(GetOfferMinimumRdo, offers);
    this.ok(res, responseData);
  }

  private parseCityType(city: string): CityType | null {
    if (city in CityType) {
      return city as CityType;
    }
    return null;
  }
}
