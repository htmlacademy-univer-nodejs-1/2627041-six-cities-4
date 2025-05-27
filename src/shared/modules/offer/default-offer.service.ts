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
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async find(
    _count?: number,
    _userId?: string
  ): Promise<DocumentType<OfferEntity>[]> {
    //const limit = count ?? DEFAULT_OFFER_COUNT;
    const offers = await this.offerModel.find();
    //.limit(limit)
    //.sort({ createdAt: DEFAULT_SORT_TYPE })
    //.populate(['authorId'])
    //.exec();

    //return this.addFavoriteToOffer(offers, userId);
    return offers;
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
      .populate(['host'])
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
          commentCount: 1,
        },
      })
      .exec();
  }

  public async findPremiumOffersByCity(
    city: CityType,
    _userId?: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find({ city, isPremium: true })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .sort({ createdAt: DEFAULT_SORT_TYPE })
      .exec();

    return offers;
    //return this.addFavoriteToOffer(offers, userId);
  }

  public async getUserFavorites(
    userId: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const favorites = await this.favoriteModel.find({ userId }).exec();
    const offerIds = favorites.map((fav) => fav.offerId);

    return this.offerModel.find({ _id: { $in: offerIds } }).exec();
  }

  public async addFavorite(
    userId: string,
    offerId: string
  ): Promise<types.DocumentType<OfferEntity>> {
    const existing = await this.favoriteModel
      .findOne({ userId, offerId })
      .exec();

    if (!existing) {
      await this.favoriteModel.create({ userId, offerId });
    }

    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new Error('Offer not found');
    }

    offer.isFavorite = true;

    return offer;
  }

  public async deleteFavorite(userId: string, offerId: string): Promise<void> {
    await this.favoriteModel.deleteOne({ userId, offerId });
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

  /*private async addFavoriteToOffer<
    T extends { id: string; isFavorite: boolean }
  >(offers: T[], userId: string | undefined): Promise<T[]> {
    if (!userId) {
      return offers.map((offer) => ({
        ...offer,
        isFavorite: false,
      }));
    }
    const favorites = await this.favoriteModel
      .find({ userId })
      .lean<{ offerId: string }[]>()
      .exec();
    const offerIds = new Set(favorites.map((f) => f.offerId.toString()));

    return offers.map((offer) => ({
      ...offer,
      isFavorite: offerIds.has(offer.id.toString()),
    }));
  }*/
}
