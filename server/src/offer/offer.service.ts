import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOfferDto } from '@app/offer/dto/create-offer.dto';
import { Repository } from 'typeorm';
import { Offer } from '@app/offer/entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '@app/user/user.service';
import { WishService } from '@app/wish/wish.service';
import { Wish } from '@app/wish/entities/wish.entity';
import AppDataSource from '@app/data-source';

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

  async findOfferById(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: { item: true, user: true },
    });
    if (!offer) {
      throw new HttpException('Предложение не найдено', HttpStatus.NOT_FOUND);
    }
    return offer;
  }

  async findOne(offerId: number) {
    return await this.findOfferById(offerId);
  }

  async findAll() {
    return await AppDataSource.getRepository(Offer)
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.user', 'user')
      .leftJoinAndSelect('offer.item', 'wish')
      .getMany();
  }
}
