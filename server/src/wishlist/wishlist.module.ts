import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from '@app/wishlist/entities/wishlist.entity';
import { UserModule } from '@app/user/user.module';
import { WishModule } from '@app/wish/wish.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), UserModule, WishModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
