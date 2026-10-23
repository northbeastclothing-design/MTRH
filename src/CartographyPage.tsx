// Cartography Page Component - Old World Maps Viewer
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import mapboxgl from 'mapbox-gl';
import { X, Map as MapIcon, Plus, Eye, EyeOff, Navigation, AlertTriangle, Loader2, Globe, Share2 } from 'lucide-react';
import { handleShare } from './utils/share';
import { ShareModal } from './ShareModal';
import { updateClientOgpTags } from './utils/ogp';
import { HISTORICAL_MAPS, type HistoricalMap } from './cartographyMaps';

interface CartographyPageProps {
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
  db: any;
  auth: any;
  selectedMapId?: string;
  onMapSelect?: (mapId: string) => void;
  isMobile?: boolean;
  isActive?: boolean;
}

interface TranslationHotspot {
  id: string;
  mapId: string;
  name: string;
  originalText: string;
  translatedText: string;
  context: string;
  coordinates: [number, number][]; // A list of coordinates forming a polygon
}

const TRANSLATION_HOTSPOTS: TranslationHotspot[] = [];

const getProxyOrDirectUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:') || url.includes('/api/proxy')) return url;
  return `/api/proxy-resource?url=${encodeURIComponent(url)}`;
};

interface SavedPoint {
  id: string;
  mapId: string;
  lng: number;
  lat: number;
  note: string;
  createdAt: any;
}

// Bounding coordinates helper to project historical maps with correct aspect ratio
const calculateBounds = (aspectRatio: number): [[number, number], [number, number], [number, number], [number, number]] => {
  // Base longitude span limit
  const maxLngHalf = 85;
  const lngHalf = Math.min(maxLngHalf, 85 * aspectRatio);
  
  // Calculate the Mercator Y coordinate we need to achieve the visual aspect ratio
  const mercatorY = (lngHalf * Math.PI / 180) / aspectRatio;
  
  // Inverse Mercator formula to find the exact latitude degree to counteract Mercator stretching
  const latHalfRad = 2 * Math.atan(Math.exp(mercatorY)) - Math.PI / 2;
  const latHalf = latHalfRad * 180 / Math.PI;

  return [
    [-lngHalf, latHalf],
    [lngHalf, latHalf],
    [lngHalf, -latHalf],
    [-lngHalf, -latHalf]
  ];
};

// Calculate loose camera bounds allowing user to drag slightly past the map borders
const calculateMaxBounds = (coords: [[number, number], [number, number], [number, number], [number, number]]): [[number, number], [number, number]] => {
  const minLng = coords[0][0];
  const maxLng = coords[1][0];
  const maxLat = coords[0][1];
  const minLat = coords[2][1];

  const width = maxLng - minLng;
  const height = maxLat - minLat;

  const paddingLng = width * 0.35; // Allow dragging ~35% past edges
  const paddingLat = height * 0.35;

  return [
    [Math.max(-180, minLng - paddingLng), Math.max(-85, minLat - paddingLat)],
    [Math.min(180, maxLng + paddingLng), Math.min(85, maxLat + paddingLat)]
  ];
};

// Helper to remove any existing historical map sources and layers
const cleanUpMapOverlay = (map: mapboxgl.Map) => {
  const maxSlices = 25;
  for (let i = 0; i < maxSlices; i++) {
    const resolutions = ['low', 'high'];
    resolutions.forEach(res => {
      const lyr = `historical-map-layer-${i}-${res}`;
      const src = `historical-map-src-${i}-${res}`;
      if (map.getLayer(lyr)) map.removeLayer(lyr);
      if (map.getSource(src)) map.removeSource(src);
    });
    // Backwards compatibility for old names
    const oldLyr = `historical-map-layer-${i}`;
    const oldSrc = `historical-map-src-${i}`;
    if (map.getLayer(oldLyr)) map.removeLayer(oldLyr);
    if (map.getSource(oldSrc)) map.removeSource(oldSrc);
  }

  const layers = [
    'historical-map-layer',
    'hotspots-fill',
    'hotspots-outline'
  ];
  const sources = [
    'historical-map-src',
    'hotspots-src'
  ];

  layers.forEach(l => {
    if (map.getLayer(l)) map.removeLayer(l);
  });
  sources.forEach(s => {
    if (map.getSource(s)) map.removeSource(s);
  });
};

const updateHotspotsOverlay = (map: mapboxgl.Map, mapId: string) => {
  if (map.getLayer('hotspots-fill')) map.removeLayer('hotspots-fill');
  if (map.getLayer('hotspots-outline')) map.removeLayer('hotspots-outline');
  if (map.getSource('hotspots-src')) map.removeSource('hotspots-src');

  const currentHotspots = TRANSLATION_HOTSPOTS.filter(h => h.mapId === mapId);
  if (currentHotspots.length === 0) return;

  const features = currentHotspots.map((h, idx) => ({
    type: 'Feature',
    id: idx + 1, // numeric id required for Mapbox setFeatureState
    properties: {
      id: h.id,
      name: h.name,
      originalText: h.originalText,
      translatedText: h.translatedText,
      context: h.context
    },
    geometry: {
      type: 'Polygon',
      coordinates: [h.coordinates]
    }
  }));

  map.addSource('hotspots-src', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: features as any
    }
  });

  map.addLayer({
    id: 'hotspots-fill',
    type: 'fill',
    source: 'hotspots-src',
    paint: {
      'fill-color': '#74F8F3', // Cyan/turquoise highlight
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.25,
        0.04
      ]
    }
  });

  map.addLayer({
    id: 'hotspots-outline',
    type: 'line',
    source: 'hotspots-src',
    paint: {
      'line-color': '#74F8F3',
      'line-width': 1.5,
      'line-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.8,
        0.25
      ]
    }
  });
};

// Helper to add/update the raster historical map sources and layers
const updateMapOverlay = (map: mapboxgl.Map, hMap: HistoricalMap, slices: ImageSlice[], resolution: 'low' | 'high') => {
  const coords = calculateBounds(hMap.aspectRatio);
  const minLng = coords[0][0];
  const maxLng = coords[1][0];
  const maxLat = coords[0][1];
  const minLat = coords[2][1];

  if (hMap.id === 'peutinger' && slices.length <= 1) {
    // Sliced high-resolution multi-source rendering for the Peutinger Table using local files
    cleanUpMapOverlay(map);
    const segmentLngWidth = (maxLng - minLng) / 4;
    for (let i = 0; i < 4; i++) {
      const segMinLng = minLng + i * segmentLngWidth;
      const segMaxLng = minLng + (i + 1) * segmentLngWidth;
      const segmentCoords = [
        [segMinLng, maxLat],
        [segMaxLng, maxLat],
        [segMaxLng, minLat],
        [segMinLng, minLat]
      ];

      const srcId = `historical-map-src-${i}`;
      const lyrId = `historical-map-layer-${i}`;
      const fileUrl = `/images/peutinger_part${i + 1}.jpg`;

      map.addSource(srcId, {
        type: 'image',
        url: fileUrl,
        coordinates: segmentCoords as any
      });

      map.addLayer({
        id: lyrId,
        type: 'raster',
        source: srcId,
        paint: {
          'raster-fade-duration': 150,
          'raster-opacity': 1,
          'raster-opacity-transition': { duration: 300 }
        }
      });
    }
  } else {
    // Standard slices rendering (dynamic grids or single images) using resolution suffixes to prevent popping
    const lngSpan = maxLng - minLng;
    const latSpan = maxLat - minLat;

    slices.forEach((slice, index) => {
      const srcId = `historical-map-src-${index}-${resolution}`;
      const lyrId = `historical-map-layer-${index}-${resolution}`;

      const cellMinLng = minLng + (slice.col / slice.cols) * lngSpan;
      const cellMaxLng = minLng + ((slice.col + 1) / slice.cols) * lngSpan;
      const cellMaxLat = maxLat - (slice.row / slice.rows) * latSpan;
      const cellMinLat = maxLat - ((slice.row + 1) / slice.rows) * latSpan;

      const cellCoords = [
        [cellMinLng, cellMaxLat],
        [cellMaxLng, cellMaxLat],
        [cellMaxLng, cellMinLat],
        [cellMinLng, cellMinLat]
      ];

      const existingSource = map.getSource(srcId) as mapboxgl.ImageSource | undefined;
      if (existingSource) {
        existingSource.updateImage({
          url: slice.url,
          coordinates: cellCoords as any
        });
      } else {
        map.addSource(srcId, {
          type: 'image',
          url: slice.url,
          coordinates: cellCoords as any
        });

        // Insert new layer below hotspots to keep annotations interactive
        const otherRes = resolution === 'low' ? 'high' : 'low';
        const hasOtherResLayer = !!map.getLayer(`historical-map-layer-${index}-${otherRes}`);
        const initialOpacity = hasOtherResLayer ? 0 : 1;
        const beforeId = map.getLayer('hotspots-fill') ? 'hotspots-fill' : undefined;

        map.addLayer({
          id: lyrId,
          type: 'raster',
          source: srcId,
          paint: {
            'raster-fade-duration': 0, // Disable internal fade to avoid double opacity transitions
            'raster-opacity': initialOpacity,
            'raster-opacity-transition': { duration: 300 }
          }
        }, beforeId);

        if (initialOpacity === 0) {
          requestAnimationFrame(() => {
            try {
              if (map.getLayer(lyrId)) {
                map.setPaintProperty(lyrId, 'raster-opacity', 1);
              }
            } catch (e) {}
          });
        }
      }
    });

    // Schedule clean up of the other resolution's sources and layers to avoid overlay leaks and flickering
    const otherResolution = resolution === 'low' ? 'high' : 'low';
    setTimeout(() => {
      // Check if map is still ready/mounted before cleaning up
      try {
        if (!map.getStyle()) return;
        const maxSlices = 25;
        for (let i = 0; i < maxSlices; i++) {
          const oldLyr = `historical-map-layer-${i}-${otherResolution}`;
          const oldSrc = `historical-map-src-${i}-${otherResolution}`;
          if (map.getLayer(oldLyr)) map.removeLayer(oldLyr);
          if (map.getSource(oldSrc)) map.removeSource(oldSrc);
        }
      } catch (e) {
        // Map might have been unmounted during timeout
      }
    }, 500);
  }
};

const ERAS = [
  { id: 'ancient', name: "Ancient Maps", period: "6,200 BCE – 600 CE" },
  { id: 'early-medieval', name: "Early Medieval Maps", period: "600 – 1300 CE" },
  { id: 'late-medieval', name: "Late Medieval Maps", period: "1300 – 1500 CE" },
  { id: 'renaissance', name: "Renaissance Maps", period: "1492 – 1800 CE" },
  { id: 'modern', name: "Modern / Projections", period: "1800 – Present" },
  { id: 'speculative', name: "Speculative / Reconstruction", period: "" }
];

