/**
 * Viewer, Vorprüfung, Formaterkennung und PDF-Prüfung für E-Rechnungen, in einem Werkzeug mit vier Modi :
 *   view   : Datei öffnen und als Rechnung lesen, drucken oder als PDF speichern
 *   check  : Vorprüfung nach EN 16931 und XRechnung (BR-DE), Liste der Befunde
 *   format : welcher Standard, welches Profil, E-Rechnung im Sinne des UStG ?
 *   pdf    : steckt in dieser PDF eine XML ? (ZUGFeRD / Factur-X oder nur ein Bild)
 * Die Datei wird im Browser gelesen und nirgendwohin geschickt. Erster Rendu = Beispiel des Builds (§17.5).
 */
import { useMemo, useRef, useState, type DragEvent } from 'react';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows } from '../calc/parts';
import InvoiceView, { fmtMoney, fmtDate } from './InvoiceView';
import { beispiel } from '../../lib/engine/beispiele';
import { toUBL, toCII } from '../../lib/engine/build';
import { parseInvoiceXml, type ParseResult } from '../../lib/engine/parse';
import { validateInvoice, type Report } from '../../lib/engine/validate';
import type { PdfXml } from '../../lib/engine/pdf';
import { openFile, download, printNode, safeName } from '../../lib/erech-client';
import type { Lang } from '../../lib/format';

type Mode = 'view' | 'check' | 'format' | 'pdf';
interface Links { creator: string; validator: string; viewer: string; method: string }
interface State { name: string; kind: 'xml' | 'pdf' | 'other'; parse?: ParseResult; pdf?: PdfXml; xml?: string; beispiel: boolean }

const L = {
  de: {
    drop: 'Datei hier ablegen oder auswählen', dropSub: 'XRechnung oder ZUGFeRD als .xml, oder eine PDF mit eingebetteter XML', datei: 'Rechnungsdatei',
    privat: 'Ihre Datei bleibt auf Ihrem Gerät: Sie wird in diesem Browserfenster gelesen und nicht hochgeladen.',
    beispiel: 'Oder ein Beispiel ansehen', bund: 'Rechnung an eine Behörde (Leitweg-ID prüfen)?', ja: 'Ja', nein: 'Nein',
    s: { standard: 'XRechnung (UBL), 19 % und 7 %', cii: 'ZUGFeRD EN 16931 (CII-XML)', klein: 'Kleinunternehmer nach § 19 UStG', reverse: 'Reverse Charge, Bauleistung', bund: 'XRechnung an eine Bundesbehörde', fehler: 'XRechnung mit zwei Fehlern', 'pdf-ohne': 'PDF ohne XML (keine E-Rechnung)', 'pdf-zugferd': 'ZUGFeRD-PDF mit factur-x.xml' },
    vonX: 'Rechnung von', zahlbar: 'Zahlbetrag', nr: 'Nummer', datum: 'Datum', faellig: 'Fällig', pruefung: 'Vorprüfung', fehlerN: (e: number, w: number) => `${e} Fehler, ${w} Hinweise`, keinF: 'Keine Fehler',
    regeln: 'Geprüfte Regeln', hinweise: 'Hinweise', format: 'Format', eR: 'E-Rechnung nach UStG', jaE: 'Ja', neinE: 'Nein',
    checkLabel: 'Vorprüfung EN 16931 und XRechnung', checkSub: 'Ersetzt nicht den amtlichen KoSIT-Validator, findet aber die häufigsten Fehler sofort.',
    fmtLabel: 'Format der Datei', syntax: 'Syntax', version: 'Version', spez: 'Kennung (BT-24)', profil: 'Profil',
    pdfLabel: 'Diese PDF ist', pdfJa: 'Eine E-Rechnung', pdfNein: 'Keine E-Rechnung', pdfXmlNein: 'Eine PDF mit XML, aber nicht EN 16931', eingebettet: 'Eingebettete Dateien', keine: 'keine', pdfa: 'PDF/A',
    pdfSubJa: 'Die PDF enthält eine strukturierte Rechnung; maßgeblich sind die XML-Daten.', pdfSubNein: 'Ohne eingebettete XML ist die PDF nur ein Bild der Rechnung, eine sonstige Rechnung nach § 14 Abs. 1 UStG.',
    drucken: 'Rechnung drucken oder als PDF speichern', xmlLaden: 'Eingebettete XML herunterladen', neu: 'Als E-Rechnung neu erstellen', zurPruefung: 'Ausführlich prüfen',
    tabRegel: 'Regel', tabFeld: 'Feld', tabText: 'Befund', tabStufe: 'Stufe', stufe: { error: 'Fehler', warning: 'Hinweis', info: 'Info' }, alleOk: 'Keine Befunde: Alle geprüften Regeln sind erfüllt.',
    err: { xml: 'Die Datei ist kein gültiges XML. Ist sie beschädigt oder unvollständig?', leer: 'Die Datei ist leer.', unbekannt: 'Diese XML ist keine Rechnung nach UBL oder CII.', zugferd1: 'Das ist eine ZUGFeRD-1.0-Rechnung. Dieses Format gilt nicht als E-Rechnung im Sinne des UStG.', other: 'Diese Datei ist weder XML noch PDF.', pdfOhne: 'In dieser PDF steckt keine Rechnungs-XML.' },
    beispielHinweis: 'Beispiel mit erfundenen Daten', laedt: 'Datei wird gelesen …', datenschutz: 'nicht hochgeladen',
  },
  en: {
    drop: 'Drop a file here or choose one', dropSub: 'XRechnung or ZUGFeRD as .xml, or a PDF with embedded XML', datei: 'Invoice file',
    privat: 'Your file stays on your device: it is read in this browser window and never uploaded.',
    beispiel: 'Or look at an example', bund: 'Invoice to a public body (check the Leitweg-ID)?', ja: 'Yes', nein: 'No',
    s: { standard: 'XRechnung (UBL), 19% and 7%', cii: 'ZUGFeRD EN 16931 (CII XML)', klein: 'Small business, section 19 UStG', reverse: 'Reverse charge, construction', bund: 'XRechnung to a federal authority', fehler: 'XRechnung with two errors', 'pdf-ohne': 'PDF without XML (not an e-invoice)', 'pdf-zugferd': 'ZUGFeRD PDF with factur-x.xml' },
    vonX: 'Invoice from', zahlbar: 'Amount due', nr: 'Number', datum: 'Date', faellig: 'Due', pruefung: 'Pre-check', fehlerN: (e: number, w: number) => `${e} errors, ${w} notes`, keinF: 'No errors',
    regeln: 'Rules checked', hinweise: 'Notes', format: 'Format', eR: 'E-invoice under the VAT Act', jaE: 'Yes', neinE: 'No',
    checkLabel: 'Pre-check against EN 16931 and XRechnung', checkSub: 'Does not replace the official KoSIT validator, but finds the most common errors at once.',
    fmtLabel: 'File format', syntax: 'Syntax', version: 'Version', spez: 'Identifier (BT-24)', profil: 'Profile',
    pdfLabel: 'This PDF is', pdfJa: 'An e-invoice', pdfNein: 'Not an e-invoice', pdfXmlNein: 'A PDF with XML, but not EN 16931', eingebettet: 'Embedded files', keine: 'none', pdfa: 'PDF/A',
    pdfSubJa: 'The PDF carries a structured invoice; the XML data is what counts.', pdfSubNein: 'Without embedded XML the PDF is just a picture of the invoice, an ordinary invoice under section 14(1) UStG.',
    drucken: 'Print the invoice or save as PDF', xmlLaden: 'Download the embedded XML', neu: 'Recreate as an e-invoice', zurPruefung: 'Run the full check',
    tabRegel: 'Rule', tabFeld: 'Field', tabText: 'Finding', tabStufe: 'Level', stufe: { error: 'Error', warning: 'Note', info: 'Info' }, alleOk: 'No findings: every rule checked is met.',
    err: { xml: 'The file is not valid XML. Is it damaged or incomplete?', leer: 'The file is empty.', unbekannt: 'This XML is not a UBL or CII invoice.', zugferd1: 'This is a ZUGFeRD 1.0 invoice. That format does not count as an e-invoice under the VAT Act.', other: 'This file is neither XML nor PDF.', pdfOhne: 'This PDF holds no invoice XML.' },
    beispielHinweis: 'Example with made-up data', laedt: 'Reading the file …', datenschutz: 'not uploaded',
  },
};

