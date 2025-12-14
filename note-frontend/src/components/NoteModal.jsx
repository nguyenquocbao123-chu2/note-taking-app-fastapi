import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./NoteModal.css";

export default function NoteModal({ note, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [bg, setBg] = useState(note?.bg || "#ffffff");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const overlayRef = useRef(null);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setBg(note?.bg || "#ffffff");
  }, [note]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErr("");
      await onSave({ title, content, bg });
    } catch (e) {
      setErr(e?.message || "Lưu thất bại");
      setSaving(false);
    }
  };

  // click ngoài -> lưu giống Keep
  const clickOverlay = (e) => {
    if (e.target === overlayRef.current) handleSave();
  };

  return (
    <div className="note-modal-overlay" ref={overlayRef} onMouseDown={clickOverlay}>
      <div className="note-modal" style={{ background: bg }}>
        {err && <div className="note-modal-error">{err}</div>}

        <input
          className="note-modal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề"
          disabled={saving}
        />

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Ghi chú..."
          readOnly={saving}
        />

        <div className="note-modal-actions">
          <button className="danger" onClick={onDelete} disabled={saving}>Xoá</button>
          <div style={{ flex: 1 }} />
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
          <button className="ghost" onClick={onClose} disabled={saving}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
