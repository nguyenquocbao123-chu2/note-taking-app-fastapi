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

const handleSaveNote = async ({ title, content, bg }) => {

    if (!title.trim() && !content.trim()) return;

    if (selected) {
   await updateNote(selected.id, { title, content, bg });

    } else {
   await createNote({ title, content, bg });

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
    <Layout search={search} setSearch={setSearch}>
      <main className="keep-main">
        <div className="keep-content">
          <NoteEditor
            note={selected}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onCancel={() => setSelected(null)}
          />

          <NoteList
            notes={notes}
            onSelect={(note) => setSelected(note)}
          />
        </div>
      </main>
    </Layout>
  );
}
