// src/components/Layout.jsx
import "./Layout.css";
import SearchBox from "./SearchBox";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import FolderTree from "./FolderTree";
import TagsModal from "./TagsModal";

export default function Layout({
  children,
  search,
  setSearch,
  notes = [],
  onSelectNote,
  activeView,
  setActiveView,

  tags = [],
  selectedTagId = null,
  onSelectTag,
}) {
  const navigate = useNavigate();

  // ✅ Desktop: open/collapsed. Mobile: drawer open/close
  // 0 = hidden, 1 = icon-only
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ (Fix) bạn đang dùng setDrawerOpen nhưng chưa khai báo -> thêm state này cho khỏi crash
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [tagsOpen, setTagsOpen] = useState(false);
  const [labelsExpanded, setLabelsExpanded] = useState(true);

  // ✅ LẤY USER ĐỂ HIỂN THỊ TRÊN HEADER
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  // ✅ auto đóng drawer khi resize lên desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setDrawerOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeDrawerOnMobile = () => {
    if (window.innerWidth <= 768) setDrawerOpen(false);
  };

  const filteredNotes = useMemo(() => {
    const list = Array.isArray(notes) ? notes : [];

    if (activeView === "trash") {
      return list.filter(
        (n) => n?.is_deleted === true || n?.deleted === true || !!n?.deleted_at
      );
    }

    if (activeView === "archive") {
      return list.filter((n) => n?.archived === true || n?.is_archived === true);
    }

    return list.filter(
      (n) =>
        !(n?.is_deleted === true || n?.deleted === true || !!n?.deleted_at) &&
        !(n?.archived === true || n?.is_archived === true)
    );
  }, [notes, activeView]);

  const sortedTags = useMemo(() => {
    const arr = Array.isArray(tags) ? tags : [];
    return [...arr].sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""), "vi")
    );
  }, [tags]);

  return (
    <div className="keep-app">
      {/* HEADER */}
      <header className="keep-header">
        <div className="keep-header-left">
          <button
            className="menu-btn"
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            ☰
          </button>

          <span className="keep-logo">📝</span>
          <span className="keep-title">Note-Taking </span>
        </div>

        <SearchBox value={search} onChange={setSearch} />

        <div className="keep-header-right">
          {/* ✅ HIỂN THỊ TÊN NGƯỜI ĐĂNG NHẬP */}
          <span className="header-user">
            👤 {user?.full_name || user?.email || "User"}
          </span>

          <button
            className="logout-btn"
            type="button"
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
        {/* ✅ overlay chỉ trên mobile khi drawer mở (nếu bạn cần dùng) */}
        {drawerOpen && window.innerWidth <= 768 && (
          <div
            className="keep-overlay"
            onClick={() => setDrawerOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close drawer"
          />
        )}

        {/* SIDEBAR */}
        <aside className={`keep-sidebar ${sidebarOpen ? "open" : "hidden"}`}>
          <div className="keep-system-menu">
            <SidebarItem
              icon="💡"
              label="Ghi chú"
              active={activeView === "notes"}
              onClick={() => {
                setActiveView?.("notes");
                onSelectTag?.(null);
                closeDrawerOnMobile();
              }}
            />
            <SidebarItem
              icon="📦"
              label="Lưu trữ"
              active={activeView === "archive"}
              onClick={() => {
                setActiveView?.("archive");
                onSelectTag?.(null);
                closeDrawerOnMobile();
              }}
            />
            <SidebarItem
              icon="🗑️"
              label="Thùng rác"
              active={activeView === "trash"}
              onClick={() => {
                setActiveView?.("trash");
                onSelectTag?.(null);
                closeDrawerOnMobile();
              }}
            />
          </div>

          <div className="sidebar-divider" />

          <div className="keep-tags">
            <SidebarItem
              icon="✏️"
              label="Chỉnh sửa nhãn"
              onClick={() => {
                setTagsOpen(true);
                closeDrawerOnMobile();
              }}
            />

            <button
              type="button"
              className={`keep-menu ${selectedTagId == null ? "active" : ""}`}
              onClick={() => {
                setLabelsExpanded((p) => !p);
                onSelectTag?.(null);
              }}
              style={{ justifyContent: "flex-start" }}
              title="Tất cả (bấm để xổ/thu nhãn)"
            >
              <span className="menu-icon">{labelsExpanded ? "▾" : "▸"}</span>
              <span className="menu-icon">🏷️</span>
              <span className="menu-text">Tất cả nhãn</span>
            </button>

            {labelsExpanded && (
              <div style={{ marginTop: 4, paddingLeft: 18 }}>
                {sortedTags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`keep-menu ${selectedTagId === t.id ? "active" : ""}`}
                    onClick={() => {
                      onSelectTag?.(t);
                      closeDrawerOnMobile();
                    }}
                    style={{ justifyContent: "flex-start" }}
                    title={`Lọc theo nhãn: ${t.name}`}
                  >
                    <span className="menu-icon" style={{ opacity: 0.7 }}>
                      •
                    </span>
                    <span className="menu-icon">🏷️</span>
                    <span className="menu-text">{t.name}</span>
                  </button>
                ))}

                {sortedTags.length === 0 && (
                  <div style={{ padding: "8px 14px", color: "#777", fontSize: 13 }}>
                    Chưa có nhãn
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="sidebar-divider" />

          <FolderTree
            notes={filteredNotes}
            onSelectNote={(n) => {
              onSelectNote?.(n);
              closeDrawerOnMobile();
            }}
            title={
              activeView === "trash"
                ? "Thùng rác"
                : activeView === "archive"
                ? "Lưu trữ"
                : "Ghi chú"
            }
          />
        </aside>

        {/* MAIN CONTENT */}
        {children}
      </div>

      <TagsModal open={tagsOpen} onClose={() => setTagsOpen(false)} tags={tags} />
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`keep-menu ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{label}</span>
    </button>
  );
}