const getEraFolderBgColor = (eraId: string): string => {
  switch (eraId) {
    case 'ancient': return '#FFCBA6';
    case 'early-medieval': return '#B3C77B';
    case 'late-medieval': return '#D3C5FB';
    case 'renaissance': return '#90C2FF';
    case 'modern': return '#FF9F63';
    case 'speculative': return '#F9B6DB';
    default: return '#e5e5e5';
  }
};

const getThumbnailUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.includes('images.weserv.nl')) {
    return url.includes('&w=') ? url : `${url}&w=600&h=250&fit=cover`;
  }
  let safeUrl = url;
  try {
    safeUrl = decodeURI(url);
  } catch (_) {}
  return `https://images.weserv.nl/?url=${encodeURIComponent(safeUrl)}&w=600&h=250&fit=cover`;
};

interface EraAccordionHeaderProps {
  era: typeof ERAS[number];
  isExpanded: boolean;
  theme: any;
  onToggleExpand: () => void;
  getEraFolderBgColor: (eraId: string) => string;
}

const EraAccordionHeader = ({ era, isExpanded, theme, onToggleExpand, getEraFolderBgColor }: EraAccordionHeaderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={{ 
      position: 'sticky', 
      top: '8px', 
      zIndex: 10, 
      background: theme.bg,
      padding: '3px 20px 0px 20px'
    }}>
      {/* Accordion Header */}
      <motion.div
        onClick={onToggleExpand}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleExpand();
          }
        }}
        style={{
          display: 'flex', 
          alignItems: 'center', 
          padding: '0', 
          height: '32px',
          justifyContent: 'space-between', 
          cursor: 'pointer', 
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: '16px',
          boxSizing: 'border-box',
          color: theme.text,
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* EXPANDING BACKGROUND OVERLAY */}
        <motion.div
          animate={{
            width: isHovered ? '100%' : '32px'
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            background: getEraFolderBgColor(era.id),
            borderRadius: '16px',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'left', zIndex: 1, position: 'relative' }}>
          <div style={{ 
            width: '30px', 
            height: '30px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {/* SVG Folder Icon */}
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_779_2268)">
                <circle cx="15" cy="15" r="15" fill={getEraFolderBgColor(era.id)}/>
                <mask id="mask0_779_2268" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="3" y="3" width="25" height="24">
                  <rect x="3.25" y="3" width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_779_2268)">
                  <path d="M7.75 22C7.32817 22 6.97275 21.8554 6.68375 21.5663C6.39458 21.2773 6.25 20.9218 6.25 20.5V9.6155C6.25 9.19367 6.41375 8.81892 6.74125 8.49125C7.06892 8.16375 7.44367 8 7.8655 8H12.8463L14.8463 10H22.6345C22.9795 10 23.2805 10.0933 23.5375 10.2798C23.7945 10.4663 23.9743 10.7063 24.077 11H14.4443L12.4442 9H7.8655C7.686 9 7.5385 9.05767 7.423 9.173C7.30767 9.2885 7.25 9.436 7.25 9.6155V20.3845C7.25 20.5257 7.28525 20.6411 7.35575 20.7308C7.42625 20.8206 7.51917 20.8975 7.6345 20.9615L9.9 13.3845H26.1155L23.848 20.9405C23.7532 21.2583 23.5715 21.5144 23.303 21.7087C23.0343 21.9029 22.7346 22 22.4038 22H7.75ZM8.677 21H22.7885L24.7615 14.3845H10.65L8.677 21Z" fill="#1C1B1F"/>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_779_2268">
                  <rect width="30" height="30" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <span style={{
            fontSize: '10px',
            lineHeight: '24px',
            fontWeight: '700',
            fontFamily: '"Space Mono", monospace',
            color: theme.text
          }}>
            {era.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0', zIndex: 1, position: 'relative' }} onClick={e => e.stopPropagation()}>
          <motion.button 
            whileHover={{ opacity: 0.6 }}
            onClick={onToggleExpand}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img 
              src={isExpanded ? "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-arrow-up.svg" : "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-arrow-down.svg"} 
              style={{ width: '30px', height: '30px', filter: theme.invert }} 
              alt="expand" 
            />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Helper to parse the width from Wikipedia / IIIF URLs
const getUrlWidth = (url: string): number => {
  if (url.includes('/commons/thumb/')) {
    const match = url.match(/\/(\d+)px-/);
    if (match) return parseInt(match[1], 10);
  }
  if (url.includes('/full/')) {
    const match = url.match(/\/full\/(\d+),?\/?/);
    if (match) return parseInt(match[1], 10);
  }
  return 4000; // Default fallback to high resolution
};

// Helper to update the resolution of the map URL dynamically
const getMapUrlForWidth = (url: string, width: number) => {
  if (url.includes('/commons/thumb/')) {
    const regex = /\/(\d+)px-([^\/]+)$/;
    if (regex.test(url)) {
      return url.replace(regex, `/${width}px-$2`);
    }
  }
  if (url.includes('/full/')) {
    const iiifRegex = /\/full\/(\d+),?\/?/;
    if (iiifRegex.test(url)) {
      return url.replace(iiifRegex, `/full/${width},/`);
    }
  }
  return url;
};



interface ImageSlice {
  url: string;
  col: number;
  row: number;
  cols: number;
  rows: number;
}

const sliceImage = (imageBlob: Blob): Promise<ImageSlice[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageBlob);
    img.src = objectUrl;
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.width;
      const height = img.height;

      // Determine grid size dynamically (each tile max ~3000px)
      const cols = Math.ceil(width / 3000);
      const rows = Math.ceil(height / 3000);

      if (cols === 1 && rows === 1) {
        // No slicing needed
        resolve([{
          url: URL.createObjectURL(imageBlob),
          col: 0,
          row: 0,
          cols: 1,
          rows: 1
        }]);
        return;
      }

      const colWidth = Math.floor(width / cols);
      const rowHeight = Math.floor(height / rows);
      const slices: ImageSlice[] = [];

      try {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const canvas = document.createElement('canvas');
            const sx = c * colWidth;
            const sy = r * rowHeight;
            
            // Handle edges to cover entire image
            const sw = (c === cols - 1) ? (width - sx) : colWidth;
            const sh = (r === rows - 1) ? (height - sy) : rowHeight;

            canvas.width = sw;
            canvas.height = sh;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
            }

            const sliceBlob = await new Promise<Blob | null>((res) => {
              canvas.toBlob((b) => res(b), 'image/jpeg', 0.85);
            });

            if (sliceBlob) {
              slices.push({
                url: URL.createObjectURL(sliceBlob),
                col: c,
                row: r,
                cols,
                rows
              });
            }
          }
        }
        resolve(slices);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
  });
};

export default function CartographyPage({ 
  theme, 
  isMapDarkMode, 
  db, 
  auth, 
  selectedMapId, 
  onMapSelect,
  isMobile,
  isActive
}: CartographyPageProps) {
  // Try to initialize using selectedMapId if provided, else fallback to index 0
  const initialMap = useMemo(() => {
    if (selectedMapId) {
      const match = HISTORICAL_MAPS.find(m => m.id === selectedMapId);
      if (match) return match;
    }
    return HISTORICAL_MAPS[0];
  }, [selectedMapId]);

  const [selectedMap, setSelectedMap] = useState<HistoricalMap>(initialMap);
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

  const [loadedThumbnails, setLoadedThumbnails] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<SavedPoint[]>([]);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(isMobile ?? false);

  const [shareToast, setShareToast] = useState<string | null>(null);
  const showShareToast = (msg: string) => {
    setShareToast(msg);
    setTimeout(() => {
      setShareToast(null);
    }, 2500);
  };

  const [shareModalData, setShareModalData] = useState<{
    isOpen: boolean;
    title: string;
    text?: string;
    url: string;
    category?: string;
    imageUrl?: string;
  }>({
    isOpen: false,
    title: '',
    text: '',
    url: '',
    category: '',
    imageUrl: ''
  });

  const openShareModal = (title: string, text: string, url: string, category?: string, imageUrl?: string) => {
    setShareModalData({
      isOpen: true,
      title,
      text,
      url,
      category,
      imageUrl
    });
  };

  useEffect(() => {
    if (isActive === false) return; // only the visible page owns the document title / OG tags
    if (selectedMap) {
      const title = `${selectedMap.name} | Historical Cartography | MTRH Map`;
      const description = selectedMap.description || 'Inspect high-resolution historical maps, ancient worldviews, and firmament projections.';
      const image = selectedMap.url;
      const url = window.location.href;
      updateClientOgpTags({ title, description, url, image });
    } else {
      updateClientOgpTags({
        title: 'Historical Cartography Collection | MTRH Interactive Map',
        description: 'Inspect high-resolution historical maps, ancient worldviews, and firmament projections.',
        url: window.location.href
      });
    }
  }, [selectedMap, isActive]);

  // Search state matching map page exactly
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [searchActiveIndex, setSearchActiveIndex] = useState<number>(-1);
  const pendingTargetPointRef = useRef<{ lng: number; lat: number } | null>(null);

  const [currentResolution, setCurrentResolution] = useState<'low' | 'high'>('low');
  const currentResolutionRef = useRef<'low' | 'high'>('low');
  const lastMapIdRef = useRef<string>('');
  const lastFetchedMapIdRef = useRef<string>('');
  const loadedMapIdRef = useRef<string>('');
  const selectedMapRef = useRef<HistoricalMap>(selectedMap);

  useEffect(() => {
    currentResolutionRef.current = currentResolution;
  }, [currentResolution]);

  useEffect(() => {
    selectedMapRef.current = selectedMap;
  }, [selectedMap]);

  // Reset resolution back to 'low' when switching maps
  useEffect(() => {
    setCurrentResolution('low');
  }, [selectedMap.id]);

  const originalWidth = useMemo(() => {
    if (selectedMap.highResWidth) return selectedMap.highResWidth;
    return getUrlWidth(selectedMap.url);
  }, [selectedMap.url, selectedMap.highResWidth]);

  const lowResWidth = useMemo(() => {
    if (selectedMap.disableResolutionUpgrade) return originalWidth;
    return Math.min(1280, originalWidth);
  }, [originalWidth, selectedMap.disableResolutionUpgrade]);
  const highResWidth = originalWidth;

  const targetUrl = useMemo(() => {
    if (selectedMap.disableResolutionUpgrade) {
      return selectedMap.url;
    }
    if (currentResolution === 'high' && selectedMap.highResUrl) {
      return selectedMap.highResUrl;
    }
    const width = currentResolution === 'low' ? lowResWidth : highResWidth;
    return getMapUrlForWidth(selectedMap.url, width);
  }, [selectedMap.url, selectedMap.highResUrl, currentResolution, lowResWidth, highResWidth, selectedMap.disableResolutionUpgrade]);

  // Sync prop selectedMapId down to internal selectedMap state
  useEffect(() => {
    if (selectedMapId) {
      const match = HISTORICAL_MAPS.find(m => m.id === selectedMapId);
      if (match && match.id !== selectedMap.id) {
        setSelectedMap(match);
      }
    }
  }, [selectedMapId, selectedMap.id]);

  // Match maps based on searchQuery
  const matchedMaps = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (cleanQuery === '') return [];
    return HISTORICAL_MAPS.filter(m => 
      m.name.toLowerCase().includes(cleanQuery) ||
      m.description.toLowerCase().includes(cleanQuery) ||
      m.year.toLowerCase().includes(cleanQuery)
    );
  }, [searchQuery]);

  // Match notes based on searchQuery
  const matchedNotes = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (cleanQuery === '') return [];
    return notes.filter(n => 
      n.note.toLowerCase().includes(cleanQuery)
    );
  }, [searchQuery, notes]);

  const visibleMaps = matchedMaps.slice(0, 10);
  const visibleNotes = matchedNotes.slice(0, 10);
  const totalResultsCount = visibleMaps.length + visibleNotes.length;

  const handleMapSelect = (hMap: HistoricalMap) => {
    setSelectedMap(hMap);
    setSearchQuery('');
    setShowSearchResults(false);
    if (onMapSelect) {
      onMapSelect(hMap.id);
    }
  };

  const handleNoteSelect = (notePoint: SavedPoint) => {
    const matchingMap = HISTORICAL_MAPS.find(m => m.id === notePoint.mapId);
    if (!matchingMap) return;

    setSearchQuery('');
    setShowSearchResults(false);

    if (onMapSelect) {
      onMapSelect(matchingMap.id);
    }

    if (matchingMap.id === selectedMap.id) {
      const map = mapRef.current;
      if (map) {
        const sidebarWidth = isSidebarCollapsed ? 40 : 340;
        map.easeTo({
          center: [notePoint.lng, notePoint.lat],
          zoom: Math.max(3, map.getZoom()),
          padding: { left: sidebarWidth },
          duration: 1000,
          essential: true
        });
      }
    } else {
      pendingTargetPointRef.current = { lng: notePoint.lng, lat: notePoint.lat };
      setSelectedMap(matchingMap);
    }
  };

  const [expandedEras, setExpandedEras] = useState<Record<string, boolean>>(() => {
    const initialMap = HISTORICAL_MAPS[0];
    return {
      [initialMap.era]: true
    };
  });

  useEffect(() => {
    if (selectedMap) {
      setExpandedEras(prev => ({
        ...prev,
        [selectedMap.era]: true
      }));
    }
  }, [selectedMap]);

  // Scroll selected map card into view in the sidebar
  useEffect(() => {
    if (!selectedMap) return;
    const timer = setTimeout(() => {
      const element = document.getElementById(`map-card-${selectedMap.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedMap.id]);

  
  // Note Submission state
  const [submissionCoords, setSubmissionCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Progressive loader state
  const [loadProgress, setLoadProgress] = useState<number | null>(null);
  const [mapImageSlices, setMapImageSlices] = useState<ImageSlice[]>([]);
  const [slicesResolution, setSlicesResolution] = useState<'low' | 'high'>('low');
  const [isMapSwitchLoading, setIsMapSwitchLoading] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1.5);
  const [coverZoom, setCoverZoom] = useState<number>(1.5);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);
  const prevBlobUrlRef = useRef<string>('');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const minZoomLimitRef = useRef<number>(0.1);
  const targetCenterRef = useRef<[number, number]>([0, 0]);
  const isEasingRef = useRef<boolean>(false);
  const lastPositionedMapIdRef = useRef<string>('');
  const prevSlicesRef = useRef<ImageSlice[]>([]);

  // Revoke Object URLs for slices on change or unmount to prevent memory leaks
  useEffect(() => {
    const prevSlices = prevSlicesRef.current;
    prevSlicesRef.current = mapImageSlices;

    return () => {
      const currentUrls = new Set(mapImageSlices.map(s => s.url));
      prevSlices.forEach(slice => {
        if (slice.url.startsWith('blob:') && !currentUrls.has(slice.url)) {
          URL.revokeObjectURL(slice.url);
        }
      });
    };
  }, [mapImageSlices]);

  // Refs for callbacks to prevent stale closures
  const isAddModeRef = useRef(isAddMode);
  useEffect(() => {
    isAddModeRef.current = isAddMode;
  }, [isAddMode]);

  // Load points globally from backend API routes (bypassing Firestore client SDK restrictions)
  const loadPoints = async () => {
    try {
      const res = await fetch('/api/cartography-points');
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      if (data.success) {
        setNotes(data.points);
      }
    } catch (e) {
      console.warn("Failed to load cartography points:", e);
    }
  };

  // 1. Fetch points on map switch, and set up 5-second polling interval
  useEffect(() => {
    loadPoints();
    const interval = setInterval(loadPoints, 5000);
    return () => clearInterval(interval);
  }, [selectedMap.id]);

  // 2. Fetch Map Image dynamically via proxy to bypass CORS restrictions
  useEffect(() => {
    if (selectedMap.id === 'peutinger') {
      setLoadProgress(null);
      setMapImageSlices([{
        url: '',
        col: 0,
        row: 0,
        cols: 1,
        rows: 1
      }]);
      loadedMapIdRef.current = 'peutinger';
      setIsMapSwitchLoading(false);
      return;
    }

    let active = true;
    const controller = new AbortController();
    
    // Only clear the map image slices and show the full page progress loader when switching maps.
    // When upgrading resolution, keep the low-res image visible on the map.
    const isMapSwitch = lastFetchedMapIdRef.current !== selectedMap.id;
    if (isMapSwitch) {
      setMapImageSlices([]);
      setSlicesResolution('low');
      loadedMapIdRef.current = '';
      setLoadProgress(0);
      setIsMapSwitchLoading(true);
      lastFetchedMapIdRef.current = selectedMap.id;
    } else {
      setLoadProgress(0);
      setIsMapSwitchLoading(false);
    }

    const fetchImageProgress = async () => {
      // Prioritize local server proxy (which forwards desktop User-Agent and Referer headers),
      // then fall back to direct Wikimedia fetch, then weserv CDN.
      const candidateUrls = [
        getProxyOrDirectUrl(targetUrl),
        targetUrl,
        `https://images.weserv.nl/?url=${encodeURIComponent(targetUrl)}`
      ].filter((u, idx, arr) => u && arr.indexOf(u) === idx);

      let lastError: any = null;

      for (const currentUrl of candidateUrls) {
        if (!active) return;
        try {
          const response = await fetch(currentUrl, { signal: controller.signal });
          if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status} for ${currentUrl}`);
          }

          const reader = response.body?.getReader();
          const contentLength = +(response.headers.get('Content-Length') || 0);

          if (!reader) {
            if (active) {
              setMapImageSlices([{
                url: currentUrl,
                col: 0,
                row: 0,
                cols: 1,
                rows: 1
              }]);
              setSlicesResolution(currentResolution);
              loadedMapIdRef.current = selectedMap.id;
              setLoadProgress(null);
              setIsMapSwitchLoading(false);
            }
            return;
          }

          let receivedLength = 0;
          const chunks: Uint8Array[] = [];

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              receivedLength += value.length;
              if (contentLength > 0) {
                const pct = Math.min(Math.round((receivedLength / contentLength) * 100), 99);
                if (active) setLoadProgress(pct);
              }
            }
          }

          if (!active) return;

          // Create Blob and slice it
          const blob = new Blob(chunks);
          try {
            const slices = await sliceImage(blob);
            if (active) {
              setMapImageSlices(slices);
              setSlicesResolution(currentResolution);
              loadedMapIdRef.current = selectedMap.id;
              setLoadProgress(null);
              setIsMapSwitchLoading(false);
            }
            return;
          } catch (sliceErr) {
            console.warn("Failed to slice image, falling back to original blob URL:", sliceErr);
            const localUrl = URL.createObjectURL(blob);
            if (active) {
              setMapImageSlices([{
                url: localUrl,
                col: 0,
                row: 0,
                cols: 1,
                rows: 1
              }]);
              setSlicesResolution(currentResolution);
              loadedMapIdRef.current = selectedMap.id;
              setLoadProgress(null);
              setIsMapSwitchLoading(false);
            }
            return;
          }
        } catch (candidateErr: any) {
          if (candidateErr.name === 'AbortError') {
            return;
          }
          lastError = candidateErr;
          console.warn(`Fetch candidate failed (${currentUrl}):`, candidateErr.message || candidateErr);
        }
      }

      // If all candidate URLs failed
      if (!active) return;
      console.warn("All image fetch candidates failed, falling back:", lastError);

      // If upgrading to high resolution and fetch fails, retain the existing low-resolution slices so the map never disappears!
      if (currentResolution === 'high' && mapImageSlices.length > 0) {
        setLoadProgress(null);
        setIsMapSwitchLoading(false);
        return;
      }

      const fallbackUrl = getProxyOrDirectUrl(targetUrl);
      setMapImageSlices([{
        url: fallbackUrl,
        col: 0,
        row: 0,
        cols: 1,
        rows: 1
      }]);
      setSlicesResolution(currentResolution);
      loadedMapIdRef.current = selectedMap.id;
      setLoadProgress(null);
      setIsMapSwitchLoading(false);
    };

    fetchImageProgress();

    return () => {
      active = false;
      controller.abort();
    };
  }, [targetUrl]);

  // 3. Initialize Mapbox Map ONCE on mount
  useEffect(() => {
    if (!mapContainerRef.current || !mapboxgl.supported()) return;

    const customBlankStyle: mapboxgl.Style = {
      version: 8,
      sources: {},
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#000000',
            'background-opacity': 0
          }
        }
      ]
    };

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: customBlankStyle,
      center: [0, 0],
      zoom: 1.5,
      minZoom: 0.1, // Set lower initial minZoom to prevent locking
      maxZoom: 9,
      dragRotate: false,
      pitchWithRotate: false,
      touchZoomRotate: { around: 'center' } as any,
      touchPitch: false,
      renderWorldCopies: false, // Prevents repeating maps horizontally when zoomed out
      scrollZoom: { around: 'center' }, // Always zoom around the center point
      alpha: true // Enable transparent canvas for background globe/grid visibility
    } as any);

    mapRef.current = map;
    map.dragPan.enable({ inertia: false } as any); // Disable dragging momentum natively
    map.touchZoomRotate.enable({ around: 'center' } as any);
    map.touchZoomRotate.disableRotation();



    const handleMove = () => {
      const container = mapContainerRef.current?.parentElement;
      if (!container) return;
      try {
        const pixelPoint = map.project([0, 0]);
        const ratio = 0.7; // moves at 70% of canvas speed (30% lag)
        const x = pixelPoint.x * (1 - ratio);
        const y = pixelPoint.y * (1 - ratio);
        container.style.backgroundPosition = `${x}px ${y}px`;
      } catch (err) {}
    };
    map.on('move', handleMove);

    map.on('load', () => {
      setIsMapReady(true);
      handleMove();
    });

    // Add pointer down / click interactions for note drop
    map.on('click', (e) => {
      if (isAddModeRef.current) {
        setSubmissionCoords({ lng: e.lngLat.lng, lat: e.lngLat.lat });
        setIsAddMode(false);
      }
    });

    const handleZoom = () => {
      if (isEasingRef.current) {
        return; // Disable resolution transitions during camera animations/easing!
      }
      const zoom = map.getZoom();
      if (selectedMapRef.current.disableResolutionUpgrade) {
        return;
      }
      if (zoom >= 3.0 && currentResolutionRef.current === 'low') {
        setCurrentResolution('high');
      } else if (zoom < 2.5 && currentResolutionRef.current === 'high') {
        setCurrentResolution('low');
      }
    };
    map.on('zoom', handleZoom);

    return () => {
      map.off('zoom', handleZoom);
      map.off('move', handleMove);
      map.remove();
      mapRef.current = null;
    };
  }, []); // Run once on mount

  // 4. Update the raster image URL, coordinates, and hotspots when selection or fetched image url updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    if (lastMapIdRef.current !== selectedMap.id) {
      cleanUpMapOverlay(map);
      lastMapIdRef.current = selectedMap.id;
    }

    if (loadedMapIdRef.current !== selectedMap.id || mapImageSlices.length === 0) {
      cleanUpMapOverlay(map);
      return;
    }

    updateMapOverlay(map, selectedMap, mapImageSlices, slicesResolution);
    updateHotspotsOverlay(map, selectedMap.id);
  }, [selectedMap.id, mapImageSlices, isMapReady, slicesResolution]);

  // 5. Position camera and trigger entry zoom-in animation when the new map image finishes loading
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || mapImageSlices.length === 0) return;

    if (lastPositionedMapIdRef.current === selectedMap.id) {
      // Already positioned this map, do not reset camera on resolution upgrade!
      return;
    }
    lastPositionedMapIdRef.current = selectedMap.id;

    const coords = calculateBounds(selectedMap.aspectRatio);
    const minLng = coords[0][0];
    const maxLng = coords[1][0];
    const maxLat = coords[0][1];
    const minLat = coords[2][1];

    const container = map.getContainer();
    const wView = container.clientWidth;
    const hView = container.clientHeight;
    
    const sidebarWidth = isSidebarCollapsed ? 40 : 340;
    const paddingX = 120;
    const paddingY = 120;
    const visibleWidth = Math.max(100, wView - sidebarWidth - paddingX);
    const visibleHeight = Math.max(100, hView - paddingY);
    const visibleAspectRatio = visibleWidth / visibleHeight;

    // Reset constraints so fitBounds works cleanly
    map.setMaxBounds(null);
    map.setMinZoom(0.1);

    // Calculate containment and cover zoom levels mathematically
    const mercatorY = (maxLng * Math.PI / 180) / selectedMap.aspectRatio;
    const zoomWidth = Math.log2((visibleWidth * 90) / (128 * maxLng));
    const zoomHeight = Math.log2((visibleHeight * Math.PI) / (256 * mercatorY));
    const containZoom = Math.min(zoomWidth, zoomHeight);

    // Define dynamicMinZoom as containZoom - 1.5 (allows comfortable breathing room around map edges when zoomed out)
    const dynamicMinZoom = Math.max(0.1, containZoom - 1.5);
    minZoomLimitRef.current = dynamicMinZoom;
    map.setMinZoom(dynamicMinZoom);

    const pendingTarget = pendingTargetPointRef.current;
    // Use containment zoom so the map comfortably fills and fits within the window without being excessively zoomed in
    const targetZoom = containZoom;
    setCoverZoom(targetZoom);
    const snapCenter: [number, number] = pendingTarget 
      ? [pendingTarget.lng, pendingTarget.lat] 
      : [0, 0];
    targetCenterRef.current = snapCenter;

    const finalZoom = pendingTarget ? Math.max(3, targetZoom) : targetZoom;
    // Snap instantly to the final target zoom level to lose the scaling transition on entry
    map.setZoom(finalZoom);
    map.setCenter(snapCenter);

    // Ease in centering/padding transition horizontally in the next frame
    isEasingRef.current = true;
    requestAnimationFrame(() => {
      const activeMap = mapRef.current;
      if (!activeMap) {
        isEasingRef.current = false;
        return;
      }

      const onMoveEnd = () => {
        isEasingRef.current = false;
        activeMap.off('moveend', onMoveEnd);
        // Force clamp/scrollZoom updates once transition settles
        activeMap.fire('zoom');
      };
      activeMap.on('moveend', onMoveEnd);

      activeMap.easeTo({
        center: snapCenter,
        zoom: finalZoom,
        padding: isMobile 
          ? { top: 0, bottom: isSidebarCollapsed ? 108 : window.innerHeight * 0.7, left: 0, right: 0 }
          : { left: sidebarWidth },
        duration: 1200,
        essential: true
      });
      // Clear pending target point after use
      pendingTargetPointRef.current = null;
    });
  }, [mapImageSlices, isMapReady, isMobile, isSidebarCollapsed]);

  const prevSidebarCollapsedRef = useRef<boolean | null>(null);

  // 5.5 Keep the map centered in the viewable area when mobile bottom drawer collapses/expands
  useEffect(() => {
    const map = mapRef.current;
    if (isMobile && map && isMapReady && mapImageSlices.length > 0) {
      if (prevSidebarCollapsedRef.current === null) {
        prevSidebarCollapsedRef.current = isSidebarCollapsed;
        return;
      }
      if (prevSidebarCollapsedRef.current === isSidebarCollapsed) {
        return;
      }
      
      prevSidebarCollapsedRef.current = isSidebarCollapsed;

      const newBottomPadding = isSidebarCollapsed ? 108 : (window.innerHeight * 0.7);

      // Suspend maxBounds constraint during transition to prevent camera drift/jerkiness
      isEasingRef.current = true;
      map.setMaxBounds(null);

      const onMoveEnd = () => {
        isEasingRef.current = false;
        map.off('moveend', onMoveEnd);
        // Force clamp updates under new padding bounds once transition settles
        map.fire('zoom');
      };
      map.on('moveend', onMoveEnd);

      const currentCenter = map.getCenter();

      map.easeTo({
        center: currentCenter,
        padding: { top: 0, bottom: newBottomPadding, left: 0, right: 0 },
        duration: 500,
        essential: true
      });
    }
  }, [isSidebarCollapsed, isMobile, isMapReady, mapImageSlices]);

  // 6. Clamp camera center dynamically using Mapbox's native maxBounds constraint
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    const coords = calculateBounds(selectedMap.aspectRatio);
    const minLng = coords[0][0];
    const maxLng = coords[1][0];
    const maxLat = coords[0][1];
    const minLat = coords[2][1];

    const handleZoom = () => {
      if (isEasingRef.current) {
        map.setMaxBounds(null);
        return;
      }

      const W = map.getCanvas().clientWidth;
      const H = map.getCanvas().clientHeight;

      const sidebarWidth = isSidebarCollapsed ? 40 : 340;
      const viewableWidth = isMobile ? W : Math.max(0, W - sidebarWidth);
      const viewableHeight = isMobile ? Math.max(0, H - (isSidebarCollapsed ? 112 : H * 0.7)) : H;

      const currentZoom = map.getZoom();
      setMapZoom(currentZoom);

      map.dragPan.enable({ inertia: false } as any);
      map.scrollZoom.enable();
      
      // Calculate degrees per pixel for the current zoom
      const degreesPerPixelLng = 360 / (256 * Math.pow(2, currentZoom));
      const viewportLngSpan = viewableWidth * degreesPerPixelLng;

      const pixelsPerRadian = (256 * Math.pow(2, currentZoom)) / (2 * Math.PI);
      const viewportYSpan = viewableHeight / pixelsPerRadian;

      // Convert map bounds maxLat/minLat to Mercator Y radians
      const maxLatRad = maxLat * Math.PI / 180;
      const minLatRad = minLat * Math.PI / 180;
      const yMax = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));
      const yMin = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));
      
      // Calculate map dimensions on screen in pixels
      const mapWidthPixels = (maxLng - minLng) / degreesPerPixelLng;
      const mapHeightPixels = (yMax - yMin) * pixelsPerRadian;

      // If the map is smaller than the viewport in either dimension (meaning the user is zoomed out
      // enough to see the whole map), disable bounds entirely to prevent Mapbox coordinate locks.
      if (
        mapWidthPixels < viewableWidth || 
        mapHeightPixels < viewableHeight || 
        viewportLngSpan >= 360 || 
        viewportYSpan >= 2 * Math.PI
      ) {
        map.setMaxBounds(null);
        return;
      }

      // Calculate horizontal and vertical padding:
      // Since map is guaranteed to be larger than the viewport in both dimensions here,
      // allow dragging until 100px remains on screen (requires viewableWidth/2 - 100 pad, and viewableHeight/2 - 100 pad)
      const padLngPixels = Math.max(0, viewableWidth / 2 - 100);
      const padLng = padLngPixels * degreesPerPixelLng;

      const targetMinLng = minLng - padLng;
      const targetMaxLng = maxLng + padLng;

      const padLatPixels = Math.max(0, viewableHeight / 2 - 100);
      const padY = padLatPixels / pixelsPerRadian;

      const yMaxAllowed = yMax + padY;
      const yMinAllowed = yMin - padY;

      // Convert allowed Mercator Y back to latitude degrees
      const maxLatAllowed = (2 * Math.atan(Math.exp(yMaxAllowed)) - Math.PI / 2) * 180 / Math.PI;
      const minLatAllowed = (2 * Math.atan(Math.exp(yMinAllowed)) - Math.PI / 2) * 180 / Math.PI;

      const boundedMinLng = Math.max(-180, targetMinLng);
      const boundedMaxLng = Math.min(180, targetMaxLng);
      const boundedMinLat = Math.max(-85.05, minLatAllowed);
      const boundedMaxLat = Math.min(85.05, maxLatAllowed);

      map.setMaxBounds([
        [boundedMinLng, boundedMinLat],
        [boundedMaxLng, boundedMaxLat]
      ]);
    };

    // Run initial check
    handleZoom();

    map.on('zoom', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
      const activeMap = mapRef.current;
      if (activeMap) {
        activeMap.setMaxBounds(null);
      }
    };
  }, [selectedMap.id, isMapReady, isSidebarCollapsed, isMobile]);



  // 8. Prevent page scroll chaining by blocking wheel event propagation on root container unless over the sidebar
  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      // If scroll target is within the sidebar or the far-left protective strip, allow normal scrolling
      if (sidebarRef.current?.contains(target) || target.classList?.contains('far-left-strip')) {
        return;
      }
      // Otherwise, prevent default browser wheel behavior (scrolling the page)
      e.preventDefault();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isMapReady]);

  // Re-center map and animate camera padding when desktop sidebar collapse state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || isMobile) return;

    const sidebarWidth = isSidebarCollapsed ? 40 : 340;

    map.easeTo({
      padding: { top: 40, bottom: 40, left: sidebarWidth + 40, right: 40 },
      duration: 500, // Matches sidebar CSS transition duration
      essential: true
    });
  }, [isSidebarCollapsed, isMapReady, isMobile]);

  // 5. Update raster layer visibility / opacity during loading
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;
    try {
      const targetOpacity = isMapSwitchLoading ? 0 : 1;
      const maxSlices = 25;
      for (let i = 0; i < maxSlices; i++) {
        ['low', 'high'].forEach(res => {
          const lyrId = `historical-map-layer-${i}-${res}`;
          if (map.getLayer(lyrId)) {
            map.setPaintProperty(lyrId, 'raster-opacity', targetOpacity);
          }
        });
        const oldLyrId = `historical-map-layer-${i}`;
        if (map.getLayer(oldLyrId)) {
          map.setPaintProperty(oldLyrId, 'raster-opacity', targetOpacity);
        }
      }
      if (map.getLayer('historical-map-layer')) {
        map.setPaintProperty('historical-map-layer', 'raster-opacity', targetOpacity);
      }
    } catch (e) {
      console.warn("Failed to set raster opacity:", e);
    }
  }, [isMapSwitchLoading, isMapReady]);

  // 6. Update cursor based on Add Mode state
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const canvas = map.getCanvas();
    if (isAddMode) {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = '';
    }
  }, [isAddMode]);

  // 7. Sync background paint color when dark mode changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;
    try {
      map.setPaintProperty('background', 'background-color', isMapDarkMode ? '#0d0d0d' : '#f4f4f4');
    } catch (e) {
      console.warn("Failed to set Mapbox background paint:", e);
    }
  }, [isMapDarkMode, isMapReady]);

  // 7.5. Handle translation hotspot interactions (hover highlights and popups)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !map.getLayer('hotspots-fill')) return;

    let hoveredHotspotId: string | number | null = null;

    const handleMouseMove = (e: any) => {
      if (e.features && e.features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        const feature = e.features[0];
        const featureId = feature.id || feature.properties?.id;

        if (hoveredHotspotId !== featureId) {
          if (hoveredHotspotId !== null) {
            map.setFeatureState(
              { source: 'hotspots-src', id: hoveredHotspotId },
              { hover: false }
            );
          }

          hoveredHotspotId = featureId;
          if (hoveredHotspotId !== null) {
            map.setFeatureState(
              { source: 'hotspots-src', id: hoveredHotspotId },
              { hover: true }
            );
          }

          if (hoverPopupRef.current) {
            const props = feature.properties;
            const tooltipContainer = document.createElement('div');
            tooltipContainer.className = 'label-fade-in';
            tooltipContainer.style.background = '#000000';
            tooltipContainer.style.color = '#ffffff';
            tooltipContainer.style.border = `1px solid ${theme.border}`;
            tooltipContainer.style.padding = '12px';
            tooltipContainer.style.borderRadius = '8px';
            tooltipContainer.style.fontSize = '11px';
            tooltipContainer.style.fontFamily = '"Space Mono", monospace';
            tooltipContainer.style.maxWidth = '250px';
            tooltipContainer.style.pointerEvents = 'none'; // Critical hover stability fix!
            tooltipContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';

            tooltipContainer.innerHTML = `
              <div style="font-weight: bold; border-bottom: 1px solid ${theme.borderLight}; padding-bottom: 4px; margin-bottom: 6px; color: #74F8F3; font-family: 'Space Mono', monospace;">${props.name}</div>
              <div style="font-style: italic; margin-bottom: 4px; font-family: 'Space Mono', monospace; color: #ffffff;">"${props.originalText}"</div>
              <div style="font-weight: bold; margin-bottom: 6px; color: #ffffff; font-family: 'Space Mono', monospace;">→ ${props.translatedText}</div>
              <div style="font-size: 9px; opacity: 0.85; color: #bbbbbb; line-height: 12px; font-family: 'Space Mono', monospace;">${props.context}</div>
            `;

            hoverPopupRef.current
              .setLngLat(e.lngLat)
              .setDOMContent(tooltipContainer)
              .addTo(map);
          }
        }
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      if (hoveredHotspotId !== null) {
        map.setFeatureState(
          { source: 'hotspots-src', id: hoveredHotspotId },
          { hover: false }
        );
        hoveredHotspotId = null;
      }
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
      }
    };

    map.on('mousemove', 'hotspots-fill', handleMouseMove);
    map.on('mouseleave', 'hotspots-fill', handleMouseLeave);

    return () => {
      if (map) {
        map.off('mousemove', 'hotspots-fill', handleMouseMove);
        map.off('mouseleave', 'hotspots-fill', handleMouseLeave);
      }
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
      }
    };
  }, [isMapDarkMode, theme, isMapReady]);

  // 8. Render markers onto the Mapbox instance with dynamic zoom scaling
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    // Clean up previous markers and remove active popup
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (hoverPopupRef.current) {
      hoverPopupRef.current.remove();
    }

    // If disabled, don't build new markers
    if (!showNotes) return;

    // Initialize shared hover popup once
    if (!hoverPopupRef.current) {
      hoverPopupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'hover-tooltip-popup',
        anchor: 'bottom',
        offset: [0, -26]
      });
    }

    // Filter notes on client side as a safeguard to only show notes for the selected map
    const mapNotes = notes.filter(point => point.mapId === selectedMap.id);

    // Get dynamic diameter based on map zoom to scale pins exactly like the main map
    const getTargetDiameter = (currentZoom: number) => {
      // 2x larger: min size 14px, max size 32px (double the original 7px to 16px)
      return Math.max(14, Math.min(32, 14 + (currentZoom - 3) * 2));
    };

    const initialDiameter = getTargetDiameter(map.getZoom());

    mapNotes.forEach((point) => {
      // Create custom vintage styled HTML marker container
      const el = document.createElement('div');
      el.style.width = '32px'; // Allow bounds for largest scaled sizes (max size is 32px)
      el.style.height = '32px';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Get the contrasting color for the selected map
      const currentPinColor = selectedMap.pinColor || '#FF5E97';

      // Inner dot styled exactly like unclustered circular pins on the main map
      const elInner = document.createElement('div');
      elInner.className = 'pulsing-cartography-pin';
      elInner.style.setProperty('--pin-pulse-color', `${currentPinColor}B3`);
      elInner.style.setProperty('--pin-pulse-color-fade', `${currentPinColor}00`);
      elInner.style.width = `${initialDiameter}px`;
      elInner.style.height = `${initialDiameter}px`;
      elInner.style.borderRadius = '50%';
      elInner.style.backgroundColor = currentPinColor; // Map-specific contrast color
      elInner.style.border = `1px solid ${isMapDarkMode ? '#000000' : '#ffffff'}`;
      elInner.style.transition = 'transform 0.15s ease, width 0.1s ease, height 0.1s ease';
      el.appendChild(elInner);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      // Show popup/tooltip on hover using shared popup instance
      el.addEventListener('mouseenter', () => {
        elInner.style.transform = 'scale(1.3)';
        if (hoverPopupRef.current) {
          const tooltipContainer = document.createElement('div');
          tooltipContainer.className = 'label-fade-in';
          tooltipContainer.innerText = point.note;
          tooltipContainer.style.background = isMapDarkMode ? '#ffffff' : '#000000';
          tooltipContainer.style.color = isMapDarkMode ? '#000000' : '#ffffff';
          tooltipContainer.style.padding = '5px 12px';
          tooltipContainer.style.minHeight = '22px';
          tooltipContainer.style.height = 'auto';
          tooltipContainer.style.display = 'flex';
          tooltipContainer.style.alignItems = 'center';
          tooltipContainer.style.justifyContent = 'center';
          tooltipContainer.style.borderRadius = '12px';
          tooltipContainer.style.fontSize = '10px';
          tooltipContainer.style.fontWeight = '500';
          tooltipContainer.style.fontFamily = '"Space Mono", monospace';
          tooltipContainer.style.whiteSpace = 'normal';
          tooltipContainer.style.wordBreak = 'break-word';
          tooltipContainer.style.maxWidth = 'min(80vw, 240px)';
          tooltipContainer.style.textAlign = 'center';
          tooltipContainer.style.lineHeight = '1.3';
          tooltipContainer.style.position = 'relative';
          tooltipContainer.style.pointerEvents = 'none';
          
          // Triangle arrow below bubble
          const arrow = document.createElement('div');
          arrow.style.position = 'absolute';
          arrow.style.bottom = '-8px';
          arrow.style.left = '50%';
          arrow.style.transform = 'translateX(-50%)';
          arrow.style.width = '0';
          arrow.style.height = '0';
          arrow.style.borderLeft = '8px solid transparent';
          arrow.style.borderRight = '8px solid transparent';
          arrow.style.borderTop = `8px solid ${isMapDarkMode ? '#ffffff' : '#000000'}`;
          tooltipContainer.appendChild(arrow);

          hoverPopupRef.current
            .setLngLat([point.lng, point.lat])
            .setDOMContent(tooltipContainer)
            .addTo(map);
        }
      });

      // Hide popup/tooltip when mouse leaves
      el.addEventListener('mouseleave', () => {
        elInner.style.transform = '';
        if (hoverPopupRef.current) {
          hoverPopupRef.current.remove();
        }
      });

      markersRef.current.push(marker);
    });

    // Update marker sizes dynamically on zoom to match vector layer scaling
    const handleZoom = () => {
      const zoom = map.getZoom();
      const diameter = getTargetDiameter(zoom);
      const sizeStr = `${diameter}px`;
      
      markersRef.current.forEach(marker => {
        const element = marker.getElement();
        const innerDot = element.firstChild as HTMLDivElement;
        if (innerDot) {
          innerDot.style.width = sizeStr;
          innerDot.style.height = sizeStr;
        }
      });
    };

    map.on('zoom', handleZoom);

    return () => {
      map.off('zoom', handleZoom);
    };
  }, [notes, showNotes, isMapReady, selectedMap, isMapDarkMode]);

  // Submit note via backend API (bypassing Firestore client permissions)
  const handleNoteSubmit = async () => {
    if (!submissionCoords || !noteText.trim()) return;
    if (noteText.length > 120) {
      setSubmitError("Notes must be 120 characters or less.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/cartography-points/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapId: selectedMap.id,
          lng: submissionCoords.lng,
          lat: submissionCoords.lat,
          note: noteText.trim()
        })
      });

      if (!res.ok) throw new Error("API creation endpoint returned status code error");
      const data = await res.json();

      if (data.success) {
        setNoteText('');
        setSubmissionCoords(null);
        // Instant notes reload on success
        loadPoints();
      }
    } catch (e: any) {
      console.error("Error creating map note:", e);
      setSubmitError("Failed to save note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fly/pan map to specific coordinates (helper for note clicks)
  const handleNoteClick = (point: SavedPoint) => {
    const map = mapRef.current;
    if (!map) return;

    map.easeTo({
      center: [point.lng, point.lat],
      zoom: 4,
      duration: 800
    });
  };

  return (
    <div 
      ref={rootRef}
      style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      background: isMapDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      color: theme.text,
      fontFamily: '"Space Mono", monospace',
      position: 'relative',
      borderTop: `1px solid ${theme.border}`,
      pointerEvents: 'none'
    }}>
      <style>{`
        @keyframes pinPulse {
          0% {
            box-shadow: 0 0 0 0 var(--pin-pulse-color, rgba(255, 94, 151, 0.7));
          }
          70% {
            box-shadow: 0 0 0 12px var(--pin-pulse-color-fade, rgba(255, 94, 151, 0));
          }
          100% {
            box-shadow: 0 0 0 0 var(--pin-pulse-color-fade, rgba(255, 94, 151, 0));
          }
        }
        .pulsing-cartography-pin {
          animation: pinPulse 2s infinite ease-in-out;
        }
      `}</style>
      {/* 20PX FAR LEFT PROTECTIVE SIDE STRIP */}
      {!isMobile && (
        <div 
          className="far-left-strip"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '20px',
            background: theme.bg,
            borderRight: `1px solid ${theme.border}`,
            zIndex: 10,
            pointerEvents: 'auto'
          }} 
        />
      )}

      {/* SIDEBAR PANEL */}
      <motion.div 
        ref={sidebarRef}
        initial={false}
        animate={isMobile ? {
          height: isSidebarCollapsed ? 'calc(108px + max(12px, env(safe-area-inset-bottom, 12px)))' : '70vh',
          left: 0,
          right: 0,
          bottom: 0
        } : { 
          left: isSidebarCollapsed ? -280 : 20,
          top: 0,
          bottom: 0
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: isMobile ? 'fixed' : 'absolute',
          width: isMobile ? '100%' : '300px',
          borderRight: isMobile ? 'none' : `1px solid ${theme.border}`,
          borderTop: isMobile ? `1px solid ${theme.border}` : 'none',
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          zIndex: isMobile ? 10000 : 5,
          pointerEvents: 'auto',
          flexShrink: 0,
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 0px)' : 0
        }}
      >
        {isMobile && (
          <motion.button
            whileHover={{ opacity: 0.8 }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={!isSidebarCollapsed ? 'Minimize Panel' : 'Maximize Panel'}
            style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '20px',
              background: theme.text,
              color: theme.bg,
              border: 'none',
              cursor: 'pointer',
              zIndex: 10001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              borderRadius: 0,
            }}
          >
            <img
              src="/icons/icon-arrow-left.svg"
              alt="toggle"
              style={{
                width: '6px',
                height: '12px',
                transform: !isSidebarCollapsed ? 'rotate(270deg)' : 'rotate(90deg)',
                filter: isMapDarkMode ? 'brightness(0)' : 'none',
              }}
            />
          </motion.button>
        )}
        {/* ABSOLUTE POSITIONED FIXED BUTTON TAB FOR SIDEBAR COLLAPSE */}
        {!isMobile && (
          <motion.button 
          whileHover={{ opacity: 0.8 }}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title={isSidebarCollapsed ? "Maximize Maps" : "Minimize Maps"}
          style={{
            position: 'absolute',
            top: '-1px',
            right: '-20px',
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
              transform: isSidebarCollapsed ? 'rotate(180deg)' : 'none',
              filter: theme.invert
            }} 
          />
        </motion.button>
        )}

        {/* TITLE HEADER */}
        {!isMobile && (
          <div style={{ 
            height: '40px', 
            padding: '0 16px', 
            borderBottom: `1px solid ${theme.border}`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            background: 'transparent', 
            flexShrink: 0, 
            zIndex: 20 
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg 
                width="30" 
                height="30" 
                viewBox="0 0 30 30" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                  marginRight: '3px',
                  filter: theme.invert,
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
              >
                <g clipPath="url(#clip0_carto_header)">
                  <circle cx="15" cy="15" r="15" fill="#ffffff" />
                  <path d="M6 15C6 19.9705 10.0294 24 15 24C19.9705 24 24 19.9705 24 15C24 10.0294 19.9705 6 15 6C10.0294 6 6 10.0294 6 15Z" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.9 6.04431C15.9 6.04431 18.6 9.59987 18.6 14.9998C18.6 20.3998 15.9 23.9555 15.9 23.9555" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.1 23.9555C14.1 23.9555 11.4 20.3998 11.4 14.9998C11.4 9.59987 14.1 6.04431 14.1 6.04431" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.56665 18.15H23.4333" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.56665 11.85H23.4333" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_carto_header)">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span style={{ 
                fontWeight: '700', 
                fontSize: '20px', 
                lineHeight: '24px', 
                textTransform: 'uppercase', 
                fontFamily: '"Space Mono", monospace',
                color: theme.text
              }}>
                MAPS
              </span>
            </div>
          </div>
        )}

        {/* SEARCH BAR CONTAINER */}
        <div style={{ padding: isMobile ? '8px 16px' : '16px', borderBottom: `1px solid ${theme.border}`, background: theme.bg, flexShrink: 0, zIndex: 100 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text" 
              placeholder="SEARCH HISTORICAL MAPS OR NOTES..." 
              value={searchQuery}
              onFocus={() => {
                setShowSearchResults(true);
                if (isMobile) setIsSidebarCollapsed(false);
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.currentTarget as HTMLInputElement).blur();
                  if (searchActiveIndex >= 0 && searchActiveIndex < totalResultsCount) {
                    e.preventDefault();
                    if (searchActiveIndex < visibleMaps.length) {
                      handleMapSelect(visibleMaps[searchActiveIndex]);
                    } else {
                      handleNoteSelect(visibleNotes[searchActiveIndex - visibleMaps.length]);
                    }
                  } else if (totalResultsCount > 0) {
                    e.preventDefault();
                    if (visibleMaps.length > 0) {
                      handleMapSelect(visibleMaps[0]);
                    } else if (visibleNotes.length > 0) {
                      handleNoteSelect(visibleNotes[0]);
                    }
                  }
                  return;
                }

                if (!showSearchResults || totalResultsCount === 0) return;

                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSearchActiveIndex(prev => (prev + 1) % totalResultsCount);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSearchActiveIndex(prev => (prev - 1 + totalResultsCount) % totalResultsCount);
                } else if (e.key === 'Escape') {
                  setShowSearchResults(false);
                }
              }}
              style={{
                width: '100%',
                height: isMobile ? '38px' : 'auto',
                padding: isMobile ? '0 32px 0 12px' : '10px 32px 10px 12px',
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
                onClick={() => {
                  setSearchQuery('');
                }}
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

            {/* SEARCH RESULTS DROPDOWN */}
            <AnimatePresence>
              {showSearchResults && (searchQuery.trim().length > 1) && (
                <>
                  {/* OVERLAY TO CLOSE DROPDOWN */}
                  <div 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} 
                    onClick={() => setShowSearchResults(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: 'absolute',
                      top: (isMobile && isSidebarCollapsed) ? 'auto' : '42px',
                      bottom: (isMobile && isSidebarCollapsed) ? '42px' : 'auto',
                      left: 0,
                      right: 0,
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      maxHeight: isMobile ? (isSidebarCollapsed ? '250px' : 'calc(70vh - 110px)') : '400px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: (isMobile && isSidebarCollapsed)
                        ? (isMapDarkMode ? '0 -4px 20px rgba(0,0,0,0.5)' : '0 -4px 12px rgba(0,0,0,0.1)')
                        : (isMapDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)')
                    }}
                  >
                    {/* HISTORICAL MAPS */}
                    {visibleMaps.length > 0 && (
                      <div style={{ borderBottom: visibleNotes.length > 0 ? `1px solid ${theme.borderLight}` : 'none' }}>
                        <div style={{ padding: '8px 12px', fontSize: '10px', background: isMapDarkMode ? '#1a1a1a' : '#f8f8f8', borderBottom: `1px solid ${theme.borderLight}`, fontWeight: 'bold', color: theme.text }}>HISTORICAL MAPS</div>
                        {visibleMaps.map((hMap, idx) => {
                          const isSelected = searchActiveIndex === idx;
                          return (
                            <div 
                              key={`map-${hMap.id}`}
                              onClick={() => handleMapSelect(hMap)}
                              className={isMapDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}
                              style={{ 
                                padding: '10px 12px', 
                                cursor: 'pointer', 
                                borderBottom: idx < visibleMaps.length - 1 ? `1px solid ${theme.borderLight}` : 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                background: isSelected ? (isMapDarkMode ? '#1f2937' : '#f3f4f6') : 'transparent'
                              }}
                            >
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hMap.pinColor || '#FF5E97' }} />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: theme.text }}>{hMap.name}</span>
                                <span style={{ fontSize: '9px', color: theme.textDim }}>{hMap.year}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* MAP PINS / NOTES */}
                    {visibleNotes.length > 0 && (
                      <div>
                        <div style={{ padding: '8px 12px', fontSize: '10px', background: isMapDarkMode ? '#1a1a1a' : '#f8f8f8', borderBottom: `1px solid ${theme.borderLight}`, fontWeight: 'bold', color: theme.text }}>MAP PINS / NOTES</div>
                        {visibleNotes.map((notePoint, idx) => {
                          const isSelected = searchActiveIndex === visibleMaps.length + idx;
                          const noteMap = HISTORICAL_MAPS.find(m => m.id === notePoint.mapId);
                          return (
                            <div 
                              key={`note-${notePoint.id}`}
                              onClick={() => handleNoteSelect(notePoint)}
                              className={isMapDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}
                              style={{ 
                                padding: '10px 12px', 
                                cursor: 'pointer', 
                                borderBottom: idx < visibleNotes.length - 1 ? `1px solid ${theme.borderLight}` : 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                background: isSelected ? (isMapDarkMode ? '#1f2937' : '#f3f4f6') : 'transparent'
                              }}
                            >
                              <img src="/icons/icon-map-pin.svg" style={{ width: '12px', filter: theme.invert }} alt="pin" />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '11px', color: theme.text }}>{notePoint.note}</span>
                                <span style={{ fontSize: '9px', color: theme.textDim }}>Map: {noteMap?.name || 'Unknown'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {visibleMaps.length === 0 && visibleNotes.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: '#999' }}>NO RESULTS FOUND</div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* If mobile, render centered maps header here (below search bar) with no X close button */}
        {isMobile && (
          <div style={{ 
            height: '54px', 
            padding: '0 16px', 
            borderBottom: `1px solid ${theme.border}`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'transparent', 
            flexShrink: 0, 
            zIndex: 20 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg 
                width="30" 
                height="30" 
                viewBox="0 0 30 30" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                  marginRight: '6px',
                  filter: theme.invert,
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
              >
                <g clipPath="url(#clip0_carto_header_mob)">
                  <circle cx="15" cy="15" r="15" fill="#ffffff" />
                  <path d="M6 15C6 19.9705 10.0294 24 15 24C19.9705 24 24 19.9705 24 15C24 10.0294 19.9705 6 15 6C10.0294 6 6 10.0294 6 15Z" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.9 6.04431C15.9 6.04431 18.6 9.59987 18.6 14.9998C18.6 20.3998 15.9 23.9555 15.9 23.9555" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.1 23.9555C14.1 23.9555 11.4 20.3998 11.4 14.9998C11.4 9.59987 14.1 6.04431 14.1 6.04431" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.56665 18.15H23.4333" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.56665 11.85H23.4333" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_carto_header_mob)">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span style={{ 
                fontWeight: '700', 
                fontSize: '18px', 
                lineHeight: '24px', 
                textTransform: 'uppercase', 
                fontFamily: '"Space Mono", monospace',
                color: theme.text
              }}>
                MAPS
              </span>
            </div>
          </div>
        )}

        {/* MAP GALLERY SELECTOR LIST */}
        {(!isMobile || !isSidebarCollapsed) && (
          <div 
            id="cartography-scrollbar"
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: 'scroll',
              padding: '0 0 15px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              background: 'transparent'
            }}
          >
            <span style={{ fontSize: '9px', color: theme.textDim, letterSpacing: '1.5px', fontWeight: 'bold', padding: '16px 20px 2px 20px' }}>SELECT MAP TO EXPLORE</span>
            {/* STICKY TOP SPACER FOR 8PX PADDING + MASKING */}
            <div style={{ position: 'sticky', top: 0, height: '8px', background: theme.bg, zIndex: 11, flexShrink: 0 }} />
            {ERAS.map((era) => {
              const eraMaps = [...HISTORICAL_MAPS]
                 .filter(m => m.era === era.id)
                 .map(m => ({
                   ...m,
                   cleanName: m.name.replace(/^The\s+/i, '')
                 }))
                 .sort((a, b) => a.cleanName.localeCompare(b.cleanName));

              if (eraMaps.length === 0) return null;

              const isExpanded = !!expandedEras[era.id];

              return (
                <div key={era.id} style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
                  <EraAccordionHeader
                    era={era}
                    isExpanded={isExpanded}
                    theme={theme}
                    onToggleExpand={() => setExpandedEras(prev => ({ ...prev, [era.id]: !prev[era.id] }))}
                    getEraFolderBgColor={getEraFolderBgColor}
                  />

                  {/* Accordion Content wrapper */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: isExpanded ? 'visible' : 'hidden' }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '12px 35px 12px 35px'
                    }}>
                      {eraMaps.map((hMap) => {
                        const isSelected = hMap.id === selectedMap.id;
                        return (
                          <motion.div
                            key={hMap.id}
                            id={`map-card-${hMap.id}`}
                            onClick={() => handleMapSelect(hMap)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleMapSelect(hMap);
                              }
                            }}
                            whileHover={{
                              scale: 1.02,
                              y: -2,
                              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                            }}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              color: theme.text,
                              border: isSelected ? '3px solid #000000' : `1px solid ${theme.border}`,
                              padding: 0,
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderRadius: '20px',
                              overflow: 'hidden',
                              transition: 'background-color 0.2s ease, border-color 0.2s ease, border-width 0.1s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'stretch',
                              flexShrink: 0
                            }}
                          >
                            {/* THUMBNAIL */}
                            <div style={{
                              position: 'relative',
                              width: '100%',
                              height: '112px',
                              borderBottom: `1px solid ${isSelected ? '#000000' : theme.border}`,
                              overflow: 'hidden',
                              background: isMapDarkMode ? '#111' : '#eee',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {/* Globe Icon in top-left with map-specific background pin color */}
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  left: '4px',
                                  zIndex: 2
                                }}
                              >
                                <g clipPath={`url(#clip0_carto_thumb_${hMap.id})`}>
                                  <circle cx="15" cy="15" r="15" fill={hMap.pinColor || '#FF5E97'} />
                                  <path d="M6 15C6 19.9705 10.0294 24 15 24C19.9705 24 24 19.9705 24 15C24 10.0294 19.9705 6 15 6C10.0294 6 6 10.0294 6 15Z" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M15.9 6.04431C15.9 6.04431 18.6 9.59987 18.6 14.9998C18.6 20.3998 15.9 23.9555 15.9 23.9555" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M14.1 23.9555C14.1 23.9555 11.4 20.3998 11.4 14.9998C11.4 9.59987 14.1 6.04431 14.1 6.04431" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M6.56665 18.15H23.4333" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M6.56665 11.85H23.4333" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                  <clipPath id={`clip0_carto_thumb_${hMap.id}`}>
                                    <rect width="30" height="30" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>

                              {/* Pin Counter Badge in top-right corner */}
                              {notes.length > 0 && (() => {
                                const pinCount = notes.filter(point => point.mapId === hMap.id).length;
                                if (pinCount === 0) return null;
                                return (
                                  <div style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(2px)',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontFamily: '"Space Mono", monospace',
                                    fontWeight: '400',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '0 16px 0 4px',
                                    borderRadius: '15px',
                                    letterSpacing: '0.5px',
                                    whiteSpace: 'nowrap',
                                    zIndex: 2,
                                    pointerEvents: 'none'
                                  }}>
                                    <img
                                      src="/icons/icon-map-pin.svg"
                                      style={{
                                        width: '24px',
                                        height: '24px',
                                        filter: 'brightness(0) invert(1)'
                                      }}
                                      alt="pin icon"
                                    />
                                    <span>{pinCount}</span>
                                  </div>
                                );
                              })()}

                              {!loadedThumbnails[hMap.id] && (
                                <div className="loading-spinner" style={{
                                  position: 'absolute',
                                  border: `2px solid ${isMapDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                  borderTopColor: hMap.pinColor || '#FF5E97'
                                }} />
                              )}
                              <img
                                src={hMap.thumbnailUrl || getThumbnailUrl(hMap.url)}
                                alt={hMap.name}
                                loading="lazy"
                                onLoad={() => setLoadedThumbnails(prev => ({ ...prev, [hMap.id]: true }))}
                                onError={(e) => {
                                  setLoadedThumbnails(prev => ({ ...prev, [hMap.id]: true }));
                                  const currentSrc = (e.target as HTMLImageElement).src;
                                  if (currentSrc.includes('weserv.nl')) {
                                    (e.target as HTMLImageElement).src = `/api/proxy-resource?url=${encodeURIComponent(hMap.url)}`;
                                  }
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transform: 'scale(1.18)',
                                  opacity: loadedThumbnails[hMap.id] ? (isSelected ? 0.95 : 0.75) : 0,
                                  transition: 'opacity 0.2s ease, transform 0.2s ease'
                                }}
                              />
                            </div>

                            {/* TEXT CONTENT */}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              padding: '12px 14px',
                              background: isSelected ? (hMap.pinColor || '#FF5E97') : 'transparent',
                              color: isSelected ? '#000000' : theme.text,
                              transition: 'background-color 0.2s ease, color 0.2s ease'
                            }}>
                              <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', lineHeight: '14px' }}>
                                {hMap.name}
                              </span>
                              <div style={{
                                fontSize: '8px',
                                fontWeight: 'bold',
                                fontFamily: '"Space Mono", monospace',
                                letterSpacing: '1px',
                                opacity: isSelected ? 0.8 : 0.6,
                                color: isSelected ? '#000000' : theme.textDim
                              }}>
                                CREATION DATE: {hMap.year}
                              </div>
                              <p style={{
                                fontSize: '9px',
                                lineHeight: '13px',
                                margin: 0,
                                opacity: isSelected ? 0.9 : 0.7,
                                color: isSelected ? '#000000' : theme.textDim
                              }}>
                                {hMap.description}
                              </p>
                              {isSelected && (
                                <div style={{ display: 'flex', marginTop: '4px' }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const shareUrl = `${window.location.origin}/cartography?mapId=${encodeURIComponent(hMap.id)}`;
                                      openShareModal(hMap.name, hMap.description || '', shareUrl, 'Historical Cartography', hMap.url);
                                    }}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      background: 'transparent',
                                      color: '#000000',
                                      border: '1px solid #000000',
                                      padding: '3px 8px',
                                      borderRadius: '12px',
                                      fontSize: '9px',
                                      fontWeight: 'bold',
                                      fontFamily: '"Space Mono", monospace',
                                      cursor: 'pointer'
                                    }}
                                    title="Share this map"
                                  >
                                    <Share2 size={10} />
                                    <span>SHARE</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* FULLSCREEN MAP CANVAS AREA */}
      <div style={{
        flex: 1,
        height: '100%',
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'auto',
        backgroundImage: `url("${svgGrid}")`,
        backgroundRepeat: 'repeat'
      }}>
        {/* MAP DIV */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: 'transparent' }} />

        {/* MAP VIEW TITLE OVERLAY - TOP RIGHT (DESKTOP) / FULL WIDTH CENTERED (MOBILE) */}
        <div 
          onClick={() => {
            if (isMobile) setIsSidebarCollapsed(false);
          }}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            left: isMobile ? '0' : 'auto',
            zIndex: 10,
            background: isMobile ? 'rgba(0, 0, 0, 0.80)' : '#000000',
            color: '#ffffff',
            borderLeft: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0 16px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            pointerEvents: isMobile ? 'auto' : 'none',
            cursor: isMobile ? 'pointer' : 'default',
            backdropFilter: isMobile ? 'blur(4px)' : 'none',
            WebkitBackdropFilter: isMobile ? 'blur(4px)' : 'none',
          }}
        >
          {isMobile && <MapIcon size={14} />}
          <span style={{ fontSize: isMobile ? '11px' : '10px', fontWeight: 'bold', fontFamily: '"Space Mono", monospace', letterSpacing: isMobile ? '1.5px' : '1px', textTransform: isMobile ? 'uppercase' : 'none' }}>
            {selectedMap.name} ({selectedMap.year})
          </span>
        </div>



        {/* CONTROLS OVERLAY - BOTTOM LEFT */}
        <div style={{
          position: 'absolute',
          bottom: isMobile ? 'calc(152px + max(12px, env(safe-area-inset-bottom, 12px)))' : '20px',
          left: isMobile ? '20px' : (isSidebarCollapsed ? '40px' : '340px'),
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
          pointerEvents: 'none',
          transition: 'left 0.5s ease, bottom 0.5s ease'
        }}>
          {/* Share Map Button */}
          <motion.button
            onClick={() => {
              const shareUrl = `${window.location.origin}/cartography?mapId=${encodeURIComponent(selectedMap.id)}`;
              openShareModal(selectedMap.name, selectedMap.description || '', shareUrl, 'Historical Cartography', selectedMap.url);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isMapDarkMode ? '#ffffff' : '#000000',
              color: isMapDarkMode ? '#000000' : '#ffffff',
              border: `1px solid ${theme.border}`,
              padding: '0 16px',
              height: '32px',
              fontSize: '9px',
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.15s ease'
            }}
            title="Share this historical map"
          >
            <Share2 size={10} strokeWidth={3} />
            <span>SHARE</span>
          </motion.button>

          {/* Add Pin Button */}
          <motion.button
            onClick={() => setIsAddMode(!isAddMode)}
            whileHover={{
              background: isAddMode ? (selectedMap.pinColor || '#FF5E97') : (isMapDarkMode ? '#cccccc' : '#333333'),
              scale: 1.02
            }}
            style={{
              background: isAddMode ? (selectedMap.pinColor || '#FF5E97') : (isMapDarkMode ? '#ffffff' : '#000000'),
              color: isAddMode ? '#000000' : (isMapDarkMode ? '#000000' : '#ffffff'),
              border: `1px solid ${theme.border}`,
              padding: '0 16px',
              height: '32px',
              fontSize: '9px',
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'color 0.15s ease, border-color 0.15s ease'
            }}
          >
            {isAddMode ? <X size={10} strokeWidth={3} /> : <Plus size={10} strokeWidth={3} />}
            <span>{isAddMode ? 'CANCEL PLACEMENT' : 'ADD PIN'}</span>
          </motion.button>

          {/* Show Pins Toggle */}
          <div style={{
            background: isMapDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '0 12px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            boxSizing: 'border-box'
          }}>
            <span style={{ 
              fontSize: '9px', 
              fontWeight: 700, 
              fontFamily: '"Space Mono", monospace', 
              letterSpacing: '1px',
              color: theme.text 
            }}>
              {showNotes ? 'SHOW PINS' : 'HIDE PINS'}
            </span>
            <button 
              onClick={() => setShowNotes(!showNotes)}
              style={{
                width: '32px',
                height: '16px',
                borderRadius: '8px',
                background: showNotes ? (isMapDarkMode ? '#ffffff' : '#000000') : (isMapDarkMode ? '#333' : '#eee'), 
                border: `1px solid ${theme.border}`,
                position: 'relative',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: showNotes ? (isMapDarkMode ? '#000000' : '#ffffff') : (isMapDarkMode ? '#ffffff' : '#000000'),
                position: 'absolute',
                top: '2px',
                left: showNotes ? '19px' : '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </button>
          </div>
        </div>

        {/* PROGRESS LOADING OVERLAY */}
        <AnimatePresence>
          {isMapSwitchLoading && loadProgress !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: isMobile ? '0' : (isSidebarCollapsed ? '20px' : '320px'),
                right: 0,
                bottom: 0,
                background: theme.bg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                zIndex: 60,
                transition: 'left 0.5s ease'
              }}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                border: '2px solid', 
                borderColor: isMapDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', 
                borderTopColor: selectedMap.pinColor || '#FF5E97', 
                animation: 'spinMapAsset 0.8s linear infinite',
                marginBottom: '4px'
              }} />
              <span style={{ 
                fontSize: '11px', 
                fontWeight: '700', 
                fontFamily: '"Space Mono", monospace', 
                letterSpacing: '2px', 
                textTransform: 'uppercase',
                color: theme.text
              }}>
                LOADING ARCHIVAL PROJECTION
              </span>
              <span style={{ 
                fontSize: '9px', 
                fontWeight: '700', 
                fontFamily: '"Space Mono", monospace', 
                letterSpacing: '1px',
                color: theme.textDim,
                marginTop: '-4px'
              }}>
                {loadProgress}% COMPLETE
              </span>
              <div style={{
                width: '200px',
                height: '2px',
                background: isMapDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                position: 'relative',
                marginTop: '4px'
              }}>
                <div style={{
                  width: `${loadProgress}%`,
                  height: '100%',
                  background: selectedMap.pinColor || '#FF5E97',
                  transition: 'width 0.1s linear'
                }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUBTLE RESOLUTION UPGRADE LOADER */}
        <AnimatePresence>
          {!isMapSwitchLoading && loadProgress !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: isMobile ? '50%' : (isSidebarCollapsed ? 'calc(50% + 10px)' : 'calc(50% + 160px)'),
                background: isMapDarkMode ? 'rgba(6, 6, 6, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                border: `1.5px solid ${selectedMap.pinColor || '#FF5E97'}`,
                borderRadius: '12px',
                padding: '18px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                zIndex: 50,
                pointerEvents: 'none',
                boxShadow: isMapDarkMode 
                  ? `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px ${(selectedMap.pinColor || '#FF5E97')}33` 
                  : '0 10px 30px rgba(0,0,0,0.15)',
                transition: 'left 0.5s ease',
                fontFamily: '"Space Mono", monospace'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  border: '2px solid', 
                  borderColor: isMapDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', 
                  borderTopColor: selectedMap.pinColor || '#FF5E97', 
                  animation: 'spinMapAsset 0.8s linear infinite'
                }} />
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: theme.text
                }}>
                  UPGRADING RESOLUTION
                </span>
              </div>
              <div style={{
                width: '180px',
                height: '3px',
                background: isMapDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${loadProgress}%`,
                  height: '100%',
                  background: selectedMap.pinColor || '#FF5E97',
                  transition: 'width 0.1s linear'
                }} />
              </div>
              <span style={{ 
                fontSize: '9px', 
                fontWeight: 'bold', 
                letterSpacing: '1px',
                color: theme.textDim
              }}>
                {loadProgress}% COMPLETE
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BANNER NOTIFICATION WHEN IN ADD PIN MODE */}
        <AnimatePresence>
          {isAddMode && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              style={{
                position: 'absolute',
                bottom: isMobile ? '132px' : '24px',
                left: isMobile ? '50%' : (isSidebarCollapsed ? 'calc(50% + 10px)' : 'calc(50% + 160px)'),
                background: selectedMap.pinColor || '#FF5E97',
                color: '#000000',
                padding: '8px 14px',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 4,
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap',
                transition: 'left 0.5s ease, bottom 0.5s ease'
              }}
            >
              <img
                src="/icons/icon-arrow-down.svg"
                style={{
                  width: '14px',
                  height: '14px',
                  transform: 'rotate(-90deg)',
                  filter: 'brightness(0)',
                  pointerEvents: 'none'
                }}
                alt="arrow"
                draggable={false}
              />
              Click anywhere on the historical projection to place a pin
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOTE SUBMISSION MODAL OVERLAY */}
        <AnimatePresence>
          {submissionCoords && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                fontFamily: '"Space Mono", monospace',
                padding: '20px'
              }}
            >
              <motion.button 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ opacity: 0.7 }}
                onClick={() => setSubmissionCoords(null)} 
                style={{ 
                  position: 'absolute', 
                  top: '24px', 
                  right: '24px', 
                  background: 'none', 
                  border: 'none', 
                  color: '#ffffff', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  fontFamily: '"Space Mono", monospace', 
                  letterSpacing: '1px', 
                  zIndex: 10001, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}
              >
                <X size={20} strokeWidth={2.5} />
                CLOSE
              </motion.button>

              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                style={{
                  width: '420px',
                  background: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                  color: isMapDarkMode ? '#ffffff' : '#000000',
                  border: `1px solid ${theme.border}`,
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: isMapDarkMode ? '0 10px 40px rgba(255,255,255,0.05)' : '0 15px 40px rgba(0,0,0,0.3)',
                  textAlign: 'left'
                }}
              >
                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  borderBottom: `2px solid ${theme.border}`, 
                  paddingBottom: '12px', 
                  marginBottom: '10px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: theme.text }}>
                      ADD NEW PIN //
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '9.5px', color: theme.textDim, fontFamily: '"Space Mono", monospace', lineHeight: '14px' }}>
                    MAP: {selectedMap.name.toUpperCase()} <br />
                    COORDINATES: [{submissionCoords.lng.toFixed(6)}, {submissionCoords.lat.toFixed(6)}]
                  </p>
                </div>

                {/* Textarea note content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 'bold', display: 'block', marginBottom: '2px', color: theme.text }}>
                    HISTORICAL NOTE / OBSERVATION
                  </label>
                  <textarea
                    rows={4}
                    maxLength={120}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Type your historical note or anomaly explanation here (max 120 characters)..."
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: `1px solid ${theme.border}`,
                      color: theme.text,
                      padding: '10px',
                      fontSize: '11px',
                      fontFamily: '"Space Mono", monospace',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: '"Space Mono", monospace' }}>
                    <span style={{ color: noteText.length === 120 ? (selectedMap.pinColor || '#FF5E97') : theme.textDim }}>
                      {noteText.length}/120 characters
                    </span>
                    {noteText.length === 120 && (
                      <span style={{ color: selectedMap.pinColor || '#FF5E97', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <AlertTriangle size={10} /> Limit reached
                      </span>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#ff3333', 
                    border: '1px solid #ff3333', 
                    padding: '8px', 
                    background: 'rgba(255,0,0,0.02)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontFamily: '"Space Mono", monospace' 
                  }}>
                    <AlertTriangle size={12} />
                    {submitError}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: '12px', 
                  borderTop: `1px solid ${theme.border}`, 
                  paddingTop: '16px', 
                  marginTop: '12px' 
                }}>
                  <button
                    onClick={() => setSubmissionCoords(null)}
                    style={{
                      background: 'transparent',
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      padding: '0 20px',
                      height: '32px',
                      borderRadius: '16px',
                      fontSize: '9px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: '"Space Mono", monospace',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleNoteSubmit}
                    disabled={isSubmitting || !noteText.trim()}
                    style={{
                      background: theme.text,
                      color: theme.bg,
                      border: 'none',
                      padding: '0 24px',
                      height: '32px',
                      borderRadius: '16px',
                      fontSize: '9px',
                      fontWeight: 700,
                      cursor: (!noteText.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
                      fontFamily: '"Space Mono", monospace',
                      opacity: (!noteText.trim() || isSubmitting) ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    SUBMIT PIN
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SHARE TOAST NOTIFICATION */}
        <AnimatePresence>
          {shareToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10000000,
                background: '#91FFC4',
                color: '#000000',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                padding: '10px 20px',
                borderRadius: '24px',
                fontFamily: '"Space Mono", monospace',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none'
              }}
            >
              <Share2 size={14} style={{ color: '#000000' }} />
              <span>{shareToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SHARE MODAL POPUP */}
        <ShareModal
          isOpen={shareModalData.isOpen}
          onClose={() => setShareModalData(prev => ({ ...prev, isOpen: false }))}
          title={shareModalData.title}
          text={shareModalData.text}
          url={shareModalData.url}
          category={shareModalData.category}
          imageUrl={shareModalData.imageUrl}
          isMapDarkMode={isMapDarkMode}
          onShowToast={showShareToast}
        />
      </div>
    </div>
  );
}
