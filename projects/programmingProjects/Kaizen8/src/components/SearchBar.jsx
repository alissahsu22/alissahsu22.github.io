function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search Kaizen8..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default SearchBar
