/**
 * Rechnungsersteller : ZUGFeRD-PDF (EN 16931, PDF/A-3 mit factur-x.xml) oder XRechnung 3.0 (UBL und CII).
 * Alles läuft im Browser ; nichts wird gespeichert oder verschickt. Startwerte = Beispiel « standard » (erfundene Daten).
 * Downloads bleiben gesperrt, solange die Vorprüfung Fehler meldet.
 */
import { useMemo, useRef, useState, type ReactNode } from 'react';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows } from '../calc/parts';
import InvoiceView, { fmtMoney } from './InvoiceView';
import { beispiel } from '../../lib/engine/beispiele';
import { computeTotals, emptyInvoice, UNITS, type Invoice } from '../../lib/engine/invoice';
import { toUBL, toCII } from '../../lib/engine/build';
import { validateInvoice } from '../../lib/engine/validate';
import { pruefeLeitweg } from '../../lib/engine/leitweg';
import { download, pdfAssets, safeName } from '../../lib/erech-client';
import { parseLocaleNumber, type Lang } from '../../lib/format';
import P from '../../data/params-2026.json';

interface Links { creator: string; validator: string; viewer: string; method: string }
type Fmt = 'zugferd' | 'xrechnung';
type Empf = 'firma' | 'behoerde';
type Steuer = 'regel' | 'klein' | 'rc';
interface Pos { name: string; qty: string; unit: string; price: string; rate: string }
interface Form {
  sName: string; sStreet: string; sZip: string; sCity: string; sVat: string; sTax: string; sMail: string; sPhone: string; sContact: string; iban: string; bic: string;
  bName: string; bStreet: string; bZip: string; bCity: string; bVat: string; bMail: string; leitweg: string; order: string;
  number: string; date: string; delivery: string; due: string; terms: string;
}

