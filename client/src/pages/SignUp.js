// src/components/SignUp.jsx
import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myGif from "../assets/images/Sign3.gif";


function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-gray">
      <div className='w-1/2 h-[355px] flex items-center justify-center max-w-md bg-custom-gradient rounded-l-lg  opacity-75 shadow-lg  '>
      
      <img src={myGif} alt="My Animation" className='h-[400px] w-full rounded-l-lg' />

      </div>
      <div className="w-1/2 h-[400px] max-w-md p-8 space-y-8 bg-white rounded-r-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-custom-green">Sign Up</h2>
        <form   className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px ">
          <div className='mb-2'>
              <label htmlFor="StudentId" className="sr-only">Student Id</label>
              <input
                id="StudentId"
                name="StudentId"
                type="number"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Student Id"
              />
            </div>
            <div  >
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                placeholder="Full Name"
              />
            </div>
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
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/signin')} // Navigate to the SignUp page
            className="font-medium text-custom-green hover:text-custom-gray cursor-pointer"
          >
            Sign In
         </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
