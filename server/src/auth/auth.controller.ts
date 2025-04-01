import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  ValidationPipe,
  UsePipes,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { SignupUserResponseDto } from '@app/auth/dto/signup-user-response.dto';
import { UserService } from '@app/user/user.service';
import { Request, Response } from 'express';
import { LocalGuard } from '@app/auth/guards/local.guard';
import { AuthService } from '@app/auth/auth.service';
import { User } from '@app/user/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupUserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  async signin(@Req() request: Request, @Res() response: Response) {
    const tokens = await this.authService.auth(request.user as User);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return response.json({ access_token: tokens.accessToken });
  }

  @Post('refresh')
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Рефреш токен не найден');
    }
    const tokens = await this.authService.validateRefreshToken(refreshToken);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return response.json({ access_token: tokens.accessToken });
  }
}
