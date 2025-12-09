import { useState } from "react";

export default function FolderSidebar() {
  const [folders, setFolders] = useState([
    "Personal",
    "Work",
    "School"
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleAddFolder = () => {
    if (newFolderName.trim() === "") return;

    setFolders([...folders, newFolderName]);
    setNewFolderName("");
    setIsAdding(false);
  };

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

      {isAdding ? (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "5px"
            }}
          />
          <button
            onClick={handleAddFolder}
            style={{
              width: "100%",
              padding: "8px",
              background: "#1e1e1e",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Add Folder
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
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
      )}
    </div>
  );
}
