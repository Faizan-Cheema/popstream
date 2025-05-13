import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import popstream from '../assets/pop-stream-blue.png';

const SubscriptionCheckout = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Plan details with updated pricing
  const planDetails = {
    standard_monthly: {
      name: 'STANDARD MONTHLY',
      price: '$6.99',
      billingPeriod: 'Monthly (auto-renews until canceled)',
      features: [
        'Ideal for small businesses',
        'No watermark, no banner',
        '2 Aruco markers',
        '3 playlists, each with 3 images',
        'Static/animated images (jpg, png, gif)',
        '720p resolution',
        'Bug fixes & new features'
      ]
    },
    pro_monthly: {
      name: 'PRO MONTHLY',
      price: '$12.99',
      billingPeriod: 'Monthly (auto-renews until canceled)',
      features: [
        'For advanced users',
        'No watermark, no banner',
        '2+ Aruco markers',
        'Unlimited playlists & images',
        'Static/animated images (jpg, png, webp, gif)',
        'Full HD resolution',
        'Bug fixes & new features',
        'Priority support'
      ]
    },
    standard_yearly: {
      name: 'STANDARD YEARLY',
      price: '$59.88',
      billingPeriod: 'Yearly (auto-renews until canceled)',
      savingsPercent: '29%',
      features: [
        'Ideal for small businesses',
        'No watermark, no banner',
        '2 Aruco markers',
        '3 playlists, each with 3 images',
        'Static/animated images (jpg, png, gif)',
        '720p resolution',
        'Bug fixes & new features'
      ]
    },
    pro_yearly: {
      name: 'PRO YEARLY',
      price: '$119.88',
      billingPeriod: 'Yearly (auto-renews until canceled)',
      savingsPercent: '23%',
      features: [
        'For advanced users',
        'No watermark, no banner',
        '2+ Aruco markers',
        'Unlimited playlists & images',
        'Static/animated images (jpg, png, webp, gif)',
        'Full HD resolution',
        'Bug fixes & new features',
        'Priority support'
      ]
    }
  };

  // Validate that we have a valid plan
  useEffect(() => {
    if (!planId || !Object.keys(planDetails).includes(planId)) {
      setError('Invalid subscription plan selected');
    }
  }, [planId]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`https://popstream.pythonanywhere.com/s/checkout/?plan=${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Redirect to Stripe checkout
      if (response.data.checkout) {
        window.location.href = response.data.checkout;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  // If no valid plan is selected
  if (!planId || !planDetails[planId]) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#060F33] to-[#061035]">
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-[#070D40] p-8 rounded-lg shadow-md max-w-md w-full border border-purple-700">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
            <p className="text-purple-200">
              {error || 'Invalid subscription plan selected. Please go back and select a valid plan.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedPlan = planDetails[planId];
  const isPro = planId.startsWith('pro');
  const isYearly = planId.endsWith('yearly');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#060F33] to-[#061035]">
      {/* Header */}
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
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-white">Subscription Checkout</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Order Summary */}
          <div className="bg-[#070D40] shadow-lg overflow-hidden sm:rounded-lg border border-purple-700">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-white">Order Summary</h2>
              <p className="mt-1 max-w-2xl text-sm text-purple-300">
                Details of your subscription plan.
              </p>
            </div>
            <div className="border-t border-purple-700">
              <dl>
                <div className="bg-[#080E45] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-purple-300">Plan Name</dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {selectedPlan.name}
                  </dd>
                </div>
                <div className="bg-[#070D40] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-purple-300">Subscription Price</dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{selectedPlan.price}</span>
                    {isYearly && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-900 text-green-400 rounded-full border border-green-400">
                        Save {selectedPlan.savingsPercent}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="bg-[#080E45] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-purple-300">Billing Period</dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {selectedPlan.billingPeriod}
                  </dd>
                </div>
                <div className="bg-[#070D40] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-purple-300">Features</dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    <ul className="border border-purple-700 rounded-md divide-y divide-purple-700">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <svg className={`flex-shrink-0 h-5 w-5 ${isPro ? 'text-pink-400' : 'text-purple-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 flex-1 w-0 truncate text-purple-100">{feature}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="mt-6 bg-[#0A1456] border border-blue-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-300">
                  You will be redirected to Stripe's secure payment page to complete your purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-900 bg-opacity-30 border border-red-500 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="mr-4 bg-[#080E45] py-2 px-4 border border-purple-500 rounded-md shadow-sm text-sm font-medium text-purple-300 hover:bg-[#0A1050] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`${
                isPro 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0B4F] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-center">
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-center">
                &copy; {new Date().getFullYear()} {' '}
                <a href="https://popstream.net/" className="w-8">
                  POP STREAM.{' '}
                </a>
                All rights reserved.
              </p>
              <div className="mt-2 text-center text-sm text-purple-300">
                <p>Your payment is securely processed by Stripe. We do not store your card details.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionCheckout;