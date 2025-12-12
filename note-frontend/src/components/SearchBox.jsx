import "./SearchBox.css";

export default function SearchBox({ value, onChange }) {
  return (
    <div className="keep-search-box">
      <span className="search-icon">🔍</span>
      <input
        className="keep-search-input"
        placeholder="Tìm kiếm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
