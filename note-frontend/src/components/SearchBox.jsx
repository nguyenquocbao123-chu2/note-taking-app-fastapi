import React from "react";

export default function SearchBox({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Tìm kiếm ghi chú..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "8px",
        marginBottom: "8px",
        boxSizing: "border-box",
      }}
    />
  );
}
