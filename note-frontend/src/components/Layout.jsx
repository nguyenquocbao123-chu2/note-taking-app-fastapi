import React from "react";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Note Taking App</h2>
        <button onClick={handleLogout}>Đăng xuất</button>
      </header>

      <main style={{ flex: 1, display: "flex" }}>{children}</main>
    </div>
  );
}
