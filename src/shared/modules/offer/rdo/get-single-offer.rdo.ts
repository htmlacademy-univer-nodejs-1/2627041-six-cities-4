import { Expose } from 'class-transformer';
import { Location, OfferType } from '../../../types/index.js';

export class GetSingleOfferRdo {
  @Expose()
    id: string;

  @Expose()
    title: string;

  @Expose()
    description: string;

  @Expose()
    date: Date;

  @Expose()
    city: string;

  @Expose()
    photoLinks: string[];

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
    goods: string[];

  @Expose()
    roomsCount: number;

  @Expose()
    personCount: number;

  @Expose()
    rentCost: number;

  //authorId: string;

  @Expose()
    commentsCount: number;

  @Expose()
    location: Location;
}
