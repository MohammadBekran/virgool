export enum EPublicMessages {
  OTPSentSuccessfully = 'OTP has been sent successfully',
  LoggedInSuccessfully = 'Logged in successfully',
  CreatedSuccessfully = 'Data has been created successfully',
  UpdatedSuccessfully = 'Data has been updated successfully',
  DeletedSuccessfully = 'Data has been deleted successfully',
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
  NotFound = 'Data not found',
}

export enum EConflictMessages {
  UserAlreadyExists = 'User already exists',
  CategoryAlreadyExists = 'Category with this title already exists',
}
