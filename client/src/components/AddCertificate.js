import React, { useState, useEffect } from 'react';

const AddCertificateModal = ({ onClose, onAddCertificate, editMode, currentCertificate }) => {
  const [name, setName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [image, setImage] = useState('');

  // Pre-fill the form with existing certificate data if in edit mode
  useEffect(() => {
    if (editMode && currentCertificate) {
      setName(currentCertificate.name);
      setIssueDate(currentCertificate.issueDate);
      setImage(currentCertificate.image);
    }
  }, [editMode, currentCertificate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !issueDate || !image) {
      alert('All fields are required!');
      return;
    }

    const newCertificate = {
      name,
      issueDate,
      image,
    };

    onAddCertificate(newCertificate);

    // Reset fields after adding or editing
    setName('');
    setIssueDate('');
    setImage('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-custom-gray opacity-75 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Certificate' : 'Add Certificate'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-white font-medium mb-2">
              Certificate Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-lg focus:ring-custom-green focus:border-custom-green"
              placeholder="Enter certificate name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="issueDate" className="block text-white font-medium mb-2">
              Issue Date
            </label>
            <input
              id="issueDate"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full text-gray-600 font-boldd px-3 py-2 border border-gray-300 rounded-lg focus:ring-custom-green focus:border-custom-green"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
              Upload Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
              required={!editMode} // Only require image in edit mode if no image is already set
            />
            {image && !editMode && (
              <div className="mt-2">
                <img src={image} alt="Certificate Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
            {editMode && image && (
              <div className="mt-2">
                <img src={image} alt="Certificate Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-custom-green text-white px-4 py-2 rounded-lg hover:bg-green-500"
            >
              {editMode ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCertificateModal;