const L = {
  de: {
    fmt: 'Format', zugferd: 'ZUGFeRD-PDF', xrechnung: 'XRechnung', empf: 'Empfänger', firma: 'Unternehmen', behoerde: 'Behörde', steuer: 'Umsatzsteuer', regel: 'Normal', klein: '§ 19', rc: '§ 13b',
    betrag: 'Rechnungsbetrag', netto: 'Netto', ust: 'Umsatzsteuer', format: 'Datei', pruefung: 'Vorprüfung', bereit: 'Bereit zum Herunterladen', fehlerN: (n: number) => `${n} ${n === 1 ? 'Fehler' : 'Fehler'} zu beheben`, hinweiseN: (n: number) => `${n} Hinweise`,
    fZ: 'PDF/A-3 mit factur-x.xml (Profil EN 16931)', fX: 'XRechnung 3.0 als XML (UBL oder CII)',
    ladenPdf: 'ZUGFeRD-PDF herunterladen', ladenFx: 'Nur die factur-x.xml', ladenUbl: 'XRechnung UBL herunterladen', ladenCii: 'XRechnung CII herunterladen', laeuft: 'PDF wird erzeugt …', pdfFehler: 'Die PDF konnte nicht erzeugt werden.',
    gesperrt: 'Erst die rot markierten Angaben ergänzen.', privat: 'Ihre Angaben bleiben in diesem Fenster: Es wird nichts gespeichert und nichts übertragen.', leeren: 'Alle Felder leeren', beispiel: 'Beispieldaten laden',
    gV: 'Ihr Unternehmen', gK: 'Empfänger der Rechnung', gR: 'Rechnungsdaten', gP: 'Positionen', gZ: 'Zahlung',
    sName: 'Name oder Firma', street: 'Straße und Hausnummer', zip: 'PLZ', city: 'Ort', sVat: 'USt-IdNr.', sTax: 'Steuernummer', sMail: 'E-Mail', sPhone: 'Telefon', sContact: 'Ansprechpartner', iban: 'IBAN', bic: 'BIC (freiwillig)',
    bName: 'Name oder Firma', bVat: 'USt-IdNr. des Empfängers', bMail: 'E-Mail für den Rechnungseingang', leitweg: 'Leitweg-ID', order: 'Bestellnummer (freiwillig)',
    number: 'Rechnungsnummer', date: 'Rechnungsdatum', delivery: 'Leistungsdatum', due: 'Fällig am', terms: 'Zahlungsbedingungen',
    pName: 'Bezeichnung', pQty: 'Menge', pUnit: 'Einheit', pPrice: 'Einzelpreis netto', pRate: 'USt', plus: 'Position hinzufügen', minus: 'Entfernen',
    kleinGrund: 'Steuerbefreit als Kleinunternehmer nach § 19 Abs. 1 UStG.', rcGrund: 'Steuerschuldnerschaft des Leistungsempfängers (§ 13b UStG).', vorschau: 'Vorschau der Rechnung', befunde: 'Was noch fehlt', pruefen: 'Erzeugte Datei im Validator öffnen',
    lwFalsch: 'Die Leitweg-ID ist formal ungültig.', erzwungen: 'Behörden erhalten immer eine XRechnung.',
  },
  en: {
    fmt: 'Format', zugferd: 'ZUGFeRD PDF', xrechnung: 'XRechnung', empf: 'Recipient', firma: 'Business', behoerde: 'Authority', steuer: 'VAT', regel: 'Normal', klein: 'Sec. 19', rc: 'Sec. 13b',
    betrag: 'Invoice total', netto: 'Net', ust: 'VAT', format: 'File', pruefung: 'Pre-check', bereit: 'Ready to download', fehlerN: (n: number) => `${n} ${n === 1 ? 'error' : 'errors'} to fix`, hinweiseN: (n: number) => `${n} notes`,
    fZ: 'PDF/A-3 with factur-x.xml (EN 16931 profile)', fX: 'XRechnung 3.0 as XML (UBL or CII)',
    ladenPdf: 'Download the ZUGFeRD PDF', ladenFx: 'Only the factur-x.xml', ladenUbl: 'Download XRechnung UBL', ladenCii: 'Download XRechnung CII', laeuft: 'Creating the PDF …', pdfFehler: 'The PDF could not be created.',
    gesperrt: 'Fill in the fields marked in red first.', privat: 'Your entries stay in this window: nothing is stored and nothing is sent.', leeren: 'Clear all fields', beispiel: 'Load sample data',
    gV: 'Your business', gK: 'Invoice recipient', gR: 'Invoice details', gP: 'Line items', gZ: 'Payment',
    sName: 'Name or company', street: 'Street and number', zip: 'Postcode', city: 'City', sVat: 'VAT ID', sTax: 'Tax number', sMail: 'Email', sPhone: 'Phone', sContact: 'Contact person', iban: 'IBAN', bic: 'BIC (optional)',
    bName: 'Name or company', bVat: 'Recipient VAT ID', bMail: 'Email for incoming invoices', leitweg: 'Leitweg-ID', order: 'Order number (optional)',
    number: 'Invoice number', date: 'Invoice date', delivery: 'Date of supply', due: 'Due date', terms: 'Payment terms',
    pName: 'Description', pQty: 'Quantity', pUnit: 'Unit', pPrice: 'Net unit price', pRate: 'VAT', plus: 'Add a line', minus: 'Remove',
    kleinGrund: 'Exempt as a small business under section 19(1) UStG.', rcGrund: 'Reverse charge: the recipient owes the VAT (section 13b UStG).', vorschau: 'Invoice preview', befunde: 'Still missing', pruefen: 'Open the file in the validator',
    lwFalsch: 'The Leitweg-ID is formally invalid.', erzwungen: 'Public bodies always receive an XRechnung.',
  },
};

const num = (s: string) => parseLocaleNumber(s);
const str = (n: number) => String(n);

export function fromSample(lang: Lang): { form: Form; pos: Pos[] } {
  const b = beispiel('standard', lang), bb = beispiel('bund', lang);
  return {
    form: {
      sName: b.seller.name ?? '', sStreet: b.seller.address.street ?? '', sZip: b.seller.address.zip ?? '', sCity: b.seller.address.city ?? '', sVat: b.seller.vatId ?? '', sTax: b.seller.taxNo ?? '',
      sMail: b.seller.contact?.email ?? '', sPhone: b.seller.contact?.phone ?? '', sContact: b.seller.contact?.name ?? '', iban: b.payment.iban ?? '', bic: '',
      bName: b.buyer.name ?? '', bStreet: b.buyer.address.street ?? '', bZip: b.buyer.address.zip ?? '', bCity: b.buyer.address.city ?? '', bVat: b.buyer.vatId ?? '', bMail: b.buyer.endpoint ?? '',
      leitweg: bb.buyerReference ?? '', order: '', number: b.number ?? '', date: b.issueDate ?? '', delivery: b.deliveryDate ?? '', due: b.dueDate ?? '', terms: b.payment.terms ?? '',
    },
    pos: b.lines.map((l) => ({ name: l.name, qty: str(l.qty), unit: l.unit, price: str(l.price), rate: str(l.vatRate ?? 0) })),
  };
}
const EMPTY: Form = { sName: '', sStreet: '', sZip: '', sCity: '', sVat: '', sTax: '', sMail: '', sPhone: '', sContact: '', iban: '', bic: '', bName: '', bStreet: '', bZip: '', bCity: '', bVat: '', bMail: '', leitweg: '', order: '', number: '', date: '', delivery: '', due: '', terms: '' };

export function buildInvoice(f: Form, pos: Pos[], empf: Empf, steuer: Steuer, lang: Lang): Invoice {
  const t = L[lang];
  const inv = emptyInvoice();
  const cat = steuer === 'klein' ? 'E' : steuer === 'rc' ? 'AE' : 'S';
  Object.assign(inv, { number: f.number.trim(), issueDate: f.date, typeCode: '380', currency: 'EUR', deliveryDate: f.delivery || undefined, dueDate: f.due || undefined });
  inv.seller = {
    name: f.sName.trim(), address: { street: f.sStreet.trim(), zip: f.sZip.trim(), city: f.sCity.trim(), country: 'DE' },
    vatId: steuer !== 'klein' && f.sVat.trim() ? f.sVat.replace(/\s+/g, '').toUpperCase() : undefined, taxNo: f.sTax.trim() || undefined,
    endpoint: f.sMail.trim() || undefined, endpointScheme: 'EM', contact: { name: f.sContact.trim() || f.sName.trim(), phone: f.sPhone.trim(), email: f.sMail.trim() },
  };
  if (!inv.seller.vatId && inv.seller.taxNo) inv.seller.id = inv.seller.taxNo;
  const lw = f.leitweg.replace(/\s+/g, '').toUpperCase();
  inv.buyer = {
    name: f.bName.trim(), address: { street: f.bStreet.trim(), zip: f.bZip.trim(), city: f.bCity.trim(), country: 'DE' },
    vatId: f.bVat.trim() ? f.bVat.replace(/\s+/g, '').toUpperCase() : undefined,
    endpoint: empf === 'behoerde' ? lw || undefined : f.bMail.trim() || undefined, endpointScheme: empf === 'behoerde' ? '0204' : 'EM',
  };
  inv.buyerReference = empf === 'behoerde' ? lw : '-';
  inv.orderRef = f.order.trim() || undefined;
  inv.payment = { meansCode: '58', iban: f.iban.replace(/\s+/g, '').toUpperCase() || undefined, bic: f.bic.trim() || undefined, accountName: f.sName.trim() || undefined, terms: f.terms.trim() || undefined };
  inv.lines = pos.map((p, i) => ({ id: String(i + 1), name: p.name.trim(), qty: num(p.qty), unit: p.unit, price: num(p.price), net: 0, vatCat: cat, vatRate: cat === 'S' ? num(p.rate) : 0 }));
  if (cat !== 'S') inv.vat = [{ cat, rate: 0, base: 0, amount: 0, exemptionReason: cat === 'E' ? t.kleinGrund : t.rcGrund }];
  return computeTotals(inv);
}

function Field({ id, label, value, onChange, bad, mono, mode, wide }: { id: string; label: string; value: string; onChange: (v: string) => void; bad?: boolean; mono?: boolean; mode?: 'email' | 'tel' | 'decimal' | 'text'; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="text" inputMode={mode ?? 'text'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete="off" aria-invalid={bad || undefined}
        className={`h-12 w-full rounded-lg border bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 ${mono ? 'font-mono' : ''} ${bad ? 'border-red-600' : 'border-navy-300'}`} />
    </div>
  );
}
function DateField({ id, label, value, onChange, bad }: { id: string; label: string; value: string; onChange: (v: string) => void; bad?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={bad || undefined}
        className={`h-12 w-full rounded-lg border bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none ${bad ? 'border-red-600' : 'border-navy-300'}`} />
    </div>
  );
}
const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <fieldset className="rounded-lg border border-navy-200 p-3 sm:p-4">
    <legend className="px-1 text-sm font-semibold text-navy-900">{title}</legend>
    <div className="grid gap-3 sm:grid-cols-2">{children}</div>
  </fieldset>
);

