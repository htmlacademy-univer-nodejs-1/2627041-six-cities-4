import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CityType, GoodsType, Location, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity
  extends defaultClasses.TimeStamps
  implements defaultClasses.Base {
  _id: Types.ObjectId;
  id: string;
  @prop({
    required: true,
  })
  public title: string;

  @prop({
    required: true,
  })
  public description: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true, type: () => String, enum: CityType })
  public city: CityType;

  @prop({
    required: true,
  })
  public photoLinks: string[];

  @prop({ required: true })
  public previewLink: string;

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true })
  public isFavorite: boolean;

  @prop({
    required: true,
  })
  public rate: number;

  @prop({ required: true, type: () => String, enum: OfferType })
  public type: OfferType;

  @prop({ required: true, type: () => Array<string> })
  public goods: GoodsType[];

  @prop({
    required: true,
  })
  public roomsCount: number;

  @prop({
    required: true,
  })
  public personCount: number;

  @prop({
    required: true,
  })
  public rentCost: number;

  @prop({
    required: true,
    ref: UserEntity,
  })
  public authorId: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentsCount: number;

  @prop()
  public location: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
