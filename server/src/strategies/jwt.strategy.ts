import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import 'dotenv/config';
import { UserService } from '@app/user/user.service';
import { JwtPayload } from '@app/common/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_ACCESS as string,
    });
  }

  validate(payload: JwtPayload) {
    const user = this.userService.findByUsernameOrEmail(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
