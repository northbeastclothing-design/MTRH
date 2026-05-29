import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIMELINE_ITEMS, TimelineItem } from './timelineData';
import { RotateCcw } from 'lucide-react';

interface TimelinePageProps {
  theme: {
    bg: string;
    bgTransparent: string;
    text: string;
    textDim: string;
    border: string;
    borderLight: string;
    invert: string;
  };
  isMapDarkMode: boolean;
}

const ERAS_CONFIG = [
  {
    id: 'sumerian-antediluvian',
    name: 'Sumerian Antediluvian',
    start: -245000,
    end: -2000,
    color: '#C6986D', // Clay Bronze
    icon: '/icons/icon-ancient-texts.svg',
    layer: 'sumerian-kings',
    desc: 'Legendary pre-flood reigns.'
  },
  {
    id: 'biblical-patriarchs',
    name: 'Biblical Patriarchs',
    start: -4100,
    end: -1600,
    color: '#ECCE81', // Gold
    icon: '/icons/icon-giants.svg',
    layer: 'biblical-patriarchs',
    desc: 'Genesis genealogy and patriarch lifespans.'
  },
  {
    id: 'greek-myths',
    name: 'Greek Myths',
    start: -1700,
    end: -700,
    color: '#AFFFEC', // Aquamarine
    icon: '/icons/icon-cave-drawings.svg',
    layer: 'greek-mythology',
    desc: 'Greek mythological dates calculated by ancient chronologists.'
  },
  {
    id: 'kingdom-classical',
    name: 'Kingdom & Classical',
    start: -1100,
    end: 100,
    color: '#FFABA6', // Light Coral
    icon: '/icons/icon-timeline.svg',
    layer: 'biblical-events',
    desc: 'Scriptural events, exiles, and historical kingdoms.'
  }
];

export default function TimelinePage({ theme, isMapDarkMode }: TimelinePageProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Viewport states: start and end year
  const [viewStart, setViewStart] = useState(-4100);
  const [viewEnd, setViewEnd] = useState(-1600);
  
  // Active Eras state (merged layers)
  const [activeEras, setActiveEras] = useState<Record<string, boolean>>({
    'sumerian-antediluvian': true,
    'biblical-patriarchs': true,
    'greek-myths': true,
    'kingdom-classical': true
  });
  
  // Dropdown open states
  const [openDropdownEra, setOpenDropdownEra] = useState<string | null>(null);

  // Hover & selection states
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startViewStart, setStartViewStart] = useState(0);

  const span = viewEnd - viewStart;

  // Pre-cluster and sort timeline items by era to avoid React Hook loop violations
  const eraItemsMap = useMemo(() => {
    const map: Record<string, TimelineItem[]> = {};
    ERAS_CONFIG.forEach(era => {
      map[era.id] = TIMELINE_ITEMS
        .filter(item => item.layer === era.layer)
        .sort((a, b) => a.start - b.start);
    });
    return map;
  }, []);

  // Format years nicely (e.g. 4,004 BC, 30 AD)
  const formatYear = (year: number) => {
    const absYear = Math.round(Math.abs(year));
    const formattedAbs = absYear.toLocaleString();
    return year < 0 ? `${formattedAbs} BC` : `${formattedAbs} AD`;
  };

  // Helper to trigger smooth viewport animation (horizontal pan)
  const animateViewport = (targetStart: number, targetEnd: number) => {
    const startTime = performance.now();
    const startS = viewStart;
    const startE = viewEnd;
    const duration = 500; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setViewStart(startS + (targetStart - startS) * ease);
      setViewEnd(startE + (targetEnd - startE) * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Helper to scroll vertically to an Era's section
  const scrollToEraGroup = (eraLayerId: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setTimeout(() => {
      const eraElement = container.querySelector(`[data-era-group="${eraLayerId}"]`);
      if (eraElement) {
        const topPos = (eraElement as HTMLElement).offsetTop;
        const startScroll = container.scrollTop;
        const scrollDiff = topPos - startScroll;
        const startTime = performance.now();
        const duration = 500;

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          container.scrollTop = startScroll + scrollDiff * ease;

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      }
    }, 50); // Small timeout to allow active state DOM updates
  };

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setStartX(e.clientX);
    setStartViewStart(viewStart);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const deltaX = e.clientX - startX;
    const viewportWidth = scrollContainerRef.current.clientWidth;
    const yearsPerPixel = span / viewportWidth;
    const deltaYears = deltaX * yearsPerPixel;
    
    const newStart = startViewStart - deltaYears;
    const currentSpan = viewEnd - viewStart;
    
    // Bounds clamping
    const clampedStart = Math.max(-250000, Math.min(2000, newStart));
    
    setViewStart(clampedStart);
    setViewEnd(clampedStart + currentSpan);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Manual zoom helper
  const handleZoom = (factor: number) => {
    const centerYear = viewStart + span / 2;
    const newSpan = Math.max(50, Math.min(250000, span * factor));
    setViewStart(centerYear - newSpan / 2);
    setViewEnd(centerYear + newSpan / 2);
  };

  // Reset viewport to default
  const handleReset = () => {
    animateViewport(-4100, -1600);
    scrollToEraGroup('biblical-patriarchs');
  };

  // Get percentage offset from left of timeline for a given year
  const getX = (year: number) => {
    return ((year - viewStart) / span) * 100;
  };

  // Track allocation algorithm per layer to stack items dynamically and prevent overlap
  const allocatedTracksByLayer = useMemo(() => {
    const results: Record<string, { endYear: number; items: TimelineItem[] }[]> = {};
    
    ERAS_CONFIG.forEach(era => {
      if (!activeEras[era.id]) {
        results[era.layer] = [];
        return;
      }
      
      const layerItems = TIMELINE_ITEMS.filter(item => item.layer === era.layer);
      // Sort by start year
      const sorted = [...layerItems].sort((a, b) => a.start - b.start);
      
      const tracks: { endYear: number; items: TimelineItem[] }[] = [];
      const bufferYears = Math.max(1, span * 0.045); // Buffer to separate overlapping names
      
      sorted.forEach(item => {
        const itemStart = item.start;
        const itemEnd = item.type === 'lifespan' ? (item.end ?? item.start) : (item.start + bufferYears);
        
        let assigned = false;
        for (let i = 0; i < tracks.length; i++) {
          const gap = span * 0.02; // Gap between elements in same track
          if (tracks[i].endYear + gap < itemStart) {
            tracks[i].items.push(item);
            tracks[i].endYear = itemEnd;
            assigned = true;
            break;
          }
        }
        
        if (!assigned) {
          tracks.push({
            endYear: itemEnd,
            items: [item]
          });
        }
      });
      
      results[era.layer] = tracks;
    });
    
    return results;
  }, [activeEras, viewStart, viewEnd, span]);

  // Compute exact y-offsets for items to draw SVG connectors
  const trackOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let currentY = 0;
    const headerHeight = 36;
    const rowHeight = 36;
    const padding = 16;
    
    ERAS_CONFIG.forEach(era => {
      if (!activeEras[era.id]) return;
      
      currentY += headerHeight; // Add layer header space
      
      const tracks = allocatedTracksByLayer[era.layer] || [];
      tracks.forEach((track, trackIdx) => {
        track.items.forEach(item => {
          offsets[item.id] = currentY + trackIdx * rowHeight + rowHeight / 2;
        });
      });
      
      currentY += tracks.length * rowHeight + padding;
    });
    
    return { offsets, totalHeight: currentY };
  }, [allocatedTracksByLayer, activeEras]);

  // Generate Year Ruler Tick Marks
  const ticks = useMemo(() => {
    const list = [];
    let majorInterval = 1000;
    let mediumInterval = 500;
    let minorInterval = 100;

    if (span > 150000) {
      majorInterval = 50000; mediumInterval = 25000; minorInterval = 10000;
    } else if (span > 50000) {
      majorInterval = 10000; mediumInterval = 5000; minorInterval = 2000;
    } else if (span > 15000) {
      majorInterval = 5000; mediumInterval = 2500; minorInterval = 1000;
    } else if (span > 5000) {
      majorInterval = 1000; mediumInterval = 500; minorInterval = 100;
    } else if (span > 1500) {
      majorInterval = 500; mediumInterval = 250; minorInterval = 50;
    } else if (span > 500) {
      majorInterval = 100; mediumInterval = 50; minorInterval = 10;
    } else if (span > 150) {
      majorInterval = 50; mediumInterval = 25; minorInterval = 5;
    } else {
      majorInterval = 10; mediumInterval = 5; minorInterval = 1;
    }

    // Generate round values starting from a multiple of minorInterval
    const firstTick = Math.ceil(viewStart / minorInterval) * minorInterval;
    for (let y = firstTick; y <= viewEnd; y += minorInterval) {
      list.push(y);
    }

    return { list, majorInterval, mediumInterval };
  }, [viewStart, viewEnd, span]);

  // Handle Item Selection from Dropdown Popovers
  const handleItemSelect = (item: TimelineItem, era: typeof ERAS_CONFIG[0]) => {
    // 1. Center the timeline viewport horizontally on the item
    const itemSpan = item.type === 'lifespan' ? Math.abs((item.end ?? item.start) - item.start) : 0;
    const padding = Math.max(100, itemSpan * 1.5);
    const targetStart = item.start - padding;
    const targetEnd = (item.end ?? item.start) + padding;
    animateViewport(targetStart, targetEnd);
    
    // 2. Make sure this era is toggled ON
    if (!activeEras[era.id]) {
      setActiveEras(p => ({ ...p, [era.id]: true }));
    }

    // 3. Scroll vertically to the era group
    scrollToEraGroup(era.layer);
    
    // 4. Select item and show its detail card
    setSelectedItem(item);
    
    // 5. Close popovers
    setOpenDropdownEra(null);
  };

  // Find hovered item object
  const hoveredItem = useMemo(() => {
    if (!hoveredItemId) return null;
    return TIMELINE_ITEMS.find(x => x.id === hoveredItemId) || null;
  }, [hoveredItemId]);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownEra(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, color: theme.text, overflow: 'hidden' }}>
      
      {/* TIMELINE VIEWPORT SCROLLER (TOP/CENTER) */}
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{
          flex: 1,
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        <div style={{ minWidth: '100%', height: `${Math.max(400, trackOffsets.totalHeight)}px`, position: 'relative' }}>
          
          {/* TIMELINE AXIS BACKGROUND / GRIDS */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {ticks.list.map(y => {
              const xPos = getX(y);
              if (xPos < 0 || xPos > 100) return null;
              const isMajor = y % ticks.majorInterval === 0;
              return (
                <div 
                  key={y}
                  style={{
                    position: 'absolute',
                    left: `${xPos}%`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    borderLeft: isMajor 
                      ? `1px dashed ${isMapDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` 
                      : `1px dotted ${isMapDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`
                  }}
                />
              );
            })}
          </div>

          {/* LAYER TRACKS */}
          <div style={{ position: 'relative', zIndex: 5, padding: '0 0 40px 0' }}>
            {ERAS_CONFIG.map(era => {
              if (!activeEras[era.id]) return null;
              
              const tracks = allocatedTracksByLayer[era.layer] || [];
              
              return (
                <div 
                  key={era.id} 
                  data-era-group={era.layer}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  {/* Layer Header */}
                  <div style={{ 
                    height: '36px', 
                    padding: '0 24px', 
                    borderBottom: `1px solid ${theme.borderLight}`, 
                    background: isMapDarkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(245, 245, 245, 0.8)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    pointerEvents: 'auto'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: era.color }} />
                    <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', color: theme.text }}>
                      {era.name}
                    </span>
                  </div>
                  
                  {/* Tracks */}
                  {tracks.map((track, trackIdx) => (
                    <div 
                      key={trackIdx} 
                      style={{ 
                        height: '36px', 
                        position: 'relative', 
                        borderBottom: `1px solid ${isMapDarkMode ? '#111' : '#f5f5f5'}`
                      }}
                    >
                      {track.items.map(item => {
                        const xStart = getX(item.start);
                        const xEnd = item.type === 'lifespan' ? getX(item.end ?? item.start) : xStart;
                        const width = Math.max(12, xEnd - xStart);
                        const isHovered = hoveredItemId === item.id;
                        
                        // Check genealogy highlights
                        const isHighlight = hoveredItem && (
                          hoveredItem.id === item.id || 
                          hoveredItem.fatherId === item.id || 
                          item.fatherId === hoveredItem.id
                        );

                        if (item.type === 'lifespan') {
                          return (
                            <div
                              key={item.id}
                              onMouseEnter={() => setHoveredItemId(item.id)}
                              onMouseLeave={() => setHoveredItemId(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              style={{
                                position: 'absolute',
                                left: `${xStart}%`,
                                width: `${width}%`,
                                height: '24px',
                                top: '6px',
                                background: isHovered 
                                  ? `${era.color}40` 
                                  : (isHighlight ? `${era.color}25` : `${era.color}15`),
                                border: `1px solid ${isHovered || isHighlight ? era.color : theme.border}`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 12px',
                                boxSizing: 'border-box',
                                fontSize: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: isHovered || isHighlight ? theme.text : theme.textDim,
                                transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                                pointerEvents: 'auto',
                                overflow: 'hidden',
                                zIndex: isHovered ? 200 : (isHighlight ? 100 : 5)
                              }}
                            >
                              <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%' }}>
                                {item.name}
                              </span>
                            </div>
                          );
                        } else {
                          // Singular Event Circle
                          return (
                            <div
                              key={item.id}
                              onMouseEnter={() => setHoveredItemId(item.id)}
                              onMouseLeave={() => setHoveredItemId(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              style={{
                                position: 'absolute',
                                left: `${xStart}%`,
                                transform: 'translateX(-50%)',
                                height: '24px',
                                top: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                zIndex: isHovered ? 200 : 5
                              }}
                            >
                              {/* Glowing Dot */}
                              <div
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: era.color,
                                  border: `1px solid ${theme.border}`,
                                  boxShadow: isHovered ? `0 0 8px ${era.color}` : 'none',
                                  transition: 'all 0.15s ease'
                                }}
                              />
                              {/* Label text placed next to the dot */}
                              {(span < 8000 || isHovered) && (
                                <span style={{ 
                                  marginLeft: '8px', 
                                  fontSize: '9px', 
                                  fontWeight: 700, 
                                  color: isHovered ? era.color : theme.textDim,
                                  whiteSpace: 'nowrap',
                                  background: theme.bgTransparent,
                                  padding: '1px 4px',
                                  borderRadius: '2px',
                                  border: isHovered ? `1px solid ${era.color}` : 'none'
                                }}>
                                  {item.name}
                                </span>
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* SVG OVERLAY FOR GENEALOGICAL LINES */}
          <svg 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none', 
              zIndex: 100 
            }}
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#ECCE81" />
              </marker>
              <circle id="dot" cx="5" cy="5" r="3" fill="#ECCE81" />
            </defs>
            {hoveredItem && hoveredItem.layer === 'biblical-patriarchs' && (() => {
              const lines: React.ReactNode[] = [];
              const hoveredY = trackOffsets.offsets[hoveredItem.id];
              
              if (!hoveredY) return null;

              // 1. Line to Father (from Father's bar down to Son's start)
              if (hoveredItem.fatherId) {
                const father = TIMELINE_ITEMS.find(x => x.id === hoveredItem.fatherId);
                const fatherY = trackOffsets.offsets[hoveredItem.fatherId];
                if (father && fatherY) {
                  // Connect at the year of the son's birth (which is hoveredItem.start)
                  const birthX = getX(hoveredItem.start);
                  lines.push(
                    <g key={`father-${father.id}`}>
                      <line 
                        x1={`${birthX}%`} 
                        y1={fatherY} 
                        x2={`${birthX}%`} 
                        y2={hoveredY} 
                        stroke="#ECCE81" 
                        strokeWidth="2" 
                        strokeDasharray="4,4"
                      />
                      <circle cx={`${birthX}%`} cy={fatherY} r="4" fill="#ECCE81" stroke={theme.border} strokeWidth="1" />
                      <circle cx={`${birthX}%`} cy={hoveredY} r="3" fill="#ECCE81" />
                    </g>
                  );
                }
              }

              // 2. Lines to Children (from Hovered bar down to Children's start)
              const children = TIMELINE_ITEMS.filter(x => x.fatherId === hoveredItem.id);
              children.forEach(child => {
                const childY = trackOffsets.offsets[child.id];
                if (childY) {
                  const birthX = getX(child.start);
                  lines.push(
                    <g key={`child-${child.id}`}>
                      <line 
                        x1={`${birthX}%`} 
                        y1={hoveredY} 
                        x2={`${birthX}%`} 
                        y2={childY} 
                        stroke="#ECCE81" 
                        strokeWidth="2" 
                        strokeDasharray="4,4"
                      />
                      <circle cx={`${birthX}%`} cy={hoveredY} r="4" fill="#ECCE81" stroke={theme.border} strokeWidth="1" />
                      <circle cx={`${birthX}%`} cy={childY} r="3" fill="#ECCE81" />
                    </g>
                  );
                }
              });

              return lines;
            })()}
          </svg>

        </div>

        {/* DETAILS OVERLAY CARD */}
        <AnimatePresence>
          {selectedItem && (() => {
            const era = ERAS_CONFIG.find(e => e.layer === selectedItem.layer) || ERAS_CONFIG[0];
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                style={{
                  position: 'fixed',
                  bottom: '160px', // Stays above the bottom controls bar
                  right: '40px',
                  width: '320px',
                  background: isMapDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  border: `3px solid ${theme.border}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  padding: '16px',
                  zIndex: 1000,
                  fontFamily: '"Space Mono", monospace',
                  pointerEvents: 'auto',
                  color: theme.text
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: era.color }}>
                    {era.name}
                  </span>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    style={{ 
                      background: 'transparent', 
                      color: theme.text, 
                      cursor: 'pointer', 
                      padding: '2px 6px',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '2px'
                    }}
                  >
                    ESC
                  </button>
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>{selectedItem.name}</h3>
                <div style={{ fontSize: '9px', color: theme.textDim, marginBottom: '12px', fontFamily: '"Space Mono", monospace' }}>
                  {selectedItem.type === 'lifespan' ? (
                    <span>LIFESPAN/REIGN: {formatYear(selectedItem.start)} – {formatYear(selectedItem.end ?? selectedItem.start)} ({Math.abs((selectedItem.end ?? selectedItem.start) - selectedItem.start)} years)</span>
                  ) : (
                    <span>EVENT YEAR: {formatYear(selectedItem.start)}</span>
                  )}
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '10px', lineHeight: '16px', color: theme.text }}>
                  {selectedItem.description}
                </p>
                {selectedItem.source && (
                  <div style={{ fontSize: '9px', color: theme.textDim, borderTop: `1px dashed ${theme.borderLight}`, paddingTop: '8px', textTransform: 'uppercase' }}>
                    SOURCE: {selectedItem.source}
                  </div>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>

      </div>

      {/* LOCKED YEAR RULER (BOTTOM) */}
      <div style={{ 
        height: '42px', 
        borderTop: `1px solid ${theme.border}`,
        background: isMapDarkMode ? '#000000' : '#ffffff',
        zIndex: 100, 
        position: 'relative',
        pointerEvents: 'none',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {ticks.list.map(y => {
          const xPos = getX(y);
          if (xPos < 0 || xPos > 100) return null;
          const isMajor = y % ticks.majorInterval === 0;
          const isMedium = y % ticks.mediumInterval === 0;
          
          return (
            <React.Fragment key={y}>
              <div style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: 0,
                height: isMajor ? '16px' : (isMedium ? '10px' : '6px'),
                width: '1px',
                background: isMajor ? theme.text : (isMapDarkMode ? '#444' : '#ccc')
              }} />
              
              {isMajor && (
                <div style={{
                  position: 'absolute',
                  left: `${xPos}%`,
                  top: '18px',
                  transform: 'translateX(-50%)',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  fontFamily: '"Space Mono", monospace',
                  color: theme.text
                }}>
                  {formatYear(y)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* BOTTOM CONTROLS PANEL (BOTTOM BAR) */}
      <div 
        style={{
          height: '130px',
          background: theme.bg,
          borderTop: `1px solid ${theme.border}`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 200,
          boxSizing: 'border-box',
          position: 'relative',
          pointerEvents: 'auto'
        }}
      >
        {/* Left: Eras toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: theme.textDim, textTransform: 'uppercase', letterSpacing: '1px', marginRight: '4px' }}>
            Eras:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {ERAS_CONFIG.map(era => {
              const isActive = activeEras[era.id];
              const isOpen = openDropdownEra === era.id;
              
              // Get all items in this era to populate the dropdown
              const eraItems = eraItemsMap[era.id] || [];

              return (
                <div 
                  key={era.id} 
                  style={{ position: 'relative' }}
                  onClick={e => e.stopPropagation()} // Stop bubbling to window click handler
                >
                  {/* Era selector button matching map layers styling */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0 4px 0 0', 
                      height: '32px',
                      cursor: 'pointer', 
                      background: isActive ? theme.bg : (isMapDarkMode ? '#1a1a1a' : '#EFEFEF'),
                      border: `1px solid ${theme.border}`,
                      borderRadius: '16px',
                      boxSizing: 'border-box',
                      color: theme.text,
                      transition: 'background 0.3s ease-in-out'
                    }}
                    onClick={() => {
                      animateViewport(era.start, era.end);
                      scrollToEraGroup(era.layer);
                    }}
                  >
                    {/* Placeholder Icon */}
                    <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={era.icon} 
                        onError={(e) => { e.currentTarget.src = '/icons/icon-cave-drawings.svg'; }}
                        style={{ width: '30px', height: '30px' }} 
                        alt={era.name} 
                      />
                    </div>
                    
                    {/* Label */}
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: '700', 
                      fontFamily: '"Space Mono", monospace', 
                      opacity: isActive ? 1 : 0.5,
                      transition: 'opacity 0.3s ease-in-out',
                      marginLeft: '4px',
                      marginRight: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {era.name}
                    </span>
                    
                    {/* Action buttons on the right side of the pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }} onClick={e => e.stopPropagation()}>
                      {/* Visibility Toggle Eye */}
                      <button 
                        onClick={() => {
                          setActiveEras(p => ({ ...p, [era.id]: !p[era.id] }));
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <img 
                          src={isActive 
                            ? "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-eye-open.svg" 
                            : "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-eye-closed.svg"
                          } 
                          style={{ width: '31px', height: '30px', filter: theme.invert }} 
                          alt="toggle visibility" 
                        />
                      </button>
                      
                      {/* Arrow Dropdown Toggle */}
                      <button 
                        onClick={() => {
                          setOpenDropdownEra(prev => prev === era.id ? null : era.id);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <img 
                          src={isOpen 
                            ? "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-arrow-up.svg" 
                            : "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-arrow-down.svg"
                          } 
                          style={{ width: '30px', height: '30px', filter: theme.invert }} 
                          alt="expand items" 
                        />
                      </button>
                    </div>
                  </div>

                  {/* POPOVER LISTING ITEMS */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          bottom: '45px', // Sit cleanly above bottom controls bar
                          left: '0px',
                          width: '240px',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          background: theme.bg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '8px',
                          boxShadow: '0 -10px 25px rgba(0,0,0,0.15)',
                          zIndex: 1000,
                          fontFamily: '"Space Mono", monospace',
                          pointerEvents: 'auto',
                          textAlign: 'left'
                        }}
                        className="custom-scrollbar"
                      >
                        <div style={{ 
                          padding: '6px 12px', 
                          borderBottom: `1px solid ${theme.borderLight}`, 
                          fontSize: '8px', 
                          color: theme.textDim, 
                          fontWeight: 'bold', 
                          textTransform: 'uppercase',
                          background: isMapDarkMode ? '#111' : '#f5f5f5',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1
                        }}>
                          Go to item:
                        </div>
                        {eraItems.length === 0 ? (
                          <div style={{ padding: '12px', fontSize: '10px', color: theme.textDim, textAlign: 'center' }}>
                            Era is currently hidden.
                          </div>
                        ) : (
                          eraItems.map(item => (
                            <div 
                              key={item.id}
                              onClick={() => handleItemSelect(item, era)}
                              style={{
                                padding: '8px 12px',
                                fontSize: '10px',
                                cursor: 'pointer',
                                borderBottom: `1px solid ${theme.borderLight}`,
                                color: theme.text,
                                transition: 'background 0.15s ease',
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '8px'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = `${era.color}20`; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                              <span style={{ fontSize: '8px', color: theme.textDim, alignSelf: 'center', whiteSpace: 'nowrap' }}>
                                {formatYear(item.start)}
                              </span>
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Zoom controls styled exactly like the map page timeline zoom bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <img 
            src="/icons/icon-zoom-out.svg" 
            onClick={() => handleZoom(1.3)}
            style={{ width: '24px', height: '24px', filter: theme.invert, cursor: 'pointer', opacity: span >= 250000 ? 0.3 : 1 }} 
            title="Zoom Out"
            alt="zoom out" 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', width: '120px' }}>
            <input
              type="range"
              min="50"
              max="250000"
              value={Math.round(span)}
              onChange={(e) => {
                const newSpan = parseInt(e.target.value, 10);
                const centerYear = viewStart + span / 2;
                setViewStart(centerYear - newSpan / 2);
                setViewEnd(centerYear + newSpan / 2);
              }}
              style={{
                width: '100%',
                accentColor: theme.text,
                cursor: 'pointer',
                background: theme.borderLight
              }}
            />
            <span style={{ fontSize: '7px', color: theme.textDim, textAlign: 'center', marginTop: '2px', letterSpacing: '0.5px' }}>
              SPAN: {Math.round(span).toLocaleString()} YEARS
            </span>
          </div>

          <img 
            src="/icons/icon-zoom-in.svg" 
            onClick={() => handleZoom(0.7)}
            style={{ width: '24px', height: '24px', filter: theme.invert, cursor: 'pointer', opacity: span <= 50 ? 0.3 : 1 }} 
            title="Zoom In"
            alt="zoom in" 
          />

          <button
            onClick={handleReset}
            title="Reset View"
            style={{
              width: '24px',
              height: '24px',
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              borderRadius: '4px',
              padding: 0
            }}
          >
            <RotateCcw size={10} strokeWidth={2.5} />
          </button>
        </div>

      </div>

    </div>
  );
}
