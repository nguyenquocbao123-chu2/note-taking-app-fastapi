import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://note-taking-app-fastapi.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// GẮN TOKEN CHO MỌI REQUEST
// ===============================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// XỬ LÝ TOKEN HẾT HẠN
// ===============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // ⚠️ CHỈ logout nếu KHÔNG ở trang login
    if (status === 401 && window.location.pathname !== "/login") {
      console.warn("Token invalid / expired → logout");

      localStorage.removeItem("access_token");

      // tránh reload vô hạn
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }

    return Promise.reject(error);
  }
);

export default api;
