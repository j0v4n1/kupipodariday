import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOfferDto } from '@app/offer/dto/create-offer.dto';
import { Repository } from 'typeorm';
import { User } from '@app/user/entities/user.entity';
import { Offer } from '@app/offer/entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '@app/wish/entities/wish.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}
  async create(createOfferDto: CreateOfferDto, userId: number, wishId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    const wish = await this.wishRepository.findOne({ where: { id: wishId } });
    if (!wish)
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    const offer = this.offerRepository.create(createOfferDto);

    offer.user = user;

    offer.item = wish;

    return await this.offerRepository.save(offer);
  }
}
