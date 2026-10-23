// Media/URL helpers shared by the map, codex and other pages.
// Moved verbatim out of App.tsx; CodexPage keeps its own getEmbedUrl / cleanAndProxyImageUrl (they differ).

export const isVideoUrl = (url: string) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.ogv', '.mov'];
  const lowerUrl = url.trim().toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('youtube.com/embed') || 
         lowerUrl.includes('youtube.com/watch') ||
         lowerUrl.includes('youtu.be/') ||
         lowerUrl.includes('vimeo.com') || 
         lowerUrl.includes('dvidshub.net/video/embed') ||
         lowerUrl.includes('dvidshub.net/video/') ||
         lowerUrl.includes('twitter.com/i/status/') ||
         lowerUrl.includes('twitter.com/status/') ||
         lowerUrl.includes('x.com/i/status/') ||
         lowerUrl.includes('x.com/status/');
};

export const isPdfUrl = (url: string) => {
  if (!url) return false;
  const lowerUrl = url.trim().toLowerCase();
  return lowerUrl.includes('.pdf') || 
         lowerUrl.includes('docs.google.com/viewer') || 
         (lowerUrl.includes('web.archive.org') && lowerUrl.includes('/https://') && lowerUrl.split('https://')[1]?.includes('.pdf'));
};

export const getPdfViewerSrcDoc = (pdfUrl: string) => {
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
      letter-spacing: 0.05em;
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

export interface CombinedAsset {
  url: string;
  type: 'image' | 'video' | 'audio' | 'pdf';
  pdfUrl?: string;
  isCombined?: boolean;
}

export const getFilenameWithNoExtension = (url: string) => {
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

export const compressImageToDataUrl = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (isVideoUrl(file.name) || isPdfUrl(file.name) || isAudioUrl(file.name)) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getCombinedAssets = (images: string[]): CombinedAsset[] => {
  if (!images || images.length === 0) return [];
  
  // Deduplicate unique trimmed URLs while preserving order
  const uniqueImages: string[] = [];
  const seenUrls = new Set<string>();
  images.forEach(img => {
    const trimmed = (img || '').trim();
    if (trimmed && !seenUrls.has(trimmed)) {
      seenUrls.add(trimmed);
      uniqueImages.push(trimmed);
    }
  });

  const pdfs = uniqueImages.filter(isPdfUrl);
  const others = uniqueImages.filter(url => !isPdfUrl(url));
  
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

export const getEmbedUrl = (url: string) => {
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

  // Twitter / X
  if (trimmed.includes('twitter.com/') || trimmed.includes('x.com/')) {
    const match = trimmed.match(/(?:status|status\/|i\/status\/)(\d+)/);
    if (match && match[1]) {
      return `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}`;
    }
  }

  return trimmed;
};

export const isAudioUrl = (url: string) => {
  if (!url) return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac'];
  const lowerUrl = url.trim().toLowerCase();
  return audioExtensions.some(ext => lowerUrl.includes(ext));
};

export const MISSING_IMAGE_URL = '/icons/icon-missing-image.svg';

export const cleanAndProxyImageUrl = (url: any) => {
  if (!url || typeof url !== 'string') return MISSING_IMAGE_URL;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl.includes('icon-missing-image.svg')) return MISSING_IMAGE_URL;

  // Handle local uploaded files (e.g. '/uploads/abc.jpg', 'uploads/abc.jpg', or 'http://localhost:3000/uploads/abc.jpg')
  // NEVER truncate external domains (like WordPress sites with /wp-content/uploads/)!
  if (trimmedUrl.startsWith('/uploads/')) {
    return trimmedUrl;
  }
  if (trimmedUrl.startsWith('uploads/')) {
    return '/' + trimmedUrl;
  }
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    try {
      const parsed = new URL(trimmedUrl);
      const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || 
        (typeof window !== 'undefined' && parsed.host === window.location.host);
      if (isLocalHost && parsed.pathname.startsWith('/uploads/')) {
        return parsed.pathname;
      }
    } catch (_) {}
  }
  
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

  // Bypass proxy for localhost / internal IPs
  if (trimmedUrl.includes('localhost') || trimmedUrl.includes('127.0.0.1')) {
    return trimmedUrl;
  }

  // Bypass proxy for domains that block server-side IPs (like Wikipedia/Wikimedia 403s/429s on Cloud Run)
  // or that already fully support highly reliable direct client-side loading (like Unsplash/Wonders of the world).
  if (trimmedUrl.startsWith('http')) {
    if (trimmedUrl.includes('weserv.nl')) return trimmedUrl;
    if (trimmedUrl.includes('imgur.com')) return trimmedUrl;
    return `https://images.weserv.nl/?url=${encodeURIComponent(trimmedUrl)}`;
  }

  return trimmedUrl;
};
