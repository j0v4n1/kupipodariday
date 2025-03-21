import { SignupUserResponseDto } from '@app/auth/dto/signup-user-response.dto';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Пользователь с таким email или username уже зарегистрирован',
        HttpStatus.CONFLICT,
      );
    }
    const user = this.userRepository.create({
      ...createUserDto,
      about: createUserDto.about === '' ? undefined : createUserDto.about,
    });
    return await this.userRepository.save(user);
  }

  buildSignupUserResponse(user: UserEntity): SignupUserResponseDto {
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
    };
  }
}
