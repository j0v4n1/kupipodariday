import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '@app/offer/entities/offer.entity';
import { User } from '@app/user/entities/user.entity';
import { Wish } from '@app/wish/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, User, Wish])],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
