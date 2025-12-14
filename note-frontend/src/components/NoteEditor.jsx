import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./NoteEditor.css";

import { getTags } from "../api/tags";

const DRAFT_NEW_KEY = "keep_draft_v1:new";
const isEmptyQuill = (html = "") => {
  const t = String(html || "").trim();
  return !t || t === "<p><br></p>";
};

export default function NoteEditor({ note, onSave, onDelete, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);

  const [bg, setBg] = useState("#ffffff");
  const [showColor, setShowColor] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ TAGS
  const [allTags, setAllTags] = useState([]);
  const [tagOpen, setTagOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const wrapperRef = useRef(null);

  // ===== AUTOSAVE DRAFT (NEW NOTE) =====
  const draftTimerRef = useRef(null);

  const clearNewDraft = () => {
    try {
      localStorage.removeItem(DRAFT_NEW_KEY);
    } catch {}
  };

  const writeNewDraftNow = () => {
    // chỉ autosave cho NOTE MỚI (NoteEditor của bạn đang dùng note={null})
    if (note?.id) return;

    const t = String(title || "").trim();
    const c = String(content || "").trim();

    if (!t && (isEmptyQuill(c) || !c)) {
      clearNewDraft();
      return;
    }

    try {
      localStorage.setItem(
        DRAFT_NEW_KEY,
        JSON.stringify({
          type: "new",
          title,
          content,
          bg,
          tag_ids: selectedTagIds,
          updatedAt: Date.now(),
        })
      );
    } catch {}
  };

  // load tags 1 lần
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getTags();
        if (!mounted) return;
        setAllTags(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Load tags error:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sortedAllTags = useMemo(() => {
    const arr = Array.isArray(allTags) ? allTags : [];
    return [...arr].sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""), "vi")
    );
  }, [allTags]);

  const selectedTags = useMemo(() => {
    const map = new Map((allTags || []).map((t) => [t.id, t]));
    return (selectedTagIds || []).map((id) => map.get(id)).filter(Boolean);
  }, [selectedTagIds, allTags]);

  // ✅ khi mở editor (note mới) -> nếu có draft thì restore luôn để “hồi sinh”
  useEffect(() => {
    if (note) return; // editor này chủ yếu tạo mới, nếu có edit riêng thì bỏ
    try {
      const raw = localStorage.getItem(DRAFT_NEW_KEY);
      if (!raw) return;

      const d = JSON.parse(raw);

      const t = String(d?.title || "").trim();
      const c = String(d?.content || "").trim();

      // có dữ liệu -> tự mở expanded và nạp lại
      if (t || (c && !isEmptyQuill(c))) {
        setTitle(d.title || "");
        setContent(d.content || "");
        setBg(d.bg || "#ffffff");
        setSelectedTagIds(Array.isArray(d.tag_ids) ? d.tag_ids : []);
        setExpanded(true);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // nếu component nhận note để edit (hiện bạn không dùng) thì vẫn giữ logic cũ
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setBg(note.bg || "#ffffff");
      setExpanded(true);

      const ids = Array.isArray(note?.tags) ? note.tags.map((t) => t.id) : [];
      setSelectedTagIds(ids);
    } else {
      resetEditor(false); // false = đừng xóa draft ngay
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (expanded && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleSave();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, title, content, bg, saving, selectedTagIds]);

  // ✅ autosave debounce khi gõ
  useEffect(() => {
    if (!expanded) return;
    if (saving) return;
    if (note?.id) return; // editor này autosave cho note mới

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      writeNewDraftNow();
    }, 1000);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, bg, selectedTagIds, expanded, saving]);

  // ✅ flush draft khi tắt tab / chuyển tab (cúp điện thì localStorage vẫn giữ)
  useEffect(() => {
    if (note?.id) return;

    const onBeforeUnload = () => writeNewDraftNow();
    const onVis = () => {
      if (document.visibilityState === "hidden") writeNewDraftNow();
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, bg, selectedTagIds, note]);

  const resetEditor = (clearDraft = true) => {
    setTitle("");
    setContent("");
    setExpanded(false);
    setShowColor(false);
    setBg("#ffffff");
    setErrorMsg("");
    setSaving(false);

    setTagOpen(false);
    setSelectedTagIds([]);

    if (clearDraft) clearNewDraft();
  };

  const toggleTagId = (id) => {
    setSelectedTagIds((prev) => {
      const set = new Set(prev || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return Array.from(set);
    });
  };

  const handleSave = async () => {
    if (saving) return;

    const t = String(title || "").trim();
    const c = String(content || "").trim();

    if (!t && (isEmptyQuill(c) || !c)) {
      resetEditor(true);
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      await onSave({
        title,
        content,
        bg,
        id: note?.id,
        tag_ids: selectedTagIds,
      });

      // ✅ lưu OK -> xóa draft
      resetEditor(true);
    } catch (err) {
      // ❗ lưu fail: KHÔNG reset, draft vẫn còn
      setErrorMsg(err?.message || "Lưu ghi chú thất bại. Vui lòng thử lại.");
      writeNewDraftNow();
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Đóng editor nhưng vẫn giữ draft (để lỡ tắt tab vẫn còn)
    setExpanded(false);
    setShowColor(false);
    setTagOpen(false);
    onCancel && onCancel();
  };

  return (
    <div className="keep-editor-wrapper" ref={wrapperRef}>
      <div
        className={`keep-editor ${expanded ? "expanded" : ""}`}
        style={{ background: bg }}
        onClick={() => !expanded && setExpanded(true)}
      >
        {expanded && errorMsg && (
          <div style={{ color: "red", marginBottom: 8, fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {/* 1) TITLE */}
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

        {/* 2) CONTENT */}
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

            {/* 3) TOOLBAR */}
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

        {/* 4) ACTIONS */}
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

              <button
                title="Nhãn"
                onClick={(e) => {
                  e.stopPropagation();
                  setTagOpen((v) => !v);
                }}
                disabled={saving}
              >
                🏷️
              </button>
            </div>

            <div className="right-tools">
              {note && (
                <button className="danger" onClick={onDelete} disabled={saving}>
                  🗑️
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

        {/* COLOR PICKER */}
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

        {/* TAGS BOTTOM */}
        {expanded && (
          <div className="editor-tags-bottom">
            <div className="editor-tags-chips">
              {selectedTags.map((t) => (
                <span key={t.id} className="tag-chip">
                  🏷️ {t.name}
                </span>
              ))}
              {selectedTags.length === 0 && (
                <span className="tag-empty">Chưa có nhãn</span>
              )}
            </div>

            {tagOpen && (
              <div className="editor-tag-pop" onMouseDown={(e) => e.stopPropagation()}>
                <div className="tag-pop-title">Chọn nhãn</div>

                {sortedAllTags.map((t) => (
                  <label key={t.id} className="tag-row">
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(t.id)}
                      onChange={() => toggleTagId(t.id)}
                      disabled={saving}
                    />
                    <span>{t.name}</span>
                  </label>
                ))}

                {sortedAllTags.length === 0 && (
                  <div className="tag-pop-empty">
                    Bạn chưa tạo nhãn nào (vào “Chỉnh sửa nhãn” để tạo)
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
