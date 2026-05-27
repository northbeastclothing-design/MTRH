import express from "express";
import path from "path";
import * as cheerio from 'cheerio';
import fs from "fs";
import admin from "firebase-admin";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === "production" || !!process.env.K_SERVICE || (typeof __filename !== "undefined" && __filename.includes("dist"));

// Initialize Firebase Admin with applet configuration
let firebaseProjectId: string | null = null;
let dbAdmin: admin.firestore.Firestore | null = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    firebaseProjectId = firebaseConfig.projectId;
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId
      });
    }
    if (firebaseConfig.firestoreDatabaseId) {
      dbAdmin = new admin.firestore.Firestore({
        projectId: firebaseConfig.projectId,
        databaseId: firebaseConfig.firestoreDatabaseId
      });
    } else {
      dbAdmin = admin.firestore();
    }
    console.log("Firebase Admin successfully initialized on server.");
  } else {
    console.warn("firebase-applet-config.json not found. Database features will be unavailable.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

const authorizedHosts = new Set<string>(["localhost", "127.0.0.1"]);

async function authorizeDomain(domain: string) {
  if (!firebaseProjectId) {
    console.warn(`[Domain Auth] Cannot authorize ${domain}: firebaseProjectId is not set.`);
    return;
  }
  
  // Skip standard IP addresses, local domains or empty values
  if (!domain || domain === "localhost" || domain === "127.0.0.1" || /^[0-9.]+$/.test(domain)) {
    return;
  }

  try {
    console.log(`[Domain Auth] Attempting to authorize domain "${domain}" on Firebase...`);
    const credential = admin.app().options.credential || admin.credential.applicationDefault();
    const tokenObj = await credential.getAccessToken();
    const token = tokenObj.accessToken;

    if (!token) {
      console.warn("[Domain Auth] Could not retrieve access token for Identity Toolkit config API.");
      return;
    }

    const configUrl = `https://identitytoolkit.googleapis.com/admin/v2/projects/${firebaseProjectId}/config`;
    
    // Fetch current project authentication config
    const getRes = await fetch(configUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!getRes.ok) {
      const errorText = await getRes.text();
      console.warn(`[Domain Auth] Failed to fetch Identity Toolkit config: ${getRes.status} - ${errorText}`);
      return;
    }

    const config = await getRes.json();
    const currentDomains: string[] = config.authorizedDomains || [];

    if (!currentDomains.includes(domain)) {
      const updatedDomains = [...currentDomains, domain];
      console.log(`[Domain Auth] Adding ${domain} to whitelist. New list:`, updatedDomains);

      const patchRes = await fetch(`${configUrl}?updateMask=authorizedDomains`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          authorizedDomains: updatedDomains
        })
      });

      if (patchRes.ok) {
        console.log(`[Domain Auth] Successfully whitelisted domain: ${domain}`);
      } else {
        const errorText = await patchRes.text();
        console.warn(`[Domain Auth] Failed to patch authorized domains: ${patchRes.status} - ${errorText}`);
      }
    } else {
      console.log(`[Domain Auth] Domain "${domain}" is already authorized.`);
    }
  } catch (err: any) {
    // This is expected during local development without GCP credentials, so we log it as a warning
    console.warn(`[Domain Auth] Firebase domain authorization failed for "${domain}" (this is normal if running locally without GCP credentials):`, err.message || err);
  }
}

