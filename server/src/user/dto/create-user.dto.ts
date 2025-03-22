import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsUrl, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  readonly username: string;

  @IsOptional()
  @MaxLength(200)
  readonly about: string;

  @IsOptional()
  @IsUrl()
  readonly avatar: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
