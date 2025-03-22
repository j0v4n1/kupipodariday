import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { SignupUserResponseDto } from '@app/auth/dto/signup-user-response.dto';
import { UserService } from '@app/user/user.service';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    return await this.userService.create(createUserDto);
  }
}
