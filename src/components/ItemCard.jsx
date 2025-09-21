import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  // Fallback values
  const imageUrl = item.image || "https://via.placeholder.com/400x300?text=No+Image";
  const title = item.title || "Untitled Item";
  const description = item.description || "No description available.";
  const tags = item.tags || [];
  const owner = item.owner || "Unknown";

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden w-full max-w-sm mx-auto">
      
      {/* Item Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Item Content */}
      <div className="p-4">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-[#cfb991] text-black text-xs px-2 py-1 rounded-full font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Owner and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {owner.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="text-sm text-gray-600">{owner}</span>
          </div>
          
          <Link 
            to={`/listing/${item.id}`}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 inline-block"
          >
            View Item
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;