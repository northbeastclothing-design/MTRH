import React, { useState } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { X, Upload, ShieldAlert, Shield, Eye, CheckCircle, Edit3 } from 'lucide-react';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { compressImageToDataUrl, getEmbedUrl, cleanAndProxyImageUrl } from '../utils/media';
import { isValidLngLat } from '../utils/records';
import mapboxgl from 'mapbox-gl';

// Moderation desk (pending intel, inaccuracy reports, cartography pins, overrides) and its
// edit/preview forms. Moved verbatim out of App.tsx; the edit-form and per-row state that
// nothing else referenced now lives here, the rest is owned by App and passed in.
interface ModeratorConsoleProps {
  overrides: Record<string, any>;
  setOverrides: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setSavedPasscode: React.Dispatch<React.SetStateAction<any>>;
  approvedSubmissions: any[];
  isModeratorOpen: any;
  setIsModeratorOpen: React.Dispatch<React.SetStateAction<any>>;
  moderatorPasscode: string;
  setModeratorPasscode: React.Dispatch<React.SetStateAction<string>>;
  isModeratorAuthenticated: any;
  setIsModeratorAuthenticated: React.Dispatch<React.SetStateAction<any>>;
  moderatorError: string | null;
  setModeratorError: React.Dispatch<React.SetStateAction<string | null>>;
  currentUser: any;
  pendingSubmissions: any[];
  submittingApprovalId: string | null;
  setSubmittingApprovalId: React.Dispatch<React.SetStateAction<string | null>>;
  setModeratorReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
  isModMinimized: boolean;
  activeModTab: 'pending' | 'approved' | 'reports' | 'cartography';
  setActiveModTab: React.Dispatch<React.SetStateAction<'pending' | 'approved' | 'reports' | 'cartography'>>;
  modCartographyPoints: any[];
  reports: any[];
  isMapDarkMode: boolean;
  combinedCodexNodes: any[];
  combinedPointsAndLinesData: any[];
  combinedTimelineItems: any[];
  getModeratorHeadersAndBody: (...args: any[]) => any;
  handleApproveSubmission: (...args: any[]) => any;
  handlePreviewIntel: (...args: any[]) => any;
  isMobile: boolean;
  layerColors: Record<string, string>;
  mapRef: React.MutableRefObject<any>;
  theme: any;
  uniqueCategories: string[];
  auth: any;
  db: any;
}

