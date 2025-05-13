import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import popstream from '../assets/pop-stream-blue.png';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState({
    username: false,
    firstName: false,
    lastName: false
  });
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/login', { state: { message: 'Please login to view your profile' } });
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://popstream.pythonanywhere.com/api/auth/profile/');
        setUser(response.data);
        setFormData({
          username: response.data.username || '',
          firstName: response.data.first_name || '',
          lastName: response.data.last_name || ''
        });
        if (response.data.profile_picture) {
          setProfilePicturePreview(response.data.profile_picture);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          navigate('/login', { state: { message: 'Session expired. Please login again.' } });
        } else {
          setError('Failed to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      await axios.post('https://popstream.pythonanywhere.com/api/auth/signout/', {
        refresh_token: refreshToken
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('email');
      localStorage.removeItem('username');

      navigate('/login', { state: { message: 'You have been signed out successfully' } });
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out properly');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('email');
      localStorage.removeItem('username');

      navigate('/login');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append('profile_picture', profilePicture);

    try {
      const response = await axios.patch(
        'https://popstream.pythonanywhere.com/api/auth/profile/update/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUser(prev => ({
        ...prev,
        profile_picture: response.data.profile_picture
      }));

      showNotification('Profile picture updated successfully!');
      setProfilePicture(null);
    } catch (err) {
      console.error('Error updating profile picture:', err);
      showNotification('Failed to update profile picture');
    }
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));

    if (isEditing[field]) {
      setFormData(prev => ({
        ...prev,
        [field === 'firstName' ? 'firstName' : field === 'lastName' ? 'lastName' : 'username']:
          field === 'firstName' ? user.first_name || '' :
            field === 'lastName' ? user.last_name || '' :
              user.username || ''
      }));
    }
  };

  const handleUpdate = async (field) => {
    if (
      (field === 'firstName' && formData.firstName === user.first_name) ||
      (field === 'lastName' && formData.lastName === user.last_name) ||
      (field === 'username' && formData.username === user.username)
    ) {
      toggleEdit(field);
      return;
    }

    const token = localStorage.getItem('accessToken');

    try {
      setUpdateMessage('');
      setUpdateStatus('');

      const updateData = {};
      if (field === 'firstName') {
        updateData.first_name = formData.firstName;
      } else if (field === 'lastName') {
        updateData.last_name = formData.lastName;
      } else if (field === 'username') {
        updateData.username = formData.username;
      }

      const response = await axios.patch(
        'https://popstream.pythonanywhere.com/api/auth/profile/update/',
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(prev => ({
        ...prev,
        ...(field === 'firstName' ? { first_name: formData.firstName } : {}),
        ...(field === 'lastName' ? { last_name: formData.lastName } : {}),
        ...(field === 'username' ? { username: formData.username } : {})
      }));

      if (field === 'username') {
        localStorage.setItem('username', formData.username);
      }

      showNotification(`${field === 'firstName' ? 'First name' : field === 'lastName' ? 'Last name' : 'Username'} updated successfully!`);
      toggleEdit(field);
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      const errorMessage = err.response?.data?.detail ||
        err.response?.data?.error ||
        err.response?.data?.[field === 'firstName' ? 'first_name' : field === 'lastName' ? 'last_name' : 'username']?.[0] ||
        `Failed to update ${field === 'firstName' ? 'first name' : field === 'lastName' ? 'last name' : 'username'}`;
      showNotification(errorMessage);
    }
  };

  const renderEditableField = (label, value, field, placeholder) => {
    const fieldKey = field === 'first_name' ? 'firstName' : field === 'last_name' ? 'lastName' : 'username';
    const formValue = formData[fieldKey];
    const isReadOnly = field === 'email';

    return (
      <div className="bg-[#070D40] border border-purple-800 p-4 rounded-lg mb-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className={isEditing[fieldKey] ? "w-full" : ""}>
            <label className="block text-sm font-medium text-purple-300 mb-1">{label}</label>

            {isEditing[fieldKey] ? (
              <div className="mt-1 flex flex-col space-y-2">
                <input
                  type="text"
                  name={fieldKey}
                  value={formValue}
                  onChange={handleInputChange}
                  className="flex-grow px-3 py-2 bg-[#0B0B4F] border border-purple-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                  placeholder={placeholder}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(fieldKey)}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => toggleEdit(fieldKey)}
                    className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base text-purple-100 mt-1">{value || '-'}</p>
            )}
          </div>

          {!isEditing[fieldKey] && !isReadOnly && (
            <button
              onClick={() => toggleEdit(fieldKey)}
              className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Edit
            </button>
          )}

          {isReadOnly && (
            <span className="text-xs bg-[#0B0B4F] text-purple-400 px-2 py-1 rounded-full border border-purple-700">
              Read only
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#060F33] to-[#061035]">
      {/* Header/Navigation */}
      <nav className="bg-[#0B0B4B] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center">
                  <a href="https://popstream.net/" className="w-24">
                    <img src={popstream} alt="POP STREAM" />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-300 bg-purple-900 bg-opacity-30 hover:bg-opacity-50"
              >
                Home
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border-l-4 border-red-500 text-red-200 rounded">
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : user ? (
            <div className="bg-[#070D40] rounded-xl shadow-lg overflow-hidden border border-purple-900">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-8 sm:px-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full bg-[#0B0B4F] flex items-center justify-center text-4xl font-bold text-purple-300 border-4 border-purple-400 shadow-lg overflow-hidden">
                      {profilePicturePreview ? (
                        <img
                          src={profilePicturePreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : user.username ? (
                        user.username[0].toUpperCase()
                      ) : (
                        <span className="text-purple-400">?</span>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-black bg-opacity-50 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                  {profilePicture && (
                    <button
                      onClick={handleUploadProfilePicture}
                      className="mt-3 px-3 py-1 bg-purple-800 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                    >
                      Save Picture
                    </button>
                  )}
                  <h1 className="mt-4 text-2xl font-bold text-white">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user.username || 'User'}
                  </h1>
                  <p className="text-purple-100">{user.email}</p>
                </div>
              </div>

              {/* Profile Content */}
              <div className="px-6 py-6 sm:px-8">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 pb-2 border-b border-purple-800">
                  Account Information
                </h2>

                <div className="space-y-4">
                  {renderEditableField('First Name', user.first_name, 'first_name', 'Enter first name')}
                  {renderEditableField('Last Name', user.last_name, 'last_name', 'Enter last name')}
                  {renderEditableField('Username', user.username, 'username', 'Enter username')}
                  {renderEditableField('Email Address', user.email, 'email', '')}

                  <div className="bg-[#070D40] border border-purple-800 p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">Password</label>
                        <p className="text-base text-purple-100">••••••••</p>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Change Password
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Subscription Info (if available) */}
                <div className="mt-8 pt-6 border-t border-purple-800">
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                    Subscription
                  </h2>
                  <div className="bg-[#070D40] border border-purple-800 p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">Current Plan</label>
                        <p className="text-base text-purple-100">
                          {user.subscription_type ? (
                            <>
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-medium">
                                {user.subscription_type.charAt(0).toUpperCase() + user.subscription_type.slice(1)}
                              </span>
                              {user.subscription_type.includes('yearly') && <span className="ml-2 text-green-400 text-sm">(Yearly)</span>}
                            </>
                          ) : (
                            'Free'
                          )}
                        </p>
                      </div>
                      <Link
                        to="/"
                        className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Manage Plan
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="mt-8 pt-6 border-t border-purple-800">
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                    Account Actions
                  </h2>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2.5 px-4 rounded-lg text-center font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-500 text-yellow-300 rounded mb-6">
                <p>Unable to load profile. Please try again later.</p>
              </div>
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg border border-purple-500 flex items-center space-x-2 animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0B0B4F] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-center">
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right">
                &copy; {new Date().getFullYear()} {' '}
                <a href="https://popstream.net/" className="w-8">
                  POP STREAM.{' '}
                </a>
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;