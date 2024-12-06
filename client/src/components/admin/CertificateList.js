import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CertificateDetails from './CertificateDetails';

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      const response = await axios.get('http://localhost:7000/api/certificates');
      setCertificates(response.data);
    };

    fetchCertificates();
  }, []);

  return (
    <div>
      <h2>Certificates</h2>
      <ul>
        {certificates.map((certificate) => (
          <li key={certificate._id}>
            <button onClick={() => setSelectedCertificate(certificate)}>
              {certificate.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedCertificate && <CertificateDetails certificate={selectedCertificate} />}
    </div>
  );
};

export default CertificateList;
