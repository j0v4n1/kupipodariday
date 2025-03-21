import { UserEntity } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  auth(user: UserEntity) {
    return user as any;
  }
}
