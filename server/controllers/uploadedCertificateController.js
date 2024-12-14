import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCertificateModal from './AddCertificate.js';
import { LuFilePlus2 } from "react-icons/lu";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);

  // const handleVerify = async (id) => {
    //   try {
    //     await axios.put(`http://localhost:7000/api/uploadedCertificates/${id}`, { status: 'Verified' });
    //     setCertificates((prevCertificates) =>
    //       prevCertificates.filter((cert) => cert.id !== id)
    //     );
    //   } catch (error) {
    //     console.error('Error verifying certificate:', error);
    //   }
    // };
  
    // const handleReject = async (id) => {
    //   try {
    //     await axios.delete(`http://localhost:7000/api/uploadedCertificates/${id}`);
    //     setCertificates((prevCertificates) =>
    //       prevCertificates.filter((cert) => cert.id !== id)
    //     );
    //   } catch (error) {
    //     console.error('Error rejecting certificate:', error);
    //   }
    // };

  useEffect(() => {
    const fetchCertificates = async () => {
      const response = await axios.get('http://localhost:7000/api/certificates');
      setCertificates(response.data);
    };

    fetchCertificates();
  }, []);

  const handleAddCertificate = (newCertificate) => {
    if (editMode) {
      // Update the existing certificate
      setCertificates((prevCertificates) =>
        prevCertificates.map((cert) =>
          cert.id === currentCertificate.id ? { ...newCertificate, id: cert.id } : cert
        )
      );
      setEditMode(false);
      setCurrentCertificate(null);
    } else {
      // Add new certificate
      setCertificates([
        ...certificates,
        { ...newCertificate, id: Date.now() }, // Add a unique ID
      ]);
    }
    setShowModal(false);
  };

  const handleEditClick = (certificate) => {
    setEditMode(true);
    setCurrentCertificate(certificate);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setCertificates((prevCertificates) =>
      prevCertificates.filter((certificate) => certificate.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="flex justify-between items-center mb-6 ml-14 p-2">
        <h1 className="text-2xl font-bold text-white">My Certificates</h1>
        <button
          onClick={() => {
            setEditMode(false);
            setShowModal(true);
          }}
          className="bg-custom-gradient text-white p-2 flex rounded-full shadow hover:bg-custom-gray"
        >
          <LuFilePlus2 />
          Add Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
        {certificates.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No certificate added yet.
          </div>
        ) : (
          certificates.map((certificate) => (
            <div
            key={certificate.id}
            className="text-gray-200  shadow-lg rounded-lg p-4 bg-custom-gray"
          >
            <img
              src={certificate.image}
              alt={certificate.name}
              className="min-w-full h-40 object-contain rounded-lg mb-4" // Adjusted class for better image display
            />
            <h3 className="text-lg font-semibold text-gray-200">{certificate.name}</h3>
            <p className="text-sm text-gray-200">Issued on: {certificate.issueDate}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditClick(certificate)}
                className="bg-custom-green text-white px-3 py-1 rounded hover:bg-green-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(certificate.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          
          ))
        )}
      </div>

      {showModal && (
        <AddCertificateModal
          onClose={() => setShowModal(false)}
          onAddCertificate={handleAddCertificate}
          editMode={editMode}
          currentCertificate={currentCertificate}
        />
      )}
    </div>
  );
};

export default CertificatesPage;