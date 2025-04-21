import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import popstream from '../assets/pop-stream-blue.png';
import axios from 'axios';

const Home = () => {
  const token = localStorage.getItem('accessToken') ;
  const isAuthenticated = token;
  const [subscription, setSubscription] = useState('free');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://127.0.0.1:8000/s/subscription_type/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then(response => {
        console.log(response.data);
        setSubscription(response.data.subscription_type);
      })
      .catch(error => {
        console.error('Error fetching subscription:', error);
      });
    }
  }, [isAuthenticated]);

  const handleUpgrade = (plan) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    navigate(`/subscription/checkout?plan=${plan}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header/Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center">
                  <div className="w-24">
                    <img src={popstream} alt="POP STREAM" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-50 hover:bg-purple-100"
                  >
                    My Profile
                  </Link>
                  
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-50 hover:bg-purple-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-pink-100 via-pink-200 to-pink-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">POP STREAM</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect subscription plan for your entertainment needs
          </p>
        </div>
      </div>

      {/* Subscription Plans Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Subscription Plans
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Select the plan that works best for you
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Free Plan */}
              <div className={`border ${subscription === 'free' ? 'border-green-400' : 'border-gray-200'} rounded-lg shadow-sm p-6 bg-white hover:shadow-lg transition-shadow duration-300`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">FREE</h3>
                  <div className="mt-4 flex justify-center">
                    <span className="text-5xl font-extrabold text-purple-600">$0</span>
                    <span className="ml-1 text-xl font-medium text-gray-500 self-end mb-1">/ mth</span>
                  </div>
                  <ul className="mt-6 space-y-4 text-left">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Basic features for small needs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Watermark</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>PopStream banner repetition</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>1 Aruco</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Single playlist with 3 images</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Static images (jpg, png)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>640x480 resolution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Bug fixes only</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    {subscription === 'free' ? (
                      <span className="inline-block px-4 py-2 text-green-600 font-medium bg-green-100 rounded-full">
                        Current Plan
                      </span>
                    ) : (
                      <button
                        className="w-full px-4 py-2 text-gray-600 font-medium bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-300"
                        onClick={() => alert("You're already subscribed to a higher plan")}
                      >
                        Downgrade
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Standard Plan */}
              <div className={`border ${subscription === 'basic' ? 'border-green-400' : 'border-purple-200'} rounded-lg shadow-sm p-6 bg-white hover:shadow-lg transition-shadow duration-300`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">STANDARD</h3>
                  <div className="mt-4 flex justify-center">
                    <span className="text-5xl font-extrabold text-purple-600">$4.99</span>
                    <span className="ml-1 text-xl font-medium text-gray-500 self-end mb-1">/ mth</span>
                  </div>
                  <ul className="mt-6 space-y-4 text-left">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Ideal for small businesses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>No watermark, no banner</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>2 Aruco markers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>3 playlists, each with 3 images</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Static/animated images (jpg, png, gif)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>720p resolution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Bug fixes & new features</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    {subscription === 'basic' ? (
                      <span className="inline-block px-4 py-2 text-green-600 font-medium bg-green-100 rounded-full">
                        Current Plan
                      </span>
                    ) : subscription === 'pro' ? (
                      <button
                        className="w-full px-4 py-2 text-gray-600 font-medium bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-300"
                        onClick={() => alert("You're already subscribed to a higher plan")}
                      >
                        Downgrade
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade('basic')}
                        className="block w-full px-4 py-2 text-white font-medium bg-purple-600 rounded-md hover:bg-purple-700 transition-colors duration-300"
                      >
                        Upgrade Now
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className={`border ${subscription === 'pro' ? 'border-green-400' : 'border-purple-300'} rounded-lg shadow-md p-6 bg-gradient-to-b from-white to-purple-50 hover:shadow-xl transition-shadow duration-300`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">PRO</h3>
                  <div className="mt-4 flex justify-center">
                    <span className="text-5xl font-extrabold text-purple-600">$9.99</span>
                    <span className="ml-1 text-xl font-medium text-gray-500 self-end mb-1">/ mth</span>
                  </div>
                  <ul className="mt-6 space-y-4 text-left">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>For advanced users</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>No watermark, no banner</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>2+ Aruco markers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Unlimited playlists & images</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Static/animated images (jpg, png, webp, gif)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Full HD resolution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Bug fixes & new features</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    {subscription === 'pro' ? (
                      <span className="inline-block px-4 py-2 text-green-600 font-medium bg-green-100 rounded-full">
                        Current Plan
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpgrade('pro')}
                        className="block w-full px-4 py-2 text-white font-medium bg-gradient-to-r from-purple-500 to-pink-500 rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors duration-300"
                      >
                        Upgrade Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link
              to={isAuthenticated ? "/" : "/signup"}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 shadow-lg"
            >
              {isAuthenticated ? "Go to Home" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <div className="flex items-center">
                <div className="w-8">
                  <img src={popstream} alt="POP STREAM" className="filter brightness-0 invert" />
                </div>
                <span className="ml-2 text-xl font-bold">POP STREAM</span>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right">
                &copy; {new Date().getFullYear()} POP STREAM. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;