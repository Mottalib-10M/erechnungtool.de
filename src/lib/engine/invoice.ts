/**
 * Das Rechnungsmodell nach EN 16931 (semantisches Datenmodell, Business Terms BT-xx / Gruppen BG-xx).
 * Gemeinsam für Leser (parse.ts), Prüfung (validate.ts) und Erzeugung (build.ts, pdf.ts).
 * Nur die Begriffe, die Viewer, Prüfung und Ersteller wirklich nutzen ; der Rest bleibt in der XML.
 */
import { round2 } from './regeln';

export type Syntax = 'UBL' | 'CII';
export interface Address { street?: string; street2?: string; city?: string; zip?: string; country?: string }
export interface Party {
  /** BT-27 / BT-44 */ name?: string;
  /** BT-28 / BT-45 Handelsname */ tradingName?: string;
  /** BT-29 / BT-46 Kennung */ id?: string;
  /** BT-30 / BT-47 Registernummer */ legalId?: string;
  /** BT-31 / BT-48 USt-IdNr. */ vatId?: string;
  /** BT-32 Steuernummer */ taxNo?: string;
  /** BT-33 weitere rechtliche Angaben */ legalInfo?: string;
  /** BT-34 / BT-49 elektronische Adresse, mit Schema (EM = E-Mail, 0204 = Leitweg-ID, 9930 = USt-IdNr. …) */
  endpoint?: string; endpointScheme?: string;
  address: Address;
  /** BG-6 / BG-9 */ contact?: { name?: string; phone?: string; email?: string };
}
export interface Line {
  /** BT-126 */ id: string;
  /** BT-153 */ name: string;
  /** BT-154 */ description?: string;
  /** BT-129 */ qty: number;
  /** BT-130 (UN/ECE Rec. 20 : H87 Stück, HUR Stunde, C62 Einheit …) */ unit: string;
  /** BT-146 Nettopreis */ price: number;
  /** BT-149 Basismenge */ baseQty?: number;
  /** BT-131 Nettobetrag */ net: number;
  /** BT-151 */ vatCat: string;
  /** BT-152 */ vatRate?: number;
  /** BT-127 */ note?: string;
}
export interface AllowanceCharge { charge: boolean; amount: number; reason?: string; vatCat: string; vatRate?: number }
export interface VatBreakdown {
  /** BT-118 */ cat: string;
  /** BT-119 */ rate?: number;
  /** BT-116 */ base: number;
  /** BT-117 */ amount: number;
  /** BT-120 */ exemptionReason?: string;
  /** BT-121 */ exemptionCode?: string;
}
export interface Totals {
  /** BT-106 */ lineNet: number;
  /** BT-107 */ allowances?: number;
  /** BT-108 */ charges?: number;
  /** BT-109 */ taxExclusive: number;
  /** BT-110 */ vatTotal?: number;
  /** BT-112 */ taxInclusive: number;
  /** BT-113 */ prepaid?: number;
  /** BT-114 */ rounding?: number;
  /** BT-115 */ payable: number;
}
export interface Invoice {
  syntax?: Syntax;
  /** Rechnung oder Gutschrift (UBL CreditNote) */ kind?: 'invoice' | 'creditnote';
  /** BT-24 */ customizationId?: string;
  /** BT-23 */ profileId?: string;
  /** BT-1 */ number?: string;
  /** BT-2 (JJJJ-MM-TT) */ issueDate?: string;
  /** BT-3 (380 Rechnung, 381 Gutschrift, 384 Korrektur, 326 Teilrechnung, 875 … ) */ typeCode?: string;
  /** BT-5 */ currency?: string;
  /** BT-9 */ dueDate?: string;
  /** BT-10 Käuferreferenz, bei der öffentlichen Hand die Leitweg-ID */ buyerReference?: string;
  /** BT-13 */ orderRef?: string;
  /** BT-12 */ contractRef?: string;
  /** BT-25 */ precedingInvoice?: string;
  /** BT-22 */ notes: string[];
  /** BT-72 */ deliveryDate?: string;
  /** BT-73 / BT-74 */ periodStart?: string; periodEnd?: string;
  seller: Party;
  buyer: Party;
  /** BG-16 */ payment: { meansCode?: string; iban?: string; bic?: string; accountName?: string; terms?: string; mandateRef?: string; creditorId?: string; debitedAccount?: string; remittance?: string };
  lines: Line[];
  allowancesCharges: AllowanceCharge[];
  vat: VatBreakdown[];
  totals: Totals;
  /** BG-24 angehängte Dokumente (nur Name und Typ, der Inhalt bleibt in der Datei). */
  attachments: Array<{ id?: string; filename?: string; mime?: string; description?: string; size?: number }>;
}

export const emptyInvoice = (): Invoice => ({ notes: [], seller: { address: {} }, buyer: { address: {} }, payment: {}, lines: [], allowancesCharges: [], vat: [], attachments: [], totals: { lineNet: 0, taxExclusive: 0, taxInclusive: 0, payable: 0 } });

