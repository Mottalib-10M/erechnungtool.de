import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parseInvoiceXml } from '../src/lib/engine/parse';
import { validateInvoice } from '../src/lib/engine/validate';
import { extractXmlFromPdf } from '../src/lib/engine/pdf';

const dir = 'tests/fixtures/kosit';
const files = readdirSync(dir).filter((f) => f.endsWith('.xml'));

describe('KoSIT-Testsuite : jede gültige XRechnung wird gelesen und ohne Fehler vorgeprüft', () => {
  it('es gibt UBL- und CII-Dateien', () => {
    expect(files.filter((f) => f.endsWith('_ubl.xml')).length).toBeGreaterThan(20);
    expect(files.filter((f) => f.endsWith('_uncefact.xml')).length).toBeGreaterThan(20);
  });
  for (const f of files) {
    it(f, () => {
      const r = parseInvoiceXml(readFileSync(`${dir}/${f}`, 'utf8'));
      expect(r.ok).toBe(true);
      expect(r.detected.standard).toBe('XRechnung');
      expect(r.detected.syntax).toBe(f.endsWith('_ubl.xml') ? 'UBL' : 'CII');
      const inv = r.invoice!;
      expect(inv.number).toBeTruthy();
      expect(inv.lines.length).toBeGreaterThan(0);
      const rep = validateInvoice(inv);
      expect(rep.findings.filter((x) => x.level === 'error')).toEqual([]);
    });
  }
  it('UBL und CII derselben Rechnung ergeben dieselben Summen', () => {
    for (const f of files.filter((x) => x.endsWith('_ubl.xml'))) {
      const c = f.replace('_ubl.xml', '_uncefact.xml');
      if (!files.includes(c)) continue;
      const a = parseInvoiceXml(readFileSync(`${dir}/${f}`, 'utf8')).invoice!;
      const b = parseInvoiceXml(readFileSync(`${dir}/${c}`, 'utf8')).invoice!;
      expect(b.totals.payable, f).toBeCloseTo(a.totals.payable, 2);
      expect(b.lines.length, f).toBe(a.lines.length);
      expect(b.seller.name, f).toBe(a.seller.name);
    }
  });
});

describe('Fehler werden gefunden', () => {
  const base = readFileSync(`${dir}/01.01a-INVOICE_ubl.xml`, 'utf8');
  it('falsche Summe (BR-CO-15 / BR-CO-16)', () => {
    const r = validateInvoice(parseInvoiceXml(base.replace('<cbc:PayableAmount currencyID="EUR">336.9<', '<cbc:PayableAmount currencyID="EUR">346.9<')).invoice!);
    expect(r.findings.map((x) => x.rule)).toContain('BR-CO-16');
  });
  it('fehlende Käuferreferenz (BR-DE-15)', () => {
    const r = validateInvoice(parseInvoiceXml(base.replace(/<cbc:BuyerReference>.*?<\/cbc:BuyerReference>/, '')).invoice!);
    expect(r.findings.map((x) => x.rule)).toContain('BR-DE-15');
  });
  it('falsche Leitweg-Prüfziffer', () => {
    const r = validateInvoice(parseInvoiceXml(base.replace('04011000-12345-03', '04011000-12345-04')).invoice!);
    expect(r.findings.map((x) => x.rule)).toContain('LEITWEG');
  });
  it('kaputtes XML und fremde Wurzel', () => {
    expect(parseInvoiceXml('<a><b></a>').error).toBe('xml');
    expect(parseInvoiceXml('<Order/>').error).toBe('unbekannt');
    expect(parseInvoiceXml('').error).toBe('leer');
  });
});

describe('ZUGFeRD-PDF aus dem FeRD-Beispielsatz', () => {
  it('die eingebettete XML wird gefunden, gelesen und vorgeprüft', async () => {
    const r = await extractXmlFromPdf(new Uint8Array(readFileSync('tests/fixtures/mustang/EN16931_Einfach.pdf')));
    expect(r.pdf).toBe(true);
    expect(r.name).toMatch(/\.xml$/i);
    const p = parseInvoiceXml(r.xml!);
    expect(p.ok).toBe(true);
    expect(p.detected.syntax).toBe('CII');
    expect(p.detected.profile).toBe('EN 16931');
    expect(p.detected.erechnung).toBe(true);
    expect(validateInvoice(p.invoice!).errors).toBe(0);
  });
  it('eine reine Text-Datei ist keine PDF', async () => {
    expect((await extractXmlFromPdf(new TextEncoder().encode('hallo'))).pdf).toBe(false);
  });
});
