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
      [selectedFolder]: [
        ...notes[selectedFolder],
        `${newNote.title}: ${newNote.content}`
      ]
    });
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden"
    }}>
      
      {/* Sidebar trái */}
      <FolderSidebar onSelectFolder={setSelectedFolder} />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        overflow: "hidden"
      }}>
        
        {/* Note list (scrollable) */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "10px"
        }}>
          <NoteList 
            folder={selectedFolder} 
            notes={notes[selectedFolder] || []} 
          />
        </div>

        {/* NEW NOTE — fixed bottom */}
        <div style={{
          padding: "15px",
          background: "white",
          borderTop: "1px solid #ddd"
        }}>
          <NewNote onCreate={handleCreateNote} />
        </div>

      </div>
    </div>
  );
}
