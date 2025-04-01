import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '@app/wish/entities/wish.entity';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), UserModule],
  controllers: [WishController],
  providers: [WishService],
  exports: [WishService],
})
export class WishModule {}
