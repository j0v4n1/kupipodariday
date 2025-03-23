import { MinLength, MaxLength, IsNumber, Min } from 'class-validator';
export class CreateWishDto {
  @MinLength(1)
  @MaxLength(250)
  name: string;

  link: string;

  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  description: string;
}
