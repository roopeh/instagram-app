import { Photo, User } from "../types";

interface TokenUser {
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  bioText: string,
  profilePhoto?: Photo,
  coverPhoto?: Photo,
  following: Array<Pick<User, "id">>,
}

const USER_KEY = "clientuserdata";

export const saveUserData = (data: TokenUser): void => {
  const userData: TokenUser = {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    bioText: data.bioText,
    profilePhoto: data.profilePhoto,
    coverPhoto: data.coverPhoto,
    following: data.following,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserData = (): TokenUser | null => {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) {
    return null;
  }

  return JSON.parse(userData);
};

export const removeUserData = (): void => {
  localStorage.removeItem(USER_KEY);
};
