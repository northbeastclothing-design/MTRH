// Cartography Page Component - Old World Maps Viewer
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import mapboxgl from 'mapbox-gl';
import { X, Map as MapIcon, Plus, Eye, EyeOff, Navigation, AlertTriangle, Loader2, Globe } from 'lucide-react';

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
}

interface HistoricalMap {
  id: string;
  name: string;
  year: string;
  description: string;
  url: string;
  aspectRatio: number;
  pinColor?: string;
}

// High-resolution digital archives and Wikimedia collections
const HISTORICAL_MAPS: HistoricalMap[] = [
  {
    id: 'babylonian',
    name: "Babylonian Map of the World",
    year: "c. 600 BC",
    description: "The oldest known map of the world, carved onto a clay tablet. It places Babylon at the center of the Euphrates, encircled by a ring of bitter waters and triangular outer islands.",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Map_of_the_World_from_Sippar%2C_Iraq%2C_6th_century_BCE._British_Museum.jpg",
    aspectRatio: 0.9202,
    pinColor: '#FF9BE1' // Neon pink
  },
  {
    id: 'gleason',
    name: "Gleason's New Standard Map",
    year: "1892",
    description: "An azimuthal equidistant projection showing the world flattened as a disk, surrounded by an ice wall. Heavily cited in flat earth and esoteric cartography models.",
    url: "https://iiif.digitalcommonwealth.org/iiif/2/commonwealth:7h149v867/full/4000,/0/default.jpg",
    aspectRatio: 0.7025,
    pinColor: '#FF5E97' // Contrasting deep pink (removes brand purple hardcoding)
  },
  {
    id: 'hereford',
    name: "Hereford Mappa Mundi",
    year: "c. 1300",
    description: "The largest surviving medieval European world map, displaying theological, geographical, and historical narratives in a circular frame centered on Jerusalem.",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/92/Hereford_Mappa_Mundi.jpg",
    aspectRatio: 0.8421,
    pinColor: '#74F8F3' // Neon teal
  },
  {
    id: 'kangnido',
    name: "Kangnido Map",
    year: "1402",
    description: "An early Joseon-dynasty Korean map detailing East Asia, the Silk Road, India, and Africa, representing the collision of Western Islamic and Far Eastern Chinese cartographical findings.",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/GeneralMapOfDistancesAndHistoricCapitals.jpg",
    aspectRatio: 1.2413,
    pinColor: '#FF9BE1' // Neon pink
  },
  {
    id: 'tartaria',
    name: "Map of Tartaria",
    year: "1606",
    description: "Jodocus Hondius's seminal engraving of the Great Empire of Tartary, detailing geographical regions, rivers, and cities spanning across Northern Asia and Russia.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Tartaria_by_Jodocus_Hondius.jpg/3840px-Tartaria_by_Jodocus_Hondius.jpg",
    aspectRatio: 1.3904,
    pinColor: '#90E9FF' // Neon cyan
  },
  {
    id: 'orontius',
    name: "Orontius Finaeus Map",
    year: "1531",
    description: "A famous heart-shaped cordiform projection created by French mathematician Oronce Fine, depicting a massive, detailed Antarctic landmass centuries before its official discovery.",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Oronce_Fine_1531.jpg",
    aspectRatio: 1.3474,
    pinColor: '#74F8F3' // Neon teal
  },
  {
    id: 'ortelius',
    name: "Ortelius World Map",
    year: "1570",
    description: "Abraham Ortelius's landmark 'Typus Orbis Terrarum' world map, published as the opening plate of the first modern atlas, mapping Tartaria, the Americas, and speculative polar coastlines.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/OrteliusWorldMap1570.jpg/3840px-OrteliusWorldMap1570.jpg",
    aspectRatio: 1.4683,
    pinColor: '#BAEAF4' // Light cyan
  },
  {
    id: 'pangaea',
    name: "Pangea Politica Map",
    year: "Modern (335M BC)",
    description: "A detailed scientific and political reconstruction by Massimo Pietrobon mapping modern country borders onto the prehistoric supercontinent of Pangaea.",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Pangea_political.jpg",
    aspectRatio: 1.0082,
    pinColor: '#FF9F63' // Bright orange
  },
  {
    id: 'peutinger',
    name: "Peutinger Table",
    year: "c. 4th Century",
    description: "An incredibly elongated map showing the cursus publicus (Roman road network) spanning from southern Britain all the way to India, optimized for traveler itinerary rather than shape accuracy.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/TabulaPeutingeriana.jpg/3840px-TabulaPeutingeriana.jpg",
    aspectRatio: 13.0612,
    pinColor: '#91FFC4' // Mint green
  },
  {
    id: 'ptolemy',
    name: "Ptolemy’s Geography",
    year: "c. 150 AD",
    description: "A classical Renaissance restoration of Claudius Ptolemy's geographical coordinates, showing the known world of the Roman Empire extending from Hibernia (Ireland) to China.",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/23/PtolemyWorldMap.jpg",
    aspectRatio: 1.4612,
    pinColor: '#FFF96A' // Bright yellow
  },
  {
    id: 'tabula-rogeriana',
    name: "Tabula Rogeriana",
    year: "1154",
    description: "Drawn by the Arab scholar Al-Idrisi for King Roger II of Sicily. It represented the most advanced geographical synthesis of the medieval world, oriented with South at the top.",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d3/TabulaRogeriana.jpg",
    aspectRatio: 2.2069,
    pinColor: '#90C2FF' // Light blue
  }
];

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
  const layers = [
    'historical-map-layer',
    'historical-map-layer-0',
    'historical-map-layer-1',
    'historical-map-layer-2',
    'historical-map-layer-3'
  ];
  const sources = [
    'historical-map-src',
    'historical-map-src-0',
    'historical-map-src-1',
    'historical-map-src-2',
    'historical-map-src-3'
  ];

  layers.forEach(l => {
    if (map.getLayer(l)) map.removeLayer(l);
  });
  sources.forEach(s => {
    if (map.getSource(s)) map.removeSource(s);
  });
};

// Helper to add/update the raster historical map sources and layers
const updateMapOverlay = (map: mapboxgl.Map, hMap: HistoricalMap, customUrl?: string) => {
  cleanUpMapOverlay(map);

  const coords = calculateBounds(hMap.aspectRatio);
  const minLng = coords[0][0];
  const maxLng = coords[1][0];
  const maxLat = coords[0][1];
  const minLat = coords[2][1];

  if (hMap.id === 'peutinger' && !customUrl) {
    // Sliced high-resolution multi-source rendering for the Peutinger Table
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
    // Standard single-source map overlay rendering
    const url = customUrl || `/api/proxy-resource?url=${encodeURIComponent(hMap.url)}`;
    map.addSource('historical-map-src', {
      type: 'image',
      url: url,
      coordinates: coords
    });

    map.addLayer({
      id: 'historical-map-layer',
      type: 'raster',
      source: 'historical-map-src',
      paint: {
        'raster-fade-duration': 150,
        'raster-opacity': 1,
        'raster-opacity-transition': { duration: 300 }
      }
    });
  }
};

export default function CartographyPage({ theme, isMapDarkMode }: CartographyPageProps) {
  const [selectedMap, setSelectedMap] = useState<HistoricalMap>(HISTORICAL_MAPS[0]);
  const [loadedThumbnails, setLoadedThumbnails] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<SavedPoint[]>([]);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  
  // Note Submission state
  const [submissionCoords, setSubmissionCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Progressive loader state
  const [loadProgress, setLoadProgress] = useState<number | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
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
      setMapImageUrl('');
      return;
    }

    let active = true;
    const controller = new AbortController();
    setLoadProgress(0);

    const fetchImageProgress = async () => {
      try {
        // Route through proxy-resource endpoint to bypass CORS and user hotlink protections
        const proxiedUrl = `/api/proxy-resource?url=${encodeURIComponent(selectedMap.url)}`;
        const response = await fetch(proxiedUrl, { signal: controller.signal });
        if (!response.ok) throw new Error("Image fetch response failed");

        const reader = response.body?.getReader();
        const contentLength = +(response.headers.get('Content-Length') || 0);

        if (!reader) {
          if (active) {
            setMapImageUrl(proxiedUrl);
            setLoadProgress(null);
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

        // Create Blob and local Object URL
        const blob = new Blob(chunks);
        const localUrl = URL.createObjectURL(blob);

        // Revoke the previous Object URL to avoid leaks
        if (prevBlobUrlRef.current && prevBlobUrlRef.current.startsWith('blob:')) {
          URL.revokeObjectURL(prevBlobUrlRef.current);
        }
        prevBlobUrlRef.current = localUrl;

        setMapImageUrl(localUrl);
        setLoadProgress(null);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        console.warn("Failed to load map with progress, falling back to proxy URL:", err);
        if (active) {
          const proxiedUrl = `/api/proxy-resource?url=${encodeURIComponent(selectedMap.url)}`;
          setMapImageUrl(proxiedUrl);
          setLoadProgress(null);
        }
      }
    };

    fetchImageProgress();

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedMap.url]);

  // 3. Initialize Mapbox Map ONCE on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const customBlankStyle: mapboxgl.Style = {
      version: 8,
      sources: {},
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': isMapDarkMode ? '#0d0d0d' : '#f4f4f4'
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
      touchZoomRotate: true,
      renderWorldCopies: false, // Prevents repeating maps horizontally when zoomed out
      scrollZoom: { around: 'center' } // Always zoom around the center point
    });

    mapRef.current = map;
    map.dragPan.enable({ inertia: false } as any); // Disable dragging momentum natively



    map.on('load', () => {
      updateMapOverlay(map, selectedMap, mapImageUrl);
      setIsMapReady(true);
    });

    // Add pointer down / click interactions for note drop
    map.on('click', (e) => {
      if (isAddModeRef.current) {
        setSubmissionCoords({ lng: e.lngLat.lng, lat: e.lngLat.lat });
        setIsAddMode(false);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // Run once on mount

  // 4. Update the raster image URL & coordinates when selection or fetched image url updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    updateMapOverlay(map, selectedMap, mapImageUrl);
  }, [selectedMap.id, mapImageUrl, isMapReady]);

  // 5. Position camera and trigger entry zoom-in animation when the new map image finishes loading
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !mapImageUrl) return;

    const coords = calculateBounds(selectedMap.aspectRatio);
    const minLng = coords[0][0];
    const maxLng = coords[1][0];
    const maxLat = coords[0][1];
    const minLat = coords[2][1];

    const container = map.getContainer();
    const wView = container.clientWidth;
    const hView = container.clientHeight;
    
    const sidebarWidth = isSidebarCollapsed ? 40 : 340;
    const visibleWidth = Math.max(100, wView - sidebarWidth - 80);
    const visibleHeight = Math.max(100, hView - 80);
    const visibleAspectRatio = visibleWidth / visibleHeight;

    // Reset constraints so fitBounds works cleanly
    map.setMaxBounds(null);
    map.setMinZoom(0.1);

    // Calculate containment and cover zoom levels mathematically
    const mercatorY = (maxLng * Math.PI / 180) / selectedMap.aspectRatio;
    const zoomWidth = Math.log2((visibleWidth * 90) / (128 * maxLng));
    const zoomHeight = Math.log2((visibleHeight * Math.PI) / (256 * mercatorY));
    const containZoom = Math.min(zoomWidth, zoomHeight);

    // Define dynamicMinZoom as containZoom - 0.8 (allows clear padding when zoomed out)
    const dynamicMinZoom = Math.max(0.1, containZoom - 0.8);
    minZoomLimitRef.current = dynamicMinZoom;
    map.setMinZoom(dynamicMinZoom);

    const targetZoom = selectedMap.aspectRatio < visibleAspectRatio ? zoomWidth : zoomHeight;
    setCoverZoom(targetZoom);
    const snapCenter: [number, number] = [0, 0];
    targetCenterRef.current = snapCenter;

    // Snap instantly to the new map's center, scaled down to 50% size (1.0 zoom level down)
    map.setZoom(Math.max(0.1, targetZoom - 1.0));
    map.setCenter(snapCenter);

    // Ease in zoom-scale animation up to targetZoom (100% cover size) in the next frame
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
        zoom: targetZoom,
        padding: { left: sidebarWidth },
        duration: 1200,
        essential: true
      });
    });
  }, [mapImageUrl, isMapReady]);

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

      const currentZoom = map.getZoom();
      setMapZoom(currentZoom);

      map.dragPan.enable({ inertia: false } as any);
      map.scrollZoom.enable();
      
      // Calculate degrees per pixel for the current zoom
      const degreesPerPixelLng = 360 / (256 * Math.pow(2, currentZoom));
      const viewportLngSpan = W * degreesPerPixelLng;

      const pixelsPerRadian = (256 * Math.pow(2, currentZoom)) / (2 * Math.PI);
      const viewportYSpan = H / pixelsPerRadian;

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
        mapWidthPixels < W || 
        mapHeightPixels < H || 
        viewportLngSpan >= 360 || 
        viewportYSpan >= 2 * Math.PI
      ) {
        map.setMaxBounds(null);
        return;
      }

      // Calculate horizontal and vertical padding:
      // Since map is guaranteed to be larger than the viewport in both dimensions here,
      // allow dragging until 100px remains on screen (requires W/2 - 100 pad, and H/2 - 100 pad)
      const padLngPixels = Math.max(0, W / 2 - 100);
      const padLng = padLngPixels * degreesPerPixelLng;

      const targetMinLng = minLng - padLng;
      const targetMaxLng = maxLng + padLng;

      const padLatPixels = Math.max(0, H / 2 - 100);
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
  }, [selectedMap.id, isMapReady]);



  // 8. Prevent page scroll chaining by blocking wheel event propagation on root container unless over the sidebar
  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If scroll target is within the sidebar, allow normal scrolling
      if (sidebarRef.current?.contains(e.target as Node)) {
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

  // Re-center map and animate camera padding when sidebar collapse state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    const sidebarWidth = isSidebarCollapsed ? 40 : 340;

    map.easeTo({
      padding: { top: 40, bottom: 40, left: sidebarWidth + 40, right: 40 },
      duration: 500, // Matches sidebar CSS transition duration
      essential: true
    });
  }, [isSidebarCollapsed, isMapReady]);

  // 5. Update raster layer visibility / opacity during loading
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;
    try {
      if (loadProgress !== null) {
        map.setPaintProperty('historical-map-layer', 'raster-opacity', 0);
      } else {
        map.setPaintProperty('historical-map-layer', 'raster-opacity', 1);
      }
    } catch (e) {
      console.warn("Failed to set raster opacity:", e);
    }
  }, [loadProgress, isMapReady]);

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
        offset: [0, -17]
      });
    }

    // Filter notes on client side as a safeguard to only show notes for the selected map
    const mapNotes = notes.filter(point => point.mapId === selectedMap.id);

    // Get dynamic diameter based on map zoom to scale pins exactly like the main map
    const getTargetDiameter = (currentZoom: number) => {
      // Circle radius on main map is 3.5px at zoom 3 and 8px at zoom 12.
      // Diameter is 2 * radius = 7px at zoom 3 and 16px at zoom 12.
      return Math.max(7, Math.min(16, 7 + (currentZoom - 3)));
    };

    const initialDiameter = getTargetDiameter(map.getZoom());

    mapNotes.forEach((point) => {
      // Create custom vintage styled HTML marker container
      const el = document.createElement('div');
      el.style.width = '16px'; // Allow bounds for largest scaled sizes (max size is 16px)
      el.style.height = '16px';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Get the contrasting color for the selected map
      const currentPinColor = selectedMap.pinColor || '#FF5E97';

      // Inner dot styled exactly like unclustered circular pins on the main map
      const elInner = document.createElement('div');
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
          tooltipContainer.style.padding = '0 12px';
          tooltipContainer.style.height = '22px';
          tooltipContainer.style.display = 'flex';
          tooltipContainer.style.alignItems = 'center';
          tooltipContainer.style.borderRadius = '50px';
          tooltipContainer.style.fontSize = '10px';
          tooltipContainer.style.fontWeight = '500';
          tooltipContainer.style.fontFamily = '"Space Mono", monospace';
          tooltipContainer.style.whiteSpace = 'nowrap';
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
      borderTop: `1px solid ${theme.border}`
    }}>
      {/* 20PX FAR LEFT PROTECTIVE SIDE STRIP */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '20px',
        background: theme.bg,
        borderRight: `1px solid ${theme.border}`,
        zIndex: 10,
        pointerEvents: 'auto'
      }} />

      {/* SIDEBAR PANEL */}
      <motion.div 
        ref={sidebarRef}
        initial={false}
        animate={{ 
          left: isSidebarCollapsed ? -280 : 20,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '300px',
          borderRight: `1px solid ${theme.border}`,
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 5,
          pointerEvents: 'auto',
          flexShrink: 0
        }}
      >
        {/* ABSOLUTE POSITIONED FIXED BUTTON TAB FOR SIDEBAR COLLAPSE */}
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

        {/* TITLE HEADER */}
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
              <clipPath id="clip0_carto_header">
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

        {/* MAP GALLERY SELECTOR LIST */}
        <div 
          className="custom-sidebar-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'transparent'
          }}
        >
          <span style={{ fontSize: '9px', color: theme.textDim, letterSpacing: '1.5px', fontWeight: 'bold' }}>SELECT MAP TO EXPLORE</span>
          {HISTORICAL_MAPS.map((hMap) => {
            const isSelected = hMap.id === selectedMap.id;
            return (
              <motion.div
                key={hMap.id}
                onClick={() => setSelectedMap(hMap)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedMap(hMap);
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
                      borderTopColor: isMapDarkMode ? '#ffffff' : '#000000'
                    }} />
                  )}
                  <img 
                    src={`/api/proxy-resource?url=${encodeURIComponent(hMap.url)}`}
                    alt={hMap.name}
                    onLoad={() => setLoadedThumbnails(prev => ({ ...prev, [hMap.id]: true }))}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: loadedThumbnails[hMap.id] ? (isSelected ? 0.95 : 0.75) : 0,
                      transition: 'opacity 0.2s ease'
                    }}
                  />
                </div>                 {/* TEXT CONTENT */}
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* FULLSCREEN MAP CANVAS AREA */}
      <div style={{
        flex: 1,
        height: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* MAP DIV */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* MAP VIEW TITLE OVERLAY - TOP RIGHT (NO ICON) */}
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          zIndex: 10,
          background: '#000000',
          color: '#ffffff',
          borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '0 16px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: '"Space Mono", monospace', letterSpacing: '1px' }}>
            {selectedMap.name} ({selectedMap.year})
          </span>
        </div>

        {/* CUSTOM PILL ZOOM CONTROLLER */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          background: '#000000',
          borderRadius: '15px',
          height: '30px',
          padding: '0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.1)',
          pointerEvents: 'auto'
        }}>
          {/* Zoom Out Button */}
          <motion.button
            onClick={() => {
              const activeMap = mapRef.current;
              if (activeMap) {
                activeMap.easeTo({ zoom: Math.max(minZoomLimitRef.current, activeMap.getZoom() - 0.5), duration: 200 });
              }
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #000000',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '-1px'
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: 1 }}>—</span>
          </motion.button>

          {/* Zoom Percentage Label */}
          <span style={{
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: '"Space Mono", monospace',
            minWidth: '50px',
            textAlign: 'center',
            userSelect: 'none'
          }}>
            {Math.round(Math.pow(2, mapZoom - coverZoom) * 100)}%
          </span>

          {/* Zoom In Button */}
          <motion.button
            onClick={() => {
              const activeMap = mapRef.current;
              if (activeMap) {
                activeMap.easeTo({ zoom: Math.min(9, activeMap.getZoom() + 0.5), duration: 200 });
              }
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #000000',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              marginRight: '-1px'
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 'normal', lineHeight: 1 }}>+</span>
          </motion.button>
        </div>

        {/* CONTROLS OVERLAY - BOTTOM LEFT */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: isSidebarCollapsed ? '40px' : '340px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
          pointerEvents: 'none',
          transition: 'left 0.5s ease'
        }}>
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
          {loadProgress !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: isSidebarCollapsed ? '20px' : '320px',
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
                borderTopColor: theme.text, 
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
                  background: theme.text,
                  transition: 'width 0.1s linear'
                }} />
              </div>
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
                bottom: '24px',
                left: isSidebarCollapsed ? 'calc(50% + 10px)' : 'calc(50% + 160px)',
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
                transition: 'left 0.5s ease'
              }}
            >
              <Navigation size={12} style={{ transform: 'rotate(45deg)' }} />
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
      </div>
    </div>
  );
}
