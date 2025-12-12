import api from "./client";

export async function register(email, password, fullName) {
  const res = await api.post("/auth/register", {
    email,
    password,
    full_name: fullName || null,
  });
  const { access_token } = res.data;
  localStorage.setItem("access_token", access_token);
  return res.data;
}

export async function login(email, password) {
  const res = await api.post("/auth/login", {
    email,
    password,
  });
  const { access_token } = res.data;
  localStorage.setItem("access_token", access_token);
  return res.data;
}

export function logout() {
  localStorage.removeItem("access_token");
}
