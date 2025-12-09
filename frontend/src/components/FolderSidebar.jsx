import { useState } from "react";

export default function FolderSidebar() {
  const [folders, setFolders] = useState([
    "Personal",
    "Work",
    "School"
  ]);

  return (
    <div style={{
      width: "220px",
      height: "100vh",
      borderRight: "1px solid #ddd",
      padding: "15px",
      background: "#fafafa"
    }}>
      <h3 style={{ marginBottom: "15px" }}>Folders</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {folders.map((folder, index) => (
          <li
            key={index}
            style={{
              padding: "8px",
              marginBottom: "8px",
              background: "#eee",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {folder}
          </li>
        ))}
      </ul>

      <button
        style={{
          width: "100%",
          padding: "8px",
          marginTop: "10px",
          border: "1px solid #333",
          background: "white",
          cursor: "pointer"
        }}
      >
        + New Folder
      </button>
    </div>
  );
}
