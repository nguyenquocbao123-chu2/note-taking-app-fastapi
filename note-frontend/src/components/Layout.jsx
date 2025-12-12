import "./Layout.css";
import SearchBox from "./SearchBox";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children, search, setSearch }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="keep-app">
      {/* HEADER */}
      <header className="keep-header">
        <div className="keep-header-left">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <span className="keep-logo">📝</span>
          <span className="keep-title">Keep</span>
        </div>

        <SearchBox value={search} onChange={setSearch} />

       <div className="keep-header-right">
  <button className="icon-btn" title="Làm mới">
    🔄
  </button>

  <button className="icon-btn" title="Chế độ xem">
    ⬜
  </button>

  <button className="icon-btn" title="Cài đặt">
    ⚙️
  </button>

  <button
    className="logout-btn"
    onClick={() => {
      logout();
      navigate("/login");
    }}
  >
    Đăng xuất
  </button>
</div>

      </header>

      {/* BODY */}
      <div className="keep-body">
        {/* SIDEBAR */}
        <aside className={`keep-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
          <SidebarItem icon="💡" label="Ghi chú" active />
          <SidebarItem icon="⏰" label="Lời nhắc" />
          <SidebarItem icon="📦" label="Lưu trữ" />
          <SidebarItem icon="🗑️" label="Thùng rác" />
        </aside>

        {/* MAIN CONTENT */}
        {children}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div className={`keep-menu ${active ? "active" : ""}`}>
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{label}</span>
    </div>
  );
}
