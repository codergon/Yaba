import { useAppStore } from "../../../context/AppContext";

const SearchBar = () => {
  const { searchValue, setSearchValue } = useAppStore();

  return (
    <input
      type="text"
      value={searchValue}
      className="search-bar-input"
      placeholder={`Search browsing history`}
      onChange={e => setSearchValue(e.target.value)}
    />
  );
};

export default SearchBar;
