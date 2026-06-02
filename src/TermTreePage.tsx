import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { TERM_TREE_DATA, TermNode, TranslationInfo } from './termTreeData';

interface TermTreePageProps {
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
  onViewOnMap: (layerName: string, featureSearchTerm?: string) => void;
  onViewOnTimeline: (timelineId: string) => void;
}

const LAYER_COLORS: Record<string, string> = {
  'War.gov UFO files 01': '#FF9BE1',
  'War.gov UFO files 02': '#D29BFF',
  'Enochian Sites': '#FF9F63',
  'Nephilim': '#ECCE81',
  'Biblical Figures': '#90C2FF',
  'Biblical Events': '#91FFC4',
  'U.F.O. Sightings': '#C2FFBD',
  'Bigfoot Sightings': '#C6986D',
  'Cryptid Sightings': '#AFFFEC',
  'Underworld Entrances': '#D3C5FB',
  'Ancient Texts': '#F6E8C1',
  'Burial Mounds': '#B3C77B',
  'Cave Drawings': '#FFABA6',
  'Crop Circles': '#FFF96A',
  "D.U.M.B.'s": '#BAEAF4',
  'Ghosts & Hauntings': '#BDC4FF',
  'Megaliths': '#FFFBA6',
  'Petroglyphs': '#FFCBA6',
  'National Parks & Reserves': '#9FF3BC',
  'Blurred on Google Maps': '#BDC4FF',
  'Meteor Impact Craters': '#FF9F63',
  'Ley Lines': '#FF5E97',
  'Archaeological Finds': '#74F8F3',
  'Biblical Finds': '#D49459',
  'Default': '#b6a6ff'
};

const LAYER_ICONS: Record<string, string> = {
  'War.gov UFO files 01': '/icons/icon-dept-war.svg',
  'War.gov UFO files 02': '/icons/icon-dept-war-02.svg',
  'Enochian Sites': '/icons/icon-enochian-lore.svg',
  'Nephilim': '/icons/icon-giants.svg',
  'Biblical Figures': '/icons/icon-biblical-bloodlines.svg',
  'Biblical Events': '/icons/icon-biblical-bloodlines-1.svg',
  'U.F.O. Sightings': '/icons/icon-ufo-sightings.svg',
  'Bigfoot Sightings': '/icons/icon-bigfoot-sightings.svg',
  'Cryptid Sightings': '/icons/icon-cryptid-sightings.svg',
  'Underworld Entrances': '/icons/icon-entrances-to-underworld.svg',
  'Ancient Texts': '/icons/icon-ancient-texts.svg',
  'Burial Mounds': '/icons/icon-burial-mounds.svg',
  'Cave Drawings': '/icons/icon-cave-drawings.svg',
  'Crop Circles': '/icons/icon-crop-circles.svg',
  "D.U.M.B.'s": '/icons/icon-dumbs.svg',
  'Ghosts & Hauntings': '/icons/icon-ghosts.svg',
  'Megaliths': '/icons/icon-megaliths.svg',
  'Petroglyphs': '/icons/icon-petroglyphs.svg',
  'National Parks & Reserves': '/icons/icon-national-parks-reserves.svg',
  'Blurred on Google Maps': '/icons/icon-blurred-on-google.svg',
  'Meteor Impact Craters': '/icons/icon-meteors.svg',
  'Ley Lines': '/icons/icon-ley-lines.svg',
  'Archaeological Finds': '/icons/icon-archaeological-finds.svg',
  'Biblical Finds': '/icons/icon-biblical-finds.svg',
  'Default': '/icons/icon-map-pin.svg'
};

interface SVGLinePath {
  id: string;
  d: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  isRelated: boolean;
}

