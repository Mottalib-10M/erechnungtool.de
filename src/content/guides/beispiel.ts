import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formatMoney } from '../../lib/format';

/* Exemples : quatre factures fictives de engine/beispiele.ts, totaux calculés par computeTotals.
   Les fichiers générés (UBL, CII XRECHNUNG) sont « acceptable » au validateur KoSIT 1.6.3 / XRechnung 3.0.2 ; les PDF passent veraPDF (PDF/A-3b). */
const STD = K.beispiel('standard'), KL = K.beispiel('klein'), RC = K.beispiel('reverse'), BU = K.beispiel('bund');
const ST = K.P.steuer;

export default defineGuide({
  id: 'beispiel', group: 'werkzeuge', order: 8,
  tool: 'beispiel',
  related: ['erstellen', 'en-16931', 'xrechnung', 'kleinunternehmer', 'leitweg'],
  sources: ['kosit-xrechnung', 'kosit-validator', 'ustg14', 'ustg19', 'erechv'],
  de: {
    slug: 'e-rechnung-beispiel',
    nav: 'E-Rechnung Beispiel', card: 'Vier fertige Musterrechnungen als XRechnung und ZUGFeRD zum Ansehen und Laden',
    title: 'E-Rechnung Beispiel 2026: XRechnung und ZUGFeRD als Muster',
    description: 'E-Rechnung Beispiel 2026: vier Musterrechnungen mit erfundenen Daten als XRechnung (UBL, CII) und ZUGFeRD-PDF, mit Erklärung jedes Pflichtfelds. Gratis laden.',
    h1: 'E-Rechnung Beispiel: vier Musterrechnungen zum Ansehen und Laden',
    intro: 'Fall und Syntax wählen: Die Musterrechnung erscheint lesbar und lässt sich als XRechnung oder als ZUGFeRD-PDF herunterladen. Alle Daten sind erfunden.',
    resume: `Eine Beispielrechnung zeigt am schnellsten, wie eine E-Rechnung aufgebaut ist. Auf dieser Seite stehen vier Fälle mit erfundenen Daten bereit: eine Dienstleistung mit ${ST.regel} und ${ST.ermaessigt} Prozent Umsatzsteuer über ${formatMoney(STD.totals.payable, 2, 'de')}, die Rechnung eines Kleinunternehmers nach § 19 UStG ohne Steuer, eine Bauleistung mit Umkehr der Steuerschuld nach § 13b UStG und eine Rechnung an eine Bundesbehörde mit Leitweg-ID. Jede lässt sich als XRechnung in UBL- oder CII-Syntax und als ZUGFeRD-PDF herunterladen. Die Beträge rechnet das Programm aus den Positionen, nicht von Hand, und die erzeugten XML-Dateien hat Radif Partners mit dem amtlichen Validator der KoSIT für XRechnung ${K.P.standards.xrechnung} geprüft: Alle vier Fälle werden in beiden Syntaxen als gültig angenommen. Die Muster eignen sich, um das eigene Programm zu testen, den Empfang beim Kunden auszuprobieren oder die Felder der Norm EN 16931 kennenzulernen. Als echte Rechnung verwenden dürfen Sie sie nicht: Namen, Steuernummern, IBAN und Leitweg-ID sind fiktiv.`,
    faqs: [
      { q: 'Darf ich die Beispielrechnungen als Vorlage für eigene Rechnungen nutzen?', a: 'Als Anschauung ja, als Datei nein. Die Muster enthalten erfundene Namen, Steuernummern und eine IBAN, die nur die Prüfziffer besteht. Wer eine eigene Rechnung braucht, öffnet den Rechnungsersteller: Er startet mit denselben Beispieldaten, die Sie Feld für Feld durch Ihre ersetzen, und prüft das Ergebnis vor dem Download.' },
      { q: 'Warum gibt es jedes Beispiel in UBL und in CII?', a: 'Die XRechnung ist in zwei XML-Syntaxen zugelassen, UBL und UN/CEFACT CII. Beide bilden dieselben Felder der Norm EN 16931 ab, nur mit anderen Elementnamen und anderer Reihenfolge. Manche Empfänger und Programme bevorzugen eine der beiden. ZUGFeRD verwendet immer CII; die eingebettete XML entspricht deshalb dem CII-Beispiel.' },
      { q: 'Was zeigt das Beispiel für Kleinunternehmer?', a: 'Die Position trägt die Steuerkategorie E für steuerbefreit, es fällt keine Steuer an, und in der Steueraufschlüsselung steht der Befreiungsgrund mit Verweis auf § 19 UStG. Weil der Kleinunternehmer keine USt-IdNr. hat, steht seine Steuernummer zusätzlich als Kennung des Verkäufers in der Datei; ohne diese Angabe lehnt der Validator der KoSIT die Rechnung ab.' },
      { q: 'Kann ich mit den Beispielen eine Rechnungsplattform testen?', a: 'Für Tests von Programmen und Abläufen im eigenen Haus eignen sich die Dateien gut. An echte Rechnungseingänge von Behörden oder Kunden sollten Sie sie nicht schicken, denn sie würden dort als echte Rechnung verbucht oder als Fehler gemeldet. Öffentliche Plattformen haben eigene Testumgebungen; die Zugänge nennt der jeweilige Betreiber.' },
    ],
    body: (h) => `
<h2>Die vier Fälle im Überblick</h2>
${h.table(['Fall', 'Besonderheit', 'Netto', 'Steuer', 'Zahlbetrag'], [
  ['Dienstleistung', `${ST.regel} % und ${ST.ermaessigt} %`, h.eur(STD.totals.taxExclusive, 2), h.eur(STD.totals.vatTotal ?? 0, 2), h.eur(STD.totals.payable, 2)],
  ['Kleinunternehmer', 'Kategorie E, § 19 UStG', h.eur(KL.totals.taxExclusive, 2), h.eur(KL.totals.vatTotal ?? 0, 2), h.eur(KL.totals.payable, 2)],
  ['Bauleistung', 'Kategorie AE, § 13b UStG', h.eur(RC.totals.taxExclusive, 2), h.eur(RC.totals.vatTotal ?? 0, 2), h.eur(RC.totals.payable, 2)],
  ['Bundesbehörde', 'Leitweg-ID, Bestellnummer', h.eur(BU.totals.taxExclusive, 2), h.eur(BU.totals.vatTotal ?? 0, 2), h.eur(BU.totals.payable, 2)],
], 'Beträge der Musterrechnungen, aus den Positionen berechnet.', ['l', 'l', 'r', 'r', 'r'])}
<h2>Fall 1: Dienstleistung mit zwei Steuersätzen</h2>
<p>Eine Webagentur berechnet einem Händler ${h.n(STD.lines[0].qty)} Stunden Gestaltung zu ${h.eur(STD.lines[0].price, 2)}, einen Monat Hosting und zwei Fachbücher. Die ersten beiden Positionen tragen ${ST.regel} Prozent, die Bücher ${ST.ermaessigt} Prozent. In der E-Rechnung führt das zu zwei Zeilen in der Steueraufschlüsselung (BG-23): eine je Kombination aus Kategorie und Satz, jede mit Bemessungsgrundlage und Steuerbetrag. Die Summe der Steuerbeträge ergibt das Feld BT-110, die Summe aus Netto und Steuer den Bruttobetrag BT-112. Weicht eine dieser Summen um einen Cent ab, meldet die Prüfung einen Fehler nach den Regeln BR-CO-14 oder BR-CO-15.</p>
<h2>Fall 2: Kleinunternehmerin ohne Umsatzsteuer</h2>
<p>Eine Fotografin rechnet einen halben Tag Produktfotos pauschal mit ${h.eur(KL.lines[0].price)} ab. Sie ist Kleinunternehmerin nach ${h.src('ustg19', '§ 19 UStG')}, weist also keine Steuer aus. Die Position bekommt die Kategorie E, die Aufschlüsselung den Befreiungsgrund in BT-120. Ausstellen müsste sie keine E-Rechnung, denn Kleinunternehmer dürfen immer auch eine sonstige Rechnung schreiben. Das Muster zeigt, wie es aussieht, wenn sie es freiwillig tut. Eine Falle steckt im Detail: Ohne USt-IdNr. verlangt die Regel BR-CO-26 eine andere Kennung des Verkäufers, hier die Steuernummer.</p>
<h2>Fall 3: Bauleistung mit Reverse Charge</h2>
<p>Ein Bauunternehmen verlegt ${h.n(RC.lines[0].qty)} Quadratmeter Estrich für einen anderen Bauunternehmer. Nach § 13b UStG schuldet der Empfänger die Steuer, die Rechnung weist sie deshalb nicht aus. Die Position trägt die Kategorie AE, der Befreiungsgrund nennt die Steuerschuldnerschaft des Leistungsempfängers, und beide Seiten müssen ihre USt-IdNr. angeben. Fehlt die des Käufers, schlägt die Regel BR-AE-02 an.</p>
<h2>Fall 4: Rechnung an eine Bundesbehörde</h2>
<p>Dieselbe Agentur rechnet gegenüber einer fiktiven Bundesbehörde ab. Hier gilt die ${h.src('erechv', 'E-Rechnungsverordnung')}: Die Rechnung braucht die Leitweg-ID ${BU.buyerReference} als Käuferreferenz im Feld BT-10 und als elektronische Adresse des Käufers mit dem Schema 0204. Dazu kommt die Bestellnummer des Auftraggebers. Welche Felder für Ihren eigenen Fall Pflicht sind, zeigt der kleine Rechner:</p>
${h.mini('felder', { p: ['steuer', 'empf'], c: 'Alle Pflichtfelder anzeigen' })}
<h2>Wie die Muster geprüft wurden</h2>
<p>Die Dateien entstehen bei jedem Aufruf neu aus denselben Daten, mit demselben Programmteil, der auch den Rechnungsersteller antreibt. Vor der Veröffentlichung hat Radif Partners alle vier Fälle in UBL und CII mit dem ${h.src('kosit-validator', 'Validator der KoSIT')} und der Konfiguration für ${h.src('kosit-xrechnung', `XRechnung ${K.P.standards.xrechnung}`)} geprüft; alle acht Dateien wurden angenommen. Die ZUGFeRD-PDFs bestehen die Prüfung auf PDF/A-3. Eigene Rechnungen schreiben Sie mit dem ${h.a('erstellen', 'Rechnungsersteller')}; welche Felder die Norm vorgibt, erklärt ${h.a('en-16931', 'EN 16931')}.</p>
`,
  },
  en: {
    slug: 'e-invoice-example',
    nav: 'E-invoice example', card: 'Four ready-made sample invoices as XRechnung and ZUGFeRD to view and download',
    title: 'E-Invoice Example 2026: XRechnung and ZUGFeRD Samples',
    description: 'E-invoice examples 2026: four sample invoices with made-up data as XRechnung (UBL, CII) and ZUGFeRD PDF, with every mandatory field explained. Free download.',
    h1: 'E-invoice examples: four sample invoices to view and download',
    intro: 'Choose a case and a syntax: the sample invoice appears in readable form and can be downloaded as an XRechnung or a ZUGFeRD PDF. All data is made up.',
    resume: `A sample invoice is the quickest way to see how an e-invoice is built. This page offers four cases with made-up data: a service invoice at ${ST.regel} and ${ST.ermaessigt} percent VAT totalling ${formatMoney(STD.totals.payable, 2, 'en')}, the invoice of a small business under section 19 of the German VAT Act with no VAT, a construction service under the reverse charge of section 13b, and an invoice to a federal authority with a Leitweg-ID. Each can be downloaded as an XRechnung in UBL or CII syntax and as a ZUGFeRD PDF. The software works out the amounts from the line items rather than by hand, and Radif Partners checked the generated XML files with the official KoSIT validator for XRechnung ${K.P.standards.xrechnung}: all four cases are accepted in both syntaxes. The samples are useful for testing your own software, trying out receipt at a customer, or getting to know the fields of the standard EN 16931. You may not use them as a real invoice: names, tax numbers, IBAN and Leitweg-ID are fictitious.`,
    faqs: [
      { q: 'May I use the sample invoices as a template for my own?', a: 'As an illustration yes, as a file no. The samples contain made-up names, tax numbers and an IBAN that only passes the check digit test. If you need an invoice of your own, open the invoice creator: it starts with the same sample data, which you replace field by field with yours, and it checks the result before download.' },
      { q: 'Why is every example offered in both UBL and CII?', a: 'XRechnung is allowed in two XML syntaxes, UBL and UN/CEFACT CII. Both carry the same EN 16931 fields, only with different element names and order. Some recipients and programs prefer one of the two. ZUGFeRD always uses CII, so the embedded XML matches the CII example.' },
      { q: 'What does the small-business example show?', a: 'The line carries VAT category E for exempt, the VAT amount is zero, and the VAT breakdown states the exemption reason with a reference to section 19 UStG. Because the small business has no VAT ID, its tax number also appears as the seller identifier in the file; without it the KoSIT validator rejects the invoice.' },
      { q: 'Can I test an invoice platform with these examples?', a: 'The files are well suited to testing software and workflows in-house. Do not send them to live invoice inboxes of authorities or customers, where they would be booked as real invoices or reported as errors. Public platforms have their own test environments, and the operator tells you how to access them.' },
    ],
    body: (h) => `
<h2>The four cases at a glance</h2>
${h.table(['Case', 'Feature', 'Net', 'VAT', 'Amount due'], [
  ['Service', `${ST.regel}% and ${ST.ermaessigt}%`, h.eur(STD.totals.taxExclusive, 2), h.eur(STD.totals.vatTotal ?? 0, 2), h.eur(STD.totals.payable, 2)],
  ['Small business', 'category E, section 19 UStG', h.eur(KL.totals.taxExclusive, 2), h.eur(KL.totals.vatTotal ?? 0, 2), h.eur(KL.totals.payable, 2)],
  ['Construction', 'category AE, section 13b UStG', h.eur(RC.totals.taxExclusive, 2), h.eur(RC.totals.vatTotal ?? 0, 2), h.eur(RC.totals.payable, 2)],
  ['Federal authority', 'Leitweg-ID, order number', h.eur(BU.totals.taxExclusive, 2), h.eur(BU.totals.vatTotal ?? 0, 2), h.eur(BU.totals.payable, 2)],
], 'Amounts of the sample invoices, calculated from the line items.', ['l', 'l', 'r', 'r', 'r'])}
<h2>Case 1: a service at two VAT rates</h2>
<p>A web agency bills a retailer for ${h.n(STD.lines[0].qty)} hours of design at ${h.eur(STD.lines[0].price, 2)}, one month of hosting and two reference books. The first two lines carry ${ST.regel} percent, the books ${ST.ermaessigt} percent. In the e-invoice this gives two lines in the VAT breakdown (BG-23): one per combination of category and rate, each with taxable amount and VAT amount. The sum of the VAT amounts fills field BT-110, net plus VAT gives the gross amount BT-112. If any of these totals is off by one cent, the check reports an error under rules BR-CO-14 or BR-CO-15.</p>
<h2>Case 2: a small business without VAT</h2>
<p>A photographer bills half a day of product photos as a lump sum of ${h.eur(KL.lines[0].price)}. She is a small business under ${h.src('ustg19', 'section 19 UStG')}, so she shows no VAT. The line gets category E, the breakdown the exemption reason in BT-120. She would not have to issue an e-invoice, because small businesses may always write an ordinary invoice; the sample shows what it looks like when she does so voluntarily. One trap hides in the detail: without a VAT ID, rule BR-CO-26 requires another seller identifier, here the tax number.</p>
<h2>Case 3: construction under the reverse charge</h2>
<p>A building firm lays ${h.n(RC.lines[0].qty)} square metres of screed for another construction business. Under section 13b UStG the recipient owes the VAT, so the invoice does not show it. The line carries category AE, the exemption reason names the reverse charge, and both sides must state their VAT ID. If the buyer’s is missing, rule BR-AE-02 fires.</p>
<h2>Case 4: an invoice to a federal authority</h2>
<p>The same agency bills a fictitious federal authority. Here the ${h.src('erechv', 'E-Invoicing Regulation')} applies: the invoice needs the Leitweg-ID ${BU.buyerReference} as buyer reference in field BT-10 and as the buyer’s electronic address with scheme 0204, plus the contracting body’s order number. Which fields are mandatory in your own case is shown by the small calculator:</p>
${h.mini('felder', { p: ['steuer', 'empf'], c: 'Show all mandatory fields' })}
<h2>How the samples were checked</h2>
<p>The files are built afresh on every visit from the same data, by the same code that drives the invoice creator. Before publication Radif Partners checked all four cases in UBL and CII with the ${h.src('kosit-validator', 'KoSIT validator')} and the configuration for ${h.src('kosit-xrechnung', `XRechnung ${K.P.standards.xrechnung}`)}; all eight files were accepted. The ZUGFeRD PDFs pass the PDF/A-3 check. Write your own invoices with the ${h.a('erstellen', 'invoice creator')}; the fields the standard requires are explained on ${h.a('en-16931', 'EN 16931')}.</p>
`,
  },
});
