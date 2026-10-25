/**
 * Liest eine E-Rechnung (XML) in das Modell von invoice.ts : UBL 2.1 (Invoice, CreditNote) und
 * UN/CEFACT CII D16B (XRechnung-CII, ZUGFeRD 2.x, Factur-X). Läuft im Browser und in Node, ohne
 * Netz : nichts verlässt das Gerät. ZUGFeRD 1.0 (CrossIndustryDocument) wird erkannt und gemeldet.
 */
import { DOMParser } from '@xmldom/xmldom';
import { emptyInvoice, type Invoice, type Party, type Line, type Syntax } from './invoice';

type El = Element;
const kidsOf = (el: El | undefined | null, name: string): El[] => {
  if (!el) return [];
  const out: El[] = [];
  for (let n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 1 && (n as El).localName === name) out.push(n as El);
  return out;
};
/** Erstes Element entlang eines Pfads direkter Kinder (lokale Namen, ohne Präfix). */
const at = (el: El | undefined | null, ...path: string[]): El | undefined => {
  let cur: El | undefined = el ?? undefined;
  for (const p of path) { cur = kidsOf(cur, p)[0]; if (!cur) return undefined; }
  return cur;
};
const tx = (el: El | undefined | null, ...path: string[]): string | undefined => {
  const e = at(el, ...path);
  const s = e?.textContent?.trim();
  return s ? s : undefined;
};
const nm = (el: El | undefined | null, ...path: string[]): number | undefined => {
  const s = tx(el, ...path); if (s === undefined) return undefined;
  const n = Number(s); return Number.isFinite(n) ? n : undefined;
};
const d102 = (s?: string) => (s && /^\d{8}$/.test(s) ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : s);

export interface Detected {
  syntax: Syntax | 'ZUGFeRD1' | 'unbekannt';
  /** Lesbarer Name des Standards und des Profils. */
  standard: 'XRechnung' | 'ZUGFeRD / Factur-X' | 'Peppol BIS' | 'EN 16931' | 'ZUGFeRD 1.0' | 'unbekannt';
  profile?: 'MINIMUM' | 'BASIC WL' | 'BASIC' | 'EN 16931' | 'EXTENDED' | 'XRECHNUNG';
  version?: string;
  /** Nach dem BMF-Schreiben eine E-Rechnung im Sinne von § 14 Abs. 1 UStG ? (Format, nicht Inhalt) */
  erechnung: boolean;
  customizationId?: string;
}
export function detect(customizationId: string | undefined, syntax: Detected['syntax']): Detected {
  const c = customizationId ?? '';
  if (syntax === 'ZUGFeRD1') return { syntax, standard: 'ZUGFeRD 1.0', erechnung: false, customizationId: c };
  if (syntax === 'unbekannt') return { syntax, standard: 'unbekannt', erechnung: false };
  const xr = c.match(/xrechnung_(\d+\.\d+)/);
  if (xr) return { syntax, standard: 'XRechnung', profile: 'XRECHNUNG', version: xr[1], erechnung: true, customizationId: c };
  if (/factur-x\.eu:1p0:minimum/i.test(c)) return { syntax, standard: 'ZUGFeRD / Factur-X', profile: 'MINIMUM', erechnung: false, customizationId: c };
  if (/factur-x\.eu:1p0:basicwl/i.test(c)) return { syntax, standard: 'ZUGFeRD / Factur-X', profile: 'BASIC WL', erechnung: false, customizationId: c };
  if (/factur-x\.eu:1p0:basic\b/i.test(c)) return { syntax, standard: 'ZUGFeRD / Factur-X', profile: 'BASIC', erechnung: true, customizationId: c };
  if (/factur-x\.eu:1p0:extended|zugferd\.de:2p\d:extended/i.test(c)) return { syntax, standard: 'ZUGFeRD / Factur-X', profile: 'EXTENDED', erechnung: true, customizationId: c };
  if (/peppol\.eu:2017:poacc:billing:3\.0/.test(c)) return { syntax, standard: 'Peppol BIS', profile: 'EN 16931', version: '3.0', erechnung: true, customizationId: c };
  if (/^urn:cen\.eu:en16931:2017$/.test(c)) return { syntax, standard: syntax === 'CII' ? 'ZUGFeRD / Factur-X' : 'EN 16931', profile: 'EN 16931', erechnung: true, customizationId: c };
  if (/^urn:cen\.eu:en16931:2017/.test(c)) return { syntax, standard: 'EN 16931', profile: 'EN 16931', erechnung: true, customizationId: c };
  return { syntax, standard: 'unbekannt', erechnung: false, customizationId: c || undefined };
}

