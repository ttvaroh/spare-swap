import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import SearchBar from "../components/SearchBar";
import ItemCard from "../components/ItemCard";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    return items.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      item.owner?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, image, tags, owner, description, status")
        .neq("status", "swapped");

      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchItems();

    // Refresh data when user returns to this page
    const handleFocus = () => {
      fetchItems();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c28e0e] via-[#ceb888] to-[#000000]">
      <div className="w-full px-4 py-8 min-w-[320px]">
        <div className="max-w-7xl mx-auto">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {loading ? (
            <p className="text-center text-gray-300 mt-10">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-300 mt-10">No items available yet.</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-300 mt-10">
              No items found matching "{searchTerm}"
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;