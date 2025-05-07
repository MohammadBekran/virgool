export enum EPublicMessages {
  OTPSentSuccessfully = 'OTP has been sent successfully',
  LoggedInSuccessfully = 'Logged in successfully',
  CreatedSuccessfully = 'Data has been created successfully',
  UpdatedSuccessfully = 'Data has been updated successfully',
  DeletedSuccessfully = 'Data has been deleted successfully',
  PostLikedSuccessfully = 'Post has been liked successfully',
  PostDislikedSuccessfully = 'Post has been disliked successfully',
  PostBookmarkedSuccessfully = 'Post has been bookmarked successfully',
  PostDisBookmarkedSuccessfully = 'Post has been removed from your bookmarked list successfully',
  CommentCreated = 'Comment has been created successfully',
  UserFollowed = 'User has been followed successfully',
  UserUnFollowed = 'User has been unfollowed successfully',
}

export enum EBadRequestMessages {
  RegisterUsernameExists = 'You cannot set your username directly',
  SomethingWentWrong = 'Something went wrong',
  InvalidID = 'Invalid id',
  CommentAlreadyAccepted = 'Comment already accepted',
  CommentAlreadyRejected = 'Comment already rejected',
  CannotFollowYourself = 'You cannot follow yourself',
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
  EmailUsed = 'This email has been used before',
  PhoneUsed = 'This phone has been used before',
  UsernameUsed = 'This username has been used before',
}

export enum EValidationMessages {
  InvalidImageFormat = `Format doesn't support. Supported format are png, jpg, jpeg and webp.`,
  InvalidEmail = 'Invalid email',
  InvalidPhone = 'Invalid phone',
}

export enum EForbiddenMessages {
  AccessDenied = 'Access denied: insufficient role',
}
