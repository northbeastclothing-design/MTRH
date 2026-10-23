import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence, animate } from 'motion/react';
import { X, Upload, MapPin, Check, ChevronDown } from 'lucide-react';
import { compressImageToDataUrl } from '../utils/media';
import { isValidLngLat } from '../utils/records';
import mapboxgl from 'mapbox-gl';

// Public "Submit Intel" form. Moved verbatim out of App.tsx; form-field state that nothing
// else in App referenced now lives here, the rest (pin-on-map coordinates, open/closed,
// success/error banners) is still owned by App and passed in.
interface SubmissionFormProps {
  isSubmitOpen: boolean;
  setIsSubmitOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPinningOnMap: React.Dispatch<React.SetStateAction<boolean>>;
  subCategory: string;
  setSubCategory: React.Dispatch<React.SetStateAction<string>>;
  subLatitude: string;
  setSubLatitude: React.Dispatch<React.SetStateAction<string>>;
  subLongitude: string;
  setSubLongitude: React.Dispatch<React.SetStateAction<string>>;
  submissionSuccess: string | null;
  setSubmissionSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  submissionError: string | null;
  setSubmissionError: React.Dispatch<React.SetStateAction<string | null>>;
  isMapDarkMode: boolean;
  mapRef: React.MutableRefObject<any>;
  combinedCodexNodes: any[];
  combinedTimelineItems: any[];
  allIntelCategories: string[];
  isMobile: boolean;
  theme: any;
  db: any;
}

