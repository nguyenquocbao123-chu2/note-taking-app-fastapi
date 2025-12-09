import FolderSidebar from "../components/FolderSidebar.jsx";

export default function Home() {
  return (
    <div style={{ display: "flex" }}>
      <FolderSidebar />

      <div style={{ padding: "20px", width: "100%" }}>
        <h1>Your Notes</h1>
        <p>Select a folder to view notes.</p>
      </div>
    </div>
  );
}
