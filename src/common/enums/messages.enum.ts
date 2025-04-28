export enum EPublicMessages {
  OTPSentSuccessfully = 'OTP has been sent successfully',
  LoggedInSuccessfully = 'Logged in successfully',
}

export enum EBadRequestMessages {
  RegisterUsernameExists = 'You cannot set your username directly',
}

export enum EAuthMessages {
  InvalidMethod = 'Method is invalid',
  UserNotFound = 'User not found',
  CodeExpired = 'Code has been expired',
  TryAgain = 'Try again',
  LoginAgain = 'Login again',
  Login = 'Login to your account',
}

export enum ENotFoundMessages {
  InvalidEmail = 'Email is invalid',
  InvalidPhone = 'Phone is invalid',
  InvalidUsername = 'Username is invalid',
}

export enum EConflictMessages {
  UserAlreadyExists = 'User already exists',
}
