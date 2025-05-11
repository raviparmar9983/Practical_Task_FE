import axiosInstance from "./axiosInstance";

export const uploadGameData = (data) => {
    return axiosInstance.post("/quiz", data);
  };

export const getGameData=(page = 1, limit = 1) => {
  
    return axiosInstance.get(`quiz?page=${page}&limit=${limit}`);
  };