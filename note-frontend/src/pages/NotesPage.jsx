import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import NoteModal from "../components/NoteModal"; // ✅ thêm modal
import { getNotes, createNote, updateNote, deleteNote, searchNotes } from "../api/notes";
import { useNavigate } from "react-router-dom";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [modalNote, setModalNote] = useState(null); // ✅ note đang mở popup
  const navigate = useNavigate();

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.error("Load notes error:", err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        if (!search.trim()) {
          loadNotes();
        } else {
          const data = await searchNotes(search);
          setNotes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Search notes error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // ✅ KHUNG TRÊN CHỈ DÙNG TẠO NOTE MỚI
  const handleCreateNote = async ({ title, content, bg }) => {
    if (!title.trim() && !content.trim()) return;

    try {
      await createNote({ title, content, bg });
      await loadNotes();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Tạo ghi chú thất bại";
      throw new Error(msg);
    }
  };

  // ✅ LƯU NOTE TRONG MODAL (SỬA NOTE)
  const handleSaveModal = async ({ title, content, bg }) => {
    if (!modalNote) return;

    try {
      await updateNote(modalNote.id, { title, content, bg });
      await loadNotes();
      setModalNote(null); // đóng giống Keep
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Lưu ghi chú thất bại";
      throw new Error(msg);
    }
  };

  // ✅ XOÁ NOTE TRONG MODAL
  const handleDeleteModal = async () => {
    if (!modalNote) return;

    try {
      await deleteNote(modalNote.id);
      setModalNote(null);
      await loadNotes();
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  return (
    <Layout search={search} setSearch={setSearch}>
      <main className="keep-main">
        {/* ✅ thêm khoảng cách giống Keep */}
        <div className="keep-content" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* ✅ Editor luôn là tạo note mới */}
          <NoteEditor
            note={null}
            onSave={handleCreateNote}
            onCancel={() => {}}
          />

          {/* ✅ Click note -> mở modal */}
          <NoteList
            notes={notes}
            onSelect={(note) => setModalNote(note)}
          />

          {/* ✅ Modal giống Keep */}
          {modalNote && (
            <NoteModal
              note={modalNote}
              onClose={() => setModalNote(null)}
              onSave={handleSaveModal}
              onDelete={handleDeleteModal}
            />
          )}
        </div>
      </main>
    </Layout>
  );
}
