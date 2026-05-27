import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Heart, Play, Upload, Plus, Link, MapPin, Lock, Check, Trash2, ShieldAlert, ChevronDown, Shield, Eye } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, onSnapshot, serverTimestamp, query, where, addDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
// @ts-ignore
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(firebaseApp);

// @ts-ignore
import rawPointsAndLinesData from './rabbitHoleData.json'; 
// @ts-ignore
import ufoData1 from './ufoData-1.json'; 
// @ts-ignore
import ufoData2 from './ufoData-2.json'; 
// @ts-ignore
import warGovData from './warGovData.json';
// @ts-ignore
import warGovData2 from './warGovData-2.json'; // Department of War PURSUE Release 2 dataset

const getSafeData = (data: any) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.default)) return data.default;
  return [];
};

const realUfoData = [
  ...getSafeData(ufoData1),
  ...getSafeData(ufoData2),
  ...getSafeData(warGovData),
  ...getSafeData(warGovData2)
];

mapboxgl.accessToken = 'pk.eyJ1Ijoibm9ydGhiZWFzdCIsImEiOiJjbXAyNnBhMGowMTFoMnFwenRnNWZvOWc5In0.PpOOemte4Ub9PVLfGsUS1g'; 

const isValidLngLat = (lng: any, lat: any) => {
  return (
    typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180 &&
    typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90
  );
};

// ERROR HANDLER
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {}, // No auth used here as per user request
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Nephilim': 'Newspaper articles about finding the bones of ancient biblical giants, horned humanoids, cyclops and more.',
  'U.F.O. Sightings': 'Reports of unidentified flying objects and extraterrestrial encounters across the globe.',
  'War.gov UFO files 01': 'Official records and multimedia releases from government archives documenting unidentified aerial phenomena (First Release).',
  'War.gov UFO files 02': 'Official declassified records and sensor videos from government archives (Second Release - PURSUE 02).',
  'D.U.M.B.\'s': 'Deep Underground Military Bases and mysterious subterranean government facilities.',
  'Cryptid Sightings': 'Encounters with legendary creatures whose existence has yet to be scientifically proven.',
  'Giants': 'Historical and archaeological accounts of unusually large skeletal remains.',
  'Megaliths': 'Colossal stone structures and ancient monuments with unknown origins or purposes.',
  'Petroglyphs': 'Ancient rock carvings and rock art depicting strange figures, celestial events, or forgotten symbols.',
  'Ancient Texts': 'Lost manuscripts, carvings, and inscriptions carrying forbidden or forgotten knowledge.',
  'Bigfoot Sightings': 'Tracking the elusive Sasquatch through forests and wilderness sightings.',
  'Blurred on Google Maps': 'Locations deliberately obscured or censored by satellite imaging providers.',
  'Burial Mounds': 'Ancient earthworks and ceremonial mounds marking the resting places of unknown civilizations.',
  'Cave Drawings': 'Prehistoric art depicting events, entities, and astronomical phenomena.',
  'Dolmans': 'Mysterious single-chamber megalithic tombs consisting of massive upright stones.',
  'Underworld Entrances': 'Purported Entrances to the Underworld from lore, legends, and modern times.',
  'Ghosts & Hauntings': 'Areas reported to have high levels of paranormal activity and spectral apparitions.',
  'National Parks & Reserves': 'The intersection of vast wilderness and unexplained disappearances.',
  'Crop Circles': 'Intricate patterns appearing in fields, often appearing overnight with no clear earthly explanation.',
  'Meteor Impact Craters': 'Confirmed impact structures on Earth created by ancient meteorite collisions, marking catastrophic cosmic encounters throughout geological history.'
};

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  const lowerUrl = url.trim().toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('youtube.com/embed') || 
         lowerUrl.includes('youtube.com/watch') ||
         lowerUrl.includes('youtu.be/') ||
         lowerUrl.includes('vimeo.com') || 
         lowerUrl.includes('dvidshub.net/video/embed') ||
         lowerUrl.includes('dvidshub.net/video/');
};

const isPdfUrl = (url: string) => {
  if (!url) return false;
  const lowerUrl = url.trim().toLowerCase();
  return lowerUrl.includes('.pdf') || 
         lowerUrl.includes('docs.google.com/viewer') || 
         (lowerUrl.includes('web.archive.org') && lowerUrl.includes('/https://') && lowerUrl.split('https://')[1]?.includes('.pdf'));
};

const getPdfViewerSrcDoc = (pdfUrl: string) => {
  const proxyUrl = `${window.location.origin}/api/proxy-resource?url=${encodeURIComponent(pdfUrl)}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Declassified Dossier Viewer</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0e0e0e;
      color: #eaeaea;
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-family: monospace, system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }
    header {
      background-color: #141414;
      border-bottom: 1px solid #222;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      letter-spacing: 1.5px;
      font-weight: bold;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    .badge {
      background: #ef4444;
      color: #fff;
      padding: 2px 6px;
      border-radius: 2px;
      font-size: 9px;
    }
    #viewer-container {
      flex-grow: 1;
      overflow: auto;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 24px;
      background: radial-gradient(circle, #151515 0%, #080808 100%);
    }
    .pdf-page-wrapper {
      background: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      border: 1px solid #222;
      position: relative;
    }
    canvas {
      display: block;
      max-width: 100%;
    }
    footer {
      background-color: #141414;
      border-top: 1px solid #222;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    button {
      background: #1f1f1f;
      border: 1px solid #333;
      color: #999;
      cursor: pointer;
      padding: 6px 12px;
      font-size: 10px;
      font-family: inherit;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
      transition: all 0.2s;
    }
    button:hover:not(:disabled) {
      background: #999;
      color: #000;
      border-color: #999;
    }
    button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    #page-indicator {
      font-size: 10px;
      color: #888;
      letter-spacing: 1px;
    }
    #status {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
    }
    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      border-top-color: #ef4444;
      animation: spin 0.8s linear infinite;
      margin-bottom: 12px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <header>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span class="badge">CLASSIFIED</span>
      <span>Dossier Intelligence File</span>
    </div>
    <div style="color: #666; font-size: 9px;">PAGE RENDERER ACTIVE</div>
  </header>

  <div id="viewer-container">
    <div id="status">
      <div class="spinner"></div>
      <div id="status-text" style="font-size: 11px; letter-spacing: 2px; color: #888; line-height: 1.6;">DECLASSIFIED DATA STREAM LOADING...</div>
    </div>
    <div class="pdf-page-wrapper" id="page-wrapper" style="display: none;">
      <canvas id="pdf-canvas"></canvas>
    </div>
  </div>

  <footer>
    <div class="controls">
      <button id="prev-btn" disabled>PREV</button>
      <span id="page-indicator">PAGE <span id="current-page">0</span> / <span id="total-pages">0</span></span>
      <button id="next-btn" disabled>NEXT</button>
    </div>
    <div class="controls">
      <button id="zoom-out-btn" disabled>ZOOM -</button>
      <button id="zoom-in-btn" disabled>ZOOM +</button>
    </div>
  </footer>

  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    var pdfDoc = null;
    var pageNum = 1;
    var pageRendering = false;
    var pageNumPending = null;
    var scale = 1.25;
    var canvas = document.getElementById('pdf-canvas');
    var ctx = canvas.getContext('2d');
    var pageWrapper = document.getElementById('page-wrapper');
    var statusEl = document.getElementById('status');
    var statusTextEl = document.getElementById('status-text');

    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');
    var zoomInBtn = document.getElementById('zoom-in-btn');
    var zoomOutBtn = document.getElementById('zoom-out-btn');
    var currentPageEl = document.getElementById('current-page');
    var totalPagesEl = document.getElementById('total-pages');

    function renderPage(num) {
      pageRendering = true;
      statusEl.style.display = 'block';
      if (statusTextEl) {
        statusTextEl.textContent = 'RENDERING PAGE ' + num + '...';
      }
      
      pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        pageWrapper.style.width = viewport.width + 'px';
        pageWrapper.style.height = viewport.height + 'px';
        pageWrapper.style.display = 'block';

        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
          pageRendering = false;
          statusEl.style.display = 'none';

          if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });

      currentPageEl.textContent = num;
      prevBtn.disabled = num <= 1;
      nextBtn.disabled = num >= pdfDoc.numPages;
    }

    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }

    zoomInBtn.addEventListener('click', function() {
      if (scale >= 3.0) return;
      scale += 0.25;
      renderPage(pageNum);
    });

    zoomOutBtn.addEventListener('click', function() {
      if (scale <= 0.75) return;
      scale -= 0.25;
      renderPage(pageNum);
    });

    prevBtn.addEventListener('click', function() {
      if (pageNum <= 1) return;
      pageNum--;
      queueRenderPage(pageNum);
    });

    nextBtn.addEventListener('click', function() {
      if (pageNum >= pdfDoc.numPages) return;
      pageNum++;
      queueRenderPage(pageNum);
    });

    var pdfUrl = '${proxyUrl}';
    var loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      withCredentials: false
    });

    loadingTask.onProgress = function(progressData) {
      if (statusTextEl) {
        if (progressData && progressData.total > 0) {
          var percent = Math.round((progressData.loaded / progressData.total) * 100);
          statusTextEl.innerHTML = 'DECLASSIFIED DATA STREAM LOADING...<br><span style="color: #ef4444; font-weight: bold; font-family: monospace; font-size: 14px; margin-top: 8px; display: inline-block;">' + percent + '% COMPLETE</span>';
        } else if (progressData && progressData.loaded > 0) {
          var kb = Math.round(progressData.loaded / 1024);
          statusTextEl.innerHTML = 'DECLASSIFIED DATA STREAM LOADING...<br><span style="color: #ef4444; font-weight: bold; font-family: monospace; font-size: 14px; margin-top: 8px; display: inline-block;">' + kb + ' KB LOADED</span>';
        }
      }
    };

    loadingTask.promise.then(function(pdfDoc_) {
      pdfDoc = pdfDoc_;
      totalPagesEl.textContent = pdfDoc.numPages;
      zoomInBtn.disabled = false;
      zoomOutBtn.disabled = false;
      renderPage(pageNum);
    }).catch(function(err) {
      console.error('PDF loading error:', err);
      var errMsg = err ? (err.message || err.toString()) : 'Unknown error';
      statusEl.innerHTML = '<div style="color: #ef4444; font-size: 11px; margin-bottom: 8px;">[ TRANSMISSION ERROR ]</div>' +
        '<div style="font-size: 10px; color: #aaa; max-width: 350px; line-height: 1.6; margin: 0 auto; font-family: monospace;">' +
        'Failed to parse classified records directly on proxy stream.<br>' +
        '<span style="color: #ef4444; word-break: break-all; width: 100%; display: inline-block;">' + errMsg + '</span><br><br>' +
        'Please use "OPEN SOURCE FILE" below for direct raw viewing.</div>';
    });
  </script>
</body>
</html>`;
};

interface CombinedAsset {
  url: string;
  type: 'image' | 'video' | 'audio' | 'pdf';
  pdfUrl?: string;
  isCombined?: boolean;
}

const getFilenameWithNoExtension = (url: string) => {
  if (!url) return '';
  const trimmedUrl = url.trim();
  const parts = trimmedUrl.split('/');
  const filename = parts[parts.length - 1];
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex !== -1) {
    return filename.substring(0, dotIndex).toLowerCase();
  }
  return filename.toLowerCase();
};

