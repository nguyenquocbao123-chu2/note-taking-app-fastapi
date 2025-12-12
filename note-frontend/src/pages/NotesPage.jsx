import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import SearchBox from "../components/SearchBox";
import { getNotes, createNote, updateNote, deleteNote, searchNotes } from "../api/notes";
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
      if (data.length > 0 && !selected) {
        setSelected(data[0]);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Search realtime (simple debounce)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.trim() === "") {
        loadNotes();
      } else {
        const data = await searchNotes(search);
        setNotes(data);
        if (data.length > 0) {
          setSelected(data[0]);
        } else {
          setSelected(null);
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSelectNote = (note) => {
    setSelected(note);
  };

  const handleNewNote = () => {
    setSelected(null);
  };

  const handleSaveNote = async ({ title, content }) => {
    if (!title.trim() && !content.trim()) return;

    if (!selected) {
      const created = await createNote(title, content);
      await loadNotes();
      setSelected(created);
    } else {
      const updated = await updateNote(selected.id, { title, content });
      await loadNotes();
      setSelected(updated);
    }
  };

  const handleDeleteNote = async () => {
    if (!selected) return;
    await deleteNote(selected.id);
    await loadNotes();
    setSelected(null);
  };

  return (
    <Layout>
      <div style={{ width: "30%", padding: "10px", borderRight: "1px solid #ddd" }}>
        <SearchBox value={search} onChange={setSearch} />
        <NoteList
          notes={notes}
          selectedId={selected?.id}
          onSelect={handleSelectNote}
        />
      </div>
      <NoteEditor
        note={selected}
        onNew={handleNewNote}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </Layout>
  );
}
