import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

import { API_BEARER_AUTH } from '../constants/bearer-auth.constant';

export function AuthDecorator() {
  return applyDecorators(
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(API_BEARER_AUTH),
  );
}
