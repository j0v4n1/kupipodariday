import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { SignupUserResponseDto } from '@app/auth/dto/signup-user-response.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    const user = await this.authService.signup(createUserDto);
    return this.authService.buildSignupUserResponse(user);
  }
}
