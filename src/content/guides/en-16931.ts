import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* EN 16931 : Richtlinie 2014/55/EU (Auftrag zur Norm), semantisches Modell BT/BG, Pflichtangaben § 14 Abs. 4 UStG, Kennung params.standards.en16931Id. Feldnummern wie in engine/invoice.ts. */
const S = K.P.standards;

export default defineGuide({
  id: 'en-16931', group: 'formate', order: 24,
  tool: 'felder', toolArg: { xr: 0 },
  related: ['xrechnung', 'zugferd', 'formate', 'was-ist', 'validator', 'erstellen'],
  sources: ['richtlinie-2014-55', 'ustg14', 'bmf-faq', 'kosit-xrechnung', 'ferd'],
  de: {
    slug: 'en-16931',
    nav: 'EN 16931', card: 'Die europäische Norm hinter jeder E-Rechnung: Datenmodell und Pflichtfelder',
    title: 'EN 16931 2026: Norm der E-Rechnung und ihre Pflichtfelder',
    description: 'EN 16931 einfach erklärt, Stand 2026: Business Terms, Gruppen und Regeln der europäischen Norm, ihr Bezug zu § 14 UStG und die Pflichtfelder für Ihren Fall.',
    h1: 'EN 16931: die Pflichtfelder der europäischen Norm',
    intro: 'Besteuerung und Empfänger wählen: Die Liste zeigt, welche Felder der Norm Ihre Rechnung füllen muss und welche davon auch das Umsatzsteuergesetz verlangt.',
    resume: `EN 16931 ist die europäische Norm für elektronische Rechnungen. Sie entstand im Auftrag der Richtlinie 2014/55/EU, die öffentliche Auftraggeber in der ganzen Union verpflichtet, Rechnungen nach dieser Norm anzunehmen, und wurde vom Europäischen Komitee für Normung (CEN) im Jahr 2017 veröffentlicht. Ihr Kern ist ein semantisches Datenmodell: Jede Angabe einer Rechnung hat einen Namen und eine Nummer, etwa BT-1 für die Rechnungsnummer oder BT-115 für den Zahlbetrag, und zusammengehörige Angaben bilden Gruppen wie BG-4 für den Verkäufer. Dazu kommen Geschäftsregeln mit Kennungen wie BR-01 oder BR-CO-15, die festlegen, welche Felder Pflicht sind und wie die Beträge zusammenhängen müssen. Wie das Modell als XML geschrieben wird, regeln zwei zugelassene Syntaxen, UBL und UN/CEFACT CII. Das deutsche Umsatzsteuergesetz knüpft seit 2025 die Definition der E-Rechnung an diese Norm. Nationale Ausprägungen wie die XRechnung schärfen sie nach, dürfen ihr aber nicht widersprechen. Kennung der reinen Norm im Feld BT-24 ist ${S.en16931Id}.`,
    faqs: [
      { q: 'Was bedeuten die Abkürzungen BT, BG und BR in der Norm?', a: 'BT steht für Business Term, eine einzelne Angabe wie Rechnungsdatum oder Steuersatz. BG steht für Business Group, eine Gruppe von Angaben, die zusammengehören, etwa die Anschrift des Käufers. BR steht für Business Rule, eine Regel, die Pflichtfelder und Rechenwege vorschreibt. Fehlermeldungen von Validatoren nennen meist eine BR-Kennung und das betroffene BT-Feld.' },
      { q: 'Muss ich die Norm EN 16931 kaufen, um E-Rechnungen zu schreiben?', a: 'Nein. Die Norm selbst ist ein kostenpflichtiges Dokument des CEN, aber für die Praxis brauchen Sie es nicht. Die Spezifikationen der XRechnung und von ZUGFeRD sind frei verfügbar und enthalten das vollständige Datenmodell mit allen Feldern und Regeln. Rechnungsprogramme und der Ersteller auf dieser Seite setzen die Norm um, ohne dass Sie die Feldnummern kennen müssen.' },
      { q: 'Wie hängen Rechenregeln wie BR-CO-15 mit meinen Beträgen zusammen?', a: 'Die Regeln mit CO prüfen, ob die Beträge zueinander passen. BR-CO-10 verlangt, dass die Summe der Positionen genau der Summe aller Nettobeträge entspricht. BR-CO-15 verlangt, dass der Bruttobetrag gleich Nettobetrag plus Steuer ist. Schon ein Cent Rundungsdifferenz verletzt die Regel. Der Validator dieser Seite rechnet alle Beträge nach und nennt die Abweichung.' },
      { q: 'Gilt die Norm auch für Gutschriften und Korrekturen?', a: 'Ja. Die Norm kennt verschiedene Rechnungsarten, die im Feld BT-3 mit einem Code stehen, zum Beispiel 380 für eine Rechnung, 381 für eine Gutschrift im Sinne einer Rechnungskorrektur und 384 für eine korrigierte Rechnung. Auch eine Korrektur muss alle Pflichtfelder enthalten und sollte in BT-25 auf die ursprüngliche Rechnung verweisen.' },
    ],
    body: (h) => `
<h2>Woher die Norm kommt</h2>
<p>Bis in die 2010er-Jahre hatte fast jedes Land und jede Branche eigene Formate für elektronische Rechnungen. Die ${h.src('richtlinie-2014-55', 'Richtlinie 2014/55/EU')} sollte das für öffentliche Aufträge vereinheitlichen. Sie beauftragte das CEN mit einer Norm für das semantische Datenmodell und verpflichtete die öffentlichen Auftraggeber der Mitgliedstaaten, Rechnungen nach dieser Norm anzunehmen und zu verarbeiten. Das Ergebnis ist die EN 16931, deren erster Teil 2017 erschien; daher die Jahreszahl in der Kennung.</p>
<p>Deutschland hat die Richtlinie für den Bund mit der E-Rechnungsverordnung umgesetzt. Seit der Neufassung von ${h.src('ustg14', '§ 14 UStG')} gilt die Norm auch für Rechnungen zwischen Unternehmen: Eine E-Rechnung muss ihr entsprechen, gleich in welchem Format sie verschickt wird.</p>
<h2>Datenmodell statt Dateiformat</h2>
<p>Die Norm sagt nicht, wie eine Datei aussieht, sondern welche Informationen sie trägt. Das ist ihr wichtigster Gedanke. Eine Rechnung besteht aus vielen solchen Angaben, von denen nur ein Teil Pflicht ist. Jede hat eine feste Bedeutung, einen Datentyp und eine Kardinalität, also ob sie fehlen, einmal oder mehrfach vorkommen darf. Weil alle Formate dasselbe Modell nutzen, kann ein Programm eine UBL-Datei in eine CII-Datei umwandeln, ohne dass Angaben verloren gehen.</p>
${h.table(['Gruppe', 'Inhalt', 'Beispiele für Felder'], [
  ['BG-4', 'Verkäufer', 'BT-27 Name, BT-31 USt-IdNr., BT-32 Steuernummer'],
  ['BG-7', 'Käufer', 'BT-44 Name, BT-48 USt-IdNr.'],
  ['BG-16', 'Zahlungsanweisungen', 'BT-81 Zahlungsart, BT-84 IBAN'],
  ['BG-22', 'Gesamtbeträge', 'BT-106 Summe Positionen, BT-109 netto, BT-112 brutto, BT-115 Zahlbetrag'],
  ['BG-23', 'Steueraufschlüsselung', 'BT-116 Bemessungsgrundlage, BT-117 Steuerbetrag, BT-118 Kategorie'],
  ['BG-25', 'Rechnungsposition', 'BT-129 Menge, BT-146 Preis, BT-153 Bezeichnung'],
], 'Ausgewählte Gruppen des semantischen Modells der EN 16931.', ['l', 'l', 'l'])}
<h2>Was das Umsatzsteuergesetz zusätzlich verlangt</h2>
<p>Die Norm ist branchen- und länderübergreifend. Einige Angaben, die das deutsche Recht für eine ordnungsgemäße Rechnung fordert, sind in ihr deshalb nur optional. Die Pflichtangaben nach § 14 Abs. 4 UStG müssen trotzdem in der E-Rechnung stehen: vollständiger Name und Anschrift beider Seiten, Steuernummer oder USt-IdNr. des Leistenden, Ausstellungsdatum, eine fortlaufende Nummer, Menge und Art der Leistung, ihr Zeitpunkt, das Entgelt nach Steuersätzen aufgeschlüsselt sowie Steuersatz und Steuerbetrag oder ein Hinweis auf die Befreiung. Das Lieferdatum etwa steht in BT-72, der Befreiungsgrund in BT-120. Die Liste oben trennt deshalb Felder, die nur die Norm verlangt, von solchen, die auch das Gesetz verlangt.</p>
<h2>Profile und nationale Ausprägungen</h2>
<p>Ein Land oder eine Branche darf die Norm einschränken, aber nicht erweitern, ohne den Standard zu verlassen. Eine solche Einschränkung heißt CIUS. Die ${h.src('kosit-xrechnung', 'XRechnung')} ist die deutsche CIUS: Sie macht etwa die Käuferreferenz und die Kontaktdaten des Verkäufers zur Pflicht. ZUGFeRD im Profil EN 16931 bildet die Norm dagegen ohne Zusätze ab, das Profil EXTENDED geht als sogenannte Extension weiter. Welches ZUGFeRD-Profil die Norm erfüllt, zeigt der Rechner:</p>
${h.mini('zf', { p: ['version', 'profil'], c: 'ZUGFeRD-Profil prüfen' })}
<p>Für die Praxis heißt das: Wer nach EN 16931 rechnet, erfüllt die Pflicht zwischen Unternehmen. Wer an Behörden liefert, braucht die strengere ${h.a('xrechnung', 'XRechnung')}. Die Formate selbst vergleicht ${h.a('formate', 'E-Rechnung Formate')}.</p>
`,
  },
  en: {
    slug: 'en-16931',
    nav: 'EN 16931', card: 'The European standard behind every e-invoice: data model and required fields',
    title: 'EN 16931 in 2026: the E-Invoice Standard and Its Fields',
    description: 'EN 16931 explained for 2026: business terms, groups and rules of the European e-invoicing standard, its link to German VAT law and the fields for your case.',
    h1: 'EN 16931: the required fields of the European standard',
    intro: 'Choose your VAT situation and recipient: the list shows which fields of the standard your invoice must fill in and which of them German VAT law also requires.',
    resume: `EN 16931 is the European standard for electronic invoices. It was commissioned by Directive 2014/55/EU, which obliges public contracting authorities throughout the Union to accept invoices that follow it, and the European Committee for Standardization (CEN) published it in 2017. At its core is a semantic data model: every item on an invoice has a name and a number, such as BT-1 for the invoice number or BT-115 for the amount due, and related items form groups such as BG-4 for the seller. Business rules with identifiers like BR-01 or BR-CO-15 come on top; they define which fields are mandatory and how the amounts must add up. How the model is written as XML is set by two permitted syntaxes, UBL and UN/CEFACT CII. Since 2025 the German VAT Act has tied its definition of an e-invoice to this standard. National specifications such as XRechnung tighten it but may not contradict it. The identifier of the plain standard in field BT-24 is ${S.en16931Id}.`,
    faqs: [
      { q: 'What do BT, BG and BR mean in the standard?', a: 'BT stands for business term, a single item such as the invoice date or the VAT rate. BG stands for business group, a set of items that belong together, such as the buyer’s address. BR stands for business rule, a rule that prescribes mandatory fields and calculations. Validator error messages usually quote a BR identifier and the BT field concerned.' },
      { q: 'Do I have to buy the EN 16931 standard to write e-invoices?', a: 'No. The standard itself is a paid CEN document, but you do not need it in practice. The XRechnung and ZUGFeRD specifications are freely available and contain the complete data model with all fields and rules. Invoicing software and the creator on this site implement the standard without you having to know the field numbers.' },
      { q: 'How do calculation rules such as BR-CO-15 relate to my amounts?', a: 'The CO rules check that the amounts fit together. BR-CO-10 requires the sum of the lines to equal the sum of all line net amounts exactly. BR-CO-15 requires the gross amount to equal the net amount plus VAT. A rounding difference of a single cent breaks the rule. The validator on this site recalculates every amount and names the difference.' },
      { q: 'Does the standard also cover credit notes and corrections?', a: 'Yes. The standard knows several invoice types, set in field BT-3 with a code, for example 380 for an invoice, 381 for a credit note in the sense of a correction and 384 for a corrected invoice. A correction must also contain all mandatory fields and should refer to the original invoice in BT-25.' },
    ],
    body: (h) => `
<h2>Where the standard comes from</h2>
<p>Until the 2010s almost every country and sector had its own electronic invoice formats. ${h.src('richtlinie-2014-55', 'Directive 2014/55/EU')} was meant to harmonise this for public contracts. It asked CEN for a standard describing the semantic data model and obliged the public contracting authorities of the member states to accept and process invoices that follow it. The result is EN 16931, whose first part appeared in 2017, hence the year in the identifier.</p>
<p>Germany implemented the directive for the federal level with the E-Invoicing Regulation. Since the rewrite of ${h.src('ustg14', 'section 14 UStG')} the standard also applies to invoices between businesses: an e-invoice must comply with it, whatever format it is sent in.</p>
<h2>A data model, not a file format</h2>
<p>The standard does not say what a file looks like, only what information it carries. That is its central idea. An invoice consists of many such items, of which only some are mandatory. Each has a fixed meaning, a data type and a cardinality, meaning whether it may be missing or occur once or several times. Because every format uses the same model, software can convert a UBL file into a CII file without losing anything.</p>
${h.table(['Group', 'Content', 'Example fields'], [
  ['BG-4', 'Seller', 'BT-27 name, BT-31 VAT ID, BT-32 tax number'],
  ['BG-7', 'Buyer', 'BT-44 name, BT-48 VAT ID'],
  ['BG-16', 'Payment instructions', 'BT-81 payment means, BT-84 IBAN'],
  ['BG-22', 'Document totals', 'BT-106 sum of lines, BT-109 net, BT-112 gross, BT-115 amount due'],
  ['BG-23', 'VAT breakdown', 'BT-116 taxable amount, BT-117 VAT amount, BT-118 category'],
  ['BG-25', 'Invoice line', 'BT-129 quantity, BT-146 price, BT-153 item name'],
], 'Selected groups of the EN 16931 semantic model.', ['l', 'l', 'l'])}
<h2>What German VAT law adds</h2>
<p>The standard spans sectors and countries, so some details German law requires for a proper invoice are only optional in it. The mandatory details under section 14(4) UStG must nevertheless appear in the e-invoice: full name and address of both parties, the supplier’s tax number or VAT ID, the issue date, a sequential number, quantity and type of supply, its date, the consideration broken down by VAT rate, and the rate and VAT amount or a note on the exemption. The delivery date, for example, goes in BT-72, the exemption reason in BT-120. The list above therefore separates fields required only by the standard from those the law also requires.</p>
<h2>Profiles and national specifications</h2>
<p>A country or sector may restrict the standard but not extend it without leaving it. Such a restriction is called a CIUS. ${h.src('kosit-xrechnung', 'XRechnung')} is the German CIUS: it makes the buyer reference and the seller’s contact details mandatory, for instance. ZUGFeRD in the EN 16931 profile reproduces the standard without additions, while the EXTENDED profile goes beyond it as a so-called extension. The calculator shows which ZUGFeRD profile meets the standard:</p>
${h.mini('zf', { p: ['version', 'profil'], c: 'Check a ZUGFeRD profile' })}
<p>In practice, invoicing to EN 16931 satisfies the duty between businesses. Supplying public bodies requires the stricter ${h.a('xrechnung', 'XRechnung')}. The formats themselves are compared on ${h.a('formate', 'e-invoice formats')}.</p>
`,
  },
});
