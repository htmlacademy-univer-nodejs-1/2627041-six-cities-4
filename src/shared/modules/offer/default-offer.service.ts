import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { CityType, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOrUpdateOfferDto } from './dto/create-or-update-offer.dto.js';
import { CommentEntity } from '../comment/index.js';
import { FavoriteEntity } from '../favorite/favorite.entity.js';
import {
  DEFAULT_PREMIUM_OFFER_COUNT,
  DEFAULT_SORT_TYPE,
} from './offer.constants.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(
    dto: CreateOrUpdateOfferDto
  ): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string,
    userId?: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .sort({ createdAt: DEFAULT_SORT_TYPE })
      .populate(['authorId'])
      .exec();

    if (offer === null) {
      return null;
    }

    const refilledOffer = (await this.markFavoritesForUser([offer], userId))[0];
    return refilledOffer;
  }

  public async find(
    count: number,
    userId?: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find()
      .limit(count)
      .sort({ createdAt: DEFAULT_SORT_TYPE })
      .exec();

    return this.markFavoritesForUser(offers, userId);
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(
    offerId: string,
    dto: CreateOrUpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['authorId'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentsCount: 1,
        },
      })
      .exec();
  }

  public async findPremiumOffersByCity(
    city: CityType,
    userId?: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find({ city, isPremium: true })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .sort({ createdAt: DEFAULT_SORT_TYPE })
      .exec();

    return this.markFavoritesForUser(offers, userId);
  }

  public async updateRating(
    offerId: string
  ): Promise<types.DocumentType<OfferEntity> | null> {
    const comments = await this.commentModel.find({ offerId }).exec();

    const ratings = comments.map((comment) => comment.rating);
    const total = ratings.reduce((acc, cur) => (acc += cur), 0);
    const avgRating = ratings.length > 0 ? total / ratings.length : 0;

    return this.offerModel
      .findByIdAndUpdate(offerId, { rate: avgRating }, { new: true })
      .exec();
  }

  private async markFavoritesForUser(
    offers: DocumentType<OfferEntity>[],
    userId?: string | null
  ): Promise<DocumentType<OfferEntity>[]> {
    if (!userId) {
      offers.forEach((offer) => {
        offer.isFavorite = false;
      });
      return offers;
    }

    const favorites = await this.favoriteModel.find({ userId }).exec();
    const favoriteIds = new Set(favorites.map((f) => f.offerId.toString()));

    offers.forEach((offer) => {
      offer.isFavorite = favoriteIds.has(offer._id.toString());
    });

    return offers;
  }
}
