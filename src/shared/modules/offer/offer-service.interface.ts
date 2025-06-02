import { CreateOrUpdateOfferDto } from './dto/create-or-update-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CityType } from '../../types/city-type.enum.js';

export interface OfferService {
  create(dto: CreateOrUpdateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: CreateOrUpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  findPremiumOffersByCity(city: CityType, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
