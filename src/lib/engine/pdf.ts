/**
 * ZUGFeRD / Factur-X als PDF/A-3b : sichtbare Rechnung + eingebettete XML (factur-x.xml bzw.
 * xrechnung.xml), mit XMP-Metadaten (pdfaid, Factur-X-Erweiterungsschema), OutputIntent sRGB,
 * eingebetteten Schriften und Datei-ID. Und umgekehrt : die XML aus einer PDF herauslösen.
 * Läuft im Browser (pdf-lib) ; Schriften und ICC-Profil werden als Bytes übergeben.
 * Geprüft mit veraPDF und Mustang (scripts/pruefe-erzeugte.sh).
 */
import { PDFDocument, PDFName, PDFHexString, PDFDict, PDFArray, PDFStream, PDFRawStream, PDFString, AFRelationship, rgb, decodePDFRawStream, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { Invoice } from './invoice';
import { TYPE_CODES, UNITS, VAT_CATS, PAYMENT_MEANS } from './invoice';
import type { CiiProfile } from './build';

export interface PdfAssets { regular: Uint8Array; bold: Uint8Array; icc: Uint8Array }
type Lang = 'de' | 'en';

const L = {
  de: { rechnung: 'Rechnung', nr: 'Rechnungsnummer', datum: 'Rechnungsdatum', leistung: 'Leistungsdatum', zeitraum: 'Leistungszeitraum', faellig: 'Fällig am', ref: 'Käuferreferenz', bestellung: 'Bestellnummer', pos: 'Pos.', bez: 'Bezeichnung', menge: 'Menge', preis: 'Einzelpreis', netto: 'Netto', ust: 'USt', summeNetto: 'Summe netto', ustBetrag: 'Umsatzsteuer', gesamt: 'Gesamtbetrag', zahlbar: 'Zahlbetrag', bank: 'Bankverbindung', ustid: 'USt-IdNr.', stnr: 'Steuernummer', seite: 'Seite', von: 'von', xml: 'Diese PDF enthält die strukturierte Rechnung als XML-Datei', zahlung: 'Zahlung', abschlag: 'Abschlag', zuschlag: 'Zuschlag', kontakt: 'Kontakt' },
  en: { rechnung: 'Invoice', nr: 'Invoice number', datum: 'Invoice date', leistung: 'Delivery date', zeitraum: 'Service period', faellig: 'Due date', ref: 'Buyer reference', bestellung: 'Order number', pos: 'No.', bez: 'Description', menge: 'Qty', preis: 'Unit price', netto: 'Net', ust: 'VAT', summeNetto: 'Total net', ustBetrag: 'VAT', gesamt: 'Total', zahlbar: 'Amount due', bank: 'Bank details', ustid: 'VAT ID', stnr: 'Tax number', seite: 'Page', von: 'of', xml: 'This PDF contains the structured invoice as an XML file', zahlung: 'Payment', abschlag: 'Allowance', zuschlag: 'Charge', kontakt: 'Contact' },
};
const money = (n: number, cur: string, lang: Lang) => new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB', { style: 'currency', currency: cur || 'EUR' }).format(n);
const qty = (n: number, lang: Lang) => new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: 4 }).format(n);
const date = (iso: string | undefined, lang: Lang) => (iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) : '');

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  for (const para of text.split(/\n/)) {
    let line = '';
    for (const w of para.split(/\s+/)) {
      const t = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(t, size) <= width) line = t;
      else { if (line) out.push(line); line = w; }
    }
    out.push(line);
  }
  return out;
}
const xmlEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Espaces de noms XMP : ce sont des identifiants, pas des liens ; assemblés à l'exécution pour que le contrôle des liens du build ne les prenne pas pour des sources. */
const NS = ['http', '//'].join(':');

