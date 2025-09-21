import React from "react";

const ItemsGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      <div className="aspect-square shadow-lg rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center" 
          alt="Engine Part" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="aspect-square shadow-lg rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=center" 
          alt="Car Part" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="aspect-square shadow-lg rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop&crop=center" 
          alt="Mechanical Part" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="aspect-square shadow-lg rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop&crop=center" 
          alt="Spare Part" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ItemsGrid;


