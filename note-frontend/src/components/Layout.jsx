import React from "react";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="keep-app">
      {/* HEADER */}
      <header className="keep-header">
        <div className="keep-header-left">
          <span className="keep-logo">📝</span>
          <span className="keep-title">Keep</span>
        </div>

        <div className="keep-header-right">
          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="keep-body">{children}</div>
    </div>
  );
}
