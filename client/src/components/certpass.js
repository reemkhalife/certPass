import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LuFilePlus2 } from 'react-icons/lu';
import AddCertificateModal from './AddCertificate.js';
import { TASK_CLEAN_GLOBAL } from 'hardhat/builtin-tasks/task-names.js';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]); // minted/Zydia certificates
  const [requests, setRequests] = useState([]);
  const [uploadedCertificates, setUploadedCertificates] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [filterUploaded, setFilterUploaded] = useState('Pending');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const studentId = localStorage.getItem('studentId');
  const userId = localStorage.getItem('userId')

  //////////////////////////////////////////////////////////////////////ZYDIA CERTIFICATES (Verified)
  // Fetch
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response1 = await axios.get(
          `http://localhost:7000/api/certificatesForStudent/${studentId}`
        );
        const response2 = await axios.get(
          `http://localhost:7000/api/studentsRequests/${studentId}?status=${filter}`
        );
        setCertificates([...response1.data, ...response2.data]);
        console.log(certificates);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, [filter]);


  // Add
  const handleAddCertificate = async (newCertificateToSend) => {
    if (editMode) {
      setCertificates((prevCertificates) =>
        prevCertificates.map((cert) =>
          cert.id === currentCertificate.id ? { ...newCertificateToSend, id: cert.id } : cert
        )
      );
      setEditMode(false);
      setCurrentCertificate(null);
    } else {
      // setCertificates([
      //   ...certificates,
      //   { ...newCertificate, id: Date.now() }, // Add a unique ID
      // ]);    }
      try {
        console.log(newCertificateToSend)
        const response = await axios.post('http://localhost:7000/api/uploadedCertificates', newCertificateToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setCertificates([
          ...certificates,
          { ...response.data, id: response.data._id }, // Include the MongoDB ID
        ]);
      } catch (error) {
        console.error('Error adding certificate:', error);
      }
    }
    setShowModal(false);
  };

  // // Edit
  // const handleEditMinted = async (id) => {
    
  // };

  // Delete
  const handleDeleteMinted = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/uploadedCertificates/${id}`);
      setCertificates((prevCertificates) =>
        prevCertificates.filter((cert) => cert.id !== id)
      );
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  // Download

  const handleDownloadMinted = async(id) => {

  };

  //////////////////////////////////////////////////////////////////////ZYDIA REQUESTS (Pending/Rejected)
  // Fetch
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/studentsRequests/${studentId}?status=${filter}`
        );
        setRequests(response.data);
        console.log(requests);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchRequests();
  }, [filter]);

  // Delete
  const handleDeleteRequest = async (id) => {

  };

  //////////////////////////////////////////////////////////////////////UPLOADED CERTIFICATES
  // Fetch
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        console.log('fetching.............');
        const response = await axios.get(
          `http://localhost:7000/api/uploadedCertificatesForStudent/${userId}?status=${filterUploaded}`);
        setUploadedCertificates(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, [filterUploaded]);

  // Delete
  const handleDeleteUploaded = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/uploadedCertificates/${id}`);
      setCertificates((prevCertificates) =>
        prevCertificates.filter((cert) => cert.id !== id)
      );
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  // Download
  const handleDownloadUploaded = async (id) => {

  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* HEADER */}
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

      {/* /////////////////////////////ZYDIA CERTIFICATES///////////////////////////////// */}
      {/* Filter */}
      Zydia Certificates
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${
            filter === 'pending' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-4 py-2 rounded ${
            filter === 'verified' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Certificate Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
        {filter === 'verified' && certificates.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No certificates available.
          </div>
        ) : filter === 'pending' && requests.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No pending requests available.
          </div>
        ) : (
          (filter === 'verified' ? certificates : requests).map((certificate) => (
            <div
              key={certificate._id}
              className="text-gray-200 shadow-lg rounded-lg p-4 bg-custom-gray"
            >
              {filter === 'verified' && (
                <iframe
                  src={`http://localhost:7000${certificate.fileUrl? certificate.fileUrl : certificate.certificateData.fileUrl}`}
                  style={{border: 'none'}}
                  className="w-full h-40 object-contain rounded-lg mb-4 overflow-hidden" 
                  title="PDF Viewer"
                ></iframe>
              )}
              <h3 className="text-lg font-semibold text-gray-200">{certificate.name? certificate.name : certificate.certificateData.name}</h3>
              <p className="text-sm text-gray-200">Issued on: {certificate.issueDate? certificate.issueDate : certificate.certificateData.issueDate}</p>
              <div className="flex justify-between mt-4">
                {filter === 'pending' ? (
                  <>
                    {/* <button
                      onClick={() => handleEditMinted(certificate.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => handleDeleteMinted(certificate.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                    onClick={() => handleDownloadMinted(certificate.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteMinted(certificate.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* /////////////////////////////UPLOADED CERTIFICATES///////////////////////////////// */}
      {/* Filter */}
      Uploaded Certificates
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilterUploaded('Pending')}
          className={`px-4 py-2 rounded ${
            filterUploaded === 'Pending' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterUploaded('Verified')}
          className={`px-4 py-2 rounded ${
            filterUploaded === 'Verified' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Certificate Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
        {uploadedCertificates.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No certificates available.
          </div>
        ) : (
          uploadedCertificates.map((certificate) => (
            <div
              key={certificate._id}
              className="text-gray-200 shadow-lg rounded-lg p-4 bg-custom-gray"
            >
              {filterUploaded === 'Verified' && (
                <iframe
                  src="http://localhost:7000/uploads/certificates/6756e503f757f13558a45824.pdf"
                  style={{border: 'none'}}
                  className="w-full h-40 object-contain rounded-lg mb-4 overflow-hidden" 
                  title="PDF Viewer"
                ></iframe>
              )}
              <h3 className="text-lg font-semibold text-gray-200">{certificate.name}</h3>
              <p className="text-sm text-gray-200">Issued on: {certificate.issueDate}</p>
              <div className="flex justify-between mt-4">
                {filterUploaded === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleEditRequest(certificate.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(certificate.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleDownloadUploaded(certificate.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteUploaded(certificate.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
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
