import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import popstream from '../assets/pop-stream-blue.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const response = await axios.post('https://popstream.pythonanywhere.com/api/auth/forgot-password/', {
        email
      });
      
      setMessage(response.data.message || 'Password reset link sent to your email.');
      setIsSubmitted(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'Failed to send password reset email. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#060F33] to-[#061035]">

      {/* Main Forgot Password Container */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full bg-[#070D40] rounded-xl shadow-2xl border border-purple-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-[#0B0B4B] px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-32">
                <img src={popstream} alt="Pop Stream Logo" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-purple-200 mt-2">Enter your email to receive a reset link</p>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 p-3 bg-red-900 bg-opacity-30 border border-red-500 text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-3 bg-green-900 bg-opacity-30 border border-green-500 text-green-200 rounded-lg text-sm">
                {message}
              </div>
            )}

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
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
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div className="text-center text-white">
                <p className="mb-4">Check your email for the password reset link.</p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                    setEmail('');
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                >
                  Send Again
                </button>
              </div>
            )}
            
            <div className="text-center mt-6 pt-6 border-t border-purple-800">
              <span className="text-purple-300 text-sm">Remember your password?</span>
              <Link to="/login" className="text-purple-400 hover:text-purple-300 text-sm font-medium ml-2">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;