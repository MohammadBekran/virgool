import { Injectable } from '@nestjs/common';

import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  async userExistence(authDto: AuthDto) {
    return authDto;
  }
}
