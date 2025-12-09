import { useState } from "react";

export default function NewNote({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const TAG_OPTIONS = ["Work", "Study", "Urgent", "Important", "Personal"];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)   // bỏ tag
        : [...prev, tag]               // thêm tag
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreate({
      title,
      content,
      tags: selectedTags
    });

    setTitle("");
    setContent("");
    setSelectedTags([]);
  };

  return (
    <div className="new-note-wrapper">
      <h3>Create New Note</h3>

      <div className="new-note-form">

        {/* Title */}
        <div className="field-group">
          <label>Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
          />
        </div>

        {/* Content */}
        <div className="field-group">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
          />
        </div>

        {/* TAG CHECKBOX */}
        <div className="field-group">
          <label>Tags:</label>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "6px"
          }}>
            {TAG_OPTIONS.map(tag => (
              <label key={tag} style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                background: selectedTags.includes(tag) ? "#2563eb20" : "#f3f3f3",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          Save Note
        </button>

      </div>
    </div>
  );
}
const TAG_OPTIONS = ["Work", "Study", "Urgent", "Important", "Personal"];
