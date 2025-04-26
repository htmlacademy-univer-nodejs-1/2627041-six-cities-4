import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import {
  CityType,
  GoodsType,
  Location,
  OfferType,
} from "../../types/index.js";
import { UserEntity } from "../user/user.entity.js";

@modelOptions({
  schemaOptions: {
    collection: "offers",
  },
})
export class OfferEntity
  extends defaultClasses.TimeStamps
  implements defaultClasses.Base
{
  _id: Types.ObjectId;
  id: string;
  @prop({
    required: true,
    validate: {
      validator: (v) => {
        return v.length >= 10 && v.length <= 100;
      },
    },
  })
  public title: string;

  @prop({
    required: true,
    validate: {
      validator: (v) => {
        return v.length >= 20 && v.length <= 1024;
      },
    },
  })
  public description: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true, type: () => String, enum: CityType })
  public city: CityType;

  @prop({
    required: true,
    validate: {
      validator: (v) => {
        return v.length == 6;
      },
    },
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
    validate: {
      validator: (v) => {
        return v >= 1 && v <= 5;
      },
    },
  })
  public rate: number;

  @prop({ required: true, type: () => String, enum: OfferType })
  public type: OfferType;

  @prop({ required: true, type: () => Array<String> })
  public goods: GoodsType[];

  @prop({
    required: true,
    validate: {
      validator: (v) => {
        return v >= 1 && v <= 8;
      },
    },
  })
  public roomsCount: number;

  @prop({
    required: true,
    validate: {
      validator: (v) => {
        return v >= 1 && v <= 10;
      },
    },
  })
  public personCount: number;

  @prop({
    required: true,
    validate: {
      validator: (v) => {
        return v >= 100 && v <= 100_000;
      },
    },
  })
  public rentCost: number;

  @prop({
    required: true,
    ref: UserEntity,
  })
  public author!: Ref<UserEntity>;

  @prop({default: 0})
  public commentsCount: number;

  @prop()
  public location: Location;
}

export const OfferModel = getModelForClass(OfferEntity);