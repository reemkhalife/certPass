// src/components/SignIn.jsx
import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myGif from "../assets/images/signinn.gif";


function SignIn() {
 
  
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-gray">
 
    <div className="w-1/2 h-[400px] max-w-md p-8 space-y-8 bg-white rounded-l-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-custom-green">Sign In</h2>
      <form  className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px ">
       
          <div  >
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
              placeholder="Password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-custom-gradient hover:bg-custom-gray hover:text-custom-gray "
        >
          Sign In
        </button>
      </form>
      <p className="text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <span
            onClick={() => navigate('/signup')} // Navigate to the SignUp page
            className="font-medium text-custom-green hover:text-custom-gray cursor-pointer"
          >
  
          Sign Up
        
        </span>
      </p>
    </div>
    <div className='w-1/2 h-[355px] flex items-center justify-center max-w-md bg-custom-gradient rounded-r-lg  opacity-75 shadow-lg  '>
    
    <img src={myGif} alt="My Animation" className='h-[400px] w-full rounded-r-lg' />

    </div>
  </div>
  );
}

export default SignIn;