// import React, { useEffect, useState } from 'react';
// import Sidebar from './Sidebar';
// import "./CertificateModel.css";
// import axios from 'axios';
// import styles from '../../pages/admin/Dashboard.module.css';

// const CustomFieldForm = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const [fields, setFields] = useState([]);
//   const [unsavedFields, setUnsavedFields] = useState([]); // Tracks fields before saving
//   const [newField, setNewField] = useState({
//     label: "",
//     fieldType: "text",
//     isRequired: false,
//     options: [],
//   });

//   // Load initial fields from the backend
//   useEffect(() => {
//     async function fetchFields() {
//       try {
//         const response = await fetch("http://localhost:7000/api/custom-fields/fields");
//         const data = await response.json();
//         setFields(data.customFields);
//         setUnsavedFields(data.customFields); // Keep a copy of the current state
//       } catch (error) {
//         console.error("Error fetching fields:", error);
//       }
//     }
//     fetchFields();
//   }, []);

//   const handleAddField = () => {
//     if (!newField.label) {
//       alert("Field label is required!");
//       return;
//     }

//     setUnsavedFields([...unsavedFields, newField]);
//     setNewField({ label: "", fieldType: "text", isRequired: false, options: [] });
//   };

//   const handleRemoveField = (index) => {
//     setUnsavedFields(unsavedFields.filter((_, i) => i !== index));
//   };

//   const handleModifyField = (index, updatedField) => {
//     const updatedFields = [...unsavedFields];
//     updatedFields[index] = updatedField;
//     setUnsavedFields(updatedFields);
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch("http://localhost:7000/api/custom-fields", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ customFields: fields }),
//       });

//       if (response.ok) {
//         alert("Certificate model saved successfully!");
//         setFields(unsavedFields); // Synchronize the frontend state with the backend
//       } else {
//         alert("Failed to save certificate model.");
//       }
//     } catch (error) {
//       console.error("Error saving certificate model:", error);
//     }
//   };

//   return (
//     <div className={styles.dashboard}>
//       <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.showSidebar : ''}`}>
//         <Sidebar />
//       </div>
//       <div className={styles.mainContent}>
//       {/* <div> */}
//       <h1>Create Certificate Form</h1>

//       <div>
//         <h3>Add Custom Field</h3>
//         <input
//           type="text"
//           placeholder="Field Label"
//           value={newField.label}
//           onChange={(e) => setNewField({ ...newField, label: e.target.value })}
//         />
//         <select
//           value={newField.fieldType}
//           onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
//         >
//           <option value="text">Text</option>
//           <option value="number">Number</option>
//           <option value="date">Date</option>
//           <option value="dropdown">Dropdown</option>
//         </select>
//         {newField.fieldType === "dropdown" && (
//           <textarea
//             placeholder="Options (comma-separated)"
//             value={newField.options.join(",")}
//             onChange={(e) =>
//               setNewField({ ...newField, options: e.target.value.split(",") })
//             }
//           />
//         )}
//         <label>
//           <input
//             type="checkbox"
//             checked={newField.isRequired}
//             onChange={(e) =>
//               setNewField({ ...newField, isRequired: e.target.checked })
//             }
//           />
//           Required
//         </label>
//         <button onClick={handleAddField}>Add Field</button>
//       </div>

//       <h3>Custom Fields</h3>
//       <ul>
//       {unsavedFields.map((field, index) => (
//           <li key={index}>
//             <strong>{field.label}</strong> ({field.fieldType})
//             {field.isRequired && <span> (Required)</span>}
//             {field.fieldType === "dropdown" && <p>Options: {field.options.join(", ")}</p>}
//             <button onClick={() => handleRemoveField(index)}>Remove</button>
//             <button
//               onClick={() => handleModifyField(index, { ...field, isRequired: !field.isRequired })}
//             >
//               Toggle Required
//             </button>
//           </li>
//         ))}
//       </ul>

//       <button onClick={handleSave}>Save Certificate</button>
      
//       <h3>Current Fields (Saved)</h3>
//       <ul>
//         {fields.map((field, index) => (
//           <li key={index}>
//             <strong>{field.label}</strong> ({field.fieldType})
//             {field.isRequired && <span> (Required)</span>}
//           </li>
//         ))}
//       </ul>
//       </div>
//     </div>
//   );
// };

// export default CustomFieldForm;

import React, { useState, useEffect } from "react";

const CustomFieldForm = () => {
  const [customFields, setCustomFields] = useState([]);
  const [newField, setNewField] = useState({
    label: "",
    fieldType: "text",
    options: [],
    isRequired: false,
  });

  // Fetch custom fields from the server
  const fetchCustomFields = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/custom-fields");
      const data = await response.json();
      setCustomFields(data);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  };

  // Add a new custom field
  const handleAddField = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/custom-fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newField),
      });

      if (response.ok) {
        const createdField = await response.json();
        setCustomFields((prev) => [...prev, createdField]);
        setNewField({ label: "", fieldType: "text", options: [], isRequired: false });
        alert("Field added successfully!");
      } else {
        alert("Failed to add field.");
      }
    } catch (error) {
      console.error("Error adding field:", error);
    }
  };

  // Remove a custom field
  const handleRemoveField = async (fieldId) => {
    try {
      const response = await fetch(`http://localhost:7000/api/custom-fields/${fieldId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCustomFields((prev) => prev.filter((field) => field._id !== fieldId));
        alert("Field removed successfully!");
      } else {
        alert("Failed to remove field.");
      }
    } catch (error) {
      console.error("Error removing field:", error);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  return (
    <div>
      <h1>Custom Field Manager</h1>

      {/* List existing fields */}
      <h3>Existing Fields</h3>
      <ul>
        {customFields.map((field) => (
          <li key={field._id}>
            <strong>{field.label}</strong> ({field.fieldType}){" "}
            {field.fieldType === "dropdown" && (
              <span>Options: {field.options.join(", ")}</span>
            )}
            {field.isRequired && <span> (Required)</span>}
            <button onClick={() => handleRemoveField(field._id)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Add new field form */}
      <h3>Add New Field</h3>
      <div>
        <label>
          Label:
          <input
            type="text"
            value={newField.label}
            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
          />
        </label>
        <label>
          Field Type:
          <select
            value={newField.fieldType}
            onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="dropdown">Dropdown</option>
          </select>
        </label>
        {newField.fieldType === "dropdown" && (
          <label>
            Options (comma-separated):
            <input
              type="text"
              value={newField.options.join(", ")}
              onChange={(e) =>
                setNewField({ ...newField, options: e.target.value.split(",").map((o) => o.trim()) })
              }
            />
          </label>
        )}
        <label>
          Required:
          <input
            type="checkbox"
            checked={newField.isRequired}
            onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })}
          />
        </label>
        <button onClick={handleAddField}>Add Field</button>
      </div>
    </div>
  );
};

export default CustomFieldForm;
