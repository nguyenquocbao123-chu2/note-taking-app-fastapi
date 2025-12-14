import React, { useEffect, useMemo, useState } from "react";
import "./TagsModal.css";
import { createTag, deleteTag, getTags, renameTag } from "../api/tags";

export default function TagsModal({ open, onClose, tags: tagsProp, onReload }) {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const sorted = useMemo(() => {
    const arr = Array.isArray(tags) ? tags : [];
    return [...arr].sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""), "vi")
    );
  }, [tags]);

  async function load() {
    setErr("");
    try {
      // nếu NotesPage truyền tags xuống thì ưu tiên dùng luôn (nhanh + đỡ gọi API)
      if (Array.isArray(tagsProp)) {
        setTags(tagsProp);
        return;
      }

      const data = await getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Không tải được nhãn");
    }
  }

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleCreate() {
    const v = name.trim();
    if (!v) return;

    setLoading(true);
    setErr("");
    try {
      // createTag nhận STRING
      await createTag(v);
      setName("");

      // reload danh sách tags ở NotesPage (nếu có)
      if (typeof onReload === "function") await onReload();
      await load();
    } catch (e) {
      setErr(e?.response?.data?.detail || "Tạo nhãn thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function handleRename(tagId, oldName = "") {
    const newName = prompt("Đổi tên nhãn:", oldName);
    if (newName == null) return;

    const v = newName.trim();
    if (!v) return;

    setLoading(true);
    setErr("");
    try {
      // renameTag nhận STRING
      await renameTag(tagId, v);

      if (typeof onReload === "function") await onReload();
      await load();
    } catch (e) {
      setErr(e?.response?.data?.detail || "Đổi tên thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(tagId) {
    if (!window.confirm("Xóa nhãn này?")) return;

    setLoading(true);
    setErr("");
    try {
      await deleteTag(tagId);

      if (typeof onReload === "function") await onReload();
      await load();
    } catch (e) {
      setErr(e?.response?.data?.detail || "Xóa thất bại");
    } finally {
      setLoading(false);
    }
  }

  // Enter để tạo nhanh
  function onKeyDown(e) {
    if (e.key === "Enter") handleCreate();
  }

  if (!open) return null;

  return (
    <div className="tm-backdrop" onMouseDown={onClose}>
      <div className="tm-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="tm-header">
          <div className="tm-title">Chỉnh sửa nhãn</div>
          <button className="tm-icon" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="tm-create">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tạo nhãn mới"
            className="tm-input"
          />
          <button
            className="tm-btn"
            type="button"
            onClick={handleCreate}
            disabled={loading}
            title="Tạo"
          >
            ✓
          </button>
        </div>

        {err && <div className="tm-err">{err}</div>}

        <div className="tm-list">
          {sorted.map((t) => (
            <div key={t.id} className="tm-row">
              <div className="tm-name">🏷️ {t.name}</div>
              <div className="tm-actions">
                <button
                  className="tm-action"
                  type="button"
                  onClick={() => handleRename(t.id, t.name)}
                  disabled={loading}
                  title="Đổi tên"
                >
                  ✏️
                </button>
                <button
                  className="tm-action"
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  disabled={loading}
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="tm-empty">Chưa có nhãn nào</div>
          )}
        </div>

        <div className="tm-footer">
          <button className="tm-close" type="button" onClick={onClose}>
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}
