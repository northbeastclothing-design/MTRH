import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { MISSING_IMAGE_URL, cleanAndProxyImageUrl, getEmbedUrl, getPdfViewerSrcDoc } from '../utils/media';

// Full-screen media lightbox (portalled) plus its keyframe styles. Moved verbatim out of App.tsx; state stays in App.
interface LightboxProps {
  isLightboxOpen: boolean;
  setIsLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFeature: any;
  selectedCodexNode: any;
  activeAssets: any[];
  activeImageIndex: number;
  brokenImages: Record<string, boolean>;
  setBrokenImages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isLightboxImageLoading: boolean;
  setIsLightboxImageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  scrollbarWidth: number;
  isMapDarkMode: boolean;
  isMobile: boolean;
  handleNextImage: (e?: React.MouseEvent) => void;
  handlePrevImage: (e?: React.MouseEvent) => void;
}

export default function Lightbox({
  isLightboxOpen,
  setIsLightboxOpen,
  selectedFeature,
  selectedCodexNode,
  activeAssets,
  activeImageIndex,
  brokenImages,
  setBrokenImages,
  isLightboxImageLoading,
  setIsLightboxImageLoading,
  scrollbarWidth,
  isMapDarkMode,
  isMobile,
  handleNextImage,
  handlePrevImage,
}: LightboxProps) {
  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isLightboxOpen && (selectedFeature || selectedCodexNode) && activeAssets && activeAssets.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsLightboxOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, width: scrollbarWidth ? `calc(100vw - ${scrollbarWidth}px)` : '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, cursor: 'zoom-out', fontFamily: '"Space Mono", monospace' }}
            >
              <motion.button 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ opacity: 0.7 }}
                onClick={() => setIsLightboxOpen(false)} 
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Space Mono", monospace', letterSpacing: '1px', zIndex: 1000000, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
              <img src="/icons/icon-x.svg" style={{ width: '24px', height: '24px', filter: 'invert(1)' }} alt="close" />
              CLOSE
            </motion.button>
  
            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%', 
                padding: '64px', 
                boxSizing: 'border-box',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center' 
              }} 
              onClick={e => e.stopPropagation()}
            >
              {(() => {
                const activeItem = selectedFeature || selectedCodexNode;
                const activeItemId = activeItem?.id || 'active-item';
                const activeItemName = activeItem?.name || 'ASSET';

                const curAsset = activeAssets[activeImageIndex];
                if (!curAsset) return null;

                const isPdf = !!(curAsset.type === 'pdf' || curAsset.pdfUrl);
                const actualPdfUrl = curAsset.pdfUrl || (curAsset.type === 'pdf' ? curAsset.url : undefined);
                const isBroken = !!(brokenImages[curAsset.url] || curAsset.url === MISSING_IMAGE_URL || curAsset.url?.includes('icon-missing-image.svg'));
                const imgSrc = isBroken ? MISSING_IMAGE_URL : cleanAndProxyImageUrl(curAsset.url);

                return (
                  <>
                    {isLightboxImageLoading && curAsset.type === 'image' && !curAsset.pdfUrl && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <div className="loading-spinner" style={{ borderTopColor: '#ffffff' }} />
                      </div>
                    )}
        
                    <AnimatePresence mode="wait">
                      {isPdf && actualPdfUrl ? (
                        <motion.div
                          key={`lightbox-pdf-${activeItemId}-${activeImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ width: '90%', height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
                        >
                          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', background: '#fff' }}>
                            <iframe
                              srcDoc={getPdfViewerSrcDoc(actualPdfUrl)}
                              style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
                              title="Declassified Document Archive"
                            />
                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', color: '#fff', pointerEvents: 'none' }}>
                              If dossier fails to display, use "OPEN SOURCE FILE" below
                            </div>
                          </div>
                        </motion.div>
                      ) : curAsset.type === 'video' ? (
                        <motion.div
                          key={`lightbox-video-${activeItemId}-${activeImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ 
                            width: 'min(80vw, calc((100vh - 220px) * 16 / 9))',
                            height: 'min(calc(100vh - 220px), calc(80vw * 9 / 16))',
                            maxWidth: '100%',
                            maxHeight: 'calc(100vh - 220px)',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {(curAsset.url.includes('youtube.com') || 
                            curAsset.url.includes('youtu.be') || 
                            curAsset.url.includes('dvidshub.net/video/') ||
                            curAsset.url.includes('twitter.com') ||
                            curAsset.url.includes('x.com')) ? (
                            <iframe
                              src={getEmbedUrl(curAsset.url)}
                              style={{ 
                                width: '100%', 
                                height: curAsset.url.includes('dvidshub.net/video/') ? '110%' : '100%', 
                                border: 'none', 
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                position: 'absolute',
                                top: 0,
                                left: 0
                              }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="High resolution dossier archive asset"
                            />
                          ) : (
                            (() => {
                              const videoSrc = curAsset.url;
                              const mimeType = curAsset.url.toLowerCase().endsWith('.webm') ? 'video/webm' : curAsset.url.toLowerCase().endsWith('.ogv') ? 'video/ogg' : 'video/mp4';
                              return (
                                <video
                                  controls
                                  autoPlay
                                  referrerPolicy="no-referrer"
                                  style={{ width: '100%', height: '100%', outline: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                                >
                                  <source src={videoSrc} type={mimeType} />
                                  Your browser does not support the video tag.
                                </video>
                              );
                            })()
                          )}
                        </motion.div>
                      ) : curAsset.type === 'audio' ? (
                        <motion.div
                          key={`lightbox-audio-${activeItemId}-${activeImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', gap: '32px', padding: '48px' }}
                        >
                          <div style={{ width: '128px', height: '128px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                              <path d="M9 18V5l12-2v13"></path>
                              <circle cx="6" cy="18" r="3"></circle>
                              <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                          </div>
                          <audio 
                            src={curAsset.url} 
                            controls 
                            autoPlay
                            style={{ width: '100%', maxWidth: '600px', height: '54px' }} 
                          />
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#ffffff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '8px' }}>AUDIO INTELLIGENCE INTERCEPT</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>{activeItemName} - DIRECT SIGNAL CAPTURE</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.img 
                          key={`${activeItemId}-${activeImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: isLightboxImageLoading ? 0 : 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          src={imgSrc} 
                          alt="High resolution dossier archive asset" 
                          referrerPolicy="no-referrer"
                          onLoad={() => setIsLightboxImageLoading(false)}
                          onError={(e) => {
                            setIsLightboxImageLoading(false);
                            if (curAsset.url) {
                              const target = e.currentTarget;
                              const currentSrc = target.src || '';
                              const rawUrl = curAsset.url;
                              if (currentSrc.includes('weserv.nl') && !currentSrc.includes('/api/proxy-resource')) {
                                target.src = `/api/proxy-resource?url=${encodeURIComponent(rawUrl)}`;
                                return;
                              }
                              if (currentSrc.includes('/api/proxy-resource') && target.src !== rawUrl) {
                                target.src = rawUrl;
                                return;
                              }
                              setBrokenImages(prev => ({ ...prev, [curAsset.url]: true }));
                            }
                          }}
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain', 
                            margin: 'auto',
                            backgroundColor: 'transparent',
                            width: isBroken ? '96px' : 'auto',
                            height: isBroken ? '96px' : 'auto',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', marginTop: '16px', zIndex: 1000001 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%' }}>
                        {activeAssets.length > 1 && (
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handlePrevImage(e)} 
                            className="lightbox-nav-btn"
                            aria-label="Previous asset"
                          >
                            <img src="/icons/icon-arrow-left.svg" style={{ width: '10px', height: '18px' }} alt="prev" />
                          </motion.button>
                        )}

                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          style={{ 
                            color: '#ffffff', 
                            fontSize: '11px', 
                            fontFamily: '"Space Mono", monospace', 
                            whiteSpace: 'normal', 
                            wordBreak: 'break-word',
                            lineHeight: '1.4',
                            backgroundColor: 'rgba(0,0,0,0.75)', 
                            padding: '8px 18px', 
                            borderRadius: '16px', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            letterSpacing: '0.5px',
                            textAlign: 'center',
                            zIndex: 1000001,
                            maxWidth: 'min(75vw, 600px)'
                          }}>
                          FILE ASSET {activeImageIndex + 1} OF {activeAssets.length} — {activeItemName.toUpperCase()}
                        </motion.div>

                        {activeAssets.length > 1 && (
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleNextImage(e)} 
                            className="lightbox-nav-btn"
                            aria-label="Next asset"
                          >
                            <img src="/icons/icon-arrow-left.svg" style={{ width: '10px', height: '18px', transform: 'rotate(180deg)' }} alt="next" />
                          </motion.button>
                        )}
                      </div>

                      {isPdf && actualPdfUrl && (
                        <a 
                          href={actualPdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ 
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            border: '1px solid #ffffff',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            letterSpacing: '1.5px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                            zIndex: 1000002,
                            textTransform: 'uppercase'
                          }}
                        >
                          <img src="/icons/icon-expand.svg" style={{ width: '16px', height: '16px', filter: 'invert(1)' }} alt="open" />
                          OPEN FULL PDF IN NEW TAB
                        </a>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {!isMobile && (
        <footer style={{ 
          background: isMapDarkMode ? '#ffffff' : '#000000', 
          color: isMapDarkMode ? '#000000' : '#ffffff', 
          minHeight: '270px', 
          boxSizing: 'border-box', 
          paddingTop: '50px',
          paddingBottom: '60px',
          display: 'flex', 
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left', 
          fontFamily: '"Space Mono", monospace',
          width: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            width: '100%', 
            justifyContent: 'space-between',
            padding: '0 60px 0 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'stretch' }}>
              <img 
                src="/mtrh-horiz-words.svg" 
                alt="MTRH Logo" 
                style={{ 
                  width: '232px', 
                  height: '78px',
                  display: 'block',
                  filter: isMapDarkMode ? 'invert(1)' : 'none'
                }} 
              />
              <div style={{ 
                marginLeft: '35px',
                opacity: 0.5,
                color: isMapDarkMode ? '#000000' : '#ffffff', 
                fontSize: '10px', 
                fontWeight: 'normal', 
                lineHeight: '1.5', 
                textTransform: 'none' 
              }}>
                Copyright North Beast LLC 2026.<br /> All rights reserved.
              </div>
            </div>
            
            {/* RIGHT: CONTENT COLUMNS - Aligned right */}
            <div style={{ 
              display: 'flex', 
              gap: '80px'
            }}>
              <div style={{ textTransform: 'uppercase', textAlign: 'right' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px 0', color: isMapDarkMode ? '#000000' : '#ffffff', textAlign: 'right', fontFamily: '"Space Mono", monospace' }}>FRIENDS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '10px', fontWeight: 'bold', color: isMapDarkMode ? '#000000' : '#ffffff', textAlign: 'right', fontFamily: '"Space Mono", monospace', textTransform: 'uppercase' }}>
                  <a href="https://northbeastclothing.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>NORTH BEAST CO.</a>
                  <a href="https://blurrycreatures.com/?srsltid=AfmBOorjjAxrHwi6VEgrMm-dxLlVFFb_yFGO3YDacaky_IXZDdgcWNcg" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>BLURRY CREATURES</a>
                  <a href="https://www.theconfessionalspodcast.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>THE CONFESSIONALS</a>
                  <a href="https://www.instagram.com/giants_of_ancientamerica/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GIANTS OF ANCIENT AMERICA</a>
                  <a href="https://www.instagram.com/freetherabbitspodcast/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>FREE THE RABBITS</a>
                  <a href="https://www.21cdstudios.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>21CD</a>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px 0', color: isMapDarkMode ? '#000000' : '#ffffff', textAlign: 'right', fontFamily: '"Space Mono", monospace' }}>CONTACT</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '10px', fontWeight: 'bold', color: isMapDarkMode ? '#000000' : '#ffffff', textAlign: 'right', fontFamily: '"Space Mono", monospace' }}>
                  <span style={{ fontWeight: 'normal', textTransform: 'none' }}>Questions? Wanna help?</span>
                  <a href="mailto:mappingtherabbithole@gmail.com" style={{ color: 'inherit', textDecoration: 'underline', textTransform: 'none' }}>mappingtherabbithole@gmail.com</a>
                  
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <form 
                      action="https://www.paypal.com/donate" 
                      method="post" 
                      target="_blank" 
                      style={{ display: 'inline-block', margin: 0, padding: 0 }}
                    >
                      <input type="hidden" name="business" value="GZV5QVK7KNBVE" />
                      <input type="hidden" name="no_recurring" value="0" />
                      <input type="hidden" name="item_name" value="I do this because I love it! But anything is greatly appreciated!" />
                      <input type="hidden" name="currency_code" value="USD" />
                      <button 
                        type="submit"
                        style={{
                          width: '140px',
                          height: '30px',
                          backgroundColor: 'transparent',
                          color: isMapDarkMode ? '#000000' : '#ffffff',
                          border: `1.5px solid ${isMapDarkMode ? '#000000' : '#ffffff'}`,
                          padding: '0',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          fontFamily: '"Space Mono", monospace',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderRadius: '30px',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = isMapDarkMode ? '#000000' : '#ffffff';
                          e.currentTarget.style.color = isMapDarkMode ? '#ffffff' : '#000000';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = isMapDarkMode ? '#000000' : '#ffffff';
                        }}
                      >
                        DONATE
                      </button>
                      <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" style={{ display: 'none' }} />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        * {
          font-family: 'Space Mono', monospace !important;
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow-y: auto;
          overflow-x: hidden;
          width: 100%;
        }
        html {
          height: 100%;
        }
        /* Let the body grow past the viewport so the document itself scrolls
           and the desktop footer below the full-screen app can be reached.
           Mobile is locked separately in index.css. */
        body {
          min-height: 100%;
        }

        .custom-sidebar-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-track {
          background: ${isMapDarkMode ? '#000000' : '#ffffff'};
          border-left: 1px solid ${isMapDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: ${isMapDarkMode ? '#ffffff' : '#000000'};
          border-radius: 0px;
        }
        @supports not selector(::-webkit-scrollbar) {
          .custom-sidebar-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${isMapDarkMode ? '#ffffff #000000' : '#000000 #ffffff'};
          }
        }

        .custom-scrollbar {
          overflow-y: scroll;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isMapDarkMode ? '#000000' : '#ffffff'};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isMapDarkMode ? '#ffffff' : '#000000'};
          border-radius: 0px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isMapDarkMode ? '#cccccc' : '#333333'};
        }
        @supports not selector(::-webkit-scrollbar) {
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${isMapDarkMode ? '#ffffff #000000' : '#000000 #ffffff'};
          }
        }

        .timeline-zoom-slider { -webkit-appearance: none !important; appearance: none !important; }
        .timeline-zoom-slider::-webkit-slider-thumb { -webkit-appearance: none !important; appearance: none !important; width: 16px !important; height: 16px !important; border-radius: 50% !important; background: #ffffff !important; border: 2px solid #000000 !important; cursor: pointer !important; }
        
        .figma-slider-thumb-left::-webkit-slider-thumb { 
          -webkit-appearance: none !important; 
          appearance: none !important; 
          pointer-events: auto !important; 
          width: 12px !important; 
          height: 24px !important; 
          border-radius: 4px !important; 
          background-color: ${isMapDarkMode ? '#ffffff' : '#000000'} !important; 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${isMapDarkMode ? 'black' : 'white'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          cursor: pointer !important; 
          border: ${isMapDarkMode ? '1px solid #000000' : 'none'} !important;
          margin-top: 0 !important;
        }
        .figma-slider-thumb-left::-moz-range-thumb { 
          appearance: none !important; 
          pointer-events: auto !important; 
          width: 12px !important; 
          height: 24px !important; 
          border-radius: 4px !important; 
          background-color: ${isMapDarkMode ? '#ffffff' : '#000000'} !important; 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${isMapDarkMode ? 'black' : 'white'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          cursor: pointer !important; 
          border: ${isMapDarkMode ? '1px solid #000000' : 'none'} !important;
        }
        
        .figma-slider-thumb-right::-webkit-slider-thumb { 
          -webkit-appearance: none !important; 
          appearance: none !important; 
          pointer-events: auto !important; 
          width: 12px !important; 
          height: 24px !important; 
          border-radius: 4px !important; 
          background-color: ${isMapDarkMode ? '#ffffff' : '#000000'} !important; 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${isMapDarkMode ? 'black' : 'white'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          cursor: pointer !important; 
          border: ${isMapDarkMode ? '1px solid #000000' : 'none'} !important;
          margin-top: 0 !important;
        }
        .figma-slider-thumb-right::-moz-range-thumb { 
          appearance: none !important; 
          pointer-events: auto !important; 
          width: 12px !important; 
          height: 24px !important; 
          border-radius: 4px !important; 
          background-color: ${isMapDarkMode ? '#ffffff' : '#000000'} !important; 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${isMapDarkMode ? 'black' : 'white'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          cursor: pointer !important; 
          border: ${isMapDarkMode ? '1px solid #000000' : 'none'} !important;
        }
        
        .interactive-tag-pill:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .interactive-tag-pill:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .loading-spinner {
          width: 28px;
          height: 28px;
          border: 2px solid #e5e5e5;
          border-top: 2px solid #000000;
          border-radius: 50%;
          animation: spinMapAsset 0.7s linear infinite;
        }

        .lightbox-nav-icon {
          filter: brightness(0) invert(1);
          transition: filter 0.2s ease;
        }
        
        button:hover .lightbox-nav-icon {
          filter: brightness(0);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spinMapAsset {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes introSpinColor {
          0% {
            transform: rotate(0deg);
            border-top-color: #FF9BE1;
          }
          20% {
            transform: rotate(360deg);
            border-top-color: #B297FF;
          }
          40% {
            transform: rotate(720deg);
            border-top-color: #FF9F63;
          }
          60% {
            transform: rotate(1080deg);
            border-top-color: #90C2FF;
          }
          80% {
            transform: rotate(1440deg);
            border-top-color: #91FFC4;
          }
          100% {
            transform: rotate(1800deg);
            border-top-color: #FF9BE1;
          }
        }

        @keyframes radar-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(182, 166, 255, 0.6);
            border-color: rgba(182, 166, 255, 0.8);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(182, 166, 255, 0);
            border-color: rgba(182, 166, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(182, 166, 255, 0);
            border-color: rgba(182, 166, 255, 0);
          }
        }
      `}</style>
    </>
  );
}
