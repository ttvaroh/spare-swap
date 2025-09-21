import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { UserIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 relative z-[55]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-black">
              <span className="text-[#cfb991]">Spare</span>Swap
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/create-listing" 
              className="text-gray-700 hover:text-[#cfb991] transition-colors duration-200 font-medium"
            >
              Create Listing
            </Link>
            <Link 
              to="/my-items" 
              className="text-gray-700 hover:text-[#cfb991] transition-colors duration-200 font-medium"
            >
              My Spares
            </Link>
            <Link 
              to="/messages" 
              className="text-gray-700 hover:text-[#cfb991] transition-colors duration-200 font-medium"
            >
              Messages
            </Link>
            <Link 
              to="/chatbot" 
              className="text-gray-700 hover:text-[#cfb991] transition-colors duration-200 font-medium"
            >
              SpareSwap Assistant
            </Link>
            
            {/* User Menu or Sign In Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#cfb991] transition-colors duration-200"
                >
                  <UserIcon className="w-6 h-6" />
                  <span className="font-medium">{user?.email?.split('@')[0] || 'User'}</span>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-[60]">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="bg-[#cfb991] text-black px-6 py-2 rounded-md hover:bg-[#b8a882] transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
