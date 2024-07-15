import { getUser } from "./auth";

export const baseUrl = "http://127.0.0.1:8000/";

export const fetch_authenticated = (route, options) => {
  const { token } = getUser();
  return fetch(`${baseUrl}${route}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};
