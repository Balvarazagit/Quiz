import { useRef } from 'react';
import { FaDownload, FaLink } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import './QRCodeSection.css';

const QRCodeSection = ({ joinUrl }) => {
  const qrRef = useRef();

  const handleDownload = () => {
    try {
      const svgElement = qrRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = 'quiz-qr.png';
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(svgUrl);
        alert('QR code downloaded!');
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code!');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl)
      .then(() => {
        alert('Join link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="qr-section">
      <div className="qr-container" ref={qrRef}>
        <h3>Scan to Join</h3>
        <QRCodeSVG
          value={joinUrl}
          size={200}
          level="H"
          includeMargin={true}
          className="qr-code"
        />
        <div className="qr-actions">
          <button
            className="share-btn download-qr"
            onClick={handleDownload}
          >
            <FaDownload /> Download QR
          </button>
          <button
            className="share-btn share-link-only"
            onClick={copyLink}
          >
            <FaLink /> Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeSection;
