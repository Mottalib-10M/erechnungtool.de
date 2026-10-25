/**
 * Zeigt eine E-Rechnung (Modell aus engine/invoice.ts) als lesbare Rechnung : Verkäufer, Käufer, Daten,
 * Positionen, Steuer, Summen, Zahlung, Hinweise, Anhänge und die technischen Kennungen.
 * Keine Angabe wird erfunden : was in der Datei fehlt, bleibt leer.
 */
import { forwardRef } from 'react';
import type { Invoice, Party } from '../../lib/engine/invoice';
import { TYPE_CODES, VAT_CATS, UNITS, PAYMENT_MEANS } from '../../lib/engine/invoice';
import type { Detected } from '../../lib/engine/parse';
import type { Lang } from '../../lib/format';

const L = {
  de: { von: 'Rechnungssteller', an: 'Rechnungsempfänger', nr: 'Nummer', datum: 'Datum', leistung: 'Leistungsdatum', zeitraum: 'Zeitraum', faellig: 'Fällig', ref: 'Käuferreferenz (BT-10)', best: 'Bestellung', vertrag: 'Vertrag', vor: 'Bezieht sich auf', pos: 'Pos.', bez: 'Bezeichnung', menge: 'Menge', preis: 'Preis', ust: 'USt', netto: 'Netto', summe: 'Summe Positionen', abschlag: 'Abschlag', zuschlag: 'Zuschlag', ohne: 'Gesamt ohne USt', steuer: 'Umsatzsteuer', mit: 'Gesamt mit USt', vorab: 'Bereits gezahlt', rund: 'Rundung', zahlbar: 'Zahlbetrag', zahlung: 'Zahlung', bank: 'Konto', bic: 'BIC', inhaber: 'Kontoinhaber', verw: 'Verwendungszweck', bed: 'Bedingungen', mandat: 'Mandat', hinweise: 'Hinweise', anh: 'Angehängte Dokumente', tech: 'Technische Angaben', syntax: 'Syntax', spez: 'Spezifikation (BT-24)', prozess: 'Prozess (BT-23)', standard: 'Standard', profil: 'Profil', ustid: 'USt-IdNr.', stnr: 'Steuernummer', reg: 'Register', kontakt: 'Kontakt', adresse: 'Elektronische Adresse', befreiung: 'Befreiungsgrund', basis: 'Bemessung', leer: 'fehlt' },
  en: { von: 'Seller', an: 'Buyer', nr: 'Number', datum: 'Date', leistung: 'Delivery date', zeitraum: 'Period', faellig: 'Due', ref: 'Buyer reference (BT-10)', best: 'Order', vertrag: 'Contract', vor: 'Refers to', pos: 'No.', bez: 'Description', menge: 'Qty', preis: 'Price', ust: 'VAT', netto: 'Net', summe: 'Sum of lines', abschlag: 'Allowance', zuschlag: 'Charge', ohne: 'Total excl. VAT', steuer: 'VAT', mit: 'Total incl. VAT', vorab: 'Paid in advance', rund: 'Rounding', zahlbar: 'Amount due', zahlung: 'Payment', bank: 'Account', bic: 'BIC', inhaber: 'Account holder', verw: 'Reference', bed: 'Terms', mandat: 'Mandate', hinweise: 'Notes', anh: 'Attached documents', tech: 'Technical details', syntax: 'Syntax', spez: 'Specification (BT-24)', prozess: 'Process (BT-23)', standard: 'Standard', profil: 'Profile', ustid: 'VAT ID', stnr: 'Tax number', reg: 'Register', kontakt: 'Contact', adresse: 'Electronic address', befreiung: 'Exemption reason', basis: 'Taxable', leer: 'missing' },
};
const tag = (l: Lang) => (l === 'de' ? 'de-DE' : 'en-GB');
export const fmtMoney = (n: number | undefined, cur: string | undefined, l: Lang) => (n === undefined || Number.isNaN(n) ? '–' : new Intl.NumberFormat(tag(l), { style: 'currency', currency: /^[A-Z]{3}$/.test(cur ?? '') ? cur! : 'EUR', minimumFractionDigits: 2 }).format(n));
const fmtQty = (n: number, l: Lang) => new Intl.NumberFormat(tag(l), { maximumFractionDigits: 4 }).format(n);
export const fmtDate = (iso: string | undefined, l: Lang) => (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00Z`).toLocaleDateString(tag(l), { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) : iso ?? '');
const ix = (l: Lang) => (l === 'de' ? 0 : 1);

function PartyBlock({ p, title, lang }: { p: Party; title: string; lang: Lang }) {
  const t = L[lang];
  const A = p.address;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{title}</p>
      <p className="mt-1 font-semibold text-navy-900">{p.name || <span className="text-amber-800">{t.leer}</span>}</p>
      {p.tradingName && p.tradingName !== p.name && <p className="text-sm text-navy-700">{p.tradingName}</p>}
      <p className="text-sm text-navy-700">{[A.street, A.street2].filter(Boolean).join(', ')}</p>
      <p className="text-sm text-navy-700">{[A.zip, A.city].filter(Boolean).join(' ')}{A.country && A.country !== 'DE' ? `, ${A.country}` : ''}</p>
      <dl className="mt-1 text-xs text-navy-600">
        {p.vatId && <div><dt className="inline">{t.ustid}: </dt><dd className="inline">{p.vatId}</dd></div>}
        {p.taxNo && <div><dt className="inline">{t.stnr}: </dt><dd className="inline">{p.taxNo}</dd></div>}
        {p.legalId && <div><dt className="inline">{t.reg}: </dt><dd className="inline">{p.legalId}</dd></div>}
        {p.contact && (p.contact.name || p.contact.phone || p.contact.email) && <div><dt className="inline">{t.kontakt}: </dt><dd className="inline">{[p.contact.name, p.contact.phone, p.contact.email].filter(Boolean).join(' · ')}</dd></div>}
        {p.endpoint && <div><dt className="inline">{t.adresse}: </dt><dd className="inline break-all">{p.endpoint}{p.endpointScheme ? ` (${p.endpointScheme})` : ''}</dd></div>}
      </dl>
    </div>
  );
}

interface Props { inv: Invoice; lang: Lang; detected?: Detected; compact?: boolean }
const InvoiceView = forwardRef<HTMLDivElement, Props>(function InvoiceView({ inv, lang, detected, compact }, ref) {
  const t = L[lang], cur = inv.currency, T = inv.totals;
  const meta: Array<[string, string]> = [[t.nr, inv.number ?? ''], [t.datum, fmtDate(inv.issueDate, lang)]];
  if (inv.deliveryDate) meta.push([t.leistung, fmtDate(inv.deliveryDate, lang)]);
  if (inv.periodStart || inv.periodEnd) meta.push([t.zeitraum, `${fmtDate(inv.periodStart, lang)} – ${fmtDate(inv.periodEnd, lang)}`]);
  if (inv.dueDate) meta.push([t.faellig, fmtDate(inv.dueDate, lang)]);
  if (inv.buyerReference) meta.push([t.ref, inv.buyerReference]);
  if (inv.orderRef) meta.push([t.best, inv.orderRef]);
  if (inv.contractRef) meta.push([t.vertrag, inv.contractRef]);
  if (inv.precedingInvoice) meta.push([t.vor, inv.precedingInvoice]);
  const typ = TYPE_CODES[inv.typeCode ?? '']?.[ix(lang)] ?? (inv.kind === 'creditnote' ? (lang === 'de' ? 'Gutschrift' : 'Credit note') : (lang === 'de' ? 'Rechnung' : 'Invoice'));
  const sums: Array<[string, string, boolean?]> = [[t.summe, fmtMoney(T.lineNet, cur, lang)]];
  for (const a of inv.allowancesCharges) sums.push([`${a.charge ? t.zuschlag : t.abschlag}${a.reason ? `: ${a.reason}` : ''}`, `${a.charge ? '' : '−'}${fmtMoney(a.amount, cur, lang)}`]);
  sums.push([t.ohne, fmtMoney(T.taxExclusive, cur, lang)]);
  for (const v of inv.vat) sums.push([`${t.steuer} ${v.rate !== undefined ? `${fmtQty(v.rate, lang)}${lang === 'de' ? '\u00a0' : ''}%` : ''} ${v.cat !== 'S' ? `(${VAT_CATS[v.cat]?.[ix(lang)] ?? v.cat})` : ''}`.trim(), fmtMoney(v.amount, cur, lang)]);
  sums.push([t.mit, fmtMoney(T.taxInclusive, cur, lang), true]);
  if (T.prepaid) sums.push([t.vorab, `−${fmtMoney(T.prepaid, cur, lang)}`]);
  if (T.rounding) sums.push([t.rund, fmtMoney(T.rounding, cur, lang)]);
  sums.push([t.zahlbar, fmtMoney(T.payable, cur, lang), true]);
  const pm = inv.payment;
  const notes = [...inv.vat.filter((v) => v.exemptionReason).map((v) => `${t.befreiung}: ${v.exemptionReason}`), ...inv.notes];
  return (
    <div ref={ref} className="rechnung-druck rounded-xl border border-navy-200 bg-white p-4 text-navy-900 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <PartyBlock p={inv.seller} title={t.von} lang={lang} />
        <PartyBlock p={inv.buyer} title={t.an} lang={lang} />
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-navy-200 pt-4">
        <p className="text-2xl font-bold">{typ} {inv.number}</p>
        <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 text-sm">
          {meta.flatMap(([k, v]) => [<dt key={`k${k}`} className="text-navy-600">{k}</dt>, <dd key={`v${k}`} className="text-right font-medium tabular-nums">{v}</dd>])}
        </dl>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="journal w-full text-sm">
          <thead><tr><th scope="col" className="px-2 py-1.5 text-left">{t.pos}</th><th scope="col" className="px-2 py-1.5 text-left">{t.bez}</th><th scope="col" className="px-2 py-1.5 text-right">{t.menge}</th><th scope="col" className="px-2 py-1.5 text-right">{t.preis}</th><th scope="col" className="px-2 py-1.5 text-right">{t.ust}</th><th scope="col" className="px-2 py-1.5 text-right">{t.netto}</th></tr></thead>
          <tbody>
            {inv.lines.map((l, i) => (
              <tr key={i} className="border-b border-navy-100 align-top">
                <td className="px-2 py-1.5 text-navy-600">{l.id}</td>
                <td className="px-2 py-1.5"><span className="font-medium">{l.name}</span>{l.description && l.description !== l.name && <span className="block text-xs text-navy-600">{l.description}</span>}{l.note && <span className="block text-xs text-navy-500">{l.note}</span>}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{fmtQty(l.qty, lang)} {UNITS[l.unit]?.[ix(lang)] ?? l.unit}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{fmtMoney(l.price, cur, lang)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{l.vatRate !== undefined ? `${fmtQty(l.vatRate, lang)}${lang === 'de' ? '\u00a0' : ''}%` : ''} {l.vatCat !== 'S' ? l.vatCat : ''}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{fmtMoney(l.net, cur, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <table className="w-full max-w-sm text-sm"><tbody>
          {sums.map(([k, v, b], i) => <tr key={i} className={b ? 'border-t border-navy-300 font-bold' : ''}><td className="py-1 pe-3 text-navy-700">{k}</td><td className="py-1 text-right tabular-nums">{v}</td></tr>)}
        </tbody></table>
      </div>
      {(pm.meansCode || pm.iban || pm.terms) && (
        <div className="mt-5 border-t border-navy-200 pt-3 text-sm">
          <p className="font-semibold">{t.zahlung}{pm.meansCode ? `: ${PAYMENT_MEANS[pm.meansCode]?.[ix(lang)] ?? pm.meansCode}` : ''}</p>
          <p className="text-navy-700">{[pm.iban && `${t.bank} ${pm.iban}`, pm.bic && `${t.bic} ${pm.bic}`, pm.accountName && `${t.inhaber} ${pm.accountName}`, pm.remittance && `${t.verw} ${pm.remittance}`, pm.mandateRef && `${t.mandat} ${pm.mandateRef}`].filter(Boolean).join(' · ')}</p>
          {pm.terms && <p className="text-navy-700">{t.bed}: {pm.terms}</p>}
        </div>
      )}
      {notes.length > 0 && <div className="mt-4 text-sm"><p className="font-semibold">{t.hinweise}</p>{notes.map((n, i) => <p key={i} className="text-navy-700 whitespace-pre-line">{n.replace(/^#[A-Z]{3}#/, '')}</p>)}</div>}
      {inv.attachments.length > 0 && <div className="mt-4 text-sm"><p className="font-semibold">{t.anh}</p><ul className="list-disc ps-5 text-navy-700">{inv.attachments.map((a, i) => <li key={i}>{a.filename ?? a.id}{a.description ? ` – ${a.description}` : ''}{a.mime ? ` (${a.mime})` : ''}</li>)}</ul></div>}
      {!compact && (
        <details className="mt-4 border-t border-navy-200 pt-3 text-xs text-navy-600">
          <summary className="cursor-pointer font-semibold text-navy-700">{t.tech}</summary>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 break-all">
            <dt>{t.syntax}</dt><dd>{inv.syntax === 'UBL' ? 'UBL 2.1' : inv.syntax === 'CII' ? 'UN/CEFACT CII D16B' : '–'}</dd>
            {detected && <><dt>{t.standard}</dt><dd>{detected.standard}{detected.version ? ` ${detected.version}` : ''}</dd><dt>{t.profil}</dt><dd>{detected.profile ?? '–'}</dd></>}
            <dt>{t.spez}</dt><dd>{inv.customizationId ?? '–'}</dd>
            <dt>{t.prozess}</dt><dd>{inv.profileId ?? '–'}</dd>
          </dl>
        </details>
      )}
    </div>
  );
});
export default InvoiceView;
