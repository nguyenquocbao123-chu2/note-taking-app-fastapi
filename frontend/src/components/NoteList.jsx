export default function NoteList({ folder, notes }) {
  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2>Notes in "{folder}"</h2>

      {notes.length === 0 ? (
        <p>No notes in this folder.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {notes.map((note, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
