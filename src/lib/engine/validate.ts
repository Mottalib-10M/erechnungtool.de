/**
 * Vorprüfung einer E-Rechnung gegen die wichtigsten Geschäftsregeln der EN 16931 (BR-xx, BR-CO-xx,
 * BR-S/E/AE-xx) und, bei einer XRechnung, gegen die nationalen Regeln BR-DE-xx der KoSIT sowie
 * PEPPOL-EN16931-R010/R020. Ersetzt NICHT den amtlichen KoSIT-Validator (Schema + Schematron) :
 * Schema-Fehler und hunderte Codelisten-Regeln prüft nur dieser. Läuft im Browser, ohne Netz.
 */
import type { Invoice } from './invoice';
import { pruefeLeitweg, siehtAusWieLeitweg } from './leitweg';
import { mod97, toDigits } from './leitweg';
import { round2 } from './regeln';

export type Level = 'error' | 'warning' | 'info';
export interface Finding { rule: string; bt?: string; level: Level; de: string; en: string }
export interface ValidateOpts { /** XRechnung-Regeln anwenden ; Standard : wenn BT-24 eine XRechnung-Kennung ist. */ xrechnung?: boolean; /** Empfänger ist eine Stelle des Bundes : Leitweg-ID in BT-10 erwartet. */ bund?: boolean }
export interface Report { findings: Finding[]; errors: number; warnings: number; rules: number; xrechnung: boolean }

const has = (v: unknown) => v !== undefined && v !== null && !(typeof v === 'string' && !v.trim()) && !(typeof v === 'number' && Number.isNaN(v));
const eq = (a: number, b: number) => Math.abs(round2(a) - round2(b)) < 0.005;
export function ibanOk(iban: string): boolean {
  const s = iban.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  return mod97(toDigits(s.slice(4) + s.slice(0, 4))) === 1;
}
const fmt = (x: number) => (Number.isNaN(x) ? '–' : x.toFixed(2));

