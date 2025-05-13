import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import popstream from '../assets/pop-stream-blue.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate the token
    const validateToken = async () => {
      try {
        // Verify token validity by making a GET request
        await axios.get(`https://popstream.pythonanywhere.com/api/auth/reset-password/${uidb64}/${token}/`);
      } catch (err) {
        console.error('Token validation error:', err);
        setIsValid(false);
        setError('Invalid or expired password reset link.');
      }
    };

    validateToken();
  }, [uidb64, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`https://popstream.pythonanywhere.com/api/auth/reset-password/${uidb64}/${token}/`, {
        password
      });
      
      setMessage(response.data.message || 'Password has been reset successfully.');
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'Failed to reset password. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isValid) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#060F33] to-[#061035]">
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full bg-[#070D40] rounded-xl shadow-2xl border border-purple-700 overflow-hidden text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="w-32">
                <img src={popstream} alt="Pop Stream Logo" />
              </div>
            </div>
            <div className="text-red-400 text-xl mb-4">Invalid or Expired Link</div>
            <p className="mb-6 text-purple-200">The password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#060F33] to-[#061035]">
      {/* Main Reset Password Container */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full bg-[#070D40] rounded-xl shadow-2xl border border-purple-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-[#0B0B4B] px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-32">
                <img src={popstream} alt="Pop Stream Logo" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Set New Password</h2>
            <p className="text-purple-200 mt-2">Create a strong password for your account</p>
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

            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 bg-[#0A1144] border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-4 py-3 bg-[#0A1144] border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            ) : (
              <div className="text-center text-white">
                <p className="mb-4">Password reset successful! Redirecting to login...</p>
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

export default ResetPassword;