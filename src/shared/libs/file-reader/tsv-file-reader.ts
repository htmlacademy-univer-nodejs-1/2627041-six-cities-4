import { CityType } from '../../types/city-type.enum.js';
import { GoodsType } from '../../types/goods-type.enum.js';
import { OfferType } from '../../types/offer-type.enum.js';
import { Offer } from '../../types/offer.type.js';
import { UserType } from '../../types/user-type.enum.js';
import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row, index) => row.trim().length > 0 && index > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, date, city, photoLinks, previewLink, isPremium, isFavorite, rate, type, goods, roomsCount, personCount, rentCost, authorName, authorEmail, authorAvatar, authorPassword, authorType, commentsCount, location]) => ({
        title,
        description,
        date: new Date(date),
        city: CityType[city as keyof typeof CityType],
        photoLinks: photoLinks.split(';'),
        previewLink,
        isPremium: isPremium === 'true',
        isFavorite: isFavorite === 'true',
        rate: Number.parseInt(rate),
        type: OfferType[type as keyof typeof OfferType],
        goods: goods.split(';').map((good) => GoodsType[good as keyof typeof GoodsType]),
        roomsCount: Number.parseInt(roomsCount),
        personCount: Number.parseInt(personCount),
        rentCost: Number.parseInt(rentCost),
        author: {
            name: authorName,
            email: authorEmail,
            avatar: authorAvatar,
            password: authorPassword,
            type: UserType[authorType as keyof typeof UserType]
        },
        commentsCount: Number.parseInt(commentsCount),
        location: {
            latitude: Number.parseFloat(location.split(';')[0]),
            longitude: Number.parseFloat(location.split(';')[1])
        }
      }));
  }
}