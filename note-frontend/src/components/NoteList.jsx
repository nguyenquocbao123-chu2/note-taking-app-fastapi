import React from "react";
import "./NoteList.css";

export default function NoteList({ notes, onSelect }) {
  if (notes.length === 0) {
  return (
    <p className="keep-empty">
      🗒️ Chưa có ghi chú nào
    </p>
  );
}


  return (
    <div className="keep-notes-grid">
      {notes.map((note) => (
        <div
          key={note.id}
          className="keep-note-card"
          onClick={() => onSelect(note)}
        >
          {note.title && <h4>{note.title}</h4>}
        {note.content && (
  <div
    className="note-preview"
    dangerouslySetInnerHTML={{
      __html: note.content.slice(0, 300),
    }}
  />
)}

        </div>
      ))}
    </div>
  );
}