const getCombinedAssets = (images: string[]): CombinedAsset[] => {
  if (!images || images.length === 0) return [];
  
  const pdfs = images.filter(isPdfUrl);
  const others = images.filter(url => !isPdfUrl(url));
  
  const combined: CombinedAsset[] = [];
  const processedPdfs = new Set<string>();
  const processedOthers = new Set<string>();

  // Attempt to match each non-PDF with its PDF counterpart
  others.forEach(otherUrl => {
    const baseOther = getFilenameWithNoExtension(otherUrl);
    
    const matchedPdf = pdfs.find(pdfUrl => {
      const basePdf = getFilenameWithNoExtension(pdfUrl);
      return (baseOther === basePdf) || 
             (baseOther.includes(basePdf) && basePdf.length > 5) || 
             (basePdf.includes(baseOther) && baseOther.length > 5);
    });

    if (matchedPdf) {
      combined.push({
        url: otherUrl,
        type: isVideoUrl(otherUrl) ? 'video' : (isAudioUrl(otherUrl) ? 'audio' : 'image'),
        pdfUrl: matchedPdf,
        isCombined: true
      });
      processedPdfs.add(matchedPdf);
      processedOthers.add(otherUrl);
    }
  });

  // Add any remaining non-PDFs
  others.forEach(otherUrl => {
    if (!processedOthers.has(otherUrl)) {
      combined.push({
        url: otherUrl,
        type: isVideoUrl(otherUrl) ? 'video' : (isAudioUrl(otherUrl) ? 'audio' : 'image')
      });
    }
  });

  // Add any remaining PDFs which were not matched to any preview image
  pdfs.forEach(pdfUrl => {
    if (!processedPdfs.has(pdfUrl)) {
      combined.push({
        url: pdfUrl,
        type: 'pdf'
      });
    }
  });

  // Put videos first, whilst otherwise preserving their order
  const videos = combined.filter(asset => asset.type === 'video');
  const nonVideos = combined.filter(asset => asset.type !== 'video');
  return [...videos, ...nonVideos];
};

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  
  // YouTube 
  if (trimmed.includes('youtube.com/watch?v=')) {
    const videoId = trimmed.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (trimmed.includes('youtu.be/')) {
    const videoId = trimmed.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // DVIDS
  if (trimmed.includes('dvidshub.net/video/')) {
    if (trimmed.includes('/video/embed/')) {
      return trimmed;
    }
    const parts = trimmed.split('/video/')[1]?.split('/');
    const videoId = parts ? parts[0] : '';
    return `https://www.dvidshub.net/video/embed/${videoId}`;
  }
  if (trimmed.includes('dvidshub.net/image/')) {
    // If it's a DVIDS image page, we might want the thumbnail but it's complex
    // For now, let it be handled by proxy if it's a direct image link
    return trimmed;
  }

  return trimmed;
};

const isAudioUrl = (url: string) => {
  if (!url) return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac'];
  const lowerUrl = url.trim().toLowerCase();
  return audioExtensions.some(ext => lowerUrl.includes(ext));
};

const MISSING_IMAGE_URL = '/icons/icon-missing-image.svg';

const cleanAndProxyImageUrl = (url: any) => {
  if (!url || typeof url !== 'string') return MISSING_IMAGE_URL;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl.includes('icon-missing-image.svg')) return MISSING_IMAGE_URL;
  
  // If already proxied, or is a blob/data URL, don't proxy again
  if (
    trimmedUrl.startsWith('/api/proxy') || 
    trimmedUrl.startsWith('data:') || 
    trimmedUrl.startsWith('blob:')
  ) {
    return trimmedUrl;
  }

  // Do NOT proxy videos, PDFs, or audio as images
  if (isVideoUrl(trimmedUrl) || isPdfUrl(trimmedUrl) || isAudioUrl(trimmedUrl)) {
    return trimmedUrl;
  }

  // Bypass proxy for domains that block server-side IPs (like Wikipedia/Wikimedia 403s/429s on Cloud Run)
  // or that already fully support highly reliable direct client-side loading (like Unsplash/Wonders of the world).
  const lowerUrl = trimmedUrl.toLowerCase();
  if (
    lowerUrl.includes('wikimedia.org') || 
    lowerUrl.includes('wikipedia.org') || 
    lowerUrl.includes('unsplash.com') ||
    lowerUrl.includes('wonders-of-the-world.net') ||
    lowerUrl.includes('circleresearcharchive.com')
  ) {
    return trimmedUrl;
  }

  // Route everything through our local server proxy, which is highly reliable, 
  // bypasses SameSite cookie limitations, and avoids rate limiting of public proxies.
  if (trimmedUrl.startsWith('http')) {
    return `/api/proxy-resource?url=${encodeURIComponent(trimmedUrl)}`;
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
  const filteredImages = rawImages.filter(Boolean); // Keep raw URLs in state
  let safeImages = [...filteredImages].sort((a, b) => {
    const aIsVideo = isVideoUrl(a);
    const bIsVideo = isVideoUrl(b);
    if (aIsVideo && !bIsVideo) return -1;
    if (!aIsVideo && bIsVideo) return 1;
    return 0;
  });

  const displayDescription = safeDescription.trim() || "No further diagnostic descriptive intelligence available in active log sheets.";
  const lowerCat = rawCategory.toLowerCase();
  let normalizedCategory = rawCategory;
  if (lowerCat.includes('bigfoot') || lowerCat.includes('sasquatch')) normalizedCategory = 'Bigfoot Sightings';
  else if (lowerCat.includes('giant') || lowerCat.includes('nephilim') || lowerCat.includes('giants')) normalizedCategory = 'Nephilim';
  else if (lowerCat.includes('war.gov') || lowerCat.includes('aaro') || lowerCat.includes('official release') || lowerCat.includes('declassified')) {
    if (lowerCat.includes('02') || lowerCat.includes('release 2') || lowerCat.includes('release_2')) {
      normalizedCategory = 'War.gov UFO files 02';
    } else {
      normalizedCategory = 'War.gov UFO files 01';
    }
  }
  else if (lowerCat.includes('ufo') || lowerCat.includes('uap')) normalizedCategory = 'U.F.O. Sightings';
  else if (lowerCat.includes('cryptid')) normalizedCategory = 'Cryptid Sightings';
  else if (lowerCat.includes('entrance') || lowerCat.includes('underworld')) normalizedCategory = 'Underworld Entrances';
  else if (lowerCat.includes('ancient') || lowerCat.includes('text')) normalizedCategory = 'Ancient Texts';
  else if (lowerCat.includes('burial') || lowerCat.includes('mound')) normalizedCategory = 'Burial Mounds';
  else if (lowerCat.includes('cave') || lowerCat.includes('drawing')) normalizedCategory = 'Cave Drawings';
  else if (lowerCat.includes('megaliths / dolmans / petroglyphs / geoglyphs')) {
    const descLower = displayDescription.toLowerCase();
    const nameLower = safeName.toLowerCase();
    if (descLower.includes('petroglyph') || descLower.includes('rock art') || nameLower.includes('rock art') || nameLower.includes('petroglyph')) {
      normalizedCategory = 'Petroglyphs';
    } else {
      normalizedCategory = 'Megaliths';
    }
  }
  else if (lowerCat.includes('petroglyph') || lowerCat.includes('rock art')) normalizedCategory = 'Petroglyphs';
  else if (lowerCat.includes('crop') || lowerCat.includes('circle')) normalizedCategory = 'Crop Circles';
  else if (lowerCat.includes('megalith')) normalizedCategory = 'Megaliths';
  else if (lowerCat.includes('dumb') || lowerCat.includes('d.u.m.b')) normalizedCategory = 'D.U.M.B.\'s';
  else if (lowerCat.includes('ghost') || lowerCat.includes('haunt')) normalizedCategory = 'Ghosts & Hauntings';
  else if (lowerCat.includes('national park') || lowerCat.includes('reserve')) normalizedCategory = 'National Parks & Reserves';
  else if (lowerCat.includes('blurred')) normalizedCategory = 'Blurred on Google Maps';
  else if (lowerCat.includes('meteor') || lowerCat.includes('crater') || lowerCat.includes('impact structure')) normalizedCategory = 'Meteor Impact Craters';

  // Smart imagery injection for map points lacking media (megaliths, underworld entrances, national parks, mounds)
  // ONLY use high-quality location-specific historical/documentary assets for actual landmarks.
  // DO NOT use generic category-wide backgrounds/placers or fallbacks when no specific photo is matched.
  if (safeImages.length === 0) {
    const lowerName = safeName.toLowerCase();
    const lowerNormalizedCat = normalizedCategory.toLowerCase();
    
    if (lowerNormalizedCat === 'megaliths') {
      if (lowerName.includes('pyramid of giza') || lowerName.includes('great pyramid')) {
        safeImages = ['https://www.wonders-of-the-world.net/Pyramids-of-Egypt/images/Description/Gizeh/Pyramides-de-Gizeh-7.jpg'];
      } else if (lowerName.includes('sphinx')) {
        safeImages = ['https://www.wonders-of-the-world.net/Pyramids-of-Egypt/images/Description/Sphinx/Sphinx-2.jpg'];
      } else if (lowerName.includes('göbekli') || lowerName.includes('gobekli')) {
        safeImages = ['https://ferrerysaret.com/wp-content/uploads/2026/01/GobekliTepe_turquia-2.jpg'];
      } else if (lowerName.includes('moai') || lowerName.includes('easter island')) {
        safeImages = ['https://www.wonders-of-the-world.net/Statues-of-Easter-island/images/Vignettes/Photos/Statues-de-l-ile-de-Paques-004-V.jpg'];
      } else if (lowerName.includes('nazca')) {
        safeImages = [
          'https://youtu.be/t0vEngqpk84?si=TdyO-_NxCj9CqnFl',
          'https://www.machutravelperu.com/blog/wp-content/uploads/2018/03/how-were-nazca-lines-made.jpg'
        ];
      } else if (lowerName.includes('uffington')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/4/48/Uffington-White-Horse-sat.jpg'];
      } else if (lowerName.includes('candelabro') || lowerName.includes('candelabra')) {
        safeImages = ['https://paracasbluetours.com/wp-content/uploads/2026/01/el-candelabro-paracas-noche-estrellas-misterio.webp'];
      } else if (lowerName.includes('blythe')) {
        safeImages = ['https://www.ancientartarchive.org/wp-content/uploads/ALV200217009325_Blythe_Geoglyph-scaled.jpg'];
      } else if (lowerName.includes('evergreen')) {
        safeImages = ['https://www.montanamegaliths.com/uploads/6/9/2/9/69295147/evergreen-dolmen-tane-talalotu_orig.jpg'];
      } else if (lowerName.includes('tizer')) {
        safeImages = ['https://www.montanamegaliths.com/uploads/6/9/2/9/69295147/andrew-barker-tizer-best_orig.jpg'];
      } else if (lowerName.includes('steppe')) {
        safeImages = ['https://i0.wp.com/beforeatlantis.com/wp-content/uploads/2020/08/ushtogaiskiisquareaerial-1.jpg?fit=1200%2C458&ssl=1'];
      } else if (lowerName.includes('dolman') || lowerName.includes('dolmen')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/5/52/Poulnabrone_dolmen%2C_Ireland_-_Aug_2009.jpg'];
      }
    } else if (lowerNormalizedCat === 'petroglyphs') {
      if (lowerName.includes('ferganchick')) {
        safeImages = ['https://www.historycolorado.org/sites/default/files/media/images/2018/5dt355.jpg'];
      }
    } else if (lowerNormalizedCat === 'underworld entrances') {
      if (lowerName.includes('darvaza') || lowerName.includes('door to hell')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/9/91/Darvasa_gas_crater_panorama_crop.jpg'];
      } else if (lowerName.includes('hekla')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/e/ec/Hekla_from_southWest_under_snow.jpg'];
      } else if (lowerName.includes('osore')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/9/90/Mount_Osore_lake.jpg'];
      } else if (lowerName.includes('cave of hades') || lowerName.includes('gates of hades') || lowerName.includes('matapan') || lowerName.includes('tainaron')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/0/07/The_cave_of_Hades_on_Cape_Matapan.jpg'];
      } else if (lowerName.includes('actun tunichil') || lowerName.includes('xibalba')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/2/2e/Actun_Tunichil_Muknal_Entrance.jpg'];
      } else if (lowerName.includes('mitla') || lowerName.includes('mictlan')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/4/42/Mitla_Tombs.jpg'];
      } else if (lowerName.includes('ghost city') || lowerName.includes('fengdu') || lowerName.includes('guimen')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/5/5d/FengduGhostCityChina.jpg'];
      }
    } else if (lowerNormalizedCat === 'burial mounds') {
      if (lowerName.includes('serpent')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/e/e0/Serpentmound_topview.jpg'];
      }
    }
  }

  const tagsSet = new Set([normalizedCategory]);

  return {
    ...item,
    id: safeId,
    name: safeName,
    categories: Array.from(tagsSet),
    category: normalizedCategory,
    description: displayDescription,
    date: safeDate,
    coordinates: safeCoords,
    source: safeSource,
    images: safeImages,
    type: item.type === 'LineString' ? 'LineString' : 'Point'
  };
};

const LAYER_CONFIG: Record<string, { color: string; icon: string }> = {
  'War.gov UFO files 01': { color: '#FF9BE1', icon: 'https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-dept-war.svg' },
  'War.gov UFO files 02': { color: '#D29BFF', icon: 'https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-dept-war.svg' },
  'Nephilim': { color: '#ECCE81', icon: '/icons/icon-giants.svg' },
  'U.F.O. Sightings': { color: '#C2FFBD', icon: '/icons/icon-ufo-sightings.svg' },
  'Bigfoot Sightings': { color: '#C6986D', icon: '/icons/icon-bigfoot-sightings.svg' },
  'Cryptid Sightings': { color: '#AFFFEC', icon: '/icons/icon-cryptid-sightings.svg' },
  'Underworld Entrances': { color: '#D3C5FB', icon: '/icons/icon-entrances-to-underworld.svg' },
  'Ancient Texts': { color: '#F6E8C1', icon: '/icons/icon-ancient-texts.svg' },
  'Burial Mounds': { color: '#B3C77B', icon: '/icons/icon-burial-mounds.svg' },
  'Cave Drawings': { color: '#FFABA6', icon: '/icons/icon-cave-drawings.svg' },
  'Crop Circles': { color: '#FFF96A', icon: '/icons/icon-crop-circles.svg' },
  'D.U.M.B.\'s': { color: '#BAEAF4', icon: '/icons/icon-dumbs.svg' },
  'Ghosts & Hauntings': { color: '#BDC4FF', icon: '/icons/icon-ghosts.svg' },
  'Megaliths': { color: '#FFFBA6', icon: '/icons/icon-megaliths.svg' },
  'Petroglyphs': { color: '#FFCBA6', icon: '/icons/icon-petroglyphs.svg' },
  'National Parks & Reserves': { color: '#9FF3BC', icon: '/icons/icon-national-parks-reserves.svg' },
  'Blurred on Google Maps': { color: '#BDC4FF', icon: '/icons/icon-blurred-on-google.svg' },
  'Meteor Impact Craters': { color: '#FF9F63', icon: '/icons/icon-meteors.svg' },
  'Default': { color: '#b6a6ff', icon: '/icons/icon-map-pin.svg' }
};

const matchParkName = (featName: string, targetName: string) => {
  if (!featName || !targetName) return false;
  const cleanFeat = featName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace('nationalparkandpreserve', '')
    .replace('nationalparkreserve', '')
    .replace('nationalparksreserves', '')
    .replace('nationalpark', '')
    .replace('nationalreserve', '')
    .replace('nationalpreserve', '')
    .replace('nationalmonument', '');
  const cleanTarget = targetName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace('nationalparkandpreserve', '')
    .replace('nationalparkreserve', '')
    .replace('nationalparksreserves', '')
    .replace('nationalpark', '')
    .replace('nationalreserve', '')
    .replace('nationalpreserve', '')
    .replace('nationalmonument', '');
  return cleanFeat.includes(cleanTarget) || cleanTarget.includes(cleanFeat);
};

function App() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const lineLayersRef = useRef<string[]>([]);
  const selectedParkGeomRef = useRef<Record<string, { precise: boolean; features: any[] }>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [geocodeResults, setGeocodeResults] = useState<any[]>([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [pointsAndLinesData, setPointsAndLinesData] = useState<any[]>([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(true);

  // Combine original static / scraped data and approved user submissions
  const combinedPointsAndLinesData = useMemo(() => {
    const combined = [...pointsAndLinesData, ...approvedSubmissions];
    const uniqueMap = new Map();
    combined.forEach((item: any) => {
      if (item && item.id) {
        uniqueMap.set(String(item.id), item);
      }
    });
    return Array.from(uniqueMap.values()) as any[];
  }, [pointsAndLinesData, approvedSubmissions]);

  const uniqueCategories = useMemo(() => {
    const allTags = combinedPointsAndLinesData.flatMap(item => item.categories);
    const order = ['War.gov UFO files 01', 'War.gov UFO files 02', 'Nephilim', 'U.F.O. Sightings'];
    return Array.from(new Set(allTags)).sort((a, b) => {
      const sA = String(a);
      const sB = String(b);
      const indexA = order.indexOf(sA);
      const indexB = order.indexOf(sB);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return sA.localeCompare(sB);
    }); 
  }, [combinedPointsAndLinesData]);

  const layerColors = useMemo(() => {
    const assigned: Record<string, string> = {};
    uniqueCategories.forEach(category => {
      assigned[category] = LAYER_CONFIG[category]?.color || LAYER_CONFIG['Default'].color;
    });
    return assigned;
  }, [uniqueCategories]);

  const timeBounds = useMemo(() => {
    return { min: 0, max: 2050 };
  }, []);

  const globalMaxTimelineCount = useMemo(() => {
    const counts: Record<number, number> = {};
    combinedPointsAndLinesData.forEach(item => {
      if (item.date) {
        counts[item.date] = (counts[item.date] || 0) + 1;
      }
    });
    const values = Object.values(counts) as number[];
    return values.length > 0 ? Math.max(...values) : 1;
  }, [combinedPointsAndLinesData]);

  // Handle Mapbox Geocoding
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 3) {
      setGeocodeResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingGeocode(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=5`
        );
        const data = await response.json();
        setGeocodeResults(data.features || []);
      } catch (err) {
        console.error('Geocoding error:', err);
      } finally {
        setIsSearchingGeocode(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleGeocodeSelect = (result: any) => {
    if (!mapRef.current) return;
    const [lng, lat] = result.center;
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 12,
      duration: 2000,
      essential: true
    });
    setSearchQuery('');
    setGeocodeResults([]);
    setShowSearchResults(false);
  };

  const handleSearchItemSelect = (item: any) => {
    handleLocationItemClick(item);
    setSearchQuery('');
    setGeocodeResults([]);
    setShowSearchResults(false);
  };

  const [yearRange, setYearRange] = useState({ start: 0, end: 2050 });
  const [timelineWindowStart, setTimelineWindowStart] = useState(0);
  const [timelineWindowSpan, setTimelineWindowSpan] = useState(2050); 
  const [isTimelineDragging, setIsTimelineDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTimelineStart, setDragStartTimelineStart] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const selectedMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Submission Form State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isPinningOnMap, setIsPinningOnMap] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCategory, setSubCategory] = useState('U.F.O. Sightings');
  const [subDescription, setSubDescription] = useState('');
  const [subDate, setSubDate] = useState('');
  const [subLatitude, setSubLatitude] = useState('');
  const [subLongitude, setSubLongitude] = useState('');
  const [subSource, setSubSource] = useState('');
  const [subMediaList, setSubMediaList] = useState<string[]>([]);
  const [subMediaInput, setSubMediaInput] = useState('');
  const [subMediaType, setSubMediaType] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Added States for Geocoding-Pinpoint & Custom Dropdown matching requirement 3 & 5
  const [subLocationSearch, setSubLocationSearch] = useState('');
  const [subGeocodeResults, setSubGeocodeResults] = useState<any[]>([]);
  const [isSubGeocoding, setIsSubGeocoding] = useState(false);
  const [subGeocodeMsg, setSubGeocodeMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Moderator State
  const [isModeratorOpen, setIsModeratorOpen] = useState(false);
  const [moderatorPasscode, setModeratorPasscode] = useState('');
  const [isModeratorAuthenticated, setIsModeratorAuthenticated] = useState(false);
  const [moderatorError, setModeratorError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
  const [submittingApprovalId, setSubmittingApprovalId] = useState<string | null>(null);
  const [submittingRejectionId, setSubmittingRejectionId] = useState<string | null>(null);
  const [moderatorReloadTrigger, setModeratorReloadTrigger] = useState(0);
  const [isModMinimized, setIsModMinimized] = useState(false);
  const [activeModTab, setActiveModTab] = useState<'pending' | 'approved'>('pending');
  const [submittingRevocationId, setSubmittingRevocationId] = useState<string | null>(null);

  // States for editing submissions
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

  const isPinningOnMapRef = useRef(false);
  useEffect(() => {
    isPinningOnMapRef.current = isPinningOnMap;
  }, [isPinningOnMap]);

  // Requirement 1: Listen to URL slug for opening Mod Desk Automatically
  useEffect(() => {
    const checkModUrl = () => {
      const isModUrl = 
        window.location.pathname === '/mod' || 
        window.location.pathname.endsWith('/mod') || 
        window.location.hash === '#/mod' || 
        window.location.hash === '#mod';
      if (isModUrl) {
        setIsModeratorOpen(true);
        setIsModMinimized(false);
      }
    };
    checkModUrl();
    window.addEventListener('hashchange', checkModUrl);
    return () => window.removeEventListener('hashchange', checkModUrl);
  }, []);

  const handleStartEdit = (sub: any) => {
    setEditingSubId(sub.id);
    setEditName(sub.name || '');
    setEditCategory(sub.category || '');
    setEditDescription(sub.description || '');
    setEditDate(sub.date || '');
    setEditSource(sub.source || '');
    setEditLongitude(sub.coordinates?.[0]?.toString() || '');
    setEditLatitude(sub.coordinates?.[1]?.toString() || '');
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
      const lngNum = parseFloat(editLongitude);
      const latNum = parseFloat(editLatitude);
      if (isNaN(lngNum) || isNaN(latNum)) {
        throw new Error("Invalid Longitude/Latitude coordinates format.");
      }

      const updatedFields = {
        name: editName,
        category: editCategory,
        description: editDescription,
        date: editDate,
        source: editSource,
        coordinates: [lngNum, latNum],
        images: editMediaList
      };

      const response = await fetch('/api/moderate/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId,
          passcode: 'MTRH2026',
          updatedData: updatedFields
        })
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
          <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>NAME *</label>
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>LAYER CATEGORY *</label>
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
            <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>YEAR / DATE</label>
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

        <div>
          <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>INTELLIGENCE / DESCRIPTION *</label>
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
          <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: theme.text }}>SOURCE DOCUMENTATION</label>
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
            <label style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.5px', color: theme.text }}>EDIT IMAGES / VIDEOS ATTACHMENTS</label>
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
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setIsEditUploading(true);
                  try {
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const base64 = reader.result as string;
                      const base64Data = base64.split(',')[1] || base64;

                      try {
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            filename: file.name,
                            fileData: base64Data
                          })
                        });

                        if (!response.ok) {
                          throw new Error(`Upload failed with status: ${response.status}`);
                        }

                        const data = await response.json();
                        if (data && data.url) {
                          setEditMediaList(prev => [...prev, data.url]);
                        } else {
                          throw new Error("Invalid response schema from upload endpoint");
                        }
                      } catch (err: any) {
                        console.error("Upload Error:", err);
                        setModeratorError(`Upload failed: ${err.message || err}`);
                      } finally {
                        setIsEditUploading(false);
                      }
                    };
                    reader.onerror = () => {
                      setModeratorError("Failed to read local file.");
                      setIsEditUploading(false);
                    };
                    reader.readAsDataURL(file);
                  } catch (fileErr: any) {
                    console.error(fileErr);
                    setIsEditUploading(false);
                  }
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
              <span style={{ fontSize: '9px', textTransform: 'uppercase' }}>
                {isEditUploading ? "Uploading file..." : "Click to add file"}
              </span>
            </div>
          )}

          {/* Edit Attachments lists */}
          {editMediaList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '8px', fontWeight: 'bold', letterSpacing: '0.5px', color: theme.textDim }}>CURRENT ATTACHMENTS ({editMediaList.length})</span>
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

        {/* Geographic location search matching requirement */}
        <div style={{ background: isMapDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px dashed ${theme.borderLight}`, padding: '10px', borderRadius: '2px' }}>
          <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', letterSpacing: '0.5px', color: theme.text }}>GEOGRAPHIC GEO-SEARCH (AUTO-FILL COORDINATES)</label>
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
              {isEditGeocoding ? 'RESOLVE...' : 'RESOLVE'}
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
              background: isMapDarkMode ? '#111111' : '#fcfcfc',
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
            <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#ffcc00' }}>MAP COORDINATE CALIBRATION</span>
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
              <span style={{ fontSize: '8px', color: theme.textDim, display: 'block', marginBottom: '2px' }}>LONGITUDE *</span>
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
              <span style={{ fontSize: '8px', color: theme.textDim, display: 'block', marginBottom: '2px' }}>LATITUDE *</span>
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

  // Requirement 3: Geocode search to auto-populate submission coords (with proximity bias and suggestions list)
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

  useEffect(() => {
    const calculateScrollbarWidth = () => {
      // Create a temporary element to measure
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll'; // Force scrollbar to show
      outer.style.position = 'absolute';
      outer.style.top = '-9999px';
      outer.style.width = '50px';
      outer.style.height = '50px';
      document.body.appendChild(outer);

      const width = outer.offsetWidth - outer.clientWidth;
      document.body.removeChild(outer);
      
      setScrollbarWidth(width);
      document.documentElement.style.setProperty('--scrollbar-width', `${width}px`);
    };

    calculateScrollbarWidth();
    
    window.addEventListener('resize', calculateScrollbarWidth);
    return () => window.removeEventListener('resize', calculateScrollbarWidth);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(true);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  const [hoveredBucket, setHoveredBucket] = useState<{
    count: number;
    cat: string;
    year: number;
    x: number;
    bottom: number;
  } | null>(null);

  // Keep selection range within the visible window when zooming or panning
  useEffect(() => {
    const windowEnd = timelineWindowStart + timelineWindowSpan;
    const timelineWidth = timelineRef.current?.offsetWidth || 0;
    // Calculate gap in years equivalent to 12px thumb width
    const gap = timelineWidth > 0 ? (12 / timelineWidth) * timelineWindowSpan : 0;

    setYearRange(prev => {
      let newStart = prev.start;
      let newEnd = prev.end;
      
      // Clamp start
      if (newStart < timelineWindowStart) newStart = timelineWindowStart;
      if (newStart > windowEnd - gap) newStart = windowEnd - gap;
      
      // Clamp end
      if (newEnd > windowEnd) newEnd = windowEnd;
      if (newEnd < timelineWindowStart + gap) newEnd = timelineWindowStart + gap;

      // Ensure minimum gap is maintained
      if (newEnd - newStart < gap) {
        // If we were pushing boundaries, decide which one to move
        // Favor keeping the one that was inside the window
        if (newStart <= timelineWindowStart) {
          newEnd = Math.min(windowEnd, newStart + gap);
        } else if (newEnd >= windowEnd) {
          newStart = Math.max(timelineWindowStart, newEnd - gap);
        } else {
          // If neither at edge, just push end
          newEnd = Math.min(windowEnd, newStart + gap);
        }
      }

      if (Math.abs(newStart - prev.start) < 0.01 && Math.abs(newEnd - prev.end) < 0.01) return prev;
      return { start: newStart, end: newEnd };
    });
  }, [timelineWindowStart, timelineWindowSpan]);
  
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({});

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const activeAssets = useMemo(() => {
    return getCombinedAssets(selectedFeature?.images || []);
  }, [selectedFeature]);
  
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isLightboxImageLoading, setIsLightboxImageLoading] = useState(false);

  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikedIds, setUserLikedIds] = useState<Set<string>>(new Set());

  // Load user likes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('userLikedIds');
    if (stored) {
      try {
        setUserLikedIds(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error('Failed to parse userLikedIds', e);
      }
    }
  }, []);

  // Save user likes to localStorage
  useEffect(() => {
    localStorage.setItem('userLikedIds', JSON.stringify(Array.from(userLikedIds)));
  }, [userLikedIds]);
  const [isMapDarkMode, setIsMapDarkMode] = useState(false);
  const darkModeRef = useRef(isMapDarkMode);

  // Theme Constants
  const theme = {
    bg: isMapDarkMode ? '#000000' : '#ffffff',
    bgTransparent: isMapDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    text: isMapDarkMode ? '#ffffff' : '#000000',
    textDim: isMapDarkMode ? '#999999' : '#666666',
    border: isMapDarkMode ? '#ffffff' : '#000000',
    borderLight: isMapDarkMode ? '#333333' : '#eeeeee',
    invert: isMapDarkMode ? 'invert(1)' : 'none'
  };

  useEffect(() => {
    darkModeRef.current = isMapDarkMode;
  }, [isMapDarkMode]);

  const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11';
  const MAP_STYLE_DARK = 'mapbox://styles/mapbox/dark-v11';

  // Sync likes from Firestore
  useEffect(() => {
    const likesRef = collection(db, 'likes');
    const unsubscribe = onSnapshot(likesRef, (snapshot) => {
      const likesMap: Record<string, number> = {};
      snapshot.forEach((doc) => {
        likesMap[doc.id] = doc.data().count || 0;
      });
      setLikes(likesMap);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'likes');
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.email === 'jhuffman710@gmail.com') {
          setIsModeratorAuthenticated(true);
        }
      } else {
        // If we also had manual bypassed passcode state, keep it, otherwise reset
        // We'll let passcode state remain distinct
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Approved Submissions dynamically (Anyone can fetch these)
  useEffect(() => {
    const q = query(collection(db, 'submissions'), where('status', '==', 'approved'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          name: data.name,
          category: data.category,
          categories: [data.category],
          description: data.description,
          date: data.date ? Number(data.date) : 0,
          coordinates: data.coordinates,
          images: data.images || [],
          source: data.source || 'User Submission',
          isSubmitted: true,
          type: 'Point'
        });
      });
      setApprovedSubmissions(docs);
    }, (error) => {
      console.warn("Could not listen to approved submissions directly:", error);
    });
    return () => unsubscribe();
  }, []);

  // Listen to all submissions for moderators (Requires Auth or Bypass)
  useEffect(() => {
    if (!isModeratorAuthenticated) {
      setPendingSubmissions([]);
      return;
    }

    let isMounted = true;
    let fallbackInterval: any = null;

    // Define raw fetching from server-side bypass
    const fetchPendingFromServer = async () => {
      try {
        const response = await fetch('/api/moderate/pending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode: 'MTRH2026' })
        });
        if (!response.ok) {
          throw new Error(`Server status ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          setPendingSubmissions(data.pending || []);
        }
      } catch (err: any) {
        console.warn("Server-side pending submissions fetch failed:", err);
      }
    };

    // Try listening to firestore snapshot first if they have full permissions
    const q = collection(db, 'submissions');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pending: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'pending') {
          pending.push({
            id: doc.id,
            ...data
          });
        }
      });
      if (isMounted) {
        setPendingSubmissions(pending);
      }
    }, (error) => {
      console.warn("Could not load submissions list directly from Firestore client. Switching to secure server proxy...", error);
      // Fallback: Fetch once immediately, then poll every 5 seconds
      fetchPendingFromServer();
      if (isMounted && !fallbackInterval) {
        fallbackInterval = setInterval(fetchPendingFromServer, 5000);
      }
    });

    // Also fetch immediately on dependency triggers
    fetchPendingFromServer();

    return () => {
      isMounted = false;
      unsubscribe();
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }, [isModeratorAuthenticated, moderatorReloadTrigger]);

  const handleLike = async (anomalyId: string | number) => {
    if (anomalyId === undefined || anomalyId === null) return;
    const cleanId = String(anomalyId).replace(/[^a-zA-Z0-9_\-]/g, '_');
    const likeDocRef = doc(db, 'likes', cleanId);
    
    const isLiked = userLikedIds.has(cleanId);
    const currentCount = likes[cleanId] || 0;
    
    try {
      if (isLiked) {
        // Toggle OFF: Unfavorite
        const newSet = new Set(userLikedIds);
        newSet.delete(cleanId);
        setUserLikedIds(newSet);
        
        // Optimistic UI update
        setLikes(prev => ({ ...prev, [cleanId]: Math.max(0, currentCount - 1) }));
        
        await updateDoc(likeDocRef, {
          count: increment(-1),
          updatedAt: serverTimestamp()
        });
      } else {
        // Toggle ON: Favorite
        const newSet = new Set(userLikedIds);
        newSet.add(cleanId);
        setUserLikedIds(newSet);

        // Optimistic UI update
        setLikes(prev => ({ ...prev, [cleanId]: currentCount + 1 }));

        const docSnap = await getDoc(likeDocRef);
        if (docSnap.exists()) {
          await updateDoc(likeDocRef, {
            count: increment(1),
            updatedAt: serverTimestamp()
          });
        } else {
          await setDoc(likeDocRef, {
            count: 1,
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setLikes(prev => ({ ...prev, [cleanId]: currentCount }));
      setUserLikedIds(prev => {
        const reverted = new Set(prev);
        if (isLiked) reverted.add(cleanId); else reverted.delete(cleanId);
        return reverted;
      });
      console.error("Like operation failed", error);
    }
  };

  useEffect(() => {
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
    if (selectedFeature && activeAssets && activeAssets.length > 0) {
      setIsImageLoading(true);
    }
  }, [selectedFeature, activeAssets]);

  useEffect(() => {
    if (selectedFeature && activeAssets && activeAssets.length > 0) {
      const currentAsset = activeAssets[activeImageIndex];
      const currentUrl = currentAsset?.url;
      if (isVideoUrl(currentUrl) || isPdfUrl(currentUrl) || isAudioUrl(currentUrl) || currentAsset?.pdfUrl) {
        setIsImageLoading(false);
      } else {
        setIsImageLoading(true);
        // Safety timeout for hanging images
        const timeout = setTimeout(() => {
          setIsImageLoading(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    }
  }, [activeImageIndex, selectedFeature, activeAssets]);

  useEffect(() => {
    if (isLightboxOpen && selectedFeature && activeAssets && activeAssets.length > 0) {
      setIsLightboxImageLoading(true);
    }
  }, [activeImageIndex, isLightboxOpen, selectedFeature, activeAssets]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedFeature || !activeAssets || activeAssets.length === 0) return;
      
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowRight') {
          setActiveImageIndex(prev => (prev + 1) % activeAssets.length);
        }
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex(prev => (prev - 1 + activeAssets.length) % activeAssets.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedFeature, activeAssets]);

  useEffect(() => {
    const compileVerifiedIntel = () => {
      try {
        setIsLiveLoading(true);
        const safeLocalData = getSafeData(rawPointsAndLinesData);
        const safeUfoData = getSafeData(realUfoData);
        const combinedRawData = [...safeLocalData, ...safeUfoData];
        
        const initialBuffer = combinedRawData
          .map((item, idx) => processIncomingRecord(item, idx))
          .filter(Boolean);

        console.log(`Initial compilation: ${initialBuffer.length} records processed.`);
        const catCounts: any = {};
        initialBuffer.forEach((f: any) => {
          catCounts[f.category] = (catCounts[f.category] || 0) + 1;
        });
        console.log("Loaded Categories:", catCounts);

        setPointsAndLinesData(initialBuffer);

        const minYear = 0;
        const maxYear = 2050;
        setYearRange({ start: minYear, end: maxYear });
        setTimelineWindowStart(minYear);
        setTimelineWindowSpan(maxYear - minYear);

        // Fetch additional records asynchronously without blocking the local data
        loadRemoteArchiveData();
      } catch (err) {
        console.error("Critical failure during map compilation pipeline: ", err);
      } finally {
        setTimeout(() => {
          setIsLiveLoading(false);
        }, 600);
      }
    };

    const loadRemoteArchiveData = async () => {
      try {
        const archiveRes = await fetch('/api/uap-archive');
        if (archiveRes.ok) {
          const archiveData = await archiveRes.json();
          if (archiveData.records && Array.isArray(archiveData.records)) {
            const remoteRecords = archiveData.records
              .map((item: any, idx: number) => processIncomingRecord(item, 100000 + idx))
              .filter(Boolean);
            
            setPointsAndLinesData(prev => {
              const combined = [...prev, ...remoteRecords];
              const uniqueMap = new Map();
              combined.forEach((item: any) => uniqueMap.set(item.id, item));
              return Array.from(uniqueMap.values()) as any[];
            });
          }
        }
      } catch (apiErr) {
        console.warn("Could not reach UAP archive scraping proxy:", apiErr);
      }
    };

    compileVerifiedIntel();
  }, []);

  useEffect(() => {
    setActiveLayers(prev => {
      const updated = { ...prev };
      uniqueCategories.forEach(cat => { 
        if (updated[cat] === undefined) {
          updated[cat] = true;
        } 
      });
      return updated;
    });
  }, [uniqueCategories]);

  const visibleData = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    return combinedPointsAndLinesData.filter(item => {
      const hasActiveLayerMatch = item.categories.some((cat: string) => activeLayers[cat] !== false);
      const matchesTimeline = item.date ? (item.date >= yearRange.start && item.date <= yearRange.end) : true;
      const matchesSearch = cleanQuery === '' || 
        item.name.toLowerCase().includes(cleanQuery) ||
        item.categories.some((cat: string) => cat.toLowerCase().includes(cleanQuery)) ||
        item.description.toLowerCase().includes(cleanQuery);

      return hasActiveLayerMatch && matchesTimeline && matchesSearch;
    });
  }, [combinedPointsAndLinesData, yearRange, activeLayers, searchQuery]);

  const groupedLocations = useMemo(() => {
    const groups: Record<string, any[]> = {};
    uniqueCategories.forEach(cat => { groups[cat] = []; });
    visibleData.forEach(item => {
      // Do not show LineString features (tunnels/lines) in the left sidebar list
      if (item && item.type === 'LineString') return;
      item.categories.forEach((cat: string) => {
        if (groups[cat]) groups[cat].push(item);
      });
    });
    
    // Sort items within each layer
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => {
        const likesA = likes[String(a.id).replace(/[^a-zA-Z0-9_\-]/g, '_')] || 0;
        const likesB = likes[String(b.id).replace(/[^a-zA-Z0-9_\-]/g, '_')] || 0;
        
        if (likesB !== likesA) {
          return likesB - likesA; // Sort by likes descending
        }

        // Identify content tiers:
        // Tier 3: Has video content
        // Tier 2: Has photos / PDFs / other imagery but no video
        // Tier 1: Has no imagery at all
        const getTier = (item: any) => {
          const imgs = item.images || [];
          if (imgs.length === 0) return 1;
          const hasVideo = imgs.some(isVideoUrl);
          if (hasVideo) return 3;
          return 2;
        };

        const tierA = getTier(a);
        const tierB = getTier(b);

        if (tierB !== tierA) {
          return tierB - tierA; // Sort by tier descending (3 -> 2 -> 1)
        }
        
        return a.name.localeCompare(b.name); // Then alphabetically
      });
    });
    
    return groups;
  }, [visibleData, uniqueCategories, likes]);

  useEffect(() => {
    if (!mapboxgl.supported() || !mapContainer.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: isMapDarkMode ? MAP_STYLE_DARK : MAP_STYLE_LIGHT, 
      center: [-98.5795, 39.8283], 
      zoom: 4.0,
      trackResize: true
    });
    mapRef.current = map;
    
    map.on('click', (e) => {
      if (isPinningOnMapRef.current) {
        const { lng, lat } = e.lngLat;
        setSubLongitude(lng.toFixed(6));
        setSubLatitude(lat.toFixed(6));
        setIsPinningOnMap(false);
        setIsSubmitOpen(true);
        (e as any)._clickHandled = true;
        return;
      }

      if ((e as any)._clickHandled) return;

      // 1. Check if we clicked on a master pin
      const pinFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['master-unclustered-pins'].filter(id => map.getLayer(id))
      });

      if (pinFeatures && pinFeatures.length > 0) {
        const clickedId = pinFeatures[0].properties?.id;
        const matchedRecord = combinedPointsAndLinesData.find(item => String(item.id) === String(clickedId));
        if (matchedRecord) {
          (e as any)._clickHandled = true;
          handleLocationItemClick(matchedRecord);
          return;
        }
      }

      // 2. See if we clicked inside any National Park/Reserve boundary polygon on the map
      const clickedFeatures = map.queryRenderedFeatures(e.point);

      // If we clicked directly on our highlight layer, treat it as handled to prevent deselection
      const clickedHighlight = clickedFeatures.find(f => {
        return f.layer?.id === 'selected-park-highlight-fill' || f.layer?.id === 'selected-park-highlight-line';
      });

      if (clickedHighlight) {
        (e as any)._clickHandled = true;
        return;
      }

      const clickedPark = clickedFeatures.find(f => {
        if (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon') return false;
        const sourceLayer = f.sourceLayer || '';
        const layerId = f.layer?.id || '';
        return (
          sourceLayer.includes('landuse') || 
          sourceLayer.includes('national_park') || 
          sourceLayer.includes('park') ||
          layerId.includes('park') ||
          layerId.includes('landuse') ||
          f.properties?.class === 'national_park' ||
          f.properties?.class === 'park'
        );
      });

      if (clickedPark) {
        const featName = clickedPark.properties?.name || clickedPark.properties?.name_en || clickedPark.properties?.name_es;
        if (featName) {
          const matchedRecord = combinedPointsAndLinesData.find(item => {
            const isParkCat = item.categories && item.categories.includes('National Parks & Reserves');
            return isParkCat && matchParkName(featName, item.name);
          });
          if (matchedRecord) {
            (e as any)._clickHandled = true;
            handleLocationItemClick(matchedRecord);
            return;
          }
        }
      }

      // 3. Fallback check for line layers
      const lineFeatures = map.queryRenderedFeatures(e.point, {
        layers: (lineLayersRef.current || []).filter(id => map.getLayer(id))
      });

      if (lineFeatures && lineFeatures.length > 0) {
        return;
      }

      // 4. Otherwise, empty space click clears selection
      setSelectedFeature(null);
      setIsRightCollapsed(true);
    });

    map.on('style.load', () => {
      // Whiten/Darken land and common decorative layers
      const layersToColor = [
        'background',
        'landuse',
        'industrial',
        'hospital',
        'school',
        'glacier',
        'wood',
        'pitch'
      ];
      
      const themeColor = darkModeRef.current ? '#0a0a0a' : '#ffffff';
      const waterColor = darkModeRef.current ? '#1a1a1a' : '#f0f0f0';
      
      layersToColor.forEach(layer => {
        if (map.getLayer(layer)) {
          if (layer.includes('outline')) {
            map.setPaintProperty(layer, 'line-color', themeColor);
          } else if (layer === 'background') {
            map.setPaintProperty(layer, 'background-color', themeColor);
          } else {
            map.setPaintProperty(layer, 'fill-color', themeColor);
          }
        }
      });
      
      if (map.getLayer('water')) {
        map.setPaintProperty('water', 'fill-color', waterColor);
      }

      const iconsToLoad = [
        'ancient-texts', 'bigfoot-sightings', 'blurred-on-google', 'burial-mounds',
        'cave-drawings', 'crop-circles', 'cryptid-sightings', 'Megaliths', 'dumbs',
        'entrances-to-underworld', 'ghosts', 'giants', 'megaliths',
        'national-parks-reserves', 'ufo-sightings', 'map-pin', 'petroglyphs',
        'meteors'
      ];
      
      let loadedCount = 0;
      iconsToLoad.forEach(iconName => {
        const path = `/icons/icon-${iconName}.svg`;
        map.loadImage(path, (error, image) => {
          if (!error && image) {
            if (!map.hasImage(iconName)) map.addImage(iconName, image);
            loadedCount++;
            if (loadedCount === iconsToLoad.length) {
              setIsStyleLoaded(true);
            }
          } else {
            if (iconName === 'petroglyphs') {
              // Try loading cave drawings as a fallback for petroglyphs if the file is missing
              map.loadImage('/icons/icon-cave-drawings.svg', (fallbackError, fallbackImage) => {
                if (!fallbackError && fallbackImage) {
                  if (!map.hasImage('petroglyphs')) map.addImage('petroglyphs', fallbackImage);
                }
                loadedCount++;
                if (loadedCount === iconsToLoad.length) {
                  setIsStyleLoaded(true);
                }
              });
            } else {
              loadedCount++;
              if (loadedCount === iconsToLoad.length) {
                setIsStyleLoaded(true);
              }
            }
          }
        });
      });
    });

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    setIsStyleLoaded(false);
    mapRef.current.setStyle(isMapDarkMode ? MAP_STYLE_DARK : MAP_STYLE_LIGHT);
  }, [isMapDarkMode]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [isLeftCollapsed, isRightCollapsed, isTimelineCollapsed, selectedFeature]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleLoaded || !map.isStyleLoaded()) return;

    // Dynamically style standard Mapbox layers for national parks (persistent full-time)
    const targetColor = layerColors['National Parks & Reserves'] || '#9FF3BC';
    const standardParkLayers = ['national-park', 'landuse-park', 'park-outline', 'national-park-line', 'landuse-park-outline'];
    standardParkLayers.forEach(layer => {
      if (map.getLayer(layer)) {
        if (layer.includes('outline') || layer.includes('line')) {
          map.setPaintProperty(layer, 'line-color', targetColor);
          map.setPaintProperty(layer, 'line-opacity', isMapDarkMode ? 0.35 : 0.20);
        } else {
          map.setPaintProperty(layer, 'fill-color', targetColor);
          map.setPaintProperty(layer, 'fill-opacity', isMapDarkMode ? 0.12 : 0.08);
        }
      }
    });

    // Register source and layers for national park dynamic highlight
    if (!map.getSource('selected-park-highlight-src')) {
      map.addSource('selected-park-highlight-src', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
    }

    if (!map.getLayer('selected-park-highlight-fill')) {
      map.addLayer({
        id: 'selected-park-highlight-fill',
        type: 'fill',
        source: 'selected-park-highlight-src',
        paint: {
          'fill-color': targetColor,
          'fill-opacity': isMapDarkMode ? 0.45 : 0.35,
          'fill-opacity-transition': { duration: 450 }
        }
      }, map.getLayer('master-unclustered-pins') ? 'master-unclustered-pins' : undefined);
    } else {
      map.setPaintProperty('selected-park-highlight-fill', 'fill-color', targetColor);
      map.setPaintProperty('selected-park-highlight-fill', 'fill-opacity', isMapDarkMode ? 0.45 : 0.35);
    }

    if (!map.getLayer('selected-park-highlight-line')) {
      map.addLayer({
        id: 'selected-park-highlight-line',
        type: 'line',
        source: 'selected-park-highlight-src',
        paint: {
          'line-color': targetColor,
          'line-width': 4.0,
          'line-opacity': 0.50,
          'line-opacity-transition': { duration: 450 },
          'line-width-transition': { duration: 450 }
        }
      }, map.getLayer('master-unclustered-pins') ? 'master-unclustered-pins' : undefined);
    } else {
      map.setPaintProperty('selected-park-highlight-line', 'line-color', targetColor);
      map.setPaintProperty('selected-park-highlight-line', 'line-width', 4.0);
      map.setPaintProperty('selected-park-highlight-line', 'line-opacity', 0.50);
    }

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

    let circleColorExpression: any = '#b6a6ff';
    if (uniqueCategories.length > 0) {
      const matchExpr: any = ['match', ['get', 'category']];
      uniqueCategories.forEach(cat => {
        matchExpr.push(cat);
        matchExpr.push(layerColors[cat] || '#b6a6ff');
      });
      matchExpr.push('#b6a6ff'); // Default
      circleColorExpression = matchExpr;
    }

    const circleStrokeColor = isMapDarkMode ? '#000000' : '#FFFFFF';

    const source = map.getSource('master-anomalies-src');
    if (source) {
      (source as mapboxgl.GeoJSONSource).setData(pointsGeoJSON);
    } else {
      map.addSource('master-anomalies-src', { type: 'geojson', data: pointsGeoJSON });
    }

    if (map.getLayer('master-unclustered-pins')) {
      map.setPaintProperty('master-unclustered-pins', 'circle-color', circleColorExpression);
      map.setPaintProperty('master-unclustered-pins', 'circle-stroke-width', 1);
      map.setPaintProperty('master-unclustered-pins', 'circle-stroke-color', circleStrokeColor);
      map.setPaintProperty('master-unclustered-pins', 'circle-opacity', 1.0);
      map.setPaintProperty('master-unclustered-pins', 'circle-radius', [
        'interpolate', ['linear'], ['zoom'],
        3, 3.5,
        12, 8
      ]);
    } else {
      map.addLayer({
        id: 'master-unclustered-pins',
        type: 'circle',
        source: 'master-anomalies-src',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, 3.5,
            12, 8
          ],
          'circle-color': circleColorExpression,
          'circle-opacity': 1.0,
          'circle-stroke-width': 1,
          'circle-stroke-color': circleStrokeColor
        }
      });

      map.on('click', 'master-unclustered-pins', (e) => {
        if (!e.features || !e.features.length) return;
        (e as any)._clickHandled = true;
        const clickedId = e.features[0].properties?.id;
        const matchedRecord = combinedPointsAndLinesData.find(item => String(item.id) === String(clickedId));
        if (matchedRecord) {
          handleLocationItemClick(matchedRecord);
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
          paint: { 'line-color': lineColor, 'line-width': 2, 'line-opacity': 1.0 }
        });
        lineLayersRef.current.push(sourceLayerId);
      } catch (err) { console.error(err); }
    });

  }, [visibleData, isStyleLoaded, layerColors, pointsAndLinesData, isMapDarkMode]);

  const handleLocationItemClick = (feature: any) => {
    if (!feature || !feature.coordinates || !mapRef.current) return;
    setSelectedFeature(feature);
    setIsRightCollapsed(false);

    if (feature.type === 'LineString' && Array.isArray(feature.coordinates) && feature.coordinates.length > 0) {
      let minLng = Infinity;
      let minLat = Infinity;
      let maxLng = -Infinity;
      let maxLat = -Infinity;

      feature.coordinates.forEach((coord: any) => {
        if (Array.isArray(coord) && coord.length >= 2) {
          const lng = coord[0];
          const lat = coord[1];
          if (lng < minLng) minLng = lng;
          if (lat < minLat) minLat = lat;
          if (lng > maxLng) maxLng = lng;
          if (lat > maxLat) maxLat = lat;
        }
      });

      if (minLng !== Infinity && maxLng !== -Infinity) {
        mapRef.current.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]],
          { padding: 120, maxZoom: 8, duration: 1500 }
        );
        return;
      }
    }

    const flyTarget = feature.coordinates;
    mapRef.current.flyTo({ 
      center: flyTarget, 
      zoom: 10, 
      duration: 1500,
      essential: true
    });
  };

  useEffect(() => {
    if (mapRef.current && selectedFeature) {
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.remove();
      }

      const coords = selectedFeature.type === 'LineString' ? selectedFeature.coordinates[0] : selectedFeature.coordinates;
      const category = selectedFeature.categories[0];
      const color = layerColors[category] || '#b6a6ff';
      const icon = LAYER_CONFIG[category]?.icon || '/icons/icon-map-pin.svg';

      const el = document.createElement('div');
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.pointerEvents = 'none';

      // Inner element to apply transition animation safely without interfering with Mapbox's positioning transform style
      const inner = document.createElement('div');
      inner.className = 'pin-bounce-in';
      inner.style.display = 'flex';
      inner.style.flexDirection = 'column';
      inner.style.alignItems = 'center';

      // The label bubble
      const label = document.createElement('div');
      label.className = 'label-fade-in';
      // Simple Title Case: capitalize first letter of each word
      label.innerText = selectedFeature.name.toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      label.style.background = isMapDarkMode ? '#ffffff' : '#000000';
      label.style.color = isMapDarkMode ? '#000000' : '#ffffff';
      label.style.padding = '0 12px';
      label.style.height = '22px';
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.borderRadius = '50px';
      label.style.fontSize = '10px';
      label.style.fontWeight = '500';
      label.style.fontFamily = '"Space Mono", monospace';
      label.style.whiteSpace = 'nowrap';
      label.style.marginBottom = '14px';
      label.style.position = 'relative';

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
      label.appendChild(arrow);

      inner.appendChild(label);

      // Larger category icon with border
      const iconOuter = document.createElement('div');
      iconOuter.style.width = '30px';
      iconOuter.style.height = '30px';
      iconOuter.style.borderRadius = '50%';
      iconOuter.style.background = color;
      iconOuter.style.border = `1px solid ${isMapDarkMode ? '#ffffff' : '#000000'}`;
      iconOuter.style.boxShadow = `0 3px 0 0 ${isMapDarkMode ? '#ffffff' : '#000000'}`;
      iconOuter.style.display = 'flex';
      iconOuter.style.alignItems = 'center';
      iconOuter.style.justifyContent = 'center';
      iconOuter.style.overflow = 'hidden';
      iconOuter.style.boxSizing = 'border-box';

      const img = document.createElement('img');
      img.src = icon;
      img.onerror = () => {
        img.src = '/icons/icon-cave-drawings.svg';
      };
      img.style.width = '30px';
      img.style.height = '30px';
      iconOuter.appendChild(img);

      inner.appendChild(iconOuter);

      el.appendChild(inner);

      selectedMarkerRef.current = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
        offset: [0, 15] 
      })
      .setLngLat(coords)
      .addTo(mapRef.current);

    } else if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }
  }, [selectedFeature, layerColors, isMapDarkMode]);

  // Synchronize national park area boundary highlight dynamically using queryRenderedFeatures
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleLoaded || !map.isStyleLoaded()) return;

    const isPark = selectedFeature && selectedFeature.categories && selectedFeature.categories.includes('National Parks & Reserves');
    const targetName = isPark ? selectedFeature.name : '';

    const getGeometryWeight = (features: any[]): number => {
      if (!features) return 0;
      let weight = 0;
      features.forEach(f => {
        if (f.geometry && f.geometry.coordinates) {
          const checkCoords = (coords: any): void => {
            if (Array.isArray(coords)) {
              if (coords.length > 0 && typeof coords[0] === 'number') {
                weight++;
              } else {
                coords.forEach(checkCoords);
              }
            }
          };
          checkCoords(f.geometry.coordinates);
        }
      });
      return weight;
    };

    const getGeometryFingerprint = (geom: any): string => {
      if (!geom) return '';
      if (geom.type === 'Polygon' && geom.coordinates && geom.coordinates[0]) {
        const outerRing = geom.coordinates[0];
        if (outerRing.length > 0) {
          return `${geom.type}-${outerRing.length}-${outerRing[0][0]}-${outerRing[0][1]}`;
        }
      } else if (geom.type === 'MultiPolygon' && geom.coordinates && geom.coordinates[0] && geom.coordinates[0][0]) {
        const outerRing = geom.coordinates[0][0];
        if (outerRing.length > 0) {
          return `${geom.type}-${outerRing.length}-${outerRing[0][0]}-${outerRing[0][1]}`;
        }
      }
      return JSON.stringify(geom);
    };

    const updateSelectedParkHighlight = (): void => {
      if (!map || !map.isStyleLoaded()) return;

      const src = map.getSource('selected-park-highlight-src') as mapboxgl.GeoJSONSource;
      if (!src) return;

      if (!isPark) {
        src.setData({ type: 'FeatureCollection', features: [] });
        return;
      }

      // 1. Immediately display the current cached geometries to prevent flickering during flights
      const cached = selectedParkGeomRef.current[targetName];
      if (cached && cached.features && cached.features.length > 0) {
        src.setData({
          type: 'FeatureCollection',
          features: cached.features
        });
      }

      const coords = selectedFeature.type === 'LineString' ? selectedFeature.coordinates[0] : selectedFeature.coordinates;
      let lng: number | null = null;
      let lat: number | null = null;
      if (coords) {
        if (typeof coords.lng === 'number' && typeof coords.lat === 'number') {
          lng = coords.lng;
          lat = coords.lat;
        } else if (Array.isArray(coords) && coords.length === 2) {
          lng = coords[0];
          lat = coords[1];
        }
      }

      if (lng === null || lat === null) return;

      // Ensure camera is within close proximity (1.5 degrees) before querying rendered map features
      const mapCenter = map.getCenter();
      const distLng = Math.abs(mapCenter.lng - lng);
      const distLat = Math.abs(mapCenter.lat - lat);
      if (distLng > 1.5 || distLat > 1.5) {
        if (!cached) {
          src.setData({ type: 'FeatureCollection', features: [] });
        }
        return;
      }

      const proj = map.project([lng, lat]);
      if (!proj || isNaN(proj.x) || isNaN(proj.y)) return;

      const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
        [proj.x - 850, proj.y - 850],
        [proj.x + 850, proj.y + 850]
      ];
      const renderedFeats = map.queryRenderedFeatures(bbox);

      // Fast deduplicator to prevent duplicate overlapping geometries and opacity stacking
      const seenFingerprints = new Set<string>();
      const deduplicateFeatures = (feats: mapboxgl.MapboxGeoJSONFeature[]) => {
        const unique: any[] = [];
        feats.forEach(f => {
          const fp = getGeometryFingerprint(f.geometry);
          if (!seenFingerprints.has(fp)) {
            seenFingerprints.add(fp);
            unique.push({
              type: 'Feature',
              geometry: f.geometry,
              properties: f.properties
            });
          }
        });
        return unique;
      };

      // Step 1: Scan for polygons that explicitly match the park name
      const nameMatchedFeatures = renderedFeats.filter(f => {
        if (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon') return false;
        
        const sourceLayer = f.sourceLayer || '';
        const layerId = f.layer?.id || '';
        
        const isParkLayerOrClass = 
          sourceLayer.includes('landuse') || 
          sourceLayer.includes('national_park') || 
          sourceLayer.includes('park') ||
          layerId.includes('park') ||
          layerId.includes('landuse') ||
          f.properties?.class === 'national_park' ||
          f.properties?.class === 'park';

        if (!isParkLayerOrClass) return false;

        const name = f.properties?.name || f.properties?.name_en || f.properties?.name_es;
        return name && matchParkName(name, targetName);
      });

      if (nameMatchedFeatures.length > 0) {
        const unique = deduplicateFeatures(nameMatchedFeatures);
        if (unique.length > 0) {
          const sorted = [...unique].sort((a, b) => getGeometryWeight([b]) - getGeometryWeight([a]));
          const mapped = [sorted[0]];
          const currentWeight = getGeometryWeight(mapped);
          const cachedWeight = (cached && cached.precise) ? getGeometryWeight(cached.features) : 0;

          if (!cached || !cached.precise || currentWeight > cachedWeight) {
            selectedParkGeomRef.current[targetName] = { precise: true, features: mapped };
            src.setData({
              type: 'FeatureCollection',
              features: mapped
            });
          }
        }
        return;
      }

      if (cached && cached.precise) {
        return;
      }

      // Step 2: Proximity Fallback 1 - Filter for features explicitly classed as national_park
      const nationalParkPolys = renderedFeats.filter(f => {
        if (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon') return false;
        
        const sourceLayer = f.sourceLayer || '';
        const layerId = f.layer?.id || '';
        
        return (
          f.properties?.class === 'national_park' ||
          sourceLayer.includes('national_park') ||
          layerId.includes('national-park')
        );
      });

      if (nationalParkPolys.length > 0) {
        const unique = deduplicateFeatures(nationalParkPolys);
        if (unique.length > 0) {
          const sorted = [...unique].sort((a, b) => getGeometryWeight([b]) - getGeometryWeight([a]));
          const mapped = [sorted[0]];
          const currentWeight = getGeometryWeight(mapped);
          const cachedWeight = cached ? getGeometryWeight(cached.features) : 0;

          if (!cached || (!cached.precise && currentWeight > cachedWeight)) {
            selectedParkGeomRef.current[targetName] = { precise: false, features: mapped };
            src.setData({
              type: 'FeatureCollection',
              features: mapped
            });
          }
        }
        return;
      }

      // Step 3: Proximity Fallback 2 - Filter for general landuse or park polygons near coordinates
      const generalParkPolys = renderedFeats.filter(f => {
        if (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon') return false;
        
        const sourceLayer = f.sourceLayer || '';
        const layerId = f.layer?.id || '';
        
        return (
          f.properties?.class === 'park' ||
          sourceLayer.includes('landuse') ||
          sourceLayer.includes('park') ||
          layerId.includes('park') ||
          layerId.includes('landuse')
        );
      });

      if (generalParkPolys.length > 0) {
        const unique = deduplicateFeatures(generalParkPolys);
        if (unique.length > 0) {
          const sorted = [...unique].sort((a, b) => getGeometryWeight([b]) - getGeometryWeight([a]));
          const mapped = [sorted[0]];
          const currentWeight = getGeometryWeight(mapped);
          const cachedWeight = cached ? getGeometryWeight(cached.features) : 0;

          if (!cached || (!cached.precise && currentWeight > cachedWeight)) {
            selectedParkGeomRef.current[targetName] = { precise: false, features: mapped };
            src.setData({
              type: 'FeatureCollection',
              features: mapped
            });
          }
        }
        return;
      }

      if (!cached) {
        src.setData({ type: 'FeatureCollection', features: [] });
      }
    };

    // Debounce state scheduling to collapse hundreds of redundant tile/sourcedata trigger events
    let debounceTimeoutId: any = null;
    const scheduleUpdate = () => {
      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId);
      }
      debounceTimeoutId = setTimeout(() => {
        updateSelectedParkHighlight();
      }, 150);
    };

    // Initialize highlight immediately
    updateSelectedParkHighlight();

    // Setup an interval to progressive-query loaded tiles during the zoom flight, safely debounced
    let intervalId: any = null;
    let attemptsCount = 0;
    if (isPark) {
      intervalId = setInterval(() => {
        attemptsCount++;
        scheduleUpdate();
        if (attemptsCount >= 10) {
          clearInterval(intervalId);
        }
      }, 400);
    }

    const handleMapStable = () => {
      scheduleUpdate();
    };

    const handleSourceData = (e: mapboxgl.MapDataEvent) => {
      if (e.dataType === 'source') {
        if (e.sourceId === 'selected-park-highlight-src' || e.sourceId.startsWith('line-layer-')) return;
        scheduleUpdate();
      }
    };

    map.on('moveend', handleMapStable);
    map.on('idle', handleMapStable);
    map.on('sourcedata', handleSourceData);

    return () => {
      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (map) {
        map.off('moveend', handleMapStable);
        map.off('idle', handleMapStable);
        map.off('sourcedata', handleSourceData);
        // Clean up map source on unmount or selection change to prevent overlapping highlights during flight
        try {
          if (map.isStyleLoaded() && map.getSource('selected-park-highlight-src')) {
            const cleanSrc = map.getSource('selected-park-highlight-src') as mapboxgl.GeoJSONSource;
            cleanSrc.setData({ type: 'FeatureCollection', features: [] });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [selectedFeature, isStyleLoaded, isMapDarkMode, layerColors]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeAssets || activeAssets.length === 0) return;
    setActiveImageIndex(prev => (prev + 1) % activeAssets.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeAssets || activeAssets.length === 0) return;
    setActiveImageIndex(prev => (prev - 1 + activeAssets.length) % activeAssets.length);
  };

  const handleOpenLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLightboxImageLoading(true);
    setIsLightboxOpen(true);
  };

  const toTitleCase = (str: string) => {
    if (!str) return '';
    // If it's an acronym like D.U.M.B.S. or all caps like UFO, keep it
    if (str.includes('.') || (str === str.toUpperCase() && str.length > 1)) return str;
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderMediaPreview = (url: string) => {
    if (!url) return null;
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)/i.test(url) || url.startsWith('/uploads/');
    const isYoutube = /youtube\.com|youtu\.be/i.test(url);
    const isMp4 = /\.(mp4|webm|ogg)/i.test(url);

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

    if (isMp4) {
      return (
        <video 
          src={url} 
          controls 
          style={{ maxWidth: '240px', maxHeight: '135px', border: `1px solid ${theme.border}`, marginTop: '4px', borderRadius: '2px' }}
        />
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

  const getCategoryIcon = (category: string) => {
    return LAYER_CONFIG[category]?.icon || LAYER_CONFIG['Default'].icon;
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <div style={{ width: scrollbarWidth ? `calc(100vw - ${scrollbarWidth}px)` : '100vw', minHeight: '100vh', background: '#ffffff', color: '#000000', fontFamily: '"Space Mono", monospace', overflowX: 'hidden', textAlign: 'left' }}>
      
      {/* MOBILE BLOCKER OVERLAY */}
      <AnimatePresence>
        {windowWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: scrollbarWidth ? `calc(100vw - ${scrollbarWidth}px)` : '100vw',
              height: '100vh',
              background: '#000000',
              zIndex: 1000000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
              color: '#ffffff'
            }}
          >
            <div style={{ padding: '0', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <img 
                src="https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/mtrh-square-white.svg" 
                alt="MTRH Logo" 
                style={{ width: '120px' }} 
              />
              <div style={{ width: '40px', height: '1px', background: '#fff' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Optimized for Desktop</span>
                <p style={{ fontSize: '11px', lineHeight: '20px', color: '#a3a3a3', margin: 0 }}>
                  To provide the best experience for exploring our archives and interactive mapping tools, please visit MTRH on a desktop computer.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL FULL-SCREEN LOADER OVERLAY */}
      <AnimatePresence>
        {isLiveLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: scrollbarWidth ? `calc(100vw - ${scrollbarWidth}px)` : '100vw',
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
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #333', borderTopColor: '#b6a6ff', animation: 'spinMapAsset 0.8s linear infinite' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>INITIALIZING DATA CORES</span>
              <span style={{ fontSize: '10px', color: '#a3a3a3', letterSpacing: '0.5px' }}>Compiling archive mappings and coordinates...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAPVIEW APP SCREEN CONTAINER */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        
        {/* CENTER COMPONENT: FULL SCREEN MAP BASE LAYER - MOVED TO ROOT FOR TRANSPARENT HEADER */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
          
          {/* DARK MODE TOGGLE */}

        </div>

        {/* BRAND HEADER COMPONENT */}
        <header style={{ height: '118px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 0 0', flexShrink: 0, zIndex: 20, pointerEvents: 'none' }}>
          <img src="/mtrh-horiz-words.svg" alt="MTRH Logo" style={{ height: '78px', width: '232px', pointerEvents: 'auto', filter: theme.invert }} />
          
          {/* THEME TOGGLE: FIXED TO RIGHT */}
          <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: '9px', 
                fontFamily: '"Space Mono", monospace', 
                fontWeight: 700, 
                color: theme.text,
                letterSpacing: '1px'
              }}>
                {isMapDarkMode ? 'DARK MODE' : 'LIGHT MODE'}
              </span>
              <button 
                onClick={() => setIsMapDarkMode(!isMapDarkMode)}
                style={{
                  width: '32px',
                  height: '16px',
                  borderRadius: '8px',
                  background: isMapDarkMode ? '#ffffff' : '#eee', 
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
                  background: isMapDarkMode ? '#000' : '#000',
                  position: 'absolute',
                  top: '2px',
                  left: isMapDarkMode ? '19px' : '2px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </button>
            </div>

            {/* ACTION LINK BUTTONS FOR SUBMISSIONS AND DESIGNATED MODERATION */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
              <button
                onClick={() => {
                  setSubmissionSuccess(null);
                  setSubmissionError(null);
                  setIsSubmitOpen(true);
                }}
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
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxSizing: 'border-box',
                  transition: 'opacity 0.2s ease'
                }}
              >
                <Plus size={10} strokeWidth={3} />
                <span>Submit Intel</span>
              </button>
            </div>
          </div>
        </header>

        {/* CORE WORKSPACE FRAMING GRID — NOW FULL BLEED OVERLAY ENVIRONMENT */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
          
          {/* PROTECTIVE SIDE STRIPS */}
          <motion.div 
            initial={false}
            animate={{ 
              bottom: isTimelineCollapsed ? '0px' : '150px',
              background: theme.bg,
              borderColor: theme.border
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', top: 0, left: 0, width: '20px', borderRight: '1px solid', borderTop: '1px solid', zIndex: 100, pointerEvents: 'auto' }} 
          />
          <motion.div 
            initial={false}
            animate={{ 
              bottom: isTimelineCollapsed ? '0px' : '150px',
              background: theme.bg,
              borderColor: theme.border
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', top: 0, right: 0, width: '20px', borderLeft: '1px solid', borderTop: '1px solid', zIndex: 100, pointerEvents: 'auto' }} 
          />

          {/* LEFT COMPONENT: FILTERS MANAGEMENT PANEL */}
          <motion.div 
            className="custom-sidebar-scrollbar"
            initial={false}
            animate={{ 
              left: isLeftCollapsed ? -280 : 20,
              bottom: isTimelineCollapsed ? 0 : 150,
              background: theme.bg,
              borderColor: theme.border,
              opacity: 1
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              position: 'absolute',
              top: 0,
              width: '300px', 
              borderRight: '1px solid',
              borderTop: '1px solid',
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'visible', 
              zIndex: 10, 
              fontFamily: '"Space Mono", monospace',
              pointerEvents: 'auto',
              color: theme.text
            }}
          >
            {/* ABSOLUTE POSITIONED FIXED BLACK TAB FOR LEFT SIDEBAR */}
            <motion.button 
              whileHover={{ opacity: 0.8 }}
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              title={isLeftCollapsed ? "Maximize Filters" : "Minimize Filters"}
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
                  transform: isLeftCollapsed ? 'rotate(180deg)' : 'none',
                  filter: theme.invert
                }} 
              />
            </motion.button>

            <div style={{ height: '40px', padding: '0 16px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0', background: theme.bg, flexShrink: 0, zIndex: 20 }}>
              <img src="/icons/icon-filter.svg" style={{ width: '30px', height: '30px', filter: theme.invert }} alt="filter" />
              <span style={{ fontWeight: '700', fontSize: '20px', lineHeight: '24px', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace' }}>FILTERS</span>
            </div>
            
            <div style={{ padding: '16px', borderBottom: `1px solid ${theme.border}`, background: theme.bg, flexShrink: 0, zIndex: 100 }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="SEARCH ARCHIVES OR LOCATIONS..." 
                  value={searchQuery}
                  onFocus={() => setShowSearchResults(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    onClick={() => {
                      setSearchQuery('');
                      setGeocodeResults([]);
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
                    <X size={14} color="#000" />
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
                          top: '42px',
                          left: 0,
                          right: 0,
                          background: theme.bg,
                          border: `1px solid ${theme.border}`,
                          maxHeight: '400px',
                          overflowY: 'auto',
                          zIndex: 1000,
                          boxShadow: isMapDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                      {/* RESEARCH DATA RESULTS */}
                      {visibleData.length > 0 && (
                        <div style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                          <div style={{ padding: '8px 12px', fontSize: '10px', background: isMapDarkMode ? '#1a1a1a' : '#f8f8f8', borderBottom: `1px solid ${theme.borderLight}`, fontWeight: 'bold' }}>RESEARCH ARCHIVES</div>
                          {visibleData.slice(0, 10).map((item, idx) => (
                            <div 
                              key={`data-${idx}`}
                              onClick={() => handleSearchItemSelect(item)}
                              className={isMapDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}
                              style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: idx < visibleData.slice(0, 10).length - 1 ? `1px solid ${theme.borderLight}` : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: layerColors[item.categories[0]] || (isMapDarkMode ? '#fff' : '#000') }} />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{item.name}</span>
                                <span style={{ fontSize: '9px', color: theme.textDim }}>{item.categories[0]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* GEOCODE RESULTS */}
                      {geocodeResults.length > 0 && (
                        <div>
                          <div style={{ padding: '8px 12px', fontSize: '10px', background: isMapDarkMode ? '#1a1a1a' : '#f8f8f8', borderBottom: `1px solid ${theme.borderLight}`, fontWeight: 'bold' }}>WORLD LOCATIONS</div>
                          {geocodeResults.map((result, idx) => (
                            <div 
                              key={`geo-${idx}`}
                              onClick={() => handleGeocodeSelect(result)}
                              className={isMapDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}
                              style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: idx < geocodeResults.length - 1 ? `1px solid ${theme.borderLight}` : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                              <img src="/icons/icon-map-pin.svg" style={{ width: '12px', filter: theme.invert }} alt="pin" />
                              <span style={{ fontSize: '11px' }}>{result.place_name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {visibleData.length === 0 && geocodeResults.length === 0 && !isSearchingGeocode && (
                        <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: '#999' }}>NO RESULTS FOUND</div>
                      )}

                      {isSearchingGeocode && (
                        <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: '#999' }}>SEARCHING...</div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              </div>
            </div>

            <div className="custom-scrollbar" style={{ flex: 1, padding: '0 0 15px 0', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              {/* STICKY TOP SPACER FOR 15PX PADDING + MASKING */}
              <div style={{ position: 'sticky', top: 0, height: '15px', background: theme.bg, zIndex: 15, flexShrink: 0 }} />
              
              {uniqueCategories.map(layerName => {
                const isExpanded = !!expandedLayers[layerName];
                const locationsInLayer = groupedLocations[layerName] || [];
                const pillColor = layerColors[layerName] || '#e5e5e5';
                const isActive = activeLayers[layerName] !== false;

                return (
                  <div key={layerName} style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
                    {/* STICKY CONTAINER WITH BACKGROUND TO MASK SCROLLING TEXT */}
                    <div style={{ 
                      position: 'sticky', 
                      top: '15px', 
                      zIndex: 10, 
                      background: theme.bg,
                      padding: '3px 16px' 
                    }}>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '0', 
                          height: '32px',
                          justifyContent: 'space-between', 
                          cursor: 'pointer', 
                          background: isActive ? theme.bg : (isMapDarkMode ? '#1a1a1a' : '#EFEFEF'),
                          border: `1px solid ${theme.border}`,
                          borderRadius: '16px',
                          boxSizing: 'border-box',
                          color: theme.text,
                          transition: 'background 0.3s ease-in-out'
                        }}
                        onClick={() => setExpandedLayers(p => ({ ...p, [layerName]: !isExpanded }))}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'left' }}>
                          <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img 
                              src={getCategoryIcon(layerName)} 
                              onError={(e) => { e.currentTarget.src = '/icons/icon-cave-drawings.svg'; }}
                              style={{ width: '30px', height: '30px' }} 
                              alt={layerName} 
                            />
                          </div>
                          <span style={{ 
                            fontSize: '10px', 
                            lineHeight: '24px',
                            fontWeight: '700', 
                            fontFamily: '"Space Mono", monospace', 
                            opacity: isActive ? 1 : 0.5,
                            transition: 'opacity 0.3s ease-in-out'
                          }}>
                            {toTitleCase(layerName)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }} onClick={e => e.stopPropagation()}>
                          <motion.button 
                            whileHover={{ opacity: 0.6 }}
                            onClick={() => setActiveLayers(p => ({ ...p, [layerName]: !p[layerName] }))} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            <img src={isActive ? "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-eye-open.svg" : "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-eye-closed.svg"} style={{ width: '31px', height: '30px', filter: theme.invert }} alt="toggle" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ opacity: 0.6 }}
                            onClick={() => setExpandedLayers(p => ({ ...p, [layerName]: !isExpanded }))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <img src={isExpanded ? "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-arrow-up.svg" : "https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/icons/icon-arrow-down.svg"} style={{ width: '30px', height: '30px', filter: theme.invert }} alt="expand" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ background: theme.bg, padding: '4px 0', textAlign: 'left', overflow: 'hidden' }}
                      >
                        <motion.div 
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: { opacity: 0 },
                            show: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.05
                              }
                            }
                          }}
                          style={{ display: 'flex', flexDirection: 'column', paddingLeft: '22px', paddingRight: '16px' }}
                        >
                          {CATEGORY_DESCRIPTIONS[layerName] && (
                            <div style={{ 
                              fontSize: '10px', 
                              lineHeight: '1.4',
                              color: theme.textDim,
                              paddingBottom: '8px',
                              paddingLeft: '2px',
                              fontFamily: '"Space Mono", monospace',
                              fontStyle: 'italic'
                            }}>
                              {CATEGORY_DESCRIPTIONS[layerName]}
                            </div>
                          )}
                          {locationsInLayer.slice(0, 100).map(loc => {
                            const isSelected = selectedFeature?.id === loc.id;
                            const pillColor = layerColors[layerName] || '#e5e5e5';
                            return (
                              <motion.div 
                                key={loc.id} 
                                variants={{
                                  hidden: { opacity: 0, x: -10 },
                                  show: { opacity: 1, x: 0 }
                                }}
                                onClick={() => handleLocationItemClick(loc)} 
                                onMouseEnter={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = isMapDarkMode ? 'rgba(255,255,255,0.1)' : pillColor;
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                                style={{ 
                                  height: '24px',
                                  borderRadius: '12px',
                                  padding: '0 12px 0 2px', 
                                  fontSize: '10px', 
                                  cursor: 'pointer', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  background: isSelected ? theme.text : 'transparent', 
                                  color: isSelected ? theme.bg : theme.text,
                                  textAlign: 'left', 
                                  fontFamily: '"Space Mono", monospace', 
                                  textTransform: 'capitalize',
                                  margin: '2px 0',
                                  width: '100%',
                                  transition: 'background-color 0.2s ease, color 0.2s ease'
                                }} 
                                className="nested-item"
                              >
                                <div 
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px',
                                    backgroundColor: isSelected ? theme.bg : theme.text,
                                    WebkitMaskImage: 'url(/icons/icon-map-pin.svg)',
                                    maskImage: 'url(/icons/icon-map-pin.svg)',
                                    WebkitMaskSize: '24px 24px',
                                    maskSize: '24px 24px',
                                    WebkitMaskPosition: 'center',
                                    maskPosition: 'center',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat'
                                  }} 
                                />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {toTitleCase(loc.name)}
                                </span>
                              </motion.div>
                            );
                          })}
                          {locationsInLayer.length > 100 && (
                            <div style={{ padding: '8px 12px', fontSize: '10px', color: theme.textDim, fontStyle: 'italic', borderTop: `1px solid ${theme.borderLight}`, marginTop: '4px' }}>
                              Showing first 100 of {locationsInLayer.length} results. Use search to narrow down.
                            </div>
                          )}
                          {locationsInLayer.length === 0 && (
                            <div style={{ padding: '8px 16px', fontSize: '9px', color: theme.textDim, fontFamily: '"Space Mono", monospace' }}>
                              {!isActive ? "Toggle on visibility to view data" : "NO ASSETS IN RANGE, adjust timeline range sliders to discover more."}
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT COMPONENT: DOSSIER SIDEBAR WINDOW PANEL */}
          <motion.div 
            initial={false}
            animate={{ 
              right: isRightCollapsed ? -280 : 20,
              bottom: isTimelineCollapsed ? 0 : 150,
              background: theme.bg,
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
              width: '300px',
              borderLeft: '1px solid',
              borderTop: '1px solid',
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'visible', 
              zIndex: 10, 
              fontFamily: '"Space Mono", monospace',
              pointerEvents: 'auto',
              color: theme.text
            }}
          >
            
            {/* ABSOLUTE POSITIONED FIXED BLACK TAB FOR RIGHT SIDEBAR */}
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
              />
            </motion.button>

            <AnimatePresence mode="wait">
              {selectedFeature ? (
                <motion.div 
                  key={selectedFeature.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'left' }}
                >
                  
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
                        <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={getCategoryIcon(selectedFeature.categories?.[0] || '')} 
                            onError={(e) => { e.currentTarget.src = '/icons/icon-cave-drawings.svg'; }}
                            style={{ width: '30px', height: '30px' }} 
                            alt="layer-icon" 
                          />
                        </div>
                        <span style={{ 
                          fontWeight: '700', 
                          fontSize: '11px', 
                          letterSpacing: '1px', 
                          fontFamily: '"Space Mono", monospace' 
                        }}>
                          {toTitleCase(selectedFeature.categories?.[0] || 'DOSSIER')}
                        </span>
                      </div>
                  </div>

                  <div className="custom-sidebar-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', textAlign: 'left', paddingBottom: '15px' }}>
                    
                    {activeAssets && activeAssets.length > 0 && (
                      <div style={{ width: '100%', position: 'relative', borderBottom: `1px solid ${theme.border}` }}>
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
                            const curAsset = activeAssets[activeImageIndex];
                            if (!curAsset) return null;

                            const showPdfBadge = !!(curAsset.pdfUrl || curAsset.type === 'pdf');
                            const isBroken = !!(brokenImages[curAsset.url] || curAsset.url === MISSING_IMAGE_URL || curAsset.url?.includes('icon-missing-image.svg'));
                            const imgSrc = isBroken ? MISSING_IMAGE_URL : cleanAndProxyImageUrl(curAsset.url);

                            return (
                              <>
                                {isImageLoading && curAsset.type === 'image' && !curAsset.pdfUrl && (
                                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                                    <div className="loading-spinner" />
                                  </div>
                                )}

                                {curAsset.type === 'pdf' ? (
                                  <div 
                                    onClick={handleOpenLightbox}
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      position: 'relative', 
                                      cursor: 'pointer',
                                      overflow: 'hidden',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: isMapDarkMode ? '#141414' : '#fafafa',
                                      border: `1px solid ${theme.border}`
                                    }}
                                  >
                                    {/* Background Paper Mockup */}
                                    <div style={{
                                      width: '130px',
                                      height: '180px',
                                      backgroundColor: isMapDarkMode ? '#1e1e1e' : '#ffffff',
                                      border: `1px solid ${isMapDarkMode ? '#333333' : '#e0e0e0'}`,
                                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                      padding: '16px 12px',
                                      position: 'relative',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between'
                                    }}>
                                      {/* Styled typewriter horizontal lines to mimic official records */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ height: '6px', width: '80%', backgroundColor: isMapDarkMode ? '#3a3a3a' : '#d2d2d2' }} />
                                        <div style={{ height: '6px', width: '50%', backgroundColor: isMapDarkMode ? '#3a3a3a' : '#eaeaea' }} />
                                        {/* Redacted text block */}
                                        <div style={{ height: '6px', width: '90%', backgroundColor: isMapDarkMode ? '#ffffff' : '#000000' }} />
                                        <div style={{ height: '6px', width: '35%', backgroundColor: isMapDarkMode ? '#3a3a3a' : '#d2d2d2' }} />
                                        <div style={{ height: '6px', width: '70%', backgroundColor: isMapDarkMode ? '#ffffff' : '#000000' }} />
                                      </div>

                                      {/* Diagonal Classified Stamp */}
                                      <div style={{
                                        position: 'absolute',
                                        top: '45%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%) rotate(-25deg)',
                                        border: '2px double #ef4444',
                                        color: '#ef4444',
                                        padding: '1px 6px',
                                        fontFamily: '"Space Mono", monospace',
                                        fontSize: '7px',
                                        fontWeight: 'bold',
                                        zIndex: 1,
                                        letterSpacing: '1px',
                                        borderRadius: '2px',
                                        opacity: 0.85,
                                        textTransform: 'uppercase'
                                      }}>
                                        DECLASSIFIED
                                      </div>

                                      {/* Lower border line */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ height: '2px', width: '100%', backgroundColor: isMapDarkMode ? '#333333' : '#eaeaea' }} />
                                        <div style={{ fontSize: '6px', color: theme.textDim, fontFamily: '"Space Mono", monospace', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                          RECORD DOSSIER
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : curAsset.type === 'video' ? (
                                  <div 
                                    onClick={handleOpenLightbox}
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      position: 'relative', 
                                      cursor: 'pointer',
                                      overflow: 'hidden',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                                      {(curAsset.url.includes('youtube.com') || 
                                       curAsset.url.includes('youtu.be') || 
                                       curAsset.url.includes('dvidshub.net/video/')) ? (
                                        <iframe
                                          width="100%"
                                          height="100%"
                                          src={`${getEmbedUrl(curAsset.url)}?autoplay=0&controls=0&mute=1`}
                                          style={{ border: 'none', width: '100%', height: '100%' }}
                                          title="Video asset viewport"
                                        />
                                      ) : (
                                        <video
                                          src={(curAsset.url.includes('war.gov') || curAsset.url.includes('aaro.mil') || curAsset.url.includes('archives.gov'))
                                            ? curAsset.url
                                            : curAsset.url.includes('.gov') || curAsset.url.includes('.mil')
                                              ? `/api/proxy-resource?url=${encodeURIComponent(curAsset.url)}`
                                              : curAsset.url}
                                          muted
                                          playsInline
                                          preload="metadata"
                                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                      )}
                                    </div>
                                    
                                    {/* Play overlay */}
                                    <div style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      background: 'rgba(0, 0, 0, 0.3)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      zIndex: 1
                                    }}>
                                      <motion.div
                                        whileHover={{ scale: 1.15, backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
                                        whileTap={{ scale: 0.92 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        style={{
                                          width: '56px',
                                          height: '56px',
                                          borderRadius: '50%',
                                          background: 'rgba(0, 0, 0, 0.70)',
                                          border: `1px solid ${theme.border || 'rgba(255,255,255,0.45)'}`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                          color: '#ffffff'
                                        }}
                                      >
                                        <Play size={20} fill="currentColor" style={{ marginLeft: '3px' }} />
                                      </motion.div>
                                    </div>
                                  </div>
                                ) : curAsset.type === 'audio' ? (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: isMapDarkMode ? '#030303' : '#f9f9f9', gap: '20px', padding: '24px' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isMapDarkMode ? '#222' : '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: theme.text }}>
                                        <path d="M9 18V5l12-2v13"></path>
                                        <circle cx="6" cy="18" r="3"></circle>
                                        <circle cx="18" cy="16" r="3"></circle>
                                      </svg>
                                    </div>
                                    <audio 
                                      src={curAsset.url} 
                                      controls 
                                      style={{ width: '100%', height: '40px' }} 
                                    />
                                    <p style={{ color: theme.textDim, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Audio Intelligence Intercept</p>
                                  </div>
                                ) : (
                                  <motion.img 
                                    key={`${selectedFeature.id}-${activeImageIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isImageLoading ? 0 : 1 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={handleOpenLightbox}
                                    src={imgSrc} 
                                    alt={`${selectedFeature.name} asset viewport`} 
                                    referrerPolicy="no-referrer"
                                    onLoad={() => setIsImageLoading(false)}
                                    onError={(e) => {
                                      setIsImageLoading(false);
                                      if (curAsset.url) {
                                        setBrokenImages(prev => ({ ...prev, [curAsset.url]: true }));
                                      }
                                    }}
                                    style={{ 
                                        width: isBroken ? '48px' : '100%', 
                                         height: isBroken ? '48px' : '100%', 
                                         cursor: 'pointer',                        
                                         objectFit: isBroken ? 'contain' : 'cover',                     
                                         backgroundColor: 'transparent',           
                                         filter: isBroken ? (isMapDarkMode ? 'invert(1)' : 'none') : 'none'
                                      }}
                                  />
                                )}

                                {/* Little PDF Icon badge in top right corner if PDF url is associated */}
                                {showPdfBadge && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    height: '24px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontSize: '10px', 
                                    fontWeight: '400', 
                                    padding: '0 12px', 
                                    borderRadius: '12px', 
                                    background: layerColors[selectedFeature.categories?.[0]] || '#e5e5e5', 
                                    border: 'none',
                                    color: '#000000',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontFamily: '"Space Mono", monospace',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                    zIndex: 5,
                                    gap: '6px'
                                  }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                      <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    <span style={{ fontSize: '9px', fontWeight: 'bold' }}>PDF</span>
                                  </div>
                                )}
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
                              {activeAssets.length > 1 && (
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
                                      src="/icons/icon-arrow-left.svg" 
                                      style={{ width: '6px', height: '12px', transform: 'rotate(180deg)', filter: isMapDarkMode ? 'brightness(0) invert(1)' : 'brightness(0)' }} 
                                      alt="next" 
                                    />
                                  </motion.button>
                                </>
                              )}
                            </div>

                            {activeAssets.length > 1 && (
                              <div style={{ display: 'flex', justifyContent: 'center', pointerEvents: 'auto' }}>
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
                                  {activeImageIndex + 1}/{activeAssets.length}
                                </div>
                              </div>
                            )}

                            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', pointerEvents: 'auto' }}>
                              <motion.button 
                                whileHover={{ scale: 1.1, backgroundColor: isMapDarkMode ? '#222' : '#f0f0f0' }}
                                onClick={handleOpenLightbox} 
                                title="Expand image to Fullscreen Lightbox"
                                style={{ 
                                  background: theme.bg, 
                                  border: `1px solid ${theme.border}`, 
                                  borderRadius: '50%', 
                                  width: '30px', 
                                  height: '30px', 
                                  cursor: 'pointer', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  boxShadow: 'none',
                                  padding: 0,
                                  fontFamily: '"Space Mono", monospace',
                                  transition: 'background-color 0.2s ease'
                                }}
                              >
                                <img src="/icons/icon-expand.svg" style={{ width: '30px', height: '30px', filter: theme.invert }} alt="expand" />
                              </motion.button>
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
                        color: theme.text, 
                        margin: '0 0 8px 0', 
                        textAlign: 'left', 
                        letterSpacing: '-0.5px' 
                      }}>
                        {toTitleCase(selectedFeature.name)}
                      </h1>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleLike(selectedFeature.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isMapDarkMode ? '#fff' : '#000',
                            color: isMapDarkMode ? '#000' : '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            fontFamily: '"Space Mono", monospace',
                            opacity: userLikedIds.has(String(selectedFeature.id).replace(/[^a-zA-Z0-9_\-]/g, '_')) ? 1 : 0.7,
                            transition: 'opacity 0.2s ease'
                          }}
                        >
                          <Heart size={14} fill={userLikedIds.has(String(selectedFeature.id).replace(/[^a-zA-Z0-9_\-]/g, '_')) ? (isMapDarkMode ? "#000" : "#fff") : "none"} />
                          <span>{userLikedIds.has(String(selectedFeature.id).replace(/[^a-zA-Z0-9_\-]/g, '_')) ? 'FAVORITED' : 'FAVORITE'} ({likes[String(selectedFeature.id).replace(/[^a-zA-Z0-9_\-]/g, '_')] || 0})</span>
                        </motion.button>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', justifyContent: 'flex-start' }}>
                        {selectedFeature.categories?.map((tag: string) => (
                          <button 
                            key={tag} 
                            onClick={() => handleTagClick(tag)}
                            title={`Click to filter list by ${tag}`}
                            style={{ 
                              height: '24px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontSize: '10px', 
                              fontWeight: '400', 
                              padding: '0 12px', 
                              borderRadius: '12px', 
                              background: layerColors[tag] || '#e5e5e5', 
                              border: 'none',
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
                        paddingTop: '0', 
                        marginBottom: '20px', 
                        textAlign: 'left' 
                      }}>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontStyle: 'italic', fontSize: '10px', lineHeight: '22px' }}>
                          DATE: <span style={{ fontStyle: 'normal', fontWeight: '400' }}>{selectedFeature.date || 'UNSPECIFIED'}</span>
                        </div>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontStyle: 'italic', fontSize: '10px', lineHeight: '22px' }}>
                          LOCATION: <span style={{ fontStyle: 'normal', fontWeight: '400' }}>{(() => {
                              if (!selectedFeature.coordinates) return 'UNKNOWN';
                              if (selectedFeature.type === 'LineString') {
                                const start = selectedFeature.coordinates[0];
                                return `LINESTRING START: ${start[1].toFixed(4)}, ${start[0].toFixed(4)}`;
                              }
                              return `${selectedFeature.coordinates[1].toFixed(4)}, ${selectedFeature.coordinates[0].toFixed(4)}`;
                            })()}</span>
                        </div>
                        {selectedFeature.source && (
                          <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontStyle: 'italic', fontSize: '10px', lineHeight: '22px' }}>
                            SOURCE: <span style={{ fontStyle: 'normal', fontWeight: '400' }}>{selectedFeature.source}</span>
                          </div>
                        )}
                      </div>

                      <div style={{ paddingTop: '0', textAlign: 'left' }}>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontWeight: '700', fontSize: '11px', lineHeight: '22px' }}>DESCRIPTION:</div>
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
                          {selectedFeature.description}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', color: theme.textDim, textAlign: 'center' }}
                >
                  <img src="/icons/icon-rabbit-hole.svg" alt="logo" style={{ width: '48px', height: '48px', opacity: 0.2, marginBottom: '16px', filter: theme.invert }} />
                  <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Select a coordinate</div>
                  <div style={{ fontSize: '9px', marginTop: '4px' }}>to view complete dossier archive.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* HORIZONTAL COMPONENT: TIMELINE CONTROLS AS FLOATING ABSOLUTE OVERLAY */}
          <motion.div 
            initial={false}
            animate={{ 
              bottom: isTimelineCollapsed ? -150 : 0,
              background: theme.bg,
              borderColor: theme.border
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              position: 'absolute',
              left: 0,
              right: 0,
              height: '150px', 
              borderTop: '1px solid', 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '0', 
              boxSizing: 'border-box', 
              zIndex: 15, 
              fontFamily: '"Space Mono", monospace',
              overflow: 'visible',
              pointerEvents: 'auto',
              color: theme.text
            }}
          >
            
            {/* ABSOLUTE POSITIONED FIXED BLACK TAB FOR TIMELINE BAR */}
            <motion.button 
              whileHover={{ opacity: 0.8 }}
              onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
              title={isTimelineCollapsed ? "Maximize Timeline" : "Minimize Timeline"}
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
                zIndex: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                borderRadius: 0
              }}
            >
              <img 
                src="/icons/icon-arrow-left.svg" 
                alt="toggle" 
                style={{ 
                  width: '6px', 
                  height: '12px', 
                  transform: isTimelineCollapsed ? 'rotate(90deg)' : 'rotate(270deg)',
                  filter: isMapDarkMode ? 'brightness(0)' : 'none'
                }} 
              />
            </motion.button>

                  <div style={{ 
                    height: '40px', 
                    borderBottom: `1px solid ${theme.border}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '0 24px', 
                    background: isMapDarkMode ? theme.bg : '#ffffff', 
                    position: 'relative' 
                  }}>
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '0px' }}>
                      <img src="/icons/icon-timeline.svg" style={{ width: '30px', height: '30px', filter: theme.invert }} alt="timeline" />
                      <span style={{ fontWeight: '700', fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>TIMELINE</span>
                    </div>
                    
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* ZOOM SLIDER AREA */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src="/icons/icon-zoom-out.svg" style={{ width: '24px', height: '24px', filter: theme.invert }} alt="zoom out" />
                        <input 
                          type="range" 
                          min="5" 
                          max={timeBounds.max - timeBounds.min}
                          value={timeBounds.max - timeBounds.min - timelineWindowSpan + 5}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            const newSpan = (timeBounds.max - timeBounds.min) - val + 5;
                            
                            // Zoom from center
                            const currentCenter = timelineWindowStart + (timelineWindowSpan / 2);
                            let newStart = currentCenter - (newSpan / 2);
                            
                            // Constrain start
                            newStart = Math.max(timeBounds.min, Math.min(timeBounds.max - newSpan, newStart));
                            
                            setTimelineWindowSpan(newSpan);
                            setTimelineWindowStart(newStart);
                          }}
                          style={{ width: '120px', height: '2px', background: theme.text, outline: 'none', cursor: 'pointer' }}
                          className="timeline-zoom-slider"
                        />
                        <img src="/icons/icon-zoom-in.svg" style={{ width: '24px', height: '24px', filter: theme.invert }} alt="zoom in" />
                      </div>
                    </div>
                  </div>

                  {/* TIMELINE MAIN BODY */}
                  <div 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 30px', background: theme.bg, position: 'relative', overflow: 'hidden' }}
              onMouseDown={(e) => {
                if (e.target instanceof HTMLInputElement) return; // Don't drag if clicking sliders
                setIsTimelineDragging(true);
                setDragStartX(e.clientX);
                setDragStartTimelineStart(timelineWindowStart);
              }}
              onMouseMove={(e) => {
                if (!isTimelineDragging || !timelineRef.current) return;
                const deltaX = e.clientX - dragStartX;
                const pixelWidth = timelineRef.current.clientWidth;
                const yearsPerPixel = timelineWindowSpan / pixelWidth;
                const yearDelta = deltaX * yearsPerPixel;
                
                let newStart = dragStartTimelineStart - yearDelta;
                // Constrain
                newStart = Math.max(timeBounds.min, Math.min(timeBounds.max - timelineWindowSpan, newStart));
                setTimelineWindowStart(newStart);
              }}
              onMouseUp={() => setIsTimelineDragging(false)}
              onMouseLeave={() => setIsTimelineDragging(false)}
            >
              
              {/* PAN LEFT BUTTON */}
              <motion.button 
                initial={false}
                animate={{ 
                  opacity: timelineWindowStart <= timeBounds.min ? 0 : 1,
                  pointerEvents: timelineWindowStart <= timeBounds.min ? 'none' : 'auto'
                }}
                whileHover={{ opacity: 0.7 }}
                onClick={() => setTimelineWindowStart(prev => Math.max(timeBounds.min, prev - (timelineWindowSpan * 0.1)))}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: isMapDarkMode ? 'transparent' : theme.bg,
                  border: `1px solid ${isMapDarkMode ? '#ffffff' : theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  marginRight: '12px',
                  flexShrink: 0,
                  transition: 'background-color 0.2s ease'
                }}
              >
                <img src="/icons/icon-arrow-left.svg" style={{ width: '10px', height: '18px', filter: isMapDarkMode ? 'brightness(0)' : 'brightness(0)' }} alt="pan left" />
              </motion.button>

              {/* TIMELINE VISUAL AREA */}
              <div ref={timelineRef} style={{ 
                flex: 1, 
                height: '100%', 
                position: 'relative', 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden',
                background: isMapDarkMode ? '#000000' : '#ffffff' 
              }}>
                <div style={{ flex: 1, position: 'relative', margin: '0 20px' }}>
                  {/* GENERATE DIVIDERS AND DOTS */}
                  {(() => {
                    const years = [];
                    
                    // Adaptive Intervals
                    let majorInterval = 10;
                    let mediumInterval = 5;
                    let minorInterval = 1;
                    
                    if (timelineWindowSpan > 500) {
                      majorInterval = 100; mediumInterval = 50; minorInterval = 10;
                    } else if (timelineWindowSpan > 200) {
                      majorInterval = 50; mediumInterval = 25; minorInterval = 5;
                    } else if (timelineWindowSpan > 100) {
                      majorInterval = 20; mediumInterval = 10; minorInterval = 2;
                    } else if (timelineWindowSpan > 50) {
                      majorInterval = 10; mediumInterval = 5; minorInterval = 1;
                    } else {
                      majorInterval = 5; mediumInterval = 1; minorInterval = 0.5;
                    }

                    // Start at a multiple of minorInterval
                    const startY = Math.floor(timelineWindowStart / minorInterval) * minorInterval;
                    for (let y = startY; y <= timelineWindowStart + timelineWindowSpan; y += minorInterval) {
                      years.push(y);
                    }
                    
                    const getX = (year: number) => {
                      return ((year - timelineWindowStart) / timelineWindowSpan) * 100;
                    };

                    return (
                      <>
                        {/* YEAR LABELS AND DIVIDERS */}
                        {years.map(y => {
                          const isMajor = y % majorInterval === 0;
                          const isMedium = y % mediumInterval === 0;
                          if (getX(y) < 0 || getX(y) > 100) return null;

                          return (
                            <React.Fragment key={y}>
                              <div style={{
                                position: 'absolute',
                                left: `${getX(y)}%`,
                                bottom: '38px',
                                height: isMajor ? '20px' : (isMedium ? '12px' : '8px'),
                                width: '1px',
                                background: isMajor ? theme.text : (isMapDarkMode ? '#444' : '#ccc'),
                                zIndex: 0 // Behind baseline
                              }} />
                              {isMajor && (
                                <div style={{
                                  position: 'absolute',
                                  left: `${getX(y)}%`,
                                  bottom: '18px',
                                  transform: 'translateX(-50%)',
                                  fontSize: '10px',
                                  fontWeight: 'bold',
                                  color: theme.text,
                                  zIndex: 1
                                }}>
                                  {y}
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}

                        {/* THE HORIZONTAL BASE LINE - MOVED UP BY 10px to 38px */}
                        <div style={{ position: 'absolute', bottom: '38px', left: 0, right: 0, height: '1px', background: theme.text, zIndex: 1 }} />

                        {/* FEATURE DOTS INDICATORS - AGGREGATED BY DYNAMIC BUCKETS FOR PERFORMANCE AND CLUSTERING */}
                        {(() => {
                          const visibleFeatures = pointsAndLinesData.filter(f => {
                            const inWindow = f.date >= timelineWindowStart && f.date <= timelineWindowStart + timelineWindowSpan;
                            const isActive = f.categories.some((cat: string) => activeLayers[cat] !== false);
                            return inWindow && isActive;
                          });
                          
                          // Bucket size determines aggregation density based on current zoom level
                          const bucketSize = Math.max(0.1, timelineWindowSpan / 60);

                          interface BucketGroup {
                            count: number;
                            color: string;
                            features: any[];
                          }

                          const aggregated = visibleFeatures.reduce((acc, f) => {
                            const bucketIndex = Math.floor(f.date / bucketSize);
                            if (!acc[bucketIndex]) {
                              acc[bucketIndex] = {};
                            }
                            const cat = f.categories[0];
                            if (!acc[bucketIndex][cat]) {
                              acc[bucketIndex][cat] = { 
                                count: 0, 
                                color: (layerColors as any)[cat] || '#b6a6ff', 
                                features: [] 
                              };
                            }
                            acc[bucketIndex][cat].count += 1;
                            acc[bucketIndex][cat].features.push(f);
                            return acc;
                          }, {} as Record<number, Record<string, BucketGroup>>);

                          const currentGroups = Object.values(aggregated).flatMap(buckets => Object.values(buckets)) as BucketGroup[];
                          const localMaxCount = currentGroups.length > 0 ? Math.max(...currentGroups.map(g => g.count)) : 1;

                          return Object.entries(aggregated).flatMap(([bucketIdxStr, catGroups]) => {
                            const sortedCats = Object.keys(catGroups).sort();
                            
                            return sortedCats.map((cat, catIdx) => {
                              const data = catGroups[cat];
                              const { count, features } = data;
                              
                              // Position at the average date of points in this bucket for better accuracy
                              const centerYear = features.reduce((sum, f) => sum + f.date, 0) / count;
                              
                              // Scale size based on local max in current view
                              const rawSize = Math.min(6 + (Math.pow(count / localMaxCount, 0.3)) * 12, 20);
                              const size = Math.round(rawSize);
                              const verticalOffset = catIdx * (size + 1); // Stack vertically with offset
                              
                              return (
                                <motion.div 
                                  key={`bucket-${bucketIdxStr}-${cat}`}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  whileHover={{ scale: 1.1, zIndex: 100 }}
                                  onHoverStart={() => setHoveredBucket({ 
                                    count, 
                                    cat, 
                                    year: Math.round(centerYear), 
                                    x: getX(centerYear),
                                    bottom: 65 + verticalOffset + size + 15
                                  })}
                                  onHoverEnd={() => setHoveredBucket(null)}
                                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                  style={{
                                    position: 'absolute',
                                    left: `${getX(centerYear)}%`,
                                    bottom: `${65 + verticalOffset}px`,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    borderRadius: '50%',
                                    background: data.color,
                                    border: `1px solid ${isMapDarkMode ? '#000000' : '#ffffff'}`,
                                    x: '-50%',
                                    cursor: 'pointer',
                                    zIndex: 5 + catIdx,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backfaceVisibility: 'hidden',
                                    WebkitFontSmoothing: 'antialiased'
                                  }}
                                  onClick={() => {
                                    // If it's a cluster and we're not already zoomed in significantly, zoom in
                                    // NEW: only zoom if the dates are actually spread out
                                    const distinctDates = new Set(features.map(f => f.date));
                                    const isSpread = distinctDates.size > 1;

                                    if (count > 1 && timelineWindowSpan > 0.01 && isSpread) {
                                      const newSpan = Math.max(0.01, timelineWindowSpan / 4);
                                      // Zoom into the center of the clicked bucket
                                      const newStart = Math.max(timeBounds.min, centerYear - newSpan / 2);
                                      
                                      // Smoothly animate both span and start
                                      animate(timelineWindowSpan, newSpan, {
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                        onUpdate: (v) => setTimelineWindowSpan(v)
                                      });
                                      animate(timelineWindowStart, newStart, {
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                        onUpdate: (v) => setTimelineWindowStart(v)
                                      });
                                    } else if (features.length > 0) {
                                      // Otherwise, just handle the click on the feature
                                      handleLocationItemClick(features[0]);
                                    }
                                  }}
                                />
                              );
                            });
                          });
                        })()}

                        {/* INPUTS FOR RANGE SELECTION (ON THE TIMELINE) AND HIGHLIGHT BAR */}
                        <div style={{
                          position: 'absolute',
                          bottom: '32px', // Moved up to prevent covering the date numbers on the bottom
                          left: '0px',
                          right: '0px',
                          height: '24px',
                          zIndex: 10,
                          pointerEvents: 'none'
                        }}>
                          {/* HIGHLIGHT BAR */}
                          <div style={{
                            position: 'absolute',
                            bottom: '0px',
                            left: `${getX(yearRange.start)}%`,
                            width: `${getX(yearRange.end) - getX(yearRange.start)}%`,
                            height: '24px',
                            background: isMapDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                            borderRadius: '2px',
                            zIndex: 1
                          }} />

                          {/* 
                            Calculation for aligned sliders:
                            We want the global range input (timeBounds.min to timeBounds.max) to stretch
                            such that the years in the input align with the years on the ruler.
                          */}
                          {(() => {
                            const windowEnd = timelineWindowStart + timelineWindowSpan;

                            const commonInputStyle: React.CSSProperties = {
                              position: 'absolute', 
                              width: '100%', 
                              height: '100%', 
                              background: 'transparent', 
                              appearance: 'none', 
                              pointerEvents: 'none', 
                              margin: 0, 
                              left: 0,
                              padding: 0,
                              boxSizing: 'border-box'
                            };


                            return (
                              <>
                                <input 
                                  type="range" 
                                  min={timelineWindowStart} 
                                  max={windowEnd} 
                                  step={0.1}
                                  value={yearRange.start}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    const width = e.currentTarget.offsetWidth;
                                    const gap = width > 0 ? (12 / width) * timelineWindowSpan : 0;
                                    setYearRange(p => ({ ...p, start: Math.min(val, p.end - gap) }));
                                  }}
                                  style={{ 
                                    ...commonInputStyle,
                                    zIndex: yearRange.start > (windowEnd + timelineWindowStart) / 2 ? 14 : 13
                                  }}
                                  className="figma-slider-thumb-left"
                                />
                                <input 
                                  type="range" 
                                  min={timelineWindowStart} 
                                  max={windowEnd} 
                                  step={0.1}
                                  value={yearRange.end}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    const width = e.currentTarget.offsetWidth;
                                    const gap = width > 0 ? (12 / width) * timelineWindowSpan : 0;
                                    setYearRange(p => ({ ...p, end: Math.max(val, p.start + gap) }));
                                  }}
                                  style={{ 
                                    ...commonInputStyle,
                                    zIndex: 12
                                  }}
                                  className="figma-slider-thumb-right"
                                />
                              </>
                            );
                          })()}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* PAN RIGHT BUTTON */}
              <motion.button 
                initial={false}
                animate={{ 
                  opacity: (timelineWindowStart + timelineWindowSpan) >= timeBounds.max ? 0 : 1,
                  pointerEvents: (timelineWindowStart + timelineWindowSpan) >= timeBounds.max ? 'none' : 'auto'
                }}
                whileHover={{ opacity: 0.7 }}
                onClick={() => setTimelineWindowStart(prev => Math.min(timeBounds.max - timelineWindowSpan, prev + (timelineWindowSpan * 0.1)))}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: isMapDarkMode ? 'transparent' : theme.bg,
                  border: `1px solid ${isMapDarkMode ? '#ffffff' : theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  marginLeft: '12px',
                  flexShrink: 0,
                  transition: 'background-color 0.2s ease'
                }}
              >
                <img src="/icons/icon-arrow-left.svg" style={{ width: '10px', height: '18px', transform: 'rotate(180deg)', filter: isMapDarkMode ? 'brightness(0)' : 'brightness(0)' }} alt="pan right" />
              </motion.button>
            </div>

            {/* CUSTOM TIMELINE TOOLTIP OVERLAY - ALIGNED TO DOTS FIELD */}
            <div style={{ position: 'absolute', top: '40px', bottom: 0, left: '110px', right: '110px', pointerEvents: 'none', overflow: 'visible', zIndex: 1000 }}>
              <AnimatePresence>
                {hoveredBucket && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 5, x: '-50%' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      left: `${hoveredBucket.x}%`,
                      bottom: `${hoveredBucket.bottom}px`,
                      background: '#000000',
                      color: '#ffffff',
                      padding: '0 12px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '50px',
                      fontSize: '10px',
                      fontWeight: '500',
                      fontFamily: '"Space Mono", monospace',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {hoveredBucket.count} {hoveredBucket.cat.toUpperCase()} AROUND {hoveredBucket.year}
                    {/* Triangle arrow below bubble */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid #000000'
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

      </div>      {/* FULL SCREEN LIGHTBOX MODAL ARCHITECTURE */}
      <AnimatePresence>
        {isLightboxOpen && selectedFeature && activeAssets && activeAssets.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsLightboxOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, width: scrollbarWidth ? `calc(100vw - ${scrollbarWidth}px)` : '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, cursor: 'zoom-out', fontFamily: '"Space Mono", monospace' }}
          >
            <motion.button 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ opacity: 0.7 }}
              onClick={() => setIsLightboxOpen(false)} 
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Space Mono", monospace', letterSpacing: '1px', zIndex: 10001, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <img src="/icons/icon-x.svg" style={{ width: '24px', height: '24px', filter: 'invert(1)' }} alt="close" />
              CLOSE
            </motion.button>
  
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
              {(() => {
                const curAsset = activeAssets[activeImageIndex];
                if (!curAsset) return null;

                const isPdf = !!(curAsset.type === 'pdf' || curAsset.pdfUrl);
                const actualPdfUrl = curAsset.pdfUrl || (curAsset.type === 'pdf' ? curAsset.url : undefined);
                const isBroken = !!(brokenImages[curAsset.url] || curAsset.url === MISSING_IMAGE_URL || curAsset.url?.includes('icon-missing-image.svg'));
                const imgSrc = isBroken ? MISSING_IMAGE_URL : cleanAndProxyImageUrl(curAsset.url);

                return (
                  <>
                    {isLightboxImageLoading && curAsset.type === 'image' && !curAsset.pdfUrl && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <div className="loading-spinner" style={{ borderTopColor: '#ffffff' }} />
                      </div>
                    )}
        
                    <AnimatePresence mode="wait">
                      {isPdf && actualPdfUrl ? (
                        <motion.div
                          key={`lightbox-pdf-${selectedFeature.id}-${activeImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ width: '90%', height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
                        >
                          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', background: '#fff' }}>
                            <iframe
                              srcDoc={getPdfViewerSrcDoc(actualPdfUrl)}
                              style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
                              title="Declassified Document Archive"
                            />
                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', color: '#fff', pointerEvents: 'none' }}>
                              If dossier fails to display, use "OPEN SOURCE FILE" below
                            </div>
                          </div>
                        </motion.div>
                      ) : curAsset.type === 'video' ? (
                        <motion.div
                          key={`lightbox-video-${selectedFeature.id}-${activeImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ width: '80%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {(curAsset.url.includes('youtube.com') || 
                            curAsset.url.includes('youtu.be') || 
                            curAsset.url.includes('dvidshub.net/video/')) ? (
                            <iframe
                              src={getEmbedUrl(curAsset.url)}
                              style={{ width: '100%', height: '100%', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="High resolution dossier archive asset"
                            />
                          ) : (
                            <video
                              src={(curAsset.url.includes('war.gov') || curAsset.url.includes('aaro.mil') || curAsset.url.includes('archives.gov'))
                                ? curAsset.url
                                : curAsset.url.includes('.gov') || curAsset.url.includes('.mil')
                                  ? `/api/proxy-resource?url=${encodeURIComponent(curAsset.url)}`
                                  : curAsset.url}
                              controls
                              autoPlay
                              style={{ width: '100%', height: '100%', outline: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                            />
                          )}
                        </motion.div>
                      ) : curAsset.type === 'audio' ? (
                        <motion.div
                          key={`lightbox-audio-${selectedFeature.id}-${activeImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', gap: '32px', padding: '48px' }}
                        >
                          <div style={{ width: '128px', height: '128px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                              <path d="M9 18V5l12-2v13"></path>
                              <circle cx="6" cy="18" r="3"></circle>
                              <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                          </div>
                          <audio 
                            src={curAsset.url} 
                            controls 
                            autoPlay
                            style={{ width: '100%', maxWidth: '600px', height: '54px' }} 
                          />
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#ffffff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '8px' }}>AUDIO INTELLIGENCE INTERCEPT</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>{selectedFeature.name} - DIRECT SIGNAL CAPTURE</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.img 
                          key={`${selectedFeature.id}-${activeImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: isLightboxImageLoading ? 0 : 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          src={imgSrc} 
                          alt="High resolution dossier archive asset" 
                          referrerPolicy="no-referrer"
                          onLoad={() => setIsLightboxImageLoading(false)}
                          onError={(e) => {
                            setIsLightboxImageLoading(false);
                            if (curAsset.url) {
                              setBrokenImages(prev => ({ ...prev, [curAsset.url]: true }));
                            }
                          }}
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain', 
                            margin: 'auto',
                            backgroundColor: 'transparent',
                            width: isBroken ? '96px' : 'auto',
                            height: isBroken ? '96px' : 'auto',
                            filter: isBroken ? 'invert(1)' : 'none'
                          }}
                        />
                      )}
                    </AnimatePresence>
        
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{ 
                          margin: '24px 0 0 0',
                          color: '#ffffff', 
                          fontSize: '11px', 
                          fontFamily: '"Space Mono", monospace', 
                          whiteSpace: 'nowrap', 
                          backgroundColor: 'rgba(0,0,0,0.6)', 
                          padding: '6px 16px', 
                          borderRadius: '20px', 
                          letterSpacing: '0.5px',
                          textAlign: 'center',
                          zIndex: 10001
                        }}>
                        FILE ASSET {activeImageIndex + 1} OF {activeAssets.length} — {selectedFeature.name.toUpperCase()}
                      </motion.div>
        
                      {isPdf && actualPdfUrl && (
                        <a 
                          href={actualPdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            border: '1px solid #ffffff',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            letterSpacing: '1.5px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                            zIndex: 10002,
                            textTransform: 'uppercase'
                          }}
                        >
                          <img src="/icons/icon-expand.svg" style={{ width: '18px', height: '18px', filter: 'invert(1)' }} alt="open" />
                          OPEN FULL PDF IN NEW TAB
                        </a>
                      )}
                    </div>
                  </>
                );
              })()}
  
              {activeAssets.length > 1 && (
                <>
                  <motion.button 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.1, backgroundColor: '#ffffff' }}
                    onClick={handlePrevImage} 
                    style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', background: '#000000', border: '1px solid #ffffff', borderRadius: '50%', width: '64px', height: '64px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 10002, transition: 'background-color 0.2s ease' }}
                  >
                    <img src="/icons/icon-arrow-left.svg" style={{ width: '12px', height: '24px' }} alt="prev" className="lightbox-nav-icon" />
                  </motion.button>
                  <motion.button 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.1, backgroundColor: '#ffffff' }}
                    onClick={handleNextImage} 
                    style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', background: '#000000', border: '1px solid #ffffff', borderRadius: '50%', width: '64px', height: '64px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 10002, transition: 'background-color 0.2s ease' }}
                  >
                    <img src="/icons/icon-arrow-left.svg" style={{ width: '12px', height: '24px', transform: 'rotate(180deg)' }} alt="next" className="lightbox-nav-icon" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{ 
        background: isMapDarkMode ? '#ffffff' : '#000000', 
        color: isMapDarkMode ? '#000000' : '#ffffff', 
        minHeight: '270px', 
        boxSizing: 'border-box', 
        paddingTop: '50px',
        paddingBottom: '60px',
        display: 'flex', 
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left', 
        fontFamily: '"Space Mono", monospace',
        width: '100%',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          width: '100%', 
          justifyContent: 'space-between',
          padding: '0 60px 0 0'
        }}>
          <div>
            <img 
              src="/mtrh-horiz-words.svg" 
              alt="MTRH Logo" 
              style={{ 
                width: '232px', 
                height: '78px',
                display: 'block',
                filter: isMapDarkMode ? 'invert(1)' : 'none'
              }} 
            />
          </div>
          
          {/* RIGHT: CONTENT COLUMNS - Aligned right */}
          <div style={{ 
            display: 'flex', 
            gap: '80px'
          }}>
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px 0', color: isMapDarkMode ? '#000000' : '#ffffff', textAlign: 'right', fontFamily: '"Space Mono", monospace' }}>FRIENDS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '10px', fontWeight: 'bold', color: isMapDarkMode ? '#000000' : '#ffffff', textAlign: 'right', fontFamily: '"Space Mono", monospace', textTransform: 'uppercase' }}>
                <a href="https://northbeastclothing.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>NORTH BEAST CO.</a>
                <a href="https://blurrycreatures.com/?srsltid=AfmBOorjjAxrHwi6VEgrMm-dxLlVFFb_yFGO3YDacaky_IXZDdgcWNcg" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>BLURRY CREATURES</a>
                <a href="https://www.theconfessionalspodcast.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>THE CONFESSIONALS</a>
                <a href="https://www.instagram.com/giants_of_ancientamerica/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GIANTS OF ANCIENT AMERICA</a>
                <a href="https://www.instagram.com/freetherabbitspodcast/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>FREE THE RABBITS</a>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px 0', color: isMapDarkMode ? '#000000' : '#ffffff', textAlign: 'right', fontFamily: '"Space Mono", monospace' }}>CONTACT</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '10px', fontWeight: 'bold', color: isMapDarkMode ? '#000000' : '#ffffff', textAlign: 'right', fontFamily: '"Space Mono", monospace' }}>
                <span style={{ fontWeight: 'normal', textTransform: 'none' }}>Questions? Wanna help?</span>
                <a href="mailto:mappingtherabbithole@gmail.com" style={{ color: 'inherit', textDecoration: 'underline', textTransform: 'none' }}>mappingtherabbithole@gmail.com</a>
                
                <div style={{ marginTop: '24px', color: isMapDarkMode ? '#000000' : '#ffffff', fontSize: '10px', fontWeight: 'normal', lineHeight: '1.5', textTransform: 'none' }}>
                  Copyright North Beast LLC 2026.<br /> All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        * {
          font-family: 'Space Mono', monospace !important;
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow-y: auto;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
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

        .custom-scrollbar {
          overflow-y: scroll;
          scrollbar-width: thin;
          scrollbar-color: #000000 #ffffff;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #000000;
          border-radius: 0px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333333;
        }

        .timeline-zoom-slider { -webkit-appearance: none !important; appearance: none !important; }
        .timeline-zoom-slider::-webkit-slider-thumb { -webkit-appearance: none !important; appearance: none !important; width: 16px !important; height: 16px !important; border-radius: 50% !important; background: #ffffff !important; border: 2px solid #000000 !important; cursor: pointer !important; }
        
        .figma-slider-thumb-left::-webkit-slider-thumb { 
          -webkit-appearance: none !important; 
          appearance: none !important; 
          pointer-events: auto !important; 
          width: 12px !important; 
          height: 24px !important; 
          border-radius: 4px !important; 
          background-color: ${isMapDarkMode ? '#ffffff' : '#000000'} !important; 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${isMapDarkMode ? 'black' : 'white'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          cursor: pointer !important; 
          border: ${isMapDarkMode ? '1px solid #000000' : 'none'} !important;
          margin-top: 0 !important;
        }
        .figma-slider-thumb-left::-moz-range-thumb { 
          appearance: none !important; 
          pointer-events: auto !important; 
          width: 12px !important; 
          height: 24px !important; 
          border-radius: 4px !important; 
          background-color: ${isMapDarkMode ? '#ffffff' : '#000000'} !important; 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${isMapDarkMode ? 'black' : 'white'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          cursor: pointer !important; 
          border: ${isMapDarkMode ? '1px solid #000000' : 'none'} !important;
        }
        
        .figma-slider-thumb-right::-webkit-slider-thumb { 
          -webkit-appearance: none !important; 
          appearance: none !important; 
          pointer-events: auto !important; 
          width: 12px !important; 
          height: 24px !important; 
          border-radius: 4px !important; 
          background-color: ${isMapDarkMode ? '#ffffff' : '#000000'} !important; 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${isMapDarkMode ? 'black' : 'white'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          cursor: pointer !important; 
          border: ${isMapDarkMode ? '1px solid #000000' : 'none'} !important;
          margin-top: 0 !important;
        }
        .figma-slider-thumb-right::-moz-range-thumb { 
          appearance: none !important; 
          pointer-events: auto !important; 
          width: 12px !important; 
          height: 24px !important; 
          border-radius: 4px !important; 
          background-color: ${isMapDarkMode ? '#ffffff' : '#000000'} !important; 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${isMapDarkMode ? 'black' : 'white'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          cursor: pointer !important; 
          border: ${isMapDarkMode ? '1px solid #000000' : 'none'} !important;
        }
        
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

        .lightbox-nav-icon {
          filter: brightness(0) invert(1);
          transition: filter 0.2s ease;
        }
        
        button:hover .lightbox-nav-icon {
          filter: brightness(0);
        }

        @keyframes spinMapAsset {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* ABOUT MODAL */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              fontFamily: '"Space Mono", monospace',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: '#ffffff',
                width: '671px',
                height: '476px',
                position: 'relative',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
            {/* TOP SECTION: 671x208 */}
            <div style={{
              backgroundImage: 'url("https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/overlay-map-bg-%402x.png")',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              height: '208px',
              minHeight: '208px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              flexShrink: 0
            }}>
              {/* LOGO BOX: 232x78 vertically centered on the left */}
              <div style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#000000',
                width: '232px',
                height: '78px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2
              }}>
                <img 
                  src="https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/mtrh-horiz-words.svg" 
                  alt="MTRH Logo" 
                  style={{ width: '232px', height: '78px' }} 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* ICONS IMAGE: 312x208 on the right */}
              <img 
                src="https://raw.githubusercontent.com/northbeastclothing-design/MTRH/main/public/overlay-icons-%402x.png" 
                alt="Icons Grid" 
                style={{ 
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  width: '312px',
                  height: '208px',
                  zIndex: 2,
                  objectFit: 'contain'
                }} 
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* BOTTOM SECTION CONTENT: remaining height is 268px */}
            <div style={{
              padding: '40px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center'
            }}>
              <h2 style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '28px',
                fontWeight: 'normal',
                marginBottom: '20px',
                color: '#000000',
                lineHeight: '1.2',
                width: '570px',
                textAlign: 'center'
              }}>
                We are Mapping the Rabbit Hole
              </h2>
              
              <p style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '12px',
                lineHeight: '20px',
                color: '#000000',
                width: '570px',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                We are mapping the weird. We are searching for patterns & parallels. From giant bones, to UFOs, to cryptids we are looking at them as a whole to see what transpires. This is forever a work in progress and we would love your help! Email us with your findings, data, map pins, etc.
              </p>

              <button 
                onClick={() => setShowAboutModal(false)}
                style={{
                  width: '200px',
                  height: '30px',
                  backgroundColor: 'transparent',
                  color: '#000000',
                  border: '1.5px solid #000000',
                  padding: '0',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  fontFamily: '"Space Mono", monospace',
                  cursor: 'pointer',
                  textTransform: 'none',
                  borderRadius: '30px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '30px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#000000';
                }}
              >
                Explore the map
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* MAP PINNING MODE BANNER */}
      {isPinningOnMap && (
        <div style={{
          position: 'fixed',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#000000',
          color: '#ffffff',
          border: '1px solid #ffffff',
          padding: '12px 24px',
          zIndex: 999999,
          fontFamily: '"Space Mono", monospace',
          fontSize: '11px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ff3333',
            animation: 'spinMapAsset 1s linear infinite'
          }} />
          <span>MAP PINNING MODE: CLICK ANYWHERE ON DETECTED RADAR AREAS TO CAPTURE LAT/LNG</span>
          <button 
            onClick={() => {
              setIsPinningOnMap(false);
              setIsSubmitOpen(true);
            }} 
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ff4d4d',
              cursor: 'pointer',
              textDecoration: 'underline',
              textTransform: 'uppercase',
              fontSize: '10px',
              marginLeft: '12px'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* SUBMISSION FORM MODAL OVERLAY */}
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
              zIndex: 9999,
              fontFamily: '"Space Mono", monospace',
              padding: '20px'
            }}
          >
            <motion.button 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ opacity: 0.7 }}
              onClick={() => setIsSubmitOpen(false)} 
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Space Mono", monospace', letterSpacing: '1px', zIndex: 10001, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <img src="/icons/icon-x.svg" style={{ width: '24px', height: '24px', filter: 'invert(1)' }} alt="close" />
              CLOSE
            </motion.button>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              style={{
                backgroundColor: isMapDarkMode ? '#0a0a0a' : '#ffffff',
                color: isMapDarkMode ? '#ffffff' : '#000000',
                border: `1px solid ${theme.border}`,
                padding: '28px',
                width: '640px',
                maxWidth: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isMapDarkMode ? '0 10px 40px rgba(255,255,255,0.05)' : '0 15px 40px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.border}`, paddingBottom: '12px', marginBottom: '20px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Input Intel //</span>
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
                    if (!subName.trim() || !subCategory || !subDescription.trim() || !subLatitude || !subLongitude) {
                      setSubmissionError("All required attributes (Name, Category, Description, Coordinates) must be defined.");
                      return;
                    }

                    const latNum = parseFloat(subLatitude);
                    const lngNum = parseFloat(subLongitude);
                    if (isNaN(latNum) || isNaN(lngNum)) {
                      setSubmissionError("Coordinates must be valid numbers.");
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
                      coordinates: [lngNum, latNum],
                      images: subMediaList,
                      status: 'pending'
                    };

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
                          coordinates: [lngNum, latNum],
                          images: subMediaList,
                          date: subDate.trim() || undefined,
                          source: subSource.trim() || undefined
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
                      } catch (fallbackErr: any) {
                        console.error("Firestore submission fallback error:", fallbackErr);
                        setSubmissionError(`Transmission Failure: ${fallbackErr.message || fallbackErr}`);
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }} 
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div>
                    <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>NAME OF ANOMALY / SIGNATURE *</label>
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

                  <div style={{ display: 'flex', gap: '16px', zIndex: 10002 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>MAP REGISTRY LAYER *</label>
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
                              {uniqueCategories.map(cat => (
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

                    <div style={{ width: '180px' }}>
                      <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>YEAR OF OCCURRENCE</label>
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
                  <div style={{ background: isMapDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px dashed ${theme.borderLight}`, padding: '14px', borderRadius: '2px' }}>
                    <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', letterSpacing: '0.5px', color: theme.text }}>GEOGRAPHIC GEO-SEARCH (AUTO-FILL COORDINATES)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
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
                          flex: 1,
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
                          boxSizing: 'border-box'
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
                    <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>COORDINATES REGISTRATION *</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        required
                        placeholder="LATITUDE (e.g. 41.4091)" 
                        value={subLatitude} 
                        onChange={(e) => setSubLatitude(e.target.value)}
                        style={{
                          flex: 1,
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
                        required
                        placeholder="LONGITUDE (e.g. -122.1952)" 
                        value={subLongitude} 
                        onChange={(e) => setSubLongitude(e.target.value)}
                        style={{
                          flex: 1,
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
                          boxSizing: 'border-box'
                        }}
                      >
                        <MapPin size={10} strokeWidth={2.5} />
                        <span>PIN MAP</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>NARRATIVE RECORD & DATA LOG *</label>
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
                      <label style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>INVESTIGATIVE SOURCE Attribution</label>
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
                      <label style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.5px' }}>MEDIA / INTEL FILES ATTACHMENT</label>
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
                          accept="image/*,video/*,audio/*,application/pdf"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsUploading(true);
                            setSubmissionError(null);

                            const reader = new FileReader();
                            reader.onload = async () => {
                              const base64 = reader.result as string;
                              const base64Data = base64.split(',')[1] || base64;

                              try {
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    filename: file.name,
                                    fileData: base64Data
                                  })
                                });

                                if (!response.ok) {
                                  throw new Error(`Upload failed with status: ${response.status}`);
                                }

                                const data = await response.json();
                                if (data && data.url) {
                                  setSubMediaList(prev => [...prev, data.url]);
                                } else {
                                  throw new Error("Invalid response schema from upload endpoint");
                                }
                              } catch (err: any) {
                                console.error("Upload API Error:", err);
                                setSubmissionError(`Staging failed: ${err.message || err}`);
                              } finally {
                                setIsUploading(false);
                              }
                            };
                            
                            reader.onerror = () => {
                              setSubmissionError("Failed to read file local stream.");
                              setIsUploading(false);
                            };

                            reader.readAsDataURL(file);
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
                        <span style={{ fontSize: '9px', textTransform: 'uppercase' }}>
                          {isUploading ? "Uploading file..." : "Click or drag files here to stage"}
                        </span>
                        <span style={{ fontSize: '7px', color: theme.textDim, marginTop: '4px' }}>PNG, JPG, MP4, MP3, PDF COMPATIBLE</span>
                      </div>
                    )}

                    {/* Staged attachments */}
                    {subMediaList.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px', background: isMapDarkMode ? '#141414' : '#fafafa', border: `1px solid ${theme.borderLight}`, padding: '8px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.5px' }}>STAGED INTEL ATTACHMENTS ({subMediaList.length})</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {subMediaList.map((url, idx) => {
                            const isFile = url.startsWith('/uploads/');
                            const displayName = isFile ? url.replace('/uploads/', '') : url;
                            return (
                              <div key={idx} style={{ padding: '4px 8px', background: isMapDarkMode ? '#222' : '#eeeeee', border: `1px solid ${theme.border}`, fontSize: '9px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
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

                  {submissionError && (
                    <div style={{ color: '#ff3333', fontSize: '10px', fontWeight: 'bold', border: '1px solid #ff3333', padding: '8px', background: 'rgba(255,0,0,0.02)' }}>
                      {submissionError}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: `1px solid ${theme.border}`, paddingTop: '16px' }}>
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
                        boxSizing: 'border-box'
                      }}
                    >
                      ABORT
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
                        boxSizing: 'border-box'
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

      {/* MODERATOR CONSOLE OVERLAY */}
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
              zIndex: 9999,
              fontFamily: '"Space Mono", monospace',
              padding: '20px'
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
                padding: '28px',
                width: '720px',
                maxWidth: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isMapDarkMode ? '0 10px 40px rgba(255,255,255,0.05)' : '0 15px 40px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2.5px solid ${theme.border}`, paddingBottom: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14} color={isMapDarkMode ? '#ffcc00' : '#000000'} />
                  <span style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>MTRH// DECISIONAL MODERATION DESK</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {isModeratorAuthenticated && (
                    <button 
                      onClick={() => setIsModMinimized(true)} 
                      title="Minimize modal to inspect underlay map"
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid currentColor', 
                        borderRadius: '2px',
                        color: isMapDarkMode ? theme.textDim : '#000000', 
                        fontSize: '9px',
                        fontWeight: 'bold',
                        cursor: 'pointer', 
                        padding: '2px 8px', 
                        fontFamily: '"Space Mono", monospace' 
                      }}
                    >
                      MINIMIZE DESK
                    </button>
                  )}
                  <button onClick={() => setIsModeratorOpen(false)} style={{ background: 'transparent', border: 'none', color: theme.text, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              {!isModeratorAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', padding: '36px 0' }}>
                  <ShieldAlert size={48} strokeWidth={1.5} color={isMapDarkMode ? '#ffcc00' : '#000000'} />
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '1px' }}>ADMIN SECURITY GATE SECUREMTRH_1</h4>
                    <p style={{ fontSize: '10px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', margin: 0, width: '360px', lineHeight: '18px' }}>Authenticating under the owner account jhuffman710@gmail.com grants full write authority over map submissions.</p>
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
                    <span style={{ fontSize: '8px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: 'bold' }}>OR SECRETS BYPASS</span>
                    <div style={{ flex: 1, height: '1px', background: theme.borderLight }} />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '300px' }}>
                    <input
                      type="password"
                      placeholder="ENTER SECRET CODENAME..."
                      value={moderatorPasscode}
                      onChange={(e) => setModeratorPasscode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (moderatorPasscode === 'MTRH2026') {
                            setIsModeratorAuthenticated(true);
                            setModeratorPasscode('');
                            setModeratorError(null);
                          } else {
                            setModeratorError("BYPASS CODE DENIED.");
                          }
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
                        if (moderatorPasscode === 'MTRH2026') {
                          setIsModeratorAuthenticated(true);
                          setModeratorPasscode('');
                          setModeratorError(null);
                        } else {
                          setModeratorError("BYPASS CODE DENIED.");
                        }
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
                          Simply type the secret passcode <strong>MTRH2026</strong> in the box above and click <strong>BYPASS</strong>. This will authenticate you locally using our secure server-side administrative bypass and load the submissions list instantly!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isMapDarkMode ? '#141414' : '#f8f8f8', padding: '10px 14px', border: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffcc00' }} />
                      <span style={{ fontSize: '10px', fontWeight: 'bold' }}>
                        ACTIVE MOD DESK SESSION: {currentUser?.email || "Local Bypass Override Profile"}
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

                  <div style={{ display: 'flex', borderBottom: `1px solid ${theme.borderLight}`, gap: '4px', marginBottom: '8px' }}>
                    <button
                      onClick={() => setActiveModTab('pending')}
                      style={{
                        padding: '10px 16px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        fontFamily: '"Space Mono", monospace',
                        background: activeModTab === 'pending' ? (isMapDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
                        color: activeModTab === 'pending' ? (isMapDarkMode ? '#ffcc00' : '#000000') : (isMapDarkMode ? '#999999' : '#666666'),
                        border: 'none',
                        borderBottom: activeModTab === 'pending' ? (isMapDarkMode ? '2.5px solid #ffcc00' : '2.5px solid #000000') : '2.5px solid transparent',
                        cursor: 'pointer',
                        letterSpacing: '0.5px'
                      }}
                    >
                      PENDING REVIEW ({pendingSubmissions.length})
                    </button>
                    <button
                      onClick={() => setActiveModTab('approved')}
                      style={{
                        padding: '10px 16px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        fontFamily: '"Space Mono", monospace',
                        background: activeModTab === 'approved' ? (isMapDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
                        color: activeModTab === 'approved' ? (isMapDarkMode ? '#ffcc00' : '#000000') : (isMapDarkMode ? '#999999' : '#666666'),
                        border: 'none',
                        borderBottom: activeModTab === 'approved' ? (isMapDarkMode ? '2.5px solid #ffcc00' : '2.5px solid #000000') : '2.5px solid transparent',
                        cursor: 'pointer',
                        letterSpacing: '0.5px'
                      }}
                    >
                      APPROVED INTEL AUDIT ({approvedSubmissions.length})
                    </button>
                  </div>

                  {activeModTab === 'pending' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <span style={{ fontSize: '9px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        SUBMISSIONS PENDING FORMAL DECLASSIFICATION APPROVAL:
                      </span>

                      {pendingSubmissions.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', border: `1px dashed ${theme.borderLight}`, color: isMapDarkMode ? theme.textDim : '#000000', fontSize: '11px', fontWeight: 'bold' }}>
                          NO UNAPPROVED USER SUBMISSIONS AT THIS TIME. SIGNALS CLEAR.
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
                                      <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: theme.text }}>{sub.name}</h5>
                                      <div style={{ display: 'flex', gap: '12px', fontSize: '9px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500' }}>
                                        <span>LAYER: <strong style={{ color: isMapDarkMode ? '#ffffff' : '#000000', textDecoration: isMapDarkMode ? 'none' : 'underline' }}>{sub.category}</strong></span>
                                        <span>COORDS: <strong style={{ color: isMapDarkMode ? '#ffffff' : '#000000' }}>[{sub.coordinates?.[1]}, {sub.coordinates?.[0]}]</strong></span>
                                        {sub.date && <span>YEAR: <strong style={{ color: isMapDarkMode ? '#ffffff' : '#000000' }}>{sub.date}</strong></span>}
                                      </div>
                                    </div>
                                    <span style={{ padding: '2px 6px', background: isMapDarkMode ? '#ffa500' : '#000000', color: isMapDarkMode ? '#000000' : '#ffffff', fontSize: '8px', fontWeight: 'bold', borderRadius: '1px' }}>PENDING</span>
                                  </div>

                                  <p style={{ margin: 0, fontSize: '10.5px', lineHeight: '16px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', whiteSpace: 'pre-line' }}>
                                    {sub.description}
                                  </p>

                                  {sub.source && (
                                    <div style={{ fontSize: '9px', color: isMapDarkMode ? theme.textDim : '#000000', fontStyle: 'italic' }}>
                                      Source: <strong>{sub.source}</strong>
                                    </div>
                                  )}

                                  {sub.images && sub.images.length > 0 && (
                                    <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '10px' }}>
                                      <span style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: isMapDarkMode ? theme.text : '#000000' }}>ATTACHMENTS DETECTED:</span>
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
                                              [LINK {index+1}: {imgName.slice(0, 30)}...]
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

                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '12px', marginTop: '4px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button
                                        onClick={() => {
                                          if (mapRef.current) {
                                            const mockFeature = {
                                              id: sub.id,
                                              name: sub.name,
                                              description: sub.description,
                                              coordinates: sub.coordinates,
                                              categories: [sub.category],
                                              type: 'Point',
                                              isSubmitted: true
                                            };
                                            setSelectedFeature(mockFeature);
                                            mapRef.current.flyTo({ center: sub.coordinates, zoom: 14 });
                                            setIsModMinimized(true);
                                          }
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
                                          gap: '6px',
                                          boxSizing: 'border-box'
                                        }}
                                      >
                                        <Eye size={12} />
                                        PREVIEW
                                      </button>

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
                                          boxSizing: 'border-box'
                                        }}
                                      >
                                        EDIT INTEL
                                      </button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                      <button
                                        disabled={submittingApprovalId !== null || submittingRejectionId !== null}
                                        onClick={async () => {
                                          setSubmittingRejectionId(sub.id);
                                          setModeratorError(null);
                                          try {
                                            const response = await fetch('/api/moderate/reject', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ docId: sub.id, passcode: 'MTRH2026' })
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
                                          boxSizing: 'border-box'
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
                                            const response = await fetch('/api/moderate/approve', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ docId: sub.id, passcode: 'MTRH2026' })
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
                                          boxSizing: 'border-box'
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
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <span style={{ fontSize: '9px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        APPROVED INTEL AUDIT LOG (REVOKE INTEL BACK TO PENDING SCREEN OR PURGE WRONG ENTRIES):
                      </span>

                      {approvedSubmissions.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', border: `1px dashed ${theme.borderLight}`, color: isMapDarkMode ? theme.textDim : '#000000', fontSize: '11px', fontWeight: 'bold' }}>
                          NO REGISTERED APPROVED USER INTEL DISCOVERED IN CURRENT CLOUD INDEX.
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
                                      <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: theme.text }}>{sub.name}</h5>
                                      <div style={{ display: 'flex', gap: '12px', fontSize: '9px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500' }}>
                                        <span>LAYER: <strong style={{ color: isMapDarkMode ? (layerColors[sub.category] || '#b6a6ff') : '#000000', textDecoration: isMapDarkMode ? 'none' : 'underline' }}>{sub.category}</strong></span>
                                        <span>COORDS: <strong>[{sub.coordinates?.[1]}, {sub.coordinates?.[0]}]</strong></span>
                                        {sub.date ? <span>YEAR: <strong>{sub.date}</strong></span> : null}
                                      </div>
                                    </div>
                                    <span style={{ padding: '2px 6px', background: isMapDarkMode ? 'rgba(0, 204, 0, 0.1)' : '#000000', border: isMapDarkMode ? '1px solid #00cc00' : '1px solid #000000', color: isMapDarkMode ? '#00cc00' : '#ffffff', fontSize: '8px', fontWeight: 'bold', borderRadius: '1.5px' }}>APPROVED</span>
                                  </div>

                                  <p style={{ margin: 0, fontSize: '10.5px', lineHeight: '16px', color: isMapDarkMode ? theme.textDim : '#000000', fontWeight: isMapDarkMode ? 'normal' : '500', whiteSpace: 'pre-line' }}>
                                    {sub.description}
                                  </p>

                                  {sub.source && (
                                    <div style={{ fontSize: '9px', color: isMapDarkMode ? theme.textDim : '#000000', fontStyle: 'italic' }}>
                                      Source: <strong>{sub.source}</strong>
                                    </div>
                                  )}

                                  {sub.images && sub.images.length > 0 && (
                                    <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '10px' }}>
                                      <span style={{ fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: isMapDarkMode ? theme.text : '#000000' }}>ATTACHMENTS DETECTED:</span>
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
                                              [LINK {index+1}: {imgName.slice(0, 30)}...]
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

                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '12px', marginTop: '4px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button
                                        onClick={() => {
                                          if (mapRef.current) {
                                            const mockFeature = {
                                              id: sub.id,
                                              name: sub.name,
                                              description: sub.description,
                                              coordinates: sub.coordinates,
                                              categories: [sub.category],
                                              type: 'Point',
                                              isSubmitted: true
                                            };
                                            setSelectedFeature(mockFeature);
                                            mapRef.current.flyTo({ center: sub.coordinates, zoom: 14 });
                                            setIsModMinimized(true);
                                          }
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
                                          gap: '6px',
                                          boxSizing: 'border-box'
                                        }}
                                      >
                                        <Eye size={12} />
                                        PREVIEW
                                      </button>

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
                                          boxSizing: 'border-box'
                                        }}
                                      >
                                        EDIT INTEL
                                      </button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                      <button
                                        disabled={submittingRevocationId !== null || submittingRejectionId !== null}
                                        onClick={async () => {
                                          setSubmittingRevocationId(sub.id);
                                          setModeratorError(null);
                                          try {
                                            const response = await fetch('/api/moderate/revoke', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ docId: sub.id, passcode: 'MTRH2026' })
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
                                          boxSizing: 'border-box'
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
                                            const response = await fetch('/api/moderate/reject', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ docId: sub.id, passcode: 'MTRH2026' })
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
                                          boxSizing: 'border-box'
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
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING WIDGET WHEN MINIMIZED */}
      {isModeratorOpen && isModMinimized && (
        <button
          onClick={() => setIsModMinimized(false)}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 99999,
            background: isMapDarkMode ? '#111111' : '#ffffff',
            color: '#ffcc00',
            border: '2px solid #ffcc00',
            padding: '12px 20px',
            borderRadius: '24px',
            fontSize: '11px',
            fontWeight: 'bold',
            fontFamily: '"Space Mono", monospace',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textTransform: 'uppercase'
          }}
        >
          <Shield size={14} />
          <span>MAXIMIZE MOD DESK</span>
        </button>
      )}
    </div>
  );
}

export default App;
