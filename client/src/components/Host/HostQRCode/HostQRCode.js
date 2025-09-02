import { useRef } from 'react';
import { QRCodeSVG } from "qrcode.react";
import { FaQrcode, FaLink } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './HostQRCode.css';

function HostQRCode({ pin, isMobile }) {
  const qrRef = useRef();

  const shareQRCode = async () => {
    try {
      const svgElement = qrRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        
        if (navigator.share) {
          const response = await fetch(pngUrl);
          const blob = await response.blob();
          const file = new File([blob], 'quiz-qr.png', { type: 'image/png' });
          
          await navigator.share({
            title: 'Join My Quiz',
            text: `Join my quiz using PIN: ${pin} or scan the QR code`,
            files: [file],
          });
        } else {
          const link = document.createElement('a');
          link.download = 'quiz-qr.png';
          link.href = pngUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.info('QR code downloaded!');
        }
        
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('Error sharing QR code:', error);
      toast.error('Failed to share QR code');
    }
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
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/join?pin=${pin}`);
            toast.success("Join link copied!");
          }}
        >
          <FaLink /> Copy Join Link
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="share-btn-host"
          onClick={shareQRCode}
        >
          <FaQrcode /> Share QR Code
        </motion.button>
      </div>
    </div>
  );
}

export default HostQRCode;