import { motion } from "framer-motion";
import { FaTimes, FaFacebook, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";
import './ShareModal.css'

const ShareModal = ({ 
  showShareOptions, 
  setShowShareOptions, 
  copyLink, 
  shareOnSocialMedia, 
  copied 
}) => {
  if (!showShareOptions) return null;

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => setShowShareOptions(false)}
    >
      <motion.div 
        className="share-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Share Game</h3>
          <button 
            className="close-btn"
            onClick={() => setShowShareOptions(false)}
          >
            <FaTimes />
          </button>
        </div>
        <div className="share-options">
          <button 
            className="share-option"
            onClick={() => shareOnSocialMedia('facebook')}
          >
            <div className="share-icon facebook">
              <FaFacebook />
            </div>
            <span>Facebook</span>
          </button>
          <button 
            className="share-option"
            onClick={() => shareOnSocialMedia('twitter')}
          >
            <div className="share-icon twitter">
              <FaTwitter />
            </div>
            <span>Twitter</span>
          </button>
          <button 
            className="share-option"
            onClick={() => shareOnSocialMedia('whatsapp')}
          >
            <div className="share-icon whatsapp">
              <FaWhatsapp />
            </div>
            <span>WhatsApp</span>
          </button>
          <button 
            className="share-option"
            onClick={copyLink}
          >
            <div className="share-icon link">
              <FaLink />
            </div>
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareModal;