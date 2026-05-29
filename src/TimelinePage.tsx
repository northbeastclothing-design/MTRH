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
    id: 'biblical-patriarchs',
    name: 'Biblical Bloodlines',
    start: -4100,
    end: -1600,
    color: '#90C2FF', // Blue
    icon: '/icons/icon-biblical-bloodlines.svg',
    layer: 'biblical-patriarchs',
    desc: 'Genesis genealogy and patriarch lifespans.'
  },
  {
    id: 'kingdom-classical',
    name: 'Biblical Events',
    start: -1100,
    end: 100,
    color: '#91FFC4', // Green
    icon: '/icons/icon-biblical-bloodlines-1.svg',
    layer: 'biblical-events',
    desc: 'Scriptural events, exiles, and historical kingdoms.'
  },
  {
    id: 'enochian-lore',
    name: 'Enochian Lore',
    start: -3500,
    end: -2348,
    color: '#FF9F63', // Orange
    icon: '/icons/icon-enochian-lore.svg',
    layer: 'enochian-lore',
    desc: 'Ascension of Enoch, descent of the 200 Watchers, teaching of forbidden arts, and the Nephilim giants.'
  },
  {
    id: 'sumerian-antediluvian',
    name: 'Sumerian Kings List',
    start: -245000,
    end: -2000,
    color: '#FF9BE1', // Pink
    icon: '/icons/icon-sumerian-kings-list.svg',
    layer: 'sumerian-kings',
    desc: 'Legendary pre-flood reigns.'
  },
  {
    id: 'greek-myths',
    name: 'Greek Mythology',
    start: -1700,
    end: -700,
    color: '#FFF96A', // Yellow
    icon: '/icons/icon-greek-mythology.svg',
    layer: 'greek-mythology',
    desc: 'Greek mythological dates calculated by ancient chronologists.'
  },
  {
    id: 'merovingian-bloodlines',
    name: 'Merovingian Bloodlines',
    start: 400,
    end: 800,
    color: '#B297FF', // Light Purple
    icon: '/icons/icon-merovingian-bloodlines.svg',
    layer: 'merovingian-bloodlines',
    desc: 'Salian Frankish kings and holy bloodlines.'
  },
  {
    id: 'royal-bloodlines',
    name: 'Royal Bloodlines',
    start: 750,
    end: 2026,
    color: '#FF9395', // Rose/Red
    icon: '/icons/icon-royal-bloodlines.svg',
    layer: 'royal-bloodlines',
    desc: 'Charlemagne, Alfred the Great, and British Monarchs down to King Charles III.'
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
    'kingdom-classical': true,
    'merovingian-bloodlines': true,
    'royal-bloodlines': true,
    'enochian-lore': true
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

  // Stacked layout tracking for Bottom Controls Panel
  const [isErasStacked, setIsErasStacked] = useState(false);
  const erasContainerRef = useRef<HTMLDivElement>(null);

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
    const clampedStart = Math.max(-250000, Math.min(2100, newStart));
    
    setViewStart(clampedStart);
    setViewEnd(clampedStart + currentSpan);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Manual zoom helper
  const handleZoom = (factor: number) => {
    const centerYear = viewStart + span / 2;
    const newSpan = Math.max(50, Math.min(252100, span * factor));
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
      const eraSpan = Math.abs(era.end - era.start);
      const gap = eraSpan * 0.04; // Static gap per era (increased to prevent horizontal overlapping)
      
      sorted.forEach(item => {
        const itemStart = item.start;
        // Reserving more space for point events based on their label text length to avoid horizontal overlap
        const itemEnd = item.type === 'lifespan' 
          ? (item.end ?? item.start) 
          : (item.start + Math.max(eraSpan * 0.06, item.name.length * 0.01 * eraSpan));
        
        let assigned = false;
        for (let i = 0; i < tracks.length; i++) {
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
  }, [activeEras]);

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
    
    return { offsets, totalHeight: currentY + 160 };
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

  // Handle Item Selection (from either dropdown or clicking directly on the timeline tracks)
  const handleItemClick = (item: TimelineItem) => {
    // 1. Center the timeline viewport horizontally on the item, preserving zoom span or expanding if too narrow
    const itemCenter = item.start + (item.type === 'lifespan' ? (item.end ?? item.start) - item.start : 0) / 2;
    const itemLength = item.type === 'lifespan' ? Math.abs((item.end ?? item.start) - item.start) : 0;
    const targetSpan = Math.max(span, itemLength * 1.5);
    const targetStart = itemCenter - targetSpan / 2;
    const targetEnd = itemCenter + targetSpan / 2;
    animateViewport(targetStart, targetEnd);
    
    // 2. Make sure this era is toggled ON
    const era = ERAS_CONFIG.find(e => e.layer === item.layer);
    if (era && !activeEras[era.id]) {
      setActiveEras(p => ({ ...p, [era.id]: true }));
    }
    
    // 3. Select item and show its detail card
    setSelectedItem(item);
    
    // 4. Close popovers
    setOpenDropdownEra(null);
  };

  const handleItemSelect = (item: TimelineItem, era: typeof ERAS_CONFIG[0]) => {
    handleItemClick(item);
  };

  // Find hovered item object
  const hoveredItem = useMemo(() => {
    if (!hoveredItemId) return null;
    return TIMELINE_ITEMS.find(x => x.id === hoveredItemId) || null;
  }, [hoveredItemId]);

  // Recursively find all ancestors and descendants of the hovered item
  const highlightedIds = useMemo(() => {
    if (!hoveredItemId) return new Set<string>();
    const visited = new Set<string>();
    
    const addAncestors = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const item = TIMELINE_ITEMS.find(x => x.id === id);
      if (!item) return;
      if (item.fatherId) addAncestors(item.fatherId);
      if (item.motherId) addAncestors(item.motherId);
      if (item.spouseId) visited.add(item.spouseId);
    };

    const addDescendants = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const item = TIMELINE_ITEMS.find(x => x.id === id);
      if (!item) return;
      
      const children = TIMELINE_ITEMS.filter(x => x.fatherId === id || x.motherId === id);
      children.forEach(c => addDescendants(c.id));
      if (item.spouseId) visited.add(item.spouseId);
    };

    addAncestors(hoveredItemId);
    addDescendants(hoveredItemId);
    return visited;
  }, [hoveredItemId]);

  const highlightColor = useMemo(() => {
    if (!hoveredItem) return '#90C2FF';
    return ERAS_CONFIG.find(e => e.layer === hoveredItem.layer)?.color || '#90C2FF';
  }, [hoveredItem]);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownEra(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Stacked layout observer for the bottom controls bar
  useEffect(() => {
    if (!erasContainerRef.current) return;
    const checkStacked = () => {
      if (erasContainerRef.current) {
        // A single row of buttons is 32px height. If height > 40px, it has wrapped to 2 or more lines.
        setIsErasStacked(erasContainerRef.current.offsetHeight > 40);
      }
    };
    
    checkStacked();
    
    // Create ResizeObserver to monitor the container height changes reactively
    const observer = new ResizeObserver(checkStacked);
    observer.observe(erasContainerRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Auto-center vertically on selection to prevent details card cutoff
  useEffect(() => {
    if (!selectedItem || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    
    const animId = requestAnimationFrame(() => {
      const itemY = trackOffsets.offsets[selectedItem.id];
      if (itemY === undefined) return;
      
      const placeBelow = itemY < 260;
      
      // Calculate target vertical center for item + card combination
      const targetCenterY = placeBelow ? itemY + 110 : itemY - 110;
      const viewportHeight = container.clientHeight;
      let targetScrollTop = targetCenterY - viewportHeight / 2;
      
      const maxScroll = container.scrollHeight - viewportHeight;
      targetScrollTop = Math.max(0, Math.min(maxScroll, targetScrollTop));
      
      const startScroll = container.scrollTop;
      const scrollDiff = targetScrollTop - startScroll;
      if (Math.abs(scrollDiff) < 2) return;
      
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
    });
    
    return () => cancelAnimationFrame(animId);
  }, [selectedItem, trackOffsets]);

  // highlightColor is defined above recursively based on hovered item

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, color: theme.text, overflow: 'hidden', borderTop: `1px solid ${theme.border}` }}>
      
      {/* TIMELINE VIEWPORT SCROLLER (TOP/CENTER) */}
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{
          flex: 1,
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
          <div style={{ position: 'relative', zIndex: 5, padding: '0 0 160px 0' }}>
            {ERAS_CONFIG.map(era => {
              if (!activeEras[era.id]) return null;
              
              const tracks = allocatedTracksByLayer[era.layer] || [];
              
              return (
                <div 
                  key={era.id} 
                  data-era-group={era.layer}
                  style={{ display: 'flex', flexDirection: 'column', paddingBottom: '16px' }}
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
                        const isSelected = selectedItem?.id === item.id;
                        
                        // Check genealogy highlights
                        const isHighlight = highlightedIds.has(item.id);

                        if (item.type === 'lifespan') {
                          return (
                            <div
                              key={item.id}
                              onMouseEnter={() => setHoveredItemId(item.id)}
                              onMouseLeave={() => setHoveredItemId(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(item);
                              }}
                              style={{
                                position: 'absolute',
                                left: `${xStart}%`,
                                width: `${width}%`,
                                height: '24px',
                                top: '6px',
                                background: isSelected
                                  ? `${era.color}e6`
                                  : (isHovered 
                                    ? `${era.color}99` 
                                    : (isHighlight ? `${era.color}77` : `${era.color}44`)),
                                border: isSelected
                                  ? `2px solid ${isMapDarkMode ? '#ffffff' : '#000000'}`
                                  : 'none',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 12px',
                                boxSizing: 'border-box',
                                fontSize: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: isMapDarkMode ? '#ffffff' : '#000000',
                                mixBlendMode: isMapDarkMode ? 'screen' : 'multiply',
                                boxShadow: isSelected ? `0 0 15px ${era.color}` : 'none',
                                transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                                pointerEvents: 'auto',
                                overflow: 'hidden',
                                zIndex: isSelected ? 300 : (isHovered ? 200 : (isHighlight ? 100 : 5))
                              }}
                            >
                              <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%' }}>
                                {item.name}
                              </span>
                            </div>
                          );
                        } else {
                          // Singular Event Circle with Hover & Selected Pill Backgrounds
                          const isHovered = hoveredItemId === item.id;
                          const isSelected = selectedItem?.id === item.id;
                          
                          return (
                            <div
                              key={item.id}
                              onMouseEnter={() => setHoveredItemId(item.id)}
                              onMouseLeave={() => setHoveredItemId(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(item);
                              }}
                              style={{
                                position: 'absolute',
                                left: `${xStart}%`,
                                height: '24px',
                                top: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                zIndex: isSelected ? 300 : (isHovered ? 200 : 5)
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: '24px',
                                  borderRadius: '12px',
                                  padding: (isHovered || isSelected) ? '0 12px' : '0',
                                  border: isSelected
                                    ? `2px solid ${isMapDarkMode ? '#ffffff' : '#000000'}`
                                    : 'none',
                                  boxShadow: isSelected ? `0 0 15px ${era.color}` : 'none',
                                  transition: 'all 0.15s ease',
                                  whiteSpace: 'nowrap',
                                  transform: (isHovered || isSelected) ? 'translateX(-18px)' : 'translateX(-6px)',
                                  position: 'relative'
                                }}
                              >
                                {/* Blended Background Sibling (isolated from text and dot) */}
                                {(isHovered || isSelected) && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      borderRadius: '12px',
                                      background: isSelected
                                        ? `${era.color}e6`
                                        : `${era.color}99`,
                                      mixBlendMode: isMapDarkMode ? 'screen' : 'multiply',
                                      zIndex: 0,
                                      pointerEvents: 'none'
                                    }}
                                  />
                                )}

                                {/* Dot */}
                                <div
                                  style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: (isSelected || isHovered) ? '#000000' : era.color,
                                    border: 'none',
                                    boxShadow: isSelected
                                      ? `0 0 10px 2px ${era.color}`
                                      : (isHovered ? `0 0 8px ${era.color}` : 'none'),
                                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                                    transition: 'all 0.15s ease',
                                    flexShrink: 0,
                                    position: 'relative',
                                    zIndex: 1
                                  }}
                                />

                                {/* Label text */}
                                {(span < 8000 || isHovered || isSelected) && (
                                  <span style={{ 
                                    marginLeft: '8px', 
                                    fontSize: '9px', 
                                    fontWeight: 700, 
                                    color: (isHovered || isSelected)
                                      ? '#000000'
                                      : (isMapDarkMode ? '#ffffff' : '#000000'),
                                    whiteSpace: 'nowrap',
                                    position: 'relative',
                                    zIndex: 1
                                  }}>
                                    {item.name}
                                  </span>
                                )}
                              </div>
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
                <path d="M 0 2 L 8 5 L 0 8 z" fill={highlightColor} />
              </marker>
              <circle id="dot" cx="5" cy="5" r="3" fill={highlightColor} />
            </defs>
            {hoveredItem && (
              hoveredItem.layer === 'biblical-patriarchs' ||
              hoveredItem.layer === 'merovingian-bloodlines' ||
              hoveredItem.layer === 'royal-bloodlines' ||
              hoveredItem.layer === 'enochian-lore'
            ) && (() => {
              const lines: React.ReactNode[] = [];
              
              highlightedIds.forEach(id => {
                const item = TIMELINE_ITEMS.find(x => x.id === id);
                if (!item) return;
                
                const itemY = trackOffsets.offsets[item.id];
                if (!itemY) return;

                // 1. Connection to Spouse (draw only once)
                if (item.spouseId && highlightedIds.has(item.spouseId)) {
                  if (item.id < item.spouseId) {
                    const spouse = TIMELINE_ITEMS.find(x => x.id === item.spouseId);
                    const spouseY = trackOffsets.offsets[item.spouseId];
                    if (spouse && spouseY) {
                      const connectYear = Math.max(item.start, spouse.start);
                      const connectX = getX(connectYear);
                      lines.push(
                        <g key={`spouse-${item.id}-${spouse.id}`}>
                          <line 
                            x1={`${connectX}%`} 
                            y1={itemY} 
                            x2={`${connectX}%`} 
                            y2={spouseY} 
                            stroke={highlightColor} 
                            strokeWidth="3" 
                          />
                          <circle cx={`${connectX}%`} cy={itemY} r="5" fill={highlightColor} stroke={theme.border} strokeWidth="1" />
                          <circle cx={`${connectX}%`} cy={spouseY} r="5" fill={highlightColor} stroke={theme.border} strokeWidth="1" />
                        </g>
                      );
                    }
                  }
                }

                // 2. Connection to Father
                if (item.fatherId && highlightedIds.has(item.fatherId)) {
                  const father = TIMELINE_ITEMS.find(x => x.id === item.fatherId);
                  const fatherY = trackOffsets.offsets[item.fatherId];
                  if (father && fatherY) {
                    const birthX = getX(item.start);
                    lines.push(
                      <g key={`father-${father.id}-${item.id}`}>
                        <line 
                          x1={`${birthX}%`} 
                          y1={fatherY} 
                          x2={`${birthX}%`} 
                          y2={itemY} 
                          stroke={highlightColor} 
                          strokeWidth="2" 
                          strokeDasharray="4,4"
                        />
                        <circle cx={`${birthX}%`} cy={fatherY} r="4" fill={highlightColor} stroke={theme.border} strokeWidth="1" />
                        <circle cx={`${birthX}%`} cy={itemY} r="3" fill={highlightColor} />
                      </g>
                    );
                  }
                }

                // 3. Connection to Mother
                if (item.motherId && highlightedIds.has(item.motherId)) {
                  const mother = TIMELINE_ITEMS.find(x => x.id === item.motherId);
                  const motherY = trackOffsets.offsets[item.motherId];
                  if (mother && motherY) {
                    const birthX = getX(item.start);
                    lines.push(
                      <g key={`mother-${mother.id}-${item.id}`}>
                        <line 
                          x1={`${birthX}%`} 
                          y1={motherY} 
                          x2={`${birthX}%`} 
                          y2={itemY} 
                          stroke={highlightColor} 
                          strokeWidth="2" 
                          strokeDasharray="4,4"
                        />
                        <circle cx={`${birthX}%`} cy={motherY} r="4" fill={highlightColor} stroke={theme.border} strokeWidth="1" />
                        <circle cx={`${birthX}%`} cy={itemY} r="3" fill={highlightColor} />
                      </g>
                    );
                  }
                }
              });

              return lines;
            })()}
          </svg>

          {/* DETAILS OVERLAY CARD */}
          <AnimatePresence>
            {selectedItem && (() => {
              const era = ERAS_CONFIG.find(e => e.layer === selectedItem.layer) || ERAS_CONFIG[0];
              const itemCenterYear = selectedItem.start + (selectedItem.type === 'lifespan' ? (selectedItem.end ?? selectedItem.start) - selectedItem.start : 0) / 2;
              const itemCenterPct = getX(itemCenterYear);
              const itemY = trackOffsets.offsets[selectedItem.id] || 100;
              const placeBelow = itemY < 260;

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

              return (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: 'absolute',
                    left: `${itemCenterPct}%`,
                    top: `${placeBelow ? itemY + 28 : itemY - 28}px`,
                    transform: placeBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
                    width: '320px',
                    zIndex: 1000,
                    pointerEvents: 'none'
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{
                      width: '100%',
                      background: tooltipTheme.bg,
                      border: `2px solid ${tooltipTheme.border}`,
                      borderRadius: '16px',
                      boxShadow: isMapDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.3)',
                      padding: '24px',
                      fontFamily: '"Space Mono", monospace',
                      pointerEvents: 'auto',
                      color: tooltipTheme.text,
                      boxSizing: 'border-box',
                      position: 'relative'
                    }}
                  >
                    {/* Arrow */}
                    <div style={{
                      position: 'absolute',
                      width: 0,
                      height: 0,
                      borderStyle: 'solid',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      ...(placeBelow ? {
                        top: '-10px',
                        borderWidth: '0 10px 10px 10px',
                        borderColor: `transparent transparent ${tooltipTheme.bg} transparent`
                      } : {
                        bottom: '-10px',
                        borderWidth: '10px 10px 0 10px',
                        borderColor: `${tooltipTheme.bg} transparent transparent transparent`
                      })
                    }} />

                    {/* Header (Era label and spacing) */}
                    <div style={{ 
                      fontSize: '9px', 
                      fontWeight: 'bold', 
                      letterSpacing: '2px', 
                      textTransform: 'uppercase', 
                      borderBottom: `1px solid ${tooltipTheme.borderLight}`, 
                      paddingBottom: '8px', 
                      margin: '0 0 12px 0', 
                      color: era.color,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{era.name}</span>
                    </div>

                    {/* Name */}
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {selectedItem.name}
                    </h3>

                    {/* Dates */}
                    <div style={{ fontSize: '9px', color: tooltipTheme.textDim, marginBottom: '16px' }}>
                      {selectedItem.type === 'lifespan' ? (
                        <span>LIFESPAN/REIGN: {formatYear(selectedItem.start)} – {formatYear(selectedItem.end ?? selectedItem.start)} ({Math.abs((selectedItem.end ?? selectedItem.start) - selectedItem.start)} years)</span>
                      ) : (
                        <span>EVENT YEAR: {formatYear(selectedItem.start)}</span>
                      )}
                    </div>

                    {/* Description */}
                    <p style={{ margin: '0 0 20px 0', fontSize: '10px', lineHeight: '1.6', color: tooltipTheme.textDim, textAlign: 'left' }}>
                      {selectedItem.description}
                    </p>

                    {/* Source and Close Button Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: selectedItem.source ? `1px dashed ${tooltipTheme.borderLight}` : 'none', paddingTop: selectedItem.source ? '12px' : '0' }}>
                      {selectedItem.source ? (
                        <span style={{ fontSize: '8px', color: tooltipTheme.textDim, textTransform: 'uppercase' }}>
                          SRC: {selectedItem.source}
                        </span>
                      ) : <div />}
                      
                      <button
                        onClick={() => setSelectedItem(null)}
                        style={{
                          background: tooltipTheme.buttonBg,
                          color: tooltipTheme.buttonText,
                          border: `1px solid ${tooltipTheme.buttonBorder}`,
                          padding: '6px 16px',
                          fontSize: '9px',
                          fontFamily: '"Space Mono", monospace',
                          fontWeight: 700,
                          cursor: 'pointer',
                          borderRadius: '16px',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

        </div>

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
          minHeight: '64px',
          height: 'auto',
          background: theme.bg,
          borderTop: `1px solid ${theme.border}`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          rowGap: '12px',
          columnGap: '24px',
          zIndex: 200,
          boxSizing: 'border-box',
          position: 'relative',
          pointerEvents: 'auto',
          flexShrink: 0
        }}
      >
        {/* Left: Eras toggles */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: theme.textDim, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px', marginRight: '4px', flexShrink: 0 }}>
            Eras:
          </span>
          <div ref={erasContainerRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'left' }}>
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
                        fontSize: '10px', 
                        fontWeight: '700', 
                        fontFamily: '"Space Mono", monospace', 
                        opacity: isActive ? 1 : 0.5,
                        transition: 'opacity 0.3s ease-in-out',
                        marginRight: '8px',
                        whiteSpace: 'nowrap'
                      }}>
                        {era.name}
                      </span>
                    </div>
                    
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
                          background: theme.bg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '8px',
                          boxShadow: '0 -10px 25px rgba(0,0,0,0.15)',
                          zIndex: 1000,
                          fontFamily: '"Space Mono", monospace',
                          pointerEvents: 'auto',
                          textAlign: 'left',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            maxHeight: '220px',
                            overflowY: 'auto',
                            width: '100%'
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
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Zoom controls styled exactly like the map page timeline zoom bar */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isErasStacked ? 'column' : 'row',
          alignItems: isErasStacked ? 'stretch' : 'flex-start', 
          gap: '12px', 
          flexWrap: 'wrap', 
          justifyContent: 'flex-end',
          marginLeft: 'auto'
        }}>
          {/* Zoom controls inline unit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <img 
              src="/icons/icon-zoom-out.svg" 
              onClick={() => handleZoom(1.3)}
              style={{ width: '24px', height: '24px', filter: theme.invert, cursor: 'pointer', opacity: span >= 252100 ? 0.3 : 1 }} 
              title="Zoom Out"
              alt="zoom out" 
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '120px', justifyContent: 'center' }}>
              <input
                type="range"
                min="0"
                max="252050"
                value={252100 - Math.round(span)}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const newSpan = 252100 - val;
                  const centerYear = viewStart + span / 2;
                  setViewStart(centerYear - newSpan / 2);
                  setViewEnd(centerYear + newSpan / 2);
                }}
                style={{
                  width: '100%',
                  height: '2px',
                  background: theme.text,
                  outline: 'none',
                  cursor: 'pointer',
                  margin: 0
                }}
                className="timeline-zoom-slider"
              />
              <span style={{ 
                position: 'absolute', 
                top: '12px', 
                fontSize: '7px', 
                color: theme.textDim, 
                textAlign: 'center', 
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap'
              }}>
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
          </div>

          <button
            onClick={handleReset}
            title="Reset View"
            style={{
              height: '32px',
              padding: '0 12px',
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              borderRadius: '16px',
              fontFamily: '"Space Mono", monospace',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              boxSizing: 'border-box'
            }}
          >
            <RotateCcw size={10} strokeWidth={2.5} />
            <span>Reset</span>
          </button>
        </div>

      </div>

    </div>
  );
}
