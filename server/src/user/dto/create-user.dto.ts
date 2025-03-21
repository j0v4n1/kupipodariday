import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  readonly username: string;

  @MinLength(0)
  @MaxLength(200)
  readonly about: string;

  @IsUrl()
  readonly avatar: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
