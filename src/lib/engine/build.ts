/**
 * Erzeugt aus dem Modell eine E-Rechnung :
 *   toUBL  : XRechnung 3.0 in UBL 2.1 (Invoice)
 *   toCII  : UN/CEFACT CII für ZUGFeRD / Factur-X, Profil EN 16931 oder XRECHNUNG
 * Reihenfolge der Elemente nach den XML-Schemata (UBL 2.1, CII D16B) ; geprüft mit dem
 * KoSIT-Validator (Konfiguration XRechnung 3.0.2) und mit Mustang (tests/build.test.ts, scripts/pruefe-erzeugte.sh).
 */
import type { Invoice, Party, Line } from './invoice';
import P from '../../data/params-2026.json';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const a2 = (n: number) => (Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2);
const q4 = (n: number) => String(Math.round(n * 10000) / 10000);
/** Ein Element nur, wenn es einen Wert hat. */
const el = (tag: string, v: string | number | undefined, attrs = '') => (v === undefined || v === '' ? '' : `<${tag}${attrs}>${typeof v === 'number' ? v : esc(v)}</${tag}>`);
const d102 = (iso: string) => iso.replace(/-/g, '');

export type CiiProfile = 'EN16931' | 'XRECHNUNG';
export const CII_GUIDELINE: Record<CiiProfile, string> = { EN16931: P.standards.en16931Id, XRECHNUNG: P.standards.xrCustomization };

/* ------------------------------------------------------------------ UBL / XRechnung */
function ublParty(p: Party, seller: boolean): string {
  const A = p.address, C = p.contact;
  return `<cac:Party>${el('cbc:EndpointID', p.endpoint, ` schemeID="${esc(p.endpointScheme || 'EM')}"`)}`
    + (p.id ? `<cac:PartyIdentification>${el('cbc:ID', p.id)}</cac:PartyIdentification>` : '')
    + (p.tradingName ? `<cac:PartyName>${el('cbc:Name', p.tradingName)}</cac:PartyName>` : '')
    + `<cac:PostalAddress>${el('cbc:StreetName', A.street)}${el('cbc:AdditionalStreetName', A.street2)}${el('cbc:CityName', A.city)}${el('cbc:PostalZone', A.zip)}<cac:Country>${el('cbc:IdentificationCode', A.country || 'DE')}</cac:Country></cac:PostalAddress>`
    + (p.vatId ? `<cac:PartyTaxScheme>${el('cbc:CompanyID', p.vatId)}<cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>` : '')
    + (seller && p.taxNo ? `<cac:PartyTaxScheme>${el('cbc:CompanyID', p.taxNo)}<cac:TaxScheme><cbc:ID>FC</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>` : '')
    + `<cac:PartyLegalEntity>${el('cbc:RegistrationName', p.name)}${el('cbc:CompanyID', p.legalId)}${seller ? el('cbc:CompanyLegalForm', p.legalInfo) : ''}</cac:PartyLegalEntity>`
    + (C && (C.name || C.phone || C.email) ? `<cac:Contact>${el('cbc:Name', C.name)}${el('cbc:Telephone', C.phone)}${el('cbc:ElectronicMail', C.email)}</cac:Contact>` : '')
    + '</cac:Party>';
}
const ublTaxCat = (tag: string, cat: string, rate: number | undefined, reason?: string, code?: string) =>
  `<cac:${tag}><cbc:ID>${esc(cat)}</cbc:ID><cbc:Percent>${q4(rate ?? 0)}</cbc:Percent>${el('cbc:TaxExemptionReasonCode', code)}${el('cbc:TaxExemptionReason', reason)}<cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:${tag}>`;
