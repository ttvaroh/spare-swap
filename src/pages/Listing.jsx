import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeftIcon, UserIcon, CalendarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching listing:', error);
          navigate('/');
          return;
        }

        setListing(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, navigate]);

  const handleRequestItem = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to request this item.');
      return;
    }

    if (user.id === listing.owner_id) {
      alert('You cannot request your own item.');
      return;
    }

    setRequesting(true);

    try {
      const { error } = await supabase
        .from('requests')
        .insert([
          {
            listing_id: listing.id,
            requester_id: user.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      navigate('/messages');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Error sending request. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      // Delete associated requests first
      const { error: requestsError } = await supabase
        .from('requests')
        .delete()
        .eq('listing_id', listing.id);

      if (requestsError) {
        console.error('Error deleting requests:', requestsError);
      }

      // Delete the listing
      const { error: deleteError } = await supabase
        .from('listings')
        .delete()
        .eq('id', listing.id);

      if (deleteError) throw deleteError;

      navigate('/');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Error deleting listing. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cfb991] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#cfb991] hover:bg-[#b8a882] text-black px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Fallback values
  const imageUrl = listing.image || "https://via.placeholder.com/600x400?text=No+Image";
  const title = listing.title || "Untitled Item";
  const description = listing.description || "No description available.";
  const tags = listing.tags || [];
  const owner = listing.owner || "Unknown";
  const status = listing.status || "Available";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#cfb991] transition-colors duration-200 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                status === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
              
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#cfb991] text-black text-sm px-3 py-1 rounded-full font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>

              {/* Owner Info */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Shared by</p>
                  <p className="text-gray-600">{owner}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isAuthenticated && user.id === listing.owner_id ? (
                  // Owner actions
                  <div className="space-y-3">
                    <Link
                      to={`/edit-listing/${listing.id}`}
                      className="w-full bg-[#cfb991] hover:bg-[#b8a882] text-black py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <PencilIcon className="w-5 h-5" />
                      <span>Edit Listing</span>
                    </Link>
                    <button
                      onClick={handleDeleteListing}
                      disabled={deleting}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <TrashIcon className="w-5 h-5" />
                      <span>{deleting ? 'Deleting...' : 'Delete Listing'}</span>
                    </button>
                  </div>
                ) : isAuthenticated && user.id !== listing.owner_id ? (
                  // Non-owner actions
                  <button
                    onClick={handleRequestItem}
                    disabled={requesting || status !== 'Available'}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                      status === 'Available'
                        ? 'bg-[#cfb991] hover:bg-[#b8a882] text-black'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {requesting ? 'Sending Request...' : 'Request Item'}
                  </button>
                ) : (
                  // Not authenticated
                  <button
                    onClick={() => navigate('/signin')}
                    className="w-full bg-[#cfb991] hover:bg-[#b8a882] text-black py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Sign In to Request
                  </button>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Listed on {new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                {listing.duration && (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">Duration: {listing.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
