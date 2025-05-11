import axiosInstance from "./axiosInstance";

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const registerUser = (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const uploadProfilePic = (formData) => {
  return axiosInstance.post("/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",    
     },
  });
}
