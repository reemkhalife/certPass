import React, { useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Home from "../components/home";
import CertPass from "../components/certpass";
import VerifyAndMint from "../components/VerifyAndMint";
import AcademicTranscript from "../components/AcademicTranscript";
import GetSupport from "../components/GetSupport";

function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Home"); // Default active menu

  return (
    <>
      <Navbar />
      <div className="flex">
        {/* Pass activeMenu and setActiveMenu to Sidebar */}
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        
        {/* Content Area */}
        <div className="flex-1 ">
          {activeMenu === "Home" && <Home />}
          {activeMenu === "CertPass" && <CertPass />}
          {activeMenu === "Mint a Certificate" && <VerifyAndMint />}
          {activeMenu === "Academic Transcript" && <AcademicTranscript />}
          {activeMenu === "Get Support" && <GetSupport />}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