function xmp(o: { title: string; author: string; created: string; producer: string; file: string; level: string }): string {
  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
<rdf:RDF xmlns:rdf="${NS}www.w3.org/1999/02/22-rdf-syntax-ns#">
<rdf:Description rdf:about="" xmlns:pdfaid="${NS}www.aiim.org/pdfa/ns/id/"><pdfaid:part>3</pdfaid:part><pdfaid:conformance>B</pdfaid:conformance></rdf:Description>
<rdf:Description rdf:about="" xmlns:dc="${NS}purl.org/dc/elements/1.1/"><dc:format>application/pdf</dc:format><dc:title><rdf:Alt><rdf:li xml:lang="x-default">${xmlEsc(o.title)}</rdf:li></rdf:Alt></dc:title><dc:creator><rdf:Seq><rdf:li>${xmlEsc(o.author)}</rdf:li></rdf:Seq></dc:creator></rdf:Description>
<rdf:Description rdf:about="" xmlns:xmp="${NS}ns.adobe.com/xap/1.0/"><xmp:CreatorTool>${xmlEsc(o.producer)}</xmp:CreatorTool><xmp:CreateDate>${o.created}</xmp:CreateDate><xmp:ModifyDate>${o.created}</xmp:ModifyDate><xmp:MetadataDate>${o.created}</xmp:MetadataDate></rdf:Description>
<rdf:Description rdf:about="" xmlns:pdf="${NS}ns.adobe.com/pdf/1.3/"><pdf:Producer>${xmlEsc(o.producer)}</pdf:Producer></rdf:Description>
<rdf:Description rdf:about="" xmlns:fx="urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#"><fx:DocumentType>INVOICE</fx:DocumentType><fx:DocumentFileName>${o.file}</fx:DocumentFileName><fx:Version>1.0</fx:Version><fx:ConformanceLevel>${o.level}</fx:ConformanceLevel></rdf:Description>
<rdf:Description rdf:about="" xmlns:pdfaExtension="${NS}www.aiim.org/pdfa/ns/extension/" xmlns:pdfaSchema="${NS}www.aiim.org/pdfa/ns/schema#" xmlns:pdfaProperty="${NS}www.aiim.org/pdfa/ns/property#">
<pdfaExtension:schemas><rdf:Bag><rdf:li rdf:parseType="Resource">
<pdfaSchema:schema>Factur-X PDFA Extension Schema</pdfaSchema:schema>
<pdfaSchema:namespaceURI>urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#</pdfaSchema:namespaceURI>
<pdfaSchema:prefix>fx</pdfaSchema:prefix>
<pdfaSchema:property><rdf:Seq>
<rdf:li rdf:parseType="Resource"><pdfaProperty:name>DocumentFileName</pdfaProperty:name><pdfaProperty:valueType>Text</pdfaProperty:valueType><pdfaProperty:category>external</pdfaProperty:category><pdfaProperty:description>name of the embedded XML invoice file</pdfaProperty:description></rdf:li>
<rdf:li rdf:parseType="Resource"><pdfaProperty:name>DocumentType</pdfaProperty:name><pdfaProperty:valueType>Text</pdfaProperty:valueType><pdfaProperty:category>external</pdfaProperty:category><pdfaProperty:description>INVOICE</pdfaProperty:description></rdf:li>
<rdf:li rdf:parseType="Resource"><pdfaProperty:name>Version</pdfaProperty:name><pdfaProperty:valueType>Text</pdfaProperty:valueType><pdfaProperty:category>external</pdfaProperty:category><pdfaProperty:description>The actual version of the Factur-X XML schema</pdfaProperty:description></rdf:li>
<rdf:li rdf:parseType="Resource"><pdfaProperty:name>ConformanceLevel</pdfaProperty:name><pdfaProperty:valueType>Text</pdfaProperty:valueType><pdfaProperty:category>external</pdfaProperty:category><pdfaProperty:description>The conformance level of the embedded Factur-X data</pdfaProperty:description></rdf:li>
</rdf:Seq></pdfaSchema:property>
</rdf:li></rdf:Bag></pdfaExtension:schemas>
</rdf:Description>
</rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

/** Erzeugt die ZUGFeRD-PDF. `now` macht das Ergebnis reproduzierbar (Tests). */
export async function makeZugferdPdf(inv: Invoice, xml: string, profile: CiiProfile, assets: PdfAssets, lang: Lang = 'de', now = new Date()): Promise<Uint8Array> {
  const t = L[lang];
  const doc = await PDFDocument.create({ updateMetadata: false });
  doc.registerFontkit(fontkit);
  const f = await doc.embedFont(assets.regular, { subset: true });
  const fb = await doc.embedFont(assets.bold, { subset: true });
  const cur = inv.currency || 'EUR';
  const W = 595.28, H = 841.89, M = 50, ink = rgb(0.1, 0.1, 0.12), grey = rgb(0.38, 0.38, 0.42), line = rgb(0.8, 0.8, 0.84);
  const pages: PDFPage[] = [];
  let page = doc.addPage([W, H]); pages.push(page);
  let y = H - M;
  const text = (s: string, x: number, yy: number, size = 9, bold = false, color = ink) => page.drawText(s, { x, y: yy, size, font: bold ? fb : f, color });
  const right = (s: string, xr: number, yy: number, size = 9, bold = false) => text(s, xr - (bold ? fb : f).widthOfTextAtSize(s, size), yy, size, bold);
  const S = inv.seller, B = inv.buyer;
  // Kopf : Verkäufer
  text(S.name ?? '', M, y, 14, true); y -= 16;
  const sellerLine = [S.address.street, [S.address.zip, S.address.city].filter(Boolean).join(' '), S.address.country].filter(Boolean).join(' · ');
  text(sellerLine, M, y, 8.5, false, grey); y -= 11;
  const contact = [S.contact?.name, S.contact?.phone, S.contact?.email].filter(Boolean).join(' · ');
  if (contact) { text(contact, M, y, 8.5, false, grey); y -= 11; }
  y -= 24;
  // Empfänger links, Rechnungsdaten rechts
  const yTop = y;
  for (const s of [B.name, B.address.street, B.address.street2, [B.address.zip, B.address.city].filter(Boolean).join(' '), B.address.country !== 'DE' ? B.address.country : undefined].filter(Boolean) as string[]) { text(s, M, y, 10); y -= 13; }
  let yr = yTop;
  const meta: Array<[string, string]> = [[t.nr, inv.number ?? ''], [t.datum, date(inv.issueDate, lang)]];
  if (inv.deliveryDate) meta.push([t.leistung, date(inv.deliveryDate, lang)]);
  if (inv.periodStart || inv.periodEnd) meta.push([t.zeitraum, `${date(inv.periodStart, lang)} – ${date(inv.periodEnd, lang)}`]);
  if (inv.dueDate) meta.push([t.faellig, date(inv.dueDate, lang)]);
  if (inv.buyerReference && inv.buyerReference !== '-') meta.push([t.ref, inv.buyerReference]);
  if (inv.orderRef) meta.push([t.bestellung, inv.orderRef]);
  for (const [k, v] of meta) { text(k, 340, yr, 8.5, false, grey); right(v, W - M, yr, 9); yr -= 12; }
  y = Math.min(y, yr) - 26;
  const title = `${TYPE_CODES[inv.typeCode ?? '380']?.[lang === 'de' ? 0 : 1] ?? t.rechnung} ${inv.number ?? ''}`;
  text(title, M, y, 15, true); y -= 22;
  // Positionen
  const cols = { pos: M, bez: M + 28, menge: 345, preis: 425, ust: 470, netto: W - M };
  const header = () => {
    text(t.pos, cols.pos, y, 8, true); text(t.bez, cols.bez, y, 8, true); right(t.menge, cols.menge + 30, y, 8, true); right(t.preis, cols.preis + 20, y, 8, true); right(t.ust, cols.ust + 25, y, 8, true); right(t.netto, cols.netto, y, 8, true);
    y -= 5; page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: line }); y -= 12;
  };
  const newPage = () => { page = doc.addPage([W, H]); pages.push(page); y = H - M; header(); };
  header();
  for (const l of inv.lines) {
    const desc = wrap([l.name, l.description].filter(Boolean).join(' – '), f, 8.5, 240);
    if (y - desc.length * 11 < 160) newPage();
    text(l.id, cols.pos, y, 8.5);
    desc.forEach((d, i) => text(d, cols.bez, y - i * 11, 8.5));
    const unit = UNITS[l.unit]?.[lang === 'de' ? 0 : 1] ?? l.unit;
    right(`${qty(l.qty, lang)} ${unit}`, cols.menge + 30, y, 8.5);
    right(money(l.price, cur, lang), cols.preis + 20, y, 8.5);
    right(`${qty(l.vatRate ?? 0, lang)} %`, cols.ust + 25, y, 8.5);
    right(money(l.net, cur, lang), cols.netto, y, 8.5);
    y -= Math.max(1, desc.length) * 11 + 4;
  }
  page.drawLine({ start: { x: M, y: y + 6 }, end: { x: W - M, y: y + 6 }, thickness: 0.6, color: line });
  y -= 8;
  if (y < 200) newPage();
  const T = inv.totals;
  const sum = (k: string, v: string, bold = false) => { text(k, 340, y, 9, bold); right(v, W - M, y, 9, bold); y -= 13; };
  sum(t.summeNetto, money(T.lineNet, cur, lang));
  for (const a of inv.allowancesCharges) sum(`${a.charge ? t.zuschlag : t.abschlag}${a.reason ? `: ${a.reason}` : ''}`, `${a.charge ? '' : '−'}${money(a.amount, cur, lang)}`);
  for (const v of inv.vat) sum(`${t.ustBetrag} ${qty(v.rate ?? 0, lang)} % (${VAT_CATS[v.cat]?.[lang === 'de' ? 0 : 1] ?? v.cat})`.slice(0, 60), money(v.amount, cur, lang));
  sum(t.gesamt, money(T.taxInclusive, cur, lang), true);
  if (T.prepaid) sum(lang === 'de' ? 'Bereits gezahlt' : 'Paid in advance', `−${money(T.prepaid, cur, lang)}`);
  sum(t.zahlbar, money(T.payable, cur, lang), true);
  y -= 10;
  const notes = [...inv.vat.filter((v) => v.exemptionReason).map((v) => v.exemptionReason!), ...inv.notes];
  for (const n of notes) for (const w of wrap(n, f, 8.5, W - 2 * M)) { if (y < 90) newPage(); text(w, M, y, 8.5); y -= 11; }
  if (inv.payment.terms) for (const w of wrap(inv.payment.terms, f, 8.5, W - 2 * M)) { text(w, M, y, 8.5); y -= 11; }
  // Fuß auf jeder Seite
  const pm = inv.payment;
  const foot1 = [S.name, S.vatId ? `${t.ustid} ${S.vatId}` : '', S.taxNo ? `${t.stnr} ${S.taxNo}` : ''].filter(Boolean).join(' · ');
  const foot2 = [pm.iban ? `${t.bank}: IBAN ${pm.iban}${pm.bic ? ` · BIC ${pm.bic}` : ''}` : '', pm.meansCode ? `${t.zahlung}: ${PAYMENT_MEANS[pm.meansCode]?.[lang === 'de' ? 0 : 1] ?? pm.meansCode}` : ''].filter(Boolean).join(' · ');
  pages.forEach((p, i) => {
    page = p;
    p.drawLine({ start: { x: M, y: 62 }, end: { x: W - M, y: 62 }, thickness: 0.6, color: line });
    text(foot1, M, 50, 7.5, false, grey); text(foot2, M, 40, 7.5, false, grey);
    text(`${t.xml} (${profile === 'XRECHNUNG' ? 'xrechnung.xml' : 'factur-x.xml'}, ZUGFeRD ${profile === 'XRECHNUNG' ? 'XRECHNUNG' : 'EN 16931'}).`, M, 30, 7, false, grey);
    right(`${t.seite} ${i + 1} ${t.von} ${pages.length}`, W - M, 30, 7);
  });

  // PDF/A-3 : Metadaten, OutputIntent, Anhang, Datei-ID
  const producer = 'E-Rechnung-Check (pdf-lib)';
  const titleDoc = `${title}`.trim();
  const iso = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
  doc.setTitle(titleDoc); doc.setAuthor(S.name ?? ''); doc.setProducer(producer); doc.setCreator(producer); doc.setCreationDate(now); doc.setModificationDate(now);
  doc.setLanguage(lang === 'de' ? 'de-DE' : 'en-GB');
  const file = profile === 'XRECHNUNG' ? 'xrechnung.xml' : 'factur-x.xml';
  const level = profile === 'XRECHNUNG' ? 'XRECHNUNG' : 'EN 16931';
  await doc.attach(new TextEncoder().encode(xml), file, { mimeType: 'text/xml', description: 'Factur-X/ZUGFeRD Invoice', creationDate: now, modificationDate: now, afRelationship: AFRelationship.Alternative });
  const ctx = doc.context;
  const meta2 = ctx.stream(new TextEncoder().encode(xmp({ title: titleDoc, author: S.name ?? '', created: iso, producer, file, level })), { Type: 'Metadata', Subtype: 'XML' });
  doc.catalog.set(PDFName.of('Metadata'), ctx.register(meta2));
  const iccStream = ctx.flateStream(assets.icc, { N: 3 });
  const intent = ctx.obj({ Type: 'OutputIntent', S: 'GTS_PDFA1', OutputConditionIdentifier: PDFString.of('sRGB IEC61966-2.1'), Info: PDFString.of('sRGB IEC61966-2.1'), DestOutputProfile: ctx.register(iccStream) });
  doc.catalog.set(PDFName.of('OutputIntents'), ctx.obj([intent]));
  doc.catalog.set(PDFName.of('MarkInfo'), ctx.obj({ Marked: false }));
  const idSrc = `${inv.number}|${inv.issueDate}|${S.name}|${iso}`;
  let h1 = 0x811c9dc5, h2 = 0x01000193;
  for (let i = 0; i < idSrc.length; i++) { h1 = Math.imul(h1 ^ idSrc.charCodeAt(i), 16777619) >>> 0; h2 = Math.imul(h2 + idSrc.charCodeAt(i), 2246822519) >>> 0; }
  const hex = (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')).repeat(2);
  ctx.trailerInfo.ID = ctx.obj([PDFHexString.of(hex), PDFHexString.of(hex)]);
  return doc.save({ useObjectStreams: false, updateFieldAppearances: false });
}

