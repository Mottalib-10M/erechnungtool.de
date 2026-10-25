/**
 * Die Entscheidungs-Werkzeuge der Seite (Pflicht, Fristen, Kleinunternehmer, Aufbewahrung …). Jede Zahl und
 * jedes Datum kommt aus params-2026.json über die reinen Funktionen von engine/regeln.ts. Eine Spec listet ihre
 * Felder (sichtbar zuerst, `adv` eingeklappt) und eine Funktion `run`, die die Ergebniskarte liefert.
 * Die Datei-Werkzeuge (Viewer, Prüfung, Ersteller, Leitweg-ID) sind eigene Komponenten in components/erech.
 */
import type { ToolSpec, V, ToolOut } from './tool-types';
import { resolve } from './tool-types';
import { formatMoney, formatNumber, displayDate, type Lang } from './format';
import * as R from './engine/regeln';
import { pruefeLeitweg } from './engine/leitweg';
import P from '../data/params-2026.json';

export type Args = Record<string, number | string>;
const T = (l: Lang, de: string, en: string) => (l === 'de' ? de : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const eur = (x: number, l: Lang) => formatMoney(x, 0, l);
const day = (iso: string, l: Lang) => displayDate(iso, l === 'de' ? 'de-DE' : 'en-GB');
const yn = (l: Lang) => [{ value: 'ja', label: T(l, 'Ja', 'Yes') }, { value: 'nein', label: T(l, 'Nein', 'No') }];
const PF = P.pflicht, AU = P.ausnahmen, KU = P.kleinunternehmer;
const ausnahmenZeile = (l: Lang): [string, string] => [T(l, 'Immer als Papier oder PDF erlaubt', 'Always allowed on paper or as PDF'), T(l, `Kleinbeträge bis ${eur(AU.kleinbetrag, l)}, Fahrausweise`, `Small amounts up to ${eur(AU.kleinbetrag, l)}, tickets`)];

/* ------------------------------------------------------------------ Pflicht-Check */
const kundenOpts = (l: Lang) => [
  { value: 'b2b', label: T(l, 'Unternehmen in Deutschland', 'Businesses in Germany') },
  { value: 'gemischt', label: T(l, 'Unternehmen und Privatkunden', 'Businesses and consumers') },
  { value: 'b2c', label: T(l, 'Nur Privatkunden', 'Consumers only') },
  { value: 'ausland', label: T(l, 'Nur Kunden im Ausland', 'Only customers abroad') },
];
function pflichtSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'kunden', label: T(l, 'Wem stellen Sie Rechnungen?', 'Who do you invoice?'), def: String(a?.kunden ?? 'b2b'), options: kundenOpts(l) },
      { id: 'umsatz', label: T(l, 'Gesamtumsatz 2026', 'Total turnover 2026'), def: Number(a?.umsatz ?? 400000), unit: '€', max: 5e7, help: T(l, 'Umsatz nach § 19 Abs. 2 UStG im Vorjahr der Leistung', 'Turnover under section 19(2) UStG in the year before the supply') },
      { kind: 'choice', id: 'klein', label: T(l, 'Kleinunternehmer (§ 19 UStG)?', 'Small business (section 19 UStG)?'), def: String(a?.klein ?? 'nein'), options: yn(l) },
      { kind: 'choice', id: 'frei', label: T(l, 'Nur steuerfreie Umsätze (§ 4 Nr. 8 bis 29 UStG)?', 'Only VAT-exempt supplies (section 4 nos. 8 to 29)?'), def: 'nein', options: yn(l), adv: true },
    ],
    run: (v) => {
      const r = R.pflicht({ vorjahr: n(v, 'umsatz'), klein: s(v, 'klein') === 'ja', kunden: s(v, 'kunden') as R.Kunden, steuerfrei: s(v, 'frei') === 'ja' });
      const grund: Record<R.Status, string> = {
        pflicht2027: T(l, `Gesamtumsatz 2026 über ${eur(PF.umsatzgrenze, l)}: für Leistungen ab 2027 an Unternehmen im Inland nur noch E-Rechnung (§ 27 Abs. 38 UStG).`, `2026 turnover above ${eur(PF.umsatzgrenze, l)}: from 2027, supplies to German businesses need an e-invoice (section 27(38) UStG).`),
        pflicht2028: T(l, `Gesamtumsatz 2026 bis ${eur(PF.umsatzgrenze, l)}: Papier und PDF bleiben 2027 erlaubt, die E-Rechnung wird zum 1. Januar 2028 Pflicht.`, `2026 turnover up to ${eur(PF.umsatzgrenze, l)}: paper and PDF remain allowed in 2027, e-invoices become mandatory on 1 January 2028.`),
        'keine-klein': T(l, 'Kleinunternehmer dürfen immer eine sonstige Rechnung ausstellen (§ 34a Satz 4 UStDV). Empfangen müssen Sie E-Rechnungen trotzdem.', 'Small businesses may always issue an ordinary invoice (section 34a sentence 4 UStDV). You must still be able to receive e-invoices.'),
        'keine-b2c': T(l, 'Rechnungen an Privatkunden fallen nicht unter die Pflicht. Für Ihre Eingangsrechnungen von Lieferanten gilt die Empfangspflicht.', 'Invoices to consumers are not covered. For the invoices your suppliers send you, the duty to receive applies.'),
        'keine-ausland': T(l, 'Die Pflicht gilt nur, wenn beide Seiten in Deutschland ansässig sind (§ 14 Abs. 2 Satz 2 Nr. 1 UStG).', 'The mandate only applies when both parties are established in Germany (section 14(2) sentence 2 no. 1 UStG).'),
        'keine-steuerfrei': T(l, 'Für steuerfreie Leistungen nach § 4 Nr. 8 bis 29 UStG gibt es keine E-Rechnungspflicht.', 'There is no e-invoicing duty for exempt supplies under section 4 nos. 8 to 29 UStG.'),
      };
      return {
        label: T(l, 'E-Rechnung ausstellen ab', 'Issue e-invoices from'),
        value: r.ausstellenAb ? day(r.ausstellenAb, l) : T(l, 'Keine Pflicht', 'Not required'),
        sub: grund[r.status],
        rows: [
          [T(l, 'E-Rechnungen empfangen können', 'Be able to receive e-invoices'), T(l, `Pflicht seit ${day(r.empfangAb, l)}`, `Required since ${day(r.empfangAb, l)}`)],
          [T(l, 'Papier oder PDF (mit Zustimmung) noch bis', 'Paper or PDF (with consent) until'), r.papierBis ? day(r.papierBis, l) : T(l, 'unbegrenzt', 'no end date')],
          [T(l, 'EDI-Verfahren ohne EN 16931 noch bis', 'EDI without EN 16931 until'), day(r.ediBis, l)],
          ausnahmenZeile(l),
        ],
        note: T(l, 'Grundlage: § 14 Abs. 1 und 2, § 27 Abs. 38 UStG; §§ 33, 34, 34a UStDV; BMF-Schreiben vom 15. Oktober 2025.', 'Basis: sections 14(1), 14(2) and 27(38) UStG; sections 33, 34, 34a UStDV; Finance Ministry letter of 15 October 2025.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Fristen : welche Rechnung für eine Leistung ? */
const formOpts = (l: Lang) => [
  { value: 'papier', label: T(l, 'Papierrechnung', 'Paper invoice') },
  { value: 'pdf', label: T(l, 'PDF ohne XML', 'PDF without XML') },
  { value: 'edi', label: T(l, 'EDI-Verfahren', 'EDI exchange') },
  { value: 'erechnung', label: T(l, 'E-Rechnung (XRechnung, ZUGFeRD)', 'E-invoice (XRechnung, ZUGFeRD)') },
];
const zText = (z: R.Zulaessig, l: Lang) => (z === 'ja' ? T(l, 'Zulässig', 'Allowed') : z === 'zustimmung' ? T(l, 'Nur mit Zustimmung des Kunden', 'Only with the customer’s consent') : T(l, 'Nicht mehr zulässig', 'No longer allowed'));
function fristenSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'jahr', label: T(l, 'Leistung erbracht im Jahr', 'Supply made in'), def: String(a?.jahr ?? '2027'), options: ['2025', '2026', '2027', '2028'].map((y) => ({ value: y, label: y === '2028' ? T(l, '2028 oder später', '2028 or later') : y })) },
      { kind: 'select', id: 'form', label: T(l, 'Geplante Rechnungsform', 'Planned invoice form'), def: String(a?.form ?? 'pdf'), options: formOpts(l) },
      { id: 'umsatz', label: T(l, 'Gesamtumsatz im Vorjahr der Leistung', 'Turnover in the year before the supply'), def: Number(a?.umsatz ?? 500000), unit: '€', max: 5e7 },
      { kind: 'select', id: 'art', label: T(l, 'Art der Rechnung', 'Type of invoice'), def: 'normal', adv: true, options: [
        { value: 'normal', label: T(l, 'Normale Rechnung an ein Unternehmen', 'Ordinary invoice to a business') },
        { value: 'kleinbetrag', label: T(l, `Kleinbetrag bis ${eur(AU.kleinbetrag, l)} brutto`, `Small amount up to ${eur(AU.kleinbetrag, l)} gross`) },
        { value: 'fahrausweis', label: T(l, 'Fahrausweis', 'Travel ticket') },
      ] },
    ],
    run: (v) => {
      const jahr = Number(s(v, 'jahr')), um = n(v, 'umsatz'), aus = s(v, 'art') !== 'normal';
      const r = R.formZulaessig(jahr, s(v, 'form') as R.Form, um, aus);
      const rows: Array<[string, string]> = ['2025', '2026', '2027', '2028'].map((y) => [y === '2028' ? T(l, 'ab 2028', '2028 on') : y, zText(R.formZulaessig(Number(y), s(v, 'form') as R.Form, um, aus).z, l)]);
      return {
        label: T(l, 'Diese Rechnungsform ist', 'This invoice form is'), value: zText(r.z, l),
        sub: r.bis ? T(l, `Übergangsregel bis ${day(r.bis, l)}.`, `Transitional rule until ${day(r.bis, l)}.`) : aus ? T(l, 'Ausnahme nach §§ 33, 34 UStDV: immer als sonstige Rechnung möglich.', 'Exception under sections 33, 34 UStDV: always possible as an ordinary invoice.') : r.z === 'nein' ? T(l, 'Ab hier verlangt § 14 Abs. 2 UStG die E-Rechnung.', 'From here, section 14(2) UStG requires the e-invoice.') : T(l, 'Eine E-Rechnung ist immer zulässig, auch ohne Zustimmung.', 'An e-invoice is always allowed, even without consent.'),
        rows,
        note: T(l, 'Maßgeblich ist das Jahr der Leistung, nicht das Rechnungsdatum (§ 27 Abs. 38 UStG). Zustimmung kann stillschweigend erteilt werden (BMF-Schreiben vom 15. Oktober 2025, Rn. 22).', 'What counts is the year of the supply, not the invoice date (section 27(38) UStG). Consent can be given implicitly (Finance Ministry letter of 15 October 2025, para. 22).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Kleinunternehmer */
function kleinSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'vorjahr', label: T(l, 'Umsatz im Vorjahr', 'Turnover last year'), def: Number(a?.vorjahr ?? 18000), unit: '€', max: 5e7 },
      { id: 'laufend', label: T(l, 'Umsatz im laufenden Jahr (erwartet)', 'Turnover this year (expected)'), def: Number(a?.laufend ?? 30000), unit: '€', max: 5e7 },
      { kind: 'choice', id: 'kunden', label: T(l, 'Kunden', 'Customers'), def: 'b2b', options: [{ value: 'b2b', label: T(l, 'Auch Firmen', 'Incl. businesses') }, { value: 'b2c', label: T(l, 'Nur privat', 'Consumers only') }] },
    ],
    run: (v) => {
      const k = R.kleinunternehmer(n(v, 'vorjahr'), n(v, 'laufend'));
      const p = R.pflicht({ vorjahr: n(v, 'vorjahr'), klein: k.klein, kunden: s(v, 'kunden') === 'b2c' ? 'b2c' : 'b2b', steuerfrei: false });
      return {
        label: T(l, 'Kleinunternehmerregelung', 'Small-business scheme'),
        value: k.klein ? T(l, 'Möglich', 'Available') : T(l, 'Nicht möglich', 'Not available'),
        sub: k.klein ? T(l, `Vorjahr bis ${eur(KU.vorjahr, l)} und laufendes Jahr bis ${eur(KU.laufend, l)}: Sie müssen keine E-Rechnung ausstellen (§ 34a Satz 4 UStDV).`, `Last year up to ${eur(KU.vorjahr, l)} and this year up to ${eur(KU.laufend, l)}: you need not issue e-invoices (section 34a sentence 4 UStDV).`)
          : k.grund === 'vorjahr' ? T(l, `Vorjahr über ${eur(KU.vorjahr, l)}: Regelbesteuerung, damit gelten die Fristen der E-Rechnung.`, `Last year above ${eur(KU.vorjahr, l)}: standard VAT, so the e-invoice deadlines apply.`)
          : T(l, `Laufendes Jahr über ${eur(KU.laufend, l)}: ab dem Umsatz, mit dem die Grenze überschritten wird, gilt die Regelbesteuerung.`, `This year above ${eur(KU.laufend, l)}: standard VAT applies from the supply that crosses the threshold.`),
        rows: [
          [T(l, 'E-Rechnungen empfangen', 'Receive e-invoices'), T(l, `Pflicht seit ${day(PF.empfangAb, l)}`, `Required since ${day(PF.empfangAb, l)}`)],
          [T(l, 'E-Rechnung ausstellen', 'Issue e-invoices'), p.ausstellenAb ? T(l, `ab ${day(p.ausstellenAb, l)}`, `from ${day(p.ausstellenAb, l)}`) : T(l, 'freiwillig', 'voluntary')],
          [T(l, 'Hinweis auf der Rechnung', 'Note on the invoice'), k.klein ? T(l, 'Steuerbefreiung nach § 19 UStG', 'Exemption under section 19 UStG') : T(l, 'Umsatzsteuer ausweisen', 'Show the VAT')],
          [T(l, 'Postfach für den Empfang', 'Inbox for receiving'), T(l, 'Ein E-Mail-Postfach genügt', 'An email inbox is enough')],
        ],
        note: T(l, 'Grundlage: § 19 Abs. 1 UStG in der Fassung ab 2025, § 34a UStDV, BMF-FAQ zur E-Rechnung.', 'Basis: section 19(1) UStG as in force from 2025, section 34a UStDV, Finance Ministry FAQ.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Aufbewahrung */
function archivSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'jahr', label: T(l, 'Rechnung ausgestellt im Jahr', 'Invoice issued in'), def: Number(a?.jahr ?? 2025), max: 2100, decimals: 0 },
      { kind: 'select', id: 'beleg', label: T(l, 'Unterlage', 'Document'), def: String(a?.beleg ?? 'rechnung'), options: [
        { value: 'rechnung', label: T(l, 'Rechnung, Buchungsbeleg', 'Invoice, accounting voucher') },
        { value: 'handelsbrief', label: T(l, 'Handels- oder Geschäftsbrief', 'Business letter') },
        { value: 'buecher', label: T(l, 'Bücher, Jahresabschluss', 'Books, annual accounts') },
      ] },
      { kind: 'choice', id: 'hybrid', label: T(l, 'ZUGFeRD-PDF mit Buchungsvermerk?', 'ZUGFeRD PDF with posting notes?'), def: 'nein', options: yn(l), adv: true },
    ],
    run: (v) => {
      const jahr = Math.max(2000, Math.round(n(v, 'jahr')));
      const r = R.aufbewahrenBis(jahr, s(v, 'beleg') as R.Beleg);
      return {
        label: T(l, 'Aufbewahren bis', 'Keep until'), value: day(r.bis, l),
        sub: T(l, `${r.jahre} Jahre ab Ende des Jahres ${jahr}; löschen frühestens am ${day(r.vernichtenAb, l)}.`, `${r.jahre} years from the end of ${jahr}; delete no earlier than ${day(r.vernichtenAb, l)}.`),
        rows: [
          [T(l, 'Was aufbewahren', 'What to keep'), T(l, 'Die XML-Datei im Originalformat', 'The XML file in its original format')],
          [T(l, 'PDF-Teil einer ZUGFeRD-Rechnung', 'PDF part of a ZUGFeRD invoice'), s(v, 'hybrid') === 'ja' ? T(l, 'Auch aufbewahren (Buchungsvermerke)', 'Keep it too (posting notes)') : T(l, 'Nur bei steuerlich wichtigen Zusätzen', 'Only if it adds tax-relevant information')],
          [T(l, 'Umwandeln, etwa in TIFF', 'Converting, e.g. to TIFF'), T(l, 'Die XML darf nicht verloren gehen', 'The XML must not be lost')],
          [T(l, 'Auswertbar halten', 'Keep machine-readable'), T(l, 'Ja, für die Betriebsprüfung', 'Yes, for tax audits')],
        ],
        note: T(l, 'Grundlage: § 14b Abs. 1 UStG, § 147 Abs. 3 AO, GoBD in der Fassung des BMF-Schreibens vom 14. Juli 2025 (Rn. 119, 125, 131). Die Frist läuft nicht ab, solange sie für eine noch offene Steuerfestsetzung gebraucht wird (§ 147 Abs. 3 Satz 5 AO).', 'Basis: section 14b(1) UStG, section 147(3) AO, GoBD as amended by the Finance Ministry letter of 14 July 2025 (paras 119, 125, 131). The period does not end while the records are needed for an open tax assessment (section 147(3) sentence 5 AO).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Folgen */
function folgenSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'choice', id: 'pflicht', label: T(l, 'War eine E-Rechnung Pflicht?', 'Was an e-invoice required?'), def: String(a?.pflicht ?? 'ja'), options: yn(l) },
      { kind: 'select', id: 'form', label: T(l, 'Was wurde ausgestellt?', 'What was issued?'), def: String(a?.form ?? 'pdf'), options: [
        { value: 'erechnung', label: T(l, 'Korrekte E-Rechnung', 'Correct e-invoice') },
        { value: 'regel', label: T(l, 'E-Rechnung, Prüfung meldet Fehler (z. B. BT-10)', 'E-invoice, check reports errors (e.g. BT-10)') },
        { value: 'format', label: T(l, 'XML mit Formatfehler', 'XML with format errors') },
        { value: 'pdf', label: T(l, 'PDF oder Papier', 'PDF or paper') },
        { value: 'keine', label: T(l, 'Gar keine Rechnung', 'No invoice at all') },
      ] },
      { kind: 'choice', id: 'inhalt', label: T(l, 'Pflichtangaben vollständig und richtig?', 'Mandatory details complete and correct?'), def: 'ja', options: yn(l) },
    ],
    run: (v) => {
      const pf = s(v, 'pflicht') === 'ja', form = s(v, 'form'), ok = s(v, 'inhalt') === 'ja';
      let risk: 'keins' | 'gering' | 'hoch';
      let sub: string;
      if (form === 'keine') { risk = 'hoch'; sub = T(l, `Keine Rechnung: Ordnungswidrigkeit nach § 26a Abs. 2 Nr. 1 UStG, Geldbuße bis ${eur(P.bussgeld.rechnungHoechst, l)}; der Kunde hat keinen Beleg für den Vorsteuerabzug.`, `No invoice: an administrative offence under section 26a(2) no. 1 UStG, fine up to ${eur(P.bussgeld.rechnungHoechst, l)}; the customer has no basis for input VAT.`); }
      else if (!ok) { risk = 'hoch'; sub = T(l, 'Inhaltsfehler bei den Pflichtangaben (§ 14 Abs. 4 UStG): die Rechnung ist nicht ordnungsgemäß, gleich in welchem Format. Berichtigen.', 'Content errors in the mandatory details (section 14(4) UStG): the invoice is not proper, whatever the format. Correct it.'); }
      else if (!pf || form === 'erechnung' || form === 'regel') { risk = 'keins'; sub = form === 'regel' ? T(l, 'Fehler bei Geschäftsregeln ohne Bezug zu den Pflichtangaben (etwa die fehlende Käuferreferenz BT-10) sind umsatzsteuerlich unbeachtlich (BMF, Rn. 35a).', 'Business-rule errors unrelated to the mandatory details (such as a missing buyer reference BT-10) do not matter for VAT (Finance Ministry, para. 35a).') : T(l, 'Kein umsatzsteuerliches Risiko aus der Form der Rechnung.', 'No VAT risk from the form of the invoice.'); }
      else { risk = 'gering'; sub = T(l, 'Statt der Pflicht-E-Rechnung kam eine sonstige Rechnung: dem Grunde nach kein Vorsteuerabzug, bei richtigem Inhalt aber regelmäßig doch (Abschnitt 15.2a Abs. 1a Satz 12 und 13 UStAE). Besser: E-Rechnung nachreichen.', 'An ordinary invoice instead of the required e-invoice: in principle no input VAT, but with correct content usually still allowed (UStAE section 15.2a(1a) sentences 12 and 13). Better: send an e-invoice as correction.'); }
      const lab = { keins: T(l, 'Kein Risiko', 'No risk'), gering: T(l, 'Gering, aber vermeidbar', 'Low but avoidable'), hoch: T(l, 'Hoch', 'High') }[risk];
      return {
        label: T(l, 'Risiko für den Vorsteuerabzug Ihres Kunden', 'Risk to your customer’s input VAT'), value: lab, sub,
        rows: [
          [T(l, 'Gilt als E-Rechnung', 'Counts as an e-invoice'), form === 'erechnung' || form === 'regel' ? T(l, 'Ja', 'Yes') : T(l, 'Nein', 'No')],
          [T(l, 'Eigenes Bußgeld für fehlende E-Rechnung', 'Specific fine for a missing e-invoice'), T(l, 'Keins im UStG', 'None in the VAT Act')],
          [T(l, 'Bußgeld § 26a UStG', 'Fine under section 26a UStG'), form === 'keine' ? T(l, `bis ${eur(P.bussgeld.rechnungHoechst, l)}`, `up to ${eur(P.bussgeld.rechnungHoechst, l)}`) : T(l, 'Nicht einschlägig', 'Not applicable')],
          [T(l, 'Berichtigung', 'Correction'), risk === 'keins' ? T(l, 'Nicht nötig', 'Not needed') : T(l, 'E-Rechnung ausstellen, die die alte berichtigt', 'Issue an e-invoice that corrects the old one')],
        ],
        note: T(l, 'Grundlage: § 26a Abs. 2 und 3 UStG; BMF-Schreiben vom 15. Oktober 2025, Rn. 6a, 6b und 35a, Abschnitt 15.2a UStAE.', 'Basis: section 26a(2) and (3) UStG; Finance Ministry letter of 15 October 2025, paras 6a, 6b and 35a, UStAE section 15.2a.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Fehlerarten (BMF) */
function fehlerSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'art', label: T(l, 'Was meldet die Prüfung?', 'What does the check report?'), def: String(a?.art ?? 'geschaeftsregel-sonst'), options: [
        { value: 'keiner', label: T(l, 'Keinen Fehler', 'No error') },
        { value: 'format', label: T(l, 'Schema- oder Formatfehler (XML nicht lesbar)', 'Schema or format error (XML unreadable)') },
        { value: 'geschaeftsregel-inhalt', label: T(l, 'Regelverstoß bei einer Pflichtangabe (z. B. Steuerbetrag)', 'Rule breach on a mandatory detail (e.g. VAT amount)') },
        { value: 'geschaeftsregel-sonst', label: T(l, 'Regelverstoß ohne Steuerbezug (z. B. BT-10 fehlt)', 'Rule breach without VAT relevance (e.g. BT-10 missing)') },
        { value: 'inhalt-unerkannt', label: T(l, 'Kein Fehler, aber falscher Steuersatz', 'No error, but wrong VAT rate') },
      ] },
    ],
    run: (v) => {
      const art = s(v, 'art') as R.Fehler, r = R.fehlerFolge(art);
      const rn = { format: '6a', 'geschaeftsregel-inhalt': '6b, 35a', 'geschaeftsregel-sonst': '35a', 'inhalt-unerkannt': '35a', keiner: '35a' }[art];
      return {
        label: T(l, 'Umsatzsteuerlich ist die Datei', 'For VAT purposes the file is'),
        value: !r.erechnung ? T(l, 'Keine E-Rechnung', 'Not an e-invoice') : r.ordnungsgemaess ? T(l, 'Ordnungsgemäß', 'Proper') : T(l, 'Nicht ordnungsgemäß', 'Not proper'),
        sub: !r.erechnung ? T(l, 'Mit Formatfehlern ist die Datei nur eine sonstige Rechnung in einem anderen elektronischen Format.', 'With format errors the file is only an ordinary invoice in another electronic format.') : r.ordnungsgemaess ? T(l, 'Ein Verstoß gegen eine Geschäftsregel ohne Bezug zu §§ 14 Abs. 4, 14a UStG schadet nicht.', 'A business-rule breach unrelated to sections 14(4) and 14a UStG does no harm.') : T(l, 'Ein Inhaltsfehler bei den Pflichtangaben macht die Rechnung fehlerhaft, auch wenn das Format stimmt.', 'A content error in the mandatory details makes the invoice defective, even if the format is right.'),
        rows: [
          [T(l, 'Fundstelle im BMF-Schreiben', 'Paragraph in the ministry letter'), `Rn. ${rn}`],
          [T(l, 'Rechnung berichtigen', 'Correct the invoice'), r.berichtigen ? T(l, 'Ja', 'Yes') : T(l, 'Nein', 'No')],
          [T(l, 'Prüfbericht aufbewahren', 'Keep the validation report'), T(l, 'Empfohlen', 'Recommended')],
        ],
        note: T(l, 'Eine Validierung ersetzt nicht die Prüfung der Rechnung auf Richtigkeit, sie unterstützt sie (BMF-Schreiben vom 15. Oktober 2025, Rn. 35a).', 'Validation does not replace checking the invoice for correctness; it supports it (Finance Ministry letter of 15 October 2025, para. 35a).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Ist das eine E-Rechnung ? */
const dateiOpts = (l: Lang) => [
  { value: 'pdf', label: T(l, 'PDF aus Word oder Buchhaltung', 'PDF from Word or accounting software') },
  { value: 'papier', label: T(l, 'Papierrechnung', 'Paper invoice') },
  { value: 'scan', label: T(l, 'Gescannte Rechnung, Foto', 'Scanned invoice, photo') },
  { value: 'word', label: T(l, 'Word- oder Excel-Datei', 'Word or Excel file') },
  { value: 'xrechnung', label: 'XRechnung (XML)' },
  { value: 'zugferd-en16931', label: 'ZUGFeRD EN 16931 (COMFORT)' },
  { value: 'zugferd-extended', label: 'ZUGFeRD EXTENDED' },
  { value: 'zugferd-basic', label: 'ZUGFeRD BASIC' },
  { value: 'zugferd-basicwl', label: 'ZUGFeRD BASIC WL' },
  { value: 'zugferd-minimum', label: 'ZUGFeRD MINIMUM' },
  { value: 'zugferd1', label: 'ZUGFeRD 1.0' },
  { value: 'edi', label: T(l, 'EDI-Nachricht (z. B. EDIFACT)', 'EDI message (e.g. EDIFACT)') },
];
function istesSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [{ kind: 'select', id: 'datei', label: T(l, 'Was haben Sie bekommen oder verschickt?', 'What did you receive or send?'), def: String(a?.datei ?? 'pdf'), options: dateiOpts(l), wide: true }],
    run: (v) => {
      const d = s(v, 'datei') as R.Datei, r = R.istERechnung(d);
      const why: Record<string, string> = {
        pdf: T(l, 'Eine PDF ohne eingebettete XML ist ein Bild der Rechnung, keine strukturierte Datei.', 'A PDF without embedded XML is a picture of the invoice, not structured data.'),
        papier: T(l, 'Papier ist eine sonstige Rechnung.', 'Paper is an ordinary invoice.'), scan: T(l, 'Ein Scan bleibt ein Bild, auch mit Texterkennung.', 'A scan stays a picture, even with text recognition.'),
        word: T(l, 'Office-Dateien sind nicht strukturiert nach EN 16931.', 'Office files are not structured to EN 16931.'),
        xrechnung: T(l, 'XRechnung ist die deutsche Ausprägung der EN 16931.', 'XRechnung is the German specification of EN 16931.'),
        'zugferd-en16931': T(l, 'Ab Version 2.0.1 erfüllt das Profil EN 16931 die Norm.', 'From version 2.0.1 the EN 16931 profile meets the standard.'),
        'zugferd-extended': T(l, 'EXTENDED enthält alle Angaben der Norm und mehr.', 'EXTENDED holds everything the standard requires and more.'),
        'zugferd-basic': T(l, 'BASIC enthält die Pflichtangaben der Norm auf Positionsebene.', 'BASIC carries the mandatory details down to line level.'),
        'zugferd-basicwl': T(l, 'BASIC WL hat keine Positionen und erfüllt die Norm nicht.', 'BASIC WL has no line items and does not meet the standard.'),
        'zugferd-minimum': T(l, 'MINIMUM enthält nur Kopfdaten und erfüllt die Norm nicht.', 'MINIMUM only holds header data and does not meet the standard.'),
        zugferd1: T(l, 'ZUGFeRD 1.0 ist älter als die Norm und kein zugelassenes Format.', 'ZUGFeRD 1.0 predates the standard and is not an accepted format.'),
        edi: T(l, 'EDI ist bis Ende 2027 mit Zustimmung erlaubt, danach nur, wenn die Angaben EN-16931-konform herauslesbar sind.', 'EDI is allowed with consent until the end of 2027, afterwards only if the data can be extracted in line with EN 16931.'),
      };
      return {
        label: T(l, 'E-Rechnung im Sinne von § 14 UStG?', 'E-invoice under section 14 UStG?'),
        value: r === 'ja' ? T(l, 'Ja', 'Yes') : r === 'edi' ? T(l, 'Übergangsweise', 'For now') : T(l, 'Nein', 'No'),
        sub: why[d],
        rows: [
          [T(l, 'Darf ab 2027/2028 für Inlandsumsätze an Firmen genutzt werden', 'Usable for domestic B2B from 2027/2028'), r === 'ja' ? T(l, 'Ja', 'Yes') : r === 'edi' ? T(l, 'Nur EN-16931-tauglich', 'Only if EN 16931 compatible') : T(l, 'Nein', 'No')],
          [T(l, 'Empfang seit 2025', 'Receipt since 2025'), r === 'ja' ? T(l, 'Muss angenommen werden', 'Must be accepted') : T(l, 'Nur mit Ihrer Zustimmung', 'Only with your consent')],
          [T(l, 'Zum Lesen', 'To read it'), r === 'ja' ? T(l, 'Viewer nötig, die XML ist für Menschen schwer lesbar', 'A viewer helps; raw XML is hard to read') : T(l, 'Normales Programm', 'Ordinary software')],
        ],
        note: T(l, 'Grundlage: § 14 Abs. 1 Satz 3 bis 6 UStG; BMF-FAQ zur E-Rechnung (zulässige Formate).', 'Basis: section 14(1) sentences 3 to 6 UStG; Finance Ministry FAQ (accepted formats).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ ZUGFeRD : Version und Profil */
function zfSpec(l: Lang, a?: Args): ToolSpec {
  const versions = ['1.0', '2.0', '2.0.1', '2.1.1', '2.2', '2.3', '2.4', '2.5'];
  return {
    inputs: [
      { kind: 'select', id: 'version', label: T(l, 'ZUGFeRD-Version', 'ZUGFeRD version'), def: String(a?.version ?? '2.3'), options: versions.map((x) => ({ value: x, label: x === '2.5' ? `2.5 (${P.standards.zugferd})` : x })) },
      { kind: 'select', id: 'profil', label: T(l, 'Profil', 'Profile'), def: String(a?.profil ?? 'EN16931'), options: ['MINIMUM', 'BASICWL', 'BASIC', 'EN16931', 'EXTENDED', 'XRECHNUNG'].map((x) => ({ value: x, label: x === 'EN16931' ? 'EN 16931 (COMFORT)' : x === 'BASICWL' ? 'BASIC WL' : x })) },
    ],
    run: (v) => {
      const ver = s(v, 'version'), prof = s(v, 'profil');
      const altOk = !['1.0', '2.0'].includes(ver);
      const profOk = ['BASIC', 'EN16931', 'EXTENDED', 'XRECHNUNG'].includes(prof);
      const xrOk = prof === 'XRECHNUNG' && !['1.0', '2.0', '2.0.1', '2.1.1'].includes(ver);
      const ok = altOk && profOk && (prof !== 'XRECHNUNG' || xrOk);
      return {
        label: T(l, 'Als E-Rechnung zwischen Unternehmen', 'As an e-invoice between businesses'), value: ok ? T(l, 'Zulässig', 'Accepted') : T(l, 'Nicht zulässig', 'Not accepted'),
        sub: !altOk ? T(l, `Erst ab ZUGFeRD ${P.standards.zugferdMindest} erfüllt das Format die EN 16931.`, `Only from ZUGFeRD ${P.standards.zugferdMindest} does the format meet EN 16931.`) : !profOk ? T(l, 'Die Profile MINIMUM und BASIC WL enthalten nicht alle Pflichtangaben; sie gelten nicht als E-Rechnung.', 'The MINIMUM and BASIC WL profiles lack mandatory details and do not count as e-invoices.') : prof === 'XRECHNUNG' && !xrOk ? T(l, 'Das Profil XRECHNUNG gibt es erst seit ZUGFeRD 2.2.', 'The XRECHNUNG profile only exists since ZUGFeRD 2.2.') : T(l, 'Version und Profil erfüllen die Anforderungen des BMF.', 'Version and profile meet the Finance Ministry’s requirements.'),
        rows: [
          [T(l, 'An Stellen des Bundes', 'To federal bodies'), prof === 'XRECHNUNG' && xrOk ? T(l, 'Ja, als reine XML ohne PDF', 'Yes, as plain XML without PDF') : T(l, 'Besser XRechnung', 'Use XRechnung instead')],
          [T(l, 'Name der XML im PDF', 'Name of the XML inside the PDF'), prof === 'XRECHNUNG' ? 'xrechnung.xml' : ver === '1.0' ? 'ZUGFeRD-invoice.xml' : ver === '2.0' || ver === '2.0.1' ? 'zugferd-invoice.xml' : 'factur-x.xml'],
          [T(l, 'Aktuelle Version', 'Current version'), `${P.standards.zugferd} (${day(P.standards.zugferdStand, l)})`],
        ],
        note: T(l, 'Grundlage: BMF-FAQ (ZUGFeRD ab 2.0.1 außer MINIMUM und BASIC WL), FAQ von E-Rechnung Bund (Profil XRECHNUNG nur als XML).', 'Basis: Finance Ministry FAQ (ZUGFeRD from 2.0.1 except MINIMUM and BASIC WL), E-Rechnung Bund FAQ (XRECHNUNG profile as XML only).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ XRechnung oder ZUGFeRD ? */
function wahlSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'empf', label: T(l, 'Empfänger der Rechnung', 'Who receives the invoice'), def: String(a?.empf ?? 'firma'), options: [
        { value: 'bund', label: T(l, 'Bundesbehörde', 'Federal authority') }, { value: 'land', label: T(l, 'Land oder Kommune', 'State or municipality') },
        { value: 'firma', label: T(l, 'Unternehmen in Deutschland', 'Business in Germany') }, { value: 'ausland', label: T(l, 'Unternehmen in der EU (Peppol)', 'Business in the EU (Peppol)') },
      ] },
      { kind: 'choice', id: 'mensch', label: T(l, 'Liest ein Mensch die Rechnung ohne Software?', 'Will a person read it without software?'), def: 'ja', options: yn(l) },
    ],
    run: (v) => {
      const e = s(v, 'empf'), m = s(v, 'mensch') === 'ja';
      const rec = e === 'bund' ? 'XRechnung (UBL)' : e === 'land' ? 'XRechnung' : e === 'ausland' ? 'Peppol BIS (UBL)' : m ? 'ZUGFeRD EN 16931' : T(l, 'XRechnung oder ZUGFeRD', 'XRechnung or ZUGFeRD');
      return {
        label: T(l, 'Empfohlenes Format', 'Recommended format'), value: rec,
        sub: e === 'bund' ? T(l, 'Der Bund verlangt grundsätzlich XRechnung; ZUGFeRD nur im Profil XRECHNUNG als reine XML (§ 4 ERechV, FAQ E-Rechnung Bund).', 'The federal government requires XRechnung; ZUGFeRD only in the XRECHNUNG profile as plain XML (section 4 ERechV, E-Rechnung Bund FAQ).')
          : e === 'land' ? T(l, 'Länder und Kommunen haben eigene Verordnungen und verlangen fast immer XRechnung mit Leitweg-ID; fragen Sie die Leitweg-ID beim Auftraggeber an.', 'States and municipalities have their own rules and almost always ask for XRechnung with a Leitweg-ID; ask the contracting body for it.')
          : e === 'ausland' ? T(l, 'Die Pflicht gilt nur im Inland; für EU-Kunden ist Peppol BIS verbreitet, beide beruhen auf der EN 16931.', 'The mandate only covers domestic supplies; for EU customers Peppol BIS is common, both are based on EN 16931.')
          : m ? T(l, 'ZUGFeRD verbindet eine lesbare PDF mit der XML: der Kunde kann sie öffnen wie bisher, seine Software liest die Daten.', 'ZUGFeRD combines a readable PDF with the XML: the customer opens it as before, their software reads the data.') : T(l, 'Beide sind gleichwertige E-Rechnungen; entscheidend ist, was die Software Ihres Kunden einliest.', 'Both are equivalent e-invoices; what matters is what your customer’s software imports.'),
        rows: [
          [T(l, 'Leitweg-ID nötig', 'Leitweg-ID needed'), e === 'bund' || e === 'land' ? T(l, 'Ja, in BT-10', 'Yes, in BT-10') : T(l, 'Nein', 'No')],
          [T(l, 'Sichtbare PDF dabei', 'Readable PDF included'), rec.startsWith('ZUGFeRD') ? T(l, 'Ja', 'Yes') : T(l, 'Nein, Viewer nötig', 'No, a viewer is needed')],
          [T(l, 'Versand', 'Delivery'), e === 'bund' ? T(l, 'Portal des Bundes: Upload, Weberfassung, Peppol, E-Mail', 'Federal portal: upload, web form, Peppol, email') : T(l, 'E-Mail genügt', 'Email is enough')],
        ],
        note: T(l, 'XRechnung und ZUGFeRD ab 2.0.1 (außer MINIMUM und BASIC WL) sind beide E-Rechnungen im Sinne des UStG.', 'XRechnung and ZUGFeRD from 2.0.1 (except MINIMUM and BASIC WL) are both e-invoices under the VAT Act.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Pflichtfelder */
type Feld = [string, string, string, string];
function felderSpec(l: Lang, a?: Args): ToolSpec {
  const xr = Number(a?.xr ?? 0) === 1;
  return {
    inputs: [
      { kind: 'select', id: 'steuer', label: T(l, 'Besteuerung', 'VAT situation'), def: 'regel', options: [
        { value: 'regel', label: T(l, 'Mit Umsatzsteuer (19 % oder 7 %)', 'With VAT (19% or 7%)') }, { value: 'klein', label: T(l, 'Kleinunternehmer (§ 19 UStG)', 'Small business (section 19)') },
        { value: 'rc', label: T(l, 'Reverse Charge (§ 13b UStG)', 'Reverse charge (section 13b)') },
      ] },
      { kind: 'choice', id: 'empf', label: T(l, 'Empfänger', 'Recipient'), def: xr ? 'behoerde' : 'firma', options: [{ value: 'firma', label: T(l, 'Firma', 'Business') }, { value: 'behoerde', label: T(l, 'Behörde', 'Authority') }] },
    ],
    run: (v) => {
      const st = s(v, 'steuer'), beh = s(v, 'empf') === 'behoerde';
      const F: Feld[] = [
        ['BT-1', T(l, 'Rechnungsnummer', 'Invoice number'), 'EN 16931', T(l, '§ 14 Abs. 4 Nr. 4 UStG', 'section 14(4) no. 4')],
        ['BT-2', T(l, 'Rechnungsdatum', 'Issue date'), 'EN 16931', T(l, '§ 14 Abs. 4 Nr. 3 UStG', 'section 14(4) no. 3')],
        ['BT-3', T(l, 'Rechnungsart', 'Invoice type'), 'EN 16931', ''],
        ['BT-5', T(l, 'Währung', 'Currency'), 'EN 16931', ''],
        ['BT-27', T(l, 'Name des Verkäufers', 'Seller name'), 'EN 16931', T(l, '§ 14 Abs. 4 Nr. 1 UStG', 'section 14(4) no. 1')],
        ['BG-5', T(l, 'Anschrift des Verkäufers', 'Seller address'), 'EN 16931', T(l, '§ 14 Abs. 4 Nr. 1 UStG', 'section 14(4) no. 1')],
        ['BT-31/32', T(l, 'USt-IdNr. oder Steuernummer', 'VAT ID or tax number'), st === 'regel' ? 'BR-S-02' : 'BR-DE-16', T(l, '§ 14 Abs. 4 Nr. 2 UStG', 'section 14(4) no. 2')],
        ['BT-44', T(l, 'Name des Käufers', 'Buyer name'), 'EN 16931', T(l, '§ 14 Abs. 4 Nr. 1 UStG', 'section 14(4) no. 1')],
        ['BG-8', T(l, 'Anschrift des Käufers', 'Buyer address'), 'EN 16931', T(l, '§ 14 Abs. 4 Nr. 1 UStG', 'section 14(4) no. 1')],
        ['BT-72', T(l, 'Liefer- oder Leistungsdatum', 'Delivery date'), T(l, 'national', 'national'), T(l, '§ 14 Abs. 4 Nr. 6 UStG', 'section 14(4) no. 6')],
        ['BG-25', T(l, 'Positionen: Menge, Einheit, Bezeichnung, Preis', 'Lines: quantity, unit, description, price'), 'EN 16931', T(l, '§ 14 Abs. 4 Nr. 5 UStG', 'section 14(4) no. 5')],
        ['BG-23', T(l, 'Steueraufschlüsselung je Satz', 'VAT breakdown per rate'), 'EN 16931', T(l, '§ 14 Abs. 4 Nr. 7 und 8 UStG', 'section 14(4) nos. 7 and 8')],
        ['BT-109/112/115', T(l, 'Summen netto, brutto, fällig', 'Totals net, gross, due'), 'EN 16931', ''],
      ];
      if (st !== 'regel') F.push(['BT-120', T(l, 'Befreiungsgrund', 'Exemption reason'), `BR-${st === 'klein' ? 'E' : 'AE'}-10`, st === 'klein' ? T(l, '§ 34a UStDV', 'section 34a UStDV') : T(l, '§ 14a Abs. 5 UStG', 'section 14a(5)')]);
      if (st === 'rc') F.push(['BT-48', T(l, 'USt-IdNr. des Käufers', 'Buyer VAT ID'), 'BR-AE-02', '']);
      if (xr || beh) {
        F.push(['BT-10', beh ? T(l, 'Leitweg-ID', 'Leitweg-ID') : T(l, 'Käuferreferenz', 'Buyer reference'), 'BR-DE-15', beh ? T(l, '§ 5 ERechV', 'section 5 ERechV') : '']);
        F.push(['BG-6', T(l, 'Kontakt des Verkäufers: Name, Telefon, E-Mail', 'Seller contact: name, phone, email'), 'BR-DE-2 bis 7', beh ? T(l, '§ 5 ERechV', 'section 5 ERechV') : '']);
        F.push(['BT-34/49', T(l, 'Elektronische Adressen beider Seiten', 'Electronic addresses of both parties'), 'PEPPOL R010/R020', '']);
        F.push(['BG-16', T(l, 'Zahlungsanweisungen, z. B. IBAN', 'Payment instructions, e.g. IBAN'), 'BR-DE-1', beh ? T(l, '§ 5 ERechV', 'section 5 ERechV') : '']);
      }
      return {
        label: T(l, 'Pflichtfelder für Ihren Fall', 'Mandatory fields for your case'), value: String(F.length),
        sub: xr || beh ? T(l, 'XRechnung: EN 16931 plus die nationalen Regeln BR-DE der KoSIT.', 'XRechnung: EN 16931 plus the national BR-DE rules of KoSIT.') : T(l, 'EN 16931 und die Pflichtangaben nach § 14 Abs. 4 UStG.', 'EN 16931 and the mandatory details under section 14(4) UStG.'),
        rows: [[T(l, 'Davon aus dem UStG', 'Of which from the VAT Act'), String(F.filter((f) => f[3]).length)], [T(l, 'Davon nur technisch (Norm, KoSIT)', 'Of which technical only (standard, KoSIT)'), String(F.filter((f) => !f[3]).length)]],
        table: { headers: ['BT/BG', T(l, 'Angabe', 'Field'), T(l, 'Regel', 'Rule'), T(l, 'Gesetz', 'Law')], rows: F.map((f) => [...f]) },
      };
    },
  };
}

/* ------------------------------------------------------------------ Empfang */
function empfangSpec(l: Lang): ToolSpec {
  const qs: Array<[string, string, string]> = [
    ['postfach', T(l, 'Postfach oder Adresse für Rechnungen?', 'An inbox or address for invoices?'), T(l, 'Eigene Adresse wie rechnung@ einrichten', 'Set up an address such as invoices@')],
    ['lesen', T(l, 'Können Sie XML-Rechnungen lesen?', 'Can you read XML invoices?'), T(l, 'Viewer oder Buchhaltungssoftware nutzen', 'Use a viewer or accounting software')],
    ['pruefen', T(l, 'Prüfen Sie Pflichtangaben und Beträge?', 'Do you check mandatory details and amounts?'), T(l, 'Vorprüfung oder KoSIT-Validator vor der Zahlung', 'Pre-check or KoSIT validator before paying')],
    ['archiv', T(l, 'Bewahren Sie die XML unverändert auf?', 'Do you keep the XML unchanged?'), T(l, 'XML acht Jahre im Original sichern', 'Keep the original XML for eight years')],
  ];
  return {
    inputs: qs.map(([id, label]) => ({ kind: 'choice' as const, id, label, def: id === 'postfach' ? 'ja' : 'nein', options: yn(l) })),
    run: (v) => {
      const done = qs.filter(([id]) => s(v, id) === 'ja').length;
      return {
        label: T(l, 'Bereit für den Empfang', 'Ready to receive'), value: `${done} / ${qs.length}`,
        sub: done === qs.length ? T(l, 'Alles erledigt: Sie können E-Rechnungen annehmen, lesen und richtig aufbewahren.', 'All done: you can accept, read and correctly keep e-invoices.') : T(l, 'Offene Punkte stehen unten. Eine E-Rechnung dürfen Sie seit 2025 nicht mehr ablehnen.', 'Open points are listed below. Since 2025 you may no longer refuse an e-invoice.'),
        rows: qs.map(([id, , todo]) => [todo, s(v, id) === 'ja' ? T(l, 'Erledigt', 'Done') : T(l, 'Offen', 'Open')] as [string, string]),
        note: T(l, 'Ein E-Mail-Postfach genügt für den Empfang (BMF-FAQ). Aufbewahrung: § 14b UStG, GoBD.', 'An email inbox is enough to receive (Finance Ministry FAQ). Retention: section 14b UStG, GoBD.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Versand */
function versandSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'choice', id: 'empf', label: T(l, 'Empfänger', 'Recipient'), def: String(a?.empf ?? 'firma'), options: [{ value: 'firma', label: T(l, 'Unternehmen', 'Business') }, { value: 'bund', label: T(l, 'Bund', 'Federal body') }] },
      { kind: 'select', id: 'datei', label: T(l, 'Anhang der E-Mail', 'Email attachment'), def: 'zugferd', options: [
        { value: 'zugferd', label: T(l, 'ZUGFeRD-PDF', 'ZUGFeRD PDF') }, { value: 'xml', label: T(l, 'XRechnung (XML)', 'XRechnung (XML)') }, { value: 'pdf', label: T(l, 'PDF ohne XML', 'PDF without XML') },
      ] },
      { kind: 'choice', id: 'mehr', label: T(l, 'Mehrere Rechnungen in einer E-Mail?', 'Several invoices in one email?'), def: 'nein', options: yn(l), adv: true },
    ],
    run: (v) => {
      const bund = s(v, 'empf') === 'bund', d = s(v, 'datei'), mehr = s(v, 'mehr') === 'ja';
      let ok: boolean; let sub: string;
      if (d === 'pdf') { ok = false; sub = T(l, 'Eine PDF ohne XML ist keine E-Rechnung, egal wie sie verschickt wird.', 'A PDF without XML is not an e-invoice, however it is sent.'); }
      else if (bund) { ok = d === 'xml' && !mehr; sub = d !== 'xml' ? T(l, 'Der Bund nimmt per E-Mail nur strukturierte Rechnungen ohne Sichtformat an: XRechnung oder ZUGFeRD XRECHNUNG als XML.', 'By email the federal portal only accepts structured invoices without a visual layer: XRechnung or ZUGFeRD XRECHNUNG as XML.') : mehr ? T(l, 'Pro E-Mail nur eine Rechnung, sonst wird die E-Mail samt Anhängen verworfen.', 'One invoice per email, otherwise the email and its attachments are discarded.') : T(l, 'Möglich, nach Registrierung am Portal, an die dort angezeigte Adresse.', 'Possible after registering on the portal, to the address it shows you.'); }
      else { ok = true; sub = T(l, 'Zwischen Unternehmen ist kein Übertragungsweg vorgeschrieben: E-Mail, Download, Schnittstelle oder Portal.', 'Between businesses no channel is prescribed: email, download, interface or portal.'); }
      return {
        label: T(l, 'Versand per E-Mail', 'Sending by email'), value: ok ? T(l, 'Geht', 'Works') : T(l, 'Geht so nicht', 'Does not work like this'), sub,
        rows: [
          [T(l, 'Signatur nötig', 'Signature needed'), T(l, 'Nein', 'No')],
          [T(l, 'Text der E-Mail', 'Email body'), bund ? T(l, 'Wird verworfen, Inhalt nur im Anhang', 'Discarded, content only in the attachment') : T(l, 'Frei, nicht Teil der Rechnung', 'Free, not part of the invoice')],
          [T(l, 'Zugang beim Empfänger', 'Receipt by the recipient'), T(l, 'Postfach muss Anhänge annehmen', 'Inbox must accept attachments')],
        ],
        note: T(l, 'Grundlage: BMF-FAQ zur Übermittlung; E-Rechnung Bund, Übertragungskanal E-Mail.', 'Basis: Finance Ministry FAQ on transmission; E-Rechnung Bund, email channel.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Bund : ERechV */
function bundSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'ag', label: T(l, 'Auftraggeber', 'Contracting body'), def: String(a?.ag ?? 'bund'), options: [
        { value: 'bund', label: T(l, 'Bundesbehörde, Bundeseinrichtung', 'Federal authority or body') }, { value: 'land', label: T(l, 'Landesbehörde', 'State authority') },
        { value: 'kommune', label: T(l, 'Stadt, Gemeinde, Landkreis', 'City, municipality, district') }, { value: 'privat', label: T(l, 'Unternehmen', 'Business') },
      ] },
      { id: 'betrag', label: T(l, 'Rechnungsbetrag', 'Invoice amount'), def: Number(a?.betrag ?? 2400), unit: '€', max: 5e7 },
      { kind: 'choice', id: 'direkt', label: T(l, 'Direktauftrag?', 'Direct award?'), def: 'nein', options: yn(l) },
    ],
    run: (v) => {
      const ag = s(v, 'ag') as R.Auftraggeber, pf = R.erechvPflicht(ag, n(v, 'betrag'), s(v, 'direkt') === 'ja');
      return {
        label: T(l, 'E-Rechnung nach der ERechV des Bundes', 'E-invoice under the federal ERechV'),
        value: ag === 'bund' ? (pf ? T(l, 'Pflicht', 'Required') : T(l, 'Ausnahme', 'Exempt')) : T(l, 'Nicht nach ERechV', 'Not under ERechV'),
        sub: ag === 'bund' ? (pf ? T(l, `Seit ${day(P.erechv.pflichtSeit, l)} gehen Rechnungen an den Bund nur elektronisch, über die Rechnungseingangsplattform des Bundes.`, `Since ${day(P.erechv.pflichtSeit, l)} invoices to the federal government go electronically only, through its invoice receipt platform.`) : T(l, `Direktaufträge bis ${eur(P.erechv.direktauftrag, l)} sind ausgenommen (§ 3 Abs. 3 Nr. 1 ERechV).`, `Direct awards up to ${eur(P.erechv.direktauftrag, l)} are exempt (section 3(3) no. 1 ERechV).`))
          : ag === 'privat' ? T(l, 'Zwischen Unternehmen gilt § 14 UStG mit seinen Übergangsfristen, nicht die ERechV.', 'Between businesses section 14 UStG and its transition periods apply, not the ERechV.') : T(l, 'Länder und Kommunen regeln das in eigenen Gesetzen und Verordnungen; die Leitweg-ID nennt der Auftraggeber.', 'States and municipalities have their own laws; the contracting body gives you the Leitweg-ID.'),
        rows: [
          [T(l, 'Format', 'Format'), ag === 'privat' ? T(l, 'XRechnung oder ZUGFeRD', 'XRechnung or ZUGFeRD') : T(l, 'XRechnung (ZUGFeRD nur im Profil XRECHNUNG als XML)', 'XRechnung (ZUGFeRD only in the XRECHNUNG profile as XML)')],
          [T(l, 'Leitweg-ID in BT-10', 'Leitweg-ID in BT-10'), ag === 'privat' ? T(l, 'Nicht nötig', 'Not needed') : T(l, 'Ja', 'Yes')],
          [T(l, 'Zusätzlich nach § 5 ERechV', 'Also required by section 5 ERechV'), ag === 'bund' ? T(l, 'Bankverbindung, Zahlungsbedingungen, E-Mail-Adresse', 'Bank details, payment terms, email address') : '–'],
          [T(l, 'Übertragungswege', 'Channels'), ag === 'bund' ? P.erechv.kanaele.join(', ') : T(l, 'Nach Vorgabe des Auftraggebers', 'As the contracting body specifies')],
        ],
        note: T(l, 'Grundlage: §§ 3 bis 5 E-Rechnungsverordnung des Bundes; FAQ von E-Rechnung Bund.', 'Basis: sections 3 to 5 of the Federal E-Invoicing Ordinance; E-Rechnung Bund FAQ.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ EDI */
function ediSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'jahr', label: T(l, 'Leistungsjahr', 'Year of supply'), def: String(a?.jahr ?? '2027'), options: ['2026', '2027', '2028'].map((y) => ({ value: y, label: y === '2028' ? T(l, '2028 oder später', '2028 or later') : y })) },
      { kind: 'choice', id: 'zust', label: T(l, 'Hat der Kunde zugestimmt?', 'Has the customer agreed?'), def: 'ja', options: yn(l) },
      { kind: 'choice', id: 'extrakt', label: T(l, 'Angaben EN-16931-konform herauslesbar?', 'Data extractable in line with EN 16931?'), def: 'nein', options: yn(l) },
    ],
    run: (v) => {
      const j = Number(s(v, 'jahr')), z = s(v, 'zust') === 'ja', x = s(v, 'extrakt') === 'ja';
      const ok = x || (z && j <= 2027);
      return {
        label: T(l, 'EDI-Rechnung zulässig?', 'EDI invoice allowed?'), value: ok ? T(l, 'Ja', 'Yes') : T(l, 'Nein', 'No'),
        sub: x ? T(l, 'Ein vereinbartes Format gilt als E-Rechnung, wenn die Angaben ohne Informationsverlust nach EN 16931 herausgelesen werden können (§ 14 Abs. 1 Satz 6 Nr. 2 UStG).', 'An agreed format counts as an e-invoice if the data can be extracted to EN 16931 without loss (section 14(1) sentence 6 no. 2 UStG).')
          : j <= 2027 ? (z ? T(l, `Bisherige EDI-Verfahren bleiben mit Zustimmung bis ${day(PF.ediBis, l)} erlaubt (§ 27 Abs. 38 Nr. 3 UStG).`, `Existing EDI set-ups remain allowed with consent until ${day(PF.ediBis, l)} (section 27(38) no. 3 UStG).`) : T(l, 'Ohne Zustimmung des Kunden geht nur eine E-Rechnung oder Papier.', 'Without the customer’s consent only an e-invoice or paper will do.'))
          : T(l, 'Ab 2028 muss auch EDI die EN 16931 abbilden können.', 'From 2028 EDI too must be able to map to EN 16931.'),
        rows: [[T(l, 'Übergang endet', 'Transition ends'), day(PF.ediBis, l)], [T(l, 'Danach nötig', 'Needed afterwards'), T(l, 'Interoperabilität mit EN 16931', 'Interoperability with EN 16931')]],
        note: T(l, 'Grundlage: § 14 Abs. 1 Satz 6, § 27 Abs. 38 Nr. 3 UStG; BMF-Schreiben vom 15. Oktober 2025.', 'Basis: section 14(1) sentence 6, section 27(38) no. 3 UStG; Finance Ministry letter of 15 October 2025.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Leitweg-ID (für Mini-Simulatoren) */
function leitwegMiniSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'grob', label: T(l, 'Grobadressierung (Ziffern)', 'Coarse address (digits)'), def: Number(a?.grob ?? 991), max: 999999999999, decimals: 0 },
      { id: 'fein', label: T(l, 'Feinadressierung (Ziffern)', 'Fine address (digits)'), def: Number(a?.fein ?? 12345), max: 999999999999, decimals: 0 },
    ],
    run: (v) => {
      const g = String(Math.round(n(v, 'grob'))).padStart(2, '0'), f = n(v, 'fein') > 0 ? String(Math.round(n(v, 'fein'))) : '';
      const pz = pruefeLeitweg(`${g}${f ? `-${f}` : ''}-00`).erwartet ?? '';
      const id = `${g}${f ? `-${f}` : ''}-${pz}`;
      const land = pruefeLeitweg(id).land;
      return {
        label: T(l, 'Vollständige Leitweg-ID', 'Complete Leitweg-ID'), value: id,
        rows: [[T(l, 'Prüfziffer', 'Check digits'), pz], [T(l, 'Kennzahl', 'Code'), land ?? T(l, 'unbekannt', 'unknown')]],
        note: T(l, 'Prüfziffer nach ISO/IEC 7064 Modulo 97-10 (Formatspezifikation Leitweg-ID 2.0.2).', 'Check digits per ISO/IEC 7064 modulo 97-10 (Leitweg-ID format specification 2.0.2).'),
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = {
  pflicht: pflichtSpec, fristen: fristenSpec, klein: kleinSpec, archiv: archivSpec, folgen: folgenSpec, fehler: fehlerSpec,
  istes: istesSpec, zf: zfSpec, wahl: wahlSpec, felder: felderSpec, empfang: empfangSpec, versand: versandSpec, bund: bundSpec, edi: ediSpec, lw: leitwegMiniSpec,
};
export const TOOL_KINDS = [...Object.keys(SPECS), 'viewer', 'creator', 'leitweg', 'beispiel'];
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`simulateur inconnu : ${kind}`);
  return f(l, arg);
}
/** Lance un simulateur avec ses valeurs par défaut (ou celles données) : sert aux pages et aux tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
export { formatNumber };
