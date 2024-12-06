import React from 'react';

const CertificateDetails = ({ certificate }) => {
  console.log(certificate);
  const handleDownload = () => {
    window.location.href = `http://localhost:7000/api/certificates/${certificate._id}/download`;
  };

  return (
    <div>
      <h3>Certificate Details</h3>
      <p><strong>Name:</strong> {certificate.name}</p>
      <p><strong>Description:</strong> {certificate.description}</p>
      <p><strong>Issuing Organization:</strong> {certificate.issuingOrganization?.name || 'N/A'}</p>
      <p><strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
      <button onClick={handleDownload}>Download Certificate</button>
    </div>
  );
};

export default CertificateDetails;
