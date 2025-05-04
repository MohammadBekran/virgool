export enum EEndpointKeys {
  // Auth
  PostUserExistence = 'user-existence',
  PostCheckOTP = 'check-otp',
  GetCheckLogin = 'check-login',
  // User
  UpdateProfile = '',
  GetProfile = 'profile',
  PatchChangeEmail = 'change-email',
  PostVerifyEmail = 'verify-email-otp',
  PatchChangePhone = 'change-phone',
  PostVerifyPhone = 'verify-phone',
  PatchChangeUsername = 'change-username',
  // Category
  PostCreateCategory = '',
  GetFindAllCategories = '',
  GetFindOneCategory = ':id',
  PatchUpdateCategory = ':id',
  DeleteRemoveCategory = ':id',
  // Blog
  PostCreateBlog = '',
  GetMyBlogs = 'my-blogs',
  GetBlogs = '',
  GetBlogByID = 'by-id/:id',
  GetBlogBySlug = 'by-slug/:slug',
  DeleteBlog = ':id',
  PutUpdateBlog = ':id',
  GetToggleLike = 'like/:id',
  GetToggleBookmark = 'bookmark/:id',
  // Comment
  PostCreateComment = '',
  GetFindComments = 'my-comments',
}