export default function Creator({ lang, preset = 'zugferd', idPrefix = 'cr', links }: { lang: Lang; preset?: string; idPrefix?: string; links: Links }) {
  const t = L[lang];
  const start = useMemo(() => fromSample(lang), [lang]);
  const [fmt, setFmt] = useState<Fmt>(preset === 'xrechnung' ? 'xrechnung' : 'zugferd');
  const [empf, setEmpf] = useState<Empf>('firma');
  const [steuer, setSteuer] = useState<Steuer>('regel');
  const [f, setF] = useState<Form>(start.form);
  const [pos, setPos] = useState<Pos[]>(start.pos);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const view = useRef<HTMLDivElement>(null);
  const set = (k: keyof Form) => (v: string) => setF((o) => ({ ...o, [k]: v }));
  const setP = (i: number, k: keyof Pos) => (v: string) => setPos((o) => o.map((p, j) => (j === i ? { ...p, [k]: v } : p)));
  const xr = fmt === 'xrechnung' || empf === 'behoerde';
  const inv = useMemo(() => buildInvoice(f, pos, empf, steuer, lang), [f, pos, empf, steuer, lang]);
  const report = useMemo(() => validateInvoice({ ...inv, customizationId: xr ? P.standards.xrCustomization : P.standards.en16931Id }, { xrechnung: xr, bund: empf === 'behoerde' }), [inv, xr, empf]);
  const lwBad = empf === 'behoerde' && !pruefeLeitweg(f.leitweg).ok;
  const errors = report.errors + (lwBad ? 1 : 0);
  const badBT = new Set(report.findings.filter((x) => x.level === 'error').flatMap((x) => (x.bt ?? '').split(/[ ,/]+/)));
  const bad = (...bts: string[]) => bts.some((b) => badBT.has(b));
  const ok = errors === 0;
  const name = safeName(inv.number, 'rechnung');

  const pdf = async () => {
    setBusy(true); setErr('');
    try {
      const [{ makeZugferdPdf }, a] = await Promise.all([import('../../lib/engine/pdf'), pdfAssets()]);
      download(await makeZugferdPdf(inv, toCII(inv, 'EN16931'), 'EN16931', a, lang), `${name}.pdf`, 'application/pdf');
    } catch { setErr(t.pdfFehler); } finally { setBusy(false); }
  };
  const btn = 'rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-3 lg:col-start-1 lg:row-start-1" onSubmit={(e) => e.preventDefault()}>
          <Choice id={`${idPrefix}-fmt`} label={t.fmt} value={empf === 'behoerde' ? 'xrechnung' : fmt} onChange={setFmt} options={[{ value: 'zugferd', label: t.zugferd }, { value: 'xrechnung', label: t.xrechnung }]} />
          <Choice id={`${idPrefix}-empf`} label={t.empf} value={empf} onChange={setEmpf} options={[{ value: 'firma', label: t.firma }, { value: 'behoerde', label: t.behoerde }]} />
          <Choice id={`${idPrefix}-steuer`} label={t.steuer} value={steuer} onChange={setSteuer} options={[{ value: 'regel', label: t.regel }, { value: 'klein', label: t.klein }, { value: 'rc', label: t.rc }]} />
          <p className="text-xs text-navy-600 sm:col-span-3">{empf === 'behoerde' ? `${t.erzwungen} ` : ''}{t.privat}</p>
        </form>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-4">
            <ResultCard label={t.betrag} value={fmtMoney(inv.totals.payable, 'EUR', lang)} sub={ok ? `${t.bereit} · ${report.warnings ? t.hinweiseN(report.warnings) : ''}`.replace(/ · $/, '') : t.fehlerN(errors)}>
              <Rows rows={[[t.netto, fmtMoney(inv.totals.taxExclusive, 'EUR', lang)], [t.ust, fmtMoney(inv.totals.vatTotal ?? 0, 'EUR', lang)], [t.format, xr ? t.fX : t.fZ], [t.pruefung, `${report.rules} ${lang === 'de' ? 'Regeln' : 'rules'}, ${errors} ${lang === 'de' ? 'Fehler' : 'errors'}`]]} />
              <div className="mt-3 grid gap-2">
                {xr ? (<>
                  <button type="button" disabled={!ok} className={`${btn} bg-accent-700 text-white`} onClick={() => download(toUBL({ ...inv }), `${name}-xrechnung.xml`, 'application/xml')}>{t.ladenUbl}</button>
                  <button type="button" disabled={!ok} className={`${btn} border border-accent-700 text-accent-700`} onClick={() => download(toCII(inv, 'XRECHNUNG'), `${name}-xrechnung-cii.xml`, 'application/xml')}>{t.ladenCii}</button>
                </>) : (<>
                  <button type="button" disabled={!ok || busy} className={`${btn} bg-accent-700 text-white`} onClick={pdf}>{busy ? t.laeuft : t.ladenPdf}</button>
                  <button type="button" disabled={!ok} className={`${btn} border border-accent-700 text-accent-700`} onClick={() => download(toCII(inv, 'EN16931'), 'factur-x.xml', 'application/xml')}>{t.ladenFx}</button>
                </>)}
              </div>
              {!ok && <p className="mt-2 text-xs text-red-700">{t.gesperrt}</p>}
              {err && <p role="alert" className="mt-2 text-sm text-red-700">{err}</p>}
              <p className="mt-2 text-xs"><a className="text-accent-700 underline" href={links.validator}>{t.pruefen}</a></p>
            </ResultCard>
            {(errors > 0 || report.warnings > 0) && (
              <div className="mt-3 rounded-lg border border-navy-200 p-3 text-sm">
                <p className="font-semibold text-navy-900">{t.befunde}</p>
                <ul className="mt-1 list-disc ps-5 text-navy-700">
                  {lwBad && <li className="text-red-700">{t.lwFalsch}</li>}
                  {report.findings.slice(0, 8).map((x, i) => <li key={i} className={x.level === 'error' ? 'text-red-700' : ''}>{lang === 'de' ? x.de : x.en} <span className="font-mono text-xs text-navy-500">{x.rule}</span></li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
        <form className="grid content-start gap-4 lg:col-start-1 lg:row-start-2" onSubmit={(e) => e.preventDefault()}>
          <Group title={t.gV}>
            <Field id={`${idPrefix}-sname`} label={t.sName} value={f.sName} onChange={set('sName')} bad={bad('BT-27')} wide />
            <Field id={`${idPrefix}-sstreet`} label={t.street} value={f.sStreet} onChange={set('sStreet')} bad={bad('BT-35')} wide />
            <Field id={`${idPrefix}-szip`} label={t.zip} value={f.sZip} onChange={set('sZip')} bad={bad('BT-38')} mode="decimal" />
            <Field id={`${idPrefix}-scity`} label={t.city} value={f.sCity} onChange={set('sCity')} bad={bad('BT-37')} />
            {steuer !== 'klein' && <Field id={`${idPrefix}-svat`} label={t.sVat} value={f.sVat} onChange={set('sVat')} bad={bad('BT-31')} mono />}
            <Field id={`${idPrefix}-stax`} label={t.sTax} value={f.sTax} onChange={set('sTax')} bad={bad('BT-32')} mono />
            <Field id={`${idPrefix}-scontact`} label={t.sContact} value={f.sContact} onChange={set('sContact')} bad={bad('BT-41')} />
            <Field id={`${idPrefix}-sphone`} label={t.sPhone} value={f.sPhone} onChange={set('sPhone')} bad={bad('BT-42')} mode="tel" />
            <Field id={`${idPrefix}-smail`} label={t.sMail} value={f.sMail} onChange={set('sMail')} bad={bad('BT-43', 'BT-34')} mode="email" wide />
          </Group>
          <Group title={t.gK}>
            <Field id={`${idPrefix}-bname`} label={t.bName} value={f.bName} onChange={set('bName')} bad={bad('BT-44')} wide />
            <Field id={`${idPrefix}-bstreet`} label={t.street} value={f.bStreet} onChange={set('bStreet')} bad={bad('BT-50')} wide />
            <Field id={`${idPrefix}-bzip`} label={t.zip} value={f.bZip} onChange={set('bZip')} bad={bad('BT-53')} mode="decimal" />
            <Field id={`${idPrefix}-bcity`} label={t.city} value={f.bCity} onChange={set('bCity')} bad={bad('BT-52')} />
            {empf === 'behoerde'
              ? (<><Field id={`${idPrefix}-lw`} label={t.leitweg} value={f.leitweg} onChange={set('leitweg')} bad={lwBad || bad('BT-10', 'BT-49')} mono />
                 <Field id={`${idPrefix}-order`} label={t.order} value={f.order} onChange={set('order')} /></>)
              : <Field id={`${idPrefix}-bmail`} label={t.bMail} value={f.bMail} onChange={set('bMail')} bad={bad('BT-49')} mode="email" wide />}
            {steuer === 'rc' && <Field id={`${idPrefix}-bvat`} label={t.bVat} value={f.bVat} onChange={set('bVat')} bad={bad('BT-48')} mono />}
          </Group>
          <Group title={t.gR}>
            <Field id={`${idPrefix}-nr`} label={t.number} value={f.number} onChange={set('number')} bad={bad('BT-1')} mono />
            <DateField id={`${idPrefix}-date`} label={t.date} value={f.date} onChange={set('date')} bad={bad('BT-2')} />
            <DateField id={`${idPrefix}-delivery`} label={t.delivery} value={f.delivery} onChange={set('delivery')} />
            <DateField id={`${idPrefix}-due`} label={t.due} value={f.due} onChange={set('due')} />
          </Group>
          <fieldset className="rounded-lg border border-navy-200 p-3 sm:p-4">
            <legend className="px-1 text-sm font-semibold text-navy-900">{t.gP}</legend>
            <div className="grid gap-4">
              {pos.map((p, i) => (
                <div key={i} className="grid gap-3 border-b border-navy-100 pb-3 sm:grid-cols-[minmax(0,2fr)_5rem_minmax(0,1fr)_7rem_5.5rem]">
                  <Field id={`${idPrefix}-p${i}-name`} label={`${t.pName} ${i + 1}`} value={p.name} onChange={setP(i, 'name')} bad={!p.name.trim()} />
                  <Field id={`${idPrefix}-p${i}-qty`} label={t.pQty} value={p.qty} onChange={setP(i, 'qty')} mode="decimal" />
                  <SelectField id={`${idPrefix}-p${i}-unit`} label={t.pUnit} value={p.unit} onChange={setP(i, 'unit')} options={Object.entries(UNITS).map(([k, v]) => ({ value: k, label: v[lang === 'de' ? 0 : 1] }))} />
                  <Field id={`${idPrefix}-p${i}-price`} label={t.pPrice} value={p.price} onChange={setP(i, 'price')} mode="decimal" />
                  {steuer === 'regel'
                    ? <SelectField id={`${idPrefix}-p${i}-rate`} label={t.pRate} value={p.rate} onChange={setP(i, 'rate')} options={[P.steuer.regel, P.steuer.ermaessigt, 0].map((r) => ({ value: String(r), label: `${r}${lang === 'de' ? '\u00a0' : ''}%` }))} />
                    : <div className="self-end pb-2 text-sm text-navy-600">{lang === 'de' ? '0\u00a0%' : '0%'}</div>}
                  {pos.length > 1 && <button type="button" className="justify-self-start text-xs text-navy-600 underline sm:col-span-5" onClick={() => setPos((o) => o.filter((_, j) => j !== i))}>{t.minus}</button>}
                </div>
              ))}
              <button type="button" className="justify-self-start text-sm font-medium text-accent-700 underline" onClick={() => setPos((o) => [...o, { name: '', qty: '1', unit: 'C62', price: '0', rate: String(P.steuer.regel) }])}>{t.plus}</button>
            </div>
          </fieldset>
          <Group title={t.gZ}>
            <Field id={`${idPrefix}-iban`} label={t.iban} value={f.iban} onChange={set('iban')} bad={bad('BT-84')} mono wide />
            <Field id={`${idPrefix}-bic`} label={t.bic} value={f.bic} onChange={set('bic')} mono />
            <Field id={`${idPrefix}-terms`} label={t.terms} value={f.terms} onChange={set('terms')} bad={bad('BT-20')} />
          </Group>
          <div className="flex flex-wrap gap-4 text-sm">
            <button type="button" className="text-navy-600 underline" onClick={() => { setF(EMPTY); setPos([{ name: '', qty: '1', unit: 'C62', price: '0', rate: String(P.steuer.regel) }]); }}>{t.leeren}</button>
            <button type="button" className="text-navy-600 underline" onClick={() => { setF(start.form); setPos(start.pos); }}>{t.beispiel}</button>
          </div>
        </form>
      </div>
      <details className="mt-5">
        <summary className="cursor-pointer text-sm font-semibold text-navy-900">{t.vorschau}</summary>
        <div className="mt-3"><InvoiceView ref={view} inv={inv} lang={lang} /></div>
      </details>
    </div>
  );
}
