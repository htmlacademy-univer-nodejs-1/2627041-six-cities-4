import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/index.js';

export interface FavoriteService {
  getUserFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addFavorite(userId: string, offerId: string): Promise<DocumentType<OfferEntity>>;
  deleteFavorite(userId: string, offerId: string): Promise<void>;
}
