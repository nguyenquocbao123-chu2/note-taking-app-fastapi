import React, { useState, useEffect } from "react";
import "./NoteEditor.css";

export default function NoteEditor({ note, onSave, onDelete, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setExpanded(true);
    } else {
      setTitle("");
      setContent("");
      setExpanded(false);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave({ title, content });
    setExpanded(false);
    setTitle("");
    setContent("");
  };

  const handleCancel = () => {
    setExpanded(false);
    setTitle("");
    setContent("");
    onCancel && onCancel();
  };

  return (
    <div className="keep-editor-wrapper">
      <div
        className={`keep-editor ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded(true)}
      >
        {expanded && (
          <input
            className="keep-title"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}

        <textarea
          className="keep-content"
          placeholder="Ghi chú..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {expanded && (
          <div className="keep-actions">
            {note && (
              <button className="danger" onClick={onDelete}>
                Xoá
              </button>
            )}
            <button onClick={handleSave}>Lưu</button>
            <button className="ghost" onClick={handleCancel}>
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
