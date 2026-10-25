import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { beispiel, SZENARIEN } from '../src/lib/engine/beispiele';
import { toUBL, toCII } from '../src/lib/engine/build';
import { parseInvoiceXml } from '../src/lib/engine/parse';
import { validateInvoice } from '../src/lib/engine/validate';
import { makeZugferdPdf, extractXmlFromPdf } from '../src/lib/engine/pdf';

// PRUEF_OUT=<Ordner> : schreibt die erzeugten Dateien für den KoSIT-Validator und veraPDF (scripts/pruefe-erzeugte.sh).
const OUT = process.env.PRUEF_OUT;
if (OUT) mkdirSync(OUT, { recursive: true });
const assets = {
  regular: new Uint8Array(readFileSync('public/fonts/pdf/DejaVuSans.ttf')),
  bold: new Uint8Array(readFileSync('public/fonts/pdf/DejaVuSans-Bold.ttf')),
  icc: new Uint8Array(readFileSync('public/fonts/pdf/sRGB.icc')),
};

describe('Beispiele : Summen', () => {
  it('Standardrechnung mit 19 % und 7 %', () => {
    const inv = beispiel('standard');
    expect(inv.totals.lineNet).toBe(1119.06);
    expect(inv.vat.find((v) => v.rate === 19)!.amount).toBe(199.48);
    expect(inv.vat.find((v) => v.rate === 7)!.amount).toBe(4.84);
    expect(inv.totals.payable).toBe(1323.38);
  });
  it('Kleinunternehmer : keine Steuer, Befreiungsgrund', () => {
    const inv = beispiel('klein');
    expect(inv.totals.vatTotal).toBe(0);
    expect(inv.vat[0].exemptionReason).toMatch(/§ 19/);
  });
});

for (const s of SZENARIEN) {
  describe(`Szenario ${s}`, () => {
    const inv = beispiel(s);
    it('UBL (XRechnung) : wieder gelesen, gleich, ohne Fehler', () => {
      const xml = toUBL(inv);
      if (OUT) writeFileSync(`${OUT}/${s}_ubl.xml`, xml);
      const p = parseInvoiceXml(xml);
      expect(p.ok).toBe(true); expect(p.detected.standard).toBe('XRechnung');
      expect(p.invoice!.totals.payable).toBe(inv.totals.payable);
      expect(p.invoice!.lines.length).toBe(inv.lines.length);
      expect(validateInvoice(p.invoice!, { bund: s === 'bund' }).findings.filter((x) => x.level === 'error')).toEqual([]);
    });
    it('CII (ZUGFeRD EN 16931 und XRECHNUNG) : wieder gelesen, ohne Fehler', () => {
      for (const prof of ['EN16931', 'XRECHNUNG'] as const) {
        const xml = toCII(inv, prof);
        if (OUT) writeFileSync(`${OUT}/${s}_${prof}_cii.xml`, xml);
        const p = parseInvoiceXml(xml);
        expect(p.ok).toBe(true);
        expect(p.detected.profile).toBe(prof === 'EN16931' ? 'EN 16931' : 'XRECHNUNG');
        expect(p.invoice!.totals.payable).toBe(inv.totals.payable);
        expect(validateInvoice(p.invoice!).findings.filter((x) => x.level === 'error')).toEqual([]);
      }
    });
    it('ZUGFeRD-PDF : XML eingebettet und wieder auslesbar', async () => {
      const xml = toCII(inv, 'EN16931');
      const pdf = await makeZugferdPdf(inv, xml, 'EN16931', assets, 'de', new Date('2026-10-25T10:00:00Z'));
      if (OUT) writeFileSync(`${OUT}/${s}_zugferd.pdf`, pdf);
      const r = await extractXmlFromPdf(pdf);
      expect(r.name).toBe('factur-x.xml');
      expect(r.xml).toBe(xml);
      expect(r.pdfa).toBe('PDF/A-3b');
      expect(r.fxLevel).toBe('EN 16931');
      expect(pdf.length).toBeLessThan(400_000);
    });
  });
}
