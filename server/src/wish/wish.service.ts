import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '@app/wish/entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from '@app/wish/dto/create-wish.dto';
import { User } from '@app/user/entities/user.entity';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    const wish = this.wishRepository.create(createWishDto);
    wish.owner = user;
    await this.wishRepository.save(wish);
    return wish;
  }
}
