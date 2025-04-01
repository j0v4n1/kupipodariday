import {
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(1)
  @MaxLength(64)
  readonly username: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(200)
  readonly about: string;

  @IsOptional()
  @IsUrl()
  readonly avatar: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @MinLength(8)
  readonly password: string;
}
