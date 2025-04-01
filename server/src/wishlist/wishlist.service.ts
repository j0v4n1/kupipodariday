import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from '@app/wishlist/entities/wishlist.entity';
import { Repository } from 'typeorm';
import { UserService } from '@app/user/user.service';
import { WishService } from '@app/wish/wish.service';
import AppDataSource from '@app/data-source';
import { UpdateWishlistDto } from '@app/wishlist/dto/update-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly userService: UserService,
    private readonly wishService: WishService,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const user = await this.userService.findUserById(userId);

    const wishlist = this.wishlistRepository.create(createWishlistDto);

    const wishes = await Promise.all(
      createWishlistDto.itemsId.map((wish) => {
        return this.wishService.findWishById(wish);
      }),
    );

    wishlist.owner = user;

    wishlist.items = wishes;

    return await this.wishlistRepository.save(wishlist);
  }

  async getOne(wishlistId: number) {
    return await AppDataSource.getRepository(Wishlist)
      .createQueryBuilder('wishlists')
      .leftJoinAndSelect('wishlists.owner', 'user')
      .leftJoinAndSelect('wishlists.items', 'wish')
      .where('wishlists.id = :id', { id: wishlistId })
      .getOne();
  }

  async getAll() {
    return await AppDataSource.getRepository(Wishlist)
      .createQueryBuilder('wishlists')
      .leftJoinAndSelect('wishlists.owner', 'user')
      .leftJoinAndSelect('wishlists.items', 'wish')
      .getMany();
  }

  async update(
    userId: number,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findWishlistById(wishlistId);

    this.isOwnerOfWishlist(userId, wishlist.owner.id);

    Object.assign(wishlist, updateWishlistDto);

    return wishlist;
  }

  isOwnerOfWishlist(ownerId: number, wishlistOwnerId: number): boolean {
    if (ownerId !== wishlistOwnerId) {
      throw new HttpException('Вы не автор вишлиста', HttpStatus.FORBIDDEN);
    }
    return true;
  }

  async removeOne(userId: number, wishlistId: number) {
    const wishlist = await this.findWishlistById(wishlistId);

    this.isOwnerOfWishlist(userId, wishlist.owner.id);

    return this.wishlistRepository.remove(wishlist);
  }

  async findWishlistById(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wishlist) {
      throw new HttpException('Вишлист не найден', HttpStatus.NOT_FOUND);
    }

    return wishlist;
  }
}