export interface ParseResult { ok: boolean; invoice?: Invoice; detected: Detected; error?: 'xml' | 'leer' | 'unbekannt' | 'zugferd1' }

export function parseInvoiceXml(xml: string): ParseResult {
  const none: Detected = { syntax: 'unbekannt', standard: 'unbekannt', erechnung: false };
  if (!xml || !xml.trim()) return { ok: false, detected: none, error: 'leer' };
  let doc: Document;
  try {
    doc = new DOMParser({ onError: (level, msg) => { if (level === 'fatalError') throw new Error(msg); } }).parseFromString(xml.replace(/^﻿/, ''), 'text/xml') as unknown as Document;
  } catch { return { ok: false, detected: none, error: 'xml' }; }
  const root = doc?.documentElement as El | null;
  if (!root) return { ok: false, detected: none, error: 'xml' };
  const ln = root.localName;
  if (ln === 'Invoice' || ln === 'CreditNote') {
    const inv = parseUbl(root, ln === 'CreditNote');
    return { ok: true, invoice: inv, detected: detect(inv.customizationId, 'UBL') };
  }
  if (ln === 'CrossIndustryInvoice') {
    const inv = parseCii(root);
    return { ok: true, invoice: inv, detected: detect(inv.customizationId, 'CII') };
  }
  if (ln === 'CrossIndustryDocument') return { ok: false, detected: detect(undefined, 'ZUGFeRD1'), error: 'zugferd1' };
  return { ok: false, detected: none, error: 'unbekannt' };
}

