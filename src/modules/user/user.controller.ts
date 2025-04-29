import { Controller } from '@nestjs/common';

import { EControllersName } from 'src/common/enums/controller.enum';

import { UserService } from './user.service';

@Controller(EControllersName.User)
export class UserController {
  constructor(private readonly userService: UserService) {}
}