/** Rechnet Positionen, Steueraufschlüsselung und Summen nach den Regeln BR-CO-10 bis BR-CO-16 neu. */
export function computeTotals(inv: Invoice): Invoice {
  const lines = inv.lines.map((l) => ({ ...l, net: round2((l.qty * l.price) / (l.baseQty || 1)) }));
  const lineNet = round2(lines.reduce((s, l) => s + l.net, 0));
  const allowances = round2(inv.allowancesCharges.filter((a) => !a.charge).reduce((s, a) => s + a.amount, 0));
  const charges = round2(inv.allowancesCharges.filter((a) => a.charge).reduce((s, a) => s + a.amount, 0));
  const groups = new Map<string, VatBreakdown>();
  const key = (cat: string, rate?: number) => `${cat}|${rate ?? 0}`;
  const add = (cat: string, rate: number | undefined, amt: number) => {
    const k = key(cat, rate);
    const g = groups.get(k) ?? { cat, rate: rate ?? 0, base: 0, amount: 0, exemptionReason: inv.vat.find((v) => v.cat === cat && (v.rate ?? 0) === (rate ?? 0))?.exemptionReason };
    g.base = round2(g.base + amt); groups.set(k, g);
  };
  for (const l of lines) add(l.vatCat, l.vatRate, l.net);
  for (const a of inv.allowancesCharges) add(a.vatCat, a.vatRate, a.charge ? a.amount : -a.amount);
  const vat = [...groups.values()].map((g) => ({ ...g, amount: round2((g.base * (g.rate ?? 0)) / 100) }));
  const vatTotal = round2(vat.reduce((s, v) => s + v.amount, 0));
  const taxExclusive = round2(lineNet - allowances + charges);
  const taxInclusive = round2(taxExclusive + vatTotal);
  const prepaid = inv.totals.prepaid ?? 0;
  const payable = round2(taxInclusive - prepaid + (inv.totals.rounding ?? 0));
  return { ...inv, lines, vat, totals: { lineNet, allowances: allowances || undefined, charges: charges || undefined, taxExclusive, vatTotal, taxInclusive, prepaid: prepaid || undefined, rounding: inv.totals.rounding, payable } };
}

/** Lesbare Bezeichnungen der Codes, die in einer deutschen Rechnung vorkommen. */
export const TYPE_CODES: Record<string, [string, string]> = {
  '380': ['Rechnung', 'Invoice'], '381': ['Gutschrift (Rechnungskorrektur)', 'Credit note'], '384': ['Korrigierte Rechnung', 'Corrected invoice'],
  '326': ['Teilrechnung', 'Partial invoice'], '389': ['Gutschrift im Gutschriftverfahren', 'Self-billed invoice'], '875': ['Abschlagsrechnung (Bau)', 'Partial construction invoice'],
  '876': ['Teilschlussrechnung (Bau)', 'Partial final construction invoice'], '877': ['Schlussrechnung (Bau)', 'Final construction invoice'], '261': ['Selbstfakturierte Gutschrift', 'Self-billed credit note'],
};
export const VAT_CATS: Record<string, [string, string]> = {
  S: ['Regelsatz oder ermäßigter Satz', 'Standard or reduced rate'], Z: ['Nullsatz', 'Zero rated'], E: ['Steuerbefreit', 'Exempt'],
  AE: ['Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge)', 'Reverse charge'], K: ['Innergemeinschaftliche Lieferung', 'Intra-community supply'],
  G: ['Ausfuhr, steuerfrei', 'Export outside the EU'], O: ['Nicht steuerbar', 'Outside the scope of VAT'], L: ['Kanarische Inseln (IGIC)', 'Canary Islands (IGIC)'], M: ['Ceuta und Melilla (IPSI)', 'Ceuta and Melilla (IPSI)'],
};
export const UNITS: Record<string, [string, string]> = {
  H87: ['Stück', 'piece'], C62: ['Einheit', 'unit'], XPP: ['Packung', 'package'], HUR: ['Stunde', 'hour'], DAY: ['Tag', 'day'], MON: ['Monat', 'month'],
  ANN: ['Jahr', 'year'], MIN: ['Minute', 'minute'], KGM: ['Kilogramm', 'kilogram'], MTR: ['Meter', 'metre'], MTK: ['Quadratmeter', 'square metre'], LTR: ['Liter', 'litre'],
  KMT: ['Kilometer', 'kilometre'], LS: ['Pauschale', 'lump sum'], SET: ['Satz', 'set'], WEE: ['Woche', 'week'], TNE: ['Tonne', 'tonne'], P1: ['Prozent', 'percent'],
};
export const PAYMENT_MEANS: Record<string, [string, string]> = {
  '10': ['Bar', 'Cash'], '30': ['Überweisung', 'Credit transfer'], '31': ['Überweisung (Ausland)', 'Debit transfer'], '42': ['Zahlung auf Bankkonto', 'Payment to bank account'],
  '48': ['Kartenzahlung', 'Bank card'], '49': ['Lastschrift', 'Direct debit'], '54': ['Kreditkarte', 'Credit card'], '55': ['Debitkarte', 'Debit card'], '57': ['Dauerauftrag', 'Standing agreement'],
  '58': ['SEPA-Überweisung', 'SEPA credit transfer'], '59': ['SEPA-Lastschrift', 'SEPA direct debit'], '97': ['Verrechnung', 'Clearing between partners'], ZZZ: ['Sonstiges', 'Other'],
};
