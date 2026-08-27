import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link, Check, Share2 } from 'lucide-react';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text?: string;
  url: string;
  category?: string;
  imageUrl?: string;
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

  // Reset copied state on open/close
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

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
    onShowToast('Opening X...');
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
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

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
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
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
            maxHeight: '92vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={15} style={{ color: isMapDarkMode ? '#91FFC4' : '#000' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                SHARE DOSSIER
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isMapDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                border: `1px solid ${isMapDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
                color: isMapDarkMode ? '#aaaaaa' : '#666666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={15} />
            </motion.button>
          </div>

          {/* Title / Info Preview */}
          <div 
            style={{
              background: isMapDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isMapDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, lineHeight: '16px' }}>
              {title}
            </div>
            <div style={{ fontSize: '9px', opacity: 0.6, wordBreak: 'break-all' }}>
              {url}
            </div>
          </div>

          {/* Share Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Copy Link Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02, backgroundColor: copied ? '#91FFC4' : (isMapDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)') }}
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                height: '38px',
                padding: '0 20px',
                borderRadius: '24px',
                background: copied 
                  ? '#91FFC4' 
                  : (isMapDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'),
                color: copied ? '#000000' : (isMapDarkMode ? '#ffffff' : '#000000'),
                border: `1px solid ${isMapDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={14} /> : <Link size={14} />}
              <span>{copied ? 'LINK COPIED TO CLIPBOARD' : 'COPY LINK TO CLIPBOARD'}</span>
            </motion.button>

            {/* Share on X */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02, backgroundColor: isMapDarkMode ? '#1a1a1c' : '#222222' }}
              onClick={handleShareX}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                height: '38px',
                padding: '0 20px',
                borderRadius: '24px',
                background: isMapDarkMode ? '#000000' : '#111111',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>SHARE ON X</span>
            </motion.button>

            {/* Native Mobile Share Sheet */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02, backgroundColor: isMapDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' }}
                onClick={handleNativeShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  height: '38px',
                  padding: '0 20px',
                  borderRadius: '24px',
                  background: isMapDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  color: isMapDarkMode ? '#ffffff' : '#000000',
                  border: `1px solid ${isMapDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 700,
                  fontFamily: '"Space Mono", monospace',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
              >
                <Share2 size={14} />
                <span>MORE SHARING OPTIONS...</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
