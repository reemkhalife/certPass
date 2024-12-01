import React, { useState } from "react";
import { FaHome, FaCertificate, FaUniversity, FaHeadset, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { RiFilePaper2Line } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import logo from "../assets/images/zidyiaLogo.png";

function Sidebar({ activeMenu, setActiveMenu }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Menu items data
  const menuItems = [
    { name: "Home", icon: <FaHome className="text-lg" /> },
    { name: "CertPass", icon: <RiFilePaper2Line className="text-lg" /> },
    { name: "Verify & Mint", icon: <MdVerified className="text-lg" /> },
    { name: "Academic Transcript", icon: <FaUniversity className="text-lg" /> },
    { name: "Get Support", icon: <FaHeadset className="text-lg" /> },
  ];

  return (
    <div className="relative bg-gray-800 min-h-screen">
      {/* Sidebar */}
      <div
        className={`flex flex-col h-[85vh] bg-custom-gray text-white rounded-r-lg shadow-lg ${
          isOpen ? "w-64" : "w-16"
        } transition-width duration-300`}
      >
        {/* Header */}
        <div className="px-4 leading-tight mt-4">
          <div className="text-xl font-light font-serif italic">
            {isOpen ? "CertPass" : ""}
          </div>
          <div className="text-sm font-serif text-gray-600 mt-[-1px]">
            {isOpen ? "by Zidyia" : ""}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 mt-4 space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center px-4 py-2 cursor-pointer rounded-lg ${
                activeMenu === item.name
                  ? "bg-custom-gradient text-white" // Highlight active menu item
                  : "hover:bg-custom-green"
              }`}
              onClick={() => setActiveMenu(item.name)} // Update active menu
            >
              {item.icon}
              {isOpen && <span className="ml-4">{item.name}</span>}
            </div>
          ))}
        </div>

        {/* Footer (Logo at the Bottom) */}
        <div className="flex px-4 py-4 border-t border-gray-700">
          <div className="text-sm text-center">
            {isOpen ? (
              <img src={logo} alt="Logo" className="h-[50px]" />
            ) : (
              <img src={logo} alt="Logo" className="h-[50px] w-[30px]" />
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        className={`absolute top-2 bg-custom-gray ${isOpen ? "left-[16.5rem]" : "left-[4.5rem]"} p-3 rounded-full text-custom-green hover:bg-gray-500 focus:outline-none transition-all duration-300 text-xl`}
        onClick={toggleSidebar}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </div>
  );
}

export default Sidebar;
