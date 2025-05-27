import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { Location } from '../../../types/location.type.js';
import { OfferType } from '../../../types/offer-type.enum.js';
import { CityType } from '../../../types/city-type.enum.js';
import { GoodsType } from '../../../types/index.js';

export class CreateOrUpdateOfferDto {
  @Length(10, 100, { message: 'title length must be between 10 and 100' })
  title: string;

  @Length(20, 1024, { message: 'description length must be between 20 and 1024' })
  description: string;

  @IsDateString()
  date: Date;

  @IsEnum(CityType, { message: 'City is required and should be from 6 sities' })
  city: CityType;

  @IsArray({ message: 'photoLinks must be an array' })
  @ArrayMinSize(6, { message: 'photoLinks must have exactly 6 elements' })
  @ArrayMaxSize(6, { message: 'photoLinks must have exactly 6 elements' })
  @IsString({ each: true, message: 'photoLinks is required'})
  photoLinks: string[];

  @IsString({ message: 'previewLink is required' })
  previewLink: string;

  @IsBoolean()
  isPremium: boolean;

  @IsBoolean()
  isFavorite: boolean;

  @IsNotEmpty({ message: 'Rate is required' })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Rate must be a number' })
  @Min(1, { message: 'Rate must be at least 1' })
  @Max(5, { message: 'Rate must be at most 5' })
  rate: number;

  @IsEnum(OfferType)
  type: OfferType;

  @IsNotEmpty({ message: 'Goods are required' })
  @IsArray({ message: 'Goods must be an array' })
  @ArrayMinSize(1, { message: 'At least one good is required' })
  @IsEnum(GoodsType, { each: true, message: 'Each good must be one of the allowed values' })
  goods: string[];

  @IsNotEmpty({ message: 'Rooms count is required' })
  @IsNumber({}, { message: 'Rooms count must be a number' })
  @Min(1, { message: 'Rooms count must be at least 1' })
  @Max(8, { message: 'Rooms count must be at most 8' })
  roomsCount: number;

  @IsNotEmpty({ message: 'Person count is required' })
  @IsNumber({}, { message: 'Person count must be a number' })
  @Min(1, { message: 'Person count must be at least 1' })
  @Max(10, { message: 'Person count must be at most 10' })
  personCount: number;

  @IsNotEmpty({ message: 'Rent cost is required' })
  @IsNumber({}, { message: 'Rent cost must be a number' })
  @Min(100, { message: 'Rent cost must be at least 100' })
  @Max(100000, { message: 'Rent cost must be at most 100000' })
  rentCost: number;

  @IsMongoId({message: 'authorId must be MongoId'})
  authorId: string;


  commentsCount: number;

  @IsNotEmpty({ message: 'Location is required' })
  location: Location;
}
