import { useState } from "react";

export default function NewNote({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!title.trim()) return;
    onCreate({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>Create New Note</h3>

      <div style={{ marginTop: "10px" }}>
        <label>Title:</label>
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            marginBottom: "10px"
          }}
        />

        <label>Content:</label>
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            height: "120px",
            padding: "8px",
            marginTop: "5px"
          }}
        />

        <button
          onClick={handleSave}
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#1e1e1e",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Save Note
        </button>
      </div>
    </div>
  );
}
