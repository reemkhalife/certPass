import React, { useState, useEffect } from "react";
import axios from 'axios';

function VerifyAndMint() {
  //   return (
  //       <div className="bg-gray-800 h-screen w-screen text-white ">
  //       <div className="ml-14 p-2">
        
  //       <h1>Verify and mint Page</h1>
  //       <p>This is the VerifyAndMint (Create New) page content.</p>
  //       </div>
        
  //     </div>
  //   );
  // }
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
          studentId: localStorage.getItem("studentId"),
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      fileUrl: file,
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
      // Process custom fields
      const processedCustomFields = customFields.map((field) => ({
        field: field._id,
        label: field.label,
        value: formData[field.label],
      }));

      // Prepare certificate data
      const certificateData = {
        name: formData.name,
        description: formData.description,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || null,
        issuingOrganization: useCustomOrg ? null : formData.issuingOrganization,
        customOrganizationName: useCustomOrg ? formData.customOrganizationName : null,

      };

      // Combine all data into one object
      const requestData = {
        studentId: formData.studentId,
        requestType: "certificate",
        certificateData,
        customFields: processedCustomFields,
        status: "pending",
      };
      // console.log(formData.studentId);

      // Add File to the request
      // Create a FormData instance to send the request data along with the file
      const formDataToSend = new FormData();

      // Append the data object as a stringified JSON
      formDataToSend.append("data", JSON.stringify(requestData));

      // Append the file (if any)
      if (formData.fileUrl) {
        formDataToSend.append("file", formData.fileUrl); // Assuming 'fileUrl' is a file input element
      }

      // Make the POST request with FormData
      const response = await axios.post("http://localhost:7000/api/requests", formDataToSend, {
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Certificate request submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // CUSTOM FIELDS
  const [customFields, setCustomFields] = useState([]);

  // Fetch custom fields
  const fetchCustomFields = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/custom-fields");
      const data = await response.json();
      setCustomFields(data);

      const initialCustomFields = {};
      data.forEach((field) => {
        initialCustomFields[field.label] = "";
      });
      setFormData((prev) => ({
        ...prev,
        ...initialCustomFields,
      }));
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  };

  const handleCustomFieldChange = (label, value) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };  

  useEffect(() => {
    fetchCustomFields();
  }, []);

  return (
    <div>
      <h1>Mint a Certificate</h1>
      {/* <form onSubmit={handleSubmit}> */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* <h2>Certificate Request Form</h2> */}

        <label>Student ID:</label>
        <input type="text" 
          value={formData.studentId || ""} 
          disabled 
        />

        <label>Certificate Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
        />

        <label>Issue Date:</label>
        <input type="date" value={formData.issueDate} disabled />

        <label>Expiry Date:</label>
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate || ""}
          onChange={handleInputChange}
        />

        <label>Issuing Organization:</label>
        <select 
          value={formData.issuingOrganization || ""}
          onChange={handleOrganizationChange} 
          required
        >
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
              value={formData.customOrganizationName || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* <label>Certificate File:</label>
        <input
          type="file"
          name="fileUrl"
          // onChange={(e) => handleInputChange({ target: { name: "fileUrl", value: e.target.files[0] } })}
          onChange={handleFileChange}
          // required
        /> */}
            
        {customFields.map((field) => (
          <div key={field._id}>
            <label>
              {field.label} {field.isRequired && "*"}:
              {field.fieldType === "text" && (
                <input
                  type="text"
                  value={formData[field.label] || ""}
                  onChange={(e) => handleCustomFieldChange(field.label, e.target.value)}
                  required={field.isRequired}
                />
              )}
              {field.fieldType === "number" && (
                <input
                  type="number"
                  value={formData[field.label] || ""}
                  onChange={(e) => handleCustomFieldChange(field.label, e.target.value)}
                  required={field.isRequired}
                />
              )}
              {field.fieldType === "date" && (
                <input
                  type="date"
                  value={formData[field.label] || ""}
                  onChange={(e) => handleCustomFieldChange(field.label, e.target.value)}
                  required={field.isRequired}
                />
              )}
              {field.fieldType === "dropdown" && (
                <select
                  value={formData[field.label] || ""}
                  onChange={(e) => handleCustomFieldChange(field.label, e.target.value)}
                  required={field.isRequired}
                >
                  <option value="">Select an option</option>
                  {field.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
  
export default VerifyAndMint;