/**
 * Erfundene Beispielrechnungen (Namen, Adressen, IBAN und Leitweg-ID sind fiktiv, die IBAN besteht nur
 * die Prüfziffernprobe). Dienen als Startwerte des Erstellers, als Vorschau des Viewers und als Downloads
 * auf der Beispielseite. Summen werden mit computeTotals gerechnet, nie getippt.
 */
import { computeTotals, emptyInvoice, type Invoice } from './invoice';
import P from '../../data/params-2026.json';

export type Szenario = 'standard' | 'klein' | 'reverse' | 'bund';
export const SZENARIEN: Szenario[] = ['standard', 'klein', 'reverse', 'bund'];

const seller = () => ({
  name: 'Muster Webdesign GmbH', address: { street: 'Beispielweg 12', zip: '10115', city: 'Berlin', country: 'DE' },
  vatId: 'DE123456789', taxNo: '30/123/45678', legalInfo: 'Amtsgericht Charlottenburg HRB 000000',
  endpoint: 'rechnung@muster-webdesign.example', endpointScheme: 'EM',
  contact: { name: 'Buchhaltung', phone: '+49 30 0000000', email: 'rechnung@muster-webdesign.example' },
});

export function beispiel(s: Szenario, lang: 'de' | 'en' = 'de'): Invoice {
  const de = lang === 'de';
  const inv = emptyInvoice();
  inv.number = s === 'bund' ? 'RE-2026-0417' : s === 'klein' ? '2026-031' : 'RE-2026-0415';
  inv.issueDate = P.retrieved_at; inv.typeCode = '380'; inv.currency = 'EUR';
  inv.deliveryDate = '2026-10-20'; inv.dueDate = '2026-11-08';
  inv.buyerReference = '-';
  inv.seller = seller();
  inv.buyer = { name: 'Beispiel Handel KG', address: { street: 'Musterstraße 5', zip: '50667', city: 'Köln', country: 'DE' }, vatId: 'DE987654321', endpoint: 'eingang@beispiel-handel.example', endpointScheme: 'EM' };
  inv.payment = { meansCode: '58', iban: 'DE02120300000000202051', accountName: 'Muster Webdesign GmbH', terms: de ? 'Zahlbar innerhalb von 14 Tagen ohne Abzug.' : 'Payable within 14 days without deduction.' };
  const R = P.steuer.regel, E7 = P.steuer.ermaessigt;
  inv.lines = [
    { id: '1', name: de ? 'Gestaltung Startseite' : 'Home page design', qty: 12, unit: 'HUR', price: 85, net: 0, vatCat: 'S', vatRate: R },
    { id: '2', name: de ? 'Hosting Oktober 2026' : 'Hosting October 2026', qty: 1, unit: 'MON', price: 29.9, net: 0, vatCat: 'S', vatRate: R },
  ];
  if (s === 'standard') {
    inv.lines.push({ id: '3', name: de ? 'Fachbuch Barrierefreiheit' : 'Accessibility handbook', qty: 2, unit: 'H87', price: 34.58, net: 0, vatCat: 'S', vatRate: E7 });
  }
  if (s === 'klein') {
    inv.seller = { name: 'Lena Beispiel Fotografie', address: { street: 'Am Markt 3', zip: '04109', city: 'Leipzig', country: 'DE' }, taxNo: '231/456/78901', id: '231/456/78901', endpoint: 'post@beispiel-foto.example', endpointScheme: 'EM', contact: { name: 'Lena Beispiel', phone: '+49 341 0000000', email: 'post@beispiel-foto.example' } };
    inv.payment.accountName = 'Lena Beispiel';
    inv.lines = [{ id: '1', name: de ? 'Produktfotos, Halbtag' : 'Product photos, half day', qty: 1, unit: 'LS', price: 480, net: 0, vatCat: 'E', vatRate: 0 }];
    inv.vat = [{ cat: 'E', rate: 0, base: 0, amount: 0, exemptionReason: de ? 'Steuerbefreit als Kleinunternehmer nach § 19 Abs. 1 UStG.' : 'Exempt as a small business under section 19(1) UStG.' }];
  }
  if (s === 'reverse') {
    inv.seller = { ...seller(), name: 'Muster Bau GmbH', endpoint: 'rechnung@muster-bau.example', contact: { name: 'Buchhaltung', phone: '+49 30 0000001', email: 'rechnung@muster-bau.example' } };
    inv.payment.accountName = 'Muster Bau GmbH';
    inv.lines = [{ id: '1', name: de ? 'Estricharbeiten Halle 2 (Bauleistung)' : 'Screed work, hall 2 (construction service)', qty: 140, unit: 'MTK', price: 32.5, net: 0, vatCat: 'AE', vatRate: 0 }];
    inv.vat = [{ cat: 'AE', rate: 0, base: 0, amount: 0, exemptionReason: de ? 'Steuerschuldnerschaft des Leistungsempfängers (§ 13b UStG).' : 'Reverse charge: the recipient owes the VAT (section 13b UStG).' }];
  }
  if (s === 'bund') {
    inv.buyer = { name: 'Bundesamt für Beispielwesen', address: { street: 'Behördenallee 1', zip: '53113', city: 'Bonn', country: 'DE' }, endpoint: '991-12345ABCDE-16', endpointScheme: '0204' };
    inv.buyerReference = '991-12345ABCDE-16';
    inv.orderRef = 'BEST-2026-118';
  }
  return computeTotals(inv);
}
