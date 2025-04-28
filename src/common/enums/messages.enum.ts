export enum EBadRequestMessages {
  RegisterUsernameExists = 'You cannot set your username directly',
}

export enum EAuthMessages {
  InvalidMethod = 'Method is invalid',
  UserNotFound = 'User not found',
}

export enum ENotFoundMessages {
  InvalidEmail = 'Email is invalid',
  InvalidPhone = 'Phone is invalid',
  InvalidUsername = 'Username is invalid',
}

export enum EConflictMessages {
  UserAlreadyExists = 'User already exists',
}
