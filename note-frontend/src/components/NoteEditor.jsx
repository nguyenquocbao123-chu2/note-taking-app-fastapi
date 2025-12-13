import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./NoteEditor.css";

export default function NoteEditor({ note, onSave, onDelete, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);

  const [bg, setBg] = useState("#ffffff");
  const [showColor, setShowColor] = useState(false);

  // ✅ thêm state để chống mất dữ liệu
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const wrapperRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (expanded && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleSave();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded, title, content, bg, saving]);

  const resetEditor = () => {
    setTitle("");
    setContent("");
    setExpanded(false);
    setShowColor(false);
    setBg("#ffffff");
    setErrorMsg("");
    setSaving(false);
  };

  // ✅ sửa: async + chỉ reset khi save OK
  const handleSave = async () => {
    if (saving) return;

    if (!title.trim() && !content.trim()) {
      resetEditor();
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      // onSave nên trả promise (gọi API)
      await onSave({ title, content, bg, id: note?.id });

      // ✅ chỉ reset khi lưu thành công
      resetEditor();
    } catch (err) {
      // ✅ nếu lỗi: giữ nguyên dữ liệu để user không mất
      setErrorMsg(err?.message || "Lưu ghi chú thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
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
        {/* ✅ hiển thị lỗi nếu lưu fail */}
        {expanded && errorMsg && (
          <div style={{ color: "red", marginBottom: 8, fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {expanded && (
          <input
            className="keep-title"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />
        )}

        {!expanded && <div className="keep-placeholder">Ghi chú...</div>}

        {expanded && (
          <>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Ghi chú..."
              readOnly={saving}
              modules={{
                toolbar: {
                  container: "#quill-toolbar-bottom",
                },
              }}
            />

            <div id="quill-toolbar-bottom" className="quill-toolbar-bottom">
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

        {expanded && (
          <div className="keep-toolbar">
            <div className="left-tools">
              <button
                title="Màu nền"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColor(!showColor);
                }}
                disabled={saving}
              >
                🎨
              </button>
            </div>

            <div className="right-tools">
              {note && (
                <button className="danger" onClick={onDelete} disabled={saving}>
                  Xoá
                </button>
              )}

              <button onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu"}
              </button>

              <button className="ghost" onClick={handleCancel} disabled={saving}>
                Đóng
              </button>
            </div>
          </div>
        )}

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
                  if (!saving) {
                    setBg(c);
                    setShowColor(false);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
