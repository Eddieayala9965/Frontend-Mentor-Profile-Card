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

export const createProfile = (profileData) => {
  return api.post("/profiles/create_profile", profileData, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
};

export const uploadProfilePicture = (profileId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/uploadfile/${profileId}`, formData, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = (userId, data) => {
  return api.put(`/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
};

export const updateProfile = (profileId, profileData) => {
  return api.put(
    `/profiles/update_profile/${profileId}/bio_and_address`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    }
  );
};

export const updateSocialMediaLinks = (profileId, data) => {
  return api.put(`/profiles/${profileId}/social_media_links`, data, {
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
