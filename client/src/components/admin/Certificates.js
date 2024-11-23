// CertificateList.js (React component)
import React, { useEffect, useState } from 'react';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/certificates');
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div>
      <h2>All Certificates</h2>
      <ul>
        {certificates.map(cert => (
          <li key={cert._id}>
            <h3>{cert.name}</h3>
            <p>Issued to: {cert.studentId.name} ({cert.studentId.email})</p>
            {/* <p>Organization: {cert.issuingOrganization.name}</p> */}
            <p>Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
            <img src={cert.qrCode} alt="QR Code" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Certificates;
