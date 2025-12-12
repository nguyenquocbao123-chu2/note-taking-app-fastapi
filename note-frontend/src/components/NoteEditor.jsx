import React, { useState, useEffect } from "react";

export default function NoteEditor({ note, onSave, onDelete, onNew }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSave = () => {
    onSave({ title, content });
  };

  return (
    <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={onNew} style={{ marginRight: "10px" }}>
          + Ghi chú mới
        </button>
        {note && (
          <button onClick={onDelete} style={{ backgroundColor: "#ffcccc" }}>
            Xoá
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Tiêu đề..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "8px",
          fontSize: "16px",
        }}
      />

      <textarea
        placeholder="Nội dung ghi chú..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          flex: 1,
          padding: "8px",
          resize: "none",
          fontFamily: "inherit",
        }}
      />

      <button
        onClick={handleSave}
        style={{ marginTop: "10px", alignSelf: "flex-start" }}
      >
        Lưu
      </button>
    </div>
  );
}
