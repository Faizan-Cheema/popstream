import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        // Optional: verify token validity by making a GET request
        await axios.get(`/api/auth/reset-password/${uidb64}/${token}/`);
      } catch (err) {
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
      const response = await axios.post(`/api/auth/reset-password/${uidb64}/${token}/`, {
        password
      });
      
      setMessage(response.data.message);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-pink-100">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <div className="text-red-600 text-xl mb-4">Invalid or Expired Link</div>
          <p className="mb-6">The password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-semibold text-gray-700 mt-6">Reset Password</h2>
          <p className="text-gray-500 mt-2">Enter your new password</p>
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

        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-4">Password reset successful! Redirecting to login...</p>
          </div>
        )}
        
        <div className="text-center mt-6">
          <Link to="/login" className="text-purple-600 hover:text-purple-800 text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;