import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* XRechnung : Standard der KoSIT (xeinkauf.de), Version und Gültigkeit aus params.standards, Regeln BR-DE aus der Spezifikation 3.0.2 (auch in engine/validate.ts umgesetzt). */
const S = K.P.standards;

export default defineGuide({
  id: 'xrechnung', group: 'formate', order: 21,
  tool: 'felder', toolArg: { xr: 1 },
  related: ['xrechnung-erstellen', 'validator', 'leitweg', 'bund', 'en-16931', 'xrechnung-oder-zugferd'],
  sources: ['kosit-xrechnung', 'kosit-validator', 'erechv', 'bmf-faq', 'leitweg-spec'],
  de: {
    slug: 'xrechnung',
    nav: 'XRechnung', card: 'Der deutsche Standard der KoSIT: Version, Syntax und Zusatzregeln BR-DE',
    title: 'XRechnung 2026: Version 3.0.2, Pflichtfelder und BR-DE',
    description: 'XRechnung 2026 erklärt: aktuelle Version der KoSIT, UBL oder CII, die deutschen Zusatzregeln BR-DE und welche Felder Ihre Rechnung braucht. Mit Feldliste.',
    h1: 'XRechnung: welche Felder Ihre Rechnung braucht',
    intro: 'Besteuerung und Empfänger wählen: Die Liste zeigt jedes Pflichtfeld einer XRechnung für Ihren Fall, mit der Regel der KoSIT und der Stelle im Gesetz.',
    resume: `Die XRechnung ist der deutsche Standard für elektronische Rechnungen, herausgegeben von der Koordinierungsstelle für IT-Standards (KoSIT) in Bremen. Technisch ist sie eine sogenannte CIUS der europäischen Norm EN 16931: Sie übernimmt deren Datenmodell und schärft es mit nationalen Geschäftsregeln nach, die mit BR-DE beginnen. Gültig ist derzeit Version ${S.xrechnung}; sie kann nach dem Fahrplan der KoSIT bis zum ${displayDate(S.xrechnungGueltigBis, 'de-DE')} verwendet werden, die nächste große Fassung trägt die Nummer ${S.xrechnungNaechste}. Eine XRechnung ist eine reine XML-Datei, entweder in der Syntax UBL 2.1 oder in UN/CEFACT CII; eine Ansicht für Menschen hat sie nicht, dafür braucht es einen Viewer. Erkennbar ist sie an ihrer Kennung im Feld BT-24, die auf xrechnung_3.0 endet. Gegenüber der reinen Norm verlangt die XRechnung unter anderem eine Käuferreferenz, die vollständige Anschrift des Verkäufers, eine Kontaktperson mit Telefon und E-Mail sowie Zahlungsanweisungen. Bei Rechnungen an Behörden steht in der Käuferreferenz die Leitweg-ID.`,
    faqs: [
      { q: 'Welche XRechnung-Version muss ich 2026 verwenden?', a: `Aktuell ist Version ${S.xrechnung}. Die KoSIT veröffentlicht für jede Fassung einen Zeitraum, in dem sie angenommen wird; für die Version 3.0 reicht er bis zum ${displayDate(S.xrechnungGueltigBis, 'de-DE')}. Prüfen Sie im Feld BT-24 Ihrer Datei, welche Version Ihr Programm schreibt. Eine ältere Version 2.x nehmen viele Empfänger nicht mehr an.` },
      { q: 'Ist UBL oder CII die bessere Syntax für eine XRechnung?', a: 'Beide sind gleichwertig und enthalten dieselben Angaben. UBL ist international verbreitet und wird im Peppol-Netz genutzt; CII ist die Syntax hinter ZUGFeRD und Factur-X. Empfänger in Deutschland müssen nach der Spezifikation beide verarbeiten können. Wählen Sie, was Ihr Programm ausgibt; der Rechnungsersteller dieser Seite liefert beide Varianten.' },
      { q: 'Was bedeutet eine Fehlermeldung mit BR-DE?', a: 'Regeln mit der Kennung BR-DE stammen aus der deutschen Spezifikation der XRechnung, nicht aus der europäischen Norm. BR-DE-15 meldet zum Beispiel eine fehlende Käuferreferenz, BR-DE-2 fehlende Kontaktdaten des Verkäufers, BR-DE-1 fehlende Zahlungsanweisungen. Eine Datei, die solche Regeln verletzt, ist zwar vielleicht EN-16931-konform, aber keine gültige XRechnung.' },
      { q: 'Kann ich eine XRechnung auch an Unternehmen schicken?', a: 'Ja. Die XRechnung ist ein zulässiges Format für alle E-Rechnungen im Inland, nicht nur für Behörden. Wichtig ist, dass Ihr Kunde sie lesen kann: Ohne Software sieht er nur XML-Code. Viele Unternehmen bevorzugen deshalb ZUGFeRD, das zusätzlich eine lesbare PDF mitbringt. Fragen Sie im Zweifel, welches Format der Kunde einliest.' },
    ],
    body: (h) => `
<h2>Wer die XRechnung festlegt</h2>
<p>Die ${h.src('kosit-xrechnung', 'KoSIT')} betreibt den Standard im Auftrag von Bund und Ländern. Sie veröffentlicht die Spezifikation, die Prüfregeln als Schematron und einen ${h.src('kosit-validator', 'Validator')}, mit dem jeder eine Datei gegen das amtliche Regelwerk testen kann. Grundlage für die öffentliche Hand ist die ${h.src('erechv', 'E-Rechnungsverordnung des Bundes')}: Seit dem ${h.day(K.P.erechv.pflichtSeit)} müssen Lieferanten an Bundesbehörden elektronisch abrechnen, in XRechnung oder einem anderen Format nach EN 16931.</p>
<p>Für Unternehmen untereinander gibt es keine Pflicht zur XRechnung. Sie ist dort eines von mehreren zulässigen Formaten. Weil sie aber genau beschrieben und frei verfügbar ist, schreiben fast alle Buchhaltungsprogramme in Deutschland eine XRechnung.</p>
<h2>Kennung und Versionen</h2>
<p>Jede XRechnung trägt im Feld BT-24 die Kennung der Spezifikation. Für die laufende Generation lautet sie:</p>
<p><code>${S.xrCustomization}</code></p>
<p>Der vordere Teil verweist auf die Norm EN 16931, der hintere auf die deutsche Ausprägung. Die Formaterkennung dieser Seite liest genau diese Zeichenkette, um zu entscheiden, ob eine Datei als XRechnung, ZUGFeRD oder Peppol gilt. Die KoSIT legt für jede Version einen Gültigkeitszeitraum fest; die aktuelle ${S.xrechnung} gilt bis ${h.day(S.xrechnungGueltigBis)}. Danach folgt Version ${S.xrechnungNaechste}, deren Termine die KoSIT bekannt gibt.</p>
<h2>Die wichtigsten deutschen Zusatzregeln</h2>
${h.table(['Regel', 'Verlangt', 'Feld'], [
  ['BR-DE-1', 'Zahlungsanweisungen, etwa Überweisung mit IBAN', 'BG-16'],
  ['BR-DE-2', 'Kontaktangaben des Verkäufers', 'BG-6'],
  ['BR-DE-3 und 4', 'Ort und Postleitzahl des Verkäufers', 'BT-37, BT-38'],
  ['BR-DE-5 bis 7', 'Name, Telefon und E-Mail des Ansprechpartners', 'BT-41 bis BT-43'],
  ['BR-DE-8 und 9', 'Ort und Postleitzahl des Käufers', 'BT-52, BT-53'],
  ['BR-DE-15', 'Käuferreferenz, bei Behörden die Leitweg-ID', 'BT-10'],
  ['PEPPOL R010 und R020', 'Elektronische Adresse von Käufer und Verkäufer', 'BT-49, BT-34'],
], 'Auswahl der Geschäftsregeln der XRechnung 3.0.', ['l', 'l', 'l'])}
<p>Die Liste ist nicht vollständig; die Spezifikation enthält über dreißig Regeln mit BR-DE, darunter Vorgaben zu Skonto, Lastschrift und Rechnungstypen. Die Vorprüfung dieser Seite setzt die häufigsten davon um. Ob eine Datei wirklich alle Regeln einhält, entscheidet am Ende der Validator der KoSIT; wie wir unsere Ergebnisse damit abgeglichen haben, steht auf der Methodenseite.</p>
<h2>Leitweg-ID: die Adresse in der Verwaltung</h2>
<p>Geht die Rechnung an eine Behörde, steht in BT-10 die Leitweg-ID des Auftraggebers. Sie folgt einer eigenen ${h.src('leitweg-spec', 'Formatspezifikation')} mit Prüfziffer. Der Rechner prüft eine ID aus ihren Teilen:</p>
${h.mini('lw', { p: ['grob', 'fein'], c: 'Vollständige Leitweg-ID prüfen' })}
<p>Woher die ID kommt und wie Sie sie verwenden, erklärt ${h.a('leitweg', 'Leitweg-ID')}. Den Weg der Rechnung zum Bund beschreibt ${h.a('bund', 'E-Rechnung an den Bund')}.</p>
<h2>XRechnung lesen und erzeugen</h2>
<p>Eine XRechnung ist für Menschen kaum lesbar. Öffnen Sie sie im ${h.a('oeffnen', 'Viewer')}, um Positionen und Beträge als Rechnung zu sehen. Selbst eine erstellen können Sie mit ${h.a('xrechnung-erstellen', 'XRechnung erstellen')}: Das Formular füllt die deutschen Pflichtfelder aus, zeigt fehlende Angaben rot und gibt UBL und CII aus. Vor dem Versand an einen Kunden lohnt der Gang durch den ${h.a('validator', 'Validator')}.</p>
`,
  },
  en: {
    slug: 'xrechnung',
    nav: 'XRechnung', card: 'Germany’s KoSIT standard: version, syntax and the extra BR-DE rules',
    title: 'XRechnung 2026: Version 3.0.2, Required Fields and BR-DE',
    description: 'XRechnung explained for 2026: the current KoSIT version, UBL or CII, the German BR-DE rules and which fields your invoice needs. With a list of required fields.',
    h1: 'XRechnung: the fields your invoice needs',
    intro: 'Choose your VAT situation and recipient: the list shows every required XRechnung field for your case, with the KoSIT rule and the legal basis.',
    resume: `XRechnung is the German standard for electronic invoices, published by the Coordination Office for IT Standards (KoSIT) in Bremen. Technically it is a so-called CIUS of the European standard EN 16931: it adopts the standard’s data model and tightens it with national business rules whose identifiers start with BR-DE. The current version is ${S.xrechnung}; under the KoSIT schedule it can be used until ${displayDate(S.xrechnungGueltigBis, 'en-GB')}, and the next major release is numbered ${S.xrechnungNaechste}. An XRechnung is a pure XML file, either in the UBL 2.1 syntax or in UN/CEFACT CII; it has no view for people, so you need a viewer to read it. You recognise it by the identifier in field BT-24, which ends in xrechnung_3.0. Compared with the plain standard, XRechnung requires among other things a buyer reference, the seller’s full address, a contact person with phone and email, and payment instructions. On invoices to public bodies the buyer reference holds the Leitweg-ID.`,
    faqs: [
      { q: 'Which XRechnung version should I use in 2026?', a: `The current one is version ${S.xrechnung}. KoSIT publishes a period for each release during which it is accepted; for version 3.0 it runs until ${displayDate(S.xrechnungGueltigBis, 'en-GB')}. Look at field BT-24 of your file to see which version your software writes. Many recipients no longer accept an older 2.x version.` },
      { q: 'Is UBL or CII the better syntax for XRechnung?', a: 'Both are equivalent and carry the same details. UBL is widespread internationally and used on the Peppol network; CII is the syntax behind ZUGFeRD and Factur-X. Under the specification, recipients in Germany must be able to process both. Choose whatever your software produces; the invoice creator on this site delivers both variants.' },
      { q: 'What does an error message with BR-DE mean?', a: 'Rules with a BR-DE identifier come from the German XRechnung specification, not from the European standard. BR-DE-15, for example, reports a missing buyer reference, BR-DE-2 missing seller contact details and BR-DE-1 missing payment instructions. A file that breaks such rules may well comply with EN 16931, but it is not a valid XRechnung.' },
      { q: 'Can I send an XRechnung to private companies too?', a: 'Yes. XRechnung is an accepted format for every domestic e-invoice, not just for public bodies. What matters is that your customer can read it: without software they only see XML code. That is why many businesses prefer ZUGFeRD, which adds a readable PDF. If in doubt, ask which format your customer imports.' },
    ],
    body: (h) => `
<h2>Who defines XRechnung</h2>
<p>${h.src('kosit-xrechnung', 'KoSIT')} runs the standard on behalf of the federal and state governments. It publishes the specification, the test rules as Schematron and a ${h.src('kosit-validator', 'validator')} that anyone can use to test a file against the official rule set. For the public sector the basis is the ${h.src('erechv', 'federal E-Invoicing Regulation')}: since ${h.day(K.P.erechv.pflichtSeit)} suppliers to federal authorities must invoice electronically, in XRechnung or another EN 16931 format.</p>
<p>Between businesses there is no duty to use XRechnung. It is one of several accepted formats there. Because it is precisely described and freely available, however, nearly every accounting program in Germany writes XRechnung.</p>
<h2>Identifier and versions</h2>
<p>Every XRechnung states the specification identifier in field BT-24. For the current generation it reads:</p>
<p><code>${S.xrCustomization}</code></p>
<p>The first part points to EN 16931, the second to the German specification. The format detector on this site reads exactly this string to decide whether a file is XRechnung, ZUGFeRD or Peppol. KoSIT sets a validity period for each version; the current ${S.xrechnung} applies until ${h.day(S.xrechnungGueltigBis)}. Version ${S.xrechnungNaechste} follows, with dates announced by KoSIT.</p>
<h2>The main German rules</h2>
${h.table(['Rule', 'Requires', 'Field'], [
  ['BR-DE-1', 'Payment instructions, such as a transfer with IBAN', 'BG-16'],
  ['BR-DE-2', 'Seller contact details', 'BG-6'],
  ['BR-DE-3 and 4', 'Seller city and postcode', 'BT-37, BT-38'],
  ['BR-DE-5 to 7', 'Contact name, phone and email', 'BT-41 to BT-43'],
  ['BR-DE-8 and 9', 'Buyer city and postcode', 'BT-52, BT-53'],
  ['BR-DE-15', 'Buyer reference, the Leitweg-ID for public bodies', 'BT-10'],
  ['PEPPOL R010 and R020', 'Electronic address of buyer and seller', 'BT-49, BT-34'],
], 'Selection of XRechnung 3.0 business rules.', ['l', 'l', 'l'])}
<p>The list is not complete; the specification contains more than thirty BR-DE rules, including requirements on cash discounts, direct debit and invoice types. The pre-check on this site implements the most common of them. Whether a file really meets every rule is decided in the end by the KoSIT validator; how we compared our results with it is described on the method page.</p>
<h2>Leitweg-ID: the address inside the administration</h2>
<p>When the invoice goes to a public body, BT-10 holds the contracting body’s Leitweg-ID. It follows its own ${h.src('leitweg-spec', 'format specification')} with check digits. The calculator checks an ID from its parts:</p>
${h.mini('lw', { p: ['grob', 'fein'], c: 'Check a full Leitweg-ID' })}
<p>Where the ID comes from and how to use it is explained on ${h.a('leitweg', 'Leitweg-ID')}. The route of the invoice to the federal government is described on ${h.a('bund', 'e-invoicing the federal government')}.</p>
<h2>Reading and creating XRechnung</h2>
<p>An XRechnung is hard for people to read. Open it in the ${h.a('oeffnen', 'viewer')} to see the lines and amounts as an invoice. You can create one yourself on ${h.a('xrechnung-erstellen', 'create an XRechnung')}: the form fills in the German required fields, marks missing details in red and outputs UBL and CII. Before sending to a customer, a pass through the ${h.a('validator', 'validator')} is worth it.</p>
`,
  },
});
