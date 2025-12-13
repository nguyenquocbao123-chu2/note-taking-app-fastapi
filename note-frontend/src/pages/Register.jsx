import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(""); // ✅ thêm
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    try {
      // ✅ chỉ gọi register (backend đã sửa để KHÔNG trả token)
      const res = await register(email, password, fullName);

      // ✅ lấy message từ backend nếu có
      const msg =
        res?.data?.message || "Đăng ký thành công. Vui lòng đăng nhập.";

      setSuccess(msg);

      // ✅ hiện thông báo + chuyển về trang login
      setTimeout(() => {
        navigate("/login", { state: { registered: true, message: msg } });
      }, 800);
    } catch (error) {
      setErr(error.response?.data?.detail || "Đăng ký thất bại");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">Đăng Kí</div>

        {err && <div className="error-text">{err}</div>}
        {success && <div className="success-text">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label>Họ tên</label>
          <input
            placeholder="Nhập họ tên..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label>Email</label>
          <input
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <label>Mật khẩu</label>
          <input
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <button className="auth-btn" type="submit">Đăng ký</button>
        </form>

        <div className="auth-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
