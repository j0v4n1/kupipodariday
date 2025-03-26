import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
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

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getUserProfile(
    @Req() request: Request,
  ): Promise<UserProfileResponseDto> {
    const { username } = request.user as User;
    const user = await this.userService.findUser(username);
    if (!user) {
      throw new HttpException(
        'Ошибка валидации переданных значений',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.buildUserResponse(user);
  }

  @UsePipes(new ValidationPipe())
  @Patch('me')
  async update(@Body() updateUserDto: UpdateUserDto, @Req() request: Request) {
    const { id } = request.user as User;
    const user = await this.userService.update(updateUserDto, id);
    return this.userService.buildUserResponse(user);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.userService.findUser(username);
    const userResponse = this.userService.buildUserResponse(user);
    // eslint-disable-next-line
    const { email, ...userWithoutEmail } = userResponse;
    return userWithoutEmail;
  }

  @Post('find')
  async findMany(@Body('query') query: string) {
    return await this.userService.findMany(query);
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() request: Request) {
    const { id } = request.user as User;
    return await this.userService.getWishes(id);
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    const user = await this.userService.findUser(username);
    return await this.userService.getWishes(user.id);
  }
}
