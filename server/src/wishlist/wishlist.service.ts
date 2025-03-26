import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from '@app/wishlist/entities/wishlist.entity';
import { Repository } from 'typeorm';
import { UserService } from '@app/user/user.service';
import { WishService } from '@app/wish/wish.service';
import AppDataSource from '@app/data-source';

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

  async getAll() {
    return await AppDataSource.getRepository(Wishlist)
      .createQueryBuilder('wishlists')
      .leftJoinAndSelect('wishlists.owner', 'user')
      .leftJoinAndSelect('wishlists.items', 'wish')
      .getMany();
  }
}
