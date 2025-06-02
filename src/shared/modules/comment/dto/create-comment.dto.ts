import { IsMongoId, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export default class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'min length is 5, max is 2024'})
  public text: string;

  @IsMongoId({ message: 'offerId field must be a valid id' })
  public offerId: string;

  @IsMongoId({ message: 'userId field must be a valid id' })
  public userId: string;

  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Rate must be an integer' })
  @Min(1, { message: 'Rate must be at least 1' })
  @Max(5, { message: 'Rate must be at most 5' })
  public rating: string;
}
