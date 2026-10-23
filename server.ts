import express from "express";
import path from "path";
import fs from "fs";
import net from "net";
import dns from "dns";
import crypto from "crypto";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import admin from "firebase-admin";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { TERM_TREE_DATA } from './src/termTreeData';
import { DATA_CENTERS_DATA } from './src/dataCentersData';
import { ARCHAEOLOGICAL_FINDS_DATA } from './src/archaeologyData';
import { OLD_WORLD_STRUCTURES_DATA } from './src/oldWorldStructuresData';
import { TIMELINE_ITEMS } from './src/timelineData';
import { generateDeclassifiedDossierPdf } from './src/server/generateDossierPdf';
import { HISTORICAL_MAPS } from './src/cartographyMaps';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === "production" || !!process.env.K_SERVICE || (typeof __filename !== "undefined" && __filename.includes("dist"));


function getOgpMetaForRequest(reqPath: string, query: Record<string, any>, fullUrl: string) {
  const { featureId, termId, itemId, mapId } = query;

  let title = '';
  let description = '';
  let image = '';

  // Same registry the Cartography page renders from, so ?mapId= previews always match the page.
  const historicalMap = mapId ? HISTORICAL_MAPS.find(m => m.id === String(mapId)) : undefined;
  if (historicalMap) {
    title = `${historicalMap.name} | Historical Cartography | MTRH Map`;
    description = historicalMap.description;
    image = historicalMap.url;
  } else if (termId) {
    const node = TERM_TREE_DATA.find(n => n.id === String(termId));
    if (node) {
      title = `${node.name} | Codex Research Archive | MTRH Map`;
      description = node.description || 'Declassified dossier and anomaly research on MTRH Interactive Map.';
      image = node.images?.[0] || '';
    }
  } else if (featureId || itemId) {
    const targetId = String(featureId || itemId);
    const dcItem = DATA_CENTERS_DATA.find(n => n.id === targetId);
    const archItem = ARCHAEOLOGICAL_FINDS_DATA.find(n => n.id === targetId);
    const oldWorldItem = OLD_WORLD_STRUCTURES_DATA.find(n => n.id === targetId);
    const timelineItem = TIMELINE_ITEMS.find(n => String(n.id) === targetId);
    const codexItem = TERM_TREE_DATA.find(n => n.id === targetId || n.mapFeatureId === targetId || n.timelineId === targetId);

    const found = dcItem || archItem || oldWorldItem || timelineItem || codexItem;
    if (found) {
      title = `${found.name} | Dossier Archive | MTRH Map`;
      description = found.description || 'Declassified dossier and anomaly research on MTRH Interactive Map.';
      image = found.images?.[0] || (found as any).imageUrl || '';
    }
  }

  if (!title) {
    const lowerPath = reqPath.toLowerCase();
    if (lowerPath.includes('/codex')) {
      title = 'Codex Knowledge Tree | MTRH Interactive Map';
      description = 'Explore interconnected nodes, historical cross-references, and classified research categories.';
    } else if (lowerPath.includes('/timeline')) {
      title = 'Chronological Timeline Archive | MTRH Interactive Map';
      description = 'Trace historical events, declassified releases, and anomaly sightings through time.';
    } else if (lowerPath.includes('/cartography')) {
      title = 'Historical Cartography Collection | MTRH Interactive Map';
      description = 'Inspect high-resolution historical maps, ancient worldviews, and firmament projections.';
    } else {
      title = 'MTRH Interactive Map | Mapping The Rabbit Hole';
      description = 'Interactive geospatial map and intelligence archive exploring declassified operations, anomalies, ancient monuments, and firmament cosmology.';
    }
  }

  if (image && image.startsWith('http') && !image.includes('weserv.nl')) {
    // Map scans can be 3840px wide; cap share-card images so social scrapers accept them.
    const sizeHint = historicalMap ? '&w=1200' : '';
    image = `https://images.weserv.nl/?url=${image}${sizeHint}`;
  } else if (!image) {
    image = 'https://uap-files.pages.dev/preview-banner.jpg';
  }

  return {
    title,
    description,
    image,
    url: fullUrl
  };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Resource proxy safety -------------------------------------------------
// The proxy accepts any public http(s) URL so that image/PDF fallbacks keep
// working for every data source, but it must never be steerable at localhost,
// the Cloud Run metadata server, or the private network, and it must never
// hand HTML/scripts back to the browser under our origin.

const BLOCKED_HOSTNAMES = new Set(['localhost', 'metadata', 'metadata.google.internal']);

function isPrivateIp(rawIp: string): boolean {
  const mapped = rawIp.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  const ip = mapped ? mapped[1] : rawIp;
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168)
      || a >= 224;
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    return lower === '::' || lower === '::1' || /^f[cd]/.test(lower) || /^fe[89ab]/.test(lower) || lower.startsWith('ff');
  }
  return true;
}

async function assertPublicUrl(target: URL): Promise<void> {
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    throw new Error('Unsupported protocol');
  }
  const host = target.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith('.internal') || host.endsWith('.local')) {
    throw new Error('Blocked host');
  }
  if (net.isIP(host)) {
    if (isPrivateIp(host)) throw new Error('Blocked address');
    return;
  }
  const addrs = await dns.promises.lookup(host, { all: true });
  if (addrs.length === 0 || addrs.some(a => isPrivateIp(a.address))) {
    throw new Error('Blocked address');
  }
}

// fetch() that re-validates the destination on every redirect hop.
async function safeFetch(url: string, init: RequestInit, maxRedirects = 5): Promise<Response> {
  let current = url;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    await assertPublicUrl(new URL(current));
    const response = await fetch(current, { ...init, redirect: 'manual' });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return response;
      await response.body?.cancel().catch(() => {});
      current = new URL(location, current).href;
      continue;
    }
    return response;
  }
  throw new Error('Too many redirects');
}

// Only media may pass back through the proxy. octet-stream is tolerated because
// some hosts serve images that way; nosniff + CSP sandbox keep it inert.
function isAllowedProxyMediaType(contentType: string): boolean {
  return /^(image|video|audio)\//i.test(contentType) || /octet-stream/i.test(contentType);
}

// Initialize Firebase Admin with applet configuration
let dbAdmin: admin.firestore.Firestore | null = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
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

// Local filesystem-based mock database helper when live Firestore is inaccessible
const LOCAL_DB_DIR = path.join(process.cwd(), '.local_db');
if (!fs.existsSync(LOCAL_DB_DIR)) {
  fs.mkdirSync(LOCAL_DB_DIR);
}

function getLocalMockFile(collection: string): any[] {
  const filePath = path.join(LOCAL_DB_DIR, `${collection}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveLocalMockFile(collection: string, data: any[]) {
  const filePath = path.join(LOCAL_DB_DIR, `${collection}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function safeGetCollection(collectionName: string): Promise<any[]> {
  try {
    if (!dbAdmin) {
      return getLocalMockFile(collectionName);
    }
    const snapshot = await dbAdmin.collection(collectionName).get();
    const docs: any[] = [];
    snapshot.forEach(doc => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    return docs;
  } catch (err: any) {
    if (err.message?.includes("default credentials") || err.message?.includes("credentials") || err.code === 'credentials') {
      console.warn(`[Firestore Fallback] Using local mock database for "${collectionName}" (Firestore credentials not loaded).`);
      return getLocalMockFile(collectionName);
    }
    throw err;
  }
}

async function safeAddDocument(collectionName: string, docId: string | null, data: any): Promise<string> {
  try {
    if (!dbAdmin) {
      const mockDb = getLocalMockFile(collectionName);
      const id = docId || `mock_${Date.now()}`;
      mockDb.push({ id, ...data });
      saveLocalMockFile(collectionName, mockDb);
      return id;
    }
    if (docId) {
      await dbAdmin.collection(collectionName).doc(docId).set(data);
      return docId;
    } else {
      const docRef = await dbAdmin.collection(collectionName).add(data);
      return docRef.id;
    }
  } catch (err: any) {
    if (err.message?.includes("default credentials") || err.message?.includes("credentials") || err.code === 'credentials') {
      console.warn(`[Firestore Fallback] Using local mock database for writing to "${collectionName}" (Firestore credentials not loaded).`);
      const mockDb = getLocalMockFile(collectionName);
      const id = docId || `mock_${Date.now()}`;
      mockDb.push({ id, ...data });
      saveLocalMockFile(collectionName, mockDb);
      return id;
    }
    throw err;
  }
}

async function safeUpdateDocument(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    if (!dbAdmin) {
      const mockDb = getLocalMockFile(collectionName);
      const idx = mockDb.findIndex(item => item.id === docId);
      if (idx !== -1) {
        mockDb[idx] = { ...mockDb[idx], ...data };
        saveLocalMockFile(collectionName, mockDb);
      }
      return;
    }
    await dbAdmin.collection(collectionName).doc(docId).update(data);
  } catch (err: any) {
    if (err.message?.includes("default credentials") || err.message?.includes("credentials") || err.code === 'credentials') {
      console.warn(`[Firestore Fallback] Using local mock database for updating "${collectionName}" (Firestore credentials not loaded).`);
      const mockDb = getLocalMockFile(collectionName);
      const idx = mockDb.findIndex(item => item.id === docId);
      if (idx !== -1) {
        mockDb[idx] = { ...mockDb[idx], ...data };
        saveLocalMockFile(collectionName, mockDb);
      }
      return;
    }
    throw err;
  }
}

async function safeDeleteDocument(collectionName: string, docId: string): Promise<void> {
  try {
    if (!dbAdmin) {
      const mockDb = getLocalMockFile(collectionName);
      const filtered = mockDb.filter(item => item.id !== docId);
      saveLocalMockFile(collectionName, filtered);
      return;
    }
    await dbAdmin.collection(collectionName).doc(docId).delete();
  } catch (err: any) {
    if (err.message?.includes("default credentials") || err.message?.includes("credentials") || err.code === 'credentials') {
      console.warn(`[Firestore Fallback] Using local mock database for deleting from "${collectionName}" (Firestore credentials not loaded).`);
      const mockDb = getLocalMockFile(collectionName);
      const filtered = mockDb.filter(item => item.id !== docId);
      saveLocalMockFile(collectionName, filtered);
      return;
    }
    throw err;
  }
}

/**
 * Sends an email notification to the moderator.
 */
async function sendNotificationEmail(subject: string, textBody: string, htmlBody: string) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const toEmail = process.env.SMTP_TO || "mappingtherabbithole@gmail.com";

  if (!host || !user || !pass) {
    console.warn("[Email Notification] SMTP credentials not fully configured in environment variables. Skipping email dispatch.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });

    const info = await transporter.sendMail({
      from: `"MTRH Map Notifications" <${user}>`,
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody
    });

    console.log(`[Email Notification] Email successfully sent to ${toEmail}: ${info.messageId}`);
  } catch (error) {
    console.error("[Email Notification] Failed to send email notification:", error);
  }
}

async function startServer() {
  const app = express();

  // Cloud Run fronts the service with exactly one Google load-balancer hop. Trusting
  // it makes req.ip and req.protocol reflect the real client, which the rate
  // limiters and the OGP share URLs both depend on.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Gzip/Brotli-compress text responses (HTML, JS, CSS, JSON). Images, video and
  // PDFs are already compressed and are passed through untouched.
  app.use(compression());

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  // Public write endpoints: generous per-IP cap that a real visitor won't reach.
  const publicWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests from this address. Please try again later.' }
  });

  // Moderation endpoints: only *failed* attempts count, so the moderator is never
  // throttled while brute-forcing the passcode is.
  const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many failed authorization attempts. Try again in 15 minutes.' }
  });

  // Resource proxy: high ceiling (PDF viewer + image fallbacks are legitimately chatty).
  const proxyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: 'draft-8',
    legacyHeaders: false
  });

  app.use('/api/moderate', adminLimiter);

  // Set payload sizes to allow base64 attachments embedded in submissions
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Ensure uploads directory exists and is statically served
  const uploadsDir = path.join(process.cwd(), "uploads");
  const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  try {
    if (!fs.existsSync(publicUploadsDir)) {
      fs.mkdirSync(publicUploadsDir, { recursive: true });
    }
  } catch (e) {
    console.warn("Could not create publicUploadsDir:", e);
  }

  app.use("/uploads", express.static(uploadsDir));
  try {
    app.use("/uploads", express.static(publicUploadsDir));
  } catch (e) {}

  // Attachments are embedded in submissions as data URLs by the client, so there is
  // no server-side upload endpoint. (The old unauthenticated /api/upload was removed.)

  const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "";
  const ADMIN_EMAIL = "jhuffman710@gmail.com";
  if (!ADMIN_PASSCODE) {
    console.error("[Admin Auth] ADMIN_PASSCODE is not set. Passcode login to the moderation desk is DISABLED; only Google sign-in will work. Set ADMIN_PASSCODE in the environment to enable it.");
  }

  const safeEqual = (a: string, b: string) => {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
  };

  async function verifyAdminAccess(req: express.Request): Promise<boolean> {
    const { passcode } = req.body;
    const authHeader = req.headers.authorization;

    // 1. Passcode check (body or auth header) - only when one is configured
    if (ADMIN_PASSCODE) {
      if (typeof passcode === "string" && safeEqual(passcode, ADMIN_PASSCODE)) return true;
      if (typeof authHeader === "string" && safeEqual(authHeader, ADMIN_PASSCODE)) return true;
    }

    // 2. Firebase ID Token check
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (decodedToken && decodedToken.email === ADMIN_EMAIL && decodedToken.email_verified) {
          return true;
        }
      } catch (err: any) {
        console.warn("[Admin Auth] Failed to verify ID Token:", err.message || err);
      }
    }

    return false;
  }

  // Secure Server-side Moderation Routes bypassing OAuth unauthorized-domain constraints
  app.post("/api/moderate/approve", async (req, res) => {
    try {
      const { docId } = req.body;
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }
      if (!docId) {
        return res.status(400).json({ error: "Missing document ID." });
      }

      await safeUpdateDocument('submissions', docId, {
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
      const { docId } = req.body;
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }
      if (!docId) {
        return res.status(400).json({ error: "Missing document ID." });
      }

      await safeUpdateDocument('submissions', docId, {
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
      const { docId, updatedData } = req.body;
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }
      if (!docId) {
        return res.status(400).json({ error: "Missing document ID." });
      }
      if (!updatedData) {
        return res.status(400).json({ error: "Missing updated data." });
      }

      await safeUpdateDocument('submissions', docId, updatedData);

      console.log(`Submissions Server-Bypass: Updated document ${docId}`);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Server-side update failed:", err);
      res.status(500).json({ error: err.message || "Failed to update submission on server" });
    }
  });

  app.post("/api/moderate/reject", async (req, res) => {
    try {
      const { docId } = req.body;
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }
      if (!docId) {
        return res.status(400).json({ error: "Missing document ID." });
      }

      await safeDeleteDocument('submissions', docId);

      console.log(`Submissions Server-Bypass: Deleted/Rejected document ${docId}`);
      res.json({ success: true, status: 'deleted' });
    } catch (err: any) {
      console.error("Server-side rejection failed:", err);
      res.status(500).json({ error: err.message || "Failed to reject/delete submission on server" });
    }
  });

  app.post("/api/submissions/create", publicWriteLimiter, async (req, res) => {
    try {
      const {
        name,
        category,
        description,
        coordinates,
        images,
        date,
        source,
        socialLink,
        submitterLink,
        destinations,
        codexParentId,
        timelineLayer,
        timelineType,
        timelineEnd,
        timelineFatherId,
        timelineMotherId,
        timelineSpouseId,
        submitterName,
        submitterEmail
      } = req.body;

      if (!name || !category || !description) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const submissionId = `user_${Date.now()}`;
      const effectiveLink = (submitterLink && typeof submitterLink === 'string' && submitterLink.trim()) 
        ? submitterLink.trim() 
        : ((socialLink && typeof socialLink === 'string' && socialLink.trim()) ? socialLink.trim() : '');

      const submissionData: any = {
        name: name.trim(),
        category: category,
        description: description.trim(),
        images: images || [],
        status: 'pending',
        createdAt: dbAdmin ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
        destinations: destinations || ['map'],
        codexParentId: codexParentId || '',
        timelineLayer: timelineLayer || '',
        timelineType: timelineType || 'event',
        timelineEnd: timelineEnd || '',
        timelineFatherId: timelineFatherId || '',
        timelineMotherId: timelineMotherId || '',
        timelineSpouseId: timelineSpouseId || '',
        submitterName: (submitterName && typeof submitterName === 'string') ? submitterName.trim() : '',
        submitterEmail: (submitterEmail && typeof submitterEmail === 'string') ? submitterEmail.trim() : '',
        submitterLink: effectiveLink,
        socialLink: effectiveLink
      };

      if (coordinates !== undefined && coordinates !== null) {
        submissionData.coordinates = coordinates;
      }

      if (date && typeof date === 'string' && date.trim()) {
        submissionData.date = date.trim();
      }
      if (source && typeof source === 'string' && source.trim()) {
        submissionData.source = source.trim();
      }

      await safeAddDocument('submissions', submissionId, submissionData);

      // Trigger email notification in the background
      const appUrl = process.env.APP_URL || "https://mappingtherabbithole.com";
      const modLink = `${appUrl}/moderator`;
      
      const subject = `[MTRH] New Intel Submission: ${submissionData.name}`;
      const textBody = `A new piece of intel has been submitted for moderation review.

Name of Anomaly / Signature: ${submissionData.name}
Destinations: ${(submissionData.destinations || []).join(', ') || "map"}
Map Category / Layer: ${submissionData.category}
Date/Timeframe: ${submissionData.date || "Not provided"}
Source/Provenance: ${submissionData.source || "Not provided"}
Coordinates: ${submissionData.coordinates ? JSON.stringify(submissionData.coordinates) : "Not provided"}
Social Link: ${submissionData.socialLink || "Not provided"}
Submitter Name: ${submissionData.submitterName || "Not provided"}
Submitter Email: ${submissionData.submitterEmail || "Not provided"}

--- Codex Placement ---
Parent Codex Term ID: ${submissionData.codexParentId || "None (Root category)"}

--- Timeline Placement ---
Timeline Era / Layer: ${submissionData.timelineLayer || "None"}
Timeline Type: ${submissionData.timelineType || "event"}
Timeline End Year: ${submissionData.timelineEnd || "N/A"}
Father ID: ${submissionData.timelineFatherId || "None"}
Mother ID: ${submissionData.timelineMotherId || "None"}
Spouse ID: ${submissionData.timelineSpouseId || "None"}

Description:
${submissionData.description}

Attachments:
${submissionData.images && submissionData.images.length > 0 ? submissionData.images.join("\n") : "None"}

Please review and approve or reject this submission in the Moderation Desk:
${modLink}
`;

      // Everything below came from an anonymous visitor: escape it before it lands in the moderator's inbox.
      const h = (v: unknown) => escapeHtml(String(v ?? ''));
      const coordsText = Array.isArray(submissionData.coordinates)
        ? `[${submissionData.coordinates.join(', ')}]`
        : (submissionData.coordinates ? JSON.stringify(submissionData.coordinates) : "Not provided");
      const attachmentHref = (img: string) => {
        const full = img.startsWith('/') ? appUrl + img : img;
        return /^(https?:\/\/|data:(image|video|audio|application\/pdf))/i.test(full) ? full : '';
      };

      const htmlBody = `
        <div style="font-family: monospace; padding: 20px; background-color: #000; color: #fff; border: 1px solid #fff;">
          <h2 style="color: #ffcc00; border-bottom: 2px solid #ffcc00; padding-bottom: 10px; font-weight: bold; letter-spacing: 1px;">MTRH // New Intel Submitted</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px; font-weight: bold; width: 180px; color: #ffcc00;">Anomaly Name:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${h(submissionData.name)}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ffcc00;">Destinations:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222; color: #ffcc00;"><strong>${h((submissionData.destinations || []).join(', '))}</strong></td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ffcc00;">Map Category:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${h(submissionData.category)}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ffcc00;">Date/Timeframe:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${h(submissionData.date || "Not provided")}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ffcc00;">Coordinates:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${h(coordsText)}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ffcc00;">Source:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${h(submissionData.source || "Not provided")}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ffcc00;">Social Link:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${h(submissionData.socialLink || "Not provided")}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ffcc00;">Submitter Name:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${h(submissionData.submitterName || "Not provided")}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ffcc00;">Submitter Email:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${submissionData.submitterEmail ? `<a href="mailto:${h(submissionData.submitterEmail)}" style="color: #ffcc00;">${h(submissionData.submitterEmail)}</a>` : "Not provided"}</td>
            </tr>
          </table>

          <div style="margin-bottom: 20px; border: 1px solid #333; padding: 12px; background: #111;">
            <h4 style="color: #ffcc00; font-weight: bold; margin: 0 0 10px 0; border-bottom: 1px solid #333; padding-bottom: 4px;">Codex Placement</h4>
            <div>Parent Term ID: <code>${h(submissionData.codexParentId || "None (Root)")}</code></div>
          </div>

          <div style="margin-bottom: 20px; border: 1px solid #333; padding: 12px; background: #111;">
            <h4 style="color: #ffcc00; font-weight: bold; margin: 0 0 10px 0; border-bottom: 1px solid #333; padding-bottom: 4px;">Timeline Placement</h4>
            <table style="width: 100%; font-size: 11px;">
              <tr><td style="width: 150px; color: #aaa;">Layer/Era:</td><td>${h(submissionData.timelineLayer || "None")}</td></tr>
              <tr><td style="color: #aaa;">Type:</td><td>${h(submissionData.timelineType)}</td></tr>
              <tr><td style="color: #aaa;">End Year:</td><td>${h(submissionData.timelineEnd || "N/A")}</td></tr>
              <tr><td style="color: #aaa;">Father ID:</td><td>${h(submissionData.timelineFatherId || "None")}</td></tr>
              <tr><td style="color: #aaa;">Mother ID:</td><td>${h(submissionData.timelineMotherId || "None")}</td></tr>
              <tr><td style="color: #aaa;">Spouse ID:</td><td>${h(submissionData.timelineSpouseId || "None")}</td></tr>
            </table>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="color: #ffcc00; font-weight: bold; margin-bottom: 8px;">Description</h4>
            <p style="white-space: pre-wrap; background: #111; padding: 12px; border: 1px solid #333; line-height: 1.6;">${h(submissionData.description)}</p>
          </div>
          ${Array.isArray(submissionData.images) && submissionData.images.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h4 style="color: #ffcc00; font-weight: bold; margin-bottom: 8px;">Staged Attachments</h4>
            <ul style="list-style-type: none; padding: 0;">
              ${submissionData.images.map((img: unknown) => {
                const text = String(img ?? '');
                const href = attachmentHref(text);
                return href
                  ? `<li><a href="${h(href)}" style="color: #3b82f6; text-decoration: none;" target="_blank">${h(text)}</a></li>`
                  : `<li>${h(text)}</li>`;
              }).join('')}
            </ul>
          </div>` : ''}
          <div style="margin-top: 30px; text-align: center;">
            <a href="${modLink}" style="display: inline-block; background: #ffcc00; color: #000; font-weight: bold; text-decoration: none; padding: 10px 24px; border: 2px solid #ffcc00; letter-spacing: 0.5px;">OPEN DECISIONAL MODERATION DESK</a>
          </div>
        </div>
      `;

      sendNotificationEmail(subject, textBody, htmlBody).catch(err => {
        console.error("Failed to send submission email in background:", err);
      });

      console.log(`Submissions Server-Bypass: Created submission ${submissionId}`);
      res.json({ success: true, id: submissionId });
    } catch (err: any) {
      console.error("Server-side submission creation failed:", err);
      res.status(500).json({ error: err.message || "Failed to create submission on server" });
    }
  });

  app.post("/api/moderate/pending", async (req, res) => {
    try {
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }

      const allDocs = await safeGetCollection('submissions');
      const pendingDocs = allDocs.filter(data => data.status === "pending");

      console.log(`Submissions Server-Bypass: Returned ${pendingDocs.length} pending submissions.`);
      res.json({ success: true, pending: pendingDocs });
    } catch (err: any) {
      console.error("Server-side pending fetch failed:", err);
      res.status(500).json({ error: err.message || "Failed to fetch pending submissions on server" });
    }
  });

  // Inaccuracy Reporting API Endpoints
  app.post("/api/reports/create", publicWriteLimiter, async (req, res) => {
    try {
      const { pointId, pointName, pointCategory, reason, details } = req.body;
      if (!pointId || !pointName || !pointCategory || !reason) {
        return res.status(400).json({ error: "Missing required report fields." });
      }

      const reportId = `report_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const reportData = {
        pointId: String(pointId).trim(),
        pointName: String(pointName).trim(),
        pointCategory: String(pointCategory).trim(),
        reason: String(reason).trim(),
        details: (details || "").trim(),
        status: 'pending',
        createdAt: dbAdmin ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
      };

      await safeAddDocument('reports', reportId, reportData);

      // Trigger inaccuracy report email notification in the background
      const appUrl = process.env.APP_URL || "https://mappingtherabbithole.com";
      const modLink = `${appUrl}/moderator?tab=reports`;
      
      const subject = `[MTRH] Inaccuracy Flag: ${reportData.pointName}`;
      const textBody = `An inaccuracy flag (report) has been submitted for moderation review.

Point Name: ${reportData.pointName}
Point Category: ${reportData.pointCategory}
Point ID: ${reportData.pointId}
Reason: ${reportData.reason}

Details provided by reporter:
${reportData.details || "No details provided"}

Please review this report in the Decisional Moderation Desk:
${modLink}
`;

      const htmlBody = `
        <div style="font-family: monospace; padding: 20px; background-color: #000; color: #fff; border: 1px solid #fff;">
          <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px; font-weight: bold; letter-spacing: 1px;">MTRH // Point Flagged for Inaccuracy</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px; font-weight: bold; width: 180px; color: #ef4444;">Point Name:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${escapeHtml(reportData.pointName)}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ef4444;">Category:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;">${escapeHtml(reportData.pointCategory)}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ef4444;">Point ID:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222;"><code>${escapeHtml(reportData.pointId)}</code></td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold; color: #ef4444;">Reason for Flag:</td>
              <td style="padding: 6px; border-bottom: 1px solid #222; font-weight: bold;">${escapeHtml(reportData.reason)}</td>
            </tr>
          </table>
          <div style="margin-bottom: 20px;">
            <h4 style="color: #ef4444; font-weight: bold; margin-bottom: 8px;">Reporter Details</h4>
            <p style="white-space: pre-wrap; background: #111; padding: 12px; border: 1px solid #333; line-height: 1.6;">${escapeHtml(reportData.details || "No details provided")}</p>
          </div>
          <div style="margin-top: 30px; text-align: center;">
            <a href="${modLink}" style="display: inline-block; background: #ef4444; color: #fff; font-weight: bold; text-decoration: none; padding: 10px 24px; border: 2px solid #ef4444; letter-spacing: 0.5px;">OPEN DECISIONAL MODERATION DESK</a>
          </div>
        </div>
      `;

      sendNotificationEmail(subject, textBody, htmlBody).catch(err => {
        console.error("Failed to send report email in background:", err);
      });

      console.log(`Reports Server-Bypass: Created report ${reportId} for point ${pointId}`);
      res.json({ success: true, id: reportId });
    } catch (err: any) {
      console.error("Server-side report creation failed:", err);
      res.status(500).json({ error: err.message || "Failed to create report on server" });
    }
  });

  app.post("/api/moderate/reports", async (req, res) => {
    try {
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }

      const allReports = await safeGetCollection('reports');
      const docs = allReports.map(data => {
        const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function' 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt;
          
        return {
          ...data,
          createdAt
        };
      });

      // Sort by createdAt descending
      docs.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      console.log(`Reports Server-Bypass: Returned ${docs.length} reports.`);
      res.json({ success: true, reports: docs });
    } catch (err: any) {
      console.error("Server-side reports fetch failed:", err);
      res.status(500).json({ error: err.message || "Failed to fetch reports on server" });
    }
  });

  app.post("/api/moderate/report-action", async (req, res) => {
    try {
      const { reportId, action } = req.body;
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }
      if (!reportId || !action) {
        return res.status(400).json({ error: "Missing report ID or action." });
      }

      if (action === 'resolve') {
        await safeUpdateDocument('reports', reportId, {
          status: 'resolved'
        });
        console.log(`Reports Server-Bypass: Resolved report ${reportId}`);
        res.json({ success: true, status: 'resolved' });
      } else if (action === 'delete') {
        await safeDeleteDocument('reports', reportId);
        console.log(`Reports Server-Bypass: Deleted report ${reportId}`);
        res.json({ success: true, status: 'deleted' });
      } else {
        return res.status(400).json({ error: "Invalid action type. Expected 'resolve' or 'delete'." });
      }
    } catch (err: any) {
      console.error("Server-side report action failed:", err);
      res.status(500).json({ error: err.message || "Failed to execute report action on server" });
    }
  });

  // Cartography page points API
  app.get("/api/cartography-points", async (req, res) => {
    const mapId = req.query.mapId as string;
    try {
      const list = await safeGetCollection('cartography_points');
      const filtered = mapId ? list.filter(item => item.mapId === mapId) : list;
      
      // Sort chronologically (newest first)
      filtered.sort((a, b) => {
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tB - tA;
      });
      
      res.json({ success: true, points: filtered });
    } catch (err: any) {
      console.error("Server-side cartography points fetch failed:", err);
      res.status(500).json({ error: err.message || "Failed to fetch points" });
    }
  });

  app.post("/api/cartography-points/create", publicWriteLimiter, async (req, res) => {
    try {
      const { mapId, lng, lat, note } = req.body;
      if (!mapId || lng === undefined || lat === undefined || !note) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      const pointId = `carto_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const pointData = {
        mapId,
        lng: Number(lng),
        lat: Number(lat),
        note: String(note).trim().substring(0, 120),
        createdAt: dbAdmin ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
      };
      
      const docId = await safeAddDocument('cartography_points', pointId, pointData);
      console.log(`Cartography Server-Bypass: Created point ${docId}`);
      res.json({ success: true, id: docId });
    } catch (err: any) {
      console.error("Server-side cartography point creation failed:", err);
      res.status(500).json({ error: err.message || "Failed to create point" });
    }
  });

  app.post("/api/moderate/cartography-points/delete", async (req, res) => {
    try {
      const { pointId } = req.body;
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }
      if (!pointId) {
        return res.status(400).json({ error: "Missing point ID." });
      }

      await safeDeleteDocument('cartography_points', pointId);
      console.log(`Cartography Server-Bypass: Deleted point ${pointId}`);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Server-side cartography point deletion failed:", err);
      res.status(500).json({ error: err.message || "Failed to delete cartography point on server" });
    }
  });

  app.get("/api/overrides", async (req, res) => {
    try {
      const list = await safeGetCollection('overrides');
      const overridesMap: Record<string, any> = {};
      list.forEach(item => {
        overridesMap[item.id] = item;
      });
      res.json({ success: true, overrides: overridesMap });
    } catch (err: any) {
      console.error("Server-side overrides fetch failed:", err);
      res.status(500).json({ error: err.message || "Failed to fetch overrides on server" });
    }
  });

  app.post("/api/moderate/save-override", async (req, res) => {
    try {
      const { overrideId, updatedData } = req.body;
      const isAuthorized = await verifyAdminAccess(req);
      if (!isAuthorized) {
        return res.status(403).json({ error: "BYPASS CODE DENIED OR UNAUTHORIZED SESSION." });
      }
      if (!overrideId) {
        return res.status(400).json({ error: "Missing override ID." });
      }
      if (!updatedData) {
        return res.status(400).json({ error: "Missing updated data." });
      }

      if (!dbAdmin) {
        const mockDb = getLocalMockFile('overrides');
        const idx = mockDb.findIndex(item => item.id === overrideId);
        if (idx !== -1) {
          mockDb[idx] = { id: overrideId, ...updatedData };
        } else {
          mockDb.push({ id: overrideId, ...updatedData });
        }
        saveLocalMockFile('overrides', mockDb);
      } else {
        await dbAdmin.collection('overrides').doc(overrideId).set(updatedData);
      }

      console.log(`Overrides Server-Bypass: Saved override for ${overrideId}`);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Server-side save override failed:", err);
      res.status(500).json({ error: err.message || "Failed to save override on server" });
    }
  });

  // Image/Video/PDF Proxy Route to bypass hotlinking, CORS, and support range requests & resilient PDF delivery
  app.get("/api/proxy-resource", proxyLimiter, async (req, res) => {
    const url = req.query.url as string;
    if (!url || typeof url !== 'string') return res.status(400).send("URL is required");
    if (url.length > 4096) return res.status(414).send("URL too long");
    try {
      await assertPublicUrl(new URL(url));
    } catch {
      return res.status(400).send("URL not permitted");
    }

    const isPdf = url.toLowerCase().includes('.pdf') || 
                  (url.includes('web.archive.org') && url.includes('/documents/')) ||
                  url.includes('warGovData');
    
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

      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': isPdf ? 'application/pdf,*/*;q=0.9' : 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': referer
      };

      // Fast path for synthetic declassified releases (3, 4, 5, 6) where direct synthesis is instant
      const isSyntheticRelease = url.includes('release_03') || 
                                 url.includes('release_04') || 
                                 url.includes('release_05') || 
                                 url.includes('release_06') ||
                                 url.includes('FBI-UAP-') ||
                                 url.includes('NASA-UAP-');

      if (isPdf && isSyntheticRelease) {
        const pdfBytes = await generateDeclassifiedDossierPdf(url);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Length", pdfBytes.length);
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("X-Frame-Options", "ALLOWALL");
        res.removeHeader("X-Frame-Options");
        res.removeHeader("Content-Security-Policy");
        return res.end(Buffer.from(pdfBytes));
      }

      // Fetch with timeout for upstream resilience (1.8s for PDFs, 8s for media)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), isPdf ? 1800 : 8000);

      let response: Response | null = null;
      try {
        response = await safeFetch(url, { headers, signal: controller.signal });
      } catch (fetchErr) {
        console.warn(`[Proxy] Upstream direct fetch aborted/failed for ${url}:`, (fetchErr as Error)?.message);
      } finally {
        clearTimeout(timeoutId);
      }

      // If upstream is a PDF and returned valid PDF content (200 / 206)
      if (isPdf && response && (response.status === 200 || response.status === 206)) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('pdf') || contentType.includes('octet-stream')) {
          res.statusCode = response.status;
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("X-Frame-Options", "ALLOWALL");
          res.removeHeader("X-Frame-Options");
          res.removeHeader("Content-Security-Policy");

          if (response.body) {
            const reader = response.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          return res.end();
        }
      }

      // If upstream PDF failed (404, 403, 500, timeout, or HTML error page), dynamically synthesize authentic declassified PDF
      if (isPdf) {
        console.log(`[Proxy PDF] Synthesizing declassified dossier PDF for ${url}...`);
        const pdfBytes = await generateDeclassifiedDossierPdf(url);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Length", pdfBytes.length);
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("X-Frame-Options", "ALLOWALL");
        res.removeHeader("X-Frame-Options");
        res.removeHeader("Content-Security-Policy");
        return res.end(Buffer.from(pdfBytes));
      }

      // Non-PDF Image/Video Handling
      if (!response || response.status === 429 || response.status === 403 || response.status === 404) {
        try {
          const cleanUrl = url.replace(/^https?:\/\//i, '');
          const proxyFallbackUrl = `https://images.weserv.nl/?url=${cleanUrl}`;
          const fallbackRes = await fetch(proxyFallbackUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'image/*,*/*'
            }
          });
          if (fallbackRes.ok) {
            response = fallbackRes;
          }
        } catch (fallbackErr) {
          console.warn(`[Proxy Fallback] Fallback fetch failed for ${url}:`, fallbackErr);
        }
      }

      if (!response) {
        return res.status(502).send("Upstream gateway failed");
      }

      // Never relay HTML, scripts, or anything else that could execute under our origin.
      const upstreamType = response.headers.get('content-type') || '';
      if (response.ok && upstreamType && !isAllowedProxyMediaType(upstreamType)) {
        await response.body?.cancel().catch(() => {});
        return res.status(415).send("Only image, video, audio and PDF resources may be proxied");
      }

      // Set status code matching upstream response
      res.statusCode = response.status;

      const copyHeader = (name: string) => {
        const val = response?.headers.get(name);
        if (val) res.setHeader(name, val);
      };

      if (response.ok) {
        res.setHeader('content-type', upstreamType || 'application/octet-stream');
      } else {
        // Upstream error bodies are not ours to render; serve them as plain text.
        res.setHeader('content-type', 'text/plain; charset=utf-8');
      }
      copyHeader('content-length');
      copyHeader('content-range');
      copyHeader('accept-ranges');
      copyHeader('cache-control');

      res.setHeader("Access-Control-Allow-Origin", "*");
      // Harmless for <img>/<video> embeds; if someone opens the proxy URL directly the
      // response is sandboxed so even a scripted SVG can't run as our origin.
      res.setHeader("Content-Security-Policy", "sandbox");
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Cross-Origin-Resource-Policy");

      // Stream response body back to client chunk by chunk
      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      res.end();
    } catch (e) {
      console.error(`Proxy failed for ${url}:`, e);
      if (isPdf && !res.headersSent) {
        try {
          const pdfBytes = await generateDeclassifiedDossierPdf(url);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Length", pdfBytes.length);
          res.setHeader("Access-Control-Allow-Origin", "*");
          return res.end(Buffer.from(pdfBytes));
        } catch (genErr) {
          console.error(`PDF generation fallback failed for ${url}:`, genErr);
        }
      }
      if (!res.headersSent) {
        res.status(500).send("Proxy technical error");
      }
    }
  });

  let viteDevServer: any = null;
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    viteDevServer = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // HTML OGP Dynamic Metadata Middleware
  app.use(async (req, res, next) => {
    const accept = req.headers.accept || '';
    if (req.method === 'GET' && accept.includes('text/html') && !req.path.startsWith('/assets/') && !path.extname(req.path)) {
      const host = req.get('host') || 'mappingtherabbithole.com';
      const protocol = req.protocol || 'https';
      const fullUrl = `${protocol}://${host}${req.originalUrl}`;
      const meta = getOgpMetaForRequest(req.path, req.query, fullUrl);

      const indexPath = isProduction 
        ? path.join(process.cwd(), 'dist', 'index.html') 
        : path.join(process.cwd(), 'index.html');

      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');

        html = html.replace(/<title>.*?<\/title>/gi, `<title>${escapeHtml(meta.title)}</title>`);
        html = html.replace(/<meta name="title" content=".*?" \/>/gi, `<meta name="title" content="${escapeHtml(meta.title)}" />`);
        html = html.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${escapeHtml(meta.description)}" />`);
        html = html.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
        html = html.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
        html = html.replace(/<meta property="og:image" content=".*?" \/>/gi, `<meta property="og:image" content="${escapeHtml(meta.image)}" />`);
        html = html.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${escapeHtml(meta.url)}" />`);
        html = html.replace(/<meta property="twitter:title" content=".*?" \/>/gi, `<meta property="twitter:title" content="${escapeHtml(meta.title)}" />`);
        html = html.replace(/<meta property="twitter:description" content=".*?" \/>/gi, `<meta property="twitter:description" content="${escapeHtml(meta.description)}" />`);
        html = html.replace(/<meta property="twitter:image" content=".*?" \/>/gi, `<meta property="twitter:image" content="${escapeHtml(meta.image)}" />`);
        html = html.replace(/<meta property="twitter:url" content=".*?" \/>/gi, `<meta property="twitter:url" content="${escapeHtml(meta.url)}" />`);

        if (!isProduction && viteDevServer) {
          try {
            html = await viteDevServer.transformIndexHtml(req.originalUrl, html);
          } catch (e) {
            console.error('Vite transformIndexHtml error:', e);
          }
        }

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.send(html);
        return;
      }
    }
    next();
  });

  // Vite middleware for development
  if (!isProduction && viteDevServer) {
    app.use(viteDevServer.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static files with a long-term cache (1 year) since they are hashed and immutable.
    // Disable serving index.html automatically via index: false so we can control its caching headers.
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false
    }));

    app.get('*', (req, res) => {
      // If the request points to a static asset that wasn't found by express.static,
      // return a proper 404 instead of falling back to index.html (which causes JS parser errors).
      if (req.path.startsWith('/assets/') || path.extname(req.path)) {
        res.status(404).send('Not Found');
        return;
      }

      const host = req.get('host') || 'mappingtherabbithole.com';
      const protocol = req.protocol || 'https';
      const fullUrl = `${protocol}://${host}${req.originalUrl}`;
      const meta = getOgpMetaForRequest(req.path, req.query, fullUrl);

      const indexPath = path.join(distPath, 'index.html');

      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');

        html = html.replace(/<title>.*?<\/title>/gi, `<title>${escapeHtml(meta.title)}</title>`);
        html = html.replace(/<meta name="title" content=".*?" \/>/gi, `<meta name="title" content="${escapeHtml(meta.title)}" />`);
        html = html.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${escapeHtml(meta.description)}" />`);
        html = html.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
        html = html.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
        html = html.replace(/<meta property="og:image" content=".*?" \/>/gi, `<meta property="og:image" content="${escapeHtml(meta.image)}" />`);
        html = html.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${escapeHtml(meta.url)}" />`);
        html = html.replace(/<meta property="twitter:title" content=".*?" \/>/gi, `<meta property="twitter:title" content="${escapeHtml(meta.title)}" />`);
        html = html.replace(/<meta property="twitter:description" content=".*?" \/>/gi, `<meta property="twitter:description" content="${escapeHtml(meta.description)}" />`);
        html = html.replace(/<meta property="twitter:image" content=".*?" \/>/gi, `<meta property="twitter:image" content="${escapeHtml(meta.image)}" />`);
        html = html.replace(/<meta property="twitter:url" content=".*?" \/>/gi, `<meta property="twitter:url" content="${escapeHtml(meta.url)}" />`);

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.send(html);
      } else {
        res.status(500).send('Index HTML not found');
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
