/**
 * Hilfen der Datei-Werkzeuge im Browser : Datei lesen, herunterladen, drucken, PDF-Bausteine laden.
 * Nichts davon spricht mit einem Server ; die Schriften und das Farbprofil kommen von dieser Seite selbst.
 */
import type { Invoice } from './engine/invoice';
import type { ParseResult } from './engine/parse';
import type { PdfXml } from './engine/pdf';
import { parseInvoiceXml } from './engine/parse';

export function download(data: BlobPart, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export const safeName = (s: string | undefined, fallback: string) => (s || fallback).replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || fallback;

/** Druckt einen Knoten in einem unsichtbaren Rahmen, mit den Stilen der Seite : Druck oder « Als PDF speichern ». */
export function printNode(node: HTMLElement, title: string) {
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true');
  Object.assign(f.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.appendChild(f);
  const d = f.contentDocument!;
  const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')].map((x) => x.outerHTML).join('');
  d.open();
  d.write(`<!doctype html><html lang="${document.documentElement.lang}"><head><meta charset="utf-8"><title>${title.replace(/</g, '')}</title>${styles}<style>@page{size:A4;margin:14mm}body{background:#fff;padding:0;margin:0}</style></head><body>${node.outerHTML}</body></html>`);
  d.close();
  const go = () => { f.contentWindow?.focus(); f.contentWindow?.print(); setTimeout(() => f.remove(), 1500); };
  if (d.readyState === 'complete') setTimeout(go, 300); else f.onload = () => setTimeout(go, 300);
}

let assets: Promise<{ regular: Uint8Array; bold: Uint8Array; icc: Uint8Array }> | null = null;
export function pdfAssets() {
  const get = (p: string) => fetch(p).then((r) => { if (!r.ok) throw new Error(p); return r.arrayBuffer(); }).then((b) => new Uint8Array(b));
  assets ??= Promise.all([get('/fonts/pdf/DejaVuSans.ttf'), get('/fonts/pdf/DejaVuSans-Bold.ttf'), get('/fonts/pdf/sRGB.icc')]).then(([regular, bold, icc]) => ({ regular, bold, icc }));
  return assets;
}

export interface Opened { name: string; kind: 'xml' | 'pdf' | 'other'; parse?: ParseResult; pdf?: PdfXml; xml?: string; size: number }
/** Liest eine Datei des Besuchers : XML direkt, PDF über pdf-lib (erst bei Bedarf geladen). */
export async function openFile(file: File): Promise<Opened> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const head = new TextDecoder().decode(bytes.slice(0, 1024));
  if (head.includes('%PDF')) {
    const { extractXmlFromPdf } = await import('./engine/pdf');
    const pdf = await extractXmlFromPdf(bytes);
    return { name: file.name, kind: 'pdf', pdf, xml: pdf.xml, parse: pdf.xml ? parseInvoiceXml(pdf.xml) : undefined, size: bytes.length };
  }
  const text = new TextDecoder('utf-8').decode(bytes);
  if (/^\s*(﻿)?\s*</.test(text)) return { name: file.name, kind: 'xml', xml: text, parse: parseInvoiceXml(text), size: bytes.length };
  return { name: file.name, kind: 'other', size: bytes.length };
}
export type { Invoice };
