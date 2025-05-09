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

      setUpdateMessage('Profile picture updated successfully!');
      setUpdateStatus('success');
      setTimeout(() => {
        setUpdateMessage('');
        setUpdateStatus('');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile picture:', err);
      setUpdateMessage('Failed to update profile picture');
      setUpdateStatus('error');
    }
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

      setUpdateMessage(`${field === 'firstName' ? 'First name' : field === 'lastName' ? 'Last name' : 'Username'} updated successfully!`);
      setUpdateStatus('success');
      toggleEdit(field);

      setTimeout(() => {
        setUpdateMessage('');
        setUpdateStatus('');
      }, 3000);
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      const errorMessage = err.response?.data?.detail ||
        err.response?.data?.error ||
        err.response?.data?.[field === 'firstName' ? 'first_name' : field === 'lastName' ? 'last_name' : 'username']?.[0] ||
        `Failed to update ${field === 'firstName' ? 'first name' : field === 'lastName' ? 'last name' : 'username'}`;
      setUpdateMessage(errorMessage);
      setUpdateStatus('error');
    }
  };

  const renderEditableField = (label, value, field, placeholder) => {
    const fieldKey = field === 'first_name' ? 'firstName' : field === 'last_name' ? 'lastName' : 'username';
    const formValue = formData[fieldKey];
    const isReadOnly = field === 'email';

    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className={isEditing[fieldKey] ? "w-full" : ""}>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>

            {isEditing[fieldKey] ? (
              <div className="mt-1 flex flex-col space-y-2">
                <input
                  type="text"
                  name={fieldKey}
                  value={formValue}
                  onChange={handleInputChange}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder={placeholder}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(fieldKey)}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => toggleEdit(fieldKey)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base text-gray-800 mt-1">{value || '-'}</p>
            )}
          </div>

          {!isEditing[fieldKey] && !isReadOnly && (
            <button
              onClick={() => toggleEdit(fieldKey)}
              className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
            >
              Edit
            </button>
          )}

          {isReadOnly && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
              Read only
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="w-24">
                  <img src={popstream} alt="POP STREAM" />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </header >

      {/* Main Content */}
      < main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8" >
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {
          loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : user ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-8 sm:px-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-purple-500 border-4 border-white shadow-lg overflow-hidden">
                      {profilePicturePreview ? (
                        <img
                          src={profilePicturePreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : user.username ? (
                        user.username[0].toUpperCase()
                      ) : (
                        <span className="text-gray-400">?</span>
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
                      className="mt-3 px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
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
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Account Information</h2>

                {updateMessage && (
                  <div className={`mb-6 p-3 rounded-lg ${updateStatus === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {updateMessage}
                  </div>
                )}

                <div className="space-y-4">
                  {renderEditableField('First Name', user.first_name, 'first_name', 'Enter first name')}
                  {renderEditableField('Last Name', user.last_name, 'last_name', 'Enter last name')}
                  {renderEditableField('Username', user.username, 'username', 'Enter username')}
                  {renderEditableField('Email Address', user.email, 'email', '')}

                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <p className="text-base text-gray-800">••••••••</p>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        Change Password
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2.5 px-4 rounded-lg text-center font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-sm transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded mb-6">
                <p>Unable to load profile. Please try again later.</p>
              </div>
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          )
        }
      </main >

      {/* Footer */}
      < footer className="bg-white border-t border-gray-200 py-6 mt-8" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} POP STREAM. All rights reserved.
        </div>
      </footer >
    </div >
  );
};

export default UserProfile;