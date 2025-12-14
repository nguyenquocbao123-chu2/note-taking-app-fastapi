import React from "react";
import "./NoteList.css";

export default function NoteList({ notes, onSelect }) {
  if (!notes || notes.length === 0) {
    return <p className="keep-empty">🗒️ Chưa có ghi chú nào</p>;
  }

  return (
    <div className="keep-notes-grid">
      {notes.map((note) => (
        <button
          key={note.id}
          type="button"
          className="keep-note-card"
          onClick={() => onSelect(note)}
          style={{ background: note.bg || "#ffffff" }}   // ✅ THÊM DÒNG NÀY
        >
          {note.title && <h4 className="note-title">{note.title}</h4>}

          {note.content && (
            <div
              className="note-preview"
              dangerouslySetInnerHTML={{
                __html: String(note.content).slice(0, 300),
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
