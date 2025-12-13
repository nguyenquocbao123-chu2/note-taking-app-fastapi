import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
} from "../api/notes";
import { useNavigate } from "react-router-dom";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      // các lỗi khác để console cho dễ debug
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

  // ✅ NOTE: NoteEditor sẽ await onSave và bắt lỗi
  const handleSaveNote = async ({ title, content, bg, id }) => {
    if (!title.trim() && !content.trim()) return;

    try {
      if (selected || id) {
        const noteId = selected?.id || id;
        await updateNote(noteId, { title, content, bg });
      } else {
        await createNote({ title, content, bg });
      }

      setSelected(null);
      await loadNotes();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Lưu ghi chú thất bại";
      throw new Error(msg); // ✅ quan trọng: để NoteEditor hiện lỗi và không reset
    }
  };

  const handleDeleteNote = async () => {
    if (!selected) return;

    try {
      await deleteNote(selected.id);
      setSelected(null);
      await loadNotes();
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  return (
    <Layout search={search} setSearch={setSearch}>
      <main className="keep-main">
        <div className="keep-content">
          <NoteEditor
            note={selected}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onCancel={() => setSelected(null)}
          />

          <NoteList notes={notes} onSelect={(note) => setSelected(note)} />
        </div>
      </main>
    </Layout>
  );
}
