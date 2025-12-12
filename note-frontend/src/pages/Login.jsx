import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();
  setErr("");

  localStorage.setItem("access_token", "fake-token");
  navigate("/");
};


  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">Đăng nhập</div>

        {err && <div className="error-text">{err}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <label>Mật khẩu</label>
          <input
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          <button className="auth-btn" type="submit">
            Đăng nhập
          </button>
        </form>

        <div className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}
