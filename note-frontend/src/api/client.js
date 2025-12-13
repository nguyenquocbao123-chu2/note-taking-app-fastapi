import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Gắn token cho mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ BẮT BUỘC: xử lý token sai / hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Token invalid → logout");
      localStorage.removeItem("access_token");
      window.location.href = "/login"; // ép về login
    }
    return Promise.reject(error);
  }
);

export default api;
