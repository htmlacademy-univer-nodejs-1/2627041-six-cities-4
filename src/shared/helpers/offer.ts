import { CityType, GoodsType, Offer, OfferType, UserType } from "../types/index.js";

export function createOffer(offerData: string): Offer {
    const [
        title,
        description,
        date,
        city,
        photoLinks,
        previewLink,
        isPremium,
        isFavorite,
        rate,
        type,
        goods,
        roomsCount,
        personCount,
        rentCost,
        authorName,
        authorEmail,
        authorAvatar,
        authorPassword,
        authorType,
        commentsCount,
        location,
    ] = offerData.replace('\n', '').split('\t');
    return {
    title,
    description,
    date: new Date(date),
    city: city as CityType,
    photoLinks: photoLinks.split(';'),
    previewLink,
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rate: Number.parseInt(rate, 10),
    type: type as OfferType,
    goods: goods
      .split(';')
      .map((good) => good as GoodsType),
    roomsCount: Number.parseInt(roomsCount, 10),
    personCount: Number.parseInt(personCount, 10),
    rentCost: Number.parseInt(rentCost, 10),
    author: {
      name: authorName,
      email: authorEmail,
      avatar: authorAvatar,
      password: authorPassword,
      type: authorType as UserType,
    },
    commentsCount: Number.parseInt(commentsCount, 10),
    location: {
      latitude: Number.parseFloat(location.split(';')[0]),
      longitude: Number.parseFloat(location.split(';')[1]),
    },
  }
}