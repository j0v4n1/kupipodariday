import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/user/entities/user.entity';

@UseGuards(JwtGuard)
@UsePipes(new ValidationPipe())
@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

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

  @Get(':id')
  async findOne(@Param() offer: { id: string }) {
    return await this.offerService.findOne(Number(offer.id));
  }

  @Get()
  async findAll() {
    return await this.offerService.findAll();
  }
}