/* ------------------------------------------------------------------ UBL */
function ublParty(p: El | undefined): Party {
  const party: Party = { address: {} };
  if (!p) return party;
  const ep = at(p, 'EndpointID');
  party.endpoint = ep?.textContent?.trim() || undefined; party.endpointScheme = ep?.getAttribute('schemeID') || undefined;
  party.id = tx(p, 'PartyIdentification', 'ID');
  party.tradingName = tx(p, 'PartyName', 'Name');
  const a = at(p, 'PostalAddress');
  party.address = { street: tx(a, 'StreetName'), street2: tx(a, 'AdditionalStreetName'), city: tx(a, 'CityName'), zip: tx(a, 'PostalZone'), country: tx(a, 'Country', 'IdentificationCode') };
  for (const ts of kidsOf(p, 'PartyTaxScheme')) {
    const scheme = tx(ts, 'TaxScheme', 'ID'); const id = tx(ts, 'CompanyID');
    if (scheme === 'VAT') party.vatId = id; else party.taxNo = id;
  }
  const le = at(p, 'PartyLegalEntity');
  party.name = tx(le, 'RegistrationName') ?? party.tradingName;
  party.legalId = tx(le, 'CompanyID'); party.legalInfo = tx(le, 'CompanyLegalForm');
  const c = at(p, 'Contact');
  if (c) party.contact = { name: tx(c, 'Name'), phone: tx(c, 'Telephone'), email: tx(c, 'ElectronicMail') };
  return party;
}
function parseUbl(r: El, credit: boolean): Invoice {
  const inv = emptyInvoice();
  inv.syntax = 'UBL'; inv.kind = credit ? 'creditnote' : 'invoice';
  inv.customizationId = tx(r, 'CustomizationID'); inv.profileId = tx(r, 'ProfileID');
  inv.number = tx(r, 'ID'); inv.issueDate = tx(r, 'IssueDate');
  inv.typeCode = tx(r, credit ? 'CreditNoteTypeCode' : 'InvoiceTypeCode');
  inv.currency = tx(r, 'DocumentCurrencyCode');
  inv.dueDate = tx(r, 'DueDate') ?? tx(r, 'PaymentMeans', 'PaymentDueDate');
  inv.buyerReference = tx(r, 'BuyerReference');
  inv.orderRef = tx(r, 'OrderReference', 'ID');
  inv.contractRef = tx(r, 'ContractDocumentReference', 'ID');
  inv.precedingInvoice = tx(r, 'BillingReference', 'InvoiceDocumentReference', 'ID');
  inv.notes = kidsOf(r, 'Note').map((n) => n.textContent?.trim() ?? '').filter(Boolean);
  inv.periodStart = tx(r, 'InvoicePeriod', 'StartDate'); inv.periodEnd = tx(r, 'InvoicePeriod', 'EndDate');
  inv.deliveryDate = tx(r, 'Delivery', 'ActualDeliveryDate');
  inv.seller = ublParty(at(r, 'AccountingSupplierParty', 'Party'));
  inv.buyer = ublParty(at(r, 'AccountingCustomerParty', 'Party'));
  const pm = at(r, 'PaymentMeans');
  inv.payment = {
    meansCode: tx(pm, 'PaymentMeansCode'), remittance: tx(pm, 'PaymentID'),
    iban: tx(pm, 'PayeeFinancialAccount', 'ID'), accountName: tx(pm, 'PayeeFinancialAccount', 'Name'),
    bic: tx(pm, 'PayeeFinancialAccount', 'FinancialInstitutionBranch', 'ID'),
    mandateRef: tx(pm, 'PaymentMandate', 'ID'), debitedAccount: tx(pm, 'PaymentMandate', 'PayerFinancialAccount', 'ID'),
    terms: kidsOf(r, 'PaymentTerms').map((t) => tx(t, 'Note')).filter(Boolean).join(' ') || undefined,
  };
  inv.allowancesCharges = kidsOf(r, 'AllowanceCharge').map((a) => ({
    charge: tx(a, 'ChargeIndicator') === 'true', amount: nm(a, 'Amount') ?? 0, reason: tx(a, 'AllowanceChargeReason'),
    vatCat: tx(a, 'TaxCategory', 'ID') ?? '', vatRate: nm(a, 'TaxCategory', 'Percent'),
  }));
  const tt = kidsOf(r, 'TaxTotal').find((t) => kidsOf(t, 'TaxSubtotal').length) ?? kidsOf(r, 'TaxTotal')[0];
  inv.vat = kidsOf(tt, 'TaxSubtotal').map((s) => ({
    cat: tx(s, 'TaxCategory', 'ID') ?? '', rate: nm(s, 'TaxCategory', 'Percent'), base: nm(s, 'TaxableAmount') ?? 0, amount: nm(s, 'TaxAmount') ?? 0,
    exemptionReason: tx(s, 'TaxCategory', 'TaxExemptionReason'), exemptionCode: tx(s, 'TaxCategory', 'TaxExemptionReasonCode'),
  }));
  const vatTotal = kidsOf(r, 'TaxTotal').map((t) => at(t, 'TaxAmount')).find((e) => !e?.getAttribute('currencyID') || e.getAttribute('currencyID') === inv.currency);
  const m = at(r, 'LegalMonetaryTotal');
  inv.totals = {
    lineNet: nm(m, 'LineExtensionAmount') ?? NaN, allowances: nm(m, 'AllowanceTotalAmount'), charges: nm(m, 'ChargeTotalAmount'),
    taxExclusive: nm(m, 'TaxExclusiveAmount') ?? NaN, vatTotal: vatTotal ? Number(vatTotal.textContent) : undefined,
    taxInclusive: nm(m, 'TaxInclusiveAmount') ?? NaN, prepaid: nm(m, 'PrepaidAmount'), rounding: nm(m, 'PayableRoundingAmount'), payable: nm(m, 'PayableAmount') ?? NaN,
  };
  inv.lines = kidsOf(r, credit ? 'CreditNoteLine' : 'InvoiceLine').map((l): Line => {
    const q = at(l, credit ? 'CreditedQuantity' : 'InvoicedQuantity');
    return {
      id: tx(l, 'ID') ?? '', note: tx(l, 'Note'), qty: q ? Number(q.textContent) : 0, unit: q?.getAttribute('unitCode') ?? '',
      net: nm(l, 'LineExtensionAmount') ?? 0, name: tx(l, 'Item', 'Name') ?? '', description: tx(l, 'Item', 'Description'),
      vatCat: tx(l, 'Item', 'ClassifiedTaxCategory', 'ID') ?? '', vatRate: nm(l, 'Item', 'ClassifiedTaxCategory', 'Percent'),
      price: nm(l, 'Price', 'PriceAmount') ?? 0, baseQty: nm(l, 'Price', 'BaseQuantity'),
    };
  });
  inv.attachments = kidsOf(r, 'AdditionalDocumentReference').map((d) => {
    const b = at(d, 'Attachment', 'EmbeddedDocumentBinaryObject');
    return { id: tx(d, 'ID'), description: tx(d, 'DocumentDescription'), filename: b?.getAttribute('filename') ?? undefined, mime: b?.getAttribute('mimeCode') ?? undefined, size: b?.textContent ? Math.floor((b.textContent.replace(/\s/g, '').length * 3) / 4) : undefined };
  }).filter((a) => a.filename || a.description);
  return inv;
}

/* ------------------------------------------------------------------ CII */
function ciiParty(p: El | undefined): Party {
  const party: Party = { address: {} };
  if (!p) return party;
  party.id = tx(p, 'ID') ?? tx(p, 'GlobalID');
  party.name = tx(p, 'Name'); party.legalInfo = tx(p, 'Description');
  party.legalId = tx(p, 'SpecifiedLegalOrganization', 'ID'); party.tradingName = tx(p, 'SpecifiedLegalOrganization', 'TradingBusinessName');
  const c = at(p, 'DefinedTradeContact');
  if (c) party.contact = { name: tx(c, 'PersonName') ?? tx(c, 'DepartmentName'), phone: tx(c, 'TelephoneUniversalCommunication', 'CompleteNumber'), email: tx(c, 'EmailURIUniversalCommunication', 'URIID') };
  const a = at(p, 'PostalTradeAddress');
  party.address = { zip: tx(a, 'PostcodeCode'), street: tx(a, 'LineOne'), street2: tx(a, 'LineTwo'), city: tx(a, 'CityName'), country: tx(a, 'CountryID') };
  const ep = at(p, 'URIUniversalCommunication', 'URIID');
  party.endpoint = ep?.textContent?.trim() || undefined; party.endpointScheme = ep?.getAttribute('schemeID') || undefined;
  for (const reg of kidsOf(p, 'SpecifiedTaxRegistration')) {
    const id = at(reg, 'ID'); const scheme = id?.getAttribute('schemeID'); const v = id?.textContent?.trim();
    if (scheme === 'VA') party.vatId = v; else if (scheme === 'FC') party.taxNo = v;
  }
  return party;
}
function parseCii(r: El): Invoice {
  const inv = emptyInvoice();
  inv.syntax = 'CII'; inv.kind = 'invoice';
  const ctx = at(r, 'ExchangedDocumentContext');
  inv.customizationId = tx(ctx, 'GuidelineSpecifiedDocumentContextParameter', 'ID');
  inv.profileId = tx(ctx, 'BusinessProcessSpecifiedDocumentContextParameter', 'ID');
  const d = at(r, 'ExchangedDocument');
  inv.number = tx(d, 'ID'); inv.typeCode = tx(d, 'TypeCode'); inv.issueDate = d102(tx(d, 'IssueDateTime', 'DateTimeString'));
  inv.notes = kidsOf(d, 'IncludedNote').map((n) => tx(n, 'Content') ?? '').filter(Boolean);
  const t = at(r, 'SupplyChainTradeTransaction');
  const ag = at(t, 'ApplicableHeaderTradeAgreement');
  inv.buyerReference = tx(ag, 'BuyerReference');
  inv.seller = ciiParty(at(ag, 'SellerTradeParty'));
  inv.buyer = ciiParty(at(ag, 'BuyerTradeParty'));
  inv.orderRef = tx(ag, 'BuyerOrderReferencedDocument', 'IssuerAssignedID');
  inv.contractRef = tx(ag, 'ContractReferencedDocument', 'IssuerAssignedID');
  inv.attachments = kidsOf(ag, 'AdditionalReferencedDocument').filter((x) => tx(x, 'TypeCode') === '916').map((x) => {
    const b = at(x, 'AttachmentBinaryObject');
    return { id: tx(x, 'IssuerAssignedID'), description: tx(x, 'Name'), filename: b?.getAttribute('filename') ?? undefined, mime: b?.getAttribute('mimeCode') ?? undefined, size: b?.textContent ? Math.floor((b.textContent.replace(/\s/g, '').length * 3) / 4) : undefined };
  });
  inv.deliveryDate = d102(tx(t, 'ApplicableHeaderTradeDelivery', 'ActualDeliverySupplyChainEvent', 'OccurrenceDateTime', 'DateTimeString'));
  const st = at(t, 'ApplicableHeaderTradeSettlement');
  inv.currency = tx(st, 'InvoiceCurrencyCode');
  inv.periodStart = d102(tx(st, 'BillingSpecifiedPeriod', 'StartDateTime', 'DateTimeString'));
  inv.periodEnd = d102(tx(st, 'BillingSpecifiedPeriod', 'EndDateTime', 'DateTimeString'));
  inv.precedingInvoice = tx(st, 'InvoiceReferencedDocument', 'IssuerAssignedID');
  const pm = at(st, 'SpecifiedTradeSettlementPaymentMeans');
  const terms = kidsOf(st, 'SpecifiedTradePaymentTerms');
  inv.payment = {
    meansCode: tx(pm, 'TypeCode'), remittance: tx(st, 'PaymentReference'),
    iban: tx(pm, 'PayeePartyCreditorFinancialAccount', 'IBANID') ?? tx(pm, 'PayeePartyCreditorFinancialAccount', 'ProprietaryID'),
    accountName: tx(pm, 'PayeePartyCreditorFinancialAccount', 'AccountName'), bic: tx(pm, 'PayeeSpecifiedCreditorFinancialInstitution', 'BICID'),
    debitedAccount: tx(pm, 'PayerPartyDebtorFinancialAccount', 'IBANID'), creditorId: tx(st, 'CreditorReferenceID'),
    mandateRef: terms.map((x) => tx(x, 'DirectDebitMandateID')).find(Boolean),
    terms: terms.map((x) => tx(x, 'Description')).filter(Boolean).join(' ') || undefined,
  };
  inv.dueDate = d102(terms.map((x) => tx(x, 'DueDateDateTime', 'DateTimeString')).find(Boolean));
  inv.vat = kidsOf(st, 'ApplicableTradeTax').map((x) => ({
    cat: tx(x, 'CategoryCode') ?? '', rate: nm(x, 'RateApplicablePercent'), base: nm(x, 'BasisAmount') ?? 0, amount: nm(x, 'CalculatedAmount') ?? 0,
    exemptionReason: tx(x, 'ExemptionReason'), exemptionCode: tx(x, 'ExemptionReasonCode'),
  }));
  inv.allowancesCharges = kidsOf(st, 'SpecifiedTradeAllowanceCharge').map((a) => ({
    charge: tx(a, 'ChargeIndicator', 'Indicator') === 'true', amount: nm(a, 'ActualAmount') ?? 0, reason: tx(a, 'Reason'),
    vatCat: tx(a, 'CategoryTradeTax', 'CategoryCode') ?? '', vatRate: nm(a, 'CategoryTradeTax', 'RateApplicablePercent'),
  }));
  const m = at(st, 'SpecifiedTradeSettlementHeaderMonetarySummation');
  const taxTotals = kidsOf(m, 'TaxTotalAmount');
  const tt = taxTotals.find((e) => !e.getAttribute('currencyID') || e.getAttribute('currencyID') === inv.currency) ?? taxTotals[0];
  inv.totals = {
    lineNet: nm(m, 'LineTotalAmount') ?? NaN, charges: nm(m, 'ChargeTotalAmount'), allowances: nm(m, 'AllowanceTotalAmount'),
    taxExclusive: nm(m, 'TaxBasisTotalAmount') ?? NaN, vatTotal: tt ? Number(tt.textContent) : undefined,
    taxInclusive: nm(m, 'GrandTotalAmount') ?? NaN, prepaid: nm(m, 'TotalPrepaidAmount'), rounding: nm(m, 'RoundingAmount'), payable: nm(m, 'DuePayableAmount') ?? NaN,
  };
  inv.lines = kidsOf(t, 'IncludedSupplyChainTradeLineItem').map((l): Line => {
    const q = at(l, 'SpecifiedLineTradeDelivery', 'BilledQuantity');
    const tax = at(l, 'SpecifiedLineTradeSettlement', 'ApplicableTradeTax');
    return {
      id: tx(l, 'AssociatedDocumentLineDocument', 'LineID') ?? '', note: tx(l, 'AssociatedDocumentLineDocument', 'IncludedNote', 'Content'),
      name: tx(l, 'SpecifiedTradeProduct', 'Name') ?? '', description: tx(l, 'SpecifiedTradeProduct', 'Description'),
      price: nm(l, 'SpecifiedLineTradeAgreement', 'NetPriceProductTradePrice', 'ChargeAmount') ?? 0,
      baseQty: nm(l, 'SpecifiedLineTradeAgreement', 'NetPriceProductTradePrice', 'BasisQuantity'),
      qty: q ? Number(q.textContent) : 0, unit: q?.getAttribute('unitCode') ?? '',
      vatCat: tx(tax, 'CategoryCode') ?? '', vatRate: nm(tax, 'RateApplicablePercent'),
      net: nm(l, 'SpecifiedLineTradeSettlement', 'SpecifiedTradeSettlementLineMonetarySummation', 'LineTotalAmount') ?? 0,
    };
  });
  return inv;
}
