import { AuthService } from '@app/auth/auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validatePassword(username, password);
    if (!user) {
      throw new HttpException('Некорректная пара логин и пароль', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
