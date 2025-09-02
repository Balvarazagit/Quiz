import { motion } from "framer-motion";
import { useState } from "react";
import "./WaitingRoom.css";
import WaitingHeader from "../WaitingRoom/WaitingHeader/WaitingHeader";
import WaitingAnimation from "../WaitingRoom/WaitingAnimation/WaitingAnimation";
import SessionInfo from "../WaitingRoom/SessionInfo/SessionInfo";
import QRCodeSection from "../WaitingRoom/QRCodeSection/QRCodeSection";
import ProgressSection from "../WaitingRoom/ProgressSection/ProgressSection";
import ShareModal from "../WaitingRoom/ShareModal/ShareModal";

const WaitingRoom = ({ pin, name, userId, players = 12 }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const joinUrl = `${window.location.origin}/join?pin=${pin}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join My Quiz Game',
          text: `Join my quiz game using PIN: ${pin}`,
          url: joinUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    if (showShareOptions) {
      setTimeout(() => setShowShareOptions(false), 1500);
    }
  };

  const shareOnSocialMedia = (platform) => {
    let url = '';
    const text = `Join my quiz game! PIN: ${pin}`;
    
    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(joinUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(joinUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + joinUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="waiting-room"
    >
      <div className="waiting-content">
        <WaitingHeader players={players} />
        
        <WaitingAnimation />
        
        <h3 className="waiting-title">Waiting for Host</h3>
        <p className="waiting-message">The quiz will begin shortly</p>
        
        <div className="session-info-container">
          <SessionInfo pin={pin} name={name} userId={userId} />
          
          <QRCodeSection 
            joinUrl={joinUrl} 
            copyLink={copyLink} 
            handleShare={handleShare} 
            copied={copied} 
          />
        </div>
        
        <ProgressSection />
      </div>

      <ShareModal 
        showShareOptions={showShareOptions}
        setShowShareOptions={setShowShareOptions}
        copyLink={copyLink}
        shareOnSocialMedia={shareOnSocialMedia}
        copied={copied}
      />
    </motion.div>
  );
};

export default WaitingRoom;