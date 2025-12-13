import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./NoteEditor.css";

export default function NoteEditor({ note, onSave, onDelete, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);

  // màu nền
  const [bg, setBg] = useState("#ffffff");
  const [showColor, setShowColor] = useState(false);

  const wrapperRef = useRef(null);

  /* Edit note cũ */
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setBg(note.bg || "#ffffff");
      setExpanded(true);
    } else {
      resetEditor();
    }
  }, [note]);

  /* Click ngoài → lưu */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        expanded &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        handleSave();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded, title, content, bg]);

  const resetEditor = () => {
    setTitle("");
    setContent("");
    setExpanded(false);
    setShowColor(false);
    setBg("#ffffff");
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      resetEditor();
      return;
    }
    onSave({ title, content, bg });
    resetEditor();
  };

  const handleCancel = () => {
    resetEditor();
    onCancel && onCancel();
  };

  return (
    <div className="keep-editor-wrapper" ref={wrapperRef}>
      <div
        className={`keep-editor ${expanded ? "expanded" : ""}`}
        style={{ background: bg }}
        onClick={() => !expanded && setExpanded(true)}
      >
        {/* TITLE */}
        {expanded && (
          <input
            className="keep-title"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}

        {/* PLACEHOLDER */}
        {!expanded && <div className="keep-placeholder">Ghi chú...</div>}

        {/* EDITOR */}
        {expanded && (
          <>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Ghi chú..."
              modules={{
                toolbar: {
                  container: "#quill-toolbar-bottom", // ⬅️ toolbar đặt dưới
                },
              }}
            />

            {/* TOOLBAR REACTQUILL Ở DƯỚI */}
            <div
              id="quill-toolbar-bottom"
              className="quill-toolbar-bottom"
            >
              <select className="ql-header" defaultValue="">
                <option value="1" />
                <option value="2" />
                <option value="" />
              </select>

              <button className="ql-bold" />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-link" />
              <button className="ql-list" value="ordered" />
              <button className="ql-list" value="bullet" />
              <button className="ql-clean" />
            </div>
          </>
        )}

        {/* TOOLBAR KEEP (LƯU / MÀU / ĐÓNG) */}
        {expanded && (
          <div className="keep-toolbar">
            <div className="left-tools">
              <button
                title="Màu nền"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColor(!showColor);
                }}
              >
                🎨
              </button>
            </div>

            <div className="right-tools">
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
          </div>
        )}

        {/* CHỌN MÀU */}
        {showColor && (
          <div className="color-picker">
            {[
              "#ffffff",
              "#f28b82",
              "#fbbc04",
              "#fff475",
              "#ccff90",
              "#a7ffeb",
              "#cbf0f8",
              "#d7aefb",
            ].map((c) => (
              <span
                key={c}
                className="color-dot"
                style={{ background: c }}
                onClick={() => {
                  setBg(c);
                  setShowColor(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
