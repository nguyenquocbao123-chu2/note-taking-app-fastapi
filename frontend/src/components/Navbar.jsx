import React from "react";

export default function Navbar() {
  return (
    <nav style={{
      width: "100%",
      padding: "15px 25px",
      background: "#1e1e1e",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2>Note App</h2>
      <div>
        <button style={{ marginRight: "10px" }}>Login</button>
        <button>Register</button>
      </div>
    </nav>
  );
}
