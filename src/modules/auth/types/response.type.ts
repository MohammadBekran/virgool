export type TAuthResponse = {
  code: string;
  token: string;
};

export type TGoogleUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profile_image?: string;
  accessToken?: string;
};

export type TGoogleProfile = {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: {
    value: string;
  }[];
  photos: {
    value: string;
  }[];
};
