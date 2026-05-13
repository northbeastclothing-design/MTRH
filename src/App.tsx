import React, { useState, useMemo, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// @ts-ignore
import rawPointsAndLinesData from './rabbitHoleData.json'; 
// @ts-ignore
import realUfoData from './ufoData.json'; 

mapboxgl.accessToken = 'pk.eyJ1Ijoibm9ydGhiZWFzdCIsImEiOiJjbXAyNnBhMGowMTFoMnFwenRnNWZvOWc5In0.PpOOemte4Ub9PVLfGsUS1g'; 

const isValidLngLat = (lng: any, lat: any) => {
  return (
    typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180 &&
    typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90
  );
};

const cleanAndProxyImageUrl = (url: any) => {
  if (!url || typeof url !== 'string') return url;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl.includes('mymaps.usercontent.google.com') || trimmedUrl.includes('googleusercontent.com')) {
    const cleanUrl = trimmedUrl.replace(/^https?:\/\//i, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
  }
  
  return trimmedUrl;
};

const processIncomingRecord = (item: any, index: number) => {
  const safeId = item.id || `rec-id-${index}-${Date.now()}`;
  
  let safeDate: number | null = null;
  if (item.date !== undefined && item.date !== null && item.date !== '') {
    const parsedYear = parseInt(item.date, 10);
    if (!isNaN(parsedYear)) safeDate = parsedYear;
  }

  let safeCoords: any = null;
  if (Array.isArray(item.coordinates)) {
    if (item.type === 'LineString') {
      safeCoords = item.coordinates.map((c: any) => {
        if (Array.isArray(c)) return [parseFloat(c[0]), parseFloat(c[1])];
        return [parseFloat(c.lng || c.lon), parseFloat(c.lat)];
      }).filter((c: any) => isValidLngLat(c[0], c[1]));
    } else if (item.coordinates.length === 2) {
      const lng = parseFloat(item.coordinates[0]);
      const lat = parseFloat(item.coordinates[1]);
      if (isValidLngLat(lng, lat)) safeCoords = [lng, lat];
    }
  } else if (item.coordinates && typeof item.coordinates === 'object') {
    const lng = parseFloat(item.coordinates.lng || item.coordinates.lon);
    const lat = parseFloat(item.coordinates.lat);
    if (isValidLngLat(lng, lat)) safeCoords = [lng, lat];
  }

  if (!safeCoords || (item.type === 'LineString' && safeCoords.length === 0)) return null; 

  const safeName = item.name ? String(item.name).trim() : "Unidentified Coordinate";
  const rawCategory = item.category ? String(item.category).trim() : "Uncategorized Anomalies";
  const safeDescription = item.description || item.comments || "";
  const safeSource = item.source ? String(item.source).trim() : null;
  
  const rawImages = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
  const safeImages = rawImages.map((imgUrl: string) => cleanAndProxyImageUrl(imgUrl)).filter(Boolean);

  const displayDescription = safeDescription.trim() || "No further diagnostic descriptive intelligence available in active log sheets.";
  const tagsSet = new Set([rawCategory]);

  return {
    ...item,
    id: safeId,
    name: safeName,
    categories: Array.from(tagsSet),
    description: displayDescription,
    date: safeDate,
    coordinates: safeCoords,
    source: safeSource,
    images: safeImages,
    type: item.type === 'LineString' ? 'LineString' : 'Point'
  };
};

const PREFERRED_PALETTE: Record<string, string> = {
  "underworld": "#b6a6ff", "entrances": "#b6a6ff",
  "giant": "#db4436", "nephilim": "#db4436",
  "bigfoot": "#f4b400", "sasquatch": "#f4b400",
  "cryptid": "#a7f3d0",
  "ufo": "#baeccf", "uap": "#baeccf"
};

function App() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const lineLayersRef = useRef<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pointsAndLinesData, setPointsAndLinesData] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);

  const uniqueCategories = useMemo(() => {
    const allTags = pointsAndLinesData.flatMap(item => item.categories);
    return Array.from(new Set(allTags)).sort(); 
  }, [pointsAndLinesData]);

  const layerColors = useMemo(() => {
    const assigned: Record<string, string> = {};
    uniqueCategories.forEach(category => {
      const lowerCat = category.toLowerCase();
      const matchedKeyword = Object.keys(PREFERRED_PALETTE).find(keyword => lowerCat.includes(keyword));
      assigned[category] = matchedKeyword ? PREFERRED_PALETTE[matchedKeyword] : "#b6a6ff";
    });
    return assigned;
  }, [uniqueCategories]);

  const timeBounds = useMemo(() => {
    const allYears = pointsAndLinesData.map(item => item.date).filter(y => y !== null);
    return { min: allYears.length > 0 ? Math.min(...allYears) : 1970, max: 2026 };
  }, [pointsAndLinesData]);

  const [yearRange, setYearRange] = useState({ start: 1970, end: 2026 });
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({});

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isLightboxImageLoading, setIsLightboxImageLoading] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
    if (selectedFeature && selectedFeature.images && selectedFeature.images.length > 0) {
      setIsImageLoading(true);
    }
  }, [selectedFeature]);

  useEffect(() => {
    if (selectedFeature && selectedFeature.images && selectedFeature.images.length > 0) {
      setIsImageLoading(true);
      if (isLightboxOpen) {
        setIsLightboxImageLoading(true);
      }
    }
  }, [activeImageIndex, isLightboxOpen, selectedFeature]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedFeature || !selectedFeature.images || selectedFeature.images.length === 0) return;
      
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowRight') {
          setActiveImageIndex(prev => (prev + 1) % selectedFeature.images.length);
        }
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex(prev => (prev - 1 + selectedFeature.images.length) % selectedFeature.images.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedFeature]);

  useEffect(() => {
    const compileVerifiedIntel = () => {
      try {
        setIsLiveLoading(true);
        const safeLocalData = Array.isArray(rawPointsAndLinesData) ? rawPointsAndLinesData : [];
        const safeUfoData = Array.isArray(realUfoData) ? realUfoData : [];
        const combinedRawData = [...safeLocalData, ...safeUfoData];
        
        const processingBuffer = combinedRawData
          .map((item, idx) => processIncomingRecord(item, idx))
          .filter(Boolean);

        setPointsAndLinesData(processingBuffer);

        const allYears = processingBuffer.map(item => item.date).filter(y => y !== null);
        if (allYears.length > 0) {
          setYearRange({ start: Math.min(...allYears), end: 2026 });
        }
      } catch (err) {
        console.error("Critical failure during map compilation pipeline: ", err);
      } finally {
        setTimeout(() => {
          setIsLiveLoading(false);
        }, 600);
      }
    };
    compileVerifiedIntel();
  }, []);

  useEffect(() => {
    setActiveLayers(prev => {
      const updated = { ...prev };
      uniqueCategories.forEach(cat => { if (updated[cat] === undefined) updated[cat] = true; });
      return updated;
    });
  }, [uniqueCategories]);

  const visibleData = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    return pointsAndLinesData.filter(item => {
      const hasActiveLayerMatch = item.categories.some((cat: string) => activeLayers[cat] !== false);
      const matchesTimeline = item.date ? (item.date >= yearRange.start && item.date <= yearRange.end) : true;
      const matchesSearch = cleanQuery === '' || 
        item.name.toLowerCase().includes(cleanQuery) ||
        item.categories.some((cat: string) => cat.toLowerCase().includes(cleanQuery)) ||
        item.description.toLowerCase().includes(cleanQuery);

      return hasActiveLayerMatch && matchesTimeline && matchesSearch;
    });
  }, [pointsAndLinesData, yearRange, activeLayers, searchQuery]);

  const groupedLocations = useMemo(() => {
    const groups: Record<string, any[]> = {};
    uniqueCategories.forEach(cat => { groups[cat] = []; });
    visibleData.forEach(item => { item.categories.forEach((cat: string) => { if (groups[cat]) groups[cat].push(item); }); });
    return groups;
  }, [visibleData, uniqueCategories]);

  useEffect(() => {
    if (!mapboxgl.supported() || !mapContainer.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11', 
      center: [-98.5795, 39.8283], 
      zoom: 4.0,
      trackResize: true
    });
    mapRef.current = map;
    map.on('load', () => setIsStyleLoaded(true));

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [isLeftCollapsed, isRightCollapsed, isTimelineCollapsed, selectedFeature]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleLoaded) return;

    const currentPoints = visibleData.filter(p => p.type === 'Point');
    const currentLines = visibleData.filter(l => l.type === 'LineString');

    const pointsGeoJSON: any = {
      type: 'FeatureCollection',
      features: currentPoints.map(pt => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: pt.coordinates },
        properties: { id: pt.id, category: pt.categories[0] }
      }))
    };

    const source = map.getSource('master-anomalies-src') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(pointsGeoJSON);
    } else {
      map.addSource('master-anomalies-src', { type: 'geojson', data: pointsGeoJSON });

      map.addLayer({
        id: 'master-unclustered-pins',
        type: 'circle',
        source: 'master-anomalies-src',
        paint: {
          'circle-color': [
            'match', ['get', 'category'],
            'Entrances to the Underworld', '#b6a6ff',
            'UFO Sightings', '#baeccf',
            'Cryptid Sightings', '#a7f3d0',
            'Bigfoot Sightings', '#f4b400',
            '#b6a6ff'
          ],
          'circle-radius': 5,
          'circle-opacity': 0.9,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#000000'
        }
      });

      map.on('click', 'master-unclustered-pins', (e) => {
        if (!e.features || !e.features.length) return;
        const clickedId = e.features[0].properties?.id;
        const matchedRecord = pointsAndLinesData.find(item => item.id === clickedId);
        if (matchedRecord) {
          setSelectedFeature(matchedRecord);
          setIsRightCollapsed(false);
        }
      });

      map.on('mouseenter', 'master-unclustered-pins', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'master-unclustered-pins', () => { map.getCanvas().style.cursor = ''; });
    }

    lineLayersRef.current.forEach(layerId => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(layerId)) map.removeSource(layerId);
    });
    lineLayersRef.current = [];

    currentLines.forEach((line, index) => {
      if (!line.coordinates || !Array.isArray(line.coordinates) || line.coordinates.length === 0) return;
      const verifiedCoords = line.coordinates.filter((coord: any) => Array.isArray(coord) && coord.length === 2 && isValidLngLat(coord[0], coord[1]));
      if (verifiedCoords.length < 2) return; 

      const sourceLayerId = `line-layer-${line.id}-${index}`;
      const lineColor = layerColors[line.categories[0]] || '#b6a6ff';

      try {
        map.addSource(sourceLayerId, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: verifiedCoords }, properties: {} }
        });
        map.addLayer({
          id: sourceLayerId, type: 'line', source: sourceLayerId,
          paint: { 'line-color': lineColor, 'line-width': 2, 'line-opacity': 0.8 }
        });
        lineLayersRef.current.push(sourceLayerId);
      } catch (err) { console.error(err); }
    });

  }, [visibleData, isStyleLoaded, layerColors, pointsAndLinesData]);

  const handleLocationItemClick = (feature: any) => {
    if (!feature || !feature.coordinates || !mapRef.current) return;
    setSelectedFeature(feature);
    setIsRightCollapsed(false);
    const flyTarget = feature.type === 'LineString' ? feature.coordinates[0] : feature.coordinates;
    mapRef.current.easeTo({ center: flyTarget, zoom: 6, duration: 1000 });
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedFeature.images) return;
    setActiveImageIndex(prev => (prev + 1) % selectedFeature.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedFeature.images) return;
    setActiveImageIndex(prev => (prev - 1 + selectedFeature.images.length) % selectedFeature.images.length);
  };

  const handleOpenLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLightboxImageLoading(true);
    setIsLightboxOpen(true);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#ffffff', color: '#000000', fontFamily: '"Space Mono", monospace', overflowY: 'auto', overflowX: 'hidden', textAlign: 'left' }}>
      
      {/* GLOBAL FULL-SCREEN LOADER OVERLAY */}
      {isLiveLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          zIndex: 99999,
          fontFamily: '"Space Mono", monospace'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #333', borderTopColor: '#b6a6ff', animation: 'spinMapAsset 0.8s linear infinite' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>INITIALIZING DATA CORES</span>
            <span style={{ fontSize: '10px', color: '#a3a3a3', letterSpacing: '0.5px' }}>Compiling archive mappings and coordinates...</span>
          </div>
        </div>
      )}

      {/* MAPVIEW APP SCREEN CONTAINER */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', borderBottom: '1px solid #000000', overflow: 'hidden' }}>
        
        {/* BRAND HEADER COMPONENT */}
        <header style={{ height: '72px', background: '#000000', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #000000', flexShrink: 0, textAlign: 'left', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #fff' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px', display: 'block', lineHeight: '1', fontFamily: '"Space Mono", monospace' }}>MTRH</span>
              <span style={{ color: '#a3a3a3', fontSize: '9px', letterSpacing: '0.5px', fontFamily: '"Space Mono", monospace' }}>mapping the rabbit hole</span>
            </div>
          </div>
        </header>

        {/* CORE WORKSPACE FRAMING GRID — NOW FULL BLEED OVERLAY ENVIRONMENT */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#ffffff' }}>
          
          {/* CENTER COMPONENT: FULL SCREEN MAP BASE LAYER */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
          </div>

          {/* LEFT COMPONENT: FILTERS MANAGEMENT PANEL */}
          <div 
            className="custom-sidebar-scrollbar"
            style={{ 
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: isLeftCollapsed ? '-340px' : '0px',
              width: '340px', 
              background: '#ffffff', 
              borderRight: '1px solid #000000',
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'left 0.25s ease', 
              overflow: 'visible', 
              zIndex: 10, 
              fontFamily: '"Space Mono", monospace'
            }}
          >
            {/* ABSOLUTE POSITIONED FIXED BLACK TAB FOR LEFT SIDEBAR */}
            <button 
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              title={isLeftCollapsed ? "Maximize Filters" : "Minimize Filters"}
              style={{
                position: 'absolute',
                top: 0,
                right: '-40px',
                width: '40px',
                height: '52px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                zIndex: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              {isLeftCollapsed ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              )}
            </button>

            <div style={{ padding: '16px', borderBottom: '1px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', flexShrink: 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', textAlign: 'center', fontFamily: '"Space Mono", monospace' }}>
                <span>⚙ FILTERS</span>
              </div>
            </div>

            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', overflowY: 'auto' }}>
              {uniqueCategories.map(layerName => {
                const isExpanded = !!expandedLayers[layerName];
                const locationsInLayer = groupedLocations[layerName] || [];
                const pillColor = layerColors[layerName] || '#e5e5e5';

                return (
                  <div key={layerName} style={{ display: 'flex', flexDirection: 'column', border: '1px solid #000000', borderRadius: '24px', overflow: 'hidden', background: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setExpandedLayers(p => ({ ...p, [layerName]: !isExpanded }))}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'left' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: pillColor, border: '1px solid #00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>👁</div>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: '"Space Mono", monospace' }}>{layerName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setActiveLayers(p => ({ ...p, [layerName]: !p[layerName] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: '"Space Mono", monospace' }}>
                          {activeLayers[layerName] !== false ? '👁' : '❌'}
                        </button>
                        <span style={{ fontSize: '10px', fontFamily: '"Space Mono", monospace' }}>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: '1px solid #000000', background: '#fcfcfc', padding: '6px 0', textAlign: 'left' }}>
                        {locationsInLayer.map(loc => (
                          <div key={loc.id} onClick={() => handleLocationItemClick(loc)} style={{ padding: '8px 20px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px dashed #e5e5e5', background: selectedFeature?.id === loc.id ? 'rgba(182, 166, 255, 0.2)' : 'transparent', textAlign: 'left', fontFamily: '"Space Mono", monospace' }} className="nested-item">
                            <span>📍</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COMPONENT: DOSSIER SIDEBAR WINDOW PANEL */}
          {selectedFeature && (
            <div style={{ 
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: isRightCollapsed ? '-420px' : '0px',
              width: '420px',
              background: '#ffffff', 
              borderLeft: '1px solid #000000',
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'right 0.25s ease', 
              overflow: 'visible', 
              zIndex: 10, 
              fontFamily: '"Space Mono", monospace'
            }}>
              
              {/* ABSOLUTE POSITIONED FIXED BLACK TAB FOR RIGHT SIDEBAR */}
              <button 
                onClick={() => setIsRightCollapsed(!isRightCollapsed)}
                title={isRightCollapsed ? "Maximize Dossier" : "Minimize Dossier"}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-40px',
                  width: '40px',
                  height: '52px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {isRightCollapsed ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                )}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'left' }}>
                
                <div style={{ height: '52px', padding: '0 16px', borderBottom: '1px solid #000000', display: 'flex', alignItems: 'center', background: '#ffffff', flexShrink: 0 }}>
                  <span style={{ fontWeight: '700', fontSize: '12px', letterSpacing: '1px', fontFamily: '"Space Mono", monospace', textTransform: 'uppercase' }}>
                    📖 {selectedFeature.categories?.[0] || 'DOSSIER ARCHIVE'}
                  </span>
                </div>

                <div className="custom-sidebar-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', textAlign: 'left' }}>
                  
                  {selectedFeature.images && selectedFeature.images.length > 0 && (
                    <div style={{ width: '100%', position: 'relative', borderBottom: '1px solid #000000' }}>
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '260px', 
                          backgroundColor: '#000000', 
                          overflow: 'hidden', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          position: 'relative' 
                        }}
                      >
                        {isImageLoading && (
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                            <div className="loading-spinner" />
                          </div>
                        )}

                        <img 
                          src={selectedFeature.images[activeImageIndex]} 
                          alt={`${selectedFeature.name} asset viewport`} 
                          onLoad={() => setIsImageLoading(false)}
                          onError={() => setIsImageLoading(false)}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            opacity: isImageLoading ? 0 : 1, 
                            transition: 'opacity 0.2s ease' 
                          }}
                        />
                        
                        <div style={{ 
                          position: 'absolute', 
                          bottom: '12px', 
                          left: '12px', right: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          zIndex: 2,
                          pointerEvents: 'none'
                        }}>
                          <div style={{ display: 'flex', gap: '6px', flex: 1, justifyContent: 'flex-start', pointerEvents: 'auto' }}>
                            {selectedFeature.images.length > 1 && (
                              <>
                                <button 
                                  onClick={handlePrevImage} 
                                  style={{ 
                                    background: '#ffffff', 
                                    border: '1px solid #000000', 
                                    borderRadius: '50%', 
                                    width: '32px', 
                                    height: '32px', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    fontFamily: '"Space Mono", monospace'
                                  }}
                                >
                                  ◀
                                </button>
                                <button 
                                  onClick={handleNextImage} 
                                  style={{ 
                                    background: '#ffffff', 
                                    border: '1px solid #000000', 
                                    borderRadius: '50%', 
                                    width: '32px', 
                                    height: '32px', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    fontFamily: '"Space Mono", monospace'
                                  }}
                                >
                                  ▶
                                </button>
                              </>
                            )}
                          </div>

                          {selectedFeature.images.length > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', pointerEvents: 'auto' }}>
                              <div style={{ 
                                background: 'rgba(0, 0, 0, 0.65)', 
                                backdropFilter: 'blur(2px)',
                                color: '#ffffff', 
                                fontSize: '11px', 
                                fontFamily: '"Space Mono", monospace',
                                fontWeight: '700',
                                padding: '5px 16px', 
                                borderRadius: '20px', 
                                letterSpacing: '0.5px',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                              }}>
                                {activeImageIndex + 1}/{selectedFeature.images.length}
                              </div>
                            </div>
                          )}

                          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', pointerEvents: 'auto' }}>
                            <button 
                              onClick={handleOpenLightbox} 
                              title="Expand image to Fullscreen Lightbox"
                              style={{ 
                                background: '#ffffff', 
                                border: '1px solid #000000', 
                                borderRadius: '50%', 
                                width: '32px', 
                                height: '32px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                fontFamily: '"Space Mono", monospace'
                              }}
                            >
                              ⤢
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '24px', textAlign: 'left' }}>
                    
                    <h1 style={{ 
                      fontFamily: '"Space Mono", monospace',
                      fontWeight: '400', 
                      fontSize: '32px', 
                      lineHeight: '36px',
                      color: '#000000', 
                      margin: '0 0 16px 0', 
                      textAlign: 'left', 
                      letterSpacing: '-0.5px' 
                    }}>
                      {selectedFeature.name}
                    </h1>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', justifyContent: 'flex-start' }}>
                      {selectedFeature.categories?.map((tag: string) => (
                        <button 
                          key={tag} 
                          onClick={() => handleTagClick(tag)}
                          title={`Click to filter list by ${tag}`}
                          style={{ 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            padding: '6px 16px', 
                            borderRadius: '24px', 
                            background: layerColors[tag] || '#e5e5e5', 
                            border: '1px solid #000000',
                            color: '#000000',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: '"Space Mono", monospace',
                            transition: 'transform 0.1s ease, box-shadow 0.1s ease'
                          }}
                          className="interactive-tag-pill"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px', 
                      paddingTop: '16px', 
                      marginBottom: '20px', 
                      textAlign: 'left' 
                    }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontStyle: 'italic', fontSize: '10px', lineHeight: '22px' }}>
                        DATE: <span style={{ fontStyle: 'normal', fontWeight: '400' }}>{selectedFeature.date || 'UNSPECIFIED'}</span>
                      </div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontStyle: 'italic', fontSize: '10px', lineHeight: '22px' }}>
                        LOCATION: <span style={{ fontStyle: 'normal', fontWeight: '400' }}>{selectedFeature.coordinates ? `${selectedFeature.coordinates[1].toFixed(4)}, ${selectedFeature.coordinates[0].toFixed(4)}` : 'UNKNOWN'}</span>
                      </div>
                    </div>

                    <div style={{ paddingTop: '16px', textAlign: 'left' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontSize: '11px', lineHeight: '22px' }}>DESCRIPTION:</div>
                      <p style={{ 
                        fontFamily: '"Space Mono", monospace',
                        fontWeight: '400',
                        fontSize: '10px', 
                        lineHeight: '22px', 
                        color: '#000000',
                        marginTop: '4px', 
                        whiteSpace: 'pre-line', 
                        textAlign: 'left' 
                      }}>
                        {selectedFeature.description}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* HORIZONTAL COMPONENT: TIMELINE CONTROLS AS FLOATING ABSOLUTE OVERLAY */}
          <div style={{ 
            position: 'absolute',
            bottom: isTimelineCollapsed ? '-110px' : '0px',
            left: 0,
            right: 0,
            height: '110px', 
            background: '#ffffff', 
            borderTop: '1px solid #000000', 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '12px 40px', 
            boxSizing: 'border-box', 
            transition: 'bottom 0.25s ease',
            zIndex: 15, 
            fontFamily: '"Space Mono", monospace',
            overflow: 'visible'
          }}>
            
            {/* ABSOLUTE POSITIONED FIXED BLACK TAB FOR TIMELINE BAR */}
            <button 
              onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
              title={isTimelineCollapsed ? "Maximize Timeline" : "Minimize Timeline"}
              style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '52px',
                height: '40px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                zIndex: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                borderRadius: '4px 4px 0 0'
              }}
            >
              {isTimelineCollapsed ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center', fontFamily: '"Space Mono", monospace' }}>
              <span>📅 TIMELINE: {yearRange.start} – {yearRange.end}</span>
            </div>
            
            <div style={{ position: 'relative', width: '100%', height: '8px', background: '#e5e5e5', borderRadius: '4px', border: '1px solid #00' }}>
              <div style={{
                position: 'absolute',
                left: `${((yearRange.start - timeBounds.min) / (timeBounds.max - timeBounds.min)) * 100}%`,
                right: `${100 - ((yearRange.end - timeBounds.min) / (timeBounds.max - timeBounds.min)) * 100}%`,
                height: '100%', background: '#b6a6ff'
              }} />
              <input
                type="range" min={timeBounds.min} max={timeBounds.max} value={yearRange.start} onChange={e => setYearRange(p => ({ ...p, start: Math.min(parseInt(e.target.value, 10), p.end) }))}
                style={{ position: 'absolute', width: '100%', height: '100%', background: 'none', appearance: 'none', WebkitAppearance: 'none', pointerEvents: 'none', margin: 0, top: 0, left: 0 }}
                className="figma-slider-thumb"
              />
              <input
                type="range" min={timeBounds.min} max={timeBounds.max} value={yearRange.end} onChange={e => setYearRange(p => ({ ...p, end: Math.max(parseInt(e.target.value, 10), p.start) }))}
                style={{ position: 'absolute', width: '100%', height: '100%', background: 'none', appearance: 'none', WebkitAppearance: 'none', pointerEvents: 'none', margin: 0, top: 0, left: 0 }}
                className="figma-slider-thumb"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '6px', color: '#666', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>
              <span>{timeBounds.min}</span>
              <span>{timeBounds.max}</span>
            </div>
          </div>

        </div>

      </div>

      {/* FULL SCREEN LIGHTBOX MODAL ARCHITECTURE */}
      {isLightboxOpen && selectedFeature && selectedFeature.images && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, cursor: 'zoom-out', fontFamily: '"Space Mono", monospace' }}
        >
          <button 
            onClick={() => setIsLightboxOpen(false)} 
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#ffffff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Space Mono", monospace', letterSpacing: '1px', zIndex: 10001 }}
          >
            ✕ CLOSE
          </button>

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
            {isLightboxImageLoading && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div className="loading-spinner" style={{ borderTopColor: '#ffffff' }} />
              </div>
            )}

            <img 
              src={selectedFeature.images[activeImageIndex]} 
              alt="High resolution dossier archive asset" 
              onLoad={() => setIsLightboxImageLoading(false)}
              onError={() => setIsLightboxImageLoading(false)}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain', 
                opacity: isLightboxImageLoading ? 0 : 1, 
                transition: 'opacity 0.15s ease',
                margin: 'auto'
              }}
            />

            {selectedFeature.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage} 
                  style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', background: '#ffffff', border: '1px solid #000000', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 10002, fontFamily: '"Space Mono", monospace' }}
                >
                  ◀
                </button>
                <button 
                  onClick={handleNextImage} 
                  style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', background: '#ffffff', border: '1px solid #000000', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 10002, fontFamily: '"Space Mono", monospace' }}
                >
                  ▶
                </button>
                
                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', color: '#ffffff', fontSize: '11px', fontFamily: '"Space Mono", monospace', whiteSpace: 'nowrap', backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 16px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                  FILE ASSET {activeImageIndex + 1} OF {selectedFeature.images.length} — {selectedFeature.name.toUpperCase()}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* FOOTER SECTION COMPONENT */}
      <footer style={{ background: '#000000', color: '#ffffff', padding: '40px 60px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', justifyContent: 'flex-start' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #fff' }} />
            <span style={{ fontWeight: 'bold', fontSize: '16px', fontFamily: '"Space Mono", monospace' }}>MTRH</span>
          </div>
          <p style={{ color: '#a3a3a3', fontSize: '11px', lineHeight: '1.5', margin: 0, textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>Copyright North Beast LLC 2026.<br />All rights reserved.</p>
        </div>
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#ffffff', letterSpacing: '1px', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>FRIENDS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#a3a3a3', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>
            <span>NORTH BEAST CO.</span>
            <span>BLURRY CREATURES</span>
            <span>THE CONFESSIONALS</span>
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#ffffff', letterSpacing: '1px', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>NAVIGATE</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#a3a3a3', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>
            <span>MAP</span>
            <span>TIMELINES</span>
            <span>TERMS</span>
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#ffffff', letterSpacing: '1px', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>CONTACT</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#a3a3a3', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>
            <span>Questions? Wanna help?</span>
            <span style={{ textDecoration: 'underline', display: 'block', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>downtherabbithole@gmail.com</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        * {
          font-family: 'Space Mono', monospace !important;
        }

        .custom-sidebar-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
          border-left: 1px solid rgba(0, 0, 0, 0.05);
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #000000;
          border-radius: 0px;
        }
        .custom-sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #000000 #ffffff;
        }

        .nested-item:hover { background-color: #f3f4f6 !important; }
        .figma-slider-thumb::-webkit-slider-thumb { -webkit-appearance: none !important; appearance: none !important; pointer-events: auto !important; width: 16px !important; height: 16px !important; border-radius: 50% !important; background: #ffffff !important; border: 2px solid #000000 !important; cursor: pointer !important; }
        
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

        @keyframes spinMapAsset {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
