/** Ersteller : jede Kombination aus Empfänger und Steuerfall ergibt mit den Startwerten eine fehlerfreie Rechnung. */
import { describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { buildInvoice, fromSample } from '../src/components/erech/Creator';
import { validateInvoice } from '../src/lib/engine/validate';
import { toUBL, toCII } from '../src/lib/engine/build';
import { parseInvoiceXml } from '../src/lib/engine/parse';
import P from '../src/data/params-2026.json';

const OUT = process.env.PRUEF_OUT;
describe('Ersteller', () => {
  for (const lang of ['de', 'en'] as const) for (const empf of ['firma', 'behoerde'] as const) for (const steuer of ['regel', 'klein', 'rc'] as const) {
    it(`${lang} ${empf} ${steuer}`, () => {
      const { form, pos } = fromSample(lang);
      const inv = buildInvoice(form, pos, empf, steuer, lang);
      const xr = empf === 'behoerde' || steuer !== 'klein';
      const r = validateInvoice({ ...inv, customizationId: xr ? P.standards.xrCustomization : P.standards.en16931Id }, { xrechnung: xr, bund: empf === 'behoerde' });
      expect(r.findings.filter((f) => f.level === 'error')).toEqual([]);
      const ubl = toUBL(inv);
      const back = parseInvoiceXml(ubl);
      expect(back.ok).toBe(true);
      expect(back.invoice!.totals.payable).toBeCloseTo(inv.totals.payable, 2);
      if (OUT && lang === 'de') { writeFileSync(`${OUT}/creator_${empf}_${steuer}_ubl.xml`, ubl); writeFileSync(`${OUT}/creator_${empf}_${steuer}_XRECHNUNG_cii.xml`, toCII(inv, 'XRECHNUNG')); }
    });
  }
  it('leere Felder werden als Fehler gemeldet', () => {
    const { pos } = fromSample('de');
    const inv = buildInvoice({ sName: '', sStreet: '', sZip: '', sCity: '', sVat: '', sTax: '', sMail: '', sPhone: '', sContact: '', iban: '', bic: '', bName: '', bStreet: '', bZip: '', bCity: '', bVat: '', bMail: '', leitweg: '', order: '', number: '', date: '', delivery: '', due: '', terms: '' }, pos, 'firma', 'regel', 'de');
    const r = validateInvoice({ ...inv, customizationId: P.standards.xrCustomization }, { xrechnung: true });
    expect(r.errors).toBeGreaterThan(5);
  });
});
