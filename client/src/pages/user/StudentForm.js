import React, { useState, useEffect } from "react";

const StudentForm = () => {
  const [customFields, setCustomFields] = useState([]);
  const [formData, setFormData] = useState({});

  // Fetch custom fields
  const fetchCustomFields = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/custom-fields");
      const data = await response.json();
      setCustomFields(data);

      // Initialize form data with empty values
      const initialData = {};
      data.forEach((field) => {
        initialData[field.label] = field.fieldType === "dropdown" ? "" : "";
      });
      setFormData(initialData);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  };

  const handleInputChange = (label, value) => {
    setFormData({ ...formData, [label]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Submit formData to your backend
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  return (
    <div>
      <h1>Request Form</h1>
      <form onSubmit={handleSubmit}>
        {customFields.map((field) => (
          <div key={field._id}>
            <label>
              {field.label} {field.isRequired && "*"}:
              {field.fieldType === "text" && (
                <input
                  type="text"
                  value={formData[field.label]}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  required={field.isRequired}
                />
              )}
              {field.fieldType === "number" && (
                <input
                  type="number"
                  value={formData[field.label]}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  required={field.isRequired}
                />
              )}
              {field.fieldType === "date" && (
                <input
                  type="date"
                  value={formData[field.label]}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  required={field.isRequired}
                />
              )}
              {field.fieldType === "dropdown" && (
                <select
                  value={formData[field.label]}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
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

export default StudentForm;
