// components/CertificateDisplay.js
import React, { useEffect, useState } from 'react';
import { getCertificate } from '../services/api';

const CertificateDisplay = ({ certificateId }) => {
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const data = await getCertificate(certificateId);
        setCertificate(data);
      } catch (error) {
        setError("Unable to fetch certificate.");
      }
    };
    fetchCertificate();
  }, [certificateId]);

  if (error) return <p>{error}</p>;
  if (!certificate) return <p>Loading certificate...</p>;

  return (
    <div>
      <h2>Certificate for {certificate.studentId.name}</h2>
      <p><strong>Description:</strong> {certificate.description}</p>
      <p><strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
      {certificate.qrCode && (
        <>
          <h3>QR Code:</h3>
          <img src={certificate.qrCode} alt="Certificate QR Code" />
        </>
      )}
    </div>
  );
};

export default CertificateDisplay;
