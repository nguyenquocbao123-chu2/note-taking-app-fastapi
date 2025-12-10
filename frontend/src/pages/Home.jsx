import { useState } from "react";
import FolderSidebar from "../components/FolderSidebar.jsx";
import NoteList from "../components/NoteList.jsx";
import NewNote from "../components/NewNote.jsx";

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState("Personal");
  const [filterTag, setFilterTag] = useState(""); 
  const [keyword, setKeyword] = useState(""); // ← thêm phần search keyword

  const [notes, setNotes] = useState({
    Personal: [],
    Work: [],
    School: [],
  });

  const handleCreateNote = (newNote) => {
    setNotes({
      ...notes,
      [selectedFolder]: [
        ...notes[selectedFolder],
        {
          title: newNote.title,
          content: newNote.content,
          tags: newNote.tags
        }
      ]
    });
  };

  const TAG_OPTIONS = ["Work", "Study", "Urgent", "Important", "Personal"];

  // =============================
  //      FILTER LOGIC
  //  FOLDER + TAG + KEYWORD
  // =============================
  const filteredNotes = notes[selectedFolder].filter(note => {
    const matchTag =
      filterTag === "" ? true : note.tags.includes(filterTag);

    const lower = keyword.toLowerCase();
    const matchKeyword =
      note.title.toLowerCase().includes(lower) ||
      note.content.toLowerCase().includes(lower);

    return matchTag && matchKeyword;
  });

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden"
    }}>
      
      {/* SIDEBAR TRÁI */}
      <FolderSidebar onSelectFolder={setSelectedFolder} />

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        overflow: "hidden"
      }}>

        {/* TAG FILTER */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Filter by tag:</label>
          <select 
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: "6px" }}
          >
            <option value="">All</option>
            {TAG_OPTIONS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* SEARCH KEYWORD */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Search:</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search title or content..."
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "250px"
            }}
          />
        </div>

        {/* NOTE LIST */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "10px"
        }}>
          <NoteList 
            folder={selectedFolder} 
            notes={filteredNotes} 
          />
        </div>

        {/* NEW NOTE */}
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
