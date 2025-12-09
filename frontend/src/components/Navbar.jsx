import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        height: "60px",
        background: "#1e1e1e",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      <h2 style={{ margin: 0 }}>Note App</h2>

      <div>
        <button style={{ marginRight: "10px" }}>Login</button>
        <button>Register</button>
      </div>
    </nav>
  );
}

