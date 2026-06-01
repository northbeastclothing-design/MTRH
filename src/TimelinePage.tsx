import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIMELINE_ITEMS, TimelineItem, TIMELINE_LOCATIONS } from './timelineData';
import { RotateCcw, MapPin } from 'lucide-react';

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
  selectedItem: TimelineItem | null;
  setSelectedItem: (item: TimelineItem | null) => void;
  onViewOnMap: (item: TimelineItem) => void;
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

export default function TimelinePage({ theme, isMapDarkMode, selectedItem, setSelectedItem, onViewOnMap }: TimelinePageProps) {
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

  // Onboarding tour state
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem('mtrh_timeline_onboarding_completed');
    if (!completed) {
      setOnboardingStep(0);
    }
  }, []);
  
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

  // Helper to find the closest event offscreen for a specific era
  const getEraOffscreenNav = (eraId: string) => {
    const items = eraItemsMap[eraId] || [];
    if (items.length === 0) return null;
    
    // Check if any item is currently in the horizontal viewport
    const hasInView = items.some(item => {
      const start = item.start;
      const end = item.type === 'lifespan' ? (item.end ?? item.start) : item.start;
      return start <= viewEnd && end >= viewStart;
    });
    
    if (hasInView) return null;
    
    // Find the closest item to the left and right
    let closestLeft: TimelineItem | null = null;
    let maxLeftEnd = -Infinity;
    
    let closestRight: TimelineItem | null = null;
    let minRightStart = Infinity;
    
    items.forEach(item => {
      const start = item.start;
      const end = item.type === 'lifespan' ? (item.end ?? item.start) : item.start;
      
      if (end < viewStart) {
        if (end > maxLeftEnd) {
          maxLeftEnd = end;
          closestLeft = item;
        }
      } else if (start > viewEnd) {
        if (start < minRightStart) {
          minRightStart = start;
          closestRight = item;
        }
      }
    });
    
    if (!closestLeft && !closestRight) return null;
    
    if (closestLeft && closestRight) {
      const leftDist = viewStart - maxLeftEnd;
      const rightDist = minRightStart - viewEnd;
      if (leftDist < rightDist) {
        return { direction: 'left' as const, item: closestLeft };
      } else {
        return { direction: 'right' as const, item: closestRight };
      }
    } else if (closestLeft) {
      return { direction: 'left' as const, item: closestLeft };
    } else {
      return { direction: 'right' as const, item: closestRight };
    }
  };

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

  // Compute relationship distances from the hovered item using BFS
  const highlightedDistances = useMemo(() => {
    if (!hoveredItemId) return new Map<string, number>();
    const distances = new Map<string, number>();
    distances.set(hoveredItemId, 0);
    
    const queue: { id: string; dist: number }[] = [{ id: hoveredItemId, dist: 0 }];
    const visited = new Set<string>([hoveredItemId]);
    
    while (queue.length > 0) {
      const { id, dist } = queue.shift()!;
      const item = TIMELINE_ITEMS.find(x => x.id === id);
      if (!item) continue;
      
      const relatives: string[] = [];
      if (item.fatherId) relatives.push(item.fatherId);
      if (item.motherId) relatives.push(item.motherId);
      if (item.spouseId) relatives.push(item.spouseId);
      
      const children = TIMELINE_ITEMS.filter(x => x.fatherId === id || x.motherId === id);
      children.forEach(c => relatives.push(c.id));
      
      for (const relId of relatives) {
        if (!visited.has(relId)) {
          visited.add(relId);
          distances.set(relId, dist + 1);
          queue.push({ id: relId, dist: dist + 1 });
        }
      }
    }
    return distances;
  }, [hoveredItemId]);

  // Filter highlighted family members to only render solid/opaque styling for non-overlapping closest relatives
  const solidHighlightedIds = useMemo(() => {
    if (!hoveredItemId) return new Set<string>();
    
    const relatives = (Array.from(highlightedIds) as string[]).filter(id => id !== hoveredItemId);
    const sortedRelatives = relatives
      .map(id => ({ id, item: TIMELINE_ITEMS.find(x => x.id === id)!, dist: highlightedDistances.get(id) ?? 999 }))
      .filter(x => x.item !== undefined)
      .sort((a, b) => a.dist - b.dist);
      
    const selected = new Set<string>();
    
    for (const rel of sortedRelatives) {
      let hasOverlap = false;
      for (const selId of selected) {
        const selItem = TIMELINE_ITEMS.find(x => x.id === selId)!;
        
        const aStart = rel.item.start;
        const aEnd = rel.item.type === 'lifespan' ? (rel.item.end ?? rel.item.start) : rel.item.start;
        const bStart = selItem.start;
        const bEnd = selItem.type === 'lifespan' ? (selItem.end ?? selItem.start) : selItem.start;
        
        if (Math.max(aStart, bStart) <= Math.min(aEnd, bEnd)) {
          hasOverlap = true;
          break;
        }
      }
      
      if (!hasOverlap) {
        selected.add(rel.id);
      }
    }
    
    return selected;
  }, [hoveredItemId, highlightedIds, highlightedDistances]);

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
        className="custom-sidebar-scrollbar"
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
              const offscreenNav = getEraOffscreenNav(era.id);
              
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

                    <AnimatePresence>
                      {offscreenNav && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isMapDarkMode ? '#333333' : '#222222';
                            e.currentTarget.style.borderColor = isMapDarkMode ? '#444444' : '#333333';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#000000';
                            e.currentTarget.style.borderColor = isMapDarkMode ? '#333333' : '#000000';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(offscreenNav.item);
                          }}
                          style={{
                            marginLeft: 'auto',
                            background: '#000000',
                            color: '#ffffff',
                            border: `1px solid ${isMapDarkMode ? '#333333' : '#000000'}`,
                            borderRadius: '12px',
                            padding: '4px 10px',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            fontFamily: '"Space Mono", monospace',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s ease',
                            pointerEvents: 'auto',
                            height: '24px',
                            boxSizing: 'border-box'
                          }}
                        >
                          {offscreenNav.direction === 'left' ? (
                            <>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="10" 
                                height="10" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="white" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                style={{ flexShrink: 0 }}
                              >
                                <polyline points="15 18 9 12 15 6" />
                              </svg>
                              <span>SCROLL TO CONTENT</span>
                            </>
                          ) : (
                            <>
                              <span>SCROLL TO CONTENT</span>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="10" 
                                height="10" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="white" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                style={{ flexShrink: 0 }}
                              >
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </>
                          )}
                        </motion.button>
                      )}
                    </AnimatePresence>
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
                      {track.items.map((item, itemIdx) => {
                        const xStart = getX(item.start);
                        const xEnd = item.type === 'lifespan' ? getX(item.end ?? item.start) : xStart;
                        const width = Math.max(12, xEnd - xStart);
                        const isHovered = hoveredItemId === item.id;
                        const isSelected = selectedItem?.id === item.id;
                        
                        // Check genealogy highlights
                        const isHighlight = highlightedIds.has(item.id);
                        const isSolidHighlight = solidHighlightedIds.has(item.id);

                        // Calculate distance to the next item on the same track to prevent text overlap
                        const nextItem = track.items[itemIdx + 1];
                        const nextStart = nextItem ? getX(nextItem.start) : 100;
                        const distToNext = nextStart - xStart;
                        const pctOfParent = (distToNext / width) * 100;
                        
                        const mask = isHovered || isSelected 
                          ? 'none' 
                          : 'linear-gradient(to right, #000 calc(100% - 16px), transparent 100%)';

                        if (item.type === 'lifespan') {
                          return (
                            <React.Fragment key={item.id}>
                              <div
                                onMouseEnter={() => setHoveredItemId(item.id)}
                                onMouseLeave={() => setHoveredItemId(null)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemClick(item);
                                }}
                                style={{
                                  position: 'absolute',
                                  left: `${xStart}%`,
                                  width: isHovered || isSelected ? 'auto' : `${width}%`,
                                  minWidth: isHovered || isSelected ? `${width}%` : '24px',
                                  height: '24px',
                                  top: '6px',
                                  background: (isHovered || isSelected || isSolidHighlight)
                                    ? era.color
                                    : (isHighlight ? `${era.color}77` : `${era.color}44`),
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
                                  color: (isHovered || isSelected || isSolidHighlight) ? '#000000' : (isMapDarkMode ? '#ffffff' : '#000000'),
                                  mixBlendMode: (isHovered || isSelected || isSolidHighlight) ? 'normal' : (isMapDarkMode ? 'screen' : 'multiply'),
                                  boxShadow: isSelected ? `0 0 15px ${era.color}` : 'none',
                                  transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                                  pointerEvents: 'auto',
                                  overflow: 'hidden',
                                  zIndex: isSelected ? 300 : (isHovered ? 200 : (isHighlight ? 100 : 5))
                                }}
                              >
                                <span style={{ 
                                  display: 'block',
                                  whiteSpace: 'nowrap', 
                                  overflow: 'hidden', 
                                  width: '100%',
                                  maxWidth: isHovered || isSelected ? 'none' : `calc(${pctOfParent}% - 16px)`,
                                  WebkitMaskImage: mask,
                                  maskImage: mask
                                }}>
                                  {item.name}
                                </span>
                              </div>
                              {/* Pulsing highlight overlay for onboarding */}
                              {((onboardingStep === 1 && item.id === 'adam') || 
                                (onboardingStep === 2 && (item.id === 'adam' || item.id === 'eve'))) && (
                                <div style={{
                                  position: 'absolute',
                                  left: `${xStart}%`,
                                  width: isHovered || isSelected ? 'auto' : `${width}%`,
                                  minWidth: '24px',
                                  height: '24px',
                                  top: '6px',
                                  border: '3px solid #b6a6ff',
                                  boxShadow: '0 0 15px rgba(182, 166, 255, 0.5)',
                                  pointerEvents: 'none',
                                  zIndex: 9999,
                                  borderRadius: '12px',
                                  animation: 'radar-pulse 2s infinite'
                                }} />
                              )}
                            </React.Fragment>
                          );
                        } else {
                          // Singular Event Circle with Hover & Selected Pill Backgrounds
                          const isHovered = hoveredItemId === item.id;
                          const isSelected = selectedItem?.id === item.id;
                          const isSolidHighlight = solidHighlightedIds.has(item.id);
                          
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
                                  padding: (isHovered || isSelected || isSolidHighlight) ? '0 12px' : '0',
                                  border: isSelected
                                    ? `2px solid ${isMapDarkMode ? '#ffffff' : '#000000'}`
                                    : 'none',
                                  boxShadow: isSelected ? `0 0 15px ${era.color}` : 'none',
                                  transition: 'all 0.15s ease',
                                  whiteSpace: 'nowrap',
                                  transform: (isHovered || isSelected || isSolidHighlight) ? 'translateX(-18px)' : 'translateX(-6px)',
                                  position: 'relative'
                                }}
                              >
                                {/* Blended Background Sibling (isolated from text and dot) */}
                                {(isHovered || isSelected || isSolidHighlight) && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      borderRadius: '12px',
                                      background: era.color,
                                      mixBlendMode: 'normal',
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
                                    background: (isSelected || isHovered || isSolidHighlight) ? '#000000' : era.color,
                                    border: 'none',
                                    boxShadow: isSelected
                                      ? `0 0 10px 2px ${era.color}`
                                      : ((isHovered || isSolidHighlight) ? `0 0 8px ${era.color}` : 'none'),
                                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                                    transition: 'all 0.15s ease',
                                    flexShrink: 0,
                                    position: 'relative',
                                    zIndex: 1
                                  }}
                                />

                                {/* Label text */}
                                {(span < 8000 || isHovered || isSelected || isSolidHighlight) && (
                                  <span style={{ 
                                    marginLeft: '8px', 
                                    fontSize: '9px', 
                                    fontWeight: 700, 
                                    color: (isHovered || isSelected || isSolidHighlight)
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
              
              const getConnectionAnchors = (
                idA: string, 
                yA: number, 
                idB: string, 
                yB: number, 
                connectYear: number
              ) => {
                const itemA = TIMELINE_ITEMS.find(x => x.id === idA)!;
                const itemB = TIMELINE_ITEMS.find(x => x.id === idB)!;
                
                const isMainA = idA === hoveredItemId || (selectedItem && idA === selectedItem.id);
                const isMainB = idB === hoveredItemId || (selectedItem && idB === selectedItem.id);
                
                // If the connection is at the left-most edge (start year) of the pill, center it vertically on the track.
                const isAtStartA = connectYear === itemA.start;
                const isAtStartB = connectYear === itemB.start;
                
                const anchorA = (isMainA || isAtStartA) 
                  ? yA 
                  : (yA < yB ? yA + 12 : yA - 12);
                  
                const anchorB = (isMainB || isAtStartB) 
                  ? yB 
                  : (yA < yB ? yB - 12 : yB + 12);
                  
                return { anchorA, anchorB };
              };

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
                      const { anchorA: y1, anchorB: y2 } = getConnectionAnchors(item.id, itemY, spouse.id, spouseY, connectYear);
                      lines.push(
                        <g key={`spouse-${item.id}-${spouse.id}`}>
                          <line 
                            x1={`${connectX}%`} 
                            y1={y1} 
                            x2={`${connectX}%`} 
                            y2={y2} 
                            stroke={highlightColor} 
                            strokeWidth="3" 
                          />
                          <circle cx={`${connectX}%`} cy={y1} r="5" fill={item.id === hoveredItemId || selectedItem?.id === item.id || solidHighlightedIds.has(item.id) ? '#000000' : highlightColor} stroke={theme.border} strokeWidth="1" />
                          <circle cx={`${connectX}%`} cy={y2} r="5" fill={spouse.id === hoveredItemId || selectedItem?.id === spouse.id || solidHighlightedIds.has(spouse.id) ? '#000000' : highlightColor} stroke={theme.border} strokeWidth="1" />
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
                    const { anchorA: y1, anchorB: y2 } = getConnectionAnchors(father.id, fatherY, item.id, itemY, item.start);
                    lines.push(
                      <g key={`father-${father.id}-${item.id}`}>
                        <line 
                          x1={`${birthX}%`} 
                          y1={y1} 
                          x2={`${birthX}%`} 
                          y2={y2} 
                          stroke={highlightColor} 
                          strokeWidth="2" 
                          strokeDasharray="4,4"
                        />
                        <circle cx={`${birthX}%`} cy={y1} r="4" fill={father.id === hoveredItemId || selectedItem?.id === father.id || solidHighlightedIds.has(father.id) ? '#000000' : highlightColor} stroke={theme.border} strokeWidth="1" />
                        <circle cx={`${birthX}%`} cy={y2} r="3" fill={item.id === hoveredItemId || selectedItem?.id === item.id || solidHighlightedIds.has(item.id) ? '#000000' : highlightColor} />
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
                    const { anchorA: y1, anchorB: y2 } = getConnectionAnchors(mother.id, motherY, item.id, itemY, item.start);
                    lines.push(
                      <g key={`mother-${mother.id}-${item.id}`}>
                        <line 
                          x1={`${birthX}%`} 
                          y1={y1} 
                          x2={`${birthX}%`} 
                          y2={y2} 
                          stroke={highlightColor} 
                          strokeWidth="2" 
                          strokeDasharray="4,4"
                        />
                        <circle cx={`${birthX}%`} cy={y1} r="4" fill={mother.id === hoveredItemId || selectedItem?.id === mother.id || solidHighlightedIds.has(mother.id) ? '#000000' : highlightColor} stroke={theme.border} strokeWidth="1" />
                        <circle cx={`${birthX}%`} cy={y2} r="3" fill={item.id === hoveredItemId || selectedItem?.id === item.id || solidHighlightedIds.has(item.id) ? '#000000' : highlightColor} />
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
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        background: era.color,
                        color: '#000000',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '8px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        display: 'inline-block'
                      }}>
                        {era.name}
                      </span>
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
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {TIMELINE_LOCATIONS[selectedItem.id] && (
                          <button
                            onClick={() => onViewOnMap(selectedItem)}
                            style={{
                              background: 'transparent',
                              color: tooltipTheme.text,
                              border: `1px solid ${tooltipTheme.text}`,
                              padding: '6px 14px',
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
                            MAP VIEW
                          </button>
                        )}
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
          marginLeft: 'auto',
          position: 'relative'
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

          {/* Pulsing highlight overlay for onboarding controls */}
          {onboardingStep === 3 && (
            <div style={{
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              right: '-6px',
              bottom: '-6px',
              border: '3px solid #b6a6ff',
              boxShadow: '0 0 15px rgba(182, 166, 255, 0.5)',
              pointerEvents: 'none',
              zIndex: 9999,
              borderRadius: '19px',
              animation: 'radar-pulse 2s infinite'
            }} />
          )}
        </div>

      {/* ONBOARDING TOUR */}
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
                  localStorage.setItem('mtrh_timeline_onboarding_completed', 'true');
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
              const onboardingSteps = [
                {
                  title: "1. WELCOME TO THE TIMELINE",
                  content: "This timeline visualizes bloodlines, historic events, and esoteric lore across pre-flood Sumerian reigns, biblical genealogies, and Frankish kingdoms. Let's take a quick tour.",
                  placement: "center"
                },
                {
                  title: "2. ERAS & LIFESPANS",
                  content: "Historical figures and events are displayed in parallel horizontal tracks. Lifespans are represented as solid horizontal bars, and events are represented as individual dots. Pulsing elements highlight active records.",
                  placement: "timeline-content"
                },
                {
                  title: "3. RELATIONSHIP NETWORKS",
                  content: "Hovering over any figure dynamically draws relationship lines. Solid lines connect spouses, and dashed lines connect parents to children. Hover over Adam or Eve to see this in action.",
                  placement: "timeline-content"
                },
                {
                  title: "4. VIEWPORT CONTROLS",
                  content: "Use these controls to zoom in and out, adjust the active timeline span, or reset the viewport back to its default range.",
                  placement: "bottom-controls"
                }
              ];

              const currentStep = onboardingSteps[onboardingStep];
              if (!currentStep) return null;

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
                  width: '320px',
                  pointerEvents: 'auto',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                };

                switch (currentStep.placement) {
                  case 'center':
                    return {
                      ...common,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '450px',
                    };
                  case 'timeline-content':
                    return {
                      ...common,
                      left: '120px',
                      top: '200px',
                      width: '360px',
                    };
                  case 'bottom-controls':
                    return {
                      ...common,
                      right: '24px',
                      bottom: '105px', // Moved up to clear zoom controls perfectly
                      width: '360px',
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

                switch (currentStep.placement) {
                  case 'timeline-content':
                    return {
                      ...common,
                      top: '-10px',
                      left: '50px',
                      borderWidth: '0 8px 10px 8px',
                      borderColor: `transparent transparent ${tooltipTheme.bg} transparent`,
                    };
                  case 'bottom-controls':
                    return {
                      ...common,
                      bottom: '-10px',
                      right: '50px',
                      borderWidth: '10px 8px 0 8px',
                      borderColor: `${tooltipTheme.bg} transparent transparent transparent`,
                    };
                  default:
                    return { display: 'none' };
                }
              })();

              const handleClose = () => {
                setOnboardingStep(null);
                localStorage.setItem('mtrh_timeline_onboarding_completed', 'true');
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
                    key={`timeline-tour-step-${onboardingStep}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
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
                      boxShadow: isMapDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.3)'
                    }}
                    role="dialog"
                    aria-labelledby="timeline-tour-title"
                  >
                    {/* Arrow Indicator */}
                    <div style={arrowStyle} />

                    <h3 
                      id="timeline-tour-title"
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

      <style>{`
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
      </div>
    </div>
  );
}
