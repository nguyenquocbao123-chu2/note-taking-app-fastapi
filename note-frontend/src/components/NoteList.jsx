import React from "react";

export default function NoteList({ notes, selectedId, onSelect }) {
  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        padding: "10px",
        overflowY: "auto",
      }}
    >
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelect(note)}
          style={{
            padding: "8px",
            marginBottom: "6px",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: note.id === selectedId ? "#e0f0ff" : "#f7f7f7",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{note.title}</div>
          <div style={{ fontSize: "12px", color: "#555" }}>
            {note.content.slice(0, 60)}...
          </div>
        </div>
      ))}
      {notes.length === 0 && <p>Chưa có ghi chú nào.</p>}
    </div>
  );
}
