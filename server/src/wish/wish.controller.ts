import { WishService } from './wish.service';
import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { CreateWishDto } from '@app/wish/dto/create-wish.dto';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/user/entities/user.entity';

@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createWishDto: CreateWishDto, @Req() request: Request) {
    const { id } = request.user as User;
    await this.wishService.create(createWishDto, id);
    return {};
  }
}
