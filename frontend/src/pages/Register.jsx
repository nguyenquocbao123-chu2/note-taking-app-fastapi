export default function Register() {
  return (
    <div style={{
      maxWidth: "350px",
      margin: "60px auto",
      padding: "25px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center" }}>Create Account</h2>

      <div style={{ marginTop: "20px" }}>
        <label>Full Name:</label>
        <input
          type="text"
          placeholder="Your name"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px"
          }}
        />

        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter email"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px"
          }}
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter password"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "20px"
          }}
        />

        <button style={{
          width: "100%",
          padding: "10px",
          background: "#1e1e1e",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Register
        </button>
      </div>
    </div>
  );
}
