import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import NoteModal from "../components/NoteModal";

import {
  getNotes,
  getTrashNotes,
  createNote,
  updateNote,
  deleteNote,
  restoreNote,
  searchNotes,
  deleteForeverNote,
  getArchivedNotes,
  archiveNote,
  unarchiveNote,
} from "../api/notes";

import { getTags, getNotesByTag } from "../api/tags";
import TagModal from "../components/TagsModal";
import { useNavigate } from "react-router-dom";

const DRAFT_PREFIX = "keep_draft_v1:";
const DRAFT_NEW_KEY = `${DRAFT_PREFIX}new`; // note mới (NoteEditor sẽ ghi vào)
const isEmptyQuill = (html = "") => {
  const t = String(html || "").trim();
  return !t || t === "<p><br></p>";
};

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [modalNote, setModalNote] = useState(null);
  const [activeView, setActiveView] = useState("notes"); // notes | archive | trash

  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const requestIdRef = useRef(0);

  // =========================
  // ✅ RECOVER DRAFTS (auto create/update khi mở lại app)
  // =========================
  const recoverDraftsOnce = async () => {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(DRAFT_PREFIX)) keys.push(k);
      }

      // 1) Draft NOTE MỚI
      if (localStorage.getItem(DRAFT_NEW_KEY)) {
        try {
          const raw = localStorage.getItem(DRAFT_NEW_KEY);
          const d = raw ? JSON.parse(raw) : null;

          const t = String(d?.title || "").trim();
          const c = String(d?.content || "").trim();
          const bg = d?.bg || "#ffffff";

          // có gì đó mới tạo note
          if ((t && t.length) || (c && !isEmptyQuill(c))) {
            await createNote({ title: d.title || "", content: d.content || "", bg });
            localStorage.removeItem(DRAFT_NEW_KEY);
          }
        } catch (e) {
          // nếu create fail (mất mạng) -> giữ draft để lần sau retry
          console.warn("Recover NEW draft failed, keep it for later.", e);
        }
      }

      // 2) Draft EDIT (edit:<id>)
      const editKeys = keys.filter((k) => k.includes(`${DRAFT_PREFIX}edit:`));
      for (const k of editKeys) {
        try {
          const raw = localStorage.getItem(k);
          const d = raw ? JSON.parse(raw) : null;
          const id = d?.noteId;

          if (!id) continue;

          const t = String(d?.title || "").trim();
          const c = String(d?.content || "").trim();
          const bg = d?.bg || "#ffffff";

          // nếu rỗng thì xoá draft cho sạch
          if (!t && (isEmptyQuill(c) || !c)) {
            localStorage.removeItem(k);
            continue;
          }

          await updateNote(id, { title: d.title || "", content: d.content || "", bg });
          localStorage.removeItem(k);
        } catch (e) {
          console.warn("Recover EDIT draft failed, keep it for later.", e);
        }
      }
    } catch (e) {
      console.warn("Recover drafts error:", e);
    }
  };

  // =========================
  // LOAD TAGS
  // =========================
  const loadTags = async () => {
    try {
      const data = await getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.error("Load tags error:", err);
    }
  };

  // =========================
  // LOAD NOTES THEO VIEW
  // =========================
  const loadByView = async (view) => {
    const reqId = ++requestIdRef.current;
    setLoading(true);

    try {
      let data;
      if (view === "trash") data = await getTrashNotes();
      else if (view === "archive") data = await getArchivedNotes();
      else data = await getNotes();

      if (reqId !== requestIdRef.current) return;
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (reqId !== requestIdRef.current) return;
      if (err.response?.status === 401) navigate("/login");
      console.error("Load by view error:", err);
    } finally {
      if (reqId === requestIdRef.current) setLoading(false);
    }
  };

  // INIT
  useEffect(() => {
    (async () => {
      // ✅ recover draft trước (để note “hồi sinh” vào danh sách)
      await recoverDraftsOnce();
      await loadTags();
      await loadByView("notes");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CHANGE TAB
  useEffect(() => {
    setModalNote(null);

    if (activeView !== "notes") {
      setSearch("");
      setSelectedTag(null);
    }

    loadByView(activeView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);

  // LOAD NOTES BY TAG (only notes tab)
  const loadNotesByTag = async (tag) => {
    try {
      if (activeView !== "notes") return;

      setSelectedTag(tag);

      if (!tag) {
        await loadByView("notes");
        return;
      }

      const data = await getNotesByTag(tag.id);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.error("Load notes by tag error:", err);
    }
  };

  // SEARCH (only notes tab)
  useEffect(() => {
    if (activeView !== "notes") return;

    const timeout = setTimeout(async () => {
      try {
        if (!search.trim()) {
          if (selectedTag) {
            const data = await getNotesByTag(selectedTag.id);
            setNotes(Array.isArray(data) ? data : []);
          } else {
            await loadByView("notes");
          }
          return;
        }

        setSelectedTag(null);
        const data = await searchNotes(search);
        setNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search notes error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeView]);

  // VIEW LIST
  const viewNotes = useMemo(() => {
    const list = Array.isArray(notes) ? notes : [];

    if (activeView === "trash") return list;

    if (activeView === "archive") return list.filter((n) => n?.is_archived === true);

    return list.filter((n) => !n?.is_archived);
  }, [notes, activeView]);

  // CREATE NOTE
  const handleCreateNote = async ({ title, content, bg, tag_ids }) => {
    if (!title.trim() && !content.trim()) return;

    try {
      await createNote({
        title,
        content,
        bg,
        tag_ids: Array.isArray(tag_ids) ? tag_ids : [],
      });

      // ✅ create xong thì xoá draft note mới (nếu có)
      try {
        localStorage.removeItem(DRAFT_NEW_KEY);
      } catch {}

      if (search.trim()) {
        const data = await searchNotes(search);
        setNotes(Array.isArray(data) ? data : []);
      } else if (selectedTag) {
        const data = await getNotesByTag(selectedTag.id);
        setNotes(Array.isArray(data) ? data : []);
      } else {
        await loadByView("notes");
      }
    } catch (err) {
      throw new Error(err?.response?.data?.detail || "Tạo ghi chú thất bại");
    }
  };

  // SAVE NOTE (MODAL)
  const handleSaveModal = async ({ title, content, bg }) => {
    if (!modalNote) return;

    try {
      await updateNote(modalNote.id, { title, content, bg });

      setNotes((prev) =>
        (prev || []).map((n) =>
          n.id === modalNote.id ? { ...n, title, content, bg } : n
        )
      );

      setModalNote(null);
    } catch (err) {
      throw new Error(err?.response?.data?.detail || "Lưu ghi chú thất bại");
    }
  };

  // SOFT DELETE -> THÙNG RÁC (modal)
  const handleDeleteModal = async () => {
    if (!modalNote) return;

    try {
      await deleteNote(modalNote.id);
      const deletedId = modalNote.id;
      setModalNote(null);

      if (activeView === "trash") {
        await loadByView("trash");
        return;
      }

      setNotes((prev) => (prev || []).filter((n) => n.id !== deletedId));
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  // RESTORE NOTE
  const handleRestore = async (noteId) => {
    try {
      await restoreNote(noteId);

      if (activeView === "trash") {
        await loadByView("trash");
        return;
      }

      setNotes((prev) => (prev || []).filter((n) => n.id !== noteId));
    } catch (err) {
      console.error("Restore note error:", err);
    }
  };

  // DELETE FOREVER
  const handleDeleteForever = async (noteId) => {
    if (!window.confirm("Xóa vĩnh viễn ghi chú này?")) return;

    try {
      await deleteForeverNote(noteId);

      if (activeView === "trash") {
        await loadByView("trash");
        return;
      }

      setNotes((prev) => (prev || []).filter((n) => n.id !== noteId));
    } catch (err) {
      console.error("Delete forever error:", err);
    }
  };

  // TOOLBAR ACTIONS
  const handleTrashFromCard = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => (prev || []).filter((n) => n.id !== noteId));
    } catch (err) {
      console.error("Trash from card error:", err);
    }
  };

  const handleArchiveFromCard = async (noteId) => {
    try {
      await archiveNote(noteId);

      if (activeView === "notes") {
        setNotes((prev) => (prev || []).filter((n) => n.id !== noteId));
      } else {
        await loadByView(activeView);
      }
    } catch (err) {
      console.error("Archive from card error:", err);
    }
  };

  const handleUnarchiveFromCard = async (noteId) => {
    try {
      await unarchiveNote(noteId);

      if (activeView === "archive") {
        setNotes((prev) => (prev || []).filter((n) => n.id !== noteId));
      } else {
        await loadByView(activeView);
      }
    } catch (err) {
      console.error("Unarchive from card error:", err);
    }
  };

  return (
    <>
      <Layout
        search={search}
        setSearch={setSearch}
        notes={notes}
        onSelectNote={(note) => setModalNote(note)}
        activeView={activeView}
        setActiveView={setActiveView}
        tags={tags}
        selectedTagId={selectedTag?.id ?? null}
        onSelectTag={loadNotesByTag}
        onOpenTagModal={() => setTagModalOpen(true)}
      >
        <main className="keep-main">
          <div
            className="keep-content"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {activeView === "notes" && (
              <NoteEditor note={null} onSave={handleCreateNote} onCancel={() => {}} />
            )}

            {loading && <div style={{ padding: 8, opacity: 0.7 }}>Đang tải...</div>}

            <NoteList
              notes={viewNotes}
              onSelect={(note) => setModalNote(note)}
              activeView={activeView}
              onRestore={handleRestore}
              onDeleteForever={handleDeleteForever}
              onTrash={handleTrashFromCard}
              onArchive={handleArchiveFromCard}
              onUnarchive={handleUnarchiveFromCard}
            />

            {modalNote && (
              <NoteModal
                note={modalNote}
                activeView={activeView}
                onClose={() => setModalNote(null)}
                onSave={handleSaveModal}
                onDelete={handleDeleteModal}
                onRestore={handleRestore}
                onDeleteForever={handleDeleteForever}
              />
            )}
          </div>
        </main>
      </Layout>

      <TagModal
        open={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        tags={tags}
        onReload={loadTags}
      />
    </>
  );
}
