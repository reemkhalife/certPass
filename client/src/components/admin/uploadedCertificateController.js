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