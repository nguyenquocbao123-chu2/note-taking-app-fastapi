import { useState } from "react";
import FolderSidebar from "../components/FolderSidebar.jsx";
import NoteList from "../components/NoteList.jsx";
import NewNote from "../components/NewNote.jsx";

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState("Personal");

  const [notes, setNotes] = useState({
    Personal: ["Shopping list", "Daily journal"],
    Work: ["Project plan", "Meeting notes"],
    School: ["Homework", "Study notes"],
  });

  const handleCreateNote = (newNote) => {
    setNotes({
      ...notes,
      [selectedFolder]: [...notes[selectedFolder], `${newNote.title}: ${newNote.content}`]
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <FolderSidebar onSelectFolder={setSelectedFolder} />

      <div style={{ padding: "20px", width: "100%" }}>
        <NewNote onCreate={handleCreateNote} />

        <NoteList
          folder={selectedFolder}
          notes={notes[selectedFolder] || []}
        />
      </div>
    </div>
  );
}
