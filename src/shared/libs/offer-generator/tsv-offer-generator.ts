import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { MockServerData } from '../../types/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 999999;

const MIN_RATE = 1;
const MAX_RATE = 5;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_ROOM_COUNT = 1;
const MAX_ROOM_COUNT = 8;

const MIN_PERSON_COUNT = 1;
const MAX_PERSON_COUNT = 10;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const date = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(this.mockData.cities);
    const photoLinks = getRandomItems(this.mockData.photoLinks).join(';');
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const isPremium = generateRandomValue(0, 1) === 0;
    const isFavorite = generateRandomValue(0, 1) === 0;
    const rate = generateRandomValue(MIN_RATE, MAX_RATE);
    const type = getRandomItem<string>(this.mockData.types);
    const goods = getRandomItems(this.mockData.goods).join(';');
    const roomCount = generateRandomValue(MIN_ROOM_COUNT, MAX_ROOM_COUNT);
    const personCount = generateRandomValue(MIN_PERSON_COUNT, MAX_PERSON_COUNT);
    const rentCost = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const authorName = getRandomItem<string>(this.mockData.authorNames);
    const authorEmail = getRandomItem<string>(this.mockData.authorEmails);
    const authorAvatar = getRandomItem<string>(this.mockData.authorAvatars);
    const authorPassword = getRandomItem<string>(this.mockData.authorPasswords);
    const authorType = getRandomItem<string>(this.mockData.authorTypes);
    const commentsCount = generateRandomValue(0, 25);
    const latitude = generateRandomValue(-90, 90, 4);
    const longitude = generateRandomValue(-180, 180, 4);
    const location = `${latitude};${longitude}`;
    return [
      title,
      description,
      date,
      city,
      photoLinks,
      previewImage,
      isPremium,
      isFavorite,
      rate,
      type,
      goods,
      roomCount,
      personCount,
      rentCost,
      authorName,
      authorEmail,
      authorAvatar,
      authorPassword,
      authorType,
      commentsCount,
      location,
    ].join('\t');
  }
}
