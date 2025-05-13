import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import popstream from '../assets/pop-stream-blue.png';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeProfilePicture = (e) => {
    e.stopPropagation();
    setProfilePicture(null);
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length as per serializer
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      // Updated URL to match backend route structure
      await axios.post('https://popstream.pythonanywhere.com/api/auth/signup/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Redirect to login page with success message
      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' }
      });
    } catch (err) {
      console.error('Error during signup:', err.response?.data);
      setError(
        err.response?.data?.message || 
        (typeof err.response?.data === 'object' ? 
          Object.values(err.response.data).flat().join(', ') : 
          'Signup failed. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#060F33] to-[#061035]">
      {/* Main Signup Container */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full bg-[#070D40] rounded-xl shadow-2xl border border-purple-700 overflow-hidden">
          {/* Signup Header */}
          <div className="bg-gradient-to-r from-purple-900 to-[#0B0B4B] px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-32">
                <img src={popstream} alt="Pop Stream Logo" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-purple-200 mt-2">Join POP STREAM today</p>
          </div>

          {/* Signup Form */}
          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 p-3 bg-red-900 bg-opacity-30 border border-red-500 text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Profile Picture Section */}
              <div className="mb-6 flex flex-col items-center">
                <div 
                  onClick={triggerFileInput}
                  className="w-24 h-24 mb-2 rounded-full bg-[#0A1144] border-2 border-purple-500 flex items-center justify-center overflow-hidden cursor-pointer hover:border-purple-400 transition-all duration-300 relative"
                >
                  {profilePreview ? (
                    <>
                      <img 
                        src={profilePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="text-purple-300 text-4xl">+</div>
                  )}
                </div>
                <input
                  type="file"
                  id="profilePicture"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label htmlFor="profilePicture" className="text-sm text-purple-300 cursor-pointer hover:text-purple-200 transition-all">
                  {profilePreview ? 'Change Picture' : 'Add Profile Picture'}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-purple-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 bg-[#0A1144] border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-purple-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 bg-[#0A1144] border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-purple-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-4 py-3 bg-[#0A1144] border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
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

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 bg-[#0A1144] border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-700 rounded bg-[#0A1144]"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-purple-300">
                  I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-purple-800">
              <span className="text-purple-300 text-sm">Already have an account?</span>
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

export default Signup;