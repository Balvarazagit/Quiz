// components/host/PinDisplay.js
import { useState } from 'react';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './PinDisplay.css';

const PinDisplay = ({ pin, isDarkTheme }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    toast.success('PIN copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`pin-container ${isDarkTheme ? 'dark-theme' : ''}`}>
      <h3>Game PIN</h3>
      <div className="pin-display">
        <code className={isDarkTheme ? 'dark-theme' : ''}>{pin}</code>
        <button 
          onClick={copyToClipboard} 
          aria-label="Copy PIN"
          className={isDarkTheme ? 'dark-theme' : ''}
        >
          {copied ? <FaClipboardCheck className="copied" /> : <FaClipboard />}
        </button>
      </div>
      <p>Share this PIN with players to join</p>
    </div>
  );
};

export default PinDisplay;