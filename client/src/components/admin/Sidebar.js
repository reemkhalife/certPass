import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';  // CSS modules for styling
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = () => {

  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>CertPass</div>
      <nav>
        <ul>
          <li className={location.pathname === '/admin/dashboard' ? styles.active : ''}>
            <Link to="/admin/dashboard">
            <i className="fa fa-home"></i>Home
            </Link>
          </li>
          <li className={location.pathname === '/admin/dashboard/certificate-model' ? styles.active : ''}>
            <Link to="/admin/dashboard/certificate-model">
            <i className="fa fa-certificate"></i>Certificate Model
            </Link>
          </li>
          <li className={location.pathname === '/admin/dashboard/certificate-requests' ? styles.active : ''}>
            <Link to="/admin/dashboard/certificate-requests">
            <i className="fa fa-certificate"></i>Certificate Requests
            </Link>
          </li>
          <li className={location.pathname === '/admin/dashboard/document-requests' ? styles.active : ''}>
            <Link to="/admin/dashboard/document-requests">
            <i className="fa fa-certificate"></i>Document Requests
            </Link>
          </li>
          <li className={location.pathname === '/admin/dashboard/students-registered' ? styles.active : ''}>
            <Link to="/admin/dashboard/students-registered">
            Students Registered
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
