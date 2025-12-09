import { useState } from "react";
import FolderSidebar from "../components/FolderSidebar.jsx";
import NoteList from "../components/NoteList.jsx";
import NewNote from "../components/NewNote.jsx";

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState("Personal");

  const [notes, setNotes] = useState({
    
  });

  const handleCreateNote = (newNote) => {
    setNotes({
      ...notes,
      [selectedFolder]: [
        ...notes[selectedFolder],
        `${newNote.title}: ${newNote.content}`
      ]
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <FolderSidebar onSelectFolder={setSelectedFolder} />

      <div style={{ padding: "20px", width: "100%" }}>

        {/* DANH SÁCH NOTE Ở TRÊN */}
        <NoteList
          folder={selectedFolder}
          notes={notes[selectedFolder] || []}
        />

        {/* CREATE NEW NOTE Ở DƯỚI */}
        <div style={{ marginTop: "30px" }}>
          <NewNote onCreate={handleCreateNote} />
        </div>

      </div>
    </div>
  );
}
