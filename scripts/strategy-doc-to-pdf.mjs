// One-shot converter: LAMORINDA-PAVERS-CONTENT-STRATEGY-*.md -> PDF
// Uses marked (already a project dep) for MD->HTML, then headless Chrome to print.

import { marked } from "marked";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const SRC = resolve(REPO_ROOT, "LAMORINDA-PAVERS-CONTENT-STRATEGY-MAY-OCT-2026.md");
const TMP_HTML = resolve(REPO_ROOT, ".strategy-doc-tmp.html");
const OUT_PDF = resolve(REPO_ROOT, "LAMORINDA-PAVERS-CONTENT-STRATEGY-MAY-OCT-2026.pdf");

const md = readFileSync(SRC, "utf8");
const body = marked.parse(md, { gfm: true, async: false });

// Print-ready stylesheet — Lamorinda brand palette from CLAUDE.md.
// Designed for letter-size paper with comfortable margins, serif headings,
// sans-serif body. Tables and pull-out callouts styled for clarity in print.
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Lamorinda Pavers — 2026 Content Strategy</title>
<style>
  @page {
    size: letter;
    margin: 0.75in 0.85in 0.9in 0.85in;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    color: #1a1a1a;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .doc { max-width: 100%; }
  h1, h2, h3 {
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    color: #1a1a1a;
    margin-top: 1.4em;
    margin-bottom: 0.5em;
    page-break-after: avoid;
  }
  h1 {
    font-size: 26pt;
    line-height: 1.15;
    margin-top: 0;
    margin-bottom: 0.05em;
    letter-spacing: -0.5px;
  }
  h2 {
    font-size: 17pt;
    line-height: 1.2;
    margin-top: 1.6em;
    padding-top: 0.6em;
    border-top: 2px solid #e8a83e;
    padding-bottom: 0.1em;
  }
  h3 {
    font-size: 12.5pt;
    line-height: 1.25;
    margin-top: 1.3em;
    color: #1a1a1a;
  }
  p { margin: 0 0 0.7em; }
  strong { color: #1a1a1a; font-weight: 600; }
  em { color: #1a1a1a; font-style: italic; }
  ul, ol { margin: 0 0 0.9em 0; padding-left: 1.4em; }
  li { margin-bottom: 0.25em; }
  a { color: #3b7dd8; text-decoration: none; }
  hr {
    border: none;
    border-top: 1px solid #d4d4d8;
    margin: 1.6em 0 0.6em;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.8em 0 1.2em;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  th {
    background: #f5f0eb;
    color: #1a1a1a;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #d4d4d8;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
  td {
    padding: 7px 10px;
    border: 1px solid #e5e5e5;
    vertical-align: top;
  }
  blockquote {
    border-left: 3px solid #e8a83e;
    padding: 0.2em 1em;
    margin: 0.8em 0;
    color: #444;
    font-style: italic;
  }
  code {
    background: #f5f0eb;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 9.5pt;
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  }
  /* The first H2 after the cover header (just below the H1 metadata block) */
  h2:first-of-type {
    margin-top: 1.3em;
  }
  /* Cover meta block (the bold lines under the H1 + before the first HR) */
  .doc > p:nth-of-type(-n+3) strong {
    display: inline-block;
    color: #666;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-size: 9pt;
  }
  /* Cluster table specifically — slightly tighter */
  table:first-of-type th, table:first-of-type td { padding: 6px 9px; }
  /* Article-listing dates rendered as bold paragraphs — give them air */
  p strong:first-child {
    color: #1a1a1a;
  }
  /* Footer paragraph (the contact line at the very bottom) */
  .doc > p:last-of-type {
    text-align: center;
    color: #777;
    font-size: 9.5pt;
    margin-top: 1.5em;
    font-style: normal;
  }
  /* Avoid orphaned headings */
  h2 + p, h3 + p { page-break-before: avoid; }
  /* Gold accent bar at the very top of the document */
  body::before {
    content: "";
    display: block;
    height: 4px;
    background: linear-gradient(to right, #3b7dd8 0%, #c94141 33%, #e8a83e 100%);
    margin-bottom: 1.2em;
  }
</style>
</head>
<body>
<div class="doc">
${body}
</div>
</body>
</html>`;

writeFileSync(TMP_HTML, html);

console.log("Rendering PDF via headless Chrome...");

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const cmd = `"${chromePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${OUT_PDF}" "file://${TMP_HTML}"`;

execSync(cmd, { stdio: "inherit" });

try { unlinkSync(TMP_HTML); } catch { /* leave it if cleanup fails */ }

console.log(`PDF written: ${OUT_PDF}`);
