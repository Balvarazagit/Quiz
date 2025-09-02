import { useRef } from 'react';
import { QRCodeSVG } from "qrcode.react";
import { FaLink, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './HostQRCode.css';

function HostQRCode({ pin, isMobile }) {
  const qrRef = useRef();

  const downloadQRCode = () => {
    try {
      const svgElement = qrRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = `quiz-${pin}-qrcode.png`;
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(svgUrl);
        toast.success('QR code downloaded!');
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const copyJoinLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join?pin=${pin}`);
    toast.success("Join link copied!");
  };

  return (
    <div className="qr-section-host">
      <h3>📲 Scan to Join</h3>
      <div className="qr-container" ref={qrRef}>
        <QRCodeSVG
          value={`${window.location.origin}/join?pin=${pin}`}
          size={isMobile ? 120 : 150}
          level="H"
          includeMargin={true}
          className="qr-code"
        />
      </div>
      <div className="qr-actions">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="copy-link-btn"
          onClick={copyJoinLink}
        >
          <FaLink /> Copy Join Link
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="download-btn-host"
          onClick={downloadQRCode}
        >
          <FaDownload /> Download QR
        </motion.button>
      </div>
    </div>
  );
}

export default HostQRCode;