function sample(id: string, lang: Lang): State {
  if (id === 'pdf-ohne') return { name: 'rechnung.pdf', kind: 'pdf', pdf: { pdf: true, files: [] }, beispiel: true };
  const inv = beispiel(id === 'cii' || id === 'pdf-zugferd' || id === 'fehler' ? 'standard' : (id as 'standard'), lang);
  let xml = id === 'cii' || id === 'pdf-zugferd' ? toCII(inv, 'EN16931') : toUBL(inv);
  if (id === 'fehler') xml = xml.replace(/<cbc:BuyerReference>[^<]*<\/cbc:BuyerReference>/, '').replace(/(<cbc:PayableAmount currencyID="EUR">)([\d.]+)/, (_m, a, b) => `${a}${(Number(b) + 10).toFixed(2)}`);
  const parse = parseInvoiceXml(xml);
  if (id === 'pdf-zugferd') return { name: 'RE-2026-0415.pdf', kind: 'pdf', xml, parse, pdf: { pdf: true, files: ['factur-x.xml'], xml, name: 'factur-x.xml', pdfa: 'PDF/A-3b', fxLevel: 'EN 16931' }, beispiel: true };
  return { name: id === 'cii' ? 'factur-x.xml' : `${inv.number}.xml`, kind: 'xml', xml, parse, beispiel: true };
}

