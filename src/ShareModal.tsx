import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link, Check, Share2, Instagram } from 'lucide-react';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text?: string;
  url: string;
  isMapDarkMode?: boolean;
  onShowToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  text,
  url,
  isMapDarkMode = true,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy', err);
      return false;
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard();
    if (success) {
      onShowToast('Link copied to clipboard!');
    }
  };

  const handleShareX = () => {
    const tweetText = `Check out "${title}" on MTRH Interactive Map:`;
    const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
    onShowToast('Opening X (Twitter)...');
    onClose();
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
    onShowToast('Opening Facebook...');
    onClose();
  };

  const handleShareInstagramFeed = async () => {
    await copyToClipboard();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    onShowToast('Link copied! Opening Instagram...');
    if (isMobile) {
      // Try opening native Instagram app
      window.location.href = 'instagram://app';
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      }, 1200);
    } else {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  const handleShareInstagramStory = async () => {
    await copyToClipboard();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    onShowToast('Link copied! Add link sticker in your Instagram Story.');

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url
        });
        onClose();
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    if (isMobile) {
      window.location.href = 'instagram-stories://share';
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      }, 1200);
    } else {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  const handleShareTikTok = async () => {
    await copyToClipboard();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    onShowToast('Link copied! Opening TikTok...');
    if (isMobile) {
      window.location.href = 'snssdk1128://'; // TikTok app scheme
      setTimeout(() => {
        window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer');
      }, 1200);
    } else {
      window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url
        });
        onClose();
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        await handleCopyLink();
      }
    } else {
      await handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          padding: '16px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '380px',
            background: isMapDarkMode ? '#0d0d0e' : '#ffffff',
            color: isMapDarkMode ? '#ffffff' : '#000000',
            border: `1px solid ${isMapDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontFamily: '"Space Mono", monospace',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={16} style={{ color: isMapDarkMode ? '#91FFC4' : '#000' }} />
              <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                SHARE DOSSIER
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: isMapDarkMode ? '#888' : '#666',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Title / Info Preview */}
          <div 
            style={{
              background: isMapDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${isMapDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '16px' }}>
              {title}
            </div>
            <div style={{ fontSize: '9px', opacity: 0.6, wordBreak: 'break-all' }}>
              {url}
            </div>
          </div>

          {/* Share Action Buttons List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Copy Link Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                background: copied 
                  ? '#91FFC4' 
                  : (isMapDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'),
                color: copied ? '#000000' : (isMapDarkMode ? '#ffffff' : '#000000'),
                border: `1px solid ${isMapDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.5px',
                transition: 'all 0.15s ease'
              }}
            >
              {copied ? <Check size={16} /> : <Link size={16} />}
              <span>{copied ? 'LINK COPIED TO CLIPBOARD' : 'COPY LINK TO CLIPBOARD'}</span>
            </motion.button>

            {/* Share on X (Twitter) */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleShareX}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                background: isMapDarkMode ? '#000000' : '#111111',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.5px',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Custom SVG X Logo */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>SHARE ON X (TWITTER)</span>
            </motion.button>

            {/* Share on Facebook */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleShareFacebook}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                background: '#1877F2',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.5px',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>SHARE ON FACEBOOK</span>
            </motion.button>

            {/* Share on Instagram (Feed / Post) */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleShareInstagramFeed}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Instagram size={16} />
              <span>SHARE ON INSTAGRAM (POST)</span>
            </motion.button>

            {/* Share to Instagram Story */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleShareInstagramStory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'linear-gradient(45deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Instagram size={16} />
              <span>SHARE TO INSTAGRAM STORY</span>
            </motion.button>

            {/* Share on TikTok */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleShareTikTok}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #fe2c55',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.5px',
                transition: 'all 0.15s ease'
              }}
            >
              {/* TikTok Icon SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.394 6.394 0 0 0-5.378 1.905A6.388 6.388 0 0 0 3 15.658c.005 3.535 2.868 6.393 6.408 6.393a6.389 6.389 0 0 0 6.39-6.393V9.33a8.217 8.217 0 0 0 4.791 1.524V7.41a4.787 4.787 0 0 1-1.000-.724z"/>
              </svg>
              <span>SHARE ON TIKTOK</span>
            </motion.button>

            {/* Native Mobile Share Sheet */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                onClick={handleNativeShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: isMapDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  color: isMapDarkMode ? '#ffffff' : '#000000',
                  border: `1px solid ${isMapDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  fontFamily: '"Space Mono", monospace',
                  letterSpacing: '0.5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Share2 size={16} />
                <span>MORE SHARING OPTIONS...</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
