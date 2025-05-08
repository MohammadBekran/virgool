import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type VerifyCallback } from 'passport-google-oauth20';

import type { TGoogleProfile } from '../types/response.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: TGoogleProfile,
    done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile;
    const { givenName: firstName, familyName: lastName } = name;

    const user = {
      id,
      email: emails[0].value,
      firstName,
      lastName,
      profileImage: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
