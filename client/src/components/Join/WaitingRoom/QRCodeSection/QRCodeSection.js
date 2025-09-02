import { useRef } from 'react';
import { FaShare, FaQrcode, FaLink } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import './QRCodeSection.css';

const QRCodeSection = ({ joinUrl }) => {
  const qrRef = useRef();

  const handleShare = async () => {
    try {
      // Convert SVG to data URL
      const svgElement = qrRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create an image to convert SVG to PNG
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        
        // Try to share with Web Share API
        if (navigator.share) {
          // Fetch the PNG as a blob
          const response = await fetch(pngUrl);
          const blob = await response.blob();
          const file = new File([blob], 'quiz-qr.png', { type: 'image/png' });
          
          await navigator.share({
            title: 'Join My Quiz',
            text: `Join my quiz using PIN or scan the QR code: ${joinUrl}`,
            files: [file],
          });
        } else {
          // Fallback for browsers that don't support sharing files
          const link = document.createElement('a');
          link.download = 'quiz-qr.png';
          link.href = pngUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Also copy the link to clipboard
          navigator.clipboard.writeText(joinUrl);
          alert('QR code downloaded and link copied to clipboard!');
        }
        
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('Error sharing QR code:', error);
      // Fallback to just sharing the link
      if (navigator.share) {
        await navigator.share({
          title: 'Join My Quiz',
          text: `Join my quiz: ${joinUrl}`,
        });
      } else {
        navigator.clipboard.writeText(joinUrl);
        alert('Join link copied to clipboard!');
      }
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
            className="share-btn share-with-qr"
            onClick={handleShare}
          >
            <FaQrcode /> Share QR
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