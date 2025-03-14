import Cookies from "js-cookie";

export const getAccessToken = async () => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("No access token found");
  }
  return token;
};

export const setAccessToken = (token: string) => {
  Cookies.set("access_token", token);
};

export const removeAccessToken = () => {
  Cookies.remove("access_token");
};
