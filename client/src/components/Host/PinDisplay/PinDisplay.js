// components/host/PinDisplay.js
import { useState } from 'react';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './PinDisplay.css';

const PinDisplay = ({ pin }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    toast.success('PIN copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pin-container">
      <h3>Game PIN</h3>
      <div className="pin-display">
        <code>{pin}</code>
        <button onClick={copyToClipboard} aria-label="Copy PIN">
          {copied ? <FaClipboardCheck className="copied" /> : <FaClipboard />}
        </button>
      </div>
      <p>Share this PIN with players to join</p>
    </div>
  );
};

export default PinDisplay;