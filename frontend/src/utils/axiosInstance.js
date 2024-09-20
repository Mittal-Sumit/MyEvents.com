// src/utils/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const navigate = useNavigate();

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post("token/refresh/", {
          refresh: sessionStorage.getItem("refreshToken"),
        });
        const { access } = response.data;
        sessionStorage.setItem("accessToken", access);
        axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        navigate("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