export default function ModeratorConsole({
  overrides,
  setOverrides,
  setSavedPasscode,
  approvedSubmissions,
  isModeratorOpen,
  setIsModeratorOpen,
  moderatorPasscode,
  setModeratorPasscode,
  isModeratorAuthenticated,
  setIsModeratorAuthenticated,
  moderatorError,
  setModeratorError,
  currentUser,
  pendingSubmissions,
  submittingApprovalId,
  setSubmittingApprovalId,
  setModeratorReloadTrigger,
  isModMinimized,
  activeModTab,
  setActiveModTab,
  modCartographyPoints,
  reports,
  isMapDarkMode,
  combinedCodexNodes,
  combinedPointsAndLinesData,
  combinedTimelineItems,
  getModeratorHeadersAndBody,
  handleApproveSubmission,
  handlePreviewIntel,
  isMobile,
  layerColors,
  mapRef,
  theme,
  uniqueCategories,
  auth,
  db,
}: ModeratorConsoleProps) {
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [submittingRejectionId, setSubmittingRejectionId] = useState<string | null>(null);
  const [submittingRevocationId, setSubmittingRevocationId] = useState<string | null>(null);
  const [previewSub, setPreviewSub] = useState<any | null>(null);
  const [deletingCartoPointId, setDeletingCartoPointId] = useState<string | null>(null);
  const [submittingReportActionId, setSubmittingReportActionId] = useState<string | null>(null);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editSource, setEditSource] = useState('');
  const [editLongitude, setEditLongitude] = useState('');
  const [editLatitude, setEditLatitude] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isEditCategoryDropdownOpen, setIsEditCategoryDropdownOpen] = useState(false);
  const [editMediaList, setEditMediaList] = useState<string[]>([]);
  const [editMediaInput, setEditMediaInput] = useState('');
  const [editMediaType, setEditMediaType] = useState<'url' | 'upload'>('url');
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [editLocationSearch, setEditLocationSearch] = useState('');
  const [editGeocodeResults, setEditGeocodeResults] = useState<any[]>([]);
  const [isEditGeocoding, setIsEditGeocoding] = useState(false);
  const [editGeocodeMsg, setEditGeocodeMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [editDestinations, setEditDestinations] = useState<string[]>(['map']);
  const [editCodexParentId, setEditCodexParentId] = useState('');
  const [editTimelineId, setEditTimelineId] = useState('');
  const [editMapFeatureId, setEditMapFeatureId] = useState('');
  const [editTimelineLayer, setEditTimelineLayer] = useState('biblical-events');
  const [editTimelineType, setEditTimelineType] = useState<'event' | 'lifespan'>('event');
  const [editTimelineEnd, setEditTimelineEnd] = useState('');
  const [editTimelineFatherId, setEditTimelineFatherId] = useState('');
  const [editTimelineMotherId, setEditTimelineMotherId] = useState('');
  const [editTimelineSpouseId, setEditTimelineSpouseId] = useState('');

  const handleBypassAuth = async () => {
    try {
      setModeratorError(null);
      const response = await fetch('/api/moderate/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: moderatorPasscode })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server status ${response.status}`);
      }

      setSavedPasscode(moderatorPasscode);
      try {
        sessionStorage.setItem('mtrh_mod_passcode', moderatorPasscode);
      } catch (e) {}
      setIsModeratorAuthenticated(true);
      setModeratorPasscode('');
    } catch (err: any) {
      console.error("Passcode auth fail:", err);
      setModeratorError(err.message || "BYPASS CODE DENIED.");
    }
  };

  const handleDeleteCartoPoint = async (pointId: string) => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO PURGE THIS CARTOGRAPHY PIN PERMANENTLY?")) return;
    try {
      setDeletingCartoPointId(pointId);
      const authParams = await getModeratorHeadersAndBody({ pointId });
      const res = await fetch('/api/moderate/cartography-points/delete', {
        method: 'POST',
        headers: authParams.headers,
        body: authParams.body
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Server status ${res.status}`);
      }
      setModeratorReloadTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete cartography point:", err);
      alert(`Deletion Failed: ${err.message || err}`);
    } finally {
      setDeletingCartoPointId(null);
    }
  };

  const handleStartEdit = (sub: any) => {
    setEditingSubId(sub.id);
    setEditName(sub.name || '');
    setEditCategory(sub.category || '');
    setEditDescription(sub.description || '');
    setEditDate(sub.date || '');
    setEditSource(sub.source || '');
    setEditLongitude(sub.coordinates?.[0]?.toString() || '');
    setEditLatitude(sub.coordinates?.[1]?.toString() || '');
    setEditDestinations(sub.destinations || ['map']);
    setEditCodexParentId(sub.codexParentId || '');
    setEditTimelineLayer(sub.timelineLayer || 'biblical-events');
    setEditTimelineType(sub.timelineType || 'event');
    setEditTimelineEnd(sub.timelineEnd || '');
    setEditTimelineFatherId(sub.timelineFatherId || '');
    setEditTimelineMotherId(sub.timelineMotherId || '');
    setEditTimelineSpouseId(sub.timelineSpouseId || '');
    setIsEditCategoryDropdownOpen(false);
    setEditMediaList(sub.images || []);
    setEditMediaInput('');
    setEditMediaType('url');
    setEditLocationSearch('');
    setEditGeocodeResults([]);
    setEditGeocodeMsg(null);
  };

  const handleSaveSubmissionEdit = async (docId: string) => {
    setIsSavingEdit(true);
    setModeratorError(null);
    try {
      const hasCoords = editLongitude.trim() !== '' || editLatitude.trim() !== '';
      let coordinatesValue: any = null;
      if (hasCoords) {
        const lngNum = parseFloat(editLongitude);
        const latNum = parseFloat(editLatitude);
        if (isNaN(lngNum) || isNaN(latNum)) {
          throw new Error("Invalid Longitude/Latitude coordinates format.");
        }
        if (!isValidLngLat(lngNum, latNum)) {
          throw new Error("Coordinates must be within standard bounds (Latitude: -90 to 90, Longitude: -180 to 180).");
        }
        coordinatesValue = [lngNum, latNum];
      }

      const updatedFields = {
        name: editName,
        category: editCategory,
        description: editDescription,
        date: editDate,
        source: editSource,
        coordinates: coordinatesValue,
        images: editMediaList,
        destinations: editDestinations,
        codexParentId: editDestinations.includes('codex') ? editCodexParentId : '',
        timelineLayer: editDestinations.includes('timeline') ? editTimelineLayer : '',
        timelineType: editDestinations.includes('timeline') ? editTimelineType : 'event',
        timelineEnd: (editDestinations.includes('timeline') && editTimelineType === 'lifespan') ? editTimelineEnd.trim() : '',
        timelineFatherId: (editDestinations.includes('timeline') && editTimelineType === 'lifespan') ? editTimelineFatherId : '',
        timelineMotherId: (editDestinations.includes('timeline') && editTimelineType === 'lifespan') ? editTimelineMotherId : '',
        timelineSpouseId: (editDestinations.includes('timeline') && editTimelineType === 'lifespan') ? editTimelineSpouseId : ''
      };

      const authParams = await getModeratorHeadersAndBody({ docId, updatedData: updatedFields });
      const response = await fetch('/api/moderate/update', {
        method: 'POST',
        headers: authParams.headers,
        body: authParams.body
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server status ${response.status}`);
      }

      try {
        await updateDoc(doc(db, 'submissions', docId), updatedFields);
      } catch (fbErr) {
        console.warn("Direct Firestore update skipped/failed:", fbErr);
      }

      setEditingSubId(null);
      setModeratorReloadTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error("Failed to save submission edit:", err);
      setModeratorError(`Edit Failed: ${err.message || 'Unknown network error'}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleUseMapCenterForEdit = () => {
    if (mapRef.current) {
      try {
        const center = mapRef.current.getCenter();
        if (center) {
          setEditLongitude(center.lng.toFixed(6));
          setEditLatitude(center.lat.toFixed(6));
        }
      } catch (err) {
        console.error("Error getting map center:", err);
      }
    }
  };

  const handleEditSearchGeocode = async () => {
    const queryStr = editLocationSearch.trim();
    if (!queryStr) return;
    setIsEditGeocoding(true);
    setEditGeocodeMsg(null);
    setEditGeocodeResults([]);
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
        setEditGeocodeResults(data.features);
        
        // Populate with the first match immediately as default
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        setEditLongitude(lng.toFixed(6));
        setEditLatitude(lat.toFixed(6));
        setEditGeocodeMsg({
          text: `RESOLVED: ${feature.place_name || feature.text} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          type: 'success'
        });
      } else {
        setEditGeocodeMsg({
          text: "STATION ERROR: LOCATION NOT FOUND.",
          type: 'error'
        });
      }
    } catch (err: any) {
      console.error(err);
      setEditGeocodeMsg({
        text: `STATION ERROR: ${err.message || err}`,
        type: 'error'
      });
    } finally {
      setIsEditGeocoding(false);
    }
  };

  const renderEditForm = (sub: any) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', textAlign: 'left' }}>
        <div>
          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>NAME *</label>
          <input 
            type="text" 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)} 
            style={{
              width: '100%', 
              background: isMapDarkMode ? '#222' : '#fff', 
              border: `1px solid ${theme.border}`, 
              color: theme.text, 
              padding: '6px 10px', 
              fontSize: '11px',
              fontFamily: '"Space Mono", monospace'
            }} 
          />
        </div>

        {/* DESTINATION REGISTRIES */}
        <div style={{ paddingTop: '12px' }}>
          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>DESTINATION REGISTRIES * (SELECT AT LEAST ONE)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px', marginBottom: '14px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '11px', 
              cursor: 'pointer', 
              color: theme.text,
              backgroundColor: editDestinations.includes('map') 
                ? (isMapDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)') 
                : (isMapDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
              border: `1px solid ${editDestinations.includes('map') ? theme.border : theme.borderLight}`,
              padding: '6px 14px',
              borderRadius: '20px',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={editDestinations.includes('map')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEditDestinations(prev => [...prev, 'map']);
                  } else {
                    setEditDestinations(prev => prev.filter(d => d !== 'map'));
                  }
                }}
                style={{ accentColor: theme.text }}
              />
              Interactive Map
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '11px', 
              cursor: 'pointer', 
              color: theme.text,
              backgroundColor: editDestinations.includes('codex') 
                ? (isMapDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)') 
                : (isMapDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
              border: `1px solid ${editDestinations.includes('codex') ? theme.border : theme.borderLight}`,
              padding: '6px 14px',
              borderRadius: '20px',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={editDestinations.includes('codex')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEditDestinations(prev => [...prev, 'codex']);
                  } else {
                    setEditDestinations(prev => prev.filter(d => d !== 'codex'));
                  }
                }}
                style={{ accentColor: theme.text }}
              />
              Codex
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '11px', 
              cursor: 'pointer', 
              color: theme.text,
              backgroundColor: editDestinations.includes('timeline') 
                ? (isMapDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)') 
                : (isMapDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
              border: `1px solid ${editDestinations.includes('timeline') ? theme.border : theme.borderLight}`,
              padding: '6px 14px',
              borderRadius: '20px',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={editDestinations.includes('timeline')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEditDestinations(prev => [...prev, 'timeline']);
                  } else {
                    setEditDestinations(prev => prev.filter(d => d !== 'timeline'));
                  }
                }}
                style={{ accentColor: theme.text }}
              />
              Timeline
            </label>
          </div>
        </div>

        {editDestinations.includes('map') && (
          <div style={{ display: 'flex', gap: '10px', borderLeft: `2px solid ${theme.borderLight}`, paddingLeft: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>LAYER CATEGORY *</label>
              <select 
                value={editCategory} 
                onChange={(e) => setEditCategory(e.target.value)} 
                style={{
                  width: '100%', 
                  background: isMapDarkMode ? '#222' : '#fff', 
                  border: `1px solid ${theme.border}`, 
                  color: theme.text, 
                  padding: '6px 10px', 
                  fontSize: '11px',
                  fontFamily: '"Space Mono", monospace',
                  height: '30px'
                }}
              >
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} style={{ background: isMapDarkMode ? '#0d0d0d' : '#fff' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>YEAR / DATE</label>
              <input 
                type="text" 
                value={editDate} 
                onChange={(e) => setEditDate(e.target.value)} 
                style={{
                  width: '100%', 
                  background: isMapDarkMode ? '#222' : '#fff', 
                  border: `1px solid ${theme.border}`, 
                  color: theme.text, 
                  padding: '6px 10px', 
                  fontSize: '11px',
                  fontFamily: '"Space Mono", monospace',
                  height: '30px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
          </div>
        )}

         {editDestinations.includes('codex') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: `2px solid ${theme.borderLight}`, paddingLeft: '10px' }}>
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>PARENT CODEX TERM</label>
              <select
                value={editCodexParentId}
                onChange={(e) => setEditCodexParentId(e.target.value)}
                style={{
                  width: '100%',
                  background: isMapDarkMode ? '#222' : '#fff',
                  border: `1px solid ${theme.border}`,
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: theme.text,
                  fontFamily: '"Space Mono", monospace',
                  height: '30px'
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

        {editDestinations.includes('timeline') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: `2px solid ${theme.borderLight}`, paddingLeft: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>TIMELINE LAYER / ERA *</label>
                <select
                  value={editTimelineLayer}
                  onChange={(e) => setEditTimelineLayer(e.target.value)}
                  style={{
                    width: '100%',
                    background: isMapDarkMode ? '#222' : '#fff',
                    border: `1px solid ${theme.border}`,
                    padding: '6px 10px',
                    fontSize: '11px',
                    color: theme.text,
                    fontFamily: '"Space Mono", monospace',
                    height: '30px'
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

              <div style={{ width: '120px' }}>
                <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>ENTRY TYPE</label>
                <select
                  value={editTimelineType}
                  onChange={(e) => setEditTimelineType(e.target.value as 'event' | 'lifespan')}
                  style={{
                    width: '100%',
                    background: isMapDarkMode ? '#222' : '#fff',
                    border: `1px solid ${theme.border}`,
                    padding: '6px 10px',
                    fontSize: '11px',
                    color: theme.text,
                    fontFamily: '"Space Mono", monospace',
                    height: '30px'
                  }}
                >
                  <option value="event">Event</option>
                  <option value="lifespan">Lifespan</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>
                  {editTimelineType === 'lifespan' ? 'YEAR OF BIRTH (START) *' : 'YEAR OF OCCURRENCE *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. -1948 or 1350"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  style={{
                    width: '100%',
                    background: isMapDarkMode ? '#222' : '#fff',
                    border: `1px solid ${theme.border}`,
                    padding: '6px 10px',
                    fontSize: '11px',
                    color: theme.text,
                    fontFamily: '"Space Mono", monospace',
                    height: '30px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {editTimelineType === 'lifespan' && (
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>YEAR OF DEATH (END)</label>
                  <input
                    type="text"
                    placeholder="e.g. -1800 or 1410 (optional)"
                    value={editTimelineEnd}
                    onChange={(e) => setEditTimelineEnd(e.target.value)}
                    style={{
                      width: '100%',
                      background: isMapDarkMode ? '#222' : '#fff',
                      border: `1px solid ${theme.border}`,
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: theme.text,
                      fontFamily: '"Space Mono", monospace',
                      height: '30px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Lineage relationships for Lifespans in Edit Form */}
            {editTimelineType === 'lifespan' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: isMapDarkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)', padding: '8px', border: `1px solid ${theme.borderLight}` }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: theme.textDim, letterSpacing: '0.5px' }}>FAMILY TREE LINEAGE (OPTIONAL)</div>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '2px', color: theme.text }}>FATHER</label>
                    <select
                      value={editTimelineFatherId}
                      onChange={(e) => setEditTimelineFatherId(e.target.value)}
                      style={{
                        width: '100%',
                        background: isMapDarkMode ? '#111' : '#fff',
                        border: `1px solid ${theme.border}`,
                        padding: '4px 6px',
                        fontSize: '9px',
                        color: theme.text,
                        fontFamily: '"Space Mono", monospace'
                      }}
                    >
                      <option value="">None</option>
                      {[...combinedTimelineItems]
                        .filter(item => item.type === 'lifespan' && item.id !== sub.id)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(item => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '2px', color: theme.text }}>MOTHER</label>
                    <select
                      value={editTimelineMotherId}
                      onChange={(e) => setEditTimelineMotherId(e.target.value)}
                      style={{
                        width: '100%',
                        background: isMapDarkMode ? '#111' : '#fff',
                        border: `1px solid ${theme.border}`,
                        padding: '4px 6px',
                        fontSize: '9px',
                        color: theme.text,
                        fontFamily: '"Space Mono", monospace'
                      }}
                    >
                      <option value="">None</option>
                      {[...combinedTimelineItems]
                        .filter(item => item.type === 'lifespan' && item.id !== sub.id)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(item => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '2px', color: theme.text }}>SPOUSE</label>
                    <select
                      value={editTimelineSpouseId}
                      onChange={(e) => setEditTimelineSpouseId(e.target.value)}
                      style={{
                        width: '100%',
                        background: isMapDarkMode ? '#111' : '#fff',
                        border: `1px solid ${theme.border}`,
                        padding: '4px 6px',
                        fontSize: '9px',
                        color: theme.text,
                        fontFamily: '"Space Mono", monospace'
                      }}
                    >
                      <option value="">None</option>
                      {[...combinedTimelineItems]
                        .filter(item => item.type === 'lifespan' && item.id !== sub.id)
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
          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>INTELLIGENCE / DESCRIPTION *</label>
          <textarea 
            rows={4}
            value={editDescription} 
            onChange={(e) => setEditDescription(e.target.value)} 
            style={{
              width: '100%', 
              background: isMapDarkMode ? '#222' : '#fff', 
              border: `1px solid ${theme.border}`, 
              color: theme.text, 
              padding: '8px 10px', 
              fontSize: '11px',
              fontFamily: '"Space Mono", monospace',
              lineHeight: '15px'
            }} 
          />
        </div>

        <div>
          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>SOURCE DOCUMENTATION</label>
          <input 
            type="text" 
            value={editSource} 
            onChange={(e) => setEditSource(e.target.value)} 
            style={{
              width: '100%', 
              background: isMapDarkMode ? '#222' : '#fff', 
              border: `1px solid ${theme.border}`, 
              color: theme.text, 
              padding: '6px 10px', 
              fontSize: '11px',
              fontFamily: '"Space Mono", monospace'
            }} 
          />
        </div>

        {/* Media list manager matching user's request to edit imagery/videos */}
        <div style={{ background: isMapDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${theme.border}`, padding: '12px', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '10.5px', fontWeight: 'bold', color: theme.text }}>EDIT IMAGES / VIDEOS ATTACHMENTS</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setEditMediaType('url')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: editMediaType === 'url' ? theme.text : theme.textDim,
                  fontWeight: editMediaType === 'url' ? 'bold' : 'normal',
                  fontSize: '9px',
                  cursor: 'pointer',
                  textDecoration: editMediaType === 'url' ? 'underline' : 'none',
                  fontFamily: '"Space Mono", monospace'
                }}
              >
                LINK URL
              </button>
              <span style={{ fontSize: '9px', color: theme.textDim }}>|</span>
              <button
                type="button"
                onClick={() => setEditMediaType('upload')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: editMediaType === 'upload' ? theme.text : theme.textDim,
                  fontWeight: editMediaType === 'upload' ? 'bold' : 'normal',
                  fontSize: '9px',
                  cursor: 'pointer',
                  textDecoration: editMediaType === 'upload' ? 'underline' : 'none',
                  fontFamily: '"Space Mono", monospace'
                }}
              >
                FILE UPLOAD
              </button>
            </div>
          </div>

          {editMediaType === 'url' ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Paste image/PDF/audio/video URL directly..." 
                value={editMediaInput} 
                onChange={(e) => setEditMediaInput(e.target.value)}
                style={{
                  flex: 1,
                  background: isMapDarkMode ? '#222' : '#fff',
                  border: `1px solid ${theme.border}`,
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: theme.text,
                  fontFamily: '"Space Mono", monospace'
                }}
              />
              <button 
                type="button" 
                onClick={() => {
                  const url = editMediaInput.trim();
                  if (!url) return;
                  setEditMediaList(prev => [...prev, url]);
                  setEditMediaInput('');
                }}
                style={{
                  background: 'transparent',
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  padding: '0 12px',
                  height: '28px',
                  borderRadius: '14px',
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
            <div style={{ border: `1px dashed ${theme.border}`, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
              <input 
                type="file" 
                multiple
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []) as File[];
                  if (files.length === 0) return;

                  setIsEditUploading(true);
                  setModeratorError(null);

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
                    setEditMediaList(prev => [...prev, ...uploadedUrls]);
                  }
                  if (errors.length > 0) {
                    setModeratorError(`Upload error(s): ${errors.join('; ')}`);
                  }

                  setIsEditUploading(false);
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
              <Upload size={16} style={{ marginBottom: '4px' }} />
              <span style={{ fontSize: '9px' }}>
                {isEditUploading ? "UPLOADING FILES..." : "CLICK TO ADD FILE(S)"}
              </span>
            </div>
          )}

          {/* Edit Attachments lists */}
          {editMediaList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: theme.textDim }}>CURRENT ATTACHMENTS ({editMediaList.length})</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {editMediaList.map((url, idx) => {
                  const isFile = url.startsWith('/uploads/');
                  const displayName = isFile ? url.replace('/uploads/', '') : url;
                  return (
                    <div key={idx} style={{ padding: '3px 6px', background: isMapDarkMode ? '#222' : '#eeeeee', border: `1px solid ${theme.border}`, fontSize: '8.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditMediaList(prev => prev.filter((_, i) => i !== idx));
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
        {editDestinations.includes('map') && (
          <>
            {/* Geographic location search matching requirement */}
            <div style={{ background: isMapDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px dashed ${theme.borderLight}`, padding: '10px', borderRadius: '2px' }}>
              <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.text }}>GEOGRAPHIC GEO-SEARCH (AUTO-FILL COORDINATES)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Type place name/address (e.g., Mount Shasta, CA)..."
                  value={editLocationSearch}
                  onChange={(e) => setEditLocationSearch(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      await handleEditSearchGeocode();
                    }
                  }}
                  style={{
                    flex: 1,
                    background: isMapDarkMode ? '#222' : '#fff',
                    border: `1px solid ${theme.border}`,
                    padding: '6px 10px',
                    fontSize: '11px',
                    color: theme.text,
                    fontFamily: '"Space Mono", monospace'
                  }}
                />
                <button
                  type="button"
                  onClick={handleEditSearchGeocode}
                  disabled={isEditGeocoding}
                  style={{
                    background: theme.text,
                    color: theme.bg,
                    border: 'none',
                    padding: '0 12px',
                    height: '28px',
                    borderRadius: '14px',
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
                  {isEditGeocoding ? 'RESOLVING...' : 'RESOLVE'}
                </button>
              </div>
              
              {editGeocodeMsg && (
                <div style={{ fontSize: '9px', color: editGeocodeMsg.type === 'error' ? '#ff3333' : '#00cc00', marginTop: '6px', fontWeight: 'bold' }}>
                  {editGeocodeMsg.text}
                </div>
              )}

              {editGeocodeResults.length > 1 && (
                <div style={{ 
                  marginTop: '8px', 
                  border: `1px solid ${theme.borderLight}`,
                  borderRadius: '2px',
                  background: isMapDarkMode ? '#111' : '#fcfcfc',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  textAlign: 'left'
                }}>
                  <div style={{ padding: '4px 8px', fontSize: '8px', fontWeight: 'bold', color: theme.textDim, borderBottom: `1px solid ${theme.borderLight}`, letterSpacing: '0.5px' }}>
                    SUGGESTED MATCHES (CLICK TO PINPOINT):
                  </div>
                  {editGeocodeResults.map((feat) => {
                    const [lng, lat] = feat.center;
                    return (
                      <div 
                        key={feat.id}
                        onClick={() => {
                          setEditLongitude(lng.toFixed(6));
                          setEditLatitude(lat.toFixed(6));
                          setEditLocationSearch(feat.place_name || feat.text);
                          setEditGeocodeMsg({
                            text: `SELECTED: ${feat.place_name || feat.text} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                            type: 'success'
                          });
                          setEditGeocodeResults([]);
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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ border: `1px dashed ${theme.borderLight}`, padding: '10px', borderRadius: '2px', background: isMapDarkMode ? '#1a1a1a' : '#fcfcfc', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#ffcc00' }}>MAP COORDINATE CALIBRATION</span>
                <button 
                  type="button"
                  onClick={handleUseMapCenterForEdit}
                  style={{
                    background: 'rgba(255,204,0,0.1)',
                    border: '1px solid #ffcc00',
                    color: '#ffcc00',
                    cursor: 'pointer',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    fontFamily: '"Space Mono", monospace'
                  }}
                >
                  USE MAP CENTER COORDS
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: theme.textDim, display: 'block', marginBottom: '2px' }}>LONGITUDE *</span>
                  <input 
                    type="text" 
                    value={editLongitude} 
                    onChange={(e) => setEditLongitude(e.target.value)} 
                    style={{
                      width: '100%', 
                      background: isMapDarkMode ? '#111' : '#fff', 
                      border: `1px solid ${theme.border}`, 
                      color: theme.text, 
                      padding: '4px 8px', 
                      fontSize: '11.5px',
                      fontFamily: '"Space Mono", monospace'
                    }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: theme.textDim, display: 'block', marginBottom: '2px' }}>LATITUDE *</span>
                  <input 
                    type="text" 
                    value={editLatitude} 
                    onChange={(e) => setEditLatitude(e.target.value)} 
                    style={{
                      width: '100%', 
                      background: isMapDarkMode ? '#111' : '#fff', 
                      border: `1px solid ${theme.border}`, 
                      color: theme.text, 
                      padding: '4px 8px', 
                      fontSize: '11.5px',
                      fontFamily: '"Space Mono", monospace'
                    }} 
                  />
                </div>
              </div>
              <span style={{ fontSize: '8px', color: theme.textDim, display: 'block', marginTop: '6px', fontStyle: 'italic', lineHeight: '11px' }}>
                Tip: Close/minimize this desk, find the correct spot on the map, then hit 'USE MAP CENTER COORDS' above to snap it!
              </span>
            </div>
          </>
        )}


        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            disabled={isSavingEdit}
            onClick={() => setEditingSubId(null)}
            style={{
              background: 'transparent',
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '0 18px',
              height: '32px',
              fontSize: '9px',
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            CANCEL
          </button>
          <button
            type="button"
            disabled={isSavingEdit}
            onClick={() => handleSaveSubmissionEdit(sub.id)}
            style={{
              background: '#ffcc00',
              color: '#000000',
              border: '1px solid #ffcc00',
              borderRadius: '16px',
              padding: '0 18px',
              height: '32px',
              fontSize: '9px',
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isSavingEdit ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    );
  };

  const renderPreviewModal = (sub: any) => {
    if (!sub) return null;
    const categoryColor = layerColors[sub.category] || '#b6a6ff';
    const hasImages = sub.images && Array.isArray(sub.images) && sub.images.length > 0;
    const dests = sub.destinations || ['map'];

    return (
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isMapDarkMode ? '#0a0a0a' : '#ffffff',
          color: isMapDarkMode ? '#ffffff' : '#000000',
          zIndex: 500,
          overflowY: 'auto',
          padding: isMobile ? '16px 12px' : '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color={categoryColor} />
            <span style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.2px' }}>
              Intel Dossier Preview
            </span>
          </div>
          <button
            onClick={() => setPreviewSub(null)}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              padding: '4px 12px',
              borderRadius: '14px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: '"Space Mono", monospace'
            }}
          >
            CLOSE PREVIEW
          </button>
        </div>

        {/* Category Pill & Destinations */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              fontSize: '9.5px', 
              fontWeight: 'bold', 
              padding: '2px 8px', 
              backgroundColor: categoryColor, 
              color: '#000000',
              borderRadius: '2px'
            }}
          >
            {sub.category || 'Uncategorized'}
          </span>
          {sub.date ? (
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: theme.textDim }}>
              Year: {sub.date}
            </span>
          ) : null}
          <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
            {dests.map((d: string) => (
              <span key={d} style={{ fontSize: '8.5px', fontWeight: 'bold', border: `1px solid ${theme.borderLight}`, padding: '1px 5px', borderRadius: '2px' }}>
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold', color: theme.text, fontFamily: '"Space Mono", monospace' }}>
          {sub.name || 'Unidentified Intel'}
        </h3>

        {/* Coordinates Banner if available */}
        {sub.coordinates && Array.isArray(sub.coordinates) && sub.coordinates.length === 2 && isValidLngLat(sub.coordinates[0], sub.coordinates[1]) && (
          <div style={{ fontSize: '10px', color: theme.textDim, fontFamily: '"Space Mono", monospace', background: isMapDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', padding: '6px 10px', borderLeft: `2px solid ${categoryColor}` }}>
            Geospatial coords: [{sub.coordinates[1]}, {sub.coordinates[0]}]
          </div>
        )}

        {/* Media Preview Gallery */}
        {hasImages && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: `1px solid ${theme.borderLight}`, padding: '10px', background: isMapDarkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 'bold', color: theme.text, letterSpacing: '0.2px' }}>
              Attached media ({sub.images.length})
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {sub.images.map((imgUrl: string, idx: number) => (
                <div key={idx} style={{ maxWidth: '160px', maxHeight: '120px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
                  {renderMediaPreview(imgUrl)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Text */}
        <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '10px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: theme.textDim }}>
            Dossier intelligence summary:
          </span>
          <p style={{ margin: 0, fontSize: '11.5px', lineHeight: '18px', color: theme.text, whiteSpace: 'pre-line', fontFamily: '"Space Mono", monospace' }}>
            {sub.description || 'No descriptive details provided.'}
          </p>
        </div>

        {/* Source Link */}
        {sub.source && (
          <div style={{ fontSize: '10px', color: theme.textDim, borderTop: `1px dashed ${theme.borderLight}`, paddingTop: '8px' }}>
            Source documentation: <strong style={{ color: theme.text }}>{sub.source}</strong>
          </div>
        )}

        {/* Submitter Attribution */}
        {(sub.submitterName || sub.submitterEmail || sub.submitterLink || sub.socialLink) && (
          <div style={{ fontSize: '10px', color: theme.textDim, borderTop: `1px dashed ${theme.borderLight}`, paddingTop: '8px' }}>
            Submitter / Contributor: <strong style={{ color: theme.text }}>{sub.submitterName || 'Anonymous'}</strong>
            {sub.submitterEmail && <> | <a href={`mailto:${sub.submitterEmail}`} style={{ color: '#b6a6ff', textDecoration: 'underline' }}>{sub.submitterEmail}</a></>}
            {(sub.submitterLink || sub.socialLink) && <> | <a href={sub.submitterLink || sub.socialLink} target="_blank" rel="noopener noreferrer" style={{ color: '#b6a6ff', textDecoration: 'underline' }}>{sub.submitterLink || sub.socialLink}</a></>}
          </div>
        )}

        {/* Bottom Action Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${theme.border}` }}>
          {sub.coordinates && Array.isArray(sub.coordinates) && sub.coordinates.length === 2 && isValidLngLat(sub.coordinates[0], sub.coordinates[1]) && (
            <button
              onClick={() => {
                setPreviewSub(null);
                handlePreviewIntel(sub);
              }}
              style={{
                flex: isMobile ? '1 1 100%' : '1',
                background: isMapDarkMode ? '#ffffff' : '#000000',
                color: isMapDarkMode ? '#000000' : '#ffffff',
                border: 'none',
                height: '36px',
                borderRadius: '18px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: '"Space Mono", monospace',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Eye size={14} />
              FLY TO & INSPECT LIVE ON MAP
            </button>
          )}

          {sub.status === 'pending' && (
            <button
              onClick={async () => {
                setPreviewSub(null);
                await handleApproveSubmission(sub.id, sub);
              }}
              style={{
                flex: isMobile ? '1 1 calc(50% - 4px)' : 'none',
                background: '#00cc00',
                color: '#ffffff',
                border: 'none',
                padding: '0 16px',
                height: '36px',
                borderRadius: '18px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: '"Space Mono", monospace',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle size={14} />
              APPROVE INTEL
            </button>
          )}

          <button
            onClick={() => {
              setPreviewSub(null);
              handleStartEdit(sub);
            }}
            style={{
              flex: isMobile ? '1 1 calc(50% - 4px)' : 'none',
              background: 'transparent',
              color: theme.text,
              border: `1px solid ${theme.border}`,
              padding: '0 16px',
              height: '36px',
              borderRadius: '18px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: '"Space Mono", monospace',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Edit3 size={14} />
            EDIT INTEL
          </button>
        </div>
      </div>
    );
  };

  const handleSaveReportEdit = async (report: any) => {
    setIsSavingEdit(true);
    setModeratorError(null);
    try {
      const isSubmission = approvedSubmissions.some(s => String(s.id) === String(report.pointId)) ||
                           pendingSubmissions.some(s => String(s.id) === String(report.pointId));

      const hasCoords = editLongitude.trim() !== '' || editLatitude.trim() !== '';
      let coordinatesValue: any = null;
      if (hasCoords) {
        const lngNum = parseFloat(editLongitude);
        const latNum = parseFloat(editLatitude);
        if (isNaN(lngNum) || isNaN(latNum)) {
          throw new Error("Invalid Longitude/Latitude coordinates format.");
        }
        if (!isValidLngLat(lngNum, latNum)) {
          throw new Error("Coordinates must be within standard bounds (Latitude: -90 to 90, Longitude: -180 to 180).");
        }
        coordinatesValue = [lngNum, latNum];
      }

      if (isSubmission) {
        const updatedFields = {
          name: editName.trim(),
          category: editCategory,
          description: editDescription.trim(),
          date: editDate,
          source: editSource.trim(),
          coordinates: coordinatesValue,
          codexParentId: editCodexParentId,
          timelineLayer: editTimelineLayer,
          timelineType: editTimelineType,
          timelineEnd: editTimelineEnd.trim(),
          timelineFatherId: editTimelineFatherId,
          timelineMotherId: editTimelineMotherId,
          timelineSpouseId: editTimelineSpouseId
        };
        const authParams = await getModeratorHeadersAndBody({ docId: report.pointId, updatedData: updatedFields });
        const response = await fetch('/api/moderate/update', {
          method: 'POST',
          headers: authParams.headers,
          body: authParams.body
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Server status ${response.status}`);
        }
        try {
          await updateDoc(doc(db, 'submissions', report.pointId), updatedFields);
        } catch (fbErr) {
          console.warn("Direct Firestore update failed:", fbErr);
        }
      } else {
        const updatedFields: any = {
          name: editName.trim(),
          description: editDescription.trim(),
          category: editCategory,
          source: editSource.trim(),
          coordinates: coordinatesValue,
          parentId: editCodexParentId,
          timelineId: editTimelineId,
          mapFeatureId: editMapFeatureId
        };
        
        Object.keys(updatedFields).forEach(key => {
          if (updatedFields[key] === undefined || updatedFields[key] === '') {
            delete updatedFields[key];
          }
        });

        const authParams = await getModeratorHeadersAndBody({ overrideId: report.pointId, updatedData: updatedFields });
        const response = await fetch('/api/moderate/save-override', {
          method: 'POST',
          headers: authParams.headers,
          body: authParams.body
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Server status ${response.status}`);
        }
        try {
          await setDoc(doc(db, 'overrides', report.pointId), updatedFields);
        } catch (fbErr) {
          console.warn("Direct Firestore override set failed:", fbErr);
        }
        
        setOverrides(prev => ({
          ...prev,
          [report.pointId]: updatedFields
        }));
      }

      await handleReportAction(report.id, 'resolve');

      setEditingReportId(null);
      setModeratorReloadTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error("Failed to save report edit:", err);
      setModeratorError(`Edit Failed: ${err.message || 'Unknown network error'}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const renderReportEditForm = (report: any) => {
    const mapRecord = combinedPointsAndLinesData.find(item => String(item.id) === String(report.pointId));
    const codexRecord = combinedCodexNodes.find(item => String(item.id) === String(report.pointId));
    const isMapItem = !!mapRecord || report.pointCategory !== 'General';
    const isCodexItem = !!codexRecord;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', textAlign: 'left' }}>
        <div>
          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>NAME *</label>
          <input 
            type="text" 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)} 
            style={{
              width: '100%', 
              background: isMapDarkMode ? '#222' : '#fff', 
              border: `1px solid ${theme.border}`, 
              color: theme.text, 
              padding: '6px 10px', 
              fontSize: '11px',
              fontFamily: '"Space Mono", monospace'
            }} 
          />
        </div>

        {isMapItem && (
          <div style={{ display: 'flex', gap: '10px', borderLeft: `2px solid ${theme.borderLight}`, paddingLeft: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>LAYER CATEGORY *</label>
              <select 
                value={editCategory} 
                onChange={(e) => setEditCategory(e.target.value)} 
                style={{
                  width: '100%', 
                  background: isMapDarkMode ? '#222' : '#fff', 
                  border: `1px solid ${theme.border}`, 
                  color: theme.text, 
                  padding: '6px 10px', 
                  fontSize: '11px',
                  fontFamily: '"Space Mono", monospace',
                  height: '30px'
                }}
              >
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} style={{ background: isMapDarkMode ? '#0d0d0d' : '#fff' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>LONGITUDE *</label>
              <input 
                type="text" 
                value={editLongitude} 
                onChange={(e) => setEditLongitude(e.target.value)} 
                style={{
                  width: '100%', 
                  background: isMapDarkMode ? '#222' : '#fff', 
                  border: `1px solid ${theme.border}`, 
                  color: theme.text, 
                  padding: '6px 10px', 
                  fontSize: '11px',
                  fontFamily: '"Space Mono", monospace',
                  height: '30px'
                }} 
              />
            </div>

            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>LATITUDE *</label>
              <input 
                type="text" 
                value={editLatitude} 
                onChange={(e) => setEditLatitude(e.target.value)} 
                style={{
                  width: '100%', 
                  background: isMapDarkMode ? '#222' : '#fff', 
                  border: `1px solid ${theme.border}`, 
                  color: theme.text, 
                  padding: '6px 10px', 
                  fontSize: '11px',
                  fontFamily: '"Space Mono", monospace',
                  height: '30px'
                }} 
              />
            </div>
          </div>
        )}

        {isCodexItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: `2px solid ${theme.borderLight}`, paddingLeft: '10px' }}>
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>PARENT CODEX TERM</label>
              <select
                value={editCodexParentId}
                onChange={(e) => setEditCodexParentId(e.target.value)}
                style={{
                  width: '100%',
                  background: isMapDarkMode ? '#222' : '#fff',
                  border: `1px solid ${theme.border}`,
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: theme.text,
                  fontFamily: '"Space Mono", monospace',
                  height: '30px'
                }}
              >
                <option value="">None (Root Category)</option>
                {[...combinedCodexNodes]
                  .filter(node => node.id !== report.pointId)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(node => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>TIMELINE ID</label>
                <input 
                  type="text" 
                  value={editTimelineId} 
                  onChange={(e) => setEditTimelineId(e.target.value)} 
                  style={{
                    width: '100%', 
                    background: isMapDarkMode ? '#222' : '#fff', 
                    border: `1px solid ${theme.border}`, 
                    color: theme.text, 
                    padding: '6px 10px', 
                    fontSize: '11px',
                    fontFamily: '"Space Mono", monospace'
                  }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>MAP FEATURE ID</label>
                <input 
                  type="text" 
                  value={editMapFeatureId} 
                  onChange={(e) => setEditMapFeatureId(e.target.value)} 
                  style={{
                    width: '100%', 
                    background: isMapDarkMode ? '#222' : '#fff', 
                    border: `1px solid ${theme.border}`, 
                    color: theme.text, 
                    padding: '6px 10px', 
                    fontSize: '11px',
                    fontFamily: '"Space Mono", monospace'
                  }} 
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>DESCRIPTION *</label>
          <textarea 
            rows={4}
            value={editDescription} 
            onChange={(e) => setEditDescription(e.target.value)} 
            style={{
              width: '100%', 
              background: isMapDarkMode ? '#222' : '#fff', 
              border: `1px solid ${theme.border}`, 
              color: theme.text, 
              padding: '8px 10px', 
              fontSize: '11px',
              fontFamily: '"Space Mono", monospace',
              lineHeight: '15px'
            }} 
          />
        </div>

        <div>
          <label style={{ fontSize: '10.5px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>SOURCE DOCUMENTATION</label>
          <input 
            type="text" 
            value={editSource} 
            onChange={(e) => setEditSource(e.target.value)} 
            style={{
              width: '100%', 
              background: isMapDarkMode ? '#222' : '#fff', 
              border: `1px solid ${theme.border}`, 
              color: theme.text, 
              padding: '6px 10px', 
              fontSize: '11px',
              fontFamily: '"Space Mono", monospace'
            }} 
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            disabled={isSavingEdit}
            onClick={() => setEditingReportId(null)}
            style={{
              background: 'transparent',
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '0 18px',
              height: '32px',
              fontSize: '9px',
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            CANCEL
          </button>
          <button
            type="button"
            disabled={isSavingEdit}
            onClick={() => handleSaveReportEdit(report)}
            style={{
              background: '#ffcc00',
              color: '#000000',
              border: '1px solid #ffcc00',
              borderRadius: '16px',
              padding: '0 18px',
              height: '32px',
              fontSize: '9px',
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isSavingEdit ? 'SAVING...' : 'SAVE & RESOLVE'}
          </button>
        </div>
      </div>
    );
  };

  const handleReportAction = async (reportId: string, action: 'resolve' | 'delete') => {
    setSubmittingReportActionId(reportId);
    setModeratorError(null);

    try {
      // 1. Try server endpoint first
      const authParams = await getModeratorHeadersAndBody({ reportId, action });
      const response = await fetch('/api/moderate/report-action', {
        method: 'POST',
        headers: authParams.headers,
        body: authParams.body
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server status ${response.status}`);
      }
    } catch (err: any) {
      console.warn("Server-side report action failed, falling back to direct Firestore:", err);
      try {
        // 2. Try client-side Firestore action
        const reportDocRef = doc(db, 'reports', reportId);
        if (action === 'resolve') {
          await updateDoc(reportDocRef, {
            status: 'resolved'
          });
        } else if (action === 'delete') {
          await deleteDoc(reportDocRef);
        }
      } catch (fallbackErr: any) {
        console.error("Firestore report action failed:", fallbackErr);
        setModeratorError(`Moderation action failed: ${fallbackErr.message || "Check permissions."}`);
      }
    } finally {
      setSubmittingReportActionId(null);
      setModeratorReloadTrigger(prev => prev + 1);
    }
  };

  const renderMediaPreview = (url: string) => {
    if (!url) return null;
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)/i.test(url) || url.startsWith('/uploads/');
    const isYoutube = /youtube\.com|youtu\.be/i.test(url);
    const isDvidshub = /dvidshub\.net\/video\//i.test(url);
    const isMp4 = /\.(mp4|webm|ogg|ogv)/i.test(url);

    if (isYoutube) {
      let embedId = '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        embedId = match[2];
      }
      if (embedId) {
        return (
          <div style={{ position: 'relative', width: '240px', aspectRatio: '16/9', border: `1px solid ${theme.border}`, marginTop: '4px', overflow: 'hidden' }}>
            <iframe
              src={`https://www.youtube.com/embed/${embedId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            />
          </div>
        );
      }
    }

    if (isDvidshub) {
      const embedUrl = getEmbedUrl(url);
      if (embedUrl) {
        return (
          <div style={{ position: 'relative', width: '240px', aspectRatio: '16/9', border: `1px solid ${theme.border}`, marginTop: '4px', overflow: 'hidden' }}>
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            />
          </div>
        );
      }
    }

    if (isMp4) {
      const mimeType = url.toLowerCase().endsWith('.webm') ? 'video/webm' : url.toLowerCase().endsWith('.ogv') ? 'video/ogg' : 'video/mp4';
      return (
        <video 
          controls 
          style={{ maxWidth: '240px', maxHeight: '135px', border: `1px solid ${theme.border}`, marginTop: '4px', borderRadius: '2px' }}
        >
          <source src={url} type={mimeType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isImage) {
      const finalUrl = cleanAndProxyImageUrl(url);
      return (
        <div style={{ marginTop: '4px' }}>
          <img 
            src={finalUrl} 
            alt="Submission Preview" 
            referrerPolicy="no-referrer"
            style={{ maxWidth: '240px', maxHeight: '135px', objectFit: 'contain', border: `1px solid ${theme.border}`, borderRadius: '2px' }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <AnimatePresence>
        {isModeratorOpen && (
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
              display: isModMinimized ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              fontFamily: '"Space Mono", monospace',
              padding: isMobile ? '8px' : '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              style={{
                backgroundColor: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                color: isMapDarkMode ? '#ffffff' : '#000000',
                border: `1.5px solid ${theme.border}`,
                padding: isMobile ? '16px 12px' : '28px',
                width: '100%',
                maxWidth: '860px',
                maxHeight: isMobile ? '94vh' : '85vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isMapDarkMode ? '0 10px 40px rgba(255,255,255,0.05)' : '0 15px 40px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}
            >
              {previewSub && renderPreviewModal(previewSub)}

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: `2.5px solid ${theme.border}`, paddingBottom: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} color={isMapDarkMode ? '#ffcc00' : '#000000'} />
                  <span style={{ fontWeight: 400, fontSize: isMobile ? '13px' : '16px', letterSpacing: '0.2px' }}>MTRH Decisional Moderation Desk</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setIsModeratorOpen(false)} style={{ background: 'transparent', border: 'none', color: theme.text, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              {!isModeratorAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', padding: '36px 0' }}>
                  <ShieldAlert size={48} strokeWidth={1.5} color={isMapDarkMode ? '#ffcc00' : '#000000'} />
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '0.2px' }}>Admin Security Gate</h4>
                    <p style={{ fontSize: '11px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', margin: 0, width: '360px', lineHeight: '18px' }}>Authenticating under the owner account jhuffman710@gmail.com grants full write authority over map submissions.</p>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        setModeratorError(null);
                        await signInWithPopup(auth, new GoogleAuthProvider());
                      } catch (err: any) {
                        console.error("Popup sign-in error:", err);
                        setModeratorError(`Google login fail: ${err.message || err}`);
                      }
                    }}
                    style={{
                      background: isMapDarkMode ? '#ffffff' : '#000000',
                      color: isMapDarkMode ? '#000000' : '#ffffff',
                      border: `1px solid ${theme.border}`,
                      padding: '0 16px',
                      height: '32px',
                      borderRadius: '16px',
                      fontSize: '9px',
                      fontFamily: '"Space Mono", monospace',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    SIGN IN WITH GOOGLE
                  </button>

                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0', maxWidth: '300px' }}>
                    <div style={{ flex: 1, height: '1px', background: theme.borderLight }} />
                    <span style={{ fontSize: '10px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: 'bold' }}>Or Secret Passcode Bypass</span>
                    <div style={{ flex: 1, height: '1px', background: theme.borderLight }} />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '300px' }}>
                    <input
                      type="password"
                      placeholder="Enter secret codename..."
                      value={moderatorPasscode}
                      onChange={(e) => setModeratorPasscode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleBypassAuth();
                        }
                      }}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: `1px solid ${theme.border}`,
                        padding: '6px 12px',
                        height: '32px',
                        fontSize: '9px',
                        color: theme.text,
                        fontFamily: '"Space Mono", monospace',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      onClick={() => {
                        handleBypassAuth();
                      }}
                      style={{
                        background: 'transparent',
                        color: theme.text,
                        border: `1px solid ${theme.border}`,
                        padding: '0 16px',
                        height: '32px',
                        borderRadius: '16px',
                        fontSize: '9px',
                        fontFamily: '"Space Mono", monospace',
                        cursor: 'pointer',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box'
                      }}
                    >
                      BYPASS
                    </button>
                  </div>

                  {moderatorError && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', maxWidth: '420px', marginTop: '4px' }}>
                      <span style={{ fontSize: '9px', color: '#ff3333', textAlign: 'center', fontWeight: 'bold' }}>{moderatorError}</span>
                      {moderatorError.includes('auth/unauthorized-domain') && (
                        <div style={{ 
                          background: isMapDarkMode ? 'rgba(255, 204, 0, 0.05)' : '#fff9e6', 
                          border: `1.5px solid ${isMapDarkMode ? '#ffcc00' : '#000000'}`, 
                          padding: '12px 16px', 
                          borderRadius: '4px', 
                          fontSize: '10px', 
                          lineHeight: '16px', 
                          color: '#000000', 
                          textAlign: 'left' 
                        }}>
                          <strong>SANDBOX DOMAIN AUTH REQUIREMENT:</strong> 
                          <br />
                          The current preview hostname (<code>{window.location.hostname}</code>) needs to be authorized under Firebase Auth Authorized Domains list.
                          <br /><br />
                          <strong>IMMEDIATE BYPASS:</strong> 
                          <br />
                          Simply type the secret administrative passcode in the box above and click <strong>BYPASS</strong>. This will authenticate you locally using our secure server-side administrative bypass and load the submissions list instantly!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: isMapDarkMode ? '#141414' : '#f8f8f8', padding: '10px 16px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffcc00', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, wordBreak: 'break-word' }}>
                        Active Mod Desk Session: {currentUser?.email || "Local Bypass Override Profile"}
                      </span>
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          await signOut(auth);
                          setIsModeratorAuthenticated(false);
                        } catch (err) {
                          setIsModeratorAuthenticated(false);
                        }
                      }}
                      style={{
                        background: 'transparent',
                        color: '#ff4d4d',
                        border: 'none',
                        fontSize: '9px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        fontFamily: '"Space Mono", monospace'
                      }}
                    >
                      TERM SESSION
                    </button>
                  </div>

                  {moderatorError && (
                    <div style={{ color: '#ff3333', fontSize: '9px', fontWeight: 'bold', border: '1px solid #ff3333', padding: '8px', background: 'rgba(255,0,0,0.02)' }}>
                      {moderatorError}
                    </div>
                  )}

                  <div 
                    className="no-scrollbar"
                    style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      borderBottom: `1px solid ${theme.borderLight}`, 
                      gap: '6px', 
                      marginBottom: '12px',
                      width: '100%',
                      paddingBottom: '2px'
                    }}
                  >
                    <button
                      onClick={() => setActiveModTab('pending')}
                      style={{
                        padding: '8px 14px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        fontFamily: '"Space Mono", monospace',
                        background: activeModTab === 'pending' ? (isMapDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
                        color: activeModTab === 'pending' ? (isMapDarkMode ? '#ffcc00' : '#000000') : (isMapDarkMode ? '#999999' : '#666666'),
                        border: 'none',
                        borderBottom: activeModTab === 'pending' ? (isMapDarkMode ? '2.5px solid #ffcc00' : '2.5px solid #000000') : '2.5px solid transparent',
                        cursor: 'pointer',
                        letterSpacing: '0.5px',
                        flexShrink: 0
                      }}
                    >
                      PENDING REVIEW ({pendingSubmissions.length})
                    </button>
                    <button
                      onClick={() => setActiveModTab('approved')}
                      style={{
                        padding: '8px 14px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        fontFamily: '"Space Mono", monospace',
                        background: activeModTab === 'approved' ? (isMapDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
                        color: activeModTab === 'approved' ? (isMapDarkMode ? '#ffcc00' : '#000000') : (isMapDarkMode ? '#999999' : '#666666'),
                        border: 'none',
                        borderBottom: activeModTab === 'approved' ? (isMapDarkMode ? '2.5px solid #ffcc00' : '2.5px solid #000000') : '2.5px solid transparent',
                        cursor: 'pointer',
                        letterSpacing: '0.5px',
                        flexShrink: 0
                      }}
                    >
                      APPROVED INTEL AUDIT ({approvedSubmissions.length})
                    </button>
                    <button
                      onClick={() => setActiveModTab('reports')}
                      style={{
                        padding: '8px 14px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        fontFamily: '"Space Mono", monospace',
                        background: activeModTab === 'reports' ? (isMapDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
                        color: activeModTab === 'reports' ? (isMapDarkMode ? '#ffcc00' : '#000000') : (isMapDarkMode ? '#999999' : '#666666'),
                        border: 'none',
                        borderBottom: activeModTab === 'reports' ? (isMapDarkMode ? '2.5px solid #ffcc00' : '2.5px solid #000000') : '2.5px solid transparent',
                        cursor: 'pointer',
                        letterSpacing: '0.5px',
                        flexShrink: 0
                      }}
                    >
                      INACCURACY REPORTS ({reports.filter(r => r.status === 'pending').length})
                    </button>
                    <button
                      onClick={() => setActiveModTab('cartography')}
                      style={{
                        padding: '8px 14px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        fontFamily: '"Space Mono", monospace',
                        background: activeModTab === 'cartography' ? (isMapDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
                        color: activeModTab === 'cartography' ? (isMapDarkMode ? '#ffcc00' : '#000000') : (isMapDarkMode ? '#999999' : '#666666'),
                        border: 'none',
                        borderBottom: activeModTab === 'cartography' ? (isMapDarkMode ? '2.5px solid #ffcc00' : '2.5px solid #000000') : '2.5px solid transparent',
                        cursor: 'pointer',
                        letterSpacing: '0.5px',
                        flexShrink: 0
                      }}
                    >
                      CARTOGRAPHY PINS ({modCartographyPoints.length})
                    </button>
                  </div>

                  {activeModTab === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <span style={{ fontSize: '12.5px', color: isMapDarkMode ? theme.text : '#000000', fontWeight: 700, letterSpacing: '0.2px' }}>
                        Submissions pending formal declassification approval:
                      </span>

                      {pendingSubmissions.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', border: `1px dashed ${theme.borderLight}`, color: isMapDarkMode ? theme.textDim : '#000000', fontSize: '11px', fontWeight: 'bold' }}>
                          No unapproved user submissions at this time. Signals clear.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
                          {pendingSubmissions.map((sub) => (
                            <div 
                              key={sub.id} 
                              style={{ 
                                border: `1.5px solid ${theme.border}`, 
                                padding: '16px', 
                                backgroundColor: isMapDarkMode ? '#111111' : '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: isMapDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                              }}
                            >
                              {editingSubId === sub.id ? (
                                renderEditForm(sub)
                              ) : (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                      <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: theme.text }}>{sub.name}</h5>
                                      <div style={{ display: 'flex', gap: '12px', fontSize: '9.5px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {(!sub.destinations || sub.destinations.includes('map')) && (
                                          <>
                                            <span>Layer: <strong style={{ color: isMapDarkMode ? '#ffffff' : '#000000', textDecoration: isMapDarkMode ? 'none' : 'underline' }}>{sub.category}</strong></span>
                                            <span>Coords: <strong style={{ color: isMapDarkMode ? '#ffffff' : '#000000' }}>[{sub.coordinates?.[1]}, {sub.coordinates?.[0]}]</strong></span>
                                          </>
                                        )}
                                        {sub.date && <span>Year: <strong style={{ color: isMapDarkMode ? '#ffffff' : '#000000' }}>{sub.date}</strong></span>}
                                      </div>

                                      {/* Destinations & Parenting Parameters */}
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                        {(sub.destinations || ['map']).map((dest: string) => (
                                          <span 
                                            key={dest} 
                                            style={{ 
                                              fontSize: '8px', 
                                              fontWeight: 'bold', 
                                              padding: '1px 5px', 
                                              background: isMapDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)', 
                                              color: theme.text,
                                              border: `1px solid ${theme.borderLight}`,
                                              borderRadius: '2px',
                                              textTransform: 'none'
                                            }}
                                          >
                                            {dest}
                                          </span>
                                        ))}
                                      </div>

                                      {/* Codex Parent metadata */}
                                      {sub.destinations?.includes('codex') && (
                                        <div style={{ fontSize: '9px', color: theme.textDim, marginTop: '4px' }}>
                                          Codex parent: <strong style={{ color: theme.text }}>{combinedCodexNodes.find(n => n.id === sub.codexParentId)?.name || 'Root Category'}</strong>
                                        </div>
                                      )}

                                      {/* Timeline configuration metadata */}
                                      {sub.destinations?.includes('timeline') && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                                          <div style={{ fontSize: '9px', color: theme.textDim }}>
                                            Timeline era: <strong style={{ color: theme.text }}>{sub.timelineLayer}</strong> | Type: <strong style={{ color: theme.text }}>{sub.timelineType}</strong>
                                            {sub.timelineType === 'lifespan' && sub.timelineEnd && (
                                              <> | Death year: <strong style={{ color: theme.text }}>{sub.timelineEnd}</strong></>
                                            )}
                                          </div>
                                          {sub.timelineType === 'lifespan' && (sub.timelineFatherId || sub.timelineMotherId || sub.timelineSpouseId) && (
                                            <div style={{ fontSize: '9px', color: theme.textDim }}>
                                              {sub.timelineFatherId && <>Father: <strong style={{ color: theme.text }}>{combinedTimelineItems.find(t => t.id === sub.timelineFatherId)?.name || sub.timelineFatherId}</strong> </>}
                                              {sub.timelineMotherId && <>Mother: <strong style={{ color: theme.text }}>{combinedTimelineItems.find(t => t.id === sub.timelineMotherId)?.name || sub.timelineMotherId}</strong> </>}
                                              {sub.timelineSpouseId && <>Spouse: <strong style={{ color: theme.text }}>{combinedTimelineItems.find(t => t.id === sub.timelineSpouseId)?.name || sub.timelineSpouseId}</strong> </>}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <span style={{ padding: '2px 6px', background: isMapDarkMode ? '#ffa500' : '#000000', color: isMapDarkMode ? '#000000' : '#ffffff', fontSize: '8.5px', fontWeight: 'bold', borderRadius: '1.5px' }}>Pending</span>
                                  </div>

                                  <p style={{ margin: 0, fontSize: '11px', lineHeight: '16px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', whiteSpace: 'pre-line' }}>
                                    {sub.description}
                                  </p>

                                  {sub.source && (
                                    <div style={{ fontSize: '9.5px', color: isMapDarkMode ? theme.textDim : '#000000', fontStyle: 'italic' }}>
                                      Source: <strong>{sub.source}</strong>
                                    </div>
                                  )}

                                  {(sub.submitterName || sub.submitterEmail || sub.submitterLink || sub.socialLink) && (
                                    <div style={{ fontSize: '9.5px', color: isMapDarkMode ? theme.textDim : '#000000', borderTop: `1px dashed ${theme.borderLight}`, paddingTop: '4px', marginTop: '4px' }}>
                                      Submitter / Contributor: <strong style={{ color: theme.text }}>{sub.submitterName || 'Anonymous'}</strong>
                                      {sub.submitterEmail && <> | <a href={`mailto:${sub.submitterEmail}`} style={{ color: '#b6a6ff', textDecoration: 'underline' }}>{sub.submitterEmail}</a></>}
                                      {(sub.submitterLink || sub.socialLink) && <> | <a href={sub.submitterLink || sub.socialLink} target="_blank" rel="noopener noreferrer" style={{ color: '#b6a6ff', textDecoration: 'underline' }}>{sub.submitterLink || sub.socialLink}</a></>}
                                    </div>
                                  )}

                                  {sub.images && sub.images.length > 0 && (
                                    <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '10px' }}>
                                      <span style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: isMapDarkMode ? theme.text : '#000000' }}>Attachments detected:</span>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                        {sub.images.map((imgUrl: string, index: number) => {
                                          const isFile = imgUrl.startsWith('/uploads/');
                                          const imgName = isFile ? imgUrl.replace('/uploads/', '') : imgUrl;
                                          return (
                                            <a 
                                              key={index}
                                              href={imgUrl} 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              style={{ 
                                                padding: '3px 8px', 
                                                background: isMapDarkMode ? '#222' : '#eee', 
                                                border: `1px solid ${theme.border}`, 
                                                fontSize: '9px', 
                                                color: theme.text,
                                                textDecoration: 'none'
                                              }}
                                            >
                                              [Link {index+1}: {imgName.slice(0, 30)}...]
                                            </a>
                                          );
                                        })}
                                      </div>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                                        {sub.images.map((imgUrl: string, index: number) => (
                                          <div key={index}>
                                            {renderMediaPreview(imgUrl)}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '8px', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '12px', marginTop: '4px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                                      {sub.coordinates && Array.isArray(sub.coordinates) && sub.coordinates.length === 2 && isValidLngLat(sub.coordinates[0], sub.coordinates[1]) && (
                                        <button
                                          onClick={() => setPreviewSub(sub)}
                                          style={{
                                            background: 'transparent',
                                            color: theme.text,
                                            border: `1px solid ${theme.border}`,
                                            borderRadius: '16px',
                                            padding: '0 16px',
                                            height: '32px',
                                            fontSize: '9px',
                                            fontFamily: '"Space Mono", monospace',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            boxSizing: 'border-box',
                                            flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                          }}
                                        >
                                          <Eye size={12} />
                                          PREVIEW
                                        </button>
                                      )}

                                      <button
                                        onClick={() => handleStartEdit(sub)}
                                        style={{
                                          background: 'transparent',
                                          color: theme.text,
                                          border: `1px solid ${theme.border}`,
                                          borderRadius: '16px',
                                          padding: '0 16px',
                                          height: '32px',
                                          fontSize: '9px',
                                          fontFamily: '"Space Mono", monospace',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxSizing: 'border-box',
                                          flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                        }}
                                      >
                                        EDIT INTEL
                                      </button>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                                      <button
                                        disabled={submittingApprovalId !== null || submittingRejectionId !== null}
                                        onClick={async () => {
                                          setSubmittingRejectionId(sub.id);
                                          setModeratorError(null);
                                          try {
                                            const authParams = await getModeratorHeadersAndBody({ docId: sub.id });
                                            const response = await fetch('/api/moderate/reject', {
                                              method: 'POST',
                                              headers: authParams.headers,
                                              body: authParams.body
                                            });
                                            if (!response.ok) {
                                              const errData = await response.json();
                                              throw new Error(errData.error || `Server status ${response.status}`);
                                            }
                                          } catch (err: any) {
                                            console.warn("Server-side rejection failed, falling back to direct Firestore delete:", err);
                                            try {
                                              await deleteDoc(doc(db, 'submissions', sub.id));
                                            } catch (fallbackErr: any) {
                                              console.error("Firestore rejection fallback error:", fallbackErr);
                                              setModeratorError(`Moderation Failed: ${fallbackErr.message || "Ensure you are authorized or signed in."}`);
                                            }
                                          } finally {
                                            setSubmittingRejectionId(null);
                                            setModeratorReloadTrigger(prev => prev + 1);
                                          }
                                        }}
                                        style={{
                                          background: 'transparent',
                                          color: isMapDarkMode ? '#ff3333' : '#d32f2f',
                                          border: isMapDarkMode ? '1px solid #ff3333' : '1.5px solid #d32f2f',
                                          padding: '0 16px',
                                          height: '32px',
                                          borderRadius: '16px',
                                          fontSize: '9px',
                                          fontFamily: '"Space Mono", monospace',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxSizing: 'border-box',
                                          flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                        }}
                                      >
                                        {submittingRejectionId === sub.id ? "REJECTING..." : "REJECT / DELETE"}
                                      </button>
                                      <button
                                        disabled={submittingApprovalId !== null || submittingRejectionId !== null}
                                        onClick={async () => {
                                          setSubmittingApprovalId(sub.id);
                                          setModeratorError(null);
                                          try {
                                            const authParams = await getModeratorHeadersAndBody({ docId: sub.id });
                                            const response = await fetch('/api/moderate/approve', {
                                              method: 'POST',
                                              headers: authParams.headers,
                                              body: authParams.body
                                            });
                                            if (!response.ok) {
                                              const errData = await response.json();
                                              throw new Error(errData.error || `Server status ${response.status}`);
                                            }
                                          } catch (err: any) {
                                            console.warn("Server-side approval failed, falling back to direct Firestore update:", err);
                                            try {
                                              await updateDoc(doc(db, 'submissions', sub.id), {
                                                status: 'approved'
                                              });
                                            } catch (fallbackErr: any) {
                                              console.error("Firestore approval fallback error:", fallbackErr);
                                              setModeratorError(`Moderation Failed: ${fallbackErr.message || "Ensure you are authorized or signed in."}`);
                                            }
                                          } finally {
                                            setSubmittingApprovalId(null);
                                            setModeratorReloadTrigger(prev => prev + 1);
                                          }
                                        }}
                                        style={{
                                          background: isMapDarkMode ? '#00cc00' : '#000000',
                                          color: isMapDarkMode ? '#000000' : '#ffffff',
                                          border: `1.5px solid ${isMapDarkMode ? '#00cc00' : '#000000'}`,
                                          padding: '0 16px',
                                          height: '32px',
                                          borderRadius: '16px',
                                          fontSize: '9px',
                                          fontFamily: '"Space Mono", monospace',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxSizing: 'border-box',
                                          flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                        }}
                                      >
                                        {submittingApprovalId === sub.id ? "APPROVING..." : "APPROVE ENTRY"}
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeModTab === 'approved' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <span style={{ fontSize: '12.5px', color: isMapDarkMode ? theme.text : '#000000', fontWeight: 700, letterSpacing: '0.2px' }}>
                        Approved intel audit log (revoke intel back to pending screen or purge wrong entries):
                      </span>

                      {approvedSubmissions.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', border: `1px dashed ${theme.borderLight}`, color: isMapDarkMode ? theme.textDim : '#000000', fontSize: '11px', fontWeight: 'bold' }}>
                          No registered approved user intel discovered in current cloud index.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
                          {approvedSubmissions.map((sub) => (
                            <div 
                              key={sub.id} 
                              style={{ 
                                border: `1.5px solid ${theme.border}`, 
                                padding: '16px', 
                                backgroundColor: isMapDarkMode ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: isMapDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                              }}
                            >
                              {editingSubId === sub.id ? (
                                renderEditForm(sub)
                              ) : (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                      <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: theme.text }}>{sub.name}</h5>
                                      <div style={{ display: 'flex', gap: '12px', fontSize: '9.5px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {(!sub.destinations || sub.destinations.includes('map')) && (
                                          <>
                                            <span>Layer: <strong style={{ color: isMapDarkMode ? (layerColors[sub.category] || '#b6a6ff') : '#000000', textDecoration: isMapDarkMode ? 'none' : 'underline' }}>{sub.category}</strong></span>
                                            <span>Coords: <strong>[{sub.coordinates?.[1]}, {sub.coordinates?.[0]}]</strong></span>
                                          </>
                                        )}
                                        {sub.date ? <span>Year: <strong>{sub.date}</strong></span> : null}
                                      </div>

                                      {/* Destinations & Parenting Parameters */}
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                        {(sub.destinations || ['map']).map((dest: string) => (
                                          <span 
                                            key={dest} 
                                            style={{ 
                                              fontSize: '8px', 
                                              fontWeight: 'bold', 
                                              padding: '1px 5px', 
                                              background: isMapDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)', 
                                              color: theme.text,
                                              border: `1px solid ${theme.borderLight}`,
                                              borderRadius: '2px',
                                              textTransform: 'none'
                                            }}
                                          >
                                            {dest}
                                          </span>
                                        ))}
                                      </div>

                                      {/* Codex Parent metadata */}
                                      {sub.destinations?.includes('codex') && (
                                        <div style={{ fontSize: '9px', color: theme.textDim, marginTop: '4px' }}>
                                          Codex parent: <strong style={{ color: theme.text }}>{combinedCodexNodes.find(n => n.id === sub.codexParentId)?.name || 'Root Category'}</strong>
                                        </div>
                                      )}

                                      {/* Timeline configuration metadata */}
                                      {sub.destinations?.includes('timeline') && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                                          <div style={{ fontSize: '9px', color: theme.textDim }}>
                                            Timeline era: <strong style={{ color: theme.text }}>{sub.timelineLayer}</strong> | Type: <strong style={{ color: theme.text }}>{sub.timelineType}</strong>
                                            {sub.timelineType === 'lifespan' && sub.timelineEnd && (
                                              <> | Death year: <strong style={{ color: theme.text }}>{sub.timelineEnd}</strong></>
                                            )}
                                          </div>
                                          {sub.timelineType === 'lifespan' && (sub.timelineFatherId || sub.timelineMotherId || sub.timelineSpouseId) && (
                                            <div style={{ fontSize: '9px', color: theme.textDim }}>
                                              {sub.timelineFatherId && <>Father: <strong style={{ color: theme.text }}>{combinedTimelineItems.find(t => t.id === sub.timelineFatherId)?.name || sub.timelineFatherId}</strong> </>}
                                              {sub.timelineMotherId && <>Mother: <strong style={{ color: theme.text }}>{combinedTimelineItems.find(t => t.id === sub.timelineMotherId)?.name || sub.timelineMotherId}</strong> </>}
                                              {sub.timelineSpouseId && <>Spouse: <strong style={{ color: theme.text }}>{combinedTimelineItems.find(t => t.id === sub.timelineSpouseId)?.name || sub.timelineSpouseId}</strong> </>}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <span style={{ padding: '2px 6px', background: isMapDarkMode ? 'rgba(0, 204, 0, 0.1)' : '#000000', border: isMapDarkMode ? '1px solid #00cc00' : '1px solid #000000', color: isMapDarkMode ? '#00cc00' : '#ffffff', fontSize: '8.5px', fontWeight: 'bold', borderRadius: '1.5px' }}>Approved</span>
                                  </div>

                                  <p style={{ margin: 0, fontSize: '11px', lineHeight: '16px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', whiteSpace: 'pre-line' }}>
                                    {sub.description}
                                  </p>

                                  {sub.source && (
                                    <div style={{ fontSize: '9.5px', color: isMapDarkMode ? theme.textDim : '#000000', fontStyle: 'italic' }}>
                                      Source: <strong>{sub.source}</strong>
                                    </div>
                                  )}

                                  {(sub.submitterName || sub.submitterEmail || sub.submitterLink || sub.socialLink) && (
                                    <div style={{ fontSize: '9.5px', color: isMapDarkMode ? theme.textDim : '#000000', borderTop: `1px dashed ${theme.borderLight}`, paddingTop: '4px', marginTop: '4px' }}>
                                      Submitter / Contributor: <strong style={{ color: theme.text }}>{sub.submitterName || 'Anonymous'}</strong>
                                      {sub.submitterEmail && <> | <a href={`mailto:${sub.submitterEmail}`} style={{ color: '#b6a6ff', textDecoration: 'underline' }}>{sub.submitterEmail}</a></>}
                                      {(sub.submitterLink || sub.socialLink) && <> | <a href={sub.submitterLink || sub.socialLink} target="_blank" rel="noopener noreferrer" style={{ color: '#b6a6ff', textDecoration: 'underline' }}>{sub.submitterLink || sub.socialLink}</a></>}
                                    </div>
                                  )}

                                  {sub.images && sub.images.length > 0 && (
                                    <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '10px' }}>
                                      <span style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: isMapDarkMode ? theme.text : '#000000' }}>Attachments detected:</span>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                        {sub.images.map((imgUrl: string, index: number) => {
                                          const isFile = imgUrl.startsWith('/uploads/');
                                          const imgName = isFile ? imgUrl.replace('/uploads/', '') : imgUrl;
                                          return (
                                            <a 
                                              key={index}
                                              href={imgUrl} 
                                              target="_blank"  
                                              rel="noopener noreferrer" 
                                              style={{ 
                                                padding: '3px 8px', 
                                                background: isMapDarkMode ? '#222' : '#eee', 
                                                border: `1px solid ${theme.border}`, 
                                                fontSize: '9px', 
                                                color: theme.text,
                                                textDecoration: 'none'
                                              }}
                                            >
                                              [Link {index+1}: {imgName.slice(0, 30)}...]
                                            </a>
                                          );
                                        })}
                                      </div>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                                        {sub.images.map((imgUrl: string, index: number) => (
                                          <div key={index}>
                                            {renderMediaPreview(imgUrl)}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '8px', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '12px', marginTop: '4px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                                      {sub.coordinates && Array.isArray(sub.coordinates) && sub.coordinates.length === 2 && isValidLngLat(sub.coordinates[0], sub.coordinates[1]) && (
                                        <button
                                          onClick={() => setPreviewSub(sub)}
                                          style={{
                                            background: 'transparent',
                                            color: theme.text,
                                            border: `1px solid ${theme.border}`,
                                            borderRadius: '16px',
                                            padding: '0 16px',
                                            height: '32px',
                                            fontSize: '9px',
                                            fontFamily: '"Space Mono", monospace',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            boxSizing: 'border-box',
                                            flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                          }}
                                        >
                                          <Eye size={12} />
                                          PREVIEW
                                        </button>
                                      )}

                                      <button
                                        onClick={() => handleStartEdit(sub)}
                                        style={{
                                          background: 'transparent',
                                          color: theme.text,
                                          border: `1px solid ${theme.border}`,
                                          borderRadius: '16px',
                                          padding: '0 16px',
                                          height: '32px',
                                          fontSize: '9px',
                                          fontFamily: '"Space Mono", monospace',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxSizing: 'border-box',
                                          flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                        }}
                                      >
                                        EDIT INTEL
                                      </button>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                                      <button
                                        disabled={submittingRevocationId !== null || submittingRejectionId !== null}
                                        onClick={async () => {
                                          setSubmittingRevocationId(sub.id);
                                          setModeratorError(null);
                                          try {
                                            const authParams = await getModeratorHeadersAndBody({ docId: sub.id });
                                            const response = await fetch('/api/moderate/revoke', {
                                              method: 'POST',
                                              headers: authParams.headers,
                                              body: authParams.body
                                            });
                                            if (!response.ok) {
                                              const errData = await response.json();
                                              throw new Error(errData.error || `Server status ${response.status}`);
                                            }
                                          } catch (err: any) {
                                            console.warn("Server-side revocation failed, trying direct Firestore fallback update:", err);
                                            try {
                                              await updateDoc(doc(db, 'submissions', sub.id), {
                                                status: 'pending'
                                              });
                                            } catch (fallbackErr: any) {
                                              console.error("Firestore revocation fallback error:", fallbackErr);
                                              setModeratorError(`Moderation Failed: ${fallbackErr.message || "Ensure you are authorized or signed in."}`);
                                            }
                                          } finally {
                                            setSubmittingRevocationId(null);
                                            setModeratorReloadTrigger(prev => prev + 1);
                                          }
                                        }}
                                        style={{
                                          background: 'transparent',
                                          color: isMapDarkMode ? '#ffa500' : '#000000',
                                          border: isMapDarkMode ? '1px solid #ffa500' : '1.5px solid #000000',
                                          padding: '0 16px',
                                          height: '32px',
                                          borderRadius: '16px',
                                          fontSize: '9px',
                                          fontFamily: '"Space Mono", monospace',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxSizing: 'border-box',
                                          flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                        }}
                                      >
                                        {submittingRevocationId === sub.id ? "REVOKING..." : "REVOKE TO REVIEW"}
                                      </button>
                                      <button
                                        disabled={submittingRevocationId !== null || submittingRejectionId !== null}
                                        onClick={async () => {
                                          const confirmed = window.confirm("Are you sure you want to permanently delete this approved submission?");
                                          if (!confirmed) return;
                                          setSubmittingRejectionId(sub.id);
                                          setModeratorError(null);
                                          try {
                                            const authParams = await getModeratorHeadersAndBody({ docId: sub.id });
                                            const response = await fetch('/api/moderate/reject', {
                                              method: 'POST',
                                              headers: authParams.headers,
                                              body: authParams.body
                                            });
                                            if (!response.ok) {
                                              const errData = await response.json();
                                              throw new Error(errData.error || `Server status ${response.status}`);
                                            }
                                          } catch (err: any) {
                                            console.warn("Server-side rejection failed, falling back to direct Firestore delete:", err);
                                            try {
                                              await deleteDoc(doc(db, 'submissions', sub.id));
                                            } catch (fallbackErr: any) {
                                              console.error("Firestore rejection fallback error:", fallbackErr);
                                              setModeratorError(`Moderation Failed: ${fallbackErr.message || "Ensure you are authorized or signed in."}`);
                                            }
                                          } finally {
                                            setSubmittingRejectionId(null);
                                            setModeratorReloadTrigger(prev => prev + 1);
                                          }
                                        }}
                                        style={{
                                          background: 'transparent',
                                          color: isMapDarkMode ? '#ff3333' : '#d32f2f',
                                          border: isMapDarkMode ? '1px solid #ff3333' : '1.5px solid #d32f2f',
                                          padding: '0 16px',
                                          height: '32px',
                                          borderRadius: '16px',
                                          fontSize: '9px',
                                          fontFamily: '"Space Mono", monospace',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxSizing: 'border-box',
                                          flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                        }}
                                      >
                                        {submittingRejectionId === sub.id ? "DELETING..." : "DELETE PERMANENTLY"}
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeModTab === 'reports' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <span style={{ fontSize: '12.5px', color: isMapDarkMode ? theme.text : '#000000', fontWeight: 700, letterSpacing: '0.2px' }}>
                        Inaccuracy reports log:
                      </span>

                      {reports.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', border: `1px dashed ${theme.borderLight}`, color: isMapDarkMode ? theme.textDim : '#000000', fontSize: '11px', fontWeight: 'bold' }}>
                          No inaccuracy reports currently registered.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
                          {reports.map((report) => (
                            <div 
                              key={report.id} 
                              style={{ 
                                border: `1.5px solid ${report.status === 'resolved' ? '#00cc00' : theme.border}`, 
                                padding: '16px', 
                                backgroundColor: isMapDarkMode ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: isMapDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                              }}
                            >
                              {editingReportId === report.id ? (
                                renderReportEditForm(report)
                              ) : (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: theme.text }}>
                                          {report.pointName}
                                        </h5>
                                        <span style={{ fontSize: '8px', padding: '2px 6px', background: layerColors[report.pointCategory] || '#e5e5e5', color: '#000', borderRadius: '4px', textTransform: 'none', fontFamily: '"Space Mono", monospace', fontWeight: 'bold' }}>
                                          {report.pointCategory}
                                        </span>
                                        <span style={{ 
                                          fontSize: '8px', 
                                          padding: '2px 6px', 
                                          background: report.status === 'resolved' ? 'rgba(0, 204, 0, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                                          color: report.status === 'resolved' ? '#00cc00' : '#ef4444', 
                                          border: `1px solid ${report.status === 'resolved' ? '#00cc00' : '#ef4444'}`,
                                          borderRadius: '4px', 
                                          textTransform: 'none', 
                                          fontFamily: '"Space Mono", monospace', 
                                          fontWeight: 'bold' 
                                        }}>
                                          {report.status}
                                        </span>
                                      </div>
                                      <div style={{ fontSize: '9.5px', color: theme.textDim, fontFamily: '"Space Mono", monospace' }}>
                                        Target ID: {report.pointId} | Report ID: {report.id}
                                      </div>
                                    </div>
                                    <span style={{ fontSize: '10px', color: theme.textDim, whiteSpace: 'nowrap' }}>
                                      {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                  </div>

                                  <div style={{ padding: '10px', background: isMapDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', borderLeft: `3px solid ${isMapDarkMode ? '#ef4444' : '#b91c1c'}`, fontSize: '11px', lineHeight: '16px', color: theme.text }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '10px', color: isMapDarkMode ? '#ef4444' : '#b91c1c', marginBottom: '4px' }}>
                                      Reason: {report.reason}
                                    </div>
                                    {report.details || <em style={{ color: theme.textDim }}>No supporting details provided.</em>}
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '8px', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '12px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                                      {(() => {
                                        const mapRecord = combinedPointsAndLinesData.find(item => String(item.id) === String(report.pointId));
                                        if (!mapRecord || !mapRecord.coordinates) return null;
                                        return (
                                          <button
                                            onClick={() => setPreviewSub(mapRecord)}
                                            style={{
                                              background: 'transparent',
                                              color: theme.text,
                                              border: `1px solid ${theme.border}`,
                                              borderRadius: '16px',
                                              padding: '0 16px',
                                              height: '32px',
                                              fontSize: '9px',
                                              fontFamily: '"Space Mono", monospace',
                                              fontWeight: 700,
                                              cursor: 'pointer',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              gap: '6px',
                                              boxSizing: 'border-box',
                                              flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                            }}
                                          >
                                            <Eye size={12} />
                                            PREVIEW
                                          </button>
                                        );
                                      })()}

                                      {report.status === 'pending' && (
                                        <button
                                          onClick={() => {
                                            const mapRecord = combinedPointsAndLinesData.find(item => String(item.id) === String(report.pointId));
                                            const codexRecord = combinedCodexNodes.find(item => String(item.id) === String(report.pointId));
                                            
                                            setEditName(mapRecord?.name || codexRecord?.name || report.pointName || '');
                                            setEditDescription(mapRecord?.description || codexRecord?.description || '');
                                            setEditCategory(mapRecord?.category || report.pointCategory || '');
                                            setEditSource(mapRecord?.source || (codexRecord?.sources && codexRecord.sources[0]) || '');
                                            
                                            if (mapRecord?.coordinates && Array.isArray(mapRecord.coordinates) && mapRecord.coordinates.length === 2) {
                                              setEditLongitude(String(mapRecord.coordinates[0]));
                                              setEditLatitude(String(mapRecord.coordinates[1]));
                                            } else {
                                              setEditLongitude('');
                                              setEditLatitude('');
                                            }
                                            
                                            setEditCodexParentId(codexRecord?.parentId || '');
                                            setEditTimelineId(codexRecord?.timelineId || '');
                                            setEditMapFeatureId(codexRecord?.mapFeatureId || '');
                                            
                                            setEditingReportId(report.id);
                                          }}
                                          style={{
                                            background: 'transparent',
                                            color: theme.text,
                                            border: `1px solid ${theme.border}`,
                                            borderRadius: '16px',
                                            padding: '0 16px',
                                            height: '32px',
                                            fontSize: '9px',
                                            fontFamily: '"Space Mono", monospace',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            boxSizing: 'border-box',
                                            flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                          }}
                                        >
                                          EDIT
                                        </button>
                                      )}
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                                      <button
                                        disabled={submittingReportActionId !== null}
                                        onClick={async () => {
                                          const confirmed = window.confirm("Are you sure you want to permanently delete this report?");
                                          if (!confirmed) return;
                                          await handleReportAction(report.id, 'delete');
                                        }}
                                        style={{
                                          background: 'transparent',
                                          color: isMapDarkMode ? '#ff3333' : '#d32f2f',
                                          border: isMapDarkMode ? '1px solid #ff3333' : '1.5px solid #d32f2f',
                                          padding: '0 16px',
                                          height: '32px',
                                          borderRadius: '16px',
                                          fontSize: '9px',
                                          fontFamily: '"Space Mono", monospace',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxSizing: 'border-box',
                                          flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                        }}
                                      >
                                        {submittingReportActionId === report.id ? "DELETING..." : "DELETE REPORT"}
                                      </button>
                                
                                      {report.status === 'pending' && (
                                        <button
                                          disabled={submittingReportActionId !== null}
                                          onClick={async () => {
                                            await handleReportAction(report.id, 'resolve');
                                          }}
                                          style={{
                                            background: isMapDarkMode ? '#00cc00' : '#000000',
                                            color: isMapDarkMode ? '#000000' : '#ffffff',
                                            border: `1.5px solid ${isMapDarkMode ? '#00cc00' : '#000000'}`,
                                            padding: '0 16px',
                                            height: '32px',
                                            borderRadius: '16px',
                                            fontSize: '9px',
                                            fontFamily: '"Space Mono", monospace',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxSizing: 'border-box',
                                            flex: isMobile ? '1 1 calc(50% - 4px)' : 'none'
                                          }}
                                        >
                                          {submittingReportActionId === report.id ? "RESOLVING..." : "MARK RESOLVED"}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                          </>
                        )}
                      </div>
                    ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeModTab === 'cartography' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <span style={{ fontSize: '12.5px', color: isMapDarkMode ? theme.text : '#000000', fontWeight: 700, letterSpacing: '0.2px' }}>
                        Cartography custom pins (purge test pins or user entries dropped on historical projections):
                      </span>

                      {modCartographyPoints.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', border: `1px dashed ${theme.borderLight}`, color: isMapDarkMode ? theme.textDim : '#000000', fontSize: '11px', fontWeight: 'bold' }}>
                          No custom cartography pins discovered in the database.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
                          {modCartographyPoints.map((point) => (
                            <div 
                              key={point.id} 
                              style={{ 
                                border: `1.5px solid ${theme.border}`, 
                                padding: '16px', 
                                backgroundColor: isMapDarkMode ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: isMapDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                  <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: theme.text }}>{point.note}</h5>
                                  <div style={{ display: 'flex', gap: '12px', fontSize: '9.5px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <span>Map ID: <strong style={{ color: isMapDarkMode ? '#ffcc00' : '#000000' }}>{point.mapId}</strong></span>
                                    <span>Coords: <strong>[{point.lat?.toFixed(5)}, {point.lng?.toFixed(5)}]</strong></span>
                                    {point.createdAt ? (
                                      <span>Created: <strong>{typeof point.createdAt === 'string' ? point.createdAt : (point.createdAt._seconds ? new Date(point.createdAt._seconds * 1000).toLocaleString() : 'N/A')}</strong></span>
                                    ) : null}
                                  </div>
                                </div>

                                <button
                                  disabled={deletingCartoPointId === point.id}
                                  onClick={() => handleDeleteCartoPoint(point.id)}
                                  style={{
                                    background: 'transparent',
                                    color: '#ff4d4d',
                                    border: '1.5px solid #ff4d4d',
                                    padding: '0 16px',
                                    height: '32px',
                                    borderRadius: '16px',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontFamily: '"Space Mono", monospace',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box'
                                  }}
                                >
                                  {deletingCartoPointId === point.id ? 'PURGING...' : 'DELETE PIN'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
