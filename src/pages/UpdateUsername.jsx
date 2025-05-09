import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateUsername = () => {
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      navigate('/login', { state: { message: 'Please login to update your username' } });
      return;
    }

    // Get current user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://popstream.pythonanywhere.com/api/auth/user/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data);
        setUsername(response.data.username || '');
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { state: { message: 'Session expired. Please login again.' } });
        } else {
          setError('Failed to load user data');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    try {
      const response = await axios.patch('/api/auth/user/update-username/', {
        username
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Username updated successfully!');
      setCurrentUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-pink-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold">
              <span className="text-navy-800">P</span>
              <span className="inline-block">
                <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <span className="text-navy-800">P</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-800">STREAM</div>
          <h2 className="text-2xl font-semibold text-gray-700 mt-6">Update Username</h2>
          <p className="text-gray-500 mt-2">Change your username</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {currentUser && (
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (Cannot be changed)
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                value={currentUser.email}
                disabled
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="New Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium shadow-md hover:from-purple-600 hover:to-pink-600 transition duration-300 flex justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Update Username'
              )}
            </button>

            <div className="flex justify-center mt-6">
              <Link to="/profile" className="text-purple-600 hover:text-purple-800 font-medium">
                Back to Profile
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateUsername;