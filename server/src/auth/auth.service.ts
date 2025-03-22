import { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async validatePassword(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    const isPasswordCorrect = await compare(password, user.password);
    if (isPasswordCorrect) {
      // eslint-disable-next-line
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  generateTokes(payload: { [key: string]: number }) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET_REFRESH,
    });

    return { accessToken, refreshToken };
  }

  auth(user: User) {
    const payload = { sub: user.id };
    const tokens = this.generateTokes(payload);
    return { ...tokens };
  }
}
