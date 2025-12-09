import { useState } from "react";
import FolderSidebar from "../components/FolderSidebar.jsx";
import NoteList from "../components/NoteList.jsx";

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState("Personal");

  const noteData = {
    Personal: ["Shopping list", "Daily journal"],
    Work: ["Project plan", "Meeting notes"],
    School: ["Homework", "Study notes"],
  };

  return (
    <div style={{ display: "flex" }}>
      <FolderSidebar onSelectFolder={setSelectedFolder} />

      <NoteList
        folder={selectedFolder}
        notes={noteData[selectedFolder] || []}
      />
    </div>
  );
}
