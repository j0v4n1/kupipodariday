import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@app/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { UpdateUserDto } from '@app/auth/dto/update-user.dto';
import { UserProfileResponseDto } from '@app/user/dto/user-profile.response.dto';
import dataSource from '@app/data-source';
import { Wish } from '@app/wish/entities/wish.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail) {
      throw new HttpException(
        'Пользователь с таким email уже зарегистрирован',
        HttpStatus.CONFLICT,
      );
    }

    const user = this.userRepository.create({
      ...createUserDto,
      about: createUserDto.about === '' ? undefined : createUserDto.about,
    });

    await this.userRepository.save(user);

    return user;
  }

  async findMany(query: string) {
    return await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async update(updateUserDto: UpdateUserDto, id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user)
      throw new HttpException(
        'Ошибка валидации переданных значений',
        HttpStatus.BAD_REQUEST,
      );

    Object.assign(user, updateUserDto);

    await this.userRepository.save(user);

    return user;
  }

  async getWishes(id: number) {
    return await dataSource
      .createQueryBuilder(Wish, 'wish')
      .leftJoinAndSelect('wish.owner', 'user')
      .where('user.id = :id', { id })
      .getMany();
  }

  async findByUsernameOrEmail(identifier: string) {
    const userByEmail = await this.userRepository.findOne({
      where: { email: identifier },
    });

    if (userByEmail) return userByEmail;

    const userByUsername = await this.userRepository.findOne({
      where: { username: identifier },
    });

    if (userByUsername) return userByUsername;

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }

  buildUserResponse(user: User): UserProfileResponseDto {
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
