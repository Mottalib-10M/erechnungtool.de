/** Beispielrechnungen : vier Fälle mit erfundenen Daten, als Rechnung lesbar und als XRechnung, CII oder ZUGFeRD-PDF ladbar. */
import { useMemo, useRef, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows } from '../calc/parts';
import InvoiceView, { fmtMoney } from './InvoiceView';
import { beispiel, type Szenario } from '../../lib/engine/beispiele';
import { toUBL, toCII } from '../../lib/engine/build';
import { parseInvoiceXml } from '../../lib/engine/parse';
import { download, pdfAssets, printNode } from '../../lib/erech-client';
import type { Lang } from '../../lib/format';
interface Links { creator: string; validator: string; viewer: string; method: string }

const L = {
  de: {
    fall: 'Fall', s: { standard: 'Dienstleistung mit 19 % und 7 %', klein: 'Kleinunternehmer (§ 19 UStG)', reverse: 'Bauleistung mit Reverse Charge', bund: 'Rechnung an eine Bundesbehörde' },
    fmt: 'Format', label: 'Beispielrechnung', netto: 'Netto', ust: 'Umsatzsteuer', besonders: 'Besonderheit',
    b: { standard: 'Zwei Steuersätze, je eine Zeile in der Aufschlüsselung', klein: 'Kategorie E mit Befreiungsgrund, keine Steuer', reverse: 'Kategorie AE, USt-IdNr. beider Seiten', bund: 'Leitweg-ID in BT-10 und als Adresse (0204)' },
    laden: 'Herunterladen', pdf: 'ZUGFeRD-PDF', drucken: 'Drucken', anpassen: 'Mit eigenen Daten erstellen', hinweis: 'Alle Namen, Nummern und Bankdaten sind erfunden.', fehler: 'PDF konnte nicht erzeugt werden.', laeuft: 'PDF wird erzeugt …',
  },
  en: {
    fall: 'Case', s: { standard: 'Service at 19% and 7%', klein: 'Small business (section 19 UStG)', reverse: 'Construction with reverse charge', bund: 'Invoice to a federal authority' },
    fmt: 'Format', label: 'Sample invoice', netto: 'Net', ust: 'VAT', besonders: 'Special feature',
    b: { standard: 'Two VAT rates, one breakdown line each', klein: 'Category E with exemption reason, no VAT', reverse: 'Category AE, VAT IDs of both sides', bund: 'Leitweg-ID in BT-10 and as address (0204)' },
    laden: 'Download', pdf: 'ZUGFeRD PDF', drucken: 'Print', anpassen: 'Create one with your own data', hinweis: 'All names, numbers and bank details are made up.', fehler: 'The PDF could not be created.', laeuft: 'Creating the PDF …',
  },
};

export default function Beispiel({ lang, idPrefix = 'bsp', links }: { lang: Lang; idPrefix?: string; links: Links }) {
  const t = L[lang];
  const [s, setS] = useState<Szenario>('standard');
  const [fmt, setFmt] = useState<'ubl' | 'cii'>('ubl');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inv = useMemo(() => beispiel(s, lang), [s, lang]);
  const xml = useMemo(() => (fmt === 'ubl' ? toUBL(inv) : toCII(inv, 'XRECHNUNG')), [inv, fmt]);
  const det = useMemo(() => parseInvoiceXml(xml).detected, [xml]);
  const pdf = async () => {
    setBusy(true); setErr('');
    try {
      const [{ makeZugferdPdf }, a] = await Promise.all([import('../../lib/engine/pdf'), pdfAssets()]);
      const cii = toCII(inv, 'EN16931');
      download(await makeZugferdPdf(inv, cii, 'EN16931', a, lang), `${inv.number}.pdf`, 'application/pdf');
    } catch { setErr(t.fehler); } finally { setBusy(false); }
  };
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-fall`} label={t.fall} value={s} onChange={(x) => setS(x as Szenario)} options={(['standard', 'klein', 'reverse', 'bund'] as Szenario[]).map((v) => ({ value: v, label: t.s[v] }))} />
          <Choice id={`${idPrefix}-fmt`} label={t.fmt} value={fmt} onChange={setFmt} options={[{ value: 'ubl', label: 'UBL' }, { value: 'cii', label: 'CII' }]} />
          <p className="text-xs text-navy-600 sm:col-span-2">{t.hinweis}</p>
        </form>
        <ResultCard label={`${t.label} ${inv.number}`} value={fmtMoney(inv.totals.payable, 'EUR', lang)} sub={t.s[s]}>
          <Rows rows={[[t.netto, fmtMoney(inv.totals.taxExclusive, 'EUR', lang)], [t.ust, fmtMoney(inv.totals.vatTotal ?? 0, 'EUR', lang)], [t.besonders, t.b[s]]]} />
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <button type="button" className="font-medium text-accent-700 underline" onClick={() => download(xml, `${inv.number}-${fmt}.xml`, 'application/xml')}>{t.laden}: XRechnung {fmt.toUpperCase()}</button>
            <button type="button" className="font-medium text-accent-700 underline" disabled={busy} onClick={pdf}>{busy ? t.laeuft : `${t.laden}: ${t.pdf}`}</button>
            <button type="button" className="font-medium text-accent-700 underline" onClick={() => ref.current && printNode(ref.current, inv.number ?? '')}>{t.drucken}</button>
            <a className="font-medium text-accent-700 underline" href={links.creator}>{t.anpassen}</a>
          </div>
          {err && <p role="alert" className="mt-2 text-sm text-red-700">{err}</p>}
        </ResultCard>
      </div>
      <div className="mt-5"><InvoiceView ref={ref} inv={inv} lang={lang} detected={det} /></div>
    </div>
  );
}
