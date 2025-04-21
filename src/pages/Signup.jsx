import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import popstream from '../assets/pop-stream-blue.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/signup/', {
        email,
        username,
        password
      });

      // Redirect to login page with success message
      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className=" bg-gradient-to-b from-pink-100 via-pink-200 to-pink-100 rounded-lg shadow-xl px-8 py-2 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="w-32">
              <img src={popstream} alt="" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-700 mt-2">Create Account</h2>
          <p className="text-gray-500 mt-2">Join POP STREAM today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <div className="mb-4">
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

          <div className="mb-6">
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="agreeTerms"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-purple-600 hover:text-purple-800">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-800">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">Already have an account?</span>
          <Link to="/login" className="text-purple-600 hover:text-purple-800 text-sm font-medium ml-2">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;