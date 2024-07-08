export type User = {
  address: string;
  date_joined: string;
  email: string;
  first_name: string;
  groups: string[];
  id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
  last_name: string;
  passport: string | null;
  user_permissions: string[];
  username: string;
};
export const getUser: () => { user: User; token: string } | null = () => {
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (userString && token) {
    const user = JSON.parse(userString);
    return { user, token };
  } else {
    return null;
  }
};

export const signInUser = (user: User, token: string) => {
  if (!user || !token) {
    throw "User Object not passed";
  }
  const userString = JSON.stringify(user);
  localStorage.setItem("user", userString);
  localStorage.setItem("token", token);
  return user;
};

export const signOut = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  } catch (e) {
    return e;
  }
};
