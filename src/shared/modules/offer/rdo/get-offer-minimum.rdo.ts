import { Expose } from 'class-transformer';
import { CityType, OfferType } from '../../../types/index.js';

export class GetOfferMinimumRdo {
  @Expose()
    id: string;

  @Expose()
    title: string;

  @Expose()
    date: Date;

  @Expose()
    city: CityType;

  @Expose()
    previewLink: string;

  @Expose()
    isPremium: boolean;

  @Expose()
    isFavorite: boolean;

  @Expose()
    rate: number;

  @Expose()
    type: OfferType;

  @Expose()
    rentCost: number;

  @Expose()
    commentsCount: number;
}
