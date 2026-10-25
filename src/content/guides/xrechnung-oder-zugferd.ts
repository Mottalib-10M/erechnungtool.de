import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Wahl des Formats : BMF-FAQ (beide zulässig), § 4 ERechV und FAQ E-Rechnung Bund (Bund : XRechnung, ZUGFeRD nur Profil XRECHNUNG als XML), GoBD-Änderung vom 14.07.2025 (Aufbewahrung der XML). */
const S = K.P.standards;

export default defineGuide({
  id: 'xrechnung-oder-zugferd', group: 'formate', order: 22,
  tool: 'wahl',
  related: ['xrechnung', 'zugferd', 'erstellen', 'bund', 'per-email', 'formate'],
  sources: ['bmf-faq', 'erechv', 'erechnung-bund-faq', 'ferd', 'kosit-xrechnung', 'gobd'],
  de: {
    slug: 'xrechnung-oder-zugferd',
    nav: 'XRechnung oder ZUGFeRD', card: 'Welches Format für welchen Empfänger: Vergleich und Entscheidung',
    title: 'XRechnung oder ZUGFeRD 2026: welches Format passt zu Ihnen',
    description: 'XRechnung oder ZUGFeRD 2026: Vergleich der beiden E-Rechnungsformate, was Behörden verlangen und was Firmenkunden lesen können. Mit Empfehlung für Ihren Fall.',
    h1: 'XRechnung oder ZUGFeRD: das richtige Format wählen',
    intro: 'Sagen Sie, wer die Rechnung bekommt und ob ein Mensch sie ohne Software liest: Das Werkzeug empfiehlt das Format und nennt, was dabei zu beachten ist.',
    resume: `XRechnung und ZUGFeRD sind beide E-Rechnungen im Sinne des Umsatzsteuergesetzes, solange ZUGFeRD mindestens in Version ${S.zugferdMindest} und im Profil BASIC oder höher vorliegt. Beide beruhen auf der europäischen Norm EN 16931 und enthalten dieselben Pflichtangaben. Der Unterschied liegt in der Verpackung: Die XRechnung ist eine reine XML-Datei mit den zusätzlichen deutschen Regeln der KoSIT, ZUGFeRD eine PDF/A-3, in der die XML als Anhang steckt. Für Rechnungen an Unternehmen dürfen Sie frei wählen; ZUGFeRD hat den Vorteil, dass auch ein Kunde ohne passende Software die Rechnung lesen kann. Für Rechnungen an Behörden des Bundes verlangt die E-Rechnungsverordnung eine XRechnung oder ein anderes Format nach EN 16931; die Plattformen des Bundes nehmen ZUGFeRD nur im Profil XRECHNUNG und nur als reine XML an. Länder und Kommunen verlangen ebenfalls fast immer XRechnung mit Leitweg-ID. Wer an beide Gruppen liefert, braucht ein Programm, das beide Formate schreibt, oder den Rechnungsersteller dieser Seite.`,
    faqs: [
      { q: 'Darf ich Firmenkunden statt ZUGFeRD eine XRechnung schicken?', a: 'Ja. Zwischen Unternehmen sind beide Formate gleichwertig, und der Empfänger muss jede E-Rechnung annehmen, die der Norm entspricht. Praktisch sollten Sie aber fragen, ob Ihr Kunde die XML lesen kann. Ein kleiner Betrieb ohne Buchhaltungssoftware sieht bei einer XRechnung nur Programmcode und muss erst einen Viewer finden; bei ZUGFeRD öffnet er einfach die PDF.' },
      { q: 'Kann eine Rechnung zugleich XRechnung und ZUGFeRD sein?', a: 'Ja, im Profil XRECHNUNG von ZUGFeRD. Dann steckt in der PDF eine XML, die alle deutschen Regeln der XRechnung erfüllt. Eine solche Datei eignet sich für Firmenkunden, die die PDF lesen wollen. Die Plattformen des Bundes verlangen aber nur die XML ohne PDF; laden Sie dort also die eingebettete Datei hoch, nicht die ganze PDF.' },
      { q: 'Welches Format ist für meine Buchhaltung beim Empfang einfacher?', a: 'Für die Buchung macht es kaum einen Unterschied, denn in beiden Fällen liest das Programm die XML. Bei ZUGFeRD haben Sie zusätzlich die gewohnte Ansicht. Aufbewahren müssen Sie in beiden Fällen die XML; die PDF einer ZUGFeRD-Rechnung nur dann zusätzlich, wenn sie steuerlich wichtige Angaben enthält, die in der XML fehlen.' },
      { q: 'Was ist mit Kunden im EU-Ausland?', a: 'Die deutsche Pflicht gilt nur für Umsätze zwischen Unternehmen, die beide im Inland ansässig sind. Für Kunden in anderen EU-Staaten ist das Format frei wählbar, solange beide zustimmen. Verbreitet ist dort Peppol BIS Billing in UBL, ebenfalls nach EN 16931. Manche Länder haben eigene Pflichten, die Ihr Kunde kennen sollte.' },
    ],
    body: (h) => `
<h2>Die Formate nebeneinander</h2>
${h.table(['Merkmal', 'XRechnung', 'ZUGFeRD'], [
  ['Herausgeber', 'KoSIT, im Auftrag von Bund und Ländern', 'FeRD, gemeinsam mit Frankreich als Factur-X'],
  ['Dateiform', 'Reine XML', 'PDF/A-3 mit eingebetteter XML'],
  ['Syntax der Daten', 'UBL oder CII', 'CII'],
  ['Für Menschen lesbar', 'Nur mit Viewer', 'Ja, als PDF'],
  ['Aktuelle Version', S.xrechnung, S.zugferd],
  ['Rechnung an Bundesbehörden', 'Ja', 'Nur Profil XRECHNUNG, als reine XML'],
  ['Rechnung an Unternehmen', 'Ja', `Ja, ab ${S.zugferdMindest} und Profil BASIC`],
], 'XRechnung und ZUGFeRD im Vergleich.', ['l', 'l', 'l'])}
<p>Beide Formate transportieren dasselbe Datenmodell. Die Rechnungsnummer liegt in beiden im Feld BT-1, der Zahlbetrag in BT-115, und die Geschäftsregeln der Norm gelten gleichermaßen. Die XRechnung legt aber zusätzlich deutsche Regeln fest, etwa eine Kontaktperson des Verkäufers und eine Käuferreferenz. Eine ZUGFeRD-Datei im Profil EN 16931 braucht diese Angaben nicht; dafür bringt sie eine Ansicht mit, die der Kunde ohne Werkzeug lesen kann.</p>
<h2>Die Entscheidung hängt am Empfänger</h2>
<p>Statt nach dem besseren Format zu fragen, lohnt die Frage, wer die Rechnung verarbeitet. Drei typische Fälle:</p>
<ul>
<li><strong>Bundesbehörde</strong>: Die ${h.src('erechv', 'E-Rechnungsverordnung')} verlangt ein Format nach EN 16931, und die ${h.src('erechnung-bund-faq', 'FAQ von E-Rechnung Bund')} nennt als Regelfall die XRechnung. Leitweg-ID in BT-10 ist Pflicht.</li>
<li><strong>Land oder Kommune</strong>: eigene Landesregeln, in der Praxis fast immer XRechnung mit Leitweg-ID über das Portal des Landes.</li>
<li><strong>Unternehmen im Inland</strong>: beide Formate. Kleine Kunden ohne Buchhaltungssoftware kommen mit ZUGFeRD besser zurecht, große Kunden mit automatischem Eingang oft mit XRechnung.</li>
</ul>
<p>Wenn Sie es nicht wissen, fragen Sie den Kunden. Viele Unternehmen nennen im Bestellprozess oder auf ihrer Website, welches Format und welche Adresse sie für Rechnungen nutzen.</p>
<h2>Wie Sie das gewählte Format verschicken</h2>
<p>Per E-Mail dürfen Sie beide Formate senden; der Empfang über ein E-Mail-Postfach genügt nach der ${h.src('bmf-faq', 'FAQ des Bundesfinanzministeriums')}. Für den Bund gelten engere Vorgaben, zum Beispiel eine Rechnung pro E-Mail. Der Rechner zeigt, ob Ihr Anhang angenommen wird:</p>
${h.mini('versand', { p: ['empf', 'datei'], c: 'Versand genauer prüfen' })}
<h2>Aufwand beim Umstieg</h2>
<p>Für den Rechnungssteller ist der Aufwand ähnlich. Ein Programm, das eine der beiden Varianten schreibt, kann meist auch die andere, denn die Daten sind dieselben. Wer selten Rechnungen schreibt, kann beide Formate im ${h.a('erstellen', 'Rechnungsersteller')} erzeugen und dort sogar zwischen ihnen wechseln, ohne die Angaben neu einzugeben. Wer regelmäßig an Behörden liefert, sollte zusätzlich die deutschen Pflichtfelder kennen; sie stehen auf ${h.a('xrechnung', 'XRechnung')}. Die Unterschiede der ZUGFeRD-Profile erklärt ${h.a('zugferd', 'ZUGFeRD')}.</p>
<p>Beim Aufbewahren ist der Unterschied kleiner, als oft angenommen wird. Nach der ${h.src('gobd', 'geänderten GoBD')} zählt die XML; bei ZUGFeRD bewahren Sie am besten die ganze Datei auf, bei XRechnung die XML selbst. Eine daraus erzeugte Ansicht oder ein Ausdruck ersetzt das Original in keinem Fall.</p>
`,
  },
  en: {
    slug: 'xrechnung-vs-zugferd',
    nav: 'XRechnung or ZUGFeRD', card: 'Which format for which recipient: comparison and decision',
    title: 'XRechnung vs ZUGFeRD 2026: Which E-Invoice Format to Use',
    description: 'XRechnung vs ZUGFeRD 2026: comparison of the two German e-invoice formats, what public bodies want and what business customers can read. With a recommendation.',
    h1: 'XRechnung or ZUGFeRD: choosing the right format',
    intro: 'Say who receives the invoice and whether a person reads it without software: the tool recommends a format and lists what to watch out for.',
    resume: `XRechnung and ZUGFeRD are both e-invoices under the German VAT Act, provided ZUGFeRD is at least version ${S.zugferdMindest} and uses the BASIC profile or higher. Both are based on the European standard EN 16931 and carry the same mandatory details. The difference is the packaging: XRechnung is a pure XML file with the additional German rules of KoSIT, while ZUGFeRD is a PDF/A-3 that contains the XML as an attachment. For invoices to businesses you may choose freely; ZUGFeRD has the advantage that a customer without suitable software can still read the invoice. For invoices to federal authorities, the E-Invoicing Regulation requires XRechnung or another EN 16931 format; the federal platforms accept ZUGFeRD only in the XRECHNUNG profile and only as plain XML. States and municipalities also almost always require XRechnung with a Leitweg-ID. If you supply both groups, you need software that writes both formats, or the invoice creator on this site.`,
    faqs: [
      { q: 'May I send business customers an XRechnung instead of ZUGFeRD?', a: 'Yes. Between businesses both formats are equivalent, and the recipient must accept any e-invoice that meets the standard. In practice, though, ask whether your customer can read the XML. A small firm without accounting software sees only code in an XRechnung and first has to find a viewer; with ZUGFeRD it simply opens the PDF.' },
      { q: 'Can one invoice be both XRechnung and ZUGFeRD?', a: 'Yes, in the ZUGFeRD XRECHNUNG profile. The PDF then holds an XML file that meets every German XRechnung rule. Such a file suits business customers who want to read the PDF. The federal platforms, however, only want the XML without the PDF, so upload the embedded file there, not the whole PDF.' },
      { q: 'Which format is easier for my accounting when receiving?', a: 'For booking it makes little difference, because in both cases the software reads the XML. With ZUGFeRD you also get the familiar view. In both cases you must keep the XML; the PDF of a ZUGFeRD invoice only in addition if it contains tax-relevant details that are missing from the XML.' },
      { q: 'What about customers elsewhere in the EU?', a: 'The German mandate only covers supplies between businesses that are both established in Germany. For customers in other EU states the format is free as long as both agree. Peppol BIS Billing in UBL is common there, also based on EN 16931. Some countries have their own mandates, which your customer should know about.' },
    ],
    body: (h) => `
<h2>The formats side by side</h2>
${h.table(['Feature', 'XRechnung', 'ZUGFeRD'], [
  ['Publisher', 'KoSIT, for the federal and state governments', 'FeRD, jointly with France as Factur-X'],
  ['File form', 'Pure XML', 'PDF/A-3 with embedded XML'],
  ['Data syntax', 'UBL or CII', 'CII'],
  ['Readable by people', 'Only with a viewer', 'Yes, as a PDF'],
  ['Current version', S.xrechnung, S.zugferd],
  ['Invoices to federal authorities', 'Yes', 'XRECHNUNG profile only, as plain XML'],
  ['Invoices to businesses', 'Yes', `Yes, from ${S.zugferdMindest} and the BASIC profile`],
], 'XRechnung and ZUGFeRD compared.', ['l', 'l', 'l'])}
<p>Both formats carry the same data model. The invoice number sits in field BT-1 in both, the amount due in BT-115, and the standard’s business rules apply equally. XRechnung, however, adds German rules, such as a seller contact person and a buyer reference. A ZUGFeRD file in the EN 16931 profile does not need these details; in return it brings a view the customer can read without any tool.</p>
<h2>The recipient decides</h2>
<p>Rather than asking which format is better, ask who processes the invoice. Three typical cases:</p>
<ul>
<li><strong>Federal authority</strong>: the ${h.src('erechv', 'E-Invoicing Regulation')} requires an EN 16931 format, and the ${h.src('erechnung-bund-faq', 'E-Rechnung Bund FAQ')} names XRechnung as the norm. A Leitweg-ID in BT-10 is mandatory.</li>
<li><strong>State or municipality</strong>: their own state rules, in practice almost always XRechnung with a Leitweg-ID via the state portal.</li>
<li><strong>Domestic business</strong>: either format. Small customers without accounting software cope better with ZUGFeRD; large customers with automated intake often prefer XRechnung.</li>
</ul>
<p>If you do not know, ask the customer. Many companies state in their ordering process or on their website which format and address they use for invoices.</p>
<h2>How to send the chosen format</h2>
<p>You may email either format; receiving via an email inbox is enough according to the ${h.src('bmf-faq', 'Finance Ministry FAQ')}. Stricter rules apply to the federal government, such as one invoice per email. The calculator shows whether your attachment will be accepted:</p>
${h.mini('versand', { p: ['empf', 'datei'], c: 'Check delivery in detail' })}
<h2>Effort when switching</h2>
<p>For the issuer the effort is similar. Software that writes one variant can usually write the other too, because the data is the same. If you rarely invoice, you can produce both formats in the ${h.a('erstellen', 'invoice creator')} and even switch between them without re-entering anything. If you supply public bodies regularly, you should also know the German required fields; they are on ${h.a('xrechnung', 'XRechnung')}. The differences between the ZUGFeRD profiles are explained on ${h.a('zugferd', 'ZUGFeRD')}.</p>
<p>For archiving the difference is smaller than often assumed. Under the ${h.src('gobd', 'amended GoBD')} the XML is what counts; with ZUGFeRD it is best to keep the whole file, with XRechnung the XML itself. A view or printout made from it never replaces the original.</p>
`,
  },
});
