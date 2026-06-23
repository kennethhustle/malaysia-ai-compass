/**
 * pdf-generator.tsx
 *
 * Always uses puppeteer-core (never the full puppeteer package).
 * Browser resolution:
 *   - Local dev: finds system Chrome (Mac/Linux paths below)
 *   - Vercel / no system Chrome: falls back to @sparticuz/chromium
 *
 * The browser is exported separately so the submit route can launch it
 * in parallel with the Claude API call, saving ~15-25s.
 */
import { existsSync } from 'fs';
import { ReportData } from '@/types/survey';

/* ─── System Chrome candidates ───────────────────────────────────────────── */
const SYSTEM_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

function findChrome(): string | undefined {
  for (const p of SYSTEM_CHROME_PATHS) {
    if (existsSync(p)) return p;
  }
  return undefined;
}

/* ─── Print CSS ──────────────────────────────────────────────────────────── */
const PRINT_CSS = `
  *, *::before, *::after {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body {
    margin: 0; padding: 0; background: #ffffff;
    font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Arial, sans-serif;
  }
  @page { size: A4; margin: 0; }
  .a4-cover {
    width: 210mm; height: 297mm; overflow: hidden;
    page-break-after: always; break-after: page;
  }
  .a4-section {
    width: 210mm; min-height: 297mm;
    page-break-after: always; break-after: page; position: relative;
  }
  .a4-page-break { page-break-before: always; break-before: page; }
  .a4-avoid-break { page-break-inside: avoid; break-inside: avoid; }
  .no-print { display: none !important; }
  .a4-section:last-child { page-break-after: auto; break-after: auto; }
`;

function buildHtmlDocument(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; }
    ${PRINT_CSS}
  </style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

/* ─── Browser launcher ───────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function launchBrowser(): Promise<any> {
  const puppeteerCore = (await import('puppeteer-core')).default;
  const systemChrome = findChrome();

  if (systemChrome) {
    // Local dev — use the Mac/Linux system Chrome
    console.log(`[PDF] Using system Chrome: ${systemChrome}`);
    return puppeteerCore.launch({
      headless: true,
      executablePath: systemChrome,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
  }

  // Serverless (Vercel) — connect to Browserless hosted Chrome
  // @sparticuz/chromium requires libnss3 as a system lib which Vercel Lambda doesn't ship.
  // Browserless avoids this entirely by running Chrome externally.
  // Serverless (Vercel) — connect to Browserless hosted Chrome
  const token = process.env.BLESS_TOKEN;
  if (!token) {
    throw new Error('[PDF] BLESS_TOKEN env var is not set. Add it in Vercel → Settings → Environment Variables.');
  }

  const wsEndpoint = `wss://chrome.browserless.io?token=${token}&timeout=60000`;
  console.log('[PDF] Connecting to Browserless...');

  const browser = await Promise.race([
    puppeteerCore.connect({ browserWSEndpoint: wsEndpoint }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('[PDF] Browserless connection timed out after 30s')), 30_000)
    ),
  ]);

  console.log('[PDF] Connected to Browserless successfully');
  return browser;
}

/* ─── PDF renderer ───────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function renderPDF(data: ReportData, browser: any): Promise<Buffer> {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { default: A4Report } = await import('@/components/A4Report');

  const bodyHtml = renderToStaticMarkup(React.createElement(A4Report, { data }));
  // If any image fails to load (e.g. CDN down), hide it rather than block PDF generation
  const bodyHtmlSafe = bodyHtml.replace(/<img /g, '<img onerror="this.style.display=\'none\'" ');
  const fullHtml = buildHtmlDocument(bodyHtmlSafe);

  console.log('[PDF] Opening new page...');
  const page = await browser.newPage();
  try {
    console.log('[PDF] Setting viewport...');
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    console.log('[PDF] Setting content...');
    await page.setContent(fullHtml, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('[PDF] Waiting for fonts and network idle...');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 10000 }).catch(() => {
      // Non-fatal — proceed even if some resources didn't load
      console.log('[PDF] Network idle timeout — proceeding anyway');
    });
    await new Promise<void>(r => setTimeout(r, 300));
    console.log('[PDF] Generating PDF buffer...');
    const pdfBuffer = await Promise.race([
      page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        displayHeaderFooter: false,
        timeout: 60000,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('[PDF] page.pdf() timed out after 60s')), 60_000)
      ),
    ]);
    console.log('[PDF] PDF buffer generated successfully');
    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

/* ─── Convenience wrapper ────────────────────────────────────────────────── */
export async function generatePDF(data: ReportData): Promise<Buffer> {
  const browser = await launchBrowser();
  try {
    return await renderPDF(data, browser);
  } finally {
    await browser.close();
  }
}
