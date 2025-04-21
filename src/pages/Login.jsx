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
      const response = await axios.post('http://127.0.0.1:8000/api/auth/signin/', {
        email,
        password
      });
      
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('email', email);
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      // Redirect to home 
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
              <img src={popstream} alt="" />
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