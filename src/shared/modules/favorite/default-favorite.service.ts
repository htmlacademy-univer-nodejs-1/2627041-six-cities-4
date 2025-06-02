import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteService } from './favorite-service.interface.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public async getUserFavorites(
    userId: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const favorites = await this.favoriteModel.find({ userId }).exec();
    const offerIds = favorites.map((fav) => fav.offerId);

    const offers = await this.offerModel
      .find({ _id: { $in: offerIds } })
      .exec();

    offers.forEach((offer) => {
      offer.isFavorite = true;
    });
    
    return offers;
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
}