function ublLine(l: Line, cur: string): string {
  return `<cac:InvoiceLine>${el('cbc:ID', l.id)}${el('cbc:Note', l.note)}<cbc:InvoicedQuantity unitCode="${esc(l.unit)}">${q4(l.qty)}</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="${cur}">${a2(l.net)}</cbc:LineExtensionAmount>`
    + `<cac:Item>${el('cbc:Description', l.description)}${el('cbc:Name', l.name)}<cac:ClassifiedTaxCategory><cbc:ID>${esc(l.vatCat)}</cbc:ID><cbc:Percent>${q4(l.vatRate ?? 0)}</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory></cac:Item>`
    + `<cac:Price><cbc:PriceAmount currencyID="${cur}">${q4(l.price)}</cbc:PriceAmount>${l.baseQty && l.baseQty !== 1 ? `<cbc:BaseQuantity unitCode="${esc(l.unit)}">${q4(l.baseQty)}</cbc:BaseQuantity>` : ''}</cac:Price></cac:InvoiceLine>`;
}
export function toUBL(inv: Invoice): string {
  const cur = esc(inv.currency || 'EUR'), T = inv.totals, pay = inv.payment;
  const amt = (tag: string, v: number | undefined) => (v === undefined ? '' : `<cbc:${tag} currencyID="${cur}">${a2(v)}</cbc:${tag}>`);
  return '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<ubl:Invoice xmlns:ubl="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">'
    + `<cbc:CustomizationID>${esc(P.standards.xrCustomization)}</cbc:CustomizationID><cbc:ProfileID>${esc(P.standards.peppolProfile)}</cbc:ProfileID>`
    + el('cbc:ID', inv.number) + el('cbc:IssueDate', inv.issueDate) + el('cbc:DueDate', inv.dueDate) + el('cbc:InvoiceTypeCode', inv.typeCode || '380')
    + inv.notes.map((n) => el('cbc:Note', n)).join('') + `<cbc:DocumentCurrencyCode>${cur}</cbc:DocumentCurrencyCode>` + el('cbc:BuyerReference', inv.buyerReference)
    + (inv.periodStart || inv.periodEnd ? `<cac:InvoicePeriod>${el('cbc:StartDate', inv.periodStart)}${el('cbc:EndDate', inv.periodEnd)}</cac:InvoicePeriod>` : '')
    + (inv.orderRef ? `<cac:OrderReference>${el('cbc:ID', inv.orderRef)}</cac:OrderReference>` : '')
    + (inv.precedingInvoice ? `<cac:BillingReference><cac:InvoiceDocumentReference>${el('cbc:ID', inv.precedingInvoice)}</cac:InvoiceDocumentReference></cac:BillingReference>` : '')
    + (inv.contractRef ? `<cac:ContractDocumentReference>${el('cbc:ID', inv.contractRef)}</cac:ContractDocumentReference>` : '')
    + `<cac:AccountingSupplierParty>${ublParty(inv.seller, true)}</cac:AccountingSupplierParty><cac:AccountingCustomerParty>${ublParty(inv.buyer, false)}</cac:AccountingCustomerParty>`
    + (inv.deliveryDate ? `<cac:Delivery>${el('cbc:ActualDeliveryDate', inv.deliveryDate)}</cac:Delivery>` : '')
    + (pay.meansCode ? `<cac:PaymentMeans>${el('cbc:PaymentMeansCode', pay.meansCode)}${el('cbc:PaymentID', pay.remittance)}${pay.iban ? `<cac:PayeeFinancialAccount>${el('cbc:ID', pay.iban.replace(/\s+/g, ''))}${el('cbc:Name', pay.accountName)}${pay.bic ? `<cac:FinancialInstitutionBranch>${el('cbc:ID', pay.bic)}</cac:FinancialInstitutionBranch>` : ''}</cac:PayeeFinancialAccount>` : ''}</cac:PaymentMeans>` : '')
    + (pay.terms ? `<cac:PaymentTerms>${el('cbc:Note', pay.terms)}</cac:PaymentTerms>` : '')
    + inv.allowancesCharges.map((x) => `<cac:AllowanceCharge><cbc:ChargeIndicator>${x.charge}</cbc:ChargeIndicator>${el('cbc:AllowanceChargeReason', x.reason)}<cbc:Amount currencyID="${cur}">${a2(x.amount)}</cbc:Amount>${ublTaxCat('TaxCategory', x.vatCat, x.vatRate)}</cac:AllowanceCharge>`).join('')
    + `<cac:TaxTotal>${amt('TaxAmount', T.vatTotal ?? 0)}${inv.vat.map((v) => `<cac:TaxSubtotal>${amt('TaxableAmount', v.base)}${amt('TaxAmount', v.amount)}${ublTaxCat('TaxCategory', v.cat, v.rate, v.exemptionReason, v.exemptionCode)}</cac:TaxSubtotal>`).join('')}</cac:TaxTotal>`
    + `<cac:LegalMonetaryTotal>${amt('LineExtensionAmount', T.lineNet)}${amt('TaxExclusiveAmount', T.taxExclusive)}${amt('TaxInclusiveAmount', T.taxInclusive)}${amt('AllowanceTotalAmount', T.allowances)}${amt('ChargeTotalAmount', T.charges)}${amt('PrepaidAmount', T.prepaid)}${amt('PayableRoundingAmount', T.rounding)}${amt('PayableAmount', T.payable)}</cac:LegalMonetaryTotal>`
    + inv.lines.map((l) => ublLine(l, cur)).join('')
    + '</ubl:Invoice>\n';
}

