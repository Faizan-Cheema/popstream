import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      navigate('/login', { state: { message: 'Please login to view your profile' } });
      return;
    }

    // Get user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/user/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { state: { message: 'Session expired. Please login again.' } });
        } else {
          setError('Failed to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    
    try {
      await axios.post('/api/auth/signout/', {
        refresh_token: refreshToken
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear tokens from storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      
      navigate('/login', { state: { message: 'You have been signed out successfully' } });
    } catch (err) {
      setError('Failed to sign out properly');
      
      // Even if API call fails, clear tokens and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-pink-100">
      {/* Header/Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="text-2xl font-bold">
                  <span className="text-navy-800">P</span>
                  <span className="inline-block">
                    <svg className="w-6 h-6" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="25" cy="25" r="20" fill="url(#pop-gradient)" />
                      <path d="M15,25 Q25,10 35,25 Q25,40 15,25" fill="#fff" />
                      <defs>
                        <linearGradient id="pop-gradient" x1="0" y1="0" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="50%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <span className="text-navy-800">P STREAM</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : user ? (
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-10 sm:px-10">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-purple-500 border-4 border-white shadow-lg">
                    {user.username && user.username[0].toUpperCase()}
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                    <p className="text-purple-100">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="px-6 py-8 sm:px-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Information</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Username</h3>
                        <p className="text-base font-medium text-gray-900 mt-1">{user.username}</p>
                      </div>
                      <Link
                        to="/update-username"
                        className="text-sm font-medium text-purple-600 hover:text-purple-800"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                        <p className="text-base font-medium text-gray-900 mt-1">{user.email}</p>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        Cannot change
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Password</h3>
                        <p className="text-base font-medium text-gray-900 mt-1">••••••••</p>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-purple-600 hover:text-purple-800"
                      >
                        Reset
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Account Management Section */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Management</h2>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 px-4 rounded-lg text-center font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Unable to load profile. Please try again later.</p>
              <Link
                to="/"
                className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-medium"
              >
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} POP STREAM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;