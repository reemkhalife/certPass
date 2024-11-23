import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar'
import Header from '../../components/admin/Header';
import AnalyticsPage from '../../components/admin/AnalyticsPage';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.dashboard}>
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.showSidebar : ''}`}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          <i className={`fa ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <Header />
        <AnalyticsPage />
      </div>
    </div>
  );
}
