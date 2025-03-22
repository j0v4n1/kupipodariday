import { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import 'dotenv/config';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  generateTokes(payload: { id: number }) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET_REFRESH,
    });

    return { accessToken, refreshToken };
  }

  async auth(user: User) {
    const payload = { id: user.id, username: user.username, email: user.email };
    const tokens = this.generateTokes(payload);
    await this.userRepository.update({ id: user.id }, { refreshToken: tokens.refreshToken });
    return { ...tokens };
  }
}
