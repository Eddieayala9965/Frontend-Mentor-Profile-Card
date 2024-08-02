import api from "./api";

export const login = async (username, password) => {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("username", username);
  params.append("password", password);
  const response = await api.post("/users/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response;
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
