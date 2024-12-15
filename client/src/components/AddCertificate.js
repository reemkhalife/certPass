import React, { useState, useEffect } from 'react';

const AddCertificateModal = ({ onClose, onAddCertificate, editMode, currentCertificate }) => {
  const [name, setName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [file, setFile] = useState('');
  const [preview, setPreview] = useState('');

  // Pre-fill the form with existing certificate data if in edit mode
  useEffect(() => {
    if (editMode && currentCertificate) {
      setName(currentCertificate.name);
      const formattedDate = new Date(currentCertificate.issueDate).toISOString().split('T')[0];
      setIssueDate(formattedDate);
      setFile(currentCertificate.filePath);
    }
  }, [editMode, currentCertificate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !issueDate || !file) {
      alert('All fields are required!');
      return;
    }

    const newCertificate = {
      name,
      issueDate,
      uploader: localStorage.getItem("userId"),
    };

    const newCertificateToSend = new FormData();
    newCertificateToSend.append("data", JSON.stringify(newCertificate));
    newCertificateToSend.append("file", file); // Assuming 'fileUrl' is a file input element

    onAddCertificate(newCertificateToSend);

    // Reset fields after adding or editing
    setName('');
    setIssueDate('');
    setFile('');
  };

  const handleFileUpload = (e) => {
    // console.log('Files:', e.target.files);
    // console.log('Files:', e.target.files[0]);
    // console.log('Files:', e.target.files[1]);
    const file = e.target.files[0];
    // console.log('file uploaded: ', file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(file)
        setPreview(reader.result)
      };
      reader.readAsDataURL(file);
      // setFile(file); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-custom-gray opacity-75 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Certificate' : 'Add Certificate'}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            <label htmlFor="file" className="block text-gray-700 font-medium mb-2">
              Upload File
            </label>
            <input
              id="file"
              name='file'
              type="file"
              // accept="image/*"
              onChange={(e) => handleFileUpload(e)}
              className="w-full"
              required={!editMode} // Only require image in edit mode if no image is already set
            />
            {file && !editMode && (
              <div className="mt-2">
                <img src={preview} alt="Certificate Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
            {editMode && file && (
              <div className="mt-2">
                <img src={file} alt="Certificate Preview" className="w-32 h-32 object-cover rounded-lg" />
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