/* ------------------------------------------------------------------ CII / ZUGFeRD */
function ciiParty(tag: string, p: Party, seller: boolean): string {
  const A = p.address, C = p.contact;
  return `<ram:${tag}>${el('ram:ID', p.id)}${el('ram:Name', p.name)}${seller ? el('ram:Description', p.legalInfo) : ''}`
    + (p.legalId || p.tradingName ? `<ram:SpecifiedLegalOrganization>${el('ram:ID', p.legalId)}${el('ram:TradingBusinessName', p.tradingName)}</ram:SpecifiedLegalOrganization>` : '')
    + (C && (C.name || C.phone || C.email) ? `<ram:DefinedTradeContact>${el('ram:PersonName', C.name)}${C.phone ? `<ram:TelephoneUniversalCommunication>${el('ram:CompleteNumber', C.phone)}</ram:TelephoneUniversalCommunication>` : ''}${C.email ? `<ram:EmailURIUniversalCommunication>${el('ram:URIID', C.email)}</ram:EmailURIUniversalCommunication>` : ''}</ram:DefinedTradeContact>` : '')
    + `<ram:PostalTradeAddress>${el('ram:PostcodeCode', A.zip)}${el('ram:LineOne', A.street)}${el('ram:LineTwo', A.street2)}${el('ram:CityName', A.city)}${el('ram:CountryID', A.country || 'DE')}</ram:PostalTradeAddress>`
    + (p.endpoint ? `<ram:URIUniversalCommunication><ram:URIID schemeID="${esc(p.endpointScheme || 'EM')}">${esc(p.endpoint)}</ram:URIID></ram:URIUniversalCommunication>` : '')
    + (p.vatId ? `<ram:SpecifiedTaxRegistration><ram:ID schemeID="VA">${esc(p.vatId)}</ram:ID></ram:SpecifiedTaxRegistration>` : '')
    + (seller && p.taxNo ? `<ram:SpecifiedTaxRegistration><ram:ID schemeID="FC">${esc(p.taxNo)}</ram:ID></ram:SpecifiedTaxRegistration>` : '')
    + `</ram:${tag}>`;
}
const dt = (tag: string, iso?: string) => (iso ? `<ram:${tag}><udt:DateTimeString format="102">${d102(iso)}</udt:DateTimeString></ram:${tag}>` : '');
export function toCII(inv: Invoice, profile: CiiProfile = 'EN16931'): string {
  const cur = esc(inv.currency || 'EUR'), T = inv.totals, pay = inv.payment;
  const lines = inv.lines.map((l) => `<ram:IncludedSupplyChainTradeLineItem><ram:AssociatedDocumentLineDocument>${el('ram:LineID', l.id)}${l.note ? `<ram:IncludedNote>${el('ram:Content', l.note)}</ram:IncludedNote>` : ''}</ram:AssociatedDocumentLineDocument>`
    + `<ram:SpecifiedTradeProduct>${el('ram:Name', l.name)}${el('ram:Description', l.description)}</ram:SpecifiedTradeProduct>`
    + `<ram:SpecifiedLineTradeAgreement><ram:NetPriceProductTradePrice><ram:ChargeAmount>${q4(l.price)}</ram:ChargeAmount>${l.baseQty && l.baseQty !== 1 ? `<ram:BasisQuantity unitCode="${esc(l.unit)}">${q4(l.baseQty)}</ram:BasisQuantity>` : ''}</ram:NetPriceProductTradePrice></ram:SpecifiedLineTradeAgreement>`
    + `<ram:SpecifiedLineTradeDelivery><ram:BilledQuantity unitCode="${esc(l.unit)}">${q4(l.qty)}</ram:BilledQuantity></ram:SpecifiedLineTradeDelivery>`
    + `<ram:SpecifiedLineTradeSettlement><ram:ApplicableTradeTax><ram:TypeCode>VAT</ram:TypeCode><ram:CategoryCode>${esc(l.vatCat)}</ram:CategoryCode><ram:RateApplicablePercent>${q4(l.vatRate ?? 0)}</ram:RateApplicablePercent></ram:ApplicableTradeTax>`
    + `<ram:SpecifiedTradeSettlementLineMonetarySummation><ram:LineTotalAmount>${a2(l.net)}</ram:LineTotalAmount></ram:SpecifiedTradeSettlementLineMonetarySummation></ram:SpecifiedLineTradeSettlement></ram:IncludedSupplyChainTradeLineItem>`).join('');
  const n = (tag: string, v?: number, attr = '') => (v === undefined ? '' : `<ram:${tag}${attr}>${a2(v)}</ram:${tag}>`);
  return '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" xmlns:qdt="urn:un:unece:uncefact:data:standard:QualifiedDataType:100" xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">'
    + `<rsm:ExchangedDocumentContext>${profile === 'XRECHNUNG' ? `<ram:BusinessProcessSpecifiedDocumentContextParameter><ram:ID>${esc(P.standards.peppolProfile)}</ram:ID></ram:BusinessProcessSpecifiedDocumentContextParameter>` : ''}<ram:GuidelineSpecifiedDocumentContextParameter><ram:ID>${esc(CII_GUIDELINE[profile])}</ram:ID></ram:GuidelineSpecifiedDocumentContextParameter></rsm:ExchangedDocumentContext>`
    + `<rsm:ExchangedDocument>${el('ram:ID', inv.number)}${el('ram:TypeCode', inv.typeCode || '380')}${dt('IssueDateTime', inv.issueDate)}${inv.notes.map((x) => `<ram:IncludedNote>${el('ram:Content', x)}</ram:IncludedNote>`).join('')}</rsm:ExchangedDocument>`
    + `<rsm:SupplyChainTradeTransaction>${lines}`
    + `<ram:ApplicableHeaderTradeAgreement>${el('ram:BuyerReference', inv.buyerReference)}${ciiParty('SellerTradeParty', inv.seller, true)}${ciiParty('BuyerTradeParty', inv.buyer, false)}`
    + (inv.orderRef ? `<ram:BuyerOrderReferencedDocument>${el('ram:IssuerAssignedID', inv.orderRef)}</ram:BuyerOrderReferencedDocument>` : '')
    + (inv.contractRef ? `<ram:ContractReferencedDocument>${el('ram:IssuerAssignedID', inv.contractRef)}</ram:ContractReferencedDocument>` : '')
    + `</ram:ApplicableHeaderTradeAgreement>`
    + `<ram:ApplicableHeaderTradeDelivery>${inv.deliveryDate ? `<ram:ActualDeliverySupplyChainEvent>${dt('OccurrenceDateTime', inv.deliveryDate)}</ram:ActualDeliverySupplyChainEvent>` : ''}</ram:ApplicableHeaderTradeDelivery>`
    + `<ram:ApplicableHeaderTradeSettlement>${el('ram:PaymentReference', pay.remittance)}<ram:InvoiceCurrencyCode>${cur}</ram:InvoiceCurrencyCode>`
    + (pay.meansCode ? `<ram:SpecifiedTradeSettlementPaymentMeans>${el('ram:TypeCode', pay.meansCode)}${pay.iban ? `<ram:PayeePartyCreditorFinancialAccount>${el('ram:IBANID', pay.iban.replace(/\s+/g, ''))}${el('ram:AccountName', pay.accountName)}</ram:PayeePartyCreditorFinancialAccount>` : ''}${pay.bic ? `<ram:PayeeSpecifiedCreditorFinancialInstitution>${el('ram:BICID', pay.bic)}</ram:PayeeSpecifiedCreditorFinancialInstitution>` : ''}</ram:SpecifiedTradeSettlementPaymentMeans>` : '')
    + inv.vat.map((v) => `<ram:ApplicableTradeTax>${n('CalculatedAmount', v.amount)}<ram:TypeCode>VAT</ram:TypeCode>${el('ram:ExemptionReason', v.exemptionReason)}${n('BasisAmount', v.base)}<ram:CategoryCode>${esc(v.cat)}</ram:CategoryCode>${el('ram:ExemptionReasonCode', v.exemptionCode)}<ram:RateApplicablePercent>${q4(v.rate ?? 0)}</ram:RateApplicablePercent></ram:ApplicableTradeTax>`).join('')
    + (inv.periodStart || inv.periodEnd ? `<ram:BillingSpecifiedPeriod>${dt('StartDateTime', inv.periodStart)}${dt('EndDateTime', inv.periodEnd)}</ram:BillingSpecifiedPeriod>` : '')
    + inv.allowancesCharges.map((x) => `<ram:SpecifiedTradeAllowanceCharge><ram:ChargeIndicator><udt:Indicator>${x.charge}</udt:Indicator></ram:ChargeIndicator>${n('ActualAmount', x.amount)}${el('ram:Reason', x.reason)}<ram:CategoryTradeTax><ram:TypeCode>VAT</ram:TypeCode><ram:CategoryCode>${esc(x.vatCat)}</ram:CategoryCode><ram:RateApplicablePercent>${q4(x.vatRate ?? 0)}</ram:RateApplicablePercent></ram:CategoryTradeTax></ram:SpecifiedTradeAllowanceCharge>`).join('')
    + (pay.terms || inv.dueDate ? `<ram:SpecifiedTradePaymentTerms>${el('ram:Description', pay.terms)}${dt('DueDateDateTime', inv.dueDate)}</ram:SpecifiedTradePaymentTerms>` : '')
    + `<ram:SpecifiedTradeSettlementHeaderMonetarySummation>${n('LineTotalAmount', T.lineNet)}${n('ChargeTotalAmount', T.charges)}${n('AllowanceTotalAmount', T.allowances)}${n('TaxBasisTotalAmount', T.taxExclusive)}${n('TaxTotalAmount', T.vatTotal ?? 0, ` currencyID="${cur}"`)}${n('RoundingAmount', T.rounding)}${n('GrandTotalAmount', T.taxInclusive)}${n('TotalPrepaidAmount', T.prepaid)}${n('DuePayableAmount', T.payable)}</ram:SpecifiedTradeSettlementHeaderMonetarySummation>`
    + (inv.precedingInvoice ? `<ram:InvoiceReferencedDocument>${el('ram:IssuerAssignedID', inv.precedingInvoice)}</ram:InvoiceReferencedDocument>` : '')
    + `</ram:ApplicableHeaderTradeSettlement></rsm:SupplyChainTradeTransaction></rsm:CrossIndustryInvoice>\n`;
}
