import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../../api/apiService';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics().then(data => setAnalytics(data));
  }, []);

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p>Total Students: {analytics.totalStudents}</p>
      {/* <p>Total Requests: {analytics.totalRequests}</p> */}
    </div>
  );
};

export default AnalyticsPage;
