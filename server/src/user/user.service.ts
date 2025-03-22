import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@app/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@app/user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
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

    await this.userRepository.save(user);

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
