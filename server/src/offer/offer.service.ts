import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from '@app/offer/dto/create-offer.dto';
import { Repository } from 'typeorm';
import { Offer } from '@app/offer/entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '@app/user/user.service';
import { WishService } from '@app/wish/wish.service';
import { Wish } from '@app/wish/entities/wish.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UserService,
    private readonly wishService: WishService,
  ) {}
  async create(createOfferDto: CreateOfferDto, userId: number, wishId: number) {
    const user = await this.userService.findUserById(userId);
    const wish = await this.wishService.findWishById(wishId);

    const offer = this.offerRepository.create(createOfferDto);

    wish.raised += createOfferDto.amount;

    await this.wishRepository.save(wish);

    offer.user = user;

    offer.item = wish;

    return await this.offerRepository.save(offer);
  }
}
