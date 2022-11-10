interface TokenUser {
  id: string,
  username: string,
  firstName: string,
  profilePhoto?: string
}

const USER_KEY = "clientuserdata";

export const saveUserData = (userData: TokenUser): void => {
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
