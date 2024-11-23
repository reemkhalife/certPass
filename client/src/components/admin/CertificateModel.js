// // AdminDashboard.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CertificateModel = () => {
//   const [fields, setFields] = useState([]);
//   const [newField, setNewField] = useState({ fieldName: '', fieldType: 'text', isMandatory: false });

//   // useEffect(() => {
//   //   const fetchFields = async () => {
//   //     const response = await axios.get('/api/customFields');
//   //     setFields(response.data);
//   //   };
//   //   fetchFields();
//   // }, []);

//   // const handleAddField = async () => {
//   //   try {
//   //     const response = await axios.post('/api/customFields', newField);
//   //     setFields([...fields, response.data]);
//   //     setNewField({ fieldName: '', fieldType: 'text', isMandatory: false });
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   // const handleDeleteField = async (id) => {
//   //   try {
//   //     await axios.delete(`/api/customFields/${id}`);
//   //     setFields(fields.filter((field) => field._id !== id));
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   return (
//     <div>
//       <h1>Customize Certificate Request Fields</h1>
//       <div>
//         <input
//           type="text"
//           placeholder="Field Name"
//           value={newField.fieldName}
//           onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
//         />
//         <select
//           value={newField.fieldType}
//           onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
//         >
//           <option value="text">Text</option>
//           <option value="number">Number</option>
//           <option value="date">Date</option>
//           <option value="file">File</option>
//         </select>
//         <label>
//           <input
//             type="checkbox"
//             checked={newField.isMandatory}
//             onChange={(e) => setNewField({ ...newField, isMandatory: e.target.checked })}
//           />
//           Mandatory
//         </label>
//         <button 
//         // onClick={handleAddField}
//         >Add Field</button>
//       </div>
//       <ul>
//         {fields.map((field) => (
//           <li key={field._id}>
//             {field.fieldName} ({field.fieldType}) - {field.isMandatory ? 'Mandatory' : 'Optional'}
//             <button 
//             // onClick={() => handleDeleteField(field._id)}
//             >Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CertificateModel;

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import "./CertificateModel.css";
import axios from 'axios';
import styles from '../../pages/admin/Dashboard.module.css';

const CertificateRequestForm = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "", // To be fetched from logged-in user
    requestId: "", // Generated after saving in DB
    name: "",
    description: "",
    issueDate: new Date().toISOString().split("T")[0], // Current date
    expiryDate: "",
    issuingOrganization: "",
    customOrganizationName: "",
    fileUrl: "",
  });
  const [useCustomOrg, setUseCustomOrg] = useState(false);

  // Fetch logged-in student ID and organizations
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // const studentResponse = await axios.get("/api/students/me");
        const organizationsResponse = await axios.get("http://localhost:7000/api/organizations");
        setFormData((prev) => ({
          ...prev,
          // studentId: studentResponse.data._id,
        }));
        setOrganizations(organizationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrganizationChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setUseCustomOrg(true);
      setFormData((prev) => ({
        ...prev,
        issuingOrganization: "",
        customOrganizationName: "",
      }));
    } else {
      setUseCustomOrg(false);
      setFormData((prev) => ({
        ...prev,
        issuingOrganization: value,
        customOrganizationName: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/requests", {
        ...formData,
        requestType: "certificate",
        status: "pending",
      });
      alert("Certificate request submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.showSidebar : ''}`}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
        <form onSubmit={handleSubmit} className="certificate-form">
          <h2>Certificate Request Form</h2>

          <label>Student ID:</label>
          <input type="text" 
          // value={formData.studentId} 
          disabled />

          <label>Certificate Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <label>Issue Date:</label>
          <input type="date" value={formData.issueDate} disabled />

          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
          />

          <label>Issuing Organization:</label>
          <select onChange={handleOrganizationChange} required>
            <option value="">-- Select an organization --</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
            <option value="custom">Custom Organization</option>
          </select>

          {useCustomOrg && (
            <div>
              <label>Custom Organization Name:</label>
              <input
                type="text"
                name="customOrganizationName"
                value={formData.customOrganizationName}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <label>Certificate File:</label>
          <input
            type="file"
            name="fileUrl"
            onChange={(e) => handleInputChange({ target: { name: "fileUrl", value: e.target.files[0] } })}
            required
          />

          <button type="submit">Submit</button>
        </form>
      
      </div>
    </div>
  );
};

export default CertificateRequestForm;
