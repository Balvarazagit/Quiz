import { FaShare } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import './QRCodeSection.css'

const QRCodeSection = ({ joinUrl, copyLink, handleShare, copied }) => {
  return (
    <div className="qr-section">
      <div className="qr-container">
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
            className="copy-link-btn"
            onClick={copyLink}
          >
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
          <button
            className="share-btn"
            onClick={handleShare}
          >
            <FaShare /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeSection;