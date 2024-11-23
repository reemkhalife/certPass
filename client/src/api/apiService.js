// client/src/services/apiService.js

const API_URL = 'http://localhost:7000/api';  // Backend URL

export const fetchRequests = async () => {
  const response = await fetch(`${API_URL}/requests`);
  const data = await response.json();
  return data;
};

export const fetchStudents = async () => {
  const response = await fetch(`${API_URL}/students`);
  const data = await response.json();
  return data;
};

export const fetchAnalytics = async () => {
  const response = await fetch(`${API_URL}/analytics`);
  const data = await response.json();
  return data;
};

// services/api.js
export const getCertificate = async (certificateId) => {
  try {
    const response = await fetch(`https://yourdomain.com/api/certificates/${certificateId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    throw error;
  }
};
