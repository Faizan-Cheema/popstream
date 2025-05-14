import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import popstream from '../assets/pop-stream-blue.png';
import axios from 'axios';

const Home = () => {
  const token = localStorage.getItem('accessToken');
  const isAuthenticated = !!token;
  const [subscription, setSubscription] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch subscription data if the user is authenticated
    if (isAuthenticated) {
      setIsLoading(true);
      axios.get('https://popstream.pythonanywhere.com/s/subscription_type/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log(response.data);
        setSubscription(response.data.subscription_type || 'free');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subscription:', error);
        // Default to free if there's an error
        setSubscription('free');
        setIsLoading(false);
      });
    } else {
      // If not authenticated, don't try to fetch subscription data
      setSubscription(null);
    }
  }, [isAuthenticated, token]);

  const handleUpgrade = (plan) => {
    if (!isAuthenticated) {
      // If not logged in, redirect to login
      showNotification("Please log in to subscribe");
      navigate('/login');
      return;
    }

    navigate(`/subscription/checkout?plan=${plan}`);
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper function to get subscription display text
  const getSubscriptionDisplayText = (sub) => {
    if (sub === 'standard_monthly' || sub === '"standard_monthly"') return 'Monthly';
    if (sub === 'standard_yearly' || sub === '"standard_yearly"') return 'Yearly';
    if (sub === 'pro_monthly' || sub === '"pro_monthly"') return 'Monthly';
    if (sub === 'pro_yearly' || sub === '"pro_yearly"') return 'Yearly';
    return '';
  };

  // Helper function to determine if user has a specific plan type
  const hasStandardPlan = () => {
    return subscription === 'standard_monthly' || 
           subscription === '"standard_monthly"' || 
           subscription === 'standard_yearly' || 
           subscription === '"standard_yearly"';
  };

  const hasProPlan = () => {
    return subscription === 'pro_monthly' || 
           subscription === '"pro_monthly"' || 
           subscription === 'pro_yearly' || 
           subscription === '"pro_yearly"';
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
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-300 bg-purple-900 bg-opacity-30 hover:bg-opacity-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
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
      <div className="bg-gradient-to-b from-[#070D40] to-[#061035] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">POP STREAM</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
            Choose the perfect subscription plan for your entertainment needs
          </p>
          {isAuthenticated && subscription && subscription !== 'free' && (
            <div className="mt-4 text-lg text-green-300">
              Current Plan: {subscription.includes('standard') ? 'Standard' : 'Pro'} ({getSubscriptionDisplayText(subscription)})
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isAuthenticated && isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Subscription Plans Section */}
      <div className="py-12 bg-[#061035]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Subscription Plans
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-purple-200 mx-auto">
              Select the plan that works best for you
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 lg:grid-cols-3">
              {/* Free Plan */}
              <div className={`border-2 ${isAuthenticated && subscription === 'free' ? 'border-green-400' : 'border-purple-700'} rounded-xl shadow-lg p-6 bg-[#070D40] hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">FREE</h3>
                  <div className="mt-4 flex justify-center">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300">$0</span>
                    <span className="ml-1 text-xl font-medium text-purple-300 self-end mb-1">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-4 text-left">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">Basic features for small needs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">Watermark</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">PopStream banner repetition</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">1 Aruco</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">Single playlist with 3 images</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">Static images (jpg, png)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">640x480 resolution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">Bug fixes only</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    {isAuthenticated && subscription === 'free' ? (
                      <span className="inline-block px-4 py-2 text-green-400 font-medium bg-green-900 bg-opacity-30 rounded-full border border-green-400">
                        Current Plan
                      </span>
                    ) : isAuthenticated ? (
                      <button
                        className="w-full px-4 py-2 text-gray-300 font-medium bg-gray-800 rounded-md hover:bg-gray-700 transition-colors duration-300"
                        onClick={() => showNotification("You already have the free plan")}
                      >
                        Free Plan
                      </button>
                    ) : (
                      <Link
                        to="/signup"
                        className="block w-full px-4 py-2 text-white font-medium bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-300"
                      >
                        Get Started
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Standard Plan - Combined Monthly/Yearly */}
              <div className={`border-2 ${hasStandardPlan() ? 'border-green-400' : 'border-purple-600'} rounded-xl shadow-lg p-6 bg-[#070D40] hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">STANDARD</h3>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="flex justify-center">
                      <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">$6.99</span>
                      <span className="ml-1 text-xl font-medium text-purple-300 self-end mb-1">/ month</span>
                    </div>
                    <div className="mt-2 text-purple-300 text-sm">
                      OR
                    </div>
                    <div className="flex justify-center mt-2">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">$59.99</span>
                      <span className="ml-1 text-lg font-medium text-purple-300 self-end mb-1">/ year</span>
                      <span className="ml-2 text-sm text-green-400 self-end mb-1">(Save 28%)</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-4 text-left">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">Ideal for small businesses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">No watermark, no banner</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">2 Aruco markers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">3 playlists, each with 3 images</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">Static/animated images (jpg, png, gif)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">720p resolution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-purple-100">Bug fixes & new features</span>
                    </li>
                  </ul>
                  <div className="mt-8 space-y-4">
                    {hasStandardPlan() ? (
                      <span className="inline-block px-4 py-2 text-green-400 font-medium bg-green-900 bg-opacity-30 rounded-full border border-green-400">
                        Current Plan ({getSubscriptionDisplayText(subscription)})
                      </span>
                    ) : isAuthenticated && hasProPlan() ? (
                      <button
                        className="w-full px-4 py-2 text-gray-300 font-medium bg-gray-800 rounded-md hover:bg-gray-700 transition-colors duration-300"
                        onClick={() => showNotification("You're already subscribed to a higher plan")}
                      >
                        Downgrade
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleUpgrade('standard_monthly')}
                          className="block w-full px-4 py-2 text-white font-medium bg-purple-700 rounded-md hover:bg-purple-600 transition-colors duration-300"
                        >
                          Monthly Plan
                        </button>
                        <button
                          onClick={() => handleUpgrade('standard_yearly')}
                          className="block w-full px-4 py-2 text-white font-medium bg-purple-900 rounded-md hover:bg-purple-800 transition-colors duration-300"
                        >
                          Yearly Plan (Save 28%)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pro Plan - Combined Monthly/Yearly */}
              <div className={`border-2 ${hasProPlan() ? 'border-green-400' : 'border-pink-500'} rounded-xl shadow-lg p-6 bg-[#070D40] hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 relative overflow-hidden`}>
                <div className="absolute -top-2 -right-12 transform rotate-45 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-1 px-12 text-xs font-bold">
                  BEST VALUE
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">PRO</h3>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="flex justify-center">
                      <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">$12.99</span>
                      <span className="ml-1 text-xl font-medium text-purple-300 self-end mb-1">/ month</span>
                    </div>
                    <div className="mt-2 text-purple-300 text-sm">
                      OR
                    </div>
                    <div className="flex justify-center mt-2">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">$109.99</span>
                      <span className="ml-1 text-lg font-medium text-purple-300 self-end mb-1">/ year</span>
                      <span className="ml-2 text-sm text-green-400 self-end mb-1">(Save 29%)</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-4 text-left">
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-purple-100">For advanced users</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-purple-100">No watermark, no banner</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-purple-100">2+ Aruco markers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-purple-100">Unlimited playlists & images</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-purple-100">Static/animated images (jpg, png, webp, gif)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-purple-100">Full HD resolution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-purple-100">Bug fixes & new features</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-purple-100">Priority support</span>
                    </li>
                  </ul>
                  <div className="mt-8 space-y-4">
                    {hasProPlan() ? (
                      <span className="inline-block px-4 py-2 text-green-400 font-medium bg-green-900 bg-opacity-30 rounded-full border border-green-400">
                        Current Plan ({getSubscriptionDisplayText(subscription)})
                      </span>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleUpgrade('pro_monthly')}
                          className="block w-full px-4 py-2 text-white font-medium bg-gradient-to-r from-purple-600 to-pink-500 rounded-md hover:from-purple-700 hover:to-pink-600 transition-colors duration-300"
                        >
                          Monthly Plan
                        </button>
                        <button
                          onClick={() => handleUpgrade('pro_yearly')}
                          className="block w-full px-4 py-2 text-white font-medium bg-gradient-to-r from-purple-700 to-pink-600 rounded-md hover:from-purple-800 hover:to-pink-700 transition-colors duration-300"
                        >
                          Yearly Plan (Save 29%)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 md:py-4 md:text-lg md:px-10 shadow-lg"
              >
                Get Started Now
              </Link>
            )}
          </div>
        </div>
      </div>

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

export default Home;