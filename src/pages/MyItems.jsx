import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../lib/AuthContext";
import SearchBar from "../components/SearchBar";
import ItemCard from "../components/ItemCard";

const MyItems = () => {
  const { user, isAuthenticated } = useAuth();
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
      ))
    );
  }, [items, searchTerm]);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, image, tags, owner, description, owner_id")
        .eq("owner_id", user.id);

      if (error) {
        console.error("Error fetching user listings:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchUserItems();
  }, [user, isAuthenticated]);

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c28e0e] via-[#ceb888] to-[#000000] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-lg">You need to be logged in to view your Items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c28e0e] via-[#ceb888] to-[#000000]">
      <div className="w-full px-4 py-8 min-w-[320px]">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Items</h1>
            <p className="text-gray-200">Manage your shared items</p>
          </div>

          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {loading ? (
            <p className="text-center text-gray-300 mt-10">Loading your items...</p>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-300 mt-10">
              <p className="text-xl mb-4">No items yet</p>
              <p className="text-lg">Start sharing items by creating your first listing!</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-300 mt-10">
              No listings found matching "{searchTerm}"
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

          {/* Results Summary */}
          {!loading && items.length > 0 && (
            <div className="mt-8 text-center text-gray-300">
              <p>
                Showing {filteredItems.length} of {items.length} listings
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyItems;
