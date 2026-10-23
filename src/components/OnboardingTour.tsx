import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Guided first-visit walkthrough. Moved verbatim out of App.tsx; all state stays in App.
interface OnboardingTourProps {
  onboardingStep: number | null;
  setOnboardingStep: React.Dispatch<React.SetStateAction<number | null>>;
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
  isTimelineCollapsed: boolean;
  isMapDarkMode: boolean;
  isMobile: boolean;
  theme: any;
}

export default function OnboardingTour({
  onboardingStep,
  setOnboardingStep,
  isLeftCollapsed,
  isRightCollapsed,
  isTimelineCollapsed,
  isMapDarkMode,
  isMobile,
  theme,
}: OnboardingTourProps) {
  return (
    <>
      <AnimatePresence>
        {onboardingStep !== null && (
          <>
            {/* Dark semi-transparent backdrop for step 0 (Welcome Modal) */}
            {onboardingStep === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setOnboardingStep(null);
                  localStorage.setItem('mtrh_onboarding_completed', 'true');
                }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  zIndex: 99998,
                  pointerEvents: 'auto'
                }}
              />
            )}

            {/* Tooltip Dialog */}
            {(() => {
              const mobileOnboardingSteps = [
                {
                  title: "1. WELCOME TO MTRH",
                  content: "This interactive portal maps global anomalies, classified files, and historic archives. Let's take a quick tour to get you started.",
                  placement: "center"
                },
                {
                  title: "2. SEARCH & FILTERS",
                  content: "Use the bottom tray to search archives, toggle map layers (UFOs, Bigfoot, underworld entrances, D.U.M.B.s), and randomize active anomalies.",
                  placement: "bottom-filters"
                },
                {
                  title: "3. INTERACTIVE MAP",
                  content: "Drag to explore the globe and pinch to zoom. Tap any coordinate pin or highlighted anomaly boundary to inspect its dossier archive.",
                  placement: "map-viewport"
                },
                {
                  title: "4. DOSSIER & TIMELINE",
                  content: "Selecting coordinates opens their classified files, photos, and chronological events in the bottom tray tabs.",
                  placement: "bottom-details"
                },
                {
                  title: "5. EXPANDED VIEWS & MENU",
                  content: "Tap the Menu button in the top right to access the full Interactive Timeline, the Codex tree database, Cartography maps, and Submit Evidence.",
                  placement: "top-menu"
                }
              ];

              const desktopOnboardingSteps = [
                {
                  title: "1. WELCOME TO MTRH GUIDE",
                  content: "This interactive portal maps global anomalies, classified files, and historic archives. Let's take a quick step-by-step tour to help you get started.",
                  placement: "center"
                },
                {
                  title: "2. ARCHIVE FILTERS",
                  content: "Toggle layers to filter map events (UFOs, Bigfoot, underworld entrances, D.U.M.B.s), click SHUFFLE to randomize active layers, or use the Search bar to scan archives.",
                  placement: "left-sidebar"
                },
                {
                  title: "3. INTERACTIVE MAP",
                  content: "Left-click and drag to move. Use the scroll wheel to zoom. Clicking pins or highlighted shapes unlocks their classified dossier.",
                  placement: "map-viewport"
                },
                {
                  title: "4. HISTORICAL TIMELINE",
                  content: "Drag the timeline slider or use the zoom buttons to restrict active markers to a specific year span. Perfect for tracking events over time.",
                  placement: "timeline"
                },
                {
                  title: "5. INTERACTIVE TIMELINE PAGE",
                  content: "Click this Timeline button in the header to switch to the full interactive timeline view. There you can explore detailed biblical genealogies, Sumerian kings list, Greek mythology, and Enochian lore.",
                  placement: "timeline-button"
                },
                {
                  title: "6. COMPREHENSIVE CODEX",
                  content: "Click the Codex button in the header to navigate to the Codex page, where you can browse the interconnected tree database of entities, megaliths, structures, and anomalies.",
                  placement: "codex-button"
                },
                {
                  title: "7. INTELLIGENCE DOSSIER",
                  content: "When you select a location, its full file opens here. Review images, transcripts, video attachments, and original source documents.",
                  placement: "right-sidebar"
                },
                {
                  title: "8. SUBMIT EVIDENCE",
                  content: "Discovered an anomaly or classified file? Submit it to our queue. Once verified, it will be mapped and published on the platform.",
                  placement: "submit-intel"
                }
              ];

              const onboardingSteps = isMobile ? mobileOnboardingSteps : desktopOnboardingSteps;

              const currentStep = onboardingSteps[onboardingStep];
              if (!currentStep) return null;

              // Invert theme: black bg with white text on light mode, and white bg with black text on dark mode
              const tooltipTheme = {
                bg: isMapDarkMode ? '#ffffff' : '#000000',
                text: isMapDarkMode ? '#000000' : '#ffffff',
                textDim: isMapDarkMode ? '#666666' : '#cccccc',
                border: isMapDarkMode ? '#ffffff' : '#000000',
                borderLight: isMapDarkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                buttonBg: isMapDarkMode ? '#000000' : '#ffffff',
                buttonText: isMapDarkMode ? '#ffffff' : '#000000',
                buttonBorder: isMapDarkMode ? '#000000' : '#ffffff'
              };

              const tooltipStyle: React.CSSProperties = (() => {
                const common: React.CSSProperties = {
                  position: 'fixed',
                  zIndex: 100000,
                  width: isMobile ? 'calc(100vw - 32px)' : '320px',
                  maxWidth: isMobile ? '360px' : 'none',
                  pointerEvents: 'auto',
                  overflow: 'hidden'
                };

                if (isMobile) {
                  return {
                    ...common,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  };
                }

                switch (currentStep.placement) {
                  case 'timeline-button':
                  case 'codex-button':
                    return {
                      ...common,
                      left: '50%',
                      top: '89px', // Shifted down to align pointer perfectly with buttons
                      transform: 'translate(-50%, 0)',
                      width: '360px',
                    };
                  case 'center':
                    return {
                      ...common,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '450px',
                    };
                  case 'left-sidebar':
                    return {
                      ...common,
                      left: isLeftCollapsed ? '40px' : '340px',
                      top: '180px',
                      transform: 'translate(0, 0)',
                    };
                  case 'map-viewport':
                    return {
                      ...common,
                      left: '50%',
                      top: '40%',
                      transform: 'translate(-50%, -50%)',
                    };
                  case 'timeline':
                    return {
                      ...common,
                      left: '50%',
                      top: isTimelineCollapsed ? 'calc(100vh - 60px)' : 'calc(100vh - 190px)', // Shifted up by 20px to prevent overlap with the timeline drawer bar
                      transform: 'translate(-50%, -100%)',
                      width: '360px',
                    };
                  case 'right-sidebar':
                    return {
                      ...common,
                      left: isRightCollapsed ? 'calc(100vw - 370px)' : 'calc(100vw - 670px)',
                      top: '180px',
                      transform: 'translate(0, 0)',
                    };
                  case 'submit-intel':
                    return {
                      ...common,
                      left: 'calc(100vw - 340px)',
                      top: '100px',
                      transform: 'translate(0, 0)',
                    };
                  default:
                    return common;
                }
              })();

              const arrowStyle: React.CSSProperties = (() => {
                const common: React.CSSProperties = {
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                };

                if (isMobile) {
                  return { display: 'none' };
                }

                switch (currentStep.placement) {
                  case 'timeline-button':
                    return {
                      ...common,
                      top: '-10px',
                      left: '158px',
                      borderWidth: '0 8px 10px 8px',
                      borderColor: `transparent transparent ${tooltipTheme.bg} transparent`,
                    };
                  case 'codex-button':
                    return {
                      ...common,
                      top: '-10px',
                      left: '242px',
                      borderWidth: '0 8px 10px 8px',
                      borderColor: `transparent transparent ${tooltipTheme.bg} transparent`,
                    };
                  case 'left-sidebar':
                    return {
                      ...common,
                      left: '-10px',
                      top: '32px',
                      borderWidth: '8px 10px 8px 0',
                      borderColor: `transparent ${tooltipTheme.bg} transparent transparent`,
                    };
                  case 'right-sidebar':
                    return {
                      ...common,
                      right: '-10px',
                      top: '32px',
                      borderWidth: '8px 0 8px 10px',
                      borderColor: `transparent transparent transparent ${tooltipTheme.bg}`,
                    };
                  case 'timeline':
                    return {
                      ...common,
                      bottom: '-10px',
                      left: '162px',
                      borderWidth: '10px 8px 0 8px',
                      borderColor: `${tooltipTheme.bg} transparent transparent transparent`,
                    };
                  case 'submit-intel':
                    return {
                      ...common,
                      top: '-10px',
                      right: '63px',
                      borderWidth: '0 8px 10px 8px',
                      borderColor: `transparent transparent ${tooltipTheme.bg} transparent`,
                    };
                  default:
                    return { display: 'none' };
                }
              })();

              const handleClose = () => {
                setOnboardingStep(null);
                localStorage.setItem('mtrh_onboarding_completed', 'true');
              };

              const handleNext = () => {
                if (onboardingStep === onboardingSteps.length - 1) {
                  handleClose();
                } else {
                  setOnboardingStep(prev => prev! + 1);
                }
              };

              return (
                <div style={tooltipStyle}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      width: '100%',
                      background: tooltipTheme.bg,
                      border: `2px solid ${tooltipTheme.border}`,
                      borderRadius: '16px',
                      padding: '24px',
                      color: tooltipTheme.text,
                      fontFamily: '"Space Mono", monospace',
                      boxSizing: 'border-box',
                      position: 'relative',
                      boxShadow: isMapDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.3)',
                      overflow: 'hidden'
                    }}
                    role="dialog"
                    aria-labelledby="tour-title"
                  >
                    {/* Arrow Indicator */}
                    <div style={arrowStyle} />

                    <motion.div
                      key={`step-text-${onboardingStep}`}
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <h3 
                        id="tour-title"
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          borderBottom: `1px solid ${tooltipTheme.borderLight}`,
                          paddingBottom: '8px',
                          margin: '0 0 12px 0',
                          color: tooltipTheme.text,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{currentStep.title}</span>
                        <span style={{ fontSize: '9px', color: tooltipTheme.textDim, fontWeight: 'normal' }}>
                          {onboardingStep + 1} / {onboardingSteps.length}
                        </span>
                      </h3>

                      <p 
                        style={{
                          fontSize: '10px',
                          lineHeight: '1.6',
                          color: tooltipTheme.textDim,
                          margin: '0 0 20px 0',
                          textAlign: 'left'
                        }}
                      >
                        {currentStep.content}
                      </p>
                    </motion.div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={handleClose}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: tooltipTheme.textDim,
                          fontSize: '9px',
                          fontFamily: '"Space Mono", monospace',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          padding: '4px 0',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = tooltipTheme.text; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = tooltipTheme.textDim; }}
                      >
                        Skip Guide
                      </button>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {onboardingStep > 0 && (
                          <button
                            onClick={() => setOnboardingStep(prev => prev! - 1)}
                            style={{
                              background: 'transparent',
                              color: tooltipTheme.text,
                              border: `1px solid ${tooltipTheme.border}`,
                              padding: '0 16px',
                              height: '32px',
                              fontSize: '9px',
                              fontFamily: '"Space Mono", monospace',
                              fontWeight: 700,
                              cursor: 'pointer',
                              borderRadius: '16px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxSizing: 'border-box',
                              transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                          >
                            Back
                          </button>
                        )}

                        <button
                          onClick={handleNext}
                          style={{
                            background: tooltipTheme.buttonBg,
                            color: tooltipTheme.buttonText,
                            border: `1px solid ${tooltipTheme.buttonBorder}`,
                            padding: '0 16px',
                            height: '32px',
                            fontSize: '9px',
                            fontFamily: '"Space Mono", monospace',
                            fontWeight: 700,
                            cursor: 'pointer',
                            borderRadius: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box',
                            transition: 'opacity 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                        >
                          {onboardingStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })()
          }
          </>
        )}
      </AnimatePresence>
    </>
  );
}
