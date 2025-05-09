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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gradient-to-b from-pink-100 via-pink-200 to-pink-100 rounded-lg shadow-xl px-8 py-2 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="w-32">
              <img src={popstream} alt="Pop Stream Logo" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-700 mt-2">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Enter your credentials to login</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-purple-600 hover:text-purple-800 text-sm">
            Forgot password?
          </Link>
        </div>
        
        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">Don't have an account?</span>
          <Link to="/signup" className="text-purple-600 hover:text-purple-800 text-sm font-medium ml-2">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;