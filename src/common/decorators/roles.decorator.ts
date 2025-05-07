import { SetMetadata } from '@nestjs/common';

import { ERole } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: ERole[]) =>
  SetMetadata(ROLES_KEY, roles);
