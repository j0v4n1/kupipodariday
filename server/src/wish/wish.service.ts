import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '@app/wish/entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from '@app/wish/dto/create-wish.dto';
import { UserService } from '@app/user/user.service';
import { UpdateWishDto } from '@app/wish/dto/update-wish.dto';

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

  async findWish(wishId: number, userId: number) {
    const wish = await this.wishRepository.findOne({ where: { id: wishId } });
    const user = await this.userService.findUserById(userId);

    if (!wish || !user) {
      throw new HttpException(
        'Пользователь или подарок не найден',
        HttpStatus.NOT_FOUND,
      );
    }

    wish.owner = user;

    return wish;
  }

  isOwnerOfWish(ownerId: number, wishOwnerId: number): boolean {
    if (ownerId !== wishOwnerId) {
      throw new HttpException('Вы не автор подарка', HttpStatus.FORBIDDEN);
    }
    return true;
  }

  async update(userId: number, wishId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });

    if (!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    }

    this.isOwnerOfWish(userId, wish.owner.id);

    Object.assign(wish, updateWishDto);

    return wish;
  }
}
