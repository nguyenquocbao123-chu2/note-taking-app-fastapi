import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./NoteModal.css";

import { getTags, addTagToNote, removeTagFromNote } from "../api/tags";
import { archiveNote, unarchiveNote } from "../api/notes";

const DRAFT_PREFIX = "keep_draft_v1:";
const draftKeyForEdit = (id) => `${DRAFT_PREFIX}edit:${id}`;

export default function NoteModal({
  note,
  activeView,
  onClose,
  onSave,
  onDelete,
  onRestore,
  onDeleteForever,
}) {
  const isTrash = activeView === "trash";
  const isArchive = activeView === "archive";

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [bg, setBg] = useState(note?.bg || "#ffffff");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [allTags, setAllTags] = useState([]);
  const [noteTags, setNoteTags] = useState(
    Array.isArray(note?.tags) ? note.tags : []
  );
  const [tagOpen, setTagOpen] = useState(false);
  const [tagBusy, setTagBusy] = useState(false);

  const overlayRef = useRef(null);

  // ===== AUTOSAVE DRAFT (EDIT) =====
  const noteId = note?.id ?? null;
  const draftTimerRef = useRef(null);

  const clearDraft = () => {
    if (!noteId) return;
    try {
      localStorage.removeItem(draftKeyForEdit(noteId));
    } catch {}
  };

  const writeDraftNow = () => {
    if (isTrash) return;
    if (!noteId) return;

    const t = String(title || "").trim();
    const c = String(content || "").trim();

    // Không lưu nháp nếu rỗng hoàn toàn
    if (!t && (!c || c === "<p><br></p>")) {
      clearDraft();
      return;
    }

    const payload = {
      type: "edit",
      noteId,
      title,
      content,
      bg,
      updatedAt: Date.now(),
    };

    try {
      localStorage.setItem(draftKeyForEdit(noteId), JSON.stringify(payload));
    } catch {}
  };

  // Khi đổi note (mở note khác) -> reset state
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setBg(note?.bg || "#ffffff");
    setNoteTags(Array.isArray(note?.tags) ? note.tags : []);
    setTagOpen(false);
    setErr("");
  }, [note]);

  // Auto-save nháp: debounce 1s sau khi gõ
  useEffect(() => {
    if (isTrash) return;
    if (!noteId) return;

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      writeDraftNow();
    }, 1000);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, bg, noteId, isTrash]);

  // Flush nháp khi tab bị đóng / ẩn
  useEffect(() => {
    if (isTrash) return;
    if (!noteId) return;

    const onBeforeUnload = () => writeDraftNow();
    const onVis = () => {
      if (document.visibilityState === "hidden") writeDraftNow();
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, isTrash, title, content, bg]);

  // ===== TAGS =====
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

  const isChecked = (tagId) => (noteTags || []).some((t) => t?.id === tagId);

  const toggleTag = async (tagId, checked) => {
    if (!note?.id) return;
    if (isTrash) return;
    if (tagBusy) return;

    setTagBusy(true);
    setErr("");
    try {
      if (checked) {
        await addTagToNote(note.id, tagId);
        const t = allTags.find((x) => x.id === tagId);
        if (t) setNoteTags((prev) => [...(prev || []), t]);
      } else {
        await removeTagFromNote(note.id, tagId);
        setNoteTags((prev) => (prev || []).filter((x) => x.id !== tagId));
      }
    } catch (e) {
      setErr(e?.response?.data?.detail || "Gắn/gỡ nhãn thất bại");
    } finally {
      setTagBusy(false);
    }
  };

  // ===== ACTIONS =====
  const handleSave = async () => {
    if (isTrash) return;

    try {
      setSaving(true);
      setErr("");
      await onSave?.({ title, content, bg });

      // ✅ Save OK -> xoá nháp (đã vào DB)
      clearDraft();
    } catch (e) {
      setErr(e?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (isTrash) return;
    if (!note?.id) return;

    try {
      setSaving(true);
      setErr("");
      await archiveNote(note.id);
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.message || "Lưu trữ thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleUnarchive = async () => {
    if (isTrash) return;
    if (!note?.id) return;

    try {
      setSaving(true);
      setErr("");
      await unarchiveNote(note.id);
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.message || "Bỏ lưu trữ thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isTrash) return;
    if (!note?.id) return;

    try {
      setSaving(true);
      setErr("");
      await onDelete?.(note.id);

      // ✅ note bị đưa vào trash -> xoá nháp edit
      clearDraft();

      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.message || "Xóa thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!note?.id) return;
    try {
      setSaving(true);
      setErr("");
      await onRestore?.(note.id);
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.message || "Khôi phục thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleHardDelete = async () => {
    if (!note?.id) return;
    const ok = window.confirm("Xoá vĩnh viễn ghi chú này?");
    if (!ok) return;

    try {
      setSaving(true);
      setErr("");
      await onDeleteForever?.(note.id);

      // ✅ xoá vĩnh viễn -> xoá nháp
      clearDraft();

      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.message || "Xóa vĩnh viễn thất bại");
    } finally {
      setSaving(false);
    }
  };

  // click overlay: keep-like save
  const clickOverlay = (e) => {
    if (e.target !== overlayRef.current) return;
    if (isTrash) onClose?.();
    else handleSave();
  };

  return (
    <div
      className="note-modal-overlay"
      ref={overlayRef}
      onMouseDown={clickOverlay}
    >
      <div className="note-modal" style={{ background: bg }}>
        {err && <div className="note-modal-error">{err}</div>}

        <div className="note-modal-header">
          <input
            className="note-modal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            disabled={saving || isTrash}
            readOnly={isTrash}
          />
        </div>

        <div className="note-modal-body">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(v) => {
              if (isTrash) return;
              setContent(v);
            }}
            placeholder="Ghi chú..."
            readOnly={saving || isTrash}
            modules={isTrash ? { toolbar: false } : undefined}
          />
        </div>

        <div className="note-modal-actions">
          {isTrash ? (
            <>
              <button
                className="icon-btn"
                title="Khôi phục"
                onClick={handleRestore}
                disabled={saving}
              >
                ↩
              </button>

              <button
                className="icon-btn danger"
                title="Xoá vĩnh viễn"
                onClick={handleHardDelete}
                disabled={saving}
              >
                🗑
              </button>

              <div style={{ flex: 1 }} />

              <button className="ghost" onClick={onClose} disabled={saving}>
                Đóng
              </button>
            </>
          ) : (
            <>
              {isArchive ? (
                <button
                  className="icon-btn"
                  title="Bỏ lưu trữ"
                  onClick={handleUnarchive}
                  disabled={saving}
                >
                  ↩️
                </button>
              ) : (
                <button
                  className="icon-btn"
                  title="Lưu trữ"
                  onClick={handleArchive}
                  disabled={saving}
                >
                  📦
                </button>
              )}

              <button className="danger" onClick={handleDelete} disabled={saving}>
                🗑️
              </button>

              <div style={{ flex: 1 }} />

              <button onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu"}
              </button>

              <button className="ghost" onClick={onClose} disabled={saving}>
                Đóng
              </button>
            </>
          )}
        </div>

        <div className="note-tags-bottom">
          <div className="note-tags-bottom-head">
            <div className="note-tags-bottom-title">Nhãn</div>

            <button
              type="button"
              className="tag-btn"
              onClick={() => setTagOpen((v) => !v)}
              disabled={saving || tagBusy || isTrash}
              title={isTrash ? "Không thể chỉnh nhãn trong Thùng rác" : "Thêm nhãn"}
            >
              🏷️
            </button>
          </div>

          <div className="note-tags-chips">
            {(noteTags || []).map((t) => (
              <span key={t.id} className="tag-chip">
                🏷️ {t.name}
              </span>
            ))}
            {(noteTags || []).length === 0 && (
              <span className="tag-empty">Chưa có nhãn</span>
            )}
          </div>

          {tagOpen && !isTrash && (
            <div className="tag-pop">
              <div className="tag-pop-title">Chọn nhãn</div>
              {sortedAllTags.map((t) => (
                <label key={t.id} className="tag-row">
                  <input
                    type="checkbox"
                    checked={isChecked(t.id)}
                    onChange={(e) => toggleTag(t.id, e.target.checked)}
                    disabled={saving || tagBusy}
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
      </div>
    </div>
  );
}
