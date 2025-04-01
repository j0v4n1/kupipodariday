import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/user/entities/user.entity';
import { UpdateWishlistDto } from '@app/wishlist/dto/update-wishlist.dto';

@UseGuards(JwtGuard)
@UsePipes(new ValidationPipe())
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

  @Get(':id')
  async getOne(@Param() wishlist: { id: string }) {
    const wishlistId = Number(wishlist.id);

    return await this.wishlistService.getOne(wishlistId);
  }

  @Get()
  async getAll() {
    return await this.wishlistService.getAll();
  }

  @Post(':id')
  async update(
    @Param() wishlist: { id: string },
    @Req() request: Request,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const user = request.user as User;
    return await this.wishlistService.update(
      user.id,
      Number(wishlist.id),
      updateWishlistDto,
    );
  }

  @Delete(':id')
  async removeOne(@Param() wishlist: { id: string }, @Req() request: Request) {
    const user = request.user as User;
    return this.wishlistService.removeOne(user.id, Number(wishlist.id));
  }
}
