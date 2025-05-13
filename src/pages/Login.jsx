import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import popstream from '../assets/pop-stream-blue.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Make sure to use the correct endpoint matching your backend URLs
      const response = await axios.post('https://popstream.pythonanywhere.com/api/auth/signin/', {
        email,
        password
      });
      
      // Check if we have both tokens in the response
      if (response.data.access && response.data.refresh) {
        // Store tokens and user info
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('email', email);
        
        if (response.data.username) {
          localStorage.setItem('username', response.data.username);
        }
        
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        // Redirect to home 
        navigate('/');
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error response formats
      if (err.response) {
        // The backend returned an error response
        if (err.response.data.detail) {
          setError(err.response.data.detail);
        } else if (err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors[0]);
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else if (err.request) {
        // No response received from the server
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        setError('Error setting up request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#060F33] to-[#061035]">

      {/* Main Login Container */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full bg-[#070D40] rounded-xl shadow-2xl border border-purple-700 overflow-hidden">
          {/* Login Header */}
          <div className="bg-gradient-to-r from-purple-900 to-[#0B0B4B] px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-32">
                <img src={popstream} alt="Pop Stream Logo" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-purple-200 mt-2">Enter your credentials to login</p>
          </div>

          {/* Login Form */}
          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 p-3 bg-red-900 bg-opacity-30 border border-red-500 text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-[#0A1144] border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 bg-[#0A1144] border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center mt-6">
                <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 text-sm">
                  Forgot password?
                </Link>
              </div>
              
              <div className="text-center mt-6 pt-6 border-t border-purple-800">
                <span className="text-purple-300 text-sm">Don't have an account?</span>
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 text-sm font-medium ml-2">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;