import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
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
  const [selectedRequest, setSelectedRequest] = useState(null); // To track selected request for details view
  const [filter, setFilter] = useState({
    requestType: 'certificate', // Default filter values
    status: 'pending',
  });

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:7000/api/requests', {
          params: { ...filter }, // Send filter values as query params
          withCredentials: true,
        });
        setRequests(response.data || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequests([]); // Set as an empty array if an error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filter]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

   // Add this useEffect to observe changes in selectedRequest
   useEffect(() => {
    console.log('Updated selectedRequest:', selectedRequest);
  }, [selectedRequest]);

  const handleVerify = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/api/requests/${id}/verify`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const updatedRequest = await response.json();
      setRequests(requests.filter((req) => req._id !== id));
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest({
          ...updatedRequest.certificate,
          studentId:{studentID: selectedRequest.studentId.studentID, userId: {name: selectedRequest.studentId.userId.name}},
          submittedAt: selectedRequest.submittedAt,
          status: 'verified',
          requestType: selectedRequest.requestType,
        });
      }
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
      setRequests(requests.filter((req) => req._id !== id));
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest({
          ...updatedRequest,
          studentId:{studentID: selectedRequest.studentId.studentID, userId: {name: selectedRequest.studentId.userId.name}},
          submittedAt: selectedRequest.submittedAt,
          status: 'rejected',
          rejectionReason: rejectionReason,
          requestType: selectedRequest.requestType,
        });
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request); // Set the selected request for details view
  };

  const closeDetails = () => {
    setSelectedRequest(null); // Close the details view
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
        <Header/>
        <div>
          <h2>Certificate and Transcript Requests</h2>
          <div className={styles1.filters}>
            <label>
              Request Type:
              <select name="requestType" value={filter.requestType} onChange={handleFilterChange}>
                <option value="certificate">Certificate</option>
                <option value="transcript">Transcript</option>
              </select>
            </label>
            <label>
              Status:
              <select name="status" value={filter.status} onChange={handleFilterChange}>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>
          <div className={styles1.requestsContent}>
            {loading ? (
              <p>Loading...</p>
            ) : selectedRequest ? (
              <div className={styles1.detailsView}>
                <h3>Request Details</h3>
                <p><strong>Student ID:</strong> {selectedRequest.studentId.studentID}</p>
                <p><strong>Student Name:</strong> {selectedRequest.studentId.userId.name}</p>
                <p><strong>Request Type:</strong> {selectedRequest.requestType}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Submitted At:</strong> {new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                {selectedRequest.status === 'rejected' && (
                  <p><strong>Rejection Reason:</strong> {selectedRequest.rejectionReason}</p>
                )}
                <div>
                  {selectedRequest.status === 'pending' && (
                    <>
                      <button onClick={() => handleVerify(selectedRequest._id)}>Verify</button>
                      <button onClick={() => handleReject(selectedRequest._id)}>Reject</button>
                    </>
                  )}
                </div>
                <button onClick={closeDetails}>Close</button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Submitted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.studentId.studentID}</td>
                      <td>{request.studentId.userId.name}</td>
                      <td>{new Date(request.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleRequestClick(request)}>View</button>
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
