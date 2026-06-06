import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flag } from 'lucide-react';
import { TERM_TREE_DATA, TermNode, TranslationInfo } from './termTreeData';
import { TIMELINE_LOCATIONS } from './timelineData';

interface CodexPageProps {
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
  onFlagItem?: (item: TermNode) => void;
  onSelectedTermChange?: (node: TermNode | null) => void;
  focusedTermId?: string | null;
  onFocusedTermConsumed?: () => void;
}

const LAYER_COLORS: Record<string, string> = {
  'War.gov UFO files 01': '#FF9BE1',
  'War.gov UFO files 02': '#D29BFF',
  'Enochian Sites': '#FF9F63',
  'Giants & Nephilim': '#ECCE81',
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
  'Secret Government Programs': '#FF5C5C',
  'Default': '#b6a6ff'
};

const LAYER_ICONS: Record<string, string> = {
  'War.gov UFO files 01': '/icons/icon-dept-war.svg',
  'War.gov UFO files 02': '/icons/icon-dept-war-02.svg',
  'Enochian Sites': '/icons/icon-enochian-lore.svg',
  'Giants & Nephilim': '/icons/icon-giants.svg',
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
  'Secret Government Programs': '/icons/icon-secret-government-programs.svg',
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
  isDottedParentLink?: boolean;
}

const MISSING_IMAGE_URL = '/icons/icon-missing-image.svg';

const cleanAndProxyImageUrl = (url: any) => {
  if (!url || typeof url !== 'string') return MISSING_IMAGE_URL;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl.includes('icon-missing-image.svg')) return MISSING_IMAGE_URL;
  
  if (
    trimmedUrl.startsWith('/api/proxy') || 
    trimmedUrl.startsWith('data:') || 
    trimmedUrl.startsWith('blob:')
  ) {
    return trimmedUrl;
  }

  const lowerUrl = trimmedUrl.toLowerCase();
  const isWiki = lowerUrl.includes('wikimedia.org') || lowerUrl.includes('wikipedia.org');
  
  if (
    isWiki ||
    lowerUrl.includes('unsplash.com') ||
    lowerUrl.includes('cloudfront.net') ||
    lowerUrl.includes('wonders-of-the-world.net') ||
    lowerUrl.includes('circleresearcharchive.com')
  ) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith('http')) {
    return `/api/proxy-resource?url=${encodeURIComponent(trimmedUrl)}`;
  }

  return trimmedUrl;
};

