import { Search } from "@mui/icons-material";
import React from "react";

const Searchbar = ({ value, onChange, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex items-center justify-between border relative rounded-lg overflow-hidden border-neutral-500 focus-within:border-white">
      <input
        type="text"
        placeholder="search for chat"
        className="outline-none w-full py-4 px-5"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={onSearch}
        className="h-full flex items-center justify-center px-5 text-gray-400 hover:text-white transition cursor-pointer "
      >
        <Search fontSize="small" />
      </button>
    </div>
  );
};

export default Searchbar;