export default function Viewer({ lang, mode: m, idPrefix = 'v', links }: { lang: Lang; mode: string; idPrefix?: string; links: Links }) {
  const mode = (['view', 'check', 'format', 'pdf'].includes(m) ? m : 'view') as Mode;
  const t = L[lang];
  const ids = mode === 'pdf' ? ['pdf-ohne', 'pdf-zugferd'] : ['standard', 'cii', 'klein', 'reverse', 'bund', 'fehler'];
  const [sel, setSel] = useState(mode === 'check' ? 'fehler' : mode === 'format' ? 'cii' : ids[0]);
  const [file, setFile] = useState<State | null>(null);
  const [busy, setBusy] = useState(false);
  const [bund, setBund] = useState('nein');
  const [over, setOver] = useState(false);
  const view = useRef<HTMLDivElement>(null);
  const st = useMemo(() => file ?? sample(sel, lang), [file, sel, lang]);
  const p = st.parse, inv = p?.ok ? p.invoice : undefined;
  const report: Report | undefined = useMemo(() => (inv ? validateInvoice(inv, { bund: bund === 'ja' }) : undefined), [inv, bund]);
  const take = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    try { const o = await openFile(f); setFile({ ...o, beispiel: false }); } finally { setBusy(false); }
  };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]); };
  const errText = st.kind === 'other' ? t.err.other : st.kind === 'pdf' && !st.xml ? t.err.pdfOhne : p && !p.ok ? t.err[p.error ?? 'unbekannt'] : undefined;
  const det = p?.detected;

  let card: { label: string; value: string; sub?: string; rows: Array<[string, string]> };
  if (mode === 'pdf') {
    const ok = !!det?.erechnung;
    card = { label: t.pdfLabel, value: st.xml ? (ok ? t.pdfJa : t.pdfXmlNein) : t.pdfNein, sub: st.xml && ok ? t.pdfSubJa : t.pdfSubNein,
      rows: [[t.eingebettet, st.pdf?.files.length ? st.pdf.files.join(', ') : t.keine], [t.pdfa, st.pdf?.pdfa ?? '–'], [t.profil, det?.profile ? `${det.standard} ${det.profile}` : '–']] };
  } else if (mode === 'format') {
    card = { label: t.fmtLabel, value: det ? `${det.standard}${det.profile && det.profile !== 'XRECHNUNG' ? ` ${det.profile}` : ''}${det.version ? ` ${det.version}` : ''}` : '–', sub: errText,
      rows: [[t.eR, det?.erechnung ? t.jaE : t.neinE], [t.syntax, det?.syntax === 'UBL' ? 'UBL 2.1' : det?.syntax === 'CII' ? 'UN/CEFACT CII' : String(det?.syntax ?? '–')], [t.spez, inv?.customizationId ?? '–']] };
  } else if (mode === 'check') {
    card = { label: t.checkLabel, value: !report ? '–' : report.errors ? t.fehlerN(report.errors, report.warnings) : t.keinF, sub: errText ?? t.checkSub,
      rows: [[t.regeln, report ? String(report.rules) : '–'], [t.hinweise, report ? String(report.warnings) : '–'], [t.format, det ? `${det.standard}${det.profile && det.profile !== 'XRECHNUNG' ? ` ${det.profile}` : ''}` : '–'], [t.eR, det?.erechnung ? t.jaE : t.neinE]] };
  } else {
    card = { label: inv ? `${t.vonX} ${inv.seller.name ?? ''}`.trim() : t.datei, value: inv ? fmtMoney(inv.totals.payable, inv.currency, lang) : '–', sub: errText ?? (det ? `${det.standard}${det.profile && det.profile !== 'XRECHNUNG' ? ` ${det.profile}` : ''} · ${det.syntax === 'UBL' ? 'UBL' : 'CII'}` : undefined),
      rows: [[t.nr, inv?.number ?? '–'], [t.datum, fmtDate(inv?.issueDate, lang) || '–'], [t.faellig, fmtDate(inv?.dueDate, lang) || '–'], [t.pruefung, report ? (report.errors ? t.fehlerN(report.errors, report.warnings) : t.keinF) : '–']] };
  }

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start gap-y-3" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor={`${idPrefix}-file`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}
            className={`block cursor-pointer rounded-lg border-2 border-dashed px-4 py-4 text-center ${over ? 'border-accent-500 bg-accent-50' : 'border-navy-300 bg-navy-50'}`}>
            <span className="block font-semibold text-navy-900">{t.drop}</span>
            <span className="block text-sm text-navy-600">{t.dropSub}</span>
            <input id={`${idPrefix}-file`} type="file" accept=".xml,.pdf,application/xml,text/xml,application/pdf" onChange={(e) => take(e.target.files?.[0])}
              className="mt-3 block h-12 w-full rounded-lg border border-navy-300 bg-white p-1.5 text-sm text-navy-700 file:me-3 file:h-full file:rounded-md file:border-0 file:bg-accent-700 file:px-3 file:py-2 file:font-semibold file:text-white" />
          </label>
          <p className="text-xs text-navy-600">{t.privat}</p>
          <SelectField id={`${idPrefix}-beispiel`} label={t.beispiel} value={file ? '' : sel} onChange={(x) => { setFile(null); setSel(x); }} options={[...(file ? [{ value: '', label: file.name }] : []), ...ids.map((i) => ({ value: i, label: (t.s as Record<string, string>)[i] }))]} />
          {mode === 'check' && <Choice id={`${idPrefix}-bund`} label={t.bund} value={bund} onChange={setBund} options={[{ value: 'ja', label: t.ja }, { value: 'nein', label: t.nein }]} />}
        </form>
        <ResultCard label={card.label} value={busy ? t.laedt : card.value} sub={card.sub}>
          <Rows rows={card.rows} />
          {st.beispiel && <p className="mt-2 text-xs text-navy-600">{t.beispielHinweis}</p>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {inv && <button type="button" className="font-medium text-accent-700 underline" onClick={() => view.current && printNode(view.current, inv.number ?? 'Rechnung')}>{t.drucken}</button>}
            {st.kind === 'pdf' && st.xml && <button type="button" className="font-medium text-accent-700 underline" onClick={() => download(st.xml!, st.pdf?.name ?? 'factur-x.xml', 'application/xml')}>{t.xmlLaden}</button>}
            {(mode === 'pdf' || (mode === 'format' && !det?.erechnung)) && <a className="font-medium text-accent-700 underline" href={links.creator}>{t.neu}</a>}
            {mode !== 'check' && inv && <a className="font-medium text-accent-700 underline" href={links.validator}>{t.zurPruefung}</a>}
          </div>
        </ResultCard>
      </div>
      {mode === 'check' && report && (
        <div className="mt-4 overflow-x-auto">
          {report.findings.length === 0 ? <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{t.alleOk}</p> : (
            <table className="journal w-full text-sm">
              <thead><tr><th scope="col" className="px-2 py-1.5 text-left">{t.tabStufe}</th><th scope="col" className="px-2 py-1.5 text-left">{t.tabRegel}</th><th scope="col" className="px-2 py-1.5 text-left">{t.tabFeld}</th><th scope="col" className="px-2 py-1.5 text-left">{t.tabText}</th></tr></thead>
              <tbody>{report.findings.map((f, i) => (
                <tr key={i} className="border-b border-navy-100 align-top">
                  <td className={`px-2 py-1.5 font-semibold ${f.level === 'error' ? 'text-red-700' : 'text-amber-800'}`}>{t.stufe[f.level]}</td>
                  <td className="px-2 py-1.5 font-mono text-xs">{f.rule}</td><td className="px-2 py-1.5 font-mono text-xs">{f.bt ?? ''}</td>
                  <td className="px-2 py-1.5">{lang === 'de' ? f.de : f.en}</td>
                </tr>))}</tbody>
            </table>
          )}
        </div>
      )}
      {inv && <div className="mt-5"><InvoiceView ref={view} inv={inv} lang={lang} detected={det} /></div>}
      {st.xml && !file?.beispiel && file && <button type="button" className="mt-3 text-xs text-navy-600 underline" onClick={() => download(st.xml!, safeName(st.name.replace(/\.pdf$/i, '.xml'), 'rechnung.xml'), 'application/xml')}>XML</button>}
    </div>
  );
}
