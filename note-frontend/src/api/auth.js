import api from "./client";

export async function register(email, password, fullName) {
  const res = await api.post("/auth/register", {
    email,
    password,
    full_name: fullName || null,
  });

  // ✅ backend register chỉ trả message, KHÔNG lưu token
  return res.data; // { message: "Đăng ký thành công..." }
}

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });

  const { access_token } = res.data;
  if (!access_token) throw new Error("Không nhận được access_token từ server");

  localStorage.setItem("access_token", access_token);
  return res.data;
}

export function logout() {
  localStorage.removeItem("access_token");
}