export default function SubmissionForm({
  isSubmitOpen,
  setIsSubmitOpen,
  setIsPinningOnMap,
  subCategory,
  setSubCategory,
  subLatitude,
  setSubLatitude,
  subLongitude,
  setSubLongitude,
  submissionSuccess,
  setSubmissionSuccess,
  submissionError,
  setSubmissionError,
  isMapDarkMode,
  mapRef,
  combinedCodexNodes,
  combinedTimelineItems,
  allIntelCategories,
  isMobile,
  theme,
  db,
}: SubmissionFormProps) {
  const [subName, setSubName] = useState('');
  const [subDescription, setSubDescription] = useState('');
  const [subDate, setSubDate] = useState('');
  const [subSource, setSubSource] = useState('');
  const [subMediaList, setSubMediaList] = useState<string[]>([]);
  const [subMediaInput, setSubMediaInput] = useState('');
  const [subMediaType, setSubMediaType] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subLocationSearch, setSubLocationSearch] = useState('');
  const [subGeocodeResults, setSubGeocodeResults] = useState<any[]>([]);
  const [isSubGeocoding, setIsSubGeocoding] = useState(false);
  const [subGeocodeMsg, setSubGeocodeMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [subDestinations, setSubDestinations] = useState<string[]>(['map']);
  const [subCodexParentId, setSubCodexParentId] = useState('');
  const [subTimelineLayer, setSubTimelineLayer] = useState('biblical-events');
  const [subTimelineType, setSubTimelineType] = useState<'event' | 'lifespan'>('event');
  const [subTimelineEnd, setSubTimelineEnd] = useState('');
  const [subTimelineFatherId, setSubTimelineFatherId] = useState('');
  const [subTimelineMotherId, setSubTimelineMotherId] = useState('');
  const [subTimelineSpouseId, setSubTimelineSpouseId] = useState('');
  const [subSubmitterName, setSubSubmitterName] = useState('');
  const [subSubmitterEmail, setSubSubmitterEmail] = useState('');
  const [subSubmitterLink, setSubSubmitterLink] = useState('');

  const handleSubSearchGeocode = async () => {
    const queryStr = subLocationSearch.trim();
    if (!queryStr) return;
    setIsSubGeocoding(true);
    setSubGeocodeMsg(null);
    setSubGeocodeResults([]);
    try {
      let proximityStr = '';
      if (mapRef.current) {
        try {
          const center = mapRef.current.getCenter();
          if (center && typeof center.lng === 'number' && typeof center.lat === 'number') {
            proximityStr = `&proximity=${center.lng},${center.lat}`;
          }
        } catch (mapErr) {
          console.warn("Could not get map center for proximity bias:", mapErr);
        }
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(queryStr)}.json?access_token=${mapboxgl.accessToken}&limit=5${proximityStr}`
      );
      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        setSubGeocodeResults(data.features);
        
        // Populate with the first match immediately as default
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        setSubLongitude(lng.toFixed(6));
        setSubLatitude(lat.toFixed(6));
        setSubGeocodeMsg({
          text: `RESOLVED: ${feature.place_name || feature.text} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          type: 'success'
        });
      } else {
        setSubGeocodeMsg({
          text: "STATION ERROR: LOCATION NOT FOUND.",
          type: 'error'
        });
      }
    } catch (err: any) {
      console.error(err);
      setSubGeocodeMsg({
        text: `STATION ERROR: ${err.message || err}`,
        type: 'error'
      });
    } finally {
      setIsSubGeocoding(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isSubmitOpen && (
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
              zIndex: 99999,
              fontFamily: '"Space Mono", monospace',
              padding: isMobile ? '8px' : '20px'
            }}
          >
            <motion.button 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ opacity: 0.7 }}
              onClick={() => setIsSubmitOpen(false)} 
              style={{ position: 'absolute', top: isMobile ? '12px' : '24px', right: isMobile ? '12px' : '24px', background: 'none', border: 'none', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Space Mono", monospace', letterSpacing: '1px', zIndex: 10001, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <img src="/icons/icon-x.svg" style={{ width: isMobile ? '18px' : '24px', height: isMobile ? '18px' : '24px', filter: 'invert(1)' }} alt="close" />
              {isMobile ? "" : "CLOSE"}
            </motion.button>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              style={{
                backgroundColor: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                color: isMapDarkMode ? '#ffffff' : '#000000',
                border: `1px solid ${theme.border}`,
                padding: isMobile ? '16px 12px' : '28px',
                width: '100%',
                maxWidth: '640px',
                maxHeight: isMobile ? '94vh' : '85vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isMapDarkMode ? '0 10px 40px rgba(255,255,255,0.05)' : '0 15px 40px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: `2px solid ${theme.border}`, paddingBottom: '12px', marginBottom: '16px', paddingRight: isMobile ? '32px' : '0' }}>
                <span style={{ fontWeight: 700, fontSize: isMobile ? '11px' : '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Input Intel //</span>
                <p style={{ margin: 0, fontSize: '10px', color: theme.textDim, lineHeight: '15px' }}>
                  Thank you for contributing to mapping the rabbit hole. Your intelligence submissions help build our collective community map.
                </p>
              </div>

              {submissionSuccess ? (
                <div style={{ padding: '24px', border: '1px solid #00ff00', background: 'rgba(0,255,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                  <Check size={36} color="#00ff00" />
                  <span style={{ fontSize: '11px', textAlign: 'center', lineHeight: '20px', color: '#00cc00', fontWeight: 'bold' }}>{submissionSuccess}</span>
                  <button 
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setIsSubmitOpen(false);
                    }}
                    style={{
                      background: theme.text,
                      color: theme.bg,
                      border: 'none',
                      padding: '8px 16px',
                      fontSize: '9px',
                      fontFamily: '"Space Mono", monospace',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    RETURN TO MAP
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!subName.trim() || !subCategory || !subDescription.trim()) {
                      setSubmissionError("All required attributes (Name, Category, Description) must be defined.");
                      return;
                    }

                    const hasCoords = subLatitude.trim() !== '' || subLongitude.trim() !== '';
                    let latNum = NaN;
                    let lngNum = NaN;
                    if (hasCoords) {
                      latNum = parseFloat(subLatitude);
                      lngNum = parseFloat(subLongitude);
                      if (isNaN(latNum) || isNaN(lngNum)) {
                        setSubmissionError("Coordinates must be valid numbers if provided.");
                        return;
                      }
                      if (!isValidLngLat(lngNum, latNum)) {
                        setSubmissionError("Coordinates must be within standard bounds (Latitude: -90 to 90, Longitude: -180 to 180).");
                        return;
                      }
                    }

                    if (subDestinations.length === 0) {
                      setSubmissionError("At least one destination registry must be selected.");
                      return;
                    }

                    setIsSubmitting(true);
                    setSubmissionError(null);
                    setSubmissionSuccess(null);

                    const submissionId = `user_${Date.now()}`;
                    const submissionData: any = {
                      name: subName.trim(),
                      category: subCategory,
                      description: subDescription.trim(),
                      images: subMediaList,
                      status: 'pending',
                      destinations: subDestinations,
                      codexParentId: subDestinations.includes('codex') ? subCodexParentId : '',
                      timelineLayer: subDestinations.includes('timeline') ? subTimelineLayer : '',
                      timelineType: subDestinations.includes('timeline') ? subTimelineType : 'event',
                      timelineEnd: (subDestinations.includes('timeline') && subTimelineType === 'lifespan') ? subTimelineEnd.trim() : '',
                      timelineFatherId: (subDestinations.includes('timeline') && subTimelineType === 'lifespan') ? subTimelineFatherId : '',
                      timelineMotherId: (subDestinations.includes('timeline') && subTimelineType === 'lifespan') ? subTimelineMotherId : '',
                      timelineSpouseId: (subDestinations.includes('timeline') && subTimelineType === 'lifespan') ? subTimelineSpouseId : '',
                      submitterName: subSubmitterName.trim(),
                      submitterEmail: subSubmitterEmail.trim(),
                      submitterLink: subSubmitterLink.trim(),
                      socialLink: subSubmitterLink.trim()
                    };

                    if (hasCoords) {
                      submissionData.coordinates = [lngNum, latNum];
                    }

                    if (subDate.trim()) {
                      submissionData.date = subDate.trim();
                    }
                    if (subSource.trim()) {
                      submissionData.source = subSource.trim();
                    }

                    try {
                      // First try our secure server-side Proxy API to bypass any client-side configuration/iframe constraints
                      const response = await fetch('/api/submissions/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: subName.trim(),
                          category: subCategory,
                          description: subDescription.trim(),
                          coordinates: hasCoords ? [lngNum, latNum] : null,
                          images: subMediaList,
                          date: subDate.trim() || undefined,
                          source: subSource.trim() || undefined,
                          destinations: subDestinations,
                          codexParentId: subDestinations.includes('codex') ? subCodexParentId : '',
                          timelineLayer: subDestinations.includes('timeline') ? subTimelineLayer : '',
                          timelineType: subDestinations.includes('timeline') ? subTimelineType : 'event',
                          timelineEnd: (subDestinations.includes('timeline') && subTimelineType === 'lifespan') ? subTimelineEnd.trim() : '',
                          timelineFatherId: (subDestinations.includes('timeline') && subTimelineType === 'lifespan') ? subTimelineFatherId : '',
                          timelineMotherId: (subDestinations.includes('timeline') && subTimelineType === 'lifespan') ? subTimelineMotherId : '',
                          timelineSpouseId: (subDestinations.includes('timeline') && subTimelineType === 'lifespan') ? subTimelineSpouseId : '',
                          submitterName: subSubmitterName.trim() || undefined,
                          submitterEmail: subSubmitterEmail.trim() || undefined,
                          submitterLink: subSubmitterLink.trim() || undefined,
                          socialLink: subSubmitterLink.trim() || undefined
                        })
                      });
                      
                      if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error || `Server status ${response.status}`);
                      }

                      setSubmissionSuccess("TERRESTRIAL INTEL TRANSMITTED SUCCESSFULLY. YOUR SUBMISSION HAS BEEN REGISTERED FOR MODERATION REVIEW.");
                      setSubName('');
                      setSubDescription('');
                      setSubDate('');
                      setSubLatitude('');
                      setSubLongitude('');
                      setSubSource('');
                      setSubMediaList([]);
                      setSubDestinations(['map']);
                      setSubCodexParentId('');
                      setSubTimelineLayer('biblical-events');
                      setSubTimelineType('event');
                      setSubTimelineEnd('');
                      setSubTimelineFatherId('');
                      setSubTimelineMotherId('');
                      setSubTimelineSpouseId('');
                      setSubSubmitterName('');
                      setSubSubmitterEmail('');
                      setSubSubmitterLink('');
                    } catch (err: any) {
                      console.warn("Server proxy submission failed, trying direct Firestore fallback:", err);
                      try {
                        await setDoc(doc(db, 'submissions', submissionId), {
                          ...submissionData,
                          createdAt: serverTimestamp()
                        });
                        setSubmissionSuccess("TERRESTRIAL INTEL TRANSMITTED SUCCESSFULLY (DIRECT ACCESS).");
                        setSubName('');
                        setSubDescription('');
                        setSubDate('');
                        setSubLatitude('');
                        setSubLongitude('');
                        setSubSource('');
                        setSubMediaList([]);
                        setSubDestinations(['map']);
                        setSubCodexParentId('');
                        setSubTimelineLayer('biblical-events');
                        setSubTimelineType('event');
                        setSubTimelineEnd('');
                        setSubTimelineFatherId('');
                        setSubTimelineMotherId('');
                        setSubTimelineSpouseId('');
                        setSubSubmitterName('');
                        setSubSubmitterEmail('');
                        setSubSubmitterLink('');
                      } catch (fallbackErr: any) {
                        console.error("Firestore submission fallback error:", fallbackErr);
                        setSubmissionError(`Transmission Failure: ${fallbackErr.message || fallbackErr}`);
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }} 
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div>
                    <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>NAME OF ANOMALY / SIGNATURE *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Mount Shasta Entrance Shaft" 
                      value={subName} 
                      onChange={(e) => setSubName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: `1px solid ${theme.border}`,
                        padding: '8px 12px',
                        fontSize: '11px',
                        color: theme.text,
                        fontFamily: '"Space Mono", monospace'
                      }}
                    />
                  </div>

                  {/* DESTINATION REGISTRIES */}
                  <div style={{ paddingTop: '8px' }}>
                    <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>DESTINATION REGISTRIES * (SELECT AT LEAST ONE)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '10.5px', 
                        cursor: 'pointer', 
                        color: theme.text,
                        backgroundColor: subDestinations.includes('map') 
                          ? (isMapDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)') 
                          : (isMapDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
                        border: `1px solid ${subDestinations.includes('map') ? theme.border : theme.borderLight}`,
                        padding: '5px 12px',
                        borderRadius: '20px',
                        transition: 'all 0.2s ease',
                        userSelect: 'none'
                      }}>
                        <input
                          type="checkbox"
                          checked={subDestinations.includes('map')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSubDestinations(prev => [...prev, 'map']);
                            } else {
                              setSubDestinations(prev => prev.filter(d => d !== 'map'));
                            }
                          }}
                          style={{ accentColor: theme.text }}
                        />
                        Interactive Map
                      </label>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '10.5px', 
                        cursor: 'pointer', 
                        color: theme.text,
                        backgroundColor: subDestinations.includes('codex') 
                          ? (isMapDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)') 
                          : (isMapDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
                        border: `1px solid ${subDestinations.includes('codex') ? theme.border : theme.borderLight}`,
                        padding: '5px 12px',
                        borderRadius: '20px',
                        transition: 'all 0.2s ease',
                        userSelect: 'none'
                      }}>
                        <input
                          type="checkbox"
                          checked={subDestinations.includes('codex')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSubDestinations(prev => [...prev, 'codex']);
                            } else {
                              setSubDestinations(prev => prev.filter(d => d !== 'codex'));
                            }
                          }}
                          style={{ accentColor: theme.text }}
                        />
                        Codex
                      </label>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '10.5px', 
                        cursor: 'pointer', 
                        color: theme.text,
                        backgroundColor: subDestinations.includes('timeline') 
                          ? (isMapDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)') 
                          : (isMapDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
                        border: `1px solid ${subDestinations.includes('timeline') ? theme.border : theme.borderLight}`,
                        padding: '5px 12px',
                        borderRadius: '20px',
                        transition: 'all 0.2s ease',
                        userSelect: 'none'
                      }}>
                        <input
                          type="checkbox"
                          checked={subDestinations.includes('timeline')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSubDestinations(prev => [...prev, 'timeline']);
                            } else {
                              setSubDestinations(prev => prev.filter(d => d !== 'timeline'));
                            }
                          }}
                          style={{ accentColor: theme.text }}
                        />
                        Timeline
                      </label>
                    </div>
                  </div>

                  {subDestinations.includes('map') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: `2px solid ${theme.borderLight}`, paddingLeft: '12px', marginTop: '4px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: theme.textDim, letterSpacing: '0.5px' }}>MAP CONFIGURATION</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', zIndex: 10002 }}>
                        <div style={{ flex: '1 1 200px', position: 'relative' }}>
                          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>REGISTRY LAYER / CODEX CATEGORY *</label>
                          <div style={{ position: 'relative' }}>
                            <button
                              type="button"
                              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                              style={{
                                width: '100%',
                                background: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                                border: `1px solid ${theme.border}`,
                                padding: '8px 12px',
                                fontSize: '11px',
                                color: theme.text,
                                fontFamily: '"Space Mono", monospace',
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontWeight: 'bold' }}>{subCategory}</span>
                              <ChevronDown size={12} style={{ color: theme.text, transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            
                            {isCategoryDropdownOpen && (
                              <>
                                <div 
                                  onClick={() => setIsCategoryDropdownOpen(false)}
                                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000 }} 
                                />
                                <div style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  right: 0,
                                  background: isMapDarkMode ? '#0d0d0d' : '#ffffff',
                                  border: `1px solid ${theme.border}`,
                                  borderTop: 'none',
                                  zIndex: 10001,
                                  maxHeight: '200px',
                                  overflowY: 'auto',
                                  boxShadow: isMapDarkMode ? '0 5px 25px rgba(0,0,0,0.8)' : '0 5px 25px rgba(0,0,0,0.15)'
                                }}>
                                  {allIntelCategories.map(cat => (
                                    <div
                                      key={cat}
                                      onClick={() => {
                                        setSubCategory(cat);
                                        setIsCategoryDropdownOpen(false);
                                      }}
                                      style={{
                                        padding: '8px 12px',
                                        fontSize: '11px',
                                        color: theme.text,
                                        cursor: 'pointer',
                                        background: subCategory === cat ? (isMapDarkMode ? '#222' : '#eee') : 'transparent',
                                        transition: 'background 0.15s',
                                        borderBottom: `1px solid ${theme.borderLight}`,
                                        fontWeight: subCategory === cat ? 'bold' : 'normal',
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = isMapDarkMode ? '#1a1a1a' : '#f5f5f5';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = subCategory === cat ? (isMapDarkMode ? '#222' : '#eee') : 'transparent';
                                      }}
                                    >
                                      {cat}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div style={{ flex: isMobile ? '1 1 100%' : '0 0 160px' }}>
                          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>YEAR OF OCCURRENCE</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 1948" 
                            value={subDate} 
                            onChange={(e) => setSubDate(e.target.value)}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: `1px solid ${theme.border}`,
                              padding: '8px 12px',
                              fontSize: '11px',
                              color: theme.text,
                              fontFamily: '"Space Mono", monospace'
                            }}
                          />
                        </div>
                      </div>

                      {/* Geolocation auto-pinpoint input block matching requirement 3 */}
                      <div style={{ background: isMapDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px dashed ${theme.borderLight}`, padding: '12px', borderRadius: '2px' }}>
                        <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>GEOGRAPHIC GEO-SEARCH (AUTO-FILL COORDINATES)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Type place name/address (e.g., Mount Shasta, CA)..."
                            value={subLocationSearch}
                            onChange={(e) => setSubLocationSearch(e.target.value)}
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                await handleSubSearchGeocode();
                              }
                            }}
                            style={{
                              flex: '1 1 180px',
                              background: 'transparent',
                              border: `1px solid ${theme.border}`,
                              padding: '6px 12px',
                              fontSize: '11px',
                              color: theme.text,
                              fontFamily: '"Space Mono", monospace'
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleSubSearchGeocode}
                            disabled={isSubGeocoding}
                            style={{
                              background: theme.text,
                              color: theme.bg,
                              border: 'none',
                              padding: '0 16px',
                              height: '32px',
                              borderRadius: '16px',
                              fontSize: '9px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontFamily: '"Space Mono", monospace',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxSizing: 'border-box',
                              flex: isMobile ? '1 1 100%' : 'none'
                            }}
                          >
                            {isSubGeocoding ? 'FINDING...' : 'RESOLVE'}
                          </button>
                        </div>
                        
                        {subGeocodeMsg && (
                          <div style={{ fontSize: '9px', color: subGeocodeMsg.type === 'error' ? '#ff3333' : '#00cc00', marginTop: '6px', fontWeight: 'bold' }}>
                            {subGeocodeMsg.text}
                          </div>
                        )}

                        {subGeocodeResults.length > 1 && (
                          <div style={{ 
                            marginTop: '8px', 
                            border: `1px solid ${theme.borderLight}`,
                            borderRadius: '2px',
                            background: isMapDarkMode ? '#111111' : '#fcfcfc',
                            maxHeight: '130px',
                            overflowY: 'auto',
                            textAlign: 'left'
                          }}>
                            <div style={{ padding: '4px 8px', fontSize: '8px', fontWeight: 'bold', color: theme.textDim, borderBottom: `1px solid ${theme.borderLight}`, letterSpacing: '0.5px' }}>
                              SUGGESTED MATCHES (CLICK TO PINPOINT):
                            </div>
                            {subGeocodeResults.map((feat) => {
                              const [lng, lat] = feat.center;
                              return (
                                <div 
                                  key={feat.id}
                                  onClick={() => {
                                    setSubLongitude(lng.toFixed(6));
                                    setSubLatitude(lat.toFixed(6));
                                    setSubLocationSearch(feat.place_name || feat.text);
                                    setSubGeocodeMsg({
                                      text: `SELECTED: ${feat.place_name || feat.text} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                                      type: 'success'
                                    });
                                    setSubGeocodeResults([]);
                                  }}
                                  style={{ 
                                    padding: '6px 8px', 
                                    fontSize: '9.5px', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1px',
                                    borderBottom: `1px solid ${theme.borderLight}`
                                  }}
                                  className={isMapDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}
                                >
                                  <span style={{ fontWeight: 'bold', color: theme.text }}>{feat.place_name || feat.text}</span>
                                  <span style={{ fontSize: '8px', color: theme.textDim }}>Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Lat/Lng Pin coordinates */}
                      <div>
                        <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>COORDINATES REGISTRATION (OPTIONAL)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <input 
                            type="text" 
                            placeholder="Latitude (e.g. 41.4091)" 
                            value={subLatitude} 
                            onChange={(e) => setSubLatitude(e.target.value)}
                            style={{
                              flex: '1 1 calc(50% - 4px)',
                              minWidth: '120px',
                              background: 'transparent',
                              border: `1px solid ${theme.border}`,
                              padding: '8px 12px',
                              fontSize: '11px',
                              color: theme.text,
                              fontFamily: '"Space Mono", monospace'
                            }}
                          />
                          <input 
                            type="text" 
                            placeholder="Longitude (e.g. -122.1952)" 
                            value={subLongitude} 
                            onChange={(e) => setSubLongitude(e.target.value)}
                            style={{
                              flex: '1 1 calc(50% - 4px)',
                              minWidth: '120px',
                              background: 'transparent',
                              border: `1px solid ${theme.border}`,
                              padding: '8px 12px',
                              fontSize: '11px',
                              color: theme.text,
                              fontFamily: '"Space Mono", monospace'
                            }}
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              setIsSubmitOpen(false);
                              setIsPinningOnMap(true);
                            }}
                            style={{
                              background: theme.text,
                              color: theme.bg,
                              border: 'none',
                              padding: '0 16px',
                              height: '32px',
                              borderRadius: '16px',
                              fontSize: '9px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              fontFamily: '"Space Mono", monospace',
                              boxSizing: 'border-box',
                              flex: isMobile ? '1 1 100%' : 'none'
                            }}
                          >
                            <MapPin size={10} strokeWidth={2.5} />
                            <span>PIN MAP</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {subDestinations.includes('codex') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: `2px solid ${theme.borderLight}`, paddingLeft: '12px', marginTop: '4px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: theme.textDim, letterSpacing: '0.5px' }}>CODEX CONFIGURATION</div>
                      <div>
                        <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>PARENT CODEX TERM</label>
                        <select
                          value={subCodexParentId}
                          onChange={(e) => setSubCodexParentId(e.target.value)}
                          style={{
                            width: '100%',
                            background: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                            border: `1px solid ${theme.border}`,
                            padding: '8px 12px',
                            fontSize: '11px',
                            color: theme.text,
                            fontFamily: '"Space Mono", monospace'
                          }}
                        >
                          <option value="">None (Root Category)</option>
                          {[...combinedCodexNodes]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(node => (
                              <option key={node.id} value={node.id}>
                                {node.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  )}

                  {subDestinations.includes('timeline') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: `2px solid ${theme.borderLight}`, paddingLeft: '12px', marginTop: '4px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: theme.textDim, letterSpacing: '0.5px' }}>TIMELINE CONFIGURATION</div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ flex: '1 1 180px' }}>
                          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>TIMELINE LAYER / ERA *</label>
                          <select
                            value={subTimelineLayer}
                            onChange={(e) => setSubTimelineLayer(e.target.value)}
                            style={{
                              width: '100%',
                              background: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                              border: `1px solid ${theme.border}`,
                              padding: '8px 12px',
                              fontSize: '11px',
                              color: theme.text,
                              fontFamily: '"Space Mono", monospace'
                            }}
                          >
                            <option value="biblical-patriarchs">Biblical Bloodlines</option>
                            <option value="biblical-events">Biblical Events</option>
                            <option value="future-prophecy">Biblical Prophecy</option>
                            <option value="enochian-lore">Enochian Lore</option>
                            <option value="sumerian-kings">Sumerian Kings List</option>
                            <option value="greek-mythology">Greek Mythology</option>
                            <option value="merovingian-bloodlines">Merovingian Bloodlines</option>
                            <option value="royal-bloodlines">Royal Bloodlines</option>
                            <option value="illuminati-bloodlines">13 Illuminati Bloodlines</option>
                            <option value="black-nobility">13 Black Nobility Families</option>
                            <option value="government-conspiracies">Government Conspiracies</option>
                            <option value="nasa-space">NASA / Space</option>
                            <option value="ancient-civilizations">Ancient People Groups</option>
                            <option value="alchemy-occult">The Occult</option>
                          </select>
                        </div>

                        <div style={{ flex: isMobile ? '1 1 100%' : '0 0 120px' }}>
                          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>ENTRY TYPE</label>
                          <select
                            value={subTimelineType}
                            onChange={(e) => setSubTimelineType(e.target.value as 'event' | 'lifespan')}
                            style={{
                              width: '100%',
                              background: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                              border: `1px solid ${theme.border}`,
                              padding: '8px 12px',
                              fontSize: '11px',
                              color: theme.text,
                              fontFamily: '"Space Mono", monospace'
                            }}
                          >
                            <option value="event">Event</option>
                            <option value="lifespan">Lifespan</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ flex: '1 1 140px' }}>
                          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>
                            {subTimelineType === 'lifespan' ? 'YEAR OF BIRTH (START) *' : 'YEAR OF OCCURRENCE *'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. -1948 or 1350"
                            value={subDate}
                            onChange={(e) => setSubDate(e.target.value)}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: `1px solid ${theme.border}`,
                              padding: '8px 12px',
                              fontSize: '11px',
                              color: theme.text,
                              fontFamily: '"Space Mono", monospace'
                            }}
                          />
                        </div>

                        {subTimelineType === 'lifespan' && (
                          <div style={{ flex: '1 1 140px' }}>
                            <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>YEAR OF DEATH (END)</label>
                            <input
                              type="text"
                              placeholder="e.g. -1800 or 1410 (optional)"
                              value={subTimelineEnd}
                              onChange={(e) => setSubTimelineEnd(e.target.value)}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: `1px solid ${theme.border}`,
                                padding: '8px 12px',
                                fontSize: '11px',
                                color: theme.text,
                                fontFamily: '"Space Mono", monospace'
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Lineage relationships for Lifespans */}
                      {subTimelineType === 'lifespan' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: isMapDarkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)', padding: '10px', border: `1px solid ${theme.borderLight}` }}>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', color: theme.textDim, letterSpacing: '0.5px' }}>FAMILY TREE LINEAGE (OPTIONAL)</div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ flex: '1 1 calc(33.333% - 6px)', minWidth: '95px' }}>
                              <label style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>FATHER</label>
                              <select
                                value={subTimelineFatherId}
                                onChange={(e) => setSubTimelineFatherId(e.target.value)}
                                style={{
                                  width: '100%',
                                  background: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                                  border: `1px solid ${theme.border}`,
                                  padding: '4px 6px',
                                  fontSize: '9.5px',
                                  color: theme.text,
                                  fontFamily: '"Space Mono", monospace'
                                }}
                              >
                                <option value="">None</option>
                                {[...combinedTimelineItems]
                                  .filter(item => item.type === 'lifespan')
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                  ))
                                }
                              </select>
                            </div>

                            <div style={{ flex: '1 1 calc(33.333% - 6px)', minWidth: '95px' }}>
                              <label style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>MOTHER</label>
                              <select
                                value={subTimelineMotherId}
                                onChange={(e) => setSubTimelineMotherId(e.target.value)}
                                style={{
                                  width: '100%',
                                  background: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                                  border: `1px solid ${theme.border}`,
                                  padding: '4px 6px',
                                  fontSize: '9.5px',
                                  color: theme.text,
                                  fontFamily: '"Space Mono", monospace'
                                }}
                              >
                                <option value="">None</option>
                                {[...combinedTimelineItems]
                                  .filter(item => item.type === 'lifespan')
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                  ))
                                }
                              </select>
                            </div>

                            <div style={{ flex: '1 1 calc(33.333% - 6px)', minWidth: '95px' }}>
                              <label style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>SPOUSE</label>
                              <select
                                value={subTimelineSpouseId}
                                onChange={(e) => setSubTimelineSpouseId(e.target.value)}
                                style={{
                                  width: '100%',
                                  background: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                                  border: `1px solid ${theme.border}`,
                                  padding: '4px 6px',
                                  fontSize: '9.5px',
                                  color: theme.text,
                                  fontFamily: '"Space Mono", monospace'
                                }}
                              >
                                <option value="">None</option>
                                {[...combinedTimelineItems]
                                  .filter(item => item.type === 'lifespan')
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>NARRATIVE RECORD & DATA LOG *</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Transcribe detailed observations, testimonies, spectral coordinates characteristics..." 
                      value={subDescription} 
                      onChange={(e) => setSubDescription(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: `1px solid ${theme.border}`,
                        padding: '8px 12px',
                        fontSize: '11px',
                        color: theme.text,
                        fontFamily: '"Space Mono", monospace',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>INVESTIGATIVE SOURCE ATTRIBUTION</label>
                      <input 
                        type="text" 
                        placeholder="e.g. US Air Force Project Blue Book Archives" 
                        value={subSource} 
                        onChange={(e) => setSubSource(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: `1px solid ${theme.border}`,
                          padding: '8px 12px',
                          fontSize: '11px',
                          color: theme.text,
                          fontFamily: '"Space Mono", monospace'
                        }}
                      />
                    </div>
                  </div>

                  {/* Media Selector upload/link */}
                  <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '10.5px', fontWeight: 'bold', color: theme.text }}>MEDIA / INTEL FILES ATTACHMENT</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setSubMediaType('url')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: subMediaType === 'url' ? theme.text : theme.textDim,
                            fontWeight: subMediaType === 'url' ? 'bold' : 'normal',
                            fontSize: '9px',
                            cursor: 'pointer',
                            textDecoration: subMediaType === 'url' ? 'underline' : 'none',
                            fontFamily: '"Space Mono", monospace'
                          }}
                        >
                          LINK URL
                        </button>
                        <span style={{ fontSize: '9px', color: theme.textDim }}>|</span>
                        <button
                          type="button"
                          onClick={() => setSubMediaType('upload')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: subMediaType === 'upload' ? theme.text : theme.textDim,
                            fontWeight: subMediaType === 'upload' ? 'bold' : 'normal',
                            fontSize: '9px',
                            cursor: 'pointer',
                            textDecoration: subMediaType === 'upload' ? 'underline' : 'none',
                            fontFamily: '"Space Mono", monospace'
                          }}
                        >
                          FILE UPLOAD
                        </button>
                      </div>
                    </div>

                    {subMediaType === 'url' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Paste image/PDF/audio/video URL directly..." 
                          value={subMediaInput} 
                          onChange={(e) => setSubMediaInput(e.target.value)}
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: `1px solid ${theme.border}`,
                            padding: '6px 12px',
                            fontSize: '10px',
                            color: theme.text,
                            fontFamily: '"Space Mono", monospace'
                          }}
                        />
                         <button 
                          type="button" 
                          onClick={() => {
                            const url = subMediaInput.trim();
                            if (!url) return;
                            setSubMediaList(prev => [...prev, url]);
                            setSubMediaInput('');
                          }}
                          style={{
                            background: 'transparent',
                            color: theme.text,
                            border: `1px solid ${theme.border}`,
                            padding: '0 16px',
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
                          LINK
                        </button>
                      </div>
                    ) : (
                      <div style={{ border: `1px dashed ${theme.border}`, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
                        <input 
                          type="file" 
                          multiple
                          accept="image/*,video/*,audio/*,application/pdf"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []) as File[];
                            if (files.length === 0) return;

                            setIsUploading(true);
                            setSubmissionError(null);

                            const uploadedUrls: string[] = [];
                            const errors: string[] = [];

                            for (const file of files) {
                              try {
                                if (file.type.startsWith('image/')) {
                                  const dataUrl = await compressImageToDataUrl(file);
                                  uploadedUrls.push(dataUrl);
                                } else {
                                  const base64Data = await new Promise<string>((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () => resolve(reader.result as string);
                                    reader.onerror = reject;
                                    reader.readAsDataURL(file);
                                  });
                                  uploadedUrls.push(base64Data);
                                }
                              } catch (err: any) {
                                console.error("Upload Processing Error:", err);
                                errors.push(err.message || String(err));
                              }
                            }

                            if (uploadedUrls.length > 0) {
                              setSubMediaList(prev => [...prev, ...uploadedUrls]);
                            }
                            if (errors.length > 0) {
                              setSubmissionError(`Upload error(s): ${errors.join('; ')}`);
                            }

                            setIsUploading(false);
                            e.target.value = '';
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                        <Upload size={20} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '9px', fontWeight: 'bold' }}>
                          {isUploading ? "UPLOADING FILES..." : "CLICK OR DRAG FILES HERE TO STAGE (MULTIPLE ALLOWED)"}
                        </span>
                        <span style={{ fontSize: '8px', color: theme.textDim, marginTop: '4px' }}>PNG, JPG, MP4, MP3, PDF compatible</span>
                      </div>
                    )}

                    {/* Staged attachments */}
                    {subMediaList.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px', background: isMapDarkMode ? '#141414' : '#fafafa', border: `1px solid ${theme.borderLight}`, padding: '8px' }}>
                        <span style={{ fontSize: '9.5px', fontWeight: 'bold' }}>STAGED INTEL ATTACHMENTS ({subMediaList.length})</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {subMediaList.map((url, idx) => {
                            const isFile = url.startsWith('/uploads/');
                            const displayName = isFile ? url.replace('/uploads/', '') : url;
                            return (
                              <div key={idx} style={{ padding: '4px 8px', background: isMapDarkMode ? '#222' : '#eeeeee', border: `1px solid ${theme.border}`, fontSize: '9px', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '100%' }}>
                                <span style={{ maxWidth: isMobile ? '160px' : '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setSubMediaList(prev => prev.filter((_, i) => i !== idx));
                                  }} 
                                  style={{ background: 'transparent', border: 'none', color: '#ff3333', cursor: 'pointer', padding: 0 }}
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SUBMITTER / CONTRIBUTOR INFO (OPTIONAL) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ flex: '1 1 140px' }}>
                        <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>CONTRIBUTOR / SUBMITTER NAME (OPTIONAL)</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Agent Mulder" 
                          value={subSubmitterName} 
                          onChange={(e) => setSubSubmitterName(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: `1px solid ${theme.border}`,
                            padding: '8px 12px',
                            fontSize: '11px',
                            color: theme.text,
                            fontFamily: '"Space Mono", monospace'
                          }}
                        />
                      </div>
                      <div style={{ flex: '1 1 140px' }}>
                        <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>SUBMITTER EMAIL (OPTIONAL / PRIVATE)</label>
                        <input 
                          type="email" 
                          placeholder="e.g., mulder@fbi.gov" 
                          value={subSubmitterEmail} 
                          onChange={(e) => setSubSubmitterEmail(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: `1px solid ${theme.border}`,
                            padding: '8px 12px',
                            fontSize: '11px',
                            color: theme.text,
                            fontFamily: '"Space Mono", monospace'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>CONTRIBUTOR SOCIAL MEDIA OR WEBSITE LINK (OPTIONAL)</label>
                      <input 
                        type="text" 
                        placeholder="e.g., https://x.com/username, https://instagram.com/user, or https://mywebsite.com" 
                        value={subSubmitterLink} 
                        onChange={(e) => setSubSubmitterLink(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: `1px solid ${theme.border}`,
                          padding: '8px 12px',
                          fontSize: '11px',
                          color: theme.text,
                          fontFamily: '"Space Mono", monospace'
                        }}
                      />
                    </div>
                  </div>

                  {submissionError && (
                    <div style={{ color: '#ff3333', fontSize: '10px', fontWeight: 'bold', border: '1px solid #ff3333', padding: '8px', background: 'rgba(255,0,0,0.02)' }}>
                      {submissionError}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '10px', borderTop: `1px solid ${theme.border}`, paddingTop: '16px' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsSubmitOpen(false)} 
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
                        boxSizing: 'border-box',
                        flex: isMobile ? '1 1 calc(50% - 5px)' : 'none'
                      }}
                    >
                      CANCEL
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || isUploading}
                      style={{
                        background: theme.text,
                        color: theme.bg,
                        border: 'none',
                        padding: '0 24px',
                        height: '32px',
                        borderRadius: '16px',
                        fontSize: '9px',
                        fontWeight: 700,
                        cursor: (isSubmitting || isUploading) ? 'not-allowed' : 'pointer',
                        fontFamily: '"Space Mono", monospace',
                        opacity: (isSubmitting || isUploading) ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        flex: isMobile ? '1 1 calc(50% - 5px)' : 'none'
                      }}
                    >
                      {isSubmitting ? "TRANSMITTING..." : "SUBMIT INTEL"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
