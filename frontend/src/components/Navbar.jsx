import { Link } from "react-router-dom";

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
      <h2>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Note App
        </Link>
      </h2>

      <div>
        <Link to="/login" style={{ marginRight: "10px", color: "white" }}>
          Login
        </Link>
        <Link to="/register" style={{ color: "white" }}>
          Register
        </Link>
      </div>
    </nav>
  );
}
