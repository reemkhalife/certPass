import PDFDocument from 'pdfkit';
import fs from'fs';
import path from 'path';

export const generateCertificatePDF = async (certificateData, outputPath) => {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    doc.pipe(stream);

    // Certificate content
    doc.fontSize(24).text('Certificate of Achievement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`Awarded to: ${certificateData.name}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Description: ${certificateData.description}`, { align: 'center' });
    doc.moveDown();
    doc.text(`Issued by: ${certificateData.issuingOrganization}`, { align: 'center' });
    doc.moveDown();
    doc.text(`Date: ${new Date(certificateData.issueDate).toLocaleDateString()}`, { align: 'center' });

    // Add the QR code
    const qrCodeBuffer = Buffer.from(certificateData.qrCodeData.split(',')[1], 'base64');
    doc.image(qrCodeBuffer, { fit: [100, 100], align: 'center', valign: 'center' });

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
};
