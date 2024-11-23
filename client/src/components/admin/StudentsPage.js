import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { fetchStudents } from '../../api/apiService';
import styles from '../../pages/admin/Dashboard.module.css';

const StudentsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents().then(data => setStudents(data));
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
        <h2>Students Registered</h2>
        <ul>
          {students.map((student, index) => (
            <li key={index}>{student.name} - {student.college}</li>
          ))}
        </ul>
      </div>
    </div>
    // <div>
    //   <h2>Students Registered</h2>
    //   <ul>
    //     {students.map((student, index) => (
    //       <li key={index}>{student.name} - {student.college}</li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default StudentsPage;
