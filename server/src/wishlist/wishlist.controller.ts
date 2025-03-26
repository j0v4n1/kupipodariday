import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/user/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() request: Request,
  ) {
    const { id } = request.user as User;
    return this.wishlistService.create(createWishlistDto, id);
  }

  @Get()
  async getAll() {
    return await this.wishlistService.getAll();
  }
}
