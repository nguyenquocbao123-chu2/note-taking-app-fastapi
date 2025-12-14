// src/api/auth.js
import api from "./client";

export async function register(email, password, fullName) {
  const res = await api.post("/auth/register", {
    email,
    password,
    full_name: fullName || null,
  });
  return res.data;
}

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });

  const access_token = res?.data?.access_token;
  if (!access_token) throw new Error("Không nhận được access_token từ server");

  // ✅ Lưu token
  localStorage.setItem("access_token", access_token);

  // ✅ Lưu user để Layout hiện tên (tối thiểu phải có email)
  // Backend bạn có thể không trả user -> vẫn lưu email từ form login
  const safeUser = {
    email: email,
    full_name: res?.data?.user?.full_name || res?.data?.user?.name || null,
  };
  localStorage.setItem("user", JSON.stringify(safeUser));

  return res.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}
