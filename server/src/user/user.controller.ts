import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/user/entities/user.entity';
import { UserProfileResponseDto } from '@app/user/dto/user-profile.response.dto';
import { UpdateUserDto } from '@app/auth/dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getUserProfile(@Req() req: Request): Promise<UserProfileResponseDto> {
    const { username } = req.user as User;
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new HttpException('Ошибка валидации переданных значений', HttpStatus.BAD_REQUEST);
    }
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
    };
  }

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Patch('me')
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const { id } = req.user as User;
    const user = await this.userService.update(updateUserDto, id);
    return this.userService.buildUserResponse(user);
  }
}