export function validateInvoice(inv: Invoice, opts: ValidateOpts = {}): Report {
  const xr = opts.xrechnung ?? /xrechnung/i.test(inv.customizationId ?? '');
  const f: Finding[] = [];
  let rules = 0;
  const rule = (ok: boolean, r: string, bt: string | undefined, level: Level, de: string, en: string) => { rules++; if (!ok) f.push({ rule: r, bt, level, de, en }); };
  const S = inv.seller, B = inv.buyer, T = inv.totals;

  /* Pflichtfelder der EN 16931 */
  rule(has(inv.customizationId), 'BR-01', 'BT-24', 'error', 'Die Kennung der Spezifikation (BT-24) fehlt.', 'The specification identifier (BT-24) is missing.');
  rule(has(inv.number), 'BR-02', 'BT-1', 'error', 'Die Rechnungsnummer (BT-1) fehlt.', 'The invoice number (BT-1) is missing.');
  rule(has(inv.issueDate), 'BR-03', 'BT-2', 'error', 'Das Rechnungsdatum (BT-2) fehlt.', 'The issue date (BT-2) is missing.');
  rule(!has(inv.issueDate) || /^\d{4}-\d{2}-\d{2}$/.test(inv.issueDate!), 'DATUM', 'BT-2', 'error', 'Das Rechnungsdatum ist kein gültiges Datum.', 'The issue date is not a valid date.');
  rule(has(inv.typeCode), 'BR-04', 'BT-3', 'error', 'Der Rechnungstyp (BT-3) fehlt.', 'The invoice type code (BT-3) is missing.');
  rule(has(inv.currency), 'BR-05', 'BT-5', 'error', 'Der Währungscode (BT-5) fehlt.', 'The currency code (BT-5) is missing.');
  rule(has(S.name), 'BR-06', 'BT-27', 'error', 'Der Name des Verkäufers (BT-27) fehlt.', 'The seller name (BT-27) is missing.');
  rule(has(B.name), 'BR-07', 'BT-44', 'error', 'Der Name des Käufers (BT-44) fehlt.', 'The buyer name (BT-44) is missing.');
  rule(has(S.address.country) || has(S.address.city) || has(S.address.street), 'BR-08', 'BG-5', 'error', 'Die Anschrift des Verkäufers (BG-5) fehlt.', 'The seller postal address (BG-5) is missing.');
  rule(has(S.address.country), 'BR-09', 'BT-40', 'error', 'Der Ländercode des Verkäufers (BT-40) fehlt.', 'The seller country code (BT-40) is missing.');
  rule(has(B.address.country) || has(B.address.city) || has(B.address.street), 'BR-10', 'BG-8', 'error', 'Die Anschrift des Käufers (BG-8) fehlt.', 'The buyer postal address (BG-8) is missing.');
  rule(has(B.address.country), 'BR-11', 'BT-55', 'error', 'Der Ländercode des Käufers (BT-55) fehlt.', 'The buyer country code (BT-55) is missing.');
  rule(has(T.lineNet), 'BR-12', 'BT-106', 'error', 'Die Summe der Positionen (BT-106) fehlt.', 'The sum of invoice line net amounts (BT-106) is missing.');
  rule(has(T.taxExclusive), 'BR-13', 'BT-109', 'error', 'Der Gesamtbetrag ohne Umsatzsteuer (BT-109) fehlt.', 'The total amount without VAT (BT-109) is missing.');
  rule(has(T.taxInclusive), 'BR-14', 'BT-112', 'error', 'Der Gesamtbetrag mit Umsatzsteuer (BT-112) fehlt.', 'The total amount with VAT (BT-112) is missing.');
  rule(has(T.payable), 'BR-15', 'BT-115', 'error', 'Der fällige Betrag (BT-115) fehlt.', 'The amount due for payment (BT-115) is missing.');
  rule(inv.lines.length > 0, 'BR-16', 'BG-25', 'error', 'Die Rechnung enthält keine Position (BG-25).', 'The invoice has no invoice line (BG-25).');
  inv.lines.forEach((l, i) => {
    const n = i + 1;
    rule(has(l.id), 'BR-21', 'BT-126', 'error', `Position ${n}: Positionsnummer (BT-126) fehlt.`, `Line ${n}: line identifier (BT-126) is missing.`);
    rule(has(l.qty), 'BR-22', 'BT-129', 'error', `Position ${n}: Menge (BT-129) fehlt.`, `Line ${n}: invoiced quantity (BT-129) is missing.`);
    rule(has(l.unit), 'BR-23', 'BT-130', 'error', `Position ${n}: Einheit (BT-130) fehlt.`, `Line ${n}: unit of measure (BT-130) is missing.`);
    rule(has(l.net), 'BR-24', 'BT-131', 'error', `Position ${n}: Nettobetrag (BT-131) fehlt.`, `Line ${n}: line net amount (BT-131) is missing.`);
    rule(has(l.name), 'BR-25', 'BT-153', 'error', `Position ${n}: Artikelname (BT-153) fehlt.`, `Line ${n}: item name (BT-153) is missing.`);
    rule(has(l.price), 'BR-26', 'BT-146', 'error', `Position ${n}: Nettopreis (BT-146) fehlt.`, `Line ${n}: item net price (BT-146) is missing.`);
    rule(!(l.price < 0), 'BR-27', 'BT-146', 'error', `Position ${n}: Der Nettopreis darf nicht negativ sein.`, `Line ${n}: the item net price must not be negative.`);
    rule(has(l.vatCat), 'BR-CO-04', 'BT-151', 'error', `Position ${n}: Umsatzsteuerkategorie (BT-151) fehlt.`, `Line ${n}: VAT category code (BT-151) is missing.`);
    const calc = round2((l.qty * l.price) / (l.baseQty || 1));
    rule(!has(l.qty) || !has(l.price) || Math.abs(calc - l.net) <= 0.02, 'POS-RECHNUNG', 'BT-131', 'warning', `Position ${n}: Menge × Preis ergibt ${fmt(calc)}, angegeben sind ${fmt(l.net)}.`, `Line ${n}: quantity × price gives ${fmt(calc)}, the file says ${fmt(l.net)}.`);
  });

  /* Summen (BR-CO-10 bis BR-CO-16) */
  const sumLines = round2(inv.lines.reduce((s, l) => s + (l.net || 0), 0));
  const sumAllow = round2(inv.allowancesCharges.filter((a) => !a.charge).reduce((s, a) => s + a.amount, 0));
  const sumCharge = round2(inv.allowancesCharges.filter((a) => a.charge).reduce((s, a) => s + a.amount, 0));
  const vatSum = round2(inv.vat.reduce((s, v) => s + v.amount, 0));
  rule(!has(T.lineNet) || eq(sumLines, T.lineNet), 'BR-CO-10', 'BT-106', 'error', `Die Positionen ergeben ${fmt(sumLines)}, als Summe (BT-106) stehen ${fmt(T.lineNet)} in der Datei.`, `The lines add up to ${fmt(sumLines)}, the file states ${fmt(T.lineNet)} as BT-106.`);
  rule(eq(sumAllow, T.allowances ?? 0), 'BR-CO-11', 'BT-107', 'error', `Die Abschläge ergeben ${fmt(sumAllow)}, angegeben sind ${fmt(T.allowances ?? 0)} (BT-107).`, `Allowances add up to ${fmt(sumAllow)}, BT-107 says ${fmt(T.allowances ?? 0)}.`);
  rule(eq(sumCharge, T.charges ?? 0), 'BR-CO-12', 'BT-108', 'error', `Die Zuschläge ergeben ${fmt(sumCharge)}, angegeben sind ${fmt(T.charges ?? 0)} (BT-108).`, `Charges add up to ${fmt(sumCharge)}, BT-108 says ${fmt(T.charges ?? 0)}.`);
  const ex = round2((T.lineNet || 0) - (T.allowances ?? 0) + (T.charges ?? 0));
  rule(!has(T.taxExclusive) || eq(ex, T.taxExclusive), 'BR-CO-13', 'BT-109', 'error', `BT-106 − BT-107 + BT-108 ergibt ${fmt(ex)}, BT-109 sagt ${fmt(T.taxExclusive)}.`, `BT-106 − BT-107 + BT-108 gives ${fmt(ex)}, BT-109 says ${fmt(T.taxExclusive)}.`);
  rule(!has(T.vatTotal) || eq(vatSum, T.vatTotal!), 'BR-CO-14', 'BT-110', 'error', `Die Steuerbeträge je Kategorie ergeben ${fmt(vatSum)}, die Gesamtsteuer (BT-110) ist ${fmt(T.vatTotal ?? NaN)}.`, `VAT per category adds up to ${fmt(vatSum)}, the VAT total (BT-110) is ${fmt(T.vatTotal ?? NaN)}.`);
  const inc = round2((T.taxExclusive || 0) + (T.vatTotal ?? 0));
  rule(!has(T.taxInclusive) || eq(inc, T.taxInclusive), 'BR-CO-15', 'BT-112', 'error', `BT-109 + BT-110 ergibt ${fmt(inc)}, BT-112 sagt ${fmt(T.taxInclusive)}.`, `BT-109 + BT-110 gives ${fmt(inc)}, BT-112 says ${fmt(T.taxInclusive)}.`);
  const pay = round2((T.taxInclusive || 0) - (T.prepaid ?? 0) + (T.rounding ?? 0));
  rule(!has(T.payable) || eq(pay, T.payable), 'BR-CO-16', 'BT-115', 'error', `BT-112 − BT-113 + BT-114 ergibt ${fmt(pay)}, der fällige Betrag (BT-115) ist ${fmt(T.payable)}.`, `BT-112 − BT-113 + BT-114 gives ${fmt(pay)}, the amount due (BT-115) is ${fmt(T.payable)}.`);
  rule(inv.vat.length > 0, 'BR-CO-18', 'BG-23', 'error', 'Die Umsatzsteuer-Aufschlüsselung (BG-23) fehlt.', 'The VAT breakdown (BG-23) is missing.');
  rule(has(S.id) || has(S.legalId) || has(S.vatId), 'BR-CO-26', 'BT-29', 'error', 'Der Verkäufer braucht eine Kennung (BT-29), eine Registernummer (BT-30) oder eine USt-IdNr. (BT-31); ohne USt-IdNr. etwa die Steuernummer als Kennung.', 'The seller needs an identifier (BT-29), a legal registration ID (BT-30) or a VAT ID (BT-31); without a VAT ID, for example the tax number as identifier.');
  rule(!(T.payable > 0) || has(inv.dueDate) || has(inv.payment.terms), 'BR-CO-25', 'BT-9', 'error', 'Bei einem positiven Zahlbetrag muss ein Fälligkeitsdatum (BT-9) oder eine Zahlungsbedingung (BT-20) angegeben sein.', 'With a positive amount due, a due date (BT-9) or payment terms (BT-20) are required.');

  /* Umsatzsteuer je Kategorie */
  for (const v of inv.vat) {
    const base = round2(inv.lines.filter((l) => l.vatCat === v.cat && (l.vatRate ?? 0) === (v.rate ?? 0)).reduce((s, l) => s + l.net, 0)
      + inv.allowancesCharges.filter((a) => a.vatCat === v.cat && (a.vatRate ?? 0) === (v.rate ?? 0)).reduce((s, a) => s + (a.charge ? a.amount : -a.amount), 0));
    const lab = `${v.cat}${v.rate !== undefined ? ` ${v.rate} %` : ''}`;
    rule(eq(base, v.base), `BR-${v.cat}-08`, 'BT-116', 'error', `Kategorie ${lab}: Die Positionen ergeben eine Bemessungsgrundlage von ${fmt(base)}, angegeben sind ${fmt(v.base)}.`, `Category ${lab}: the lines give a taxable amount of ${fmt(base)}, the file says ${fmt(v.base)}.`);
    if (v.cat === 'S') {
      const tax = round2((v.base * (v.rate ?? 0)) / 100);
      rule(Math.abs(tax - v.amount) <= 1, 'BR-S-09', 'BT-117', 'error', `Kategorie ${lab}: ${fmt(v.base)} × ${v.rate} % = ${fmt(tax)}, angegeben sind ${fmt(v.amount)}.`, `Category ${lab}: ${fmt(v.base)} × ${v.rate}% = ${fmt(tax)}, the file says ${fmt(v.amount)}.`);
      rule(Math.abs(tax - v.amount) <= 0.01 || Math.abs(tax - v.amount) > 1, 'RUNDUNG', 'BT-117', 'warning', `Kategorie ${lab}: Steuerbetrag weicht um ${fmt(Math.abs(tax - v.amount))} von der Rechnung ab.`, `Category ${lab}: VAT amount differs from the calculation by ${fmt(Math.abs(tax - v.amount))}.`);
      rule((v.rate ?? 0) > 0, 'BR-S-05', 'BT-119', 'error', 'Kategorie S verlangt einen Steuersatz über 0 %.', 'Category S requires a VAT rate above 0%.');
    }
    if (['E', 'AE', 'K', 'G', 'O'].includes(v.cat)) {
      rule(v.amount === 0, `BR-${v.cat}-09`, 'BT-117', 'error', `Kategorie ${v.cat}: Der Steuerbetrag muss 0 sein.`, `Category ${v.cat}: the VAT amount must be 0.`);
      rule(has(v.exemptionReason) || has(v.exemptionCode), `BR-${v.cat}-10`, 'BT-120', 'error', `Kategorie ${v.cat}: Ein Befreiungsgrund (BT-120 oder BT-121) fehlt, etwa „Kleinunternehmer gemäß § 19 UStG“.`, `Category ${v.cat}: an exemption reason (BT-120 or BT-121) is missing, for example the small-business note under section 19 UStG.`);
    }
  }
  const cats = new Set([...inv.lines.map((l) => l.vatCat), ...inv.vat.map((v) => v.cat)]);
  if (cats.has('S')) rule(has(S.vatId) || has(S.taxNo), 'BR-S-02', 'BT-31', 'error', 'Bei Regelbesteuerung (S) muss die USt-IdNr. (BT-31) oder die Steuernummer (BT-32) des Verkäufers angegeben sein.', 'With standard-rated VAT (S) the seller VAT ID (BT-31) or tax number (BT-32) is required.');
  if (cats.has('AE')) rule(has(B.vatId) || has(B.legalId), 'BR-AE-02', 'BT-48', 'error', 'Bei Reverse Charge (AE) muss die USt-IdNr. des Käufers (BT-48) angegeben sein.', 'With reverse charge (AE) the buyer VAT ID (BT-48) is required.');
  for (const [p, bt, who, whoEn] of [[S, 'BT-31', 'Verkäufers', 'seller'], [B, 'BT-48', 'Käufers', 'buyer']] as const) {
    if (has(p.vatId)) rule(/^[A-Z]{2}/.test(p.vatId!.replace(/\s/g, '')), 'BR-CO-09', bt, 'error', `Die USt-IdNr. des ${who} muss mit dem Ländercode beginnen (z. B. DE).`, `The ${whoEn} VAT ID must start with the country code (e.g. DE).`);
  }
  if (inv.payment.meansCode === '58' && has(inv.payment.iban)) rule(ibanOk(inv.payment.iban!), 'BR-DE-19', 'BT-84', xr ? 'warning' : 'info', 'Die IBAN (BT-84) besteht die Prüfziffernprobe nicht.', 'The IBAN (BT-84) fails its check-digit test.');

  /* XRechnung : nationale Regeln der KoSIT */
  if (xr) {
    const C = S.contact ?? {};
    rule(has(inv.payment.meansCode), 'BR-DE-1', 'BG-16', 'error', 'Zahlungsanweisungen (BG-16) fehlen.', 'Payment instructions (BG-16) are missing.');
    rule(!!S.contact, 'BR-DE-2', 'BG-6', 'error', 'Der Kontakt des Verkäufers (BG-6) fehlt.', 'The seller contact (BG-6) is missing.');
    rule(has(S.address.city), 'BR-DE-3', 'BT-37', 'error', 'Der Ort des Verkäufers (BT-37) fehlt.', 'The seller city (BT-37) is missing.');
    rule(has(S.address.zip), 'BR-DE-4', 'BT-38', 'error', 'Die Postleitzahl des Verkäufers (BT-38) fehlt.', 'The seller post code (BT-38) is missing.');
    rule(has(C.name), 'BR-DE-5', 'BT-41', 'error', 'Der Ansprechpartner des Verkäufers (BT-41) fehlt.', 'The seller contact point (BT-41) is missing.');
    rule(has(C.phone), 'BR-DE-6', 'BT-42', 'error', 'Die Telefonnummer des Verkäufers (BT-42) fehlt.', 'The seller telephone number (BT-42) is missing.');
    rule(has(C.email), 'BR-DE-7', 'BT-43', 'error', 'Die E-Mail-Adresse des Verkäufers (BT-43) fehlt.', 'The seller email address (BT-43) is missing.');
    rule(has(B.address.city), 'BR-DE-8', 'BT-52', 'error', 'Der Ort des Käufers (BT-52) fehlt.', 'The buyer city (BT-52) is missing.');
    rule(has(B.address.zip), 'BR-DE-9', 'BT-53', 'error', 'Die Postleitzahl des Käufers (BT-53) fehlt.', 'The buyer post code (BT-53) is missing.');
    rule(inv.vat.every((v) => has(v.rate)), 'BR-DE-14', 'BT-119', 'error', 'Jede Steuerkategorie braucht einen Steuersatz (BT-119), auch 0.', 'Each VAT category needs a rate (BT-119), even 0.');
    rule(has(inv.buyerReference), 'BR-DE-15', 'BT-10', 'error', 'Die Käuferreferenz (BT-10) fehlt; bei der öffentlichen Hand ist das die Leitweg-ID.', 'The buyer reference (BT-10) is missing; for public bodies this is the Leitweg-ID.');
    if ([...cats].some((c) => ['S', 'Z', 'E', 'AE', 'K', 'G', 'L', 'M'].includes(c))) rule(has(S.vatId) || has(S.taxNo), 'BR-DE-16', 'BT-31', 'error', 'USt-IdNr. (BT-31) oder Steuernummer (BT-32) des Verkäufers fehlt.', 'Seller VAT ID (BT-31) or tax number (BT-32) is missing.');
    rule(!has(inv.typeCode) || ['326', '380', '384', '389', '381', '875', '876', '877'].includes(inv.typeCode!), 'BR-DE-17', 'BT-3', 'warning', `Rechnungstyp ${inv.typeCode} ist für die XRechnung nicht vorgesehen.`, `Invoice type ${inv.typeCode} is not intended for XRechnung.`);
    if (['30', '58'].includes(inv.payment.meansCode ?? '')) rule(has(inv.payment.iban), 'BR-DE-23', 'BG-17', 'error', 'Bei Überweisung muss das Zahlungskonto (BT-84) angegeben sein.', 'For a credit transfer the payment account (BT-84) is required.');
    if (inv.typeCode === '384') rule(has(inv.precedingInvoice), 'BR-DE-26', 'BG-3', 'warning', 'Eine korrigierte Rechnung soll die vorausgehende Rechnung (BT-25) nennen.', 'A corrected invoice should reference the preceding invoice (BT-25).');
    if (has(C.phone)) rule((C.phone!.match(/\d/g) ?? []).length >= 3, 'BR-DE-27', 'BT-42', 'warning', 'Die Telefonnummer soll mindestens drei Ziffern enthalten.', 'The telephone number should contain at least three digits.');
    if (has(C.email)) rule(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(C.email!), 'BR-DE-28', 'BT-43', 'warning', 'Die E-Mail-Adresse des Verkäufers sieht ungültig aus.', 'The seller email address looks invalid.');
    rule(has(B.endpoint), 'PEPPOL-EN16931-R010', 'BT-49', 'error', 'Die elektronische Adresse des Käufers (BT-49) fehlt.', 'The buyer electronic address (BT-49) is missing.');
    rule(has(S.endpoint), 'PEPPOL-EN16931-R020', 'BT-34', 'error', 'Die elektronische Adresse des Verkäufers (BT-34) fehlt.', 'The seller electronic address (BT-34) is missing.');
  }

  /* Leitweg-ID (eigene Prüfung nach der Formatspezifikation 2.0.2) */
  const br = inv.buyerReference ?? '';
  if (siehtAusWieLeitweg(br) || opts.bund) {
    const lw = pruefeLeitweg(br);
    rule(lw.ok, 'LEITWEG', 'BT-10', opts.bund ? 'error' : 'warning', `Die Leitweg-ID „${br}“ ist nicht gültig${lw.erwartet ? ` (Prüfziffer müsste ${lw.erwartet} lauten)` : ''}.`, `The Leitweg-ID "${br}" is not valid${lw.erwartet ? ` (check digits should be ${lw.erwartet})` : ''}.`);
  }

  const errors = f.filter((x) => x.level === 'error').length, warnings = f.filter((x) => x.level === 'warning').length;
  return { findings: f, errors, warnings, rules, xrechnung: xr };
}
