import { loginUser, registerUser } from "./transactions";

export const login = async (username, password) => {
  const data = await loginUser(username, password);
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("username", username);
  return data;
};

export const register = async (username, password) => {
  return await registerUser(username, password);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};