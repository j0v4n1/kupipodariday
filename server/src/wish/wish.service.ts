import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '@app/wish/entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from '@app/wish/dto/create-wish.dto';
import { UserService } from '@app/user/user.service';
import { UpdateWishDto } from '@app/wish/dto/update-wish.dto';
import AppDataSource from '@app/data-source';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UserService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.userService.findUserById(userId);
    const wish = this.wishRepository.create(createWishDto);
    wish.owner = user;
    await this.wishRepository.save(wish);
    return wish;
  }

  async findWishById(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish)
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    return wish;
  }

  async findOne(wishId: number, userId: number) {
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

  async removeOne(userId: number, wishId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });

    if (!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    }

    this.isOwnerOfWish(userId, wish.owner.id);

    return this.wishRepository.remove(wish);
  }

  async isOriginalWish(wishId: number) {
    const wish = await this.findWishById(wishId);
    if (wish.originalId === null) {
      return true;
    }
    return false;
  }

  async hasUserCopiedWish(userId: number, wishId: number) {
    const wish = await this.findWishById(wishId);
    const user = await this.userService.findUserById(userId);
    if (wish.originalId === null) {
      const wishId = user.wishes.findIndex((el) => el.originalId === wish.id);
      if (wishId !== -1) {
        return true;
      }
    } else if (wish.originalId !== null) {
      const wishId = user.wishes.findIndex(
        (el) => el.originalId === wish.originalId,
      );
      if (wishId !== -1) {
        return true;
      }
    }
    return false;
  }

  async copyWish(wishId: number, userId: number) {
    const hasUserCopiedWish = await this.hasUserCopiedWish(userId, wishId);
    if (hasUserCopiedWish) {
      throw new HttpException(
        'Такой подарок у Вас уже есть',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isOriginalWish = await this.isOriginalWish(wishId);
    const user = await this.userService.findUserById(userId);
    const wish = await this.findWishById(wishId);
    if (wish.owner.id === userId) {
      throw new HttpException(
        'Нельзя копировать свой собственный подарок',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (isOriginalWish) {
      wish.copied++;
      await this.wishRepository.save(wish);
      // eslint-disable-next-line
      const { id, createdAt, updatedAt, copied, ...rest } = wish;
      const copiedWish = this.wishRepository.create({ ...rest });
      copiedWish.originalId = wishId;
      copiedWish.owner = user;
      await this.wishRepository.save(copiedWish);
      return copiedWish;
    } else {
      // eslint-disable-next-line
      const { id, createdAt, updatedAt, ...rest } = wish;
      const copiedWish = this.wishRepository.create({ ...rest });
      copiedWish.owner = user;
      await this.wishRepository.save(copiedWish);
      return copiedWish;
    }
  }

  async findLast() {
    const wishes = await AppDataSource.getRepository(Wish)
      .createQueryBuilder('wish')
      .orderBy('wish.createdAt', 'DESC')
      .where('wish.originalId IS NULL')
      .take(40)
      .getMany();
    // eslint-disable-next-line
    return wishes.map(({ originalId, ...rest }) => rest);
  }

  async findTop() {
    const wishes = await AppDataSource.getRepository(Wish)
      .createQueryBuilder('wish')
      .orderBy('wish.copied', 'DESC')
      .where('wish.originalId IS NULL')
      .take(20)
      .getMany();

    // eslint-disable-next-line
    return wishes.map(({ originalId, ...rest }) => rest);
  }
}
