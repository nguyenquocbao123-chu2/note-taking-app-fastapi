import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import SearchBox from "../components/SearchBox";
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
      setNotes(data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Search realtime
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!search.trim()) {
        loadNotes();
      } else {
        const data = await searchNotes(search);
        setNotes(data);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSaveNote = async ({ title, content }) => {
    if (!title.trim() && !content.trim()) return;

    if (!selected) {
      await createNote(title, content);
    } else {
      await updateNote(selected.id, { title, content });
    }

    setSelected(null);
    loadNotes();
  };

  const handleDeleteNote = async () => {
    if (!selected) return;
    await deleteNote(selected.id);
    setSelected(null);
    loadNotes();
  };

  return (
    <Layout>
      {/* SIDEBAR */}
      <aside className="keep-sidebar">
        <div className="keep-menu active">Ghi chú</div>
        <div className="keep-menu">Lời nhắc</div>
        <div className="keep-menu">Lưu trữ</div>
        <div className="keep-menu">Thùng rác</div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="keep-main">
        <div className="keep-search">
          <SearchBox value={search} onChange={setSearch} />
        </div>

        {/* CREATE / EDIT NOTE */}
        <div className="keep-editor">
          <NoteEditor
            note={selected}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onCancel={() => setSelected(null)}
          />
        </div>

        {/* NOTES GRID */}
        <NoteList
          notes={notes}
          onSelect={(note) => setSelected(note)}
        />
      </main>
    </Layout>
  );
}
