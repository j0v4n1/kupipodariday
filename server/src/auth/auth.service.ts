import { JwtPayload } from '@app/common/types';
import { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';
import { HttpException, Injectable } from '@nestjs/common';
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
    const user = await this.userService.findUser(username);
    if (!user) throw new HttpException('Пользователь не найден', 404);
    const isPasswordCorrect = await compare(password, user.password!);
    if (isPasswordCorrect) {
      delete user.password;
      return user;
    }
    return null;
  }

  generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET_REFRESH,
    });

    return { accessToken, refreshToken };
  }

  async auth(user: User) {
    const payload = { id: user.id, username: user.username, email: user.email };
    const tokens = this.generateTokens({ ...payload });
    const userWithoutToken = await this.userService.findUserById(user.id);
    userWithoutToken.refreshToken = tokens.refreshToken;
    await this.userRepository.save(userWithoutToken);
    return { ...tokens };
  }

  async validateRefreshToken(token: string) {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_REFRESH,
    });
    const user = await this.userService.findUserById(payload.id);
    const tokens = this.generateTokens({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    user.refreshToken = tokens.refreshToken;
    await this.userRepository.save(user);
    return tokens;
  }
}
