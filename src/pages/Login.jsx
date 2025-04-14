// Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log({ email, password, rememberMe });
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
          <h2 className="text-2xl font-semibold text-gray-700 mt-6">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Enter your credential to login</p>
        </div>

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
          
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember Me
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
          >
            Login
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