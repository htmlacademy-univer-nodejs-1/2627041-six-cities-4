import { defaultClasses, modelOptions, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { CityType, GoodsType, Location, Offer, OfferType, User } from "../../types/index.js";

@modelOptions({
    schemaOptions: {
      collection: 'offers'
    }
  })
export class OfferEntity extends defaultClasses.TimeStamps implements Offer, defaultClasses.Base{
    _id: Types.ObjectId;
    id: string;
    @prop()
    title: string;

    @prop()
    description: string;

    @prop()
    date: Date;

    @prop()
    city: CityType;

    @prop()
    photoLinks: string[];

    @prop()
    previewLink: string;

    @prop()
    isPremium: boolean;
    
    @prop()
    isFavorite: boolean;

    @prop()
    rate: number;

    @prop()
    type: OfferType;

    @prop()
    goods: GoodsType[];

    @prop()
    roomsCount: number;

    @prop()
    personCount: number;

    @prop()
    rentCost: number;

    @prop()
    author: User;

    @prop()
    commentsCount: number;
    
    @prop()
    location: Location;
}