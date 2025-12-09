export default function NoteList({ folder, notes }) {
  return (
    <div>
      <h2>Notes in "{folder}"</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((n, idx) => (
          <li key={idx} style={{
            marginBottom: "15px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            {/* Title */}
            <strong style={{ fontSize: "16px" }}>{n.title}</strong>

            {/* TAG BADGES */}
            {n.tags && n.tags.length > 0 && (
              <div style={{
                marginTop: "6px",
                display: "flex",
                gap: "6px",
                flexWrap: "wrap"
              }}>
                {n.tags.map((tag, i) => (
                  <span key={i} style={{
                    background: "#e2e8f0",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#374151"
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div style={{ marginTop: "6px", whiteSpace: "pre-wrap" }}>
              {n.content}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
