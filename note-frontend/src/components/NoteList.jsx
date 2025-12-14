import React from "react";
import "./NoteList.css";

export default function NoteList({
  notes,
  onSelect,
  activeView,
  onRestore,
  onDeleteForever,
  onTrash,
  onArchive,
  onUnarchive,
}) {
  if (!notes || notes.length === 0) {
    return <p className="keep-empty">🗒️ Chưa có ghi chú nào</p>;
  }

  const isTrash = activeView === "trash";
  const isArchive = activeView === "archive";

  return (
    <div className="keep-notes-grid">
      {notes.map((note) => (
        <div
          key={note.id}
          role="button"
          tabIndex={0}
          className={`keep-note-card ${isTrash ? "is-trash" : ""}`}
          onClick={() => onSelect(note)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSelect(note);
          }}
          style={{ background: note.bg || "#ffffff" }}
        >
          {/* BODY (chỉ title + preview, không chứa tags) */}
          <div className="note-body">
            {note.title && <h4 className="note-title">{note.title}</h4>}

            {note.content && (
              <div
                className="note-preview"
                // ✅ Không slice HTML nữa để tránh bể thẻ -> layout sai
                dangerouslySetInnerHTML={{ __html: String(note.content) }}
              />
            )}
          </div>

          {/* ✅ TAGS (dính đáy card, note dài vẫn hiện) */}
          {Array.isArray(note.tags) && note.tags.length > 0 && (
            <div className="note-tags-preview">
              {note.tags.slice(0, 3).map((t) => (
                <span key={t.id} className="tag-chip small">
                  🏷️ {t.name}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="tag-more">+{note.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* ✅ KEEP-LIKE TOOLBAR (hover hiện) */}
          <div className="note-toolbar" onClick={(e) => e.stopPropagation()}>
            {isTrash ? (
              <>
                <button
                  type="button"
                  className="tb-btn"
                  title="Khôi phục"
                  aria-label="Khôi phục"
                  onClick={() => onRestore?.(note.id)}
                >
                  ↩
                </button>

                <button
                  type="button"
                  className="tb-btn danger"
                  title="Xoá vĩnh viễn"
                  aria-label="Xoá vĩnh viễn"
                  onClick={() => onDeleteForever?.(note.id)}
                >
                  🗑
                </button>
              </>
            ) : (
              <>
                {isArchive ? (
                  <button
                    type="button"
                    className="tb-btn"
                    title="Bỏ lưu trữ"
                    aria-label="Bỏ lưu trữ"
                    onClick={() => onUnarchive?.(note.id)}
                  >
                    ↩️
                  </button>
                ) : (
                  <button
                    type="button"
                    className="tb-btn"
                    title="Lưu trữ"
                    aria-label="Lưu trữ"
                    onClick={() => onArchive?.(note.id)}
                  >
                    📦
                  </button>
                )}

                <button
                  type="button"
                  className="tb-btn danger"
                  title="Thùng rác"
                  aria-label="Thùng rác"
                  onClick={() => onTrash?.(note.id)}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