export default function TermTreePage({
  theme,
  isMapDarkMode,
  onViewOnMap,
  onViewOnTimeline
}: TermTreePageProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lines, setLines] = useState<SVGLinePath[]>([]);
  const [scrollSize, setScrollSize] = useState({ width: 0, height: 0 });

  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);


  // Derive active selection node (last element in selected path)
  const selectedTermId = selectedPath[selectedPath.length - 1] || null;
  const activeTermId = selectedTermId || hoveredTermId;

  const activeTermNode = useMemo(() => {
    if (!activeTermId) return null;
    return TERM_TREE_DATA.find(t => t.id === activeTermId) || null;
  }, [activeTermId]);

  // Compute terms visible/matched for search query
  const searchFilteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return { visibleNodes: new Set(TERM_TREE_DATA.map(n => n.id)), matchedNodes: new Set<string>() };
    }

    const query = searchQuery.toLowerCase().trim();
    const matched = new Set<string>();
    const visible = new Set<string>();

    TERM_TREE_DATA.forEach(node => {
      const nameMatch = node.name.toLowerCase().includes(query);
      const descMatch = node.description.toLowerCase().includes(query);
      const transMatch = node.translations?.some(t =>
        t.original.toLowerCase().includes(query) ||
        t.translit.toLowerCase().includes(query) ||
        t.meaning.toLowerCase().includes(query)
      );
      const verseMatch = node.bibleVerses?.some(v => v.toLowerCase().includes(query));

      if (nameMatch || descMatch || transMatch || verseMatch) {
        matched.add(node.id);
        visible.add(node.id);
      }
    });

    const traceAncestors = (nodeId: string) => {
      const node = TERM_TREE_DATA.find(n => n.id === nodeId);
      if (node && node.parentId) {
        visible.add(node.parentId);
        traceAncestors(node.parentId);
      }
    };

    matched.forEach(id => traceAncestors(id));

    return { visibleNodes: visible, matchedNodes: matched };
  }, [searchQuery]);

  // Helper to trace path from node to root
  const getPathToRoot = (id: string | null): string[] => {
    const path: string[] = [];
    let curr = id;
    while (curr) {
      path.unshift(curr);
      const node = TERM_TREE_DATA.find(n => n.id === curr);
      curr = node?.parentId || null;
    }
    return path;
  };

  // If a search match is selected, expand/update the selected path to it
  useEffect(() => {
    if (searchQuery.trim() && searchFilteredData.matchedNodes.size > 0) {
      const firstMatch = Array.from(searchFilteredData.matchedNodes)[0] as string | undefined;
      if (firstMatch) {
        const path = getPathToRoot(firstMatch);
        setSelectedPath(path);
      }
    }
  }, [searchQuery, searchFilteredData]);

  // Layer Color and Icon helpers
  const getNodeColor = (node: TermNode): string => {
    if (node.layer && LAYER_COLORS[node.layer]) {
      return LAYER_COLORS[node.layer];
    }
    
    // Assign generic colors to root branches to represent their space
    if (node.id === 'biblical-enc') return LAYER_COLORS['Biblical Figures'];
    if (node.id === 'ufos-anomalies') return LAYER_COLORS['U.F.O. Sightings'];
    if (node.id === 'cryptids-hauntings') return LAYER_COLORS['Cryptid Sightings'];
    if (node.id === 'ancient-sites') return LAYER_COLORS['Megaliths'];
    if (node.id === 'earth-energies') return LAYER_COLORS['Ley Lines'];

    let parentId = node.parentId;
    while (parentId) {
      const parent = TERM_TREE_DATA.find(n => n.id === parentId);
      if (parent && parent.layer && LAYER_COLORS[parent.layer]) {
        return LAYER_COLORS[parent.layer];
      }
      parentId = parent?.parentId;
    }
    return theme.text;
  };

  const getRootCategoryColor = (node: TermNode): string => {
    let curr = node;
    while (curr.parentId) {
      const parent = TERM_TREE_DATA.find(n => n.id === curr.parentId);
      if (!parent) break;
      curr = parent;
    }
    return getNodeColor(curr);
  };

  const adjustColorForContrast = (color: string): string => {
    if (isMapDarkMode) return color;
    
    const lower = color.toLowerCase();
    switch (lower) {
      case '#fff96a': // Crop Circles
      case '#fffba6': // Megaliths
        return '#b59300'; // Dark gold/yellow
      case '#f6e8c1': // Ancient Texts
      case '#ecce81': // Nephilim
        return '#8b6f28'; // Dark gold/brown
      case '#c2ffbd': // U.F.O. Sightings
      case '#9ff3bc': // National Parks
        return '#2d7a2d'; // Dark green
      case '#afffec': // Cryptid Sightings
      case '#74f8f3': // Archaeological Finds
        return '#007b7b'; // Dark cyan/teal
      case '#baeaf4': // D.U.M.B.'s
        return '#1b6e82'; // Dark blue-teal
      case '#90c2ff': // Biblical Figures
      case '#bdc4ff': // Ghosts & Hauntings / Blurred
        return '#325fa6'; // Dark blue
      case '#ff9be1': // War.gov UFO files 01
      case '#ff5e97': // Ley Lines
        return '#c01859'; // Dark pink/red
      case '#ff9f63': // Enochian / Meteor Impact
      case '#ffcba6': // Petroglyphs
      case '#d49459': // Biblical Finds
      case '#c6986d': // Bigfoot
        return '#a05018'; // Dark orange/brown
      case '#d3c5fb': // Underworld Entrances
      case '#d29bff': // War.gov UFO files 02
        return '#663b99'; // Dark purple
      case '#b6a6ff': // Default / Related
        return '#4b3b99'; // Dark indigo
      default:
        return color;
    }
  };

  const getNodeIcon = (node: TermNode): string => {
    if (node.layer && LAYER_ICONS[node.layer]) {
      return LAYER_ICONS[node.layer];
    }
    let parentId = node.parentId;
    while (parentId) {
      const parent = TERM_TREE_DATA.find(n => n.id === parentId);
      if (parent && parent.layer && LAYER_ICONS[parent.layer]) {
        return LAYER_ICONS[parent.layer];
      }
      parentId = parent?.parentId;
    }
    
    // Assign generic icons to root branches to represent their space
    if (node.id === 'biblical-enc') return LAYER_ICONS['Biblical Figures'];
    if (node.id === 'ufos-anomalies') return LAYER_ICONS['U.F.O. Sightings'];
    if (node.id === 'cryptids-hauntings') return LAYER_ICONS['Cryptid Sightings'];
    if (node.id === 'ancient-sites') return LAYER_ICONS['Megaliths'];
    if (node.id === 'earth-energies') return LAYER_ICONS['Ley Lines'];
    
    return LAYER_ICONS['Default'];
  };

  // Helper to trace term depth level
  const getNodeLevel = (node: TermNode): number => {
    let lvl = 0;
    let curr = node.parentId;
    while (curr) {
      lvl++;
      const parent = TERM_TREE_DATA.find(n => n.id === curr);
      curr = parent?.parentId;
    }
    return lvl;
  };

  // Generate visible columns
  const columns = useMemo(() => {
    const list: { level: number; title: string; nodes: TermNode[] }[] = [];

    // Level 0: Roots
    const rootNodes = TERM_TREE_DATA.filter(n => !n.parentId && searchFilteredData.visibleNodes.has(n.id));
    list.push({ level: 0, title: 'Categories', nodes: rootNodes });

    // Subsequent levels based on active selected path
    for (let i = 0; i < selectedPath.length; i++) {
      const currentId = selectedPath[i];
      const children = TERM_TREE_DATA.filter(n => n.parentId === currentId && searchFilteredData.visibleNodes.has(n.id));
      if (children.length > 0) {
        list.push({
          level: i + 1,
          title: i === 0 ? 'Sub-Themes' : 'Terms',
          nodes: children
        });
      }
    }

    return list;
  }, [selectedPath, searchFilteredData]);

  // Handle term node selection click
  const handleNodeClick = (node: TermNode, level: number) => {
    const path = [...selectedPath.slice(0, level), node.id];
    setSelectedPath(path);
  };

  // Update selection pathways and cross-links lines
  const updateLines = () => {
    if (!columnsContainerRef.current || !svgOverlayRef.current) return;

    const container = columnsContainerRef.current;
    
    setScrollSize({
      width: Math.max(container.scrollWidth, container.clientWidth),
      height: Math.max(container.scrollHeight, container.clientHeight)
    });

    const containerRect = container.getBoundingClientRect();
    const paths: SVGLinePath[] = [];

    // 1. Draw Selection Path connecting lines (right-angle orthogonal staircase style)
    for (let i = 0; i < selectedPath.length - 1; i++) {
      const parentId = selectedPath[i];
      const childId = selectedPath[i + 1];

      const parentEl = document.getElementById(`node-pill-${parentId}`);
      const childEl = document.getElementById(`node-pill-${childId}`);

      if (parentEl && childEl) {
        const parentRect = parentEl.getBoundingClientRect();
        const childRect = childEl.getBoundingClientRect();

        // Right side of parent pill
        const x1 = parentRect.right - containerRect.left + container.scrollLeft;
        const y1 = parentRect.top + parentRect.height / 2 - containerRect.top + container.scrollTop;

        // Left side of child pill
        const x2 = childRect.left - containerRect.left + container.scrollLeft;
        const y2 = childRect.top + childRect.height / 2 - containerRect.top + container.scrollTop;

        const parentNode = TERM_TREE_DATA.find(n => n.id === parentId);
        const color = parentNode ? getRootCategoryColor(parentNode) : theme.borderLight;

        // Orthogonal right angle path (horizontal, vertical, horizontal)
        const xMid = (x1 + x2) / 2;
        const pathData = `M ${x1} ${y1} H ${xMid} V ${y2} H ${x2}`;

        paths.push({
          id: `path-${parentId}-${childId}`,
          d: pathData,
          x1,
          y1,
          x2,
          y2,
          color,
          isRelated: false
        });
      }
    }

    // 2. Draw Cross-linked Related Terms curves
    if (activeTermId) {
      const activeNode = TERM_TREE_DATA.find(n => n.id === activeTermId);
      const activeEl = document.getElementById(`node-pill-${activeTermId}`);

      if (activeNode && activeNode.relatedIds && activeEl) {
        const activeRect = activeEl.getBoundingClientRect();
        
        // Collect all terms currently rendered in the active columns
        const renderedIds = new Set<string>();
        columns.forEach(col => col.nodes.forEach(n => renderedIds.add(n.id)));

        activeNode.relatedIds.forEach(relId => {
          if (renderedIds.has(relId)) {
            const relEl = document.getElementById(`node-pill-${relId}`);
            const relNode = TERM_TREE_DATA.find(n => n.id === relId);

            if (relEl && relNode) {
              const relRect = relEl.getBoundingClientRect();
              const activeLevel = getNodeLevel(activeNode);
              const relLevel = getNodeLevel(relNode);

              let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
              let pathData = '';

              if (activeLevel === relLevel) {
                if (activeLevel === 0) {
                  // Column 0 (categories): connect on the right side using the gap
                  x1 = activeRect.right - containerRect.left + container.scrollLeft;
                  y1 = activeRect.top + activeRect.height / 2 - containerRect.top + container.scrollTop;

                  x2 = relRect.right - containerRect.left + container.scrollLeft;
                  y2 = relRect.top + relRect.height / 2 - containerRect.top + container.scrollTop;

                  // Loop into the gap between Column 0 and Column 1 (20px to the right)
                  const xOffset = Math.max(x1, x2) + 20;
                  pathData = `M ${x1} ${y1} H ${xOffset} V ${y2} H ${x2}`;
                } else {
                  // Columns 1+: connect on the left side using the gap on the left
                  x1 = activeRect.left - containerRect.left + container.scrollLeft;
                  y1 = activeRect.top + activeRect.height / 2 - containerRect.top + container.scrollTop;

                  x2 = relRect.left - containerRect.left + container.scrollLeft;
                  y2 = relRect.top + relRect.height / 2 - containerRect.top + container.scrollTop;

                  // Loop into the gap on the left (20px to the left)
                  const xOffset = Math.min(x1, x2) - 20;
                  pathData = `M ${x1} ${y1} H ${xOffset} V ${y2} H ${x2}`;
                }
              } else {
                // Different columns: connect right-side of left element to left-side of right element
                const isLeftToRight = activeLevel < relLevel;
                const leftElRect = isLeftToRight ? activeRect : relRect;
                const rightElRect = isLeftToRight ? relRect : activeRect;

                x1 = leftElRect.right - containerRect.left + container.scrollLeft;
                y1 = leftElRect.top + leftElRect.height / 2 - containerRect.top + container.scrollTop;

                x2 = rightElRect.left - containerRect.left + container.scrollLeft;
                y2 = rightElRect.top + rightElRect.height / 2 - containerRect.top + container.scrollTop;

                // Calculate xMid: 20px before the right element is the center of the gap preceding it
                const xMid = rightElRect.left - 20 - containerRect.left + container.scrollLeft;
                pathData = `M ${x1} ${y1} H ${xMid} V ${y2} H ${x2}`;
              }

              paths.push({
                id: `rel-${activeTermId}-${relId}`,
                d: pathData,
                x1,
                y1,
                x2,
                y2,
                color: activeNode ? getRootCategoryColor(activeNode) : '#b6a6ff',
                isRelated: true
              });
            }
          }
        });
      }
    }

    setLines(paths);
  };

  // Trigger line updates on rendering parameters
  useEffect(() => {
    const timer = setTimeout(updateLines, 50);

    const container = columnsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateLines);
    }
    window.addEventListener('resize', updateLines);

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener('scroll', updateLines);
      }
      window.removeEventListener('resize', updateLines);
    };
  }, [selectedPath, columns, activeTermId, searchQuery]);

  // Mouse drag-to-scroll panning like a Miro board
  const activeDragRef = useRef<{
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
    container: HTMLDivElement;
    mainContainer: HTMLDivElement;
    hasDragged: boolean;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, isColumn: boolean) => {
    // Only drag with left click
    if (e.button !== 0) return;
    
    // If it's a main background click, only drag if clicking directly on container/svg
    if (!isColumn && e.target !== e.currentTarget && (e.target as HTMLElement).tagName !== 'svg') {
      return;
    }
    
    const mainContainer = columnsContainerRef.current;
    if (!mainContainer) return;
    
    const container = isColumn ? e.currentTarget : mainContainer;
    
    activeDragRef.current = {
      startX: e.pageX,
      startY: e.pageY,
      scrollLeft: mainContainer.scrollLeft,
      scrollTop: container.scrollTop,
      container,
      mainContainer,
      hasDragged: false
    };

    // Prevent default text selection/dragging behavior during mouse drag
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const drag = activeDragRef.current;
      if (!drag) return;
      
      const deltaX = e.pageX - drag.startX;
      const deltaY = e.pageY - drag.startY;
      
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        if (!drag.hasDragged) {
          drag.hasDragged = true;
          document.body.classList.add('is-grabbing');
        }
      }
      
      // Horizontal pan (always on main container)
      drag.mainContainer.scrollLeft = drag.scrollLeft - deltaX;
      
      // Vertical pan (only if dragging on a column list container)
      if (drag.container !== drag.mainContainer) {
        drag.container.scrollTop = drag.scrollTop - deltaY;
      }
    };

    const handleMouseUp = () => {
      const drag = activeDragRef.current;
      if (drag) {
        if (drag.hasDragged) {
          document.body.classList.remove('is-grabbing');
          // Prevent next click event on pill items if dragged
          const preventClick = (captureEvent: MouseEvent) => {
            captureEvent.stopPropagation();
            captureEvent.preventDefault();
          };
          window.addEventListener('click', preventClick, { capture: true });
          setTimeout(() => {
            window.removeEventListener('click', preventClick, { capture: true });
          }, 50);
        }
        activeDragRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Auto-center selected terms vertically within their columns (aligning them to a single horizontal line)
  const isInitialMountRef = useRef(true);

  // Smoothly center the columns container on the active column and vertical midpoint (single horizontal selections line)
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = columnsContainerRef.current;
      if (!container) return;
      
      const viewportWidth = container.clientWidth;
      const viewportHeight = container.clientHeight;
      
      // Determine which column to center
      const targetColIdx = Math.min(selectedPath.length, columns.length - 1);
      const colCenterX = 1200 + targetColIdx * 300 + 130;
      
      const targetScrollLeft = colCenterX - viewportWidth / 2;
      const targetScrollTop = 1500 - viewportHeight / 2;
      
      if (isInitialMountRef.current) {
        container.scrollLeft = targetScrollLeft;
        container.scrollTop = targetScrollTop;
        isInitialMountRef.current = false;
      } else {
        container.scrollTo({
          left: targetScrollLeft,
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }, 150); // slight delay to allow rendering
    return () => clearTimeout(timer);
  }, [selectedPath, columns]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        background: isMapDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        color: theme.text,
        overflow: 'hidden',
        position: 'relative',
        borderTop: '1px solid #000000' // Black divider line across the top of the term tree area
      }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .is-grabbing {
          cursor: grabbing !important;
        }
        .is-grabbing * {
          cursor: grabbing !important;
        }
      `}</style>

      {/* CATEGORIES vertical label rotated 90 counterclockwise */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 0',
          pointerEvents: 'none',
          zIndex: 2
        }}
      >
        {"CATEGORIES".split('').map((char, index) => (
          <span
            key={index}
            style={{
              fontSize: '44px',
              fontWeight: 900,
              fontFamily: '"Space Mono", monospace',
              color: isMapDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              lineHeight: '1',
              display: 'block',
              transform: 'rotate(-90deg)'
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* LEFT AREA: HORIZONTALLY AND VERTICALLY DRAGGABLE INFINITE CANVAS */}
      <div
        ref={columnsContainerRef}
        className="no-scrollbar"
        onMouseDown={handleMouseDown}
        style={{
          flex: 1.5,
          overflowX: 'auto',
          overflowY: 'auto',
          position: 'relative',
          borderRight: `1px solid ${theme.borderLight}`,
          height: '100%',
          background: 'transparent', // Made transparent so spinning globe background is visible
          cursor: 'grab',
          zIndex: 3
        }}
      >
        {/* The 2D Canvas */}
        <div
          style={{
            width: '4000px',
            height: '3000px',
            position: 'relative',
            background: 'transparent'
          }}
        >
          {/* SVG connection overlay scrolling natively with the columns */}
          <svg
            ref={svgOverlayRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4000px',
              height: '3000px',
              pointerEvents: 'none',
              zIndex: 4
            }}
          >
            {lines.map(line => {
              const displayColor = adjustColorForContrast(line.color);
              return (
                <g key={line.id}>
                  {/* Right-angle orthogonal connector path */}
                  <path
                    d={line.d}
                    fill="none"
                    stroke={displayColor}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity={line.isRelated ? 0.75 : 0.9}
                  />
                  
                  {/* Source Circle Anchor */}
                  <circle
                    cx={line.x1}
                    cy={line.y1}
                    r="4"
                    fill={isMapDarkMode ? '#ffffff' : '#000000'}
                    stroke={displayColor}
                    strokeWidth="1"
                  />

                  {/* Target Circle Anchor */}
                  <circle
                    cx={line.x2}
                    cy={line.y2}
                    r="3"
                    fill={line.isRelated ? displayColor : (isMapDarkMode ? '#ffffff' : '#000000')}
                  />
                </g>
              );
            })}
          </svg>

        {/* Columns positioned absolutely on the 2D Canvas */}
        {columns.map((column, colIdx) => {
          const selectedNodeId = selectedPath[colIdx];
          const selIdx = column.nodes.findIndex(n => n.id === selectedNodeId);
          const activeSelIdx = selIdx >= 0 ? selIdx : 0;
          const Y_item = activeSelIdx * 40 + 16; // 32px height + 8px gap, center is at 16px
          const colTop = 1500 - Y_item - (colIdx === 0 ? 70 : 0);
          const colLeft = 1200 + colIdx * 300;

          return (
            <div
              key={colIdx}
              style={{
                position: 'absolute',
                left: `${colLeft}px`,
                top: `${colTop}px`,
                width: '260px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 5,
                background: 'transparent'
              }}
            >
              {/* Sticky Search bar for Column 0 (re-styled to match map left sidebar search) */}
              {colIdx === 0 && (
                <div 
                  style={{ 
                    height: '70px',
                    padding: '16px', 
                    boxSizing: 'border-box',
                    borderBottom: 'none', 
                    flexShrink: 0, 
                    zIndex: 100,
                    background: theme.bg
                  }}
                >
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      placeholder="SEARCH DATABASE..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 32px 10px 12px',
                        fontSize: '11px',
                        fontFamily: '"Space Mono", monospace',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: isMapDarkMode ? '#000000' : '#ffffff',
                        color: theme.text
                      }}
                    />
                    {searchQuery && (
                      <motion.button
                        whileHover={{ opacity: 0.7 }}
                        onClick={() => setSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 21
                        }}
                      >
                        <X size={14} color={theme.text} />
                      </motion.button>
                    )}
                  </div>
                </div>
              )}

              {/* Column List Body (no-scrollbar, static layout inside absolute column block) */}
              <div
                className="no-scrollbar"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative'
                }}
              >

              {/* Items Render */}
              {column.nodes.map(node => {
                const isSelected = selectedPath[colIdx] === node.id;
                const isHovered = hoveredTermId === node.id;
                const isMatched = searchQuery.trim() !== '' && searchFilteredData.matchedNodes.has(node.id);
                const nodeColor = colIdx === 0 ? getNodeColor(node) : getRootCategoryColor(node);
                const nodeIcon = getNodeIcon(node);

                const hasChildren = TERM_TREE_DATA.some(c => c.parentId === node.id);

                // Column 0 / Level 0: Main Category terms (style identical to map page sidebar layer list, minus visibility toggle)
                if (colIdx === 0) {
                  return (
                    <div
                      key={node.id}
                      id={`node-pill-${node.id}`}
                      onMouseEnter={() => setHoveredTermId(node.id)}
                      onMouseLeave={() => setHoveredTermId(null)}
                      onClick={() => handleNodeClick(node, colIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0',
                        height: '32px',
                        cursor: 'pointer',
                        background: isSelected
                          ? '#000000'
                          : isHovered
                            ? (isMapDarkMode ? '#222222' : '#f0f0f0')
                            : (isMapDarkMode ? '#1a1a1a' : '#ffffff'),
                        border: `1px solid ${theme.border}`,
                        borderRadius: '16px',
                        boxSizing: 'border-box',
                        color: isSelected ? nodeColor : theme.text, // Text keeps the icon/layer color when clicked
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        zIndex: isSelected ? 15 : 5,
                        boxShadow: isSelected ? `0 0 10px ${nodeColor}44` : 'none'
                      }}
                    >
                      {/* Left icon and text wrapper */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                        <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img
                            src={nodeIcon}
                            style={{ width: '30px', height: '30px' }}
                            alt={node.name}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            lineHeight: '24px',
                            fontWeight: '700',
                            fontFamily: '"Space Mono", monospace',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            opacity: 1,
                            color: isSelected ? nodeColor : theme.text
                          }}
                        >
                          {node.name}
                        </span>
                      </div>

                      {/* Right pointing arrow (matching sidebar expand chevron but pointing right) */}
                      {hasChildren && (
                        <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img
                            src="/icons/icon-arrow-down.svg"
                            style={{
                              width: '30px',
                              height: '30px',
                              transform: 'rotate(-90deg)', // pointing right
                              filter: isSelected ? 'invert(1)' : theme.invert
                            }}
                            alt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  );
                }

                // Columns 1+: Secondary Terms/Themes (look exactly like timeline cards: faded color bg, no icon, no stroke)
                return (
                  <div
                    key={node.id}
                    id={`node-pill-${node.id}`}
                    onMouseEnter={() => setHoveredTermId(node.id)}
                    onMouseLeave={() => setHoveredTermId(null)}
                    onClick={() => handleNodeClick(node, colIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '16px',
                      padding: '0 12px',
                      height: '32px',
                      border: 'none', // No stroke
                      background: (isSelected || isHovered)
                        ? nodeColor // Solid background on hover/selection
                        : `${nodeColor}a6`, // 65% opacity background by default (hex a6 is 65% opacity)
                      color: (isSelected || isHovered)
                        ? '#000000' // Black text on solid background color
                        : (isMatched ? (isMapDarkMode ? '#FFF96A' : '#A78B00') : theme.text),
                      boxShadow: isSelected ? `0 0 8px ${nodeColor}44` : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                      position: 'relative',
                      zIndex: isSelected ? 15 : 5
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: isSelected || isHovered || isMatched ? 700 : 500,
                        fontFamily: '"Space Mono", monospace',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {node.name}
                    </span>

                    {/* Chevron indicators */}
                    {hasChildren && (
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          opacity: 0.6,
                          flexShrink: 0,
                          color: (isSelected || isHovered) ? '#000000' : theme.text,
                          marginLeft: '6px'
                        }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
        </div>
      </div>

      {/* RIGHT AREA: DETAILS PANEL */}
      <div
        style={{
          flex: 1,
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          background: isMapDarkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          zIndex: 15
        }}
      >
        <AnimatePresence mode="wait">
          {activeTermNode ? (
            <motion.div
              key={activeTermNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                height: '100%'
              }}
            >
              {/* Title Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <img
                    src={getNodeIcon(activeTermNode)}
                    alt="icon"
                    style={{ width: '12px', height: '12px' }}
                  />
                  <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: theme.textDim }}>
                    {activeTermNode.layer || 'Taxonomy'}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: '26px',
                    fontWeight: 900,
                    fontFamily: '"Space Mono", monospace',
                    margin: 0,
                    letterSpacing: '1.5px',
                    color: theme.text,
                    textTransform: 'uppercase'
                  }}
                >
                  {activeTermNode.name}
                </h2>
              </div>

              {/* LINGUISTIC TRANSLATIONS HUD */}
              {activeTermNode.translations && activeTermNode.translations.length > 0 && (
                <div
                  style={{
                    border: `1px solid ${theme.borderLight}`,
                    borderRadius: '8px',
                    padding: '16px',
                    background: isMapDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                  }}
                >
                  <h3
                    style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: theme.textDim,
                      margin: '0 0 12px 0'
                    }}
                  >
                    Linguistic Roots & Translations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeTermNode.translations.map((trans, tIdx) => (
                      <div
                        key={tIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '8px',
                          borderBottom: tIdx < activeTermNode.translations!.length - 1 ? `1px dashed ${theme.borderLight}` : 'none',
                          paddingBottom: tIdx < activeTermNode.translations!.length - 1 ? '12px' : '0'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', color: getNodeColor(activeTermNode) }}>
                            {trans.lang}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: theme.text, fontFamily: '"Space Mono", monospace' }}>
                            {trans.translit}
                          </span>
                          <span style={{ fontSize: '10px', fontStyle: 'italic', color: theme.textDim }}>
                            "{trans.meaning}"
                          </span>
                        </div>
                        
                        <div
                          style={{
                            fontSize: '28px',
                            fontWeight: 'bold',
                            color: theme.text,
                            fontFamily: trans.lang === 'Hebrew' ? 'serif' : '"Space Mono", monospace',
                            letterSpacing: '1px'
                          }}
                        >
                          {trans.original}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', color: theme.textDim, margin: 0 }}>
                  Overview
                </h3>
                <p
                  style={{
                    fontSize: '11px',
                    lineHeight: '1.6',
                    margin: 0,
                    color: theme.text,
                    fontFamily: '"Space Mono", monospace',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {activeTermNode.description}
                </p>
              </div>

              {/* BIBLE VERSES / SCRIPTURE REFERENCE HUD */}
              {activeTermNode.bibleVerses && activeTermNode.bibleVerses.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', color: theme.textDim, margin: 0 }}>
                    Scripture References
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeTermNode.bibleVerses.map((verse, vIdx) => {
                      const [quote, citation] = verse.split(' — ');
                      return (
                        <div
                          key={vIdx}
                          style={{
                            borderLeft: `2px solid ${getNodeColor(activeTermNode)}`,
                            paddingLeft: '12px',
                            paddingTop: '2px',
                            paddingBottom: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <span style={{ fontSize: '10.5px', fontStyle: 'italic', lineHeight: '1.5', color: theme.text }}>
                            "{quote}"
                          </span>
                          {citation && (
                            <span style={{ fontSize: '8.5px', fontWeight: 'bold', color: getNodeColor(activeTermNode), letterSpacing: '0.5px' }}>
                              — {citation.toUpperCase()}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CROSS REFERENCES */}
              {activeTermNode.relatedIds && activeTermNode.relatedIds.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', color: theme.textDim, margin: 0 }}>
                    Tied-in & Related Terms
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeTermNode.relatedIds.map(relId => {
                      const relNode = TERM_TREE_DATA.find(t => t.id === relId);
                      if (!relNode) return null;
                      const relColor = getNodeColor(relNode);

                      return (
                        <button
                          key={relId}
                          onClick={() => {
                            const path = getPathToRoot(relId);
                            setSelectedPath(path);
                            
                            setTimeout(() => {
                              const targetPill = document.getElementById(`node-pill-${relId}`);
                              if (targetPill && columnsContainerRef.current) {
                                columnsContainerRef.current.scrollLeft = targetPill.offsetLeft - 100;
                              }
                            }, 100);
                          }}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${relColor}88`,
                            borderRadius: '16px',
                            padding: '4px 12px',
                            fontSize: '9px',
                            color: theme.text,
                            cursor: 'pointer',
                            fontFamily: '"Space Mono", monospace',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = `${relColor}22`;
                            e.currentTarget.style.borderColor = relColor;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = `${relColor}88`;
                          }}
                        >
                          <img
                            src={getNodeIcon(relNode)}
                            alt="rel-icon"
                            style={{ width: '10px', height: '10px' }}
                          />
                          {relNode.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', flexWrap: 'wrap', paddingBottom: '24px' }}>
                {activeTermNode.layer && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onViewOnMap(activeTermNode.layer!, activeTermNode.mapFeatureId || activeTermNode.name)}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      background: 'transparent',
                      color: theme.text,
                      border: `1px solid ${theme.text}`,
                      borderRadius: '16px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      fontFamily: '"Space Mono", monospace',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                      <line x1="9" y1="3" x2="9" y2="18"></line>
                      <line x1="15" y1="6" x2="15" y2="21"></line>
                    </svg>
                    VIEW ON MAP
                  </motion.button>
                )}

                {activeTermNode.timelineId && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onViewOnTimeline(activeTermNode.timelineId!)}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      background: theme.text,
                      color: theme.bg,
                      border: `1px solid ${theme.text}`,
                      borderRadius: '16px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      fontFamily: '"Space Mono", monospace',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    VIEW ON TIMELINE
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textDim, fontSize: '10px', fontFamily: '"Space Mono", monospace', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              SELECT A TERM TO REVIEW DETAILS & TIES
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
