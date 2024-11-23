import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPendingCertificates: 0,
    totalVerifiedCertificates: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/admin/dashboard', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      const data = await response.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <p>Total Students: {stats.totalStudents}</p>
        <p>Pending Certificates: {stats.totalPendingCertificates}</p>
        <p>Verified Certificates: {stats.totalVerifiedCertificates}</p>
      </div>
    </div>
  );
};

export default Dashboard;