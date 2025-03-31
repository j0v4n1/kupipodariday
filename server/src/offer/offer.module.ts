import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '@app/offer/entities/offer.entity';
import { UserModule } from '@app/user/user.module';
import { WishModule } from '@app/wish/wish.module';
import { Wish } from '@app/wish/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish]), UserModule, WishModule],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