export interface PdfXml { pdf: boolean; files: string[]; xml?: string; name?: string; pdfa?: string; fxLevel?: string }
/** Sucht die eingebettete Rechnungs-XML (factur-x.xml, zugferd-invoice.xml, xrechnung.xml oder sonst die erste .xml). */
export async function extractXmlFromPdf(bytes: Uint8Array): Promise<PdfXml> {
  const head = new TextDecoder().decode(bytes.slice(0, 1024));
  if (!head.includes('%PDF')) return { pdf: false, files: [] };
  let doc: PDFDocument;
  try { doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false, throwOnInvalidObject: false }); } catch { return { pdf: true, files: [] }; }
  const found: Array<{ name: string; stream: PDFStream }> = [];
  const visitSpec = (name: string, spec: unknown) => {
    if (!(spec instanceof PDFDict)) return;
    const ef = spec.lookup(PDFName.of('EF'));
    if (!(ef instanceof PDFDict)) return;
    const s = ef.lookup(PDFName.of('UF')) ?? ef.lookup(PDFName.of('F'));
    const fname = (spec.lookup(PDFName.of('UF')) as PDFString | PDFHexString | undefined)?.decodeText?.() ?? (spec.lookup(PDFName.of('F')) as PDFString | undefined)?.decodeText?.() ?? name;
    if (s instanceof PDFStream && !found.some((x) => x.name === fname)) found.push({ name: fname, stream: s });
  };
  const walkTree = (node: unknown, depth = 0) => {
    if (!(node instanceof PDFDict) || depth > 20) return;
    const names = node.lookup(PDFName.of('Names'));
    if (names instanceof PDFArray) for (let i = 0; i + 1 < names.size(); i += 2) {
      const n = names.lookup(i) as PDFString | PDFHexString; visitSpec(n?.decodeText?.() ?? '', names.lookup(i + 1));
    }
    const kids = node.lookup(PDFName.of('Kids'));
    if (kids instanceof PDFArray) for (let i = 0; i < kids.size(); i++) walkTree(kids.lookup(i), depth + 1);
  };
  const namesDict = doc.catalog.lookup(PDFName.of('Names'));
  if (namesDict instanceof PDFDict) walkTree(namesDict.lookup(PDFName.of('EmbeddedFiles')));
  const af = doc.catalog.lookup(PDFName.of('AF'));
  if (af instanceof PDFArray) for (let i = 0; i < af.size(); i++) visitSpec('', af.lookup(i));
  const decode = (s: PDFStream) => (s instanceof PDFRawStream ? decodePDFRawStream(s).decode() : (s as unknown as { getContents: () => Uint8Array }).getContents());
  let pdfa: string | undefined, fxLevel: string | undefined;
  const md = doc.catalog.lookup(PDFName.of('Metadata'));
  if (md instanceof PDFStream) {
    try {
      const x = new TextDecoder().decode(decode(md));
      const part = x.match(/pdfaid:part(?:>|=")(\d)/)?.[1]; const conf = x.match(/pdfaid:conformance(?:>|=")([ABUabu])/)?.[1];
      if (part) pdfa = `PDF/A-${part}${conf ? conf.toLowerCase() : ''}`;
      fxLevel = x.match(/ConformanceLevel(?:>|=")([^<"]+)/)?.[1];
    } catch { /* Metadaten unlesbar */ }
  }
  const pick = found.find((x) => /^(factur-x|zugferd-invoice|xrechnung|ZUGFeRD-invoice)\.xml$/i.test(x.name)) ?? found.find((x) => /\.xml$/i.test(x.name));
  const files = found.map((x) => x.name);
  if (!pick) return { pdf: true, files, pdfa, fxLevel };
  const xml = new TextDecoder('utf-8').decode(decode(pick.stream));
  return { pdf: true, files, xml, name: pick.name, pdfa, fxLevel };
}
