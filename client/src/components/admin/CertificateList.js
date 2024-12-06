import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import CertificateDetails from './CertificateDetails';
import styles from '../../pages/admin/Dashboard.module.css';
import Header from './Header';

const CertificateList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
    <div className={styles.dashboard}>
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.showSidebar : ''}`}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
          <i className={`fa ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <Header/>
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
    </div>
  );
};

export default CertificateList;