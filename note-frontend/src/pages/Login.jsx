import { useEffect, useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ nhận thông báo từ Register chuyển qua
  useEffect(() => {
    if (location.state?.registered) {
      setSuccess(location.state?.message || "Đăng ký thành công. Vui lòng đăng nhập.");
      // xóa state để refresh không hiện lại
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    try {
      await login(email, password); // ✅ gọi API thật (auth.js tự lưu token)
      navigate("/"); // hoặc route trang chủ của bạn
    } catch (error) {
      // axios error
      const msg =
        error?.response?.data?.detail ||
        error?.message ||
        "Đăng nhập thất bại";
      setErr(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">Đăng nhập</div>

        {success && <div className="success-text">{success}</div>}
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
