import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
        'Bug fixes & new features'
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
        'Bug fixes & new features'
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">
              {error || 'Invalid subscription plan selected. Please go back and select a valid plan.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8">
                <img src={popstream} alt="POP STREAM" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">POP STREAM</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Subscription Checkout</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Order Summary */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Details of your subscription plan.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Plan Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {selectedPlan.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Subscription Price</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="font-bold">{selectedPlan.price}</span>
                    {isYearly && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Save {selectedPlan.savingsPercent}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Billing Period</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {selectedPlan.billingPeriod}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Features</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 flex-1 w-0 truncate">{feature}</span>
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
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  You will be redirected to Stripe's secure payment page to complete your purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="mr-4 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`${
                isPro 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
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
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <div className="flex items-center">
                <div className="w-6">
                  <img src={popstream} alt="POP STREAM" />
                </div>
                <span className="ml-2 text-base font-medium text-gray-800">POP STREAM</span>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-base text-gray-500">
                &copy; {new Date().getFullYear()} POP STREAM. All rights reserved.
              </p>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Your payment is securely processed by Stripe. We do not store your card details.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionCheckout;