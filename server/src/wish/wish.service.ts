import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '@app/wish/entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from '@app/wish/dto/create-wish.dto';
import { UserService } from '@app/user/user.service';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UserService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    const wish = this.wishRepository.create(createWishDto);
    wish.owner = user;
    await this.wishRepository.save(wish);
    return wish;
  }

  async findWishById(id: number) {
    const wish = await this.wishRepository.findOne({ where: { id } });
    if (!wish)
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    return wish;
  }
}
