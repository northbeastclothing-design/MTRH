import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link, Check, Share2, Instagram, Download, ExternalLink, ArrowLeft } from 'lucide-react';

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
  category,
  imageUrl,
  isMapDarkMode = true,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'menu' | 'story_creator'>('menu');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset mode on open/close
  useEffect(() => {
    if (isOpen) {
      setViewMode('menu');
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

  // Render high-res (1080x1920) Instagram Story Card Canvas
  const drawStoryCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dark Radial Background
    const bgGrad = ctx.createRadialGradient(540, 960, 100, 540, 960, 1200);
    bgGrad.addColorStop(0, '#16171b');
    bgGrad.addColorStop(1, '#050506');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Subtle Grid Lines Background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 1080; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1920);
      ctx.stroke();
    }
    for (let y = 0; y < 1920; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1080, y);
      ctx.stroke();
    }

    // 3. Story Outer Container Frame Card
    const cardX = 70;
    const cardY = 160;
    const cardW = 940;
    const cardH = 1600;
    const radius = 40;

    ctx.save();
    ctx.fillStyle = 'rgba(13, 13, 15, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 4. Header Badge: Site Brand & Category
    ctx.font = 'bold 30px "Space Mono", monospace';
    ctx.fillStyle = '#91FFC4';
    ctx.textAlign = 'left';
    ctx.fillText('• MTRH INTERACTIVE MAP', 120, 240);

    if (category) {
      ctx.font = 'bold 22px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(`[ ${category.toUpperCase()} ]`, 120, 280);
    }

    // Function to draw text content onto canvas
    const drawTextContent = (startY: number) => {
      let yPos = startY;

      // Dossier Title (Word Wrapped)
      ctx.font = 'bold 52px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';

      const words = title.toUpperCase().split(' ');
      let line = '';
      const maxTextWidth = 840;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && n > 0) {
          ctx.fillText(line, 120, yPos);
          line = words[n] + ' ';
          yPos += 64;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 120, yPos);
      yPos += 45;

      // Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, yPos);
      ctx.lineTo(960, yPos);
      ctx.stroke();
      yPos += 50;

      // Description / Excerpt
      if (text) {
        ctx.font = '28px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        const cleanText = text.replace(/<[^>]*>?/gm, '');
        const textWords = cleanText.split(' ');
        let textLine = '';
        let lineCount = 0;
        const maxLines = 5;

        for (let n = 0; n < textWords.length; n++) {
          if (lineCount >= maxLines) break;
          const testLine = textLine + textWords[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxTextWidth && n > 0) {
            ctx.fillText(textLine, 120, yPos);
            textLine = textWords[n] + ' ';
            yPos += 42;
            lineCount++;
          } else {
            textLine = testLine;
          }
        }
        if (lineCount < maxLines && textLine.trim()) {
          ctx.fillText(textLine, 120, yPos);
        }
      }

      // Link Sticker Callout Box
      const stickerY = 1440;
      ctx.save();
      ctx.fillStyle = '#91FFC4';
      ctx.shadowColor = 'rgba(145, 255, 196, 0.4)';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.roundRect(120, stickerY, 840, 110, 24);
      ctx.fill();
      ctx.restore();

      ctx.font = 'bold 30px "Space Mono", monospace';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText('🔗 TAP LINK STICKER TO EXPLORE DOSSIER', 540, stickerY + 66);

      // Footer Branding
      ctx.font = 'bold 22px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.textAlign = 'center';
      ctx.fillText('MAP THE REAL HISTORY • MTRH.APP', 540, 1680);
    };

    // Draw Optional Hero Image or Text Layout
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const imgX = 120;
        const imgY = 320;
        const imgW = 840;
        const imgH = 480;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, 20);
        ctx.clip();

        const aspect = img.width / img.height;
        let drawW = imgW;
        let drawH = imgW / aspect;
        if (drawH < imgH) {
          drawH = imgH;
          drawW = imgH * aspect;
        }
        const dx = imgX + (imgW - drawW) / 2;
        const dy = imgY + (imgH - drawH) / 2;

        ctx.drawImage(img, dx, dy, drawW, drawH);

        const imgGrad = ctx.createLinearGradient(0, imgY + imgH - 120, 0, imgY + imgH);
        imgGrad.addColorStop(0, 'rgba(0,0,0,0)');
        imgGrad.addColorStop(1, 'rgba(13,13,15,0.9)');
        ctx.fillStyle = imgGrad;
        ctx.fillRect(imgX, imgY, imgW, imgH);

        ctx.restore();

        drawTextContent(840);
      };

      img.onerror = () => {
        drawTextContent(340);
      };
    } else {
      drawTextContent(340);
    }
  }, [title, text, category, imageUrl]);

  useEffect(() => {
    if (viewMode === 'story_creator') {
      setTimeout(drawStoryCanvas, 50);
    }
  }, [viewMode, drawStoryCanvas]);

  const handleDownloadStoryImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      const sanitizeName = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      a.download = `mtrh-story-${sanitizeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      onShowToast('Story graphic saved! Open Instagram to post.');
    } catch (err) {
      console.error('Failed to download image', err);
      onShowToast('Could not save graphic. Try holding down on graphic to save.');
    }
  };

  const handleOpenInstagramApp = async () => {
    await copyToClipboard();
    onShowToast('Link copied! Launching Instagram Stories...');

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'instagram-stories://share';
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      }, 1200);
    } else {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
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
            maxWidth: viewMode === 'story_creator' ? '440px' : '380px',
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
              {viewMode === 'story_creator' ? (
                <button
                  onClick={() => setViewMode('menu')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isMapDarkMode ? '#91FFC4' : '#000',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: '"Space Mono", monospace'
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>BACK</span>
                </button>
              ) : (
                <>
                  <Share2 size={16} style={{ color: isMapDarkMode ? '#91FFC4' : '#000' }} />
                  <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    SHARE DOSSIER
                  </span>
                </>
              )}
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

          {viewMode === 'menu' ? (
            <>
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

              {/* Share Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Story Creator Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setViewMode('story_creator')}
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
                    boxShadow: '0 4px 15px rgba(253, 29, 29, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Instagram size={18} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span>CREATE INSTAGRAM STORY</span>
                    <span style={{ fontSize: '9px', opacity: 0.8, fontWeight: 'normal' }}>
                      Generates 9:16 graphic + link sticker
                    </span>
                  </div>
                </motion.button>

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

                {/* Share on X */}
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>SHARE ON X</span>
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
            </>
          ) : (
            /* Instagram Story Creator Preview & Actions */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center', color: '#91FFC4' }}>
                INSTAGRAM STORY GRAPHIC
              </div>

              {/* Canvas Story Card Preview (scaled to 9:16 aspect ratio) */}
              <div 
                style={{
                  position: 'relative',
                  width: '210px',
                  height: '373px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#050506'
                }}
              >
                <canvas 
                  ref={canvasRef} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Instructions & Story Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                {/* Download Graphic Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={handleDownloadStoryImage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: '#91FFC4',
                    color: '#000000',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: '"Space Mono", monospace',
                    letterSpacing: '0.5px'
                  }}
                >
                  <Download size={16} />
                  <span>1. SAVE STORY GRAPHIC (1080x1920)</span>
                </motion.button>

                {/* Copy Link Sticker Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={handleCopyLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: copied ? '#91FFC4' : (isMapDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
                    color: copied ? '#000000' : (isMapDarkMode ? '#ffffff' : '#000000'),
                    border: `1px solid ${isMapDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: '"Space Mono", monospace',
                    letterSpacing: '0.5px'
                  }}
                >
                  {copied ? <Check size={16} /> : <Link size={16} />}
                  <span>{copied ? 'LINK COPIED!' : '2. COPY LINK FOR STORY STICKER'}</span>
                </motion.button>

                {/* Open Instagram App */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={handleOpenInstagramApp}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
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
                    letterSpacing: '0.5px'
                  }}
                >
                  <ExternalLink size={16} />
                  <span>3. OPEN INSTAGRAM APP</span>
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
