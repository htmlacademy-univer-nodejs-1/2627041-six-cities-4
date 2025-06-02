import { Expose, Type } from 'class-transformer';
import { Location, OfferType } from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

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

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
    author: UserRdo;

  @Expose()
    commentsCount: number;

  @Expose()
    location: Location;
}
