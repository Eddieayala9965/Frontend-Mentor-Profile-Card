import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/users/login", { username, password });
  localStorage.setItem("token"), response.data.access_token;
  return response.data;
};

export const signup = async (username, password) => {
  const response = await api.post("/users/register", { username, password });
  return response;
};

export const getProfile = async () => {
  const response = await api.get("/profiles/get_profiles");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
