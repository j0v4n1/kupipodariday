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
  Delete,
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

  @Get('last')
  async findLast() {
    return await this.wishService.findLast();
  }

  @Get('top')
  async findTop() {
    return await this.wishService.findTop();
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

  @Delete(':id')
  async removeOne(@Param() wish: { id: string }, @Req() request: Request) {
    const user = request.user as User;
    return this.wishService.removeOne(user.id, Number(wish.id));
  }

  @Post(':id/copy')
  async copyWish(@Param() wish: { id: string }, @Req() request: Request) {
    const user = request.user as User;
    await this.wishService.copyWish(Number(wish.id), user.id);
    return {};
  }

  @Get(':id')
  async findOne(@Param() wishId: { id: string }, @Req() request: Request) {
    const userId = request.user as User;
    return this.wishService.findOne(Number(wishId.id), userId.id);
  }
}
