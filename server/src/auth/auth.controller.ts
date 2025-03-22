import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  ValidationPipe,
  UsePipes,
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
  async create(@Body() createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    return await this.userService.create(createUserDto);
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  signin(@Req() req: Request, @Res() res: Response) {
    const tokens = this.authService.auth(req.user as User);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ access_token: tokens.accessToken });
  }
}
