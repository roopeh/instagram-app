interface TokenUser {
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  bioText: string,
  profilePhoto?: string,
  coverPhoto?: string,
}

const USER_KEY = "clientuserdata";

export const saveUserData = (data: any): void => {
  const userData: TokenUser = {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    bioText: data.bioText,
    profilePhoto: data.profilePhoto ? data.profilePhoto.imageString : null,
    coverPhoto: data.coverPhoto ? data.coverPhoto.imageString : null,
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
