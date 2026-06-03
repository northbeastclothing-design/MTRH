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
  const [isRightCollapsed, setIsRightCollapsed] = useState(true);

  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);

  // Drag velocity and inertia state
  const dragVelocityRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });
  const inertiaFrameRef = useRef<number | null>(null);


  // Derive active selection node (last element in selected path)
  const selectedTermId = selectedPath[selectedPath.length - 1] || null;
  const activeTermId = selectedTermId || hoveredTermId;

  const activeTermNode = useMemo(() => {
    if (!activeTermId) return null;
    return TERM_TREE_DATA.find(t => t.id === activeTermId) || null;
  }, [activeTermId]);

  // Compute terms visible/matched for search query
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

  // Compute search suggestions list for dropdown suggest panel
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    
    return TERM_TREE_DATA.filter(node => {
      const nameMatch = node.name.toLowerCase().includes(query);
      const descMatch = node.description.toLowerCase().includes(query);
      const transMatch = node.translations?.some(t =>
        t.original.toLowerCase().includes(query) ||
        t.translit.toLowerCase().includes(query) ||
        t.meaning.toLowerCase().includes(query)
      );
      const verseMatch = node.bibleVerses?.some(v => v.toLowerCase().includes(query));

      return nameMatch || descMatch || transMatch || verseMatch;
    }).slice(0, 10);
  }, [searchQuery]);

  const getParentPathLabel = (node: TermNode): string => {
    if (!node.parentId) return '';
    const parent = TERM_TREE_DATA.find(n => n.id === node.parentId);
    if (!parent) return '';
    return parent.name;
  };

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
      if (parent) {
        if (parent.layer && LAYER_COLORS[parent.layer]) {
          return LAYER_COLORS[parent.layer];
        }
        // If we reach a root category in the chain, inherit its category color
        if (parent.id === 'biblical-enc') return LAYER_COLORS['Biblical Figures'];
        if (parent.id === 'ufos-anomalies') return LAYER_COLORS['U.F.O. Sightings'];
        if (parent.id === 'cryptids-hauntings') return LAYER_COLORS['Cryptid Sightings'];
        if (parent.id === 'ancient-sites') return LAYER_COLORS['Megaliths'];
        if (parent.id === 'earth-energies') return LAYER_COLORS['Ley Lines'];
      }
      parentId = parent?.parentId;
    }
    
    return LAYER_COLORS['Default'];
  };

  const getRootCategory = (node: TermNode): TermNode => {
    let curr = node;
    while (curr.parentId) {
      const parent = TERM_TREE_DATA.find(n => n.id === curr.parentId);
      if (!parent) break;
      curr = parent;
    }
    return curr;
  };

  const getRootCategoryColor = (node: TermNode): string => {
    return getNodeColor(getRootCategory(node));
  };

  const adjustColorForContrast = (color: string): string => {
    if (isMapDarkMode) return color;
    
    const lower = color.toLowerCase();
    switch (lower) {
      case '#fff96a': // Crop Circles
      case '#fffba6': // Megaliths
        return '#705b00'; // Very dark gold/yellow
      case '#f6e8c1': // Ancient Texts
      case '#ecce81': // Nephilim
        return '#604e1e'; // Dark brown/gold
      case '#c2ffbd': // U.F.O. Sightings
      case '#9ff3bc': // National Parks
        return '#1c521c'; // Dark forest green
      case '#afffec': // Cryptid Sightings
      case '#74f8f3': // Archaeological Finds
        return '#005c5c'; // Dark teal
      case '#baeaf4': // D.U.M.B.'s
        return '#114b59'; // Dark blue-teal
      case '#90c2ff': // Biblical Figures
      case '#bdc4ff': // Ghosts & Hauntings / Blurred
        return '#1c447d'; // Dark navy blue
      case '#ff9be1': // War.gov UFO files 01
      case '#ff5e97': // Ley Lines
        return '#940d3f'; // Dark pink/red
      case '#ff9f63': // Enochian / Meteor Impact
      case '#ffcba6': // Petroglyphs
        return '#803b00'; // Dark rust orange
      case '#d49459': // Biblical Finds
        return '#754215'; // Dark brown-orange
      case '#c6986d': // Bigfoot
        return '#5c3f25'; // Dark chocolate brown
      case '#d3c5fb': // Underworld Entrances
      case '#d29bff': // War.gov UFO files 02
        return '#472280'; // Dark violet/purple
      case '#b6a6ff': // Default / Related
        return '#322280'; // Dark indigo
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
    const rootNodes = TERM_TREE_DATA.filter(n => !n.parentId);
    list.push({ level: 0, title: 'Categories', nodes: rootNodes });

    // Subsequent levels based on active selected path
    for (let i = 0; i < selectedPath.length; i++) {
      const currentId = selectedPath[i];
      const children = TERM_TREE_DATA.filter(n => n.parentId === currentId);
      if (children.length > 0) {
        list.push({
          level: i + 1,
          title: i === 0 ? 'Sub-Themes' : 'Terms',
          nodes: children
        });
      }
    }

    return list;
  }, [selectedPath]);

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
    hasDragged: boolean;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag with left click
    if (e.button !== 0) return;

    // Dismiss search suggestions dropdown on canvas click/drag
    if (searchQuery) {
      setSearchQuery('');
    }

    // Stop any running inertia animation immediately on click
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
    
    // Only drag if clicking on the background, columns container, gaps, or column bodies, not on buttons/inputs
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a')) {
      return;
    }
    
    const container = columnsContainerRef.current;
    if (!container) return;
    
    dragVelocityRef.current = { x: 0, y: 0 };
    lastMousePosRef.current = { x: e.pageX, y: e.pageY, time: performance.now() };
    
    activeDragRef.current = {
      startX: e.pageX,
      startY: e.pageY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
      container,
      hasDragged: false
    };
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

      // Calculate velocity based on change in position over time
      const now = performance.now();
      const dt = now - lastMousePosRef.current.time;
      if (dt > 0) {
        const vx = e.pageX - lastMousePosRef.current.x;
        const vy = e.pageY - lastMousePosRef.current.y;
        dragVelocityRef.current = { x: vx, y: vy };
      }
      lastMousePosRef.current = { x: e.pageX, y: e.pageY, time: now };
      
      // Pan main container horizontally and vertically (Miro board style)
      drag.container.scrollLeft = drag.scrollLeft - deltaX;
      drag.container.scrollTop = drag.scrollTop - deltaY;
    };

    const handleMouseUp = () => {
      const drag = activeDragRef.current;
      if (drag) {
        if (drag.hasDragged) {
          document.body.classList.remove('is-grabbing');

          // Trigger inertia scroll if velocity is high enough
          const container = drag.container;
          let { x: vx, y: vy } = dragVelocityRef.current;
          
          const maxVel = 40;
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > maxVel) {
            vx = (vx / speed) * maxVel;
            vy = (vy / speed) * maxVel;
          }
          
          const friction = 0.95; // Decay factor
          
          const runInertia = () => {
            if (Math.abs(vx) < 0.25 && Math.abs(vy) < 0.25) {
              inertiaFrameRef.current = null;
              return;
            }
            
            container.scrollLeft -= vx;
            container.scrollTop -= vy;
            
            vx *= friction;
            vy *= friction;
            
            inertiaFrameRef.current = requestAnimationFrame(runInertia);
          };
          
          if (Math.abs(vx) > 1 || Math.abs(vy) > 1) {
            inertiaFrameRef.current = requestAnimationFrame(runInertia);
          }
          
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
      if (inertiaFrameRef.current !== null) {
        cancelAnimationFrame(inertiaFrameRef.current);
      }
    };
  }, []);

  // Disable native browser wheel scrolling and native drag-and-drop
  useEffect(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Stop any running drag inertia animation immediately on scrollwheel action
      if (inertiaFrameRef.current !== null) {
        cancelAnimationFrame(inertiaFrameRef.current);
        inertiaFrameRef.current = null;
      }

      let dy = e.deltaY;
      let dx = e.deltaX;
      if (e.deltaMode === 1) { // Line mode
        dy *= 20;
        dx *= 20;
      } else if (e.deltaMode === 2) { // Page mode
        dy *= 800;
        dx *= 800;
      }

      container.scrollTop += dy;
      container.scrollLeft += dx;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('dragstart', handleDragStart);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('dragstart', handleDragStart);
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
      
      // If the sidebar is expanded (not collapsed), offset the center to the left
      const sidebarOffset = isRightCollapsed ? 0 : 300;
      const targetScrollLeft = colCenterX - (viewportWidth - sidebarOffset) / 2;
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
  }, [selectedPath, columns, isRightCollapsed]);

  // Automatically expand sidebar when a term is selected
  useEffect(() => {
    if (selectedTermId) {
      setIsRightCollapsed(false);
    }
  }, [selectedTermId]);

  // Poll line positions during slide transitions to ensure SVG paths follow animated columns in real-time
  useEffect(() => {
    let startTime = performance.now();
    let frameId: number;

    const poll = (now: number) => {
      updateLines();
      if (now - startTime < 400) { // Poll for 400ms matching transition duration
        frameId = requestAnimationFrame(poll);
      }
    };

    frameId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(frameId);
  }, [selectedPath]);

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
        /* Disable text selection inside the columns container to ensure smooth dragging */
        .drag-container-select-none {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        .search-suggestion-item {
          padding: 10px 12px;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          border-bottom: 1px solid var(--border-light);
        }
        .search-suggestion-item:last-child {
          border-bottom: none;
        }
        .search-suggestion-item:hover {
          background: var(--hover-bg) !important;
        }
      `}</style>

      {/* FLOATING SEARCH BAR IN THE TOP LEFT (separate from canvas) */}
      <div 
        style={{ 
          position: 'absolute',
          top: '20px',
          left: '32px',
          width: '260px',
          zIndex: 10,
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          padding: '4px 8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '40px',
          ...({
            '--hover-bg': isMapDarkMode ? '#222222' : '#f5f5f5',
            '--border-light': theme.borderLight
          } as React.CSSProperties)
        }}
      >
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="SEARCH DATABASE..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 24px 8px 8px',
              fontSize: '11px',
              fontFamily: '"Space Mono", monospace',
              border: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'transparent',
              color: theme.text
            }}
          />
          {searchQuery && (
            <motion.button
              whileHover={{ opacity: 0.7 }}
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '4px',
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

        {/* Suggestion Dropdown Panel */}
        {searchQuery.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '39px', // align right under the border
              left: '-1px',
              width: '260px',
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              borderTop: 'none',
              maxHeight: '260px',
              overflowY: 'auto',
              zIndex: 11,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {searchSuggestions.length > 0 ? (
              searchSuggestions.map(node => {
                const parentLabel = getParentPathLabel(node);
                return (
                  <div
                    key={node.id}
                    className="search-suggestion-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const path = getPathToRoot(node.id);
                      setSelectedPath(path);
                      setSearchQuery('');
                    }}
                  >
                      <span style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        fontFamily: '"Space Mono", monospace',
                        color: theme.text,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}>
                        {node.name}
                      </span>
                      {parentLabel && (
                        <span style={{
                          fontSize: '8px',
                          fontFamily: '"Space Mono", monospace',
                          color: theme.textDim,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          marginTop: '2px'
                        }}>
                          IN {parentLabel}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{
                  padding: '12px 16px',
                  fontSize: '9px',
                  fontFamily: '"Space Mono", monospace',
                  color: theme.textDim,
                  letterSpacing: '0.5px'
                }}>
                  NO MATCHES FOUND
                </div>
              )}
            </motion.div>
          )}
      </div>

      {/* LEFT AREA: HORIZONTALLY AND VERTICALLY DRAGGABLE INFINITE CANVAS */}
      <div
        ref={columnsContainerRef}
        className="no-scrollbar drag-container-select-none"
        onMouseDown={handleMouseDown}
        style={{
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'hidden',
          position: 'relative',
          background: 'rgba(0, 0, 0, 0)', // Use zero opacity color to ensure pointer event capture in all browsers
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
          {/* SVG connection overlay (background lines) scrolling natively with the columns */}
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
            {lines.map(line => (
              <path
                key={line.id}
                d={line.d}
                fill="none"
                stroke={theme.text}
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity={line.isRelated ? 0.6 : 0.8}
              />
            ))}
          </svg>

        {/* Columns positioned absolutely on the 2D Canvas */}
        <AnimatePresence>
          {columns.map((column, colIdx) => {
            const selectedNodeId = selectedPath[colIdx];
            const selIdx = column.nodes.findIndex(n => n.id === selectedNodeId);
            const activeSelIdx = selIdx >= 0 ? selIdx : 0;
            const Y_item = activeSelIdx * 40 + 16; // 32px height + 8px gap, center is at 16px
            const colTop = 1500 - Y_item;
            const colLeft = 1200 + colIdx * 300;

            return (
              <motion.div
                key={colIdx}
                initial={{ opacity: 0, x: 25 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  top: `${colTop}px`
                }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ 
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1] // Apple-style fluid deceleration ease-out curve
                }}
                style={{
                  position: 'absolute',
                  left: `${colLeft}px`,
                  width: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 5,
                  background: 'transparent'
                }}
              >
                {/* Column 0 Blurb (says click a category to dive deeper, fades out on click) */}
                {colIdx === 0 && (
                  <AnimatePresence>
                    {selectedPath.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: 0,
                          right: 0,
                          marginBottom: '16px',
                          padding: '12px 16px',
                          border: `1px dashed ${theme.borderLight}`,
                          borderRadius: '8px',
                          background: isMapDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          textAlign: 'center',
                          pointerEvents: 'none'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            fontFamily: '"Space Mono", monospace',
                            color: theme.textDim,
                            lineHeight: '1.4',
                            display: 'block'
                          }}
                        >
                          SELECT A CATEGORY BELOW TO DIVE DEEPER INTO THE TAXONOMY AND EXPLORE CONNECTIONS.
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                              draggable={false}
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
                              draggable={false}
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
                          : theme.text,
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
                          fontWeight: isSelected || isHovered ? 700 : 500,
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
            </motion.div>
          )})}
        </AnimatePresence>

        {/* SVG anchor dots overlay (foreground dots) rendered on top of columns */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4000px',
            height: '3000px',
            pointerEvents: 'none',
            zIndex: 6
          }}
        >
          {lines.map(line => (
            <g key={`dots-${line.id}`}>
              {/* Source Circle Anchor */}
              <circle
                cx={line.x1}
                cy={line.y1}
                r="4"
                fill={theme.text}
              />

              {/* Target Circle Anchor */}
              <circle
                cx={line.x2}
                cy={line.y2}
                r="3"
                fill={theme.text}
              />
            </g>
          ))}
        </svg>
        </div>
      </div>

      {/* RIGHT SIDEBAR: DOSSIER SIDEBAR WINDOW PANEL */}
      <motion.div 
        initial={false}
        animate={{ 
          right: isRightCollapsed ? -280 : 0,
          background: isMapDarkMode ? 'rgba(10, 10, 10, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: theme.border,
          opacity: 1
        }}
        transition={{ 
          right: { type: 'spring', stiffness: 240, damping: 28 },
          default: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }}
        style={{ 
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '300px',
          borderLeft: `1px solid ${theme.border}`,
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'visible', 
          zIndex: 15, 
          fontFamily: '"Space Mono", monospace',
          pointerEvents: 'auto',
          color: theme.text,
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* ABSOLUTE POSITIONED FIXED TAB FOR RIGHT SIDEBAR */}
        <motion.button 
          whileHover={{ opacity: 0.8 }}
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          title={isRightCollapsed ? "Maximize Dossier" : "Minimize Dossier"}
          style={{
            position: 'absolute',
            top: '-1px',
            left: '-20px',
            width: '20px',
            height: '41px',
            background: theme.text,
            color: theme.bg,
            border: 'none',
            cursor: 'pointer',
            zIndex: 25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
        >
          <img 
            src="/icons/icon-arrow-left.svg" 
            alt="toggle" 
            style={{ 
              width: '6px', 
              height: '12px', 
              transform: isRightCollapsed ? 'none' : 'rotate(180deg)',
              filter: theme.invert
            }} 
            draggable={false}
          />
        </motion.button>

        <AnimatePresence mode="wait">
          {activeTermNode ? (
            <motion.div 
              key={activeTermNode.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'left' }}
            >
              {/* Header Top Bar */}
              <div style={{ 
                height: '40px', 
                padding: '0 16px', 
                borderBottom: `1px solid ${theme.border}`, 
                display: 'flex', 
                alignItems: 'center', 
                background: theme.bg, 
                flexShrink: 0 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {(() => {
                    const rootCat = getRootCategory(activeTermNode);
                    return (
                      <>
                        <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={getNodeIcon(rootCat)} 
                            style={{ width: '30px', height: '30px' }} 
                            alt="category-icon" 
                            draggable={false}
                          />
                        </div>
                        <span style={{ 
                          fontWeight: '700', 
                          fontSize: '11px', 
                          letterSpacing: '1px', 
                          fontFamily: '"Space Mono", monospace',
                          color: theme.text
                        }}>
                          {rootCat.name.toUpperCase()}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Scrollable details area */}
              <div 
                className="no-scrollbar" 
                style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  overflowX: 'hidden', 
                  textAlign: 'left', 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '24px',
                  paddingBottom: '40px' 
                }}
              >
                {/* Title */}
                <div>
                  <h1 style={{ 
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: '400', 
                    fontSize: '24px', 
                    lineHeight: '28px',
                    color: theme.text, 
                    margin: '0 0 8px 0', 
                    textAlign: 'left', 
                    letterSpacing: '-0.5px',
                    textTransform: 'uppercase'
                  }}>
                    {activeTermNode.name}
                  </h1>
                </div>

                {/* Tag Pills (Related terms looking like map categories tags) */}
                {activeTermNode.relatedIds && activeTermNode.relatedIds.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px', justifyContent: 'flex-start' }}>
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
                          }}
                          title={`Navigate to ${relNode.name}`}
                          style={{ 
                            height: '24px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '10px', 
                            fontWeight: '400', 
                            padding: '0 12px', 
                            borderRadius: '12px', 
                            background: relColor, 
                            border: 'none',
                            color: '#000000',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: '"Space Mono", monospace',
                            transition: 'transform 0.1s ease, box-shadow 0.1s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          {relNode.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Images Carousel */}
                {activeTermNode.images && activeTermNode.images.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
                      {activeTermNode.images.map((imgUrl, imgIdx) => (
                        <div 
                          key={imgIdx} 
                          style={{ 
                            flexShrink: 0, 
                            width: activeTermNode.images!.length === 1 ? '100%' : '85%', 
                            height: '160px', 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            border: `1px solid ${theme.borderLight}`,
                            background: isMapDarkMode ? '#111' : '#f9f9f9',
                            position: 'relative'
                          }}
                        >
                          <img
                            src={imgUrl}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            alt={`${activeTermNode.name} - image ${imgIdx}`}
                            draggable={false}
                            onError={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.style.display = 'none';
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linguistic Translations */}
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
                        fontFamily: '"Space Mono", monospace',
                        fontWeight: '700',
                        fontSize: '11px',
                        lineHeight: '22px',
                        textTransform: 'uppercase',
                        color: theme.text,
                        margin: '0 0 12px 0'
                      }}
                    >
                      Linguistic Roots
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
                            <span style={{ fontSize: '8.5px', fontWeight: 'bold', textTransform: 'uppercase', color: adjustColorForContrast(getRootCategoryColor(activeTermNode)), letterSpacing: '0.5px' }}>
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
                              fontSize: '24px',
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
                <div style={{ paddingTop: '0', textAlign: 'left' }}>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontSize: '11px', lineHeight: '22px', textTransform: 'uppercase' }}>
                    DESCRIPTION:
                  </div>
                  <p style={{ 
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: '400',
                    fontSize: '10px', 
                    lineHeight: '22px', 
                    color: theme.text,
                    marginTop: '4px', 
                    whiteSpace: 'pre-line', 
                    textAlign: 'left' 
                  }}>
                    {activeTermNode.description}
                  </p>
                </div>

                {/* Scripture references */}
                {activeTermNode.bibleVerses && activeTermNode.bibleVerses.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontSize: '11px', lineHeight: '22px', textTransform: 'uppercase' }}>
                      SCRIPTURE REFERENCES:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activeTermNode.bibleVerses.map((verse, vIdx) => {
                        const [quote, citation] = verse.split(' — ');
                        return (
                          <div
                            key={vIdx}
                            style={{
                              borderLeft: `2px solid ${getRootCategoryColor(activeTermNode)}`,
                              paddingLeft: '12px',
                              paddingTop: '2px',
                              paddingBottom: '2px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}
                          >
                            <span style={{ fontSize: '10px', fontStyle: 'italic', lineHeight: '1.5', color: theme.text }}>
                              "{quote}"
                            </span>
                            {citation && (() => {
                              const urlRegex = /(https?:\/\/[^\s\)]+)/g;
                              const match = citation.match(urlRegex);
                              if (match) {
                                const url = match[0];
                                const displayText = citation.replace(`(${url})`, '').trim();
                                return (
                                  <span style={{ fontSize: '8.5px', fontWeight: 'bold', color: adjustColorForContrast(getRootCategoryColor(activeTermNode)), letterSpacing: '0.5px' }}>
                                    — {displayText.toUpperCase()}{' '}
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: adjustColorForContrast(getRootCategoryColor(activeTermNode)),
                                        textDecoration: 'underline',
                                        opacity: 0.85,
                                        marginLeft: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      [LINK]
                                    </a>
                                  </span>
                                );
                              }
                              return (
                                <span style={{ fontSize: '8.5px', fontWeight: 'bold', color: adjustColorForContrast(getRootCategoryColor(activeTermNode)), letterSpacing: '0.5px' }}>
                                  — {citation.toUpperCase()}
                                </span>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Primary Sources & Ancient Texts */}
                {activeTermNode.sources && activeTermNode.sources.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontSize: '11px', lineHeight: '22px', textTransform: 'uppercase', color: theme.text }}>
                      PRIMARY SOURCES & ANCIENT TEXTS:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {activeTermNode.sources.map((source, sIdx) => {
                        const rootColor = getRootCategoryColor(activeTermNode);
                        return (
                          <div
                            key={sIdx}
                            style={{
                              fontFamily: '"Space Mono", monospace',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: `${rootColor}15`,
                              border: `1px solid ${rootColor}30`,
                              color: adjustColorForContrast(rootColor),
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {source.toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions view on map, etc. */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px' }}>
                  {activeTermNode.layer && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onViewOnMap(activeTermNode.layer!, activeTermNode.mapFeatureId || activeTermNode.name)}
                      style={{
                        width: '100%',
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
                        width: '100%',
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
              </div>
            </motion.div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textDim, fontSize: '10px', fontFamily: '"Space Mono", monospace', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '24px', textAlign: 'center' }}>
              SELECT A TERM TO REVIEW DETAILS & TIES
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
