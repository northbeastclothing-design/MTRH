# Image Loading & Authenticity Guidelines

This document outlines the design decisions, API usage patterns, and networking configurations established to safely embed and load high-quality, authentic site-specific imagery in the interactive map.

---

## 1. Image Authenticity Policy
- **No Stock Imagery**: Do not use generic stock photos (e.g. Unsplash templates, random book graphics, general forest/sky placeholders) for specific historical or geographical sites.
- **No AI-Generated Art**: Under no circumstances should AI-generated art or simulated historical graphics be used.
- **Strict Site-Specificity**: Only use actual historical, archaeological, or geographical photos representing the exact artifact, ruin, or excavation site.

---

## 2. Using Wikimedia Commons / Wikipedia CDN
The primary source for authentic historical imagery is **Wikimedia Commons**. To use these images successfully, adhere to the following rules:

### A. Filename and Path Formatting
- Wikimedia Commons image paths (`/wikipedia/commons/x/xx/Filename.ext`) are strictly case-sensitive.
- The directory hash prefix `x/xx` is derived from the first two characters of the MD5 hash of the filename (with spaces replaced by underscores).
- Always use the Wikipedia PageImages API or file queries to resolve the correct canonical filename and upload URL automatically rather than guessing or manually computing hashes.

### B. Bypassing Proxies for Wiki CDN (CORS & Referrer Policy)
- **Direct Browser Fetching**: Browsers do not enforce CORS restrictions on standard `<img>` tags. Therefore, Wikipedia/Wikimedia images do not need to be routed through a backend proxy server.
- **Prevent Referrer/Hotlink Blocks**: Always set the `referrerPolicy="no-referrer"` attribute on `<img />` tags in the React UI:
  ```html
  <img 
    src={imgSrc} 
    referrerPolicy="no-referrer" 
    alt="Historical find" 
  />
  ```
  This strips the `Referer` header from the request, causing Wikipedia's CDN to treat it as a direct user request, preventing hotlinking/cors errors on both `localhost` and production.
- **Avoid Cloud Run Proxy Blocks**: Do not route Wiki URLs through server-side proxies in production. Automated Cloud Run outbound IPs are frequently flagged and blocked by Wikipedia's rate-limiter, resulting in `403 Forbidden` or `429 Too Many Requests` status codes.

---

## 3. Querying MediaWiki API Without 429 Errors
If a script or server needs to fetch image metadata or verify files from Wikipedia, follow these rules:

### A. Batch Title Requests
- Do not make sequential individual queries in a loop.
- Use Wikipedia's batched query feature by joining up to 50 titles with the pipe (`|`) character in a single API call:
  ```
  https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=Title1|Title2|Title3
  ```

### B. Mandatory Custom User-Agent
- Wikipedia strictly blocks generic browser User-Agents (e.g. Chrome/Safari strings) and script default User-Agents (e.g. `curl`, `python-requests`, `urllib`) on automated endpoints.
- Always provide a descriptive, unique `User-Agent` that identifies your application and provides a contact email:
  ```javascript
  'User-Agent': 'MTRH-Interactive-Map/1.0 (contact: info@mtrhmap.org; development)'
  ```

---

## 4. Troubleshooting Missing Image Indicators
If a pin's dossier displays a missing image:
1. Verify the URL is directly from `upload.wikimedia.org`.
2. Inspect the React image element to ensure `referrerPolicy="no-referrer"` is active.
3. Check the developer console to see if the URL is bypassing the local/production proxy as configured in `cleanAndProxyImageUrl` in `src/App.tsx`.
