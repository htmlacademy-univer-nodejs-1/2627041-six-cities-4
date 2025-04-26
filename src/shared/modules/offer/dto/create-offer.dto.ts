import { Location } from "../../../types/location.type.js";
import { OfferType } from "../../../types/offer-type.enum.js";

export class CreateOfferDto {
    title: string;
    description: string;
    date: Date;
    city: string;
    photoLinks: string[];
    previewLink: string;
    isPremium: boolean;
    isFavorite: boolean;
    rate: number;
    type: OfferType;
    goods: string[];
    roomsCount: number;
    personCount: number;
    rentCost: number;
    authorId: string;
    commentsCount: number;
    location: Location;
}