import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '@app/app.service';
import { AppController } from '@app/app.controller';
import { UserModule } from '@app/user/user.module';
import { WishModule } from '@app/wish/wish.module';
import { WishlistModule } from '@app/wishlist/wishlist.module';
import { OfferModule } from '@app/offer/offer.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { PassportModule } from './passport/passport.module';
import AppDataSource from '@app/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    WishModule,
    WishlistModule,
    OfferModule,
    AuthModule,
    JwtModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
