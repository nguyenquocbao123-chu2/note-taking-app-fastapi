import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await register(email, password, fullName);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.detail || "Đăng ký thất bại");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">Tạo tài khoản</div>

        {err && <div className="error-text">{err}</div>}

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
