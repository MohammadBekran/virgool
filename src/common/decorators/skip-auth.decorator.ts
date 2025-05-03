import { SetMetadata } from '@nestjs/common';

import { SKIP_AUTH } from '../constants/skip-auth.constant';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
