import React from "react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="mb-8">
      <div className="max-w-md mx-auto relative">
        <input
          type="text"
          placeholder="Search items by title, description, tags, or owner..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full px-4 py-3 pl-10 pr-10 text-gray-800 bg-white rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Search Results Count */}
      {searchTerm && (
        <p className="text-center text-gray-300 mt-2 text-sm">
          Search results for "{searchTerm}"
        </p>
      )}
    </div>
  );
};

export default SearchBar;