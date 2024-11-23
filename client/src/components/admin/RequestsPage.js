import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
// import { fetchRequests } from '../../api/apiService';
import axios from 'axios';
import styles from '../../pages/admin/Dashboard.module.css';
import styles1 from './RequestsPage.module.css';

const RequestsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/requests', {
          method: 'GET',
          credentials: 'include', // if using cookies for auth
        });
        const data = await response.json();
         // Ensure `data` is an array before setting state
         if (Array.isArray(data)) {
          setRequests(data);
          // setLoading(false);
        } else {
          console.error("Expected data to be an array, received:", data);
          setRequests([]);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequests([]); // Set as an empty array if an error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleVerify = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/api/requests/${id}/verify`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const updatedRequest = await response.json();
      setRequests(requests.map((req) => (req._id === id ? updatedRequest : req)));
    } catch (error) {
      console.error('Error verifying request:', error);
    }
  };

  const handleReject = async (id) => {
    const rejectionReason = prompt('Enter rejection reason:');
    if (!rejectionReason) return;

    try {
      const response = await fetch(`http://localhost:7000/api/requests/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rejectionReason }),
      });
      const updatedRequest = await response.json();
      setRequests(requests.map((req) => (req._id === id ? updatedRequest : req)));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
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
        <div>
          <h2>Certificate and Transcript Requests</h2>
          <div className={styles1.requestsContent}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Request Type</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(requests) && requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.studentId.userId.name}</td>
                      <td>{request.requestType}</td>
                      <td>{request.status}</td>
                      <td>{new Date(request.submittedAt).toLocaleDateString()}</td>
                      <td>
                        {request.status === 'pending' && (
                          <>
                            <button onClick={() => handleVerify(request._id)}>Verify</button>
                            <button onClick={() => handleReject(request._id)}>Reject</button>
                          </>
                        )}
                        {request.status === 'rejected' && <p>Rejected: {request.rejectionReason}</p>}
                        {request.status === 'verified' && <p>Verified</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
