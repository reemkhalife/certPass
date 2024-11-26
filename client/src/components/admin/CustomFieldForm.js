import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import "./CertificateModel.css";
import axios from 'axios';
import styles from '../../pages/admin/Dashboard.module.css';

const CustomFieldForm = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarOpen = false;
  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  // Cerificate Request Inputs
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

  // Fetch organizations
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const organizationsResponse = await axios.get("http://localhost:7000/api/organizations");
        setFormData((prev) => ({
          ...prev,
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

  // Custom Fields
  const [customFields, setCustomFields] = useState([]);
  const [unsavedFields, setUnsavedFields] = useState([]); // Tracks fields before saving
  const [fieldsToRemove, setFieldsToRemove] = useState([]); // Fields marked for removal
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
      // setCustomFields(data);
      setCustomFields(data.map(field => ({ ...field, isModified: false, isNew: false })));
      // setUnsavedFields(data); // Keep a copy of the current state
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  };

  // Add a new custom field but not save it yet
  const handleAddField = () => {
    if (!newField.label) {
      alert("Field label is required!");
      return;
    }

    // setUnsavedFields([...unsavedFields, newField]);
    setUnsavedFields([...unsavedFields, { ...newField, isNew: true }]);
    setNewField({ label: "", fieldType: "text", isRequired: false, options: [] });
  };

  // Undo adding a field before saving
  const undoAddField = (index) => {
    setUnsavedFields(unsavedFields.filter((_, i) => i !== index));
  };

  // Modify "Required" field before saving
  const handleModifyField = (index, updatedField) => {
    const updatedFields = [...unsavedFields];
    updatedFields[index] = updatedField;
    setUnsavedFields(updatedFields);
  };

  // Change "Required" field for existing custom field
  const toggleRequiredField = (fieldId) => {
    setCustomFields((prevCustomFields) =>
      prevCustomFields.map((field) =>
        field._id === fieldId
          // ? { ...field, isRequired: !field.isRequired }
          ? { ...field, isRequired: !field.isRequired, isModified: true }
          : field
      )
    );
  
    setUnsavedFields((prevUnsavedFields) => {
      const fieldIndex = prevUnsavedFields.findIndex((field) => field._id === fieldId);
      // const updatedField = {
      //   ...customFields.find((field) => field._id === fieldId),
      //   isRequired: !customFields.find((field) => field._id === fieldId)?.isRequired,
      // };
      const updatedField = {
        ...customFields.find((field) => field._id === fieldId),
        isRequired: !customFields.find((field) => field._id === fieldId)?.isRequired,
        isModified: true,
      };
      if (fieldIndex !== -1) {
        // Update existing field in unsavedFields
        const updatedFields = [...prevUnsavedFields];
        updatedFields[fieldIndex] = updatedField;
        return updatedFields;
      } else {
        // Add new field to unsavedFields
        return [...prevUnsavedFields, updatedField];
      }
    });
  };

  // Remove already existing custom fields
  const markFieldForRemoval = (fieldId) => {
    setFieldsToRemove([...fieldsToRemove, fieldId]);
    setCustomFields(customFields.filter((field) => field._id !== fieldId));
  };

  // Save Changes
  const handleSave = async () => {
    console.log(unsavedFields);

    // if (unsavedFields.length === 0) {
    //   alert("No changes to save.");
    //   return;
    // }

    try {
      // Save new fields
      const newFieldsResponse = await axios.post(
        "http://localhost:7000/api/custom-fields", { 
          customFields: unsavedFields,
          fieldsToRemove,
         });

      // Check if the response data is an array
      const newFields = Array.isArray(newFieldsResponse.data) ? newFieldsResponse.data : [];

      // Remove marked fields
      // for (const fieldId of fieldsToRemove) {
      //   await axios.delete(`http://localhost:7000/api/custom-fields/${fieldId}`);
      // }

      alert("Changes saved successfully!");

      // Update customFields with new fields
      // setCustomFields((prevFields) => [...prevFields, ...newFields]);
      setCustomFields((prevFields) => [
        ...prevFields,
        ...newFields.map(field => ({ ...field, isModified: false, isNew: false })),
      ]);

      // Re-fetch updated fields
      await fetchCustomFields();

      setFieldsToRemove([]);
      setUnsavedFields([]);
      // setCustomFields([...customFields, ...newFields]);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.showSidebar : ''}`}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
        <h1>Certificate Request Form Manager</h1>
        <div className={styles.addFieldSection}>
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
        <form className="certificate-form">
          <h2>Certificate Request Form</h2>

          <label>Student ID:</label>
          <input type="text" 
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

          <h3>Custom Fields</h3>
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
            {customFields.map((field, index) => (
            <li key={field._id}>
                <strong>{field.label}</strong> ({field.fieldType}){" "}
                {/* {field.fieldType === "dropdown" && (
                <span>Options: {field.options.join(", ")}</span>
                )} */}
                {field.isRequired && <span> (Required)</span>}
                <button onClick={() => toggleRequiredField(field._id)}>
                  Toggle Required
                </button>
                <button onClick={() => markFieldForRemoval(field._id)}>Remove</button>
                {/* Render input based on fieldType */}
                {field.fieldType === "text" && <input type="text" placeholder={`Enter ${field.label}`} />}
                {field.fieldType === "number" && <input type="number" placeholder={`Enter ${field.label}`} />}
                {field.fieldType === "dropdown" && (
                  <select>
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.fieldType === "checkbox" && <input type="checkbox" />}
                {field.fieldType === "textarea" && <textarea placeholder={`Enter ${field.label}`} />}
    
            </li>
            ))}
          </ul>

          <h3>New Fields</h3>
            <ul>
            {unsavedFields.filter(field => field.isNew && !field.isModified) // Filter based on isNew and isModified
            .map((field, index) => (
                <li key={index}>
                    <strong>{field.label}</strong> ({field.fieldType})
                    {field.isRequired && <span> (Required)</span>}
                    {/* {field.fieldType === "dropdown" && <p>Options: {field.options.join(", ")}</p>} */}
                    <button onClick={() => undoAddField(index)}>Undo</button>
                    {/* <button
                    onClick={() => handleModifyField(index, { ...field, isRequired: !field.isRequired })}
                    > */}
                    <button onClick={() => handleModifyField(index, { ...field, isRequired: !field.isRequired })}>
                    Toggle Required
                    </button>
                </li>
                ))}
            </ul>

            <button onClick={handleSave}>Save Certificate</button>
        </form>
      
      </div>
    </div>
  );
};

export default CustomFieldForm;