import React, { useState, useEffect } from 'react';
import ItemsGrid from '../components/ItemsGrid';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();
  const { signIn, signUp, user, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle login/signup
  const handleSubmit = async () => {
    setLoadingAuth(true);
    setAuthMessage('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          setAuthMessage(`Error: ${error.message}`);
        } else {
          setAuthMessage('Login successful!');
          navigate('/'); // Redirect to home page
        }
      } else {
        const { error } = await signUp(email, password);
        
        if (error) {
          setAuthMessage(`Error: ${error.message}`);
        } else {
          setAuthMessage('Signup successful! Please check your email to confirm.');
        }
      }
    } catch (err) {
      setAuthMessage(`Unexpected error: ${err.message}`);
    }

    setLoadingAuth(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c28e0e] via-[#ceb888] to-[#000000]">
      {/* Main Container - Both sides centered together */}
      <div className="flex items-center justify-center">
        

        {/* Right Side: Auth Form */}
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-xl w-full">
          <h1 className="text-white text-7xl font-bold -mb-3 leading-tight drop-shadow-md">
            Looking for
          </h1>
          <h1 className="text-white text-7xl font-bold -mb-3 leading-tight drop-shadow-lg">
            spare parts?
          </h1>
          <h1 className="text-[#c28e0e] text-7xl font-bold -mb-2 leading-tight drop-shadow-md">
            We've got you.
          </h1>

          {/* Auth Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white text-lg mb-2 drop-shadow-md">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#b0b0b0] bg-opacity-80 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-black-300 backdrop-blur-sm"
                placeholder="username@purdue.edu"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white text-lg mb-2 drop-shadow-md">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#b0b0b0] bg-opacity-80 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-black-300 backdrop-blur-sm"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loadingAuth}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
            >
              {loadingAuth ? (isLogin ? 'Signing In...' : 'Signing Up...') : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {authMessage && <p className="mt-4 text-center text-white">{authMessage}</p>}

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setAuthMessage('');
              }}
              className="text-gray-300 hover:text-white hover:underline text-sm drop-shadow-md"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>

          {/* Forgot password */}
          <div className="mt-2 text-center">
            <a href="#" className="text-gray-300 hover:text-white hover:underline text-sm drop-shadow-md">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}