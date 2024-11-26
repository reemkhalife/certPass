import React, { useState, useEffect } from "react";

const CustomFieldRequest = () => {
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

export default CustomFieldRequest;
