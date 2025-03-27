import { WishService } from './wish.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateWishDto } from '@app/wish/dto/create-wish.dto';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/user/entities/user.entity';
import { UpdateWishDto } from '@app/wish/dto/update-wish.dto';

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

  @Patch(':id')
  async update(
    @Param() wish: { id: string },
    @Req() request: Request,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const user = request.user as User;
    return this.wishService.update(user.id, Number(wish.id), updateWishDto);
  }
}
