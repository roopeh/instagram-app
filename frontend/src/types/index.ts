export type FormInput = {
  name: string,
  label: string,
  placeholder: string,
  initialValue: string,
  type: string,
};

export type FileInfo = {
  name: string,
  file: File,
};

export type ImageFile = {
  type: string,
  captionText: string,
  size: number,
  base64: string,
};

export type User = {
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  bioText: string,
  profilePhoto: Photo,
  coverPhoto: Photo,
  photos: Array<Photo>,
  photoCount: number,
  following: Array<User>,
  followingCount: number,
  followers: Array<User>,
  followersCount: number,
};

export type Comment = {
  id: string,
  author: User,
  date: number,
  message: string,
};

export type Like = {
  id: string,
  user: User,
  photo: Photo,
  likeDate: number,
};

export type Photo = {
  id: string,
  imageString: string,
  author: User,
  publishDate: number,
  captionText: string,
  likes: Array<Like>,
  likesCount: number,
  comments: Array<Comment>,
  commentsCount: number,
};
