import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export interface WarGovRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  date?: string | number;
  coordinates?: [number, number];
  source?: string;
  images?: string[];
  type?: string;
}

// In-memory dataset cache
let recordsMap: Map<string, WarGovRecord> | null = null;

function loadAllRecords(): Map<string, WarGovRecord> {
  if (recordsMap) return recordsMap;

  const map = new Map<string, WarGovRecord>();
  const datasetFiles = [
    'warGovData.json',
    'warGovData-2.json',
    'warGovData-3.json',
    'warGovData-4.json',
    'warGovData-5.json',
    'warGovData-6.json'
  ];

  for (const filename of datasetFiles) {
    const fullPath = path.resolve(process.cwd(), 'src', filename);
    if (fs.existsSync(fullPath)) {
      try {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const items: WarGovRecord[] = JSON.parse(raw);
        for (const item of items) {
          if (item.id) map.set(item.id.toLowerCase(), item);
          if (item.name) map.set(item.name.toLowerCase(), item);
          if (Array.isArray(item.images)) {
            for (const img of item.images) {
              const basename = path.basename(img).toLowerCase();
              map.set(basename, item);
              const noExt = basename.replace(/\.[a-z0-9]+$/i, '');
              map.set(noExt, item);
              map.set(img.toLowerCase(), item);
            }
          }
        }
      } catch (err) {
        console.error(`[PDF Gen] Error reading ${filename}:`, err);
      }
    }
  }

  recordsMap = map;
  return map;
}

export function findRecordForUrl(urlOrId: string): WarGovRecord | null {
  const map = loadAllRecords();
  const rawKey = urlOrId.toLowerCase().trim();
  if (map.has(rawKey)) return map.get(rawKey)!;

  // Try extracting filename
  try {
    const parsed = new URL(urlOrId.startsWith('http') ? urlOrId : `http://dummy.com/${urlOrId}`);
    const pathname = parsed.pathname;
    const basename = path.basename(pathname).toLowerCase();
    if (map.has(basename)) return map.get(basename)!;
    const noExt = basename.replace(/\.[a-z0-9]+$/i, '');
    if (map.has(noExt)) return map.get(noExt)!;
  } catch {
    const basename = path.basename(rawKey);
    if (map.has(basename)) return map.get(basename)!;
    const noExt = basename.replace(/\.[a-z0-9]+$/i, '');
    if (map.has(noExt)) return map.get(noExt)!;
  }

  // Substring fuzzy match
  for (const [key, rec] of map.entries()) {
    if (key.length > 5 && rawKey.includes(key)) {
      return rec;
    }
  }

  return null;
}

function sanitizePdfText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/[\u2013\u2014]/g, '-') // en-dash, em-dash
    .replace(/[\u2022\u00B7]/g, '*') // bullet, middle dot
    .replace(/[\u2713\u2714]/g, '[X]') // check marks
    .replace(/[\u00B0]/g, ' deg') // degree symbol
    .replace(/[^\x20-\x7E\n]/g, ' '); // remove any other non-ASCII printable chars
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const sanitized = sanitizePdfText(text);
  const lines: string[] = [];
  const paragraphs = sanitized.split(/\n+/);

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) continue;
    const words = paragraph.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    lines.push(''); // Paragraph spacing
  }

  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines;
}

export async function generateDeclassifiedDossierPdf(targetUrlOrId: string): Promise<Uint8Array> {
  const record = findRecordForUrl(targetUrlOrId);

  const docId = sanitizePdfText(record?.id || path.basename(targetUrlOrId).replace(/\.[a-z0-9]+$/i, '').toUpperCase() || 'DOW-UAP-GEN-01');
  const title = sanitizePdfText(record?.name || docId.replace(/[-_]/g, ' '));
  const category = sanitizePdfText(record?.category || 'War.gov UFO Files');
  const source = sanitizePdfText(record?.source || 'Department of War PURSUE Declassification Office');
  const dateStr = sanitizePdfText(record?.date ? String(record?.date) : '1947-2026 ARCHIVAL RECORD');
  const coordinatesStr = record?.coordinates 
    ? `${record.coordinates[1].toFixed(4)} N, ${record.coordinates[0].toFixed(4)} W` 
    : 'COORDINATES RESTRICTED // GLOBAL RECONNAISSANCE';
  const description = record?.description || 
    `Official archival record pertaining to document ${docId}. Declassified under Department of War PURSUE Directive for public historical study. All responsive materials have undergone automated integrity review and verification.`;

  const pdfDoc = await PDFDocument.create();
  
  // Embed fonts
  const fontCourierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontTimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const pageWidth = 612; // Standard Letter
  const pageHeight = 792;
  const margin = 36;
  const contentWidth = pageWidth - (margin * 2);

  // Wrap description lines (~76 characters per line for Courier size 8.8)
  const descLines = wrapText(description, 74);

  // Calculate pages needed (approx 30 lines per page on page 1, 45 on subsequent pages)
  const linesPage1 = 26;
  const linesOtherPages = 42;
  
  let totalPages = 1;
  if (descLines.length > linesPage1) {
    totalPages = 1 + Math.ceil((descLines.length - linesPage1) / linesOtherPages);
  }

  let lineOffset = 0;

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // 1. Top Red Security Banner
    page.drawRectangle({
      x: margin,
      y: pageHeight - margin - 20,
      width: contentWidth,
      height: 20,
      color: rgb(0.82, 0.15, 0.15),
    });
    page.drawText('TOP SECRET // NOFORN // DECLASSIFIED UNDER PURSUE DIRECTIVE', {
      x: margin + 14,
      y: pageHeight - margin - 15,
      size: 9,
      font: fontHelveticaBold,
      color: rgb(1, 1, 1),
    });
    page.drawText('REF: PURSUE-DOW-AUTH', {
      x: pageWidth - margin - 140,
      y: pageHeight - margin - 15,
      size: 8,
      font: fontHelveticaBold,
      color: rgb(1, 1, 1),
    });

    // 2. Outer Border Frame
    page.drawRectangle({
      x: margin,
      y: margin + 20,
      width: contentWidth,
      height: pageHeight - (margin * 2) - 40,
      borderColor: rgb(0.25, 0.25, 0.25),
      borderWidth: 1.2,
    });

    // Inner subtle border
    page.drawRectangle({
      x: margin + 3,
      y: margin + 23,
      width: contentWidth - 6,
      height: pageHeight - (margin * 2) - 46,
      borderColor: rgb(0.75, 0.75, 0.75),
      borderWidth: 0.5,
    });

    // 3. Watermark DECLASSIFIED Stamp across page center
    page.drawText('DECLASSIFIED', {
      x: 120,
      y: 360,
      size: 58,
      font: fontHelveticaBold,
      color: rgb(0.92, 0.92, 0.92),
      rotate: degrees(32),
    });

    let currentY = pageHeight - margin - 35;

    // 4. Header block (Only on Page 1)
    if (pageIdx === 0) {
      // Seal & Department Title
      page.drawText('UNITED STATES DEPARTMENT OF WAR', {
        x: margin + 14,
        y: currentY - 12,
        size: 13,
        font: fontTimesRomanBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      page.drawText('ALL-DOMAIN ANOMALY RESOLUTION & INTELLIGENCE ARCHIVE', {
        x: margin + 14,
        y: currentY - 25,
        size: 8.5,
        font: fontHelveticaBold,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Status pill on right
      page.drawRectangle({
        x: pageWidth - margin - 135,
        y: currentY - 26,
        width: 120,
        height: 18,
        color: rgb(0.12, 0.53, 0.35),
      });
      page.drawText('PUBLIC RELEASE: APPROVED', {
        x: pageWidth - margin - 130,
        y: currentY - 20,
        size: 7.5,
        font: fontHelveticaBold,
        color: rgb(1, 1, 1),
      });

      currentY -= 40;

      // Divider line
      page.drawLine({
        start: { x: margin + 10, y: currentY },
        end: { x: pageWidth - margin - 10, y: currentY },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
      });

      currentY -= 15;

      // Metadata Table Box
      page.drawRectangle({
        x: margin + 12,
        y: currentY - 80,
        width: contentWidth - 24,
        height: 80,
        color: rgb(0.96, 0.96, 0.97),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.8,
      });

      const metaY = currentY - 16;
      page.drawText('DOCUMENT IDENTIFIER:', { x: margin + 20, y: metaY, size: 8, font: fontCourierBold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText(docId, { x: margin + 150, y: metaY, size: 8.5, font: fontCourierBold, color: rgb(0.8, 0.1, 0.1) });

      page.drawText('CASE / FILE TITLE:', { x: margin + 20, y: metaY - 14, size: 8, font: fontCourierBold, color: rgb(0.2, 0.2, 0.2) });
      const truncatedTitle = title.length > 55 ? title.substring(0, 52) + '...' : title;
      page.drawText(truncatedTitle, { x: margin + 150, y: metaY - 14, size: 8.5, font: fontCourier, color: rgb(0.1, 0.1, 0.1) });

      page.drawText('ORIGINATING SOURCE:', { x: margin + 20, y: metaY - 28, size: 8, font: fontCourierBold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText(source, { x: margin + 150, y: metaY - 28, size: 8, font: fontCourier, color: rgb(0.1, 0.1, 0.1) });

      page.drawText('INCIDENT / FILE DATE:', { x: margin + 20, y: metaY - 42, size: 8, font: fontCourierBold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText(dateStr, { x: margin + 150, y: metaY - 42, size: 8, font: fontCourier, color: rgb(0.1, 0.1, 0.1) });

      page.drawText('GEO-COORDINATES:', { x: margin + 20, y: metaY - 56, size: 8, font: fontCourierBold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText(coordinatesStr, { x: margin + 150, y: metaY - 56, size: 8, font: fontCourier, color: rgb(0.1, 0.1, 0.1) });

      currentY -= 95;

      // Section Header: INTELLIGENCE SUMMARY & SIGHTING DETAILS
      page.drawRectangle({
        x: margin + 12,
        y: currentY - 14,
        width: contentWidth - 24,
        height: 16,
        color: rgb(0.2, 0.25, 0.3),
      });
      page.drawText('SECTION I -- DECLASSIFIED INTELLIGENCE DOSSIER & TRANSCRIPT', {
        x: margin + 18,
        y: currentY - 9,
        size: 8,
        font: fontHelveticaBold,
        color: rgb(1, 1, 1),
      });

      currentY -= 28;
    } else {
      // Header for continuation pages
      page.drawText(`UNITED STATES DEPARTMENT OF WAR // DOSSIER ${docId} (CONT.)`, {
        x: margin + 14,
        y: currentY - 10,
        size: 9,
        font: fontHelveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });
      currentY -= 25;
    }

    // Determine how many lines on this page
    const pageCapacity = pageIdx === 0 ? linesPage1 : linesOtherPages;
    const pageLines = descLines.slice(lineOffset, lineOffset + pageCapacity);
    lineOffset += pageLines.length;

    for (const line of pageLines) {
      if (line === '') {
        currentY -= 7;
      } else {
        page.drawText(line, {
          x: margin + 16,
          y: currentY,
          size: 8.8,
          font: fontCourier,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 12;
      }
    }

    // If last page and has space, draw authorization stamp block
    if (pageIdx === totalPages - 1 && currentY > margin + 70) {
      currentY -= 15;
      page.drawLine({
        start: { x: margin + 12, y: currentY },
        end: { x: pageWidth - margin - 12, y: currentY },
        thickness: 0.8,
        color: rgb(0.7, 0.7, 0.7),
      });
      currentY -= 14;

      page.drawText('AUTHENTICATION & ARCHIVAL RECORD DISPOSITION:', {
        x: margin + 16,
        y: currentY,
        size: 7.5,
        font: fontCourierBold,
        color: rgb(0.3, 0.3, 0.3),
      });
      currentY -= 12;

      page.drawText('[X] Digital Chain-of-Custody Verified * PURSUE Automated Ingestion Engine', {
        x: margin + 16,
        y: currentY,
        size: 7.5,
        font: fontCourier,
        color: rgb(0.2, 0.5, 0.3),
      });
      currentY -= 11;

      page.drawText(`[X] Classification Authority: Executive Order 13526 / AARO Public Release * Category: ${category}`, {
        x: margin + 16,
        y: currentY,
        size: 7.5,
        font: fontCourier,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    // 5. Bottom Red Security Footer
    page.drawRectangle({
      x: margin,
      y: margin,
      width: contentWidth,
      height: 20,
      color: rgb(0.82, 0.15, 0.15),
    });
    page.drawText('DECLASSIFIED HISTORICAL RECORD // MTRH INTERACTIVE ARCHIVE', {
      x: margin + 14,
      y: margin + 6,
      size: 8.5,
      font: fontHelveticaBold,
      color: rgb(1, 1, 1),
    });
    page.drawText(`PAGE ${pageIdx + 1} OF ${totalPages}`, {
      x: pageWidth - margin - 90,
      y: margin + 6,
      size: 8.5,
      font: fontHelveticaBold,
      color: rgb(1, 1, 1),
    });
  }

  return await pdfDoc.save();
}
