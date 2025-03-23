import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/user/entities/user.entity';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() request: Request,
  ) {
    const { id } = request.user as User;
    const { itemId } = createOfferDto;
    await this.offerService.create(createOfferDto, id, itemId);
    return {};
  }
}
