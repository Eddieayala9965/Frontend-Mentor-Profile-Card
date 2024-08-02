import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProfile = () => {
  return api.get("/profiles/get_profiles", {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
};

export const getUser = () => {
  return api.get("/users/get_user", {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
};

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;
