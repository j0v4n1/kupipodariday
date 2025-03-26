import { WishService } from './wish.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { CreateWishDto } from '@app/wish/dto/create-wish.dto';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/user/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() request: Request) {
    const { id } = request.user as User;
    await this.wishService.create(createWishDto, id);
    return {};
  }

  @Get(':id')
  async findOne(@Param() wishId: { id: string }, @Req() request: Request) {
    const userId = request.user as User;
    return this.wishService.findWish(Number(wishId.id), userId.id);
  }
}