export default function CodexPage({
  theme,
  isMapDarkMode,
  onViewOnMap,
  onViewOnTimeline,
  onFlagItem,
  onSelectedTermChange,
  focusedTermId,
  onFocusedTermConsumed
}: CodexPageProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lines, setLines] = useState<SVGLinePath[]>([]);
  const [scrollSize, setScrollSize] = useState({ width: 0, height: 0 });
  const [isRightCollapsed, setIsRightCollapsed] = useState(true);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [isImageLoading, setIsImageLoading] = useState(false);

  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

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

  const activeRootColor = useMemo(() => {
    const rootCatNode = selectedPath[0] ? TERM_TREE_DATA.find(n => n.id === selectedPath[0]) : null;
    return rootCatNode ? getNodeColor(rootCatNode) : (activeTermNode ? getRootCategoryColor(activeTermNode) : '#b6a6ff');
  }, [selectedPath, activeTermNode]);

  const resolvedMapInfo = useMemo(() => {
    if (!activeTermNode) return null;

    // 1. If it has a timelineId and it exists in TIMELINE_LOCATIONS, use that location's category and the term name
    if (activeTermNode.timelineId && TIMELINE_LOCATIONS[activeTermNode.timelineId]) {
      const loc = TIMELINE_LOCATIONS[activeTermNode.timelineId];
      return {
        layer: loc.category,
        featureSearchTerm: activeTermNode.timelineId
      };
    }

    // 2. If the node has an explicit layer defined, map it
    if (activeTermNode.layer) {
      let layerName = activeTermNode.layer;
      if (layerName === 'biblical-patriarchs' || layerName === 'royal-bloodlines' || layerName === 'merovingian-bloodlines' || layerName === 'sumerian-kings' || layerName === 'greek-mythology') {
        if (layerName === 'biblical-patriarchs') layerName = 'Biblical Figures';
        else if (layerName === 'royal-bloodlines' || layerName === 'merovingian-bloodlines') layerName = 'Biblical Figures';
        else if (layerName === 'sumerian-kings') layerName = 'Archaeological Finds';
        else if (layerName === 'greek-mythology') layerName = 'Archaeological Finds';
      }
      return {
        layer: layerName,
        featureSearchTerm: activeTermNode.mapFeatureId || activeTermNode.id || activeTermNode.name
      };
    }

    // 3. Otherwise, walk up the hierarchy of parent terms to find an inherited layer
    let curr = activeTermNode;
    while (curr.parentId) {
      const parent = TERM_TREE_DATA.find(n => n.id === curr.parentId);
      if (!parent) break;
      if (parent.layer) {
        let layerName = parent.layer;
        if (layerName === 'biblical-patriarchs' || layerName === 'royal-bloodlines' || layerName === 'merovingian-bloodlines' || layerName === 'sumerian-kings' || layerName === 'greek-mythology') {
          if (layerName === 'biblical-patriarchs') layerName = 'Biblical Figures';
          else if (layerName === 'royal-bloodlines' || layerName === 'merovingian-bloodlines') layerName = 'Biblical Figures';
          else if (layerName === 'sumerian-kings') layerName = 'Archaeological Finds';
          else if (layerName === 'greek-mythology') layerName = 'Archaeological Finds';
        }
        return {
          layer: layerName,
          featureSearchTerm: activeTermNode.mapFeatureId || activeTermNode.id || activeTermNode.name
        };
      }
      curr = parent;
    }

    return null;
  }, [activeTermNode]);

  useEffect(() => {
    if (onSelectedTermChange) {
      onSelectedTermChange(activeTermNode);
    }
  }, [activeTermNode, onSelectedTermChange]);

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

  // Handle external focus on a specific term
  useEffect(() => {
    if (focusedTermId) {
      const path = getPathToRoot(focusedTermId);
      if (path.length > 0) {
        setSelectedPath(path);
        setIsRightCollapsed(false);
      }
      if (onFocusedTermConsumed) {
        onFocusedTermConsumed();
      }
    }
  }, [focusedTermId, onFocusedTermConsumed]);

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
  function getNodeColor(node: TermNode): string {
    let curr = node;
    while (curr.parentId) {
      const parent = TERM_TREE_DATA.find(n => n.id === curr.parentId);
      if (!parent) break;
      curr = parent;
    }

    if (curr.id === 'biblical-apocryphal') return '#90C2FF'; // Blue (Biblical Figures)
    if (curr.id === 'megaliths-structures') return '#FFFBA6'; // Yellow/Gold (Megaliths)
    if (curr.id === 'supernatural-anomalies') return '#C2FFBD'; // Green (U.F.O. Sightings)
    if (curr.id === 'secret-government-programs') return '#FF5C5C'; // Red (Secret Government Programs)
    
    return LAYER_COLORS['Default'];
  }

  function getRootCategory(node: TermNode): TermNode {
    let curr = node;
    while (curr.parentId) {
      const parent = TERM_TREE_DATA.find(n => n.id === curr.parentId);
      if (!parent) break;
      curr = parent;
    }
    return curr;
  }

  function getRootCategoryColor(node: TermNode): string {
    return getNodeColor(getRootCategory(node));
  }

  function adjustColorForContrast(color: string): string {
    if (isMapDarkMode) return color;
    
    const lower = color.toLowerCase();
    switch (lower) {
      case '#fff96a': // Crop Circles
      case '#fffba6': // Megaliths
        return '#705b00'; // Very dark gold/yellow
      case '#f6e8c1': // Ancient Texts
      case '#ecce81': // Giants & Nephilim
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
      case '#ff5c5c': // Secret Government Programs
        return '#b31b1b'; // Dark red/crimson
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
  }

  const getNodeIcon = (node: TermNode): string => {
    if (node.id === 'biblical-apocryphal') return LAYER_ICONS['Biblical Figures'];
    if (node.id === 'megaliths-structures') return LAYER_ICONS['Megaliths'];
    if (node.id === 'supernatural-anomalies') return LAYER_ICONS['U.F.O. Sightings'];
    if (node.id === 'secret-government-programs') return LAYER_ICONS['Secret Government Programs'];

    if (node.layer && LAYER_ICONS[node.layer]) {
      return LAYER_ICONS[node.layer];
    }
    let parentId = node.parentId;
    while (parentId) {
      if (parentId === 'biblical-apocryphal') return LAYER_ICONS['Biblical Figures'];
      if (parentId === 'megaliths-structures') return LAYER_ICONS['Megaliths'];
      if (parentId === 'supernatural-anomalies') return LAYER_ICONS['U.F.O. Sightings'];
      if (parentId === 'secret-government-programs') return LAYER_ICONS['Secret Government Programs'];

      const parent = TERM_TREE_DATA.find(n => n.id === parentId);
      if (parent && parent.layer && LAYER_ICONS[parent.layer]) {
        return LAYER_ICONS[parent.layer];
      }
      parentId = parent?.parentId;
    }
    
    return LAYER_ICONS['Default'];
  };

  const hasCanonicalConnection = (node: TermNode): boolean => {
    // Explicit list of terms/categories that are found in the Bible but also have isApocryphal: true
    const biblicalExclusions = ['fallen-angel', 'demons', 'nephilim-br', 'watchers', 'giants'];
    if (biblicalExclusions.includes(node.id)) return true;

    // Check if it has any canonical bible verses
    if (node.bibleVerses && node.bibleVerses.length > 0) {
      const canonicalBooks = [
        'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
        '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
        'Job', 'Psalms', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
        'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
        'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
        'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
        'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
        'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
      ];
      
      const hasCanonicalVerse = node.bibleVerses.some(verse => {
        const parts = verse.split(' — ');
        if (parts.length < 2) return false;
        const citation = parts[1].toLowerCase();
        
        // Check if citation mentions a canonical book
        const hasBook = canonicalBooks.some(book => citation.includes(book.toLowerCase()));
        if (!hasBook) return false;
        
        // Exclude apocryphal books that might contain the name (e.g. Enoch, Jubilees, etc.)
        const isApocryphalWord = 
          citation.includes('enoch') || 
          citation.includes('giants') || 
          citation.includes('jubilees') || 
          citation.includes('jasher') || 
          citation.includes('gospel of thomas') || 
          citation.includes('gospel of peter') || 
          citation.includes('gospel of mary') || 
          citation.includes('gospel of judas') ||
          citation.includes('apocalypse of') ||
          citation.includes('maccabees') ||
          citation.includes('esdras') ||
          citation.includes('tobit') ||
          citation.includes('judith') ||
          citation.includes('wisdom of solomon') ||
          citation.includes('sirach') ||
          citation.includes('baruch');
          
        return !isApocryphalWord;
      });
      
      if (hasCanonicalVerse) return true;
    }

    // Check if sources mention canonical scripture, bible, or any of the biblical books
    if (node.sources && node.sources.length > 0) {
      const canonicalKeywords = [
        'canonical', 'bible', 'gospel', 'testament', 'scripture',
        'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth',
        'samuel', 'kings', 'chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalm', 'proverb',
        'ecclesiastes', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel',
        'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah',
        'malachi', 'matthew', 'mark', 'luke', 'john', 'acts', 'romans', 'corinthians', 'galatians',
        'ephesians', 'philippians', 'colossians', 'thessalonians', 'timothy', 'titus', 'philemon',
        'hebrews', 'james', 'peter', 'jude', 'revelation'
      ];
      
      const hasCanonicalSource = node.sources.some(s => {
        const lower = s.toLowerCase();
        
        // Exclude apocryphal specific mentions
        if (lower.includes('enoch') || lower.includes('giants') || lower.includes('jubilees') || lower.includes('apocryphal texts only')) {
          return false;
        }
        
        return canonicalKeywords.some(keyword => lower.includes(keyword));
      });
      
      if (hasCanonicalSource) return true;
    }

    // Check description for explicit "found in the bible" or "canonical"
    if (node.description) {
      const lowerDesc = node.description.toLowerCase();
      if (lowerDesc.includes('canonical scripture') || 
          lowerDesc.includes('in the bible') || 
          lowerDesc.includes('biblical narrative') || 
          lowerDesc.includes('mentioned in the bible') ||
          lowerDesc.includes('mentioned in genesis') ||
          lowerDesc.includes('book of revelation') ||
          lowerDesc.includes('book of daniel') ||
          lowerDesc.includes('book of genesis')) {
        return true;
      }
    }

    return false;
  };

  const isOnlyApocryphal = (node: TermNode): boolean => {
    if (!node.isApocryphal) return false;
    
    // Genuinely biblical terms that also have isApocryphal: true will list 'Bible' in their sources
    const hasBibleSource = node.sources?.some(s => s.toLowerCase() === 'bible');
    if (hasBibleSource) return false;
    
    const biblicalExclusions = ['fallen-angel', 'demons', 'nephilim-br', 'watchers', 'giants'];
    if (biblicalExclusions.includes(node.id)) return false;
    
    return true;
  };

  // Helper to trace term depth level dynamically based on active rendering columns
  const getNodeLevel = (node: TermNode): number => {
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].nodes.some(n => n.id === node.id)) {
        return i;
      }
    }
    
    // Fallback if not found in active rendered columns
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
    const rootNodes = TERM_TREE_DATA.filter(n => !n.parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
    list.push({ level: 0, title: 'Categories', nodes: rootNodes });

    // Subsequent levels based on active selected path
    for (let i = 0; i < selectedPath.length; i++) {
      const currentId = selectedPath[i];
      const children = TERM_TREE_DATA.filter(n => n.parentId === currentId || n.secondaryParentIds?.includes(currentId))
        .sort((a, b) => a.name.localeCompare(b.name));
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
                color: activeRootColor,
                isRelated: true
              });
            }
          }
        });
      }

      // 3. Draw Parent & Secondary Parent connections (attaching to categories/sub-categories they are linked to)
      if (activeNode && activeEl) {
        const activeRect = activeEl.getBoundingClientRect();
        const activeLevel = getNodeLevel(activeNode);
        const parentIds: string[] = [];
        if (activeNode.parentId) {
          parentIds.push(activeNode.parentId);
        }
        if (activeNode.secondaryParentIds) {
          parentIds.push(...activeNode.secondaryParentIds);
        }

        // Collect all terms currently rendered in the active columns
        const renderedIds = new Set<string>();
        columns.forEach(col => col.nodes.forEach(n => renderedIds.add(n.id)));

        parentIds.forEach(pId => {
          if (renderedIds.has(pId)) {
            // Check if there is already a line connecting them in paths (e.g. selection path)
            const alreadyHasLine = paths.some(p => p.id === `path-${pId}-${activeTermId}` || p.id === `path-${activeTermId}-${pId}`);
            if (alreadyHasLine) return;

            const parentEl = document.getElementById(`node-pill-${pId}`);
            const parentNode = TERM_TREE_DATA.find(n => n.id === pId);

            if (parentEl && parentNode) {
              const parentRect = parentEl.getBoundingClientRect();
              const parentLevel = getNodeLevel(parentNode);

              let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
              let pathData = '';

              // Different columns: connect right-side of left element to left-side of right element
              const isParentToChild = parentLevel < activeLevel;
              const leftElRect = isParentToChild ? parentRect : activeRect;
              const rightElRect = isParentToChild ? activeRect : parentRect;

              x1 = leftElRect.right - containerRect.left + container.scrollLeft;
              y1 = leftElRect.top + leftElRect.height / 2 - containerRect.top + container.scrollTop;

              x2 = rightElRect.left - containerRect.left + container.scrollLeft;
              y2 = rightElRect.top + rightElRect.height / 2 - containerRect.top + container.scrollTop;

              const xMid = rightElRect.left - 20 - containerRect.left + container.scrollLeft;
              pathData = `M ${x1} ${y1} H ${xMid} V ${y2} H ${x2}`;

              const parentColor = getRootCategoryColor(parentNode);

              paths.push({
                id: `parentLink-${activeTermId}-${pId}`,
                d: pathData,
                x1,
                y1,
                x2,
                y2,
                color: parentColor,
                isRelated: false,
                isDottedParentLink: true
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

  // Parallax grid background effect linked to drag/scroll position
  useEffect(() => {
    const container = columnsContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollTop = container.scrollTop;
      const ratio = 0.7; // moves at 70% of canvas speed (30% lag)
      const x = scrollLeft * (1 - ratio);
      const y = scrollTop * (1 - ratio);
      canvas.style.backgroundPosition = `${x}px ${y}px`;
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
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

  useEffect(() => {
    setActiveImageIndex(0);
    setIsImageLoading(true);
  }, [activeTermId]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeTermNode || !activeTermNode.images) return;
    setActiveImageIndex(prev => 
      prev === 0 ? activeTermNode.images!.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeTermNode || !activeTermNode.images) return;
    setActiveImageIndex(prev => 
      prev === activeTermNode.images!.length - 1 ? 0 : prev + 1
    );
  };

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

  const minorLines = [30, 60, 90, 120, 150, 180, 210, 240, 270];
  const minorStroke = isMapDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const majorStroke = isMapDarkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)';

  const svgGrid = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
  ${minorLines.map(pos => `
    <line x1="${pos}" y1="0" x2="${pos}" y2="300" stroke="${minorStroke}" stroke-dasharray="2,2" />
    <line x1="0" y1="${pos}" x2="300" y2="${pos}" stroke="${minorStroke}" stroke-dasharray="2,2" />
  `).join('')}
  <line x1="0" y1="0" x2="0" y2="300" stroke="${majorStroke}" stroke-dasharray="4,4" />
  <line x1="0" y1="0" x2="300" y2="0" stroke="${majorStroke}" stroke-dasharray="4,4" />
</svg>
`)}`;

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
          ref={canvasRef}
          style={{
            width: '4000px',
            height: '3000px',
            position: 'relative',
            backgroundImage: `url("${svgGrid}")`,
            backgroundRepeat: 'repeat'
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
            {lines.map(line => {
              const isDotted = line.isRelated || line.isDottedParentLink;
              return (
                <path
                  key={line.id}
                  d={line.d}
                  fill="none"
                  stroke={theme.text}
                  strokeWidth="2"
                  strokeDasharray={isDotted ? "4,4" : "none"}
                  opacity={line.isRelated ? 0.6 : (line.isDottedParentLink ? 0.75 : 0.85)}
                />
              );
            })}
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
                  const nodeColor = colIdx === 0 ? getNodeColor(node) : activeRootColor;
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
                          color: isSelected ? '#ffffff' : theme.text, // Text is white when selected over black background
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
                              color: isSelected ? '#ffffff' : theme.text
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
                      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                        {isOnlyApocryphal(node) && (
                          <span 
                            title="Apocryphal / Non-Canonical" 
                            style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              lineHeight: '1',
                              fontWeight: '900',
                              color: isSelected || isHovered 
                                ? '#000000' 
                                : (isMapDarkMode ? '#ffffff' : '#000000'),
                              marginLeft: '6px',
                              flexShrink: 0
                            }}
                          >
                            ✖
                          </span>
                        )}
                      </div>

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
          right: isRightCollapsed ? -280 : 20,
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
                  display: 'flex', 
                  flexDirection: 'column', 
                  paddingBottom: '40px' 
                }}
              >
                {/* Image Gallery at the very top (styled like map page dossier) */}
                {activeTermNode.images && activeTermNode.images.length > 0 && (
                  <div style={{ width: '100%', position: 'relative', borderBottom: `1px solid ${theme.border}`, flexShrink: 0 }}>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '260px', 
                        backgroundColor: isMapDarkMode ? '#0a0a0a' : '#f0f0f0', 
                        overflow: 'hidden', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        position: 'relative'
                      }}
                    >
                      {(() => {
                        const imgUrl = activeTermNode.images[activeImageIndex];
                        if (!imgUrl) return null;

                        const isBroken = !!brokenImages[imgUrl];
                        const imgSrc = isBroken ? MISSING_IMAGE_URL : cleanAndProxyImageUrl(imgUrl);

                        return (
                          <>
                            {isImageLoading && !isBroken && (
                              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                                <div className="loading-spinner" />
                              </div>
                            )}

                            <motion.img 
                              key={`${activeTermNode.id}-${activeImageIndex}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: isImageLoading ? 0 : 1 }}
                              transition={{ duration: 0.3 }}
                              src={imgSrc} 
                              alt={`${activeTermNode.name} asset viewport`} 
                              referrerPolicy="no-referrer"
                              onLoad={() => setIsImageLoading(false)}
                              onError={() => {
                                setIsImageLoading(false);
                                setBrokenImages(prev => ({ ...prev, [imgUrl]: true }));
                              }}
                              style={{ 
                                width: isBroken ? '48px' : '100%', 
                                height: isBroken ? '48px' : '100%', 
                                objectFit: isBroken ? 'contain' : 'cover',                     
                                backgroundColor: 'transparent',           
                                filter: isBroken ? (isMapDarkMode ? 'invert(1)' : 'none') : 'none'
                              }}
                            />
                          </>
                        );
                      })()}
                      
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '4px', 
                        left: '4px', right: '4px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        zIndex: 2,
                        pointerEvents: 'none'
                      }}>
                        <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'flex-start', pointerEvents: 'auto' }}>
                          {activeTermNode.images.length > 1 && (
                            <>
                              <motion.button 
                                whileHover={{ opacity: 0.7 }}
                                onClick={handlePrevImage} 
                                style={{ 
                                  background: theme.bg, 
                                  border: `1px solid ${theme.border}`, 
                                  borderRadius: '50%', 
                                  width: '30px', 
                                  height: '30px', 
                                  cursor: 'pointer', 
                                  padding: '0',
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  boxShadow: 'none',
                                  fontFamily: '"Space Mono", monospace'
                                }}
                              >
                                <img 
                                  src="/icons/icon-arrow-left.svg" 
                                  style={{ width: '6px', height: '12px', filter: isMapDarkMode ? 'brightness(0) invert(1)' : 'brightness(0)' }} 
                                  alt="prev" 
                                />
                              </motion.button>
                              <motion.button 
                                whileHover={{ opacity: 0.7 }}
                                onClick={handleNextImage} 
                                style={{ 
                                  background: theme.bg, 
                                  border: `1px solid ${theme.border}`, 
                                  borderRadius: '50%', 
                                  width: '30px', 
                                  height: '30px', 
                                  cursor: 'pointer', 
                                  padding: '0',
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  boxShadow: 'none',
                                  fontFamily: '"Space Mono", monospace'
                                }}
                              >
                                <img 
                                  src="/icons/icon-arrow-right.svg" 
                                  style={{ width: '6px', height: '12px', filter: isMapDarkMode ? 'brightness(0) invert(1)' : 'brightness(0)' }} 
                                  alt="next" 
                                />
                              </motion.button>
                            </>
                          )}
                        </div>

                        {activeTermNode.images.length > 1 && (
                          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                            <div style={{ 
                              background: 'rgba(0, 0, 0, 0.65)', 
                              backdropFilter: 'blur(2px)',
                              color: '#ffffff', 
                              fontSize: '11px', 
                              fontFamily: '"Space Mono", monospace',
                              fontWeight: '700',
                              height: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 16px', 
                              borderRadius: '15px', 
                              letterSpacing: '0.5px',
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}>
                              {activeImageIndex + 1}/{activeTermNode.images.length}
                            </div>
                          </div>
                        )}
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Rest of the details content padded beneath the image gallery */}
                <div 
                  style={{ 
                    padding: '24px', 
                    textAlign: 'left',
                    flex: 1
                  }}
                >
                  {/* Title */}
                  <h1 style={{ 
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: '400', 
                    fontSize: '32px', 
                    lineHeight: '36px',
                    color: theme.text, 
                    margin: '0 0 8px 0', 
                    textAlign: 'left', 
                    letterSpacing: '-0.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {isOnlyApocryphal(activeTermNode) && (
                      <span style={{
                        marginRight: '12px',
                        fontWeight: 900,
                        fontSize: '44px',
                        lineHeight: 1,
                        WebkitTextStroke: '3px currentColor',
                        flexShrink: 0
                      }}>✖</span>
                    )}
                    {activeTermNode.name}
                  </h1>

                  {/* Actions Row (Flag, View on Map, View on Timeline) */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {onFlagItem && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onFlagItem(activeTermNode)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'transparent',
                          color: isMapDarkMode ? '#fff' : '#000',
                          border: `1px solid ${isMapDarkMode ? '#fff' : '#000'}`,
                          padding: '6px 12px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          fontFamily: '"Space Mono", monospace',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                        title="Report inaccuracy / flag this term"
                      >
                        <Flag size={13} />
                        <span>FLAG</span>
                      </motion.button>
                    )}

                    {resolvedMapInfo && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onViewOnMap(resolvedMapInfo.layer, resolvedMapInfo.featureSearchTerm)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'transparent',
                          color: isMapDarkMode ? '#fff' : '#000',
                          border: `1px solid ${isMapDarkMode ? '#fff' : '#000'}`,
                          padding: '6px 12px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          fontFamily: '"Space Mono", monospace',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                          <line x1="9" y1="3" x2="9" y2="18"></line>
                          <line x1="15" y1="6" x2="15" y2="21"></line>
                        </svg>
                        <span>VIEW ON MAP</span>
                      </motion.button>
                    )}

                    {activeTermNode.timelineId && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onViewOnTimeline(activeTermNode.timelineId!)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'transparent',
                          color: isMapDarkMode ? '#fff' : '#000',
                          border: `1px solid ${isMapDarkMode ? '#fff' : '#000'}`,
                          padding: '6px 12px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          fontFamily: '"Space Mono", monospace',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>TIMELINE VIEW</span>
                      </motion.button>
                    )}
                  </div>

                  {/* Tag Pills (Category layer + Related terms) */}
                  {((activeTermNode.layer) || (activeTermNode.relatedIds && activeTermNode.relatedIds.length > 0)) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', justifyContent: 'flex-start' }}>
                      {/* Node's own Layer tag */}
                      {activeTermNode.layer && (
                        <button 
                          style={{ 
                            height: '24px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '10px', 
                            fontWeight: '400', 
                            padding: '0 12px', 
                            borderRadius: '12px', 
                            background: activeRootColor, 
                            border: 'none',
                            color: '#000000',
                            cursor: 'default',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: '"Space Mono", monospace'
                          }}
                        >
                          {activeTermNode.layer}
                        </button>
                      )}

                      {/* Related term tags */}
                      {activeTermNode.relatedIds?.map(relId => {
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

                {/* Linguistic Translations */}
                {activeTermNode.translations && activeTermNode.translations.length > 0 && (
                  <div
                    style={{
                      border: `1px solid ${theme.borderLight}`,
                      borderRadius: '8px',
                      padding: '16px',
                      background: isMapDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      marginBottom: '24px'
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
                            <span style={{ fontSize: '8.5px', fontWeight: 'bold', textTransform: 'uppercase', color: adjustColorForContrast(activeRootColor), letterSpacing: '0.5px' }}>
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
                <div style={{ paddingTop: '0', textAlign: 'left', marginBottom: '24px' }}>
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
                  <div 
                    style={{ 
                      marginTop: '24px', 
                      borderTop: `1px solid ${theme.borderLight || theme.border}`, 
                      paddingTop: '20px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px',
                      marginBottom: '24px'
                    }}
                  >
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
                              borderLeft: `2px solid ${activeRootColor}`,
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
                                  <span style={{ fontSize: '8.5px', fontWeight: 'bold', color: adjustColorForContrast(activeRootColor), letterSpacing: '0.5px' }}>
                                    — {displayText.toUpperCase()}{' '}
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: adjustColorForContrast(activeRootColor),
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
                                <span style={{ fontSize: '8.5px', fontWeight: 'bold', color: adjustColorForContrast(activeRootColor), letterSpacing: '0.5px' }}>
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
                  <div 
                    style={{ 
                      marginTop: '24px', 
                      borderTop: `1px solid ${theme.borderLight || theme.border}`, 
                      paddingTop: '20px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px',
                      marginBottom: '24px'
                    }}
                  >
                    <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontSize: '11px', lineHeight: '22px', textTransform: 'uppercase', color: theme.text }}>
                      PRIMARY SOURCES & ANCIENT TEXTS:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {activeTermNode.sources.map((source, sIdx) => {
                        const rootColor = activeRootColor;
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
                            {source.trim().toUpperCase() === 'CANONICAL SCRIPTURE' ? 'BIBLE' : source.toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Legend explanation for Apocryphal tag */}
                {isOnlyApocryphal(activeTermNode) && (
                  <div 
                    style={{ 
                      marginTop: '24px',
                      borderTop: `1px solid ${theme.borderLight || theme.border}`,
                      paddingTop: '20px',
                      marginBottom: '24px'
                    }}
                  >
                    <div 
                      style={{ 
                        padding: '12px',
                        border: `1px solid ${isMapDarkMode ? 'rgba(255, 92, 92, 0.4)' : 'rgba(179, 27, 27, 0.4)'}`,
                        borderRadius: '8px',
                        background: isMapDarkMode ? 'rgba(255, 92, 92, 0.04)' : 'rgba(255, 92, 92, 0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span 
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            lineHeight: '1',
                            fontWeight: '900',
                            color: isMapDarkMode ? '#ff5c5c' : '#b31b1b',
                            fontFamily: '"Space Mono", monospace',
                          }}
                        >
                          ✖
                        </span>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', fontFamily: '"Space Mono", monospace', color: isMapDarkMode ? '#ff5c5c' : '#b31b1b' }}>
                          APOCRYPHAL INDICATOR
                        </span>
                      </div>
                      <p style={{ fontSize: '8.5px', lineHeight: '1.4', color: isMapDarkMode ? '#ffb3b3' : '#801c1c', margin: 0, fontFamily: '"Space Mono", monospace' }}>
                        Represents apocryphal, non-canonical, or mythological entries outside of canonical scripture.
                      </p>
                    </div>
                  </div>
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

      {/* FIXED RIGHT EDGE MASK BAR */}
      <motion.div 
        initial={false}
        animate={{ 
          background: isMapDarkMode ? 'rgba(10, 10, 10, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: theme.border
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          bottom: 0, 
          width: '20px', 
          borderLeft: `1px solid ${theme.border}`, 
          zIndex: 100, 
          pointerEvents: 'auto',
          backdropFilter: 'blur(8px)'
        }} 
      />
    </div>
  );
}
