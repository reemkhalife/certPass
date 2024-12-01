// src/components/ExpandableSections.jsx
import React, { useState } from 'react';
import defaultpp from "../assets/images/defaultpp.png"

const ExpandableSections = () => {
  const [expandedSections, setExpandedSections] = useState({
    occupation: false,
    profile: false,
    skills: false,
    preferences: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [jobType, setJobType] = useState('');

  const handleChange = (event) => {
    setJobType(event.target.value);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Section 1 */}
      <div className="border rounded-lg shadow">
        <div
          className="flex justify-between items-center p-1 bg-custom-gray rounded-full text-white cursor-pointer"
          onClick={() => toggleSection('occupation')}
        >
          <h2>Update Your Occupation</h2>
          <span>{expandedSections.occupation ? '▲' : '▼'}</span>

        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.occupation ? 'max-h-screen p-4 bg-custom-gray rounded-lg' : 'max-h-0'
          }`}
        >
       
          <div  >
              <label htmlFor="Occupation" >Update your occupation</label>
              <input
                id="Occupation"
                name="Occupation"
                type="text"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="e.g ,Student,Software Engineer,Graphic Designer..."
              />
            </div>
            <div  >
              <label htmlFor="Company" >Company Name</label>
              <input
                id="Company"
                name="Company"
                type="text"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="Company"
              />
            </div>
            <div className="flex justify-center mt-4 w-full">
    <button className="bg-custom-green text-white w-full text-sm px-6 py-2 rounded-lg shadow hover:bg-custom-green-dark">
      Save
    </button>
  </div>
        </div>
       
      </div>

      {/* Section 2 */}
      <div className="border rounded-lg bg-custom-gray shadow">
        <div
          className="flex justify-between items-center  p-1 rounded-full bg-custom-gray text-white cursor-pointer"
          onClick={() => toggleSection('profile')}
        >
          <h2>Update Your Profile</h2>
          <span>{expandedSections.profile ? '▲' : '▼'}</span>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.profile ? 'max-h-screen p-4 bg-custom-gray rounded-lg' : 'max-h-0'
          }`}
        >
         
          <div className="rounded-md shadow-sm -space-y-px ">
          <div className="mb-4 ">
        <label htmlFor="profileImage" className="block text-sm font-medium text-gray-300 mb-1">
          Profile Image
        </label>
        <div className="flex items-center">
          <img
            src={defaultpp} // Replace with the current profile image if available
            alt="Profile Preview"
            className="h-20 w-20 rounded-full border border-gray-300 mr-4"
          />
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            className="text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-custom-green file:text-white
            hover:file:bg-custom-green-dark"
          />
        </div>
        </div>
          <div className='mb-2'>
              <label htmlFor="StudentId" >Student Id</label>
              <input
                id="StudentId"
                name="StudentId"
                type="number"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm"
                placeholder="Student Id"
              />
            </div>
            <div  >
              <label htmlFor="name" >Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="Full Name"
              />
            </div>
            <div  >
              <label htmlFor="email" >Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" >Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="Password"
              />
            </div>
            <div className="flex justify-center mt-4 w-full">
    <button className="bg-custom-green text-white w-full text-sm px-6 py-2 rounded-lg shadow hover:bg-custom-green-dark">
      Save
    </button>
  </div>
          </div>
          
        </div>
      </div>

      {/* Section 3 */}
      <div className="border rounded-lg shadow">
        <div
          className="flex justify-between items-center p-1 rounded-full bg-custom-gray text-white cursor-pointer"
          onClick={() => toggleSection('skills')}
        >
          <h2>Indicate Your Skills & Interests</h2>
          <span>{expandedSections.skills ? '▲' : '▼'}</span>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.skills ? 'max-h-screen p-4 bg-custom-gray rounded-lg' : 'max-h-0'
          }`}
        >
    
          <div  >
              <label htmlFor="Skills">Skills</label>
              <input
                id="Skills"
                name="Skills"
                type="text"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="Skills"
              />
            </div>
            <div  >
              <label htmlFor="Interests" >Interests</label>
              <input
                id="Interests"
                name="Interests"
                type="Interests"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="Interests"
              />
            </div>
            <div className="flex justify-center mt-4 w-full">
    <button className="bg-custom-green text-white w-full text-sm px-6 py-2 rounded-lg shadow hover:bg-custom-green-dark">
      Save
    </button>
  </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="border rounded-lg shadow">
        <div
          className="flex justify-between items-center rounded-full p-1 bg-custom-gray text-white cursor-pointer"
          onClick={() => toggleSection('preferences')}
        >
          <h2>Add Your Job Preferences</h2>
          <span>{expandedSections.preferences ? '▲' : '▼'}</span>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.preferences ? 'max-h-screen p-4 bg-custom-gray rounded-lg' : 'max-h-0'
          }`}
        >
     
          <div  >
              <label htmlFor="job" >Job Title</label>
              <input
                id="job"
                name="job"
                type="text"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="Job Title"
              />
            </div>
            <div  >
              <label htmlFor="location" >location Preference</label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="relative block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2"
                placeholder="Location Preference"
              />
            </div>    
            <div >
      <label htmlFor="job-type">Job Type:</label>
      <select id="job-type" value={jobType} onChange={handleChange} className='relative text-white block w-full px-3 py-2 bg-custom-gray border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom-green focus:border-custom-green sm:text-sm mb-2'>
        <option value="">Select Job Type</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="internship">Internship</option>
        <option value="freelance">Freelance</option>
        <option value="contract">Contract</option>
        <option value="temporary">Temporary</option>
        <option value="remote">Remote</option>
      </select>
    </div>    
    <div className="flex justify-center mt-4 w-full">
    <button className="bg-custom-green text-white w-full text-sm px-6 py-2 rounded-lg shadow hover:bg-custom-green-dark">
      Save
    </button>
  </div>    
        </div>
  
      </div>
    </div>
  );
};

export default ExpandableSections;