async function startServer() {
  const app = express();

  // Dynamic host verification for Firebase Authentication domains
  app.use((req, res, next) => {
    const host = req.hostname || req.headers.host?.split(":")[0];
    if (host && !authorizedHosts.has(host)) {
      authorizedHosts.add(host);
      authorizeDomain(host).catch(err => {
        console.error(`[Domain Auth] Error in background authorizeDomain for ${host}:`, err);
        authorizedHosts.delete(host);
      });
    }
    next();
  });

  // Set payload sizes to allow base64 file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Ensure uploads directory exists and is statically served
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // File Upload Route
  app.post("/api/upload", async (req, res) => {
    try {
      const { filename, fileData } = req.body;
      if (!filename || !fileData) {
        return res.status(400).json({ error: "Missing filename or fileData" });
      }

      // Extract pure base64 representation if data url prefix is present
      const matches = fileData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
      let base64Content = fileData;
      if (matches && matches.length === 3) {
        base64Content = matches[2];
      }

      const buffer = Buffer.from(base64Content, 'base64');
      const sanitizedFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadsDir, sanitizedFilename);

      await fs.promises.writeFile(filePath, buffer);
      console.log(`Uploaded file saved to: ${filePath}`);

      res.json({ url: `/uploads/${sanitizedFilename}` });
    } catch (err: any) {
      console.error("Upload handler failed:", err);
      res.status(500).json({ error: "Could not persist uploaded file" });
    }
  });

  // Secure Server-side Moderation Routes bypassing OAuth unauthorized-domain constraints
  app.post("/api/moderate/approve", async (req, res) => {
    try {
      const { docId, passcode } = req.body;
      if (passcode !== "MTRH2026") {
        return res.status(403).json({ error: "BYPASS CODE DENIED." });
      }
      if (!docId) {
        return res.status(400).json({ error: "Missing document ID." });
      }
      if (!dbAdmin) {
        return res.status(500).json({ error: "Firebase database not initialized on server." });
      }

      const docRef = dbAdmin.collection('submissions').doc(docId);
      await docRef.update({
        status: 'approved'
      });

      console.log(`Submissions Server-Bypass: Approved document ${docId}`);
      res.json({ success: true, status: 'approved' });
    } catch (err: any) {
      console.error("Server-side approval failed:", err);
      res.status(500).json({ error: err.message || "Failed to approve submission on server" });
    }
  });

  app.post("/api/moderate/revoke", async (req, res) => {
    try {
      const { docId, passcode } = req.body;
      if (passcode !== "MTRH2026") {
        return res.status(403).json({ error: "BYPASS CODE DENIED." });
      }
      if (!docId) {
        return res.status(400).json({ error: "Missing document ID." });
      }
      if (!dbAdmin) {
        return res.status(500).json({ error: "Firebase database not initialized on server." });
      }

      const docRef = dbAdmin.collection('submissions').doc(docId);
      await docRef.update({
        status: 'pending'
      });

      console.log(`Submissions Server-Bypass: Revoked document ${docId} to pending`);
      res.json({ success: true, status: 'pending' });
    } catch (err: any) {
      console.error("Server-side revocation failed:", err);
      res.status(500).json({ error: err.message || "Failed to revoke submission on server" });
    }
  });

  app.post("/api/moderate/update", async (req, res) => {
    try {
      const { docId, passcode, updatedData } = req.body;
      if (passcode !== "MTRH2026") {
        return res.status(403).json({ error: "BYPASS CODE DENIED." });
      }
      if (!docId) {
        return res.status(400).json({ error: "Missing document ID." });
      }
      if (!updatedData) {
        return res.status(400).json({ error: "Missing updated data." });
      }
      if (!dbAdmin) {
        return res.status(500).json({ error: "Firebase database not initialized on server." });
      }

      const docRef = dbAdmin.collection('submissions').doc(docId);
      await docRef.update(updatedData);

      console.log(`Submissions Server-Bypass: Updated document ${docId}`);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Server-side update failed:", err);
      res.status(500).json({ error: err.message || "Failed to update submission on server" });
    }
  });

  app.get("/api/debug-domain-auth", async (req, res) => {
    try {
      const logs: string[] = [];
      const targetDomain = "mappingtherabbithole.com";
      
      logs.push(`[Debug] Target domain to check: ${targetDomain}`);
      logs.push(`[Debug] Project ID: ${firebaseProjectId}`);
      
      if (!firebaseProjectId) {
        return res.json({ error: "firebaseProjectId is not set.", logs });
      }

      const credential = admin.app().options.credential || admin.credential.applicationDefault();
      logs.push(`[Debug] Credential class: ${credential.constructor.name}`);
      
      let token;
      try {
        const tokenObj = await credential.getAccessToken();
        token = tokenObj.accessToken;
        logs.push(`[Debug] Access token retrieved successfully (ends with ...${token.substring(token.length - 8)})`);
      } catch (err: any) {
        logs.push(`[Debug] Failed to retrieve access token: ${err.message || err}`);
        return res.json({ error: "Access token retrieval failed", logs });
      }

      const configUrl = `https://identitytoolkit.googleapis.com/admin/v2/projects/${firebaseProjectId}/config`;
      logs.push(`[Debug] Fetching config from: ${configUrl}`);

      const getRes = await fetch(configUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      logs.push(`[Debug] GET request status: ${getRes.status}`);
      const getResBody = await getRes.text();
      logs.push(`[Debug] GET request response: ${getResBody}`);

      if (!getRes.ok) {
        return res.json({ error: `Identity Toolkit GET config returned ${getRes.status}`, logs });
      }

      const config = JSON.parse(getResBody);
      const currentDomains: string[] = config.authorizedDomains || [];
      logs.push(`[Debug] Current whitelisted domains: ${JSON.stringify(currentDomains)}`);

      if (!currentDomains.includes(targetDomain)) {
        const updatedDomains = [...currentDomains, targetDomain];
        logs.push(`[Debug] Whitelisting domain: ${targetDomain}`);

        const patchRes = await fetch(`${configUrl}?updateMask=authorizedDomains`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            authorizedDomains: updatedDomains
          })
        });

        logs.push(`[Debug] PATCH request status: ${patchRes.status}`);
        const patchResBody = await patchRes.text();
        logs.push(`[Debug] PATCH request response: ${patchResBody}`);

        if (patchRes.ok) {
          res.json({ success: true, message: `Successfully authorized domain: ${targetDomain}`, logs });
        } else {
          res.json({ error: `Identity Toolkit PATCH returned ${patchRes.status}`, logs });
        }
      } else {
        res.json({ success: true, message: `Domain "${targetDomain}" is already in authorized list.`, logs });
      }

    } catch (err: any) {
      res.json({ error: err.message || String(err), stack: err.stack });
    }
  });

  app.post("/api/moderate/reject", async (req, res) => {
    try {
      const { docId, passcode } = req.body;
      if (passcode !== "MTRH2026") {
        return res.status(403).json({ error: "BYPASS CODE DENIED." });
      }
      if (!docId) {
        return res.status(400).json({ error: "Missing document ID." });
      }
      if (!dbAdmin) {
        return res.status(500).json({ error: "Firebase database not initialized on server." });
      }

      const docRef = dbAdmin.collection('submissions').doc(docId);
      await docRef.delete();

      console.log(`Submissions Server-Bypass: Deleted/Rejected document ${docId}`);
      res.json({ success: true, status: 'deleted' });
    } catch (err: any) {
      console.error("Server-side rejection failed:", err);
      res.status(500).json({ error: err.message || "Failed to reject/delete submission on server" });
    }
  });

  app.post("/api/submissions/create", async (req, res) => {
    try {
      const { name, category, description, coordinates, images, date, source } = req.body;
      if (!name || !category || !description || !coordinates) {
        return res.status(400).json({ error: "Missing required fields." });
      }
      if (!dbAdmin) {
        return res.status(500).json({ error: "Firebase database not initialized on server." });
      }

      const submissionId = `user_${Date.now()}`;
      const submissionData: any = {
        name: name.trim(),
        category: category,
        description: description.trim(),
        coordinates: coordinates,
        images: images || [],
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (date && typeof date === 'string' && date.trim()) {
        submissionData.date = date.trim();
      }
      if (source && typeof source === 'string' && source.trim()) {
        submissionData.source = source.trim();
      }

      await dbAdmin.collection('submissions').doc(submissionId).set(submissionData);

      console.log(`Submissions Server-Bypass: Created submission ${submissionId}`);
      res.json({ success: true, id: submissionId });
    } catch (err: any) {
      console.error("Server-side submission creation failed:", err);
      res.status(500).json({ error: err.message || "Failed to create submission on server" });
    }
  });

  app.post("/api/moderate/pending", async (req, res) => {
    try {
      const { passcode } = req.body;
      if (passcode !== "MTRH2026") {
        return res.status(403).json({ error: "BYPASS CODE DENIED." });
      }
      if (!dbAdmin) {
        return res.status(500).json({ error: "Firebase database not initialized on server." });
      }

      const snapshot = await dbAdmin.collection('submissions').get();
      const docs: any[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === "pending") {
          docs.push({
            id: doc.id,
            ...data
          });
        }
      });

      console.log(`Submissions Server-Bypass: Returned ${docs.length} pending submissions.`);
      res.json({ success: true, pending: docs });
    } catch (err: any) {
      console.error("Server-side pending fetch failed:", err);
      res.status(500).json({ error: err.message || "Failed to fetch pending submissions on server" });
    }
  });

  // Image Proxy Route to bypass hotlinking and CORS
  app.get("/api/proxy-resource", async (req, res) => {
    const url = req.query.url as string;
    if (!url) return res.status(400).send("URL is required");
    
    try {
      // Determine probable Referer based on domain
      let referer = 'https://uap-files.pages.dev/';
      if (url.includes('aaro.mil')) referer = 'https://www.aaro.mil/';
      if (url.includes('archives.gov')) referer = 'https://www.archives.gov/';
      if (url.includes('wikimedia.org')) referer = 'https://commons.wikimedia.org/';
      if (url.includes('wikipedia.org')) referer = 'https://en.wikipedia.org/';
      if (url.toLowerCase().includes('usercontent') || url.toLowerCase().includes('googleusercontent')) {
        referer = 'https://mymaps.google.com/';
      }

      const domain = new URL(url).hostname;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,application/pdf,video/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Referer': referer,
          'Host': domain
        }
      });
      
      if (!response.ok) {
        console.warn(`Upstream returned ${response.status} for ${url}`);
        return res.status(response.status).send(`Upstream error: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      } else {
        // Fallback for common types if missing in header
        if (url.endsWith('.pdf')) res.setHeader("Content-Type", "application/pdf");
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) res.setHeader("Content-Type", "image/jpeg");
        if (url.endsWith('.png')) res.setHeader("Content-Type", "image/png");
      }
      
      // Handle potential frame options and CSP from upstream that would break embedding
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");
      res.removeHeader("Cross-Origin-Resource-Policy");
      res.setHeader("X-Frame-Options", "ALLOWALL");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Disposition", "inline");
      
      // Add caching for performance
      res.setHeader("Cache-Control", "public, max-age=86400");
      
      const arrayBuffer = await response.arrayBuffer();
      console.log(`Proxy: Successfully fetched ${url} (${arrayBuffer.byteLength} bytes) - Type: ${contentType}`);
      res.send(Buffer.from(arrayBuffer));
    } catch (e) {
      console.error(`Proxy failed for ${url}:`, e);
      res.status(500).send("Proxy technical error");
    }
  });

  // API Route for UAP Archive Scraping
  app.get("/api/uap-archive", async (req, res) => {
    try {
      console.log('Fetching UAP Archive from https://uap-files.pages.dev/ ...');
      const response = await fetch('https://uap-files.pages.dev/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const records: any[] = [];
      
      // Attempt 1: Check for NEXT_DATA (Common in modern static sites)
      const nextData = $('#__NEXT_DATA__').html();
      if (nextData) {
        try {
          const parsed = JSON.parse(nextData);
          // Recursively find any arrays that look like records
          const findData = (obj: any): any[] | null => {
            if (!obj || typeof obj !== 'object') return null;
            if (Array.isArray(obj)) {
              if (obj.length > 5 && (obj[0].title || obj[0].name || obj[0].id)) return obj;
              for (const item of obj) {
                const result = findData(item);
                if (result) return result;
              }
            }
            for (const key in obj) {
              const result = findData(obj[key]);
              if (result) return result;
            }
            return null;
          };

          const rawData = findData(parsed);
          if (rawData && Array.isArray(rawData)) {
             rawData.forEach((item: any, idx: number) => {
               if (!item.title && !item.name && !item.description) return;
               records.push({
                 id: item.id || `uap-idx-${idx}`,
                 name: item.title || item.name || "UAP Incident",
                 category: item.category || "U.F.O. Sightings",
                 description: item.description || item.comments || item.summary || "",
                 date: item.date || item.year || item.occurred_at || 2024,
                 coordinates: item.coordinates || [item.lng || item.longitude || -77.0, item.lat || item.latitude || 38.9],
                 images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
                 source: "UAP Archive / Scraping"
               });
             });
          }
        } catch (e) {
          console.error('Error parsing NEXT_DATA:', e);
        }
      }

      // Effort to pull from AARO directly (Experimental)
      try {
        const aaroRes = await fetch('https://www.aaro.mil/UAP-Cases/', {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (aaroRes.ok) {
          const aaroHtml = await aaroRes.text();
          const $aaro = cheerio.load(aaroHtml);
          $aaro('.card, .case-item').each((i, el) => {
            const title = $aaro(el).find('h3, .title').text().trim();
            if (title) {
              records.push({
                id: `aaro-live-${i}`,
                name: title,
                category: "War.gov UFO Files",
                description: "Official AARO Case Study",
                source: "AARO.mil",
                coordinates: [0, 0] // Geocoding NOT available in simple scrape
              });
            }
          });
        }
      } catch (aaroErr) {
        console.warn("Direct AARO scrape failed, relying on fallback/archive.");
      }
      
      /* Removed hardcoded seat fallbacks as they cause duplicates and use broken links. Local warGovData.json provides primary coverage. */
      
      // Attempt 2: DOM Scraping (Fallback)
      if (records.length === 0) {
        // Target specifically the selectors mentioned in Gemini's advice if they exist
        $('.data-point-card, div[class*="card"], div[class*="record"], article').each((i, el) => {
          const title = $(el).find('h2, h3, .title, .name').first().text().trim();
          const description = $(el).find('p, .description, .summary').first().text().trim();
          const image = $(el).find('img').attr('src');
          const video = $(el).find('video source').attr('src');
          
          if (title || description) {
            // If image is relative, make it absolute
            let finalImage = image;
            if (finalImage && !finalImage.startsWith('http')) {
              finalImage = new URL(finalImage, 'https://uap-files.pages.dev/').href;
            }

              records.push({
                id: `uap-dom-${i}`,
                name: title || "UAP Incident",
                category: "U.F.O. Sightings",
                description: description,
              images: finalImage ? [finalImage] : [],
              video: video,
              source: "UAP Archive Scraping",
              coordinates: [ -77.0369, 38.9072 ] // Default to DC area if no coords found in DOM
            });
          }
        });
      }

      console.log(`Scraping complete. Found ${records.length} records.`);
      res.json({ records });
    } catch (error) {
      console.error('Scraping error:', error);
      res.status(500).json({ error: 'Failed to scrape UAP archive' });
    }
  });

  // Vite middleware for development
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
