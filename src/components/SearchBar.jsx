import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-8 w-full">
      <div className="relative max-w-2xl mx-auto w-full">
        <div className="relative">
          {/* Search Icon */}
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;