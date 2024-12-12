import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LuFilePlus2 } from 'react-icons/lu';
import AddCertificateModal from './AddCertificate.js';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [uploadedCertificates, setUploadedCertificates] = useState([]);
  const [filter, setFilter] = useState('Pending');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/certificates?status=${filter}`
        );
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, [filter]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/uploadedCertificates?status=${filter}`
        );
        setUploadedCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, [filter]);

  const handleAddCertificate = (newCertificate) => {
    if (editMode) {
      setCertificates((prevCertificates) =>
        prevCertificates.map((cert) =>
          cert.id === currentCertificate.id ? { ...newCertificate, id: cert.id } : cert
        )
      );
      setEditMode(false);
      setCurrentCertificate(null);
    } else {
      setCertificates([
        ...certificates,
        { ...newCertificate, id: Date.now() }, // Add a unique ID
      ]);    }
    setShowModal(false);
  };

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/uploadedCertificates/${id}`);
      setCertificates((prevCertificates) =>
        prevCertificates.filter((cert) => cert.id !== id)
      );
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
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

      <div className="flex justify-center gap-4 mb-6">
        Zydia Certificates
        <button
          onClick={() => setFilter('Pending')}
          className={`px-4 py-2 rounded ${
            filter === 'Pending' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('Verified')}
          className={`px-4 py-2 rounded ${
            filter === 'Verified' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Verified
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
        {certificates.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No certificates available.
          </div>
        ) : (
          certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="text-gray-200 shadow-lg rounded-lg p-4 bg-custom-gray"
            >
              {/* {certificate.fileType === 'image' ? ( */}
                {/* <img
                  src={`http://localhost:7000/uploads/requests/server/uploads/requests/1732572987060-Class Diagram.png`}
                  alt={certificate.name}
                  className="w-full h-40 object-contain rounded-lg mb-4"
                /> */}
              {/* ) : ( */}
              {filter === 'Verified' && (
                <iframe
                  src="http://localhost:7000/uploads/certificates/6756e503f757f13558a45824.pdf"
                  style={{border: 'none'}}
                  className="w-full h-40 object-contain rounded-lg mb-4 overflow-hidden" 
                  title="PDF Viewer"
                ></iframe>
              )}
              {/* )} */}
              <h3 className="text-lg font-semibold text-gray-200">{certificate.name}</h3>
              <p className="text-sm text-gray-200">Issued on: {certificate.issueDate}</p>
              <div className="flex justify-between mt-4">
                {filter === 'Pending' ? (
                  <>
                    <button
                      // onClick={() => handleVerify(certificate.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Verify
                    </button>
                    <button
                      // onClick={() => handleReject(certificate.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => window.open(certificate.fileUrl, '_blank')}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(certificate.id)}
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
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter('Pending')}
          className={`px-4 py-2 rounded ${
            filter === 'Pending' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('Verified')}
          className={`px-4 py-2 rounded ${
            filter === 'Verified' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Verified
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
        Uploaded Certificates
        {uploadedCertificates.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No certificates available.
          </div>
        ) : (
          uploadedCertificates.map((certificate) => (
            <div
              key={certificate.id}
              className="text-gray-200 shadow-lg rounded-lg p-4 bg-custom-gray"
            >
              {/* {certificate.fileType === 'image' ? ( */}
                {/* <img
                  src={`http://localhost:7000/uploads/requests/server/uploads/requests/1732572987060-Class Diagram.png`}
                  alt={certificate.name}
                  className="w-full h-40 object-contain rounded-lg mb-4"
                /> */}
              {/* ) : ( */}
              {filter === 'Verified' && (
                <iframe
                  src="http://localhost:7000/uploads/certificates/6756e503f757f13558a45824.pdf"
                  style={{border: 'none'}}
                  className="w-full h-40 object-contain rounded-lg mb-4 overflow-hidden" 
                  title="PDF Viewer"
                ></iframe>
              )}
              {/* )} */}
              <h3 className="text-lg font-semibold text-gray-200">{certificate.name}</h3>
              <p className="text-sm text-gray-200">Issued on: {certificate.issueDate}</p>
              <div className="flex justify-between mt-4">
                {filter === 'Pending' ? (
                  <>
                    <button
                      // onClick={() => handleVerify(certificate.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Verify
                    </button>
                    <button
                      // onClick={() => handleReject(certificate.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => window.open(certificate.fileUrl, '_blank')}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(certificate.id)}
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
