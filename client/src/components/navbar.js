// src/components/Navbar.jsx
import React from 'react';
import { FaSearch, FaBell, FaEnvelope } from 'react-icons/fa';
import logo from "../assets/images/zidyiaLogo.png"
import defaultpp from "../assets/images/defaultpp.png"

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white shadow-lg">
      {/* Left Section: Logo & Welcome */}
      <div className="flex items-center space-x-4">
      <img
            src={logo}
            alt="logo"
            className="w-10 h-10 "
          />
        <span className="text-lg">Welcome User </span>
      </div>

      {/* Middle Section: Search */}
      <div className="relative w-1/4">
        <input
          type="text"
          className="w-full py-2 pl-10 pr-4 text-gray-900 bg-custom-gray border border-white shadow-2xl rounded-full opacity-50 focus:outline-none focus:ring-2 focus:ring-custom-green"
          placeholder="Search..."
        />
        <FaSearch className="absolute top-2.5 left-3 text-gray-500" />
      </div>

      {/* Right Section: Icons & Profile */}
      <div className="flex items-center space-x-6">
        {/* Message Icon */}
        <button className="relative p-2 bg-gray-700 rounded-full hover:bg-gray-600">
          <FaEnvelope className="text-lg" />
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">3</span>
        </button>

        {/* Notification Icon */}
        <button className="relative p-2 bg-gray-700 rounded-full hover:bg-gray-600">
          <FaBell className="text-lg" />
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">5</span>
        </button>

        {/* Profile Image */}
        <div className="relative">
          <img
            src={defaultpp}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-500"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

