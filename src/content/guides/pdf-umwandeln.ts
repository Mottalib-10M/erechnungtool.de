import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* PDF in XRechnung : le viewer en mode « pdf » cherche une XML incorporée (ZUGFeRD / Factur-X) et l'extrait ; sinon il renvoie au créateur.
   § 14 Abs. 1 UStG (format structuré EN 16931), BMF-Schreiben 15.10.2025, FeRD (ZUGFeRD ab 2.0.1). */
const S = K.P.standards, PF = K.P.pflicht;

export default defineGuide({
  id: 'pdf-umwandeln', group: 'werkzeuge', order: 6,
  tool: 'viewer', toolArg: { mode: 'pdf' },
  related: ['erstellen', 'zugferd', 'xrechnung-pdf', 'was-ist', 'validator'],
  sources: ['ustg14', 'bmf-2025', 'ferd', 'kosit-xrechnung'],
  de: {
    slug: 'pdf-in-xrechnung-umwandeln',
    nav: 'PDF in XRechnung umwandeln', card: 'Steckt eine XML in Ihrer PDF? Prüfen, herausholen oder neu erstellen',
    title: 'PDF in XRechnung umwandeln 2026: prüfen statt raten',
    description: 'PDF in XRechnung umwandeln 2026: Prüfen Sie, ob Ihre PDF schon eine XML enthält, holen Sie sie heraus oder erstellen Sie die Rechnung sauber neu. Ohne Upload.',
    h1: 'PDF in XRechnung umwandeln: was wirklich geht',
    intro: 'PDF auswählen: Das Werkzeug zeigt, ob darin bereits eine Rechnungs-XML steckt, und gibt sie zum Herunterladen frei. Fehlt sie, führt der Weg über den Ersteller.',
    resume: `Eine gewöhnliche PDF lässt sich nicht zuverlässig in eine XRechnung umwandeln, weil sie nur das Bild einer Rechnung enthält und keine Datenfelder. Eine E-Rechnung muss nach § 14 Abs. 1 UStG in einem strukturierten Format nach der Norm EN 16931 vorliegen, und jede Angabe darin muss richtig und vollständig sein: Rechnungsnummer, Datum, Anschriften, Steuersätze, Netto- und Steuerbeträge. Texterkennung liest diese Werte aus dem Bild, verwechselt aber Spalten, Kommas und Steuersätze, und für den Fehler haften Sie als Aussteller. Anders ist es bei ZUGFeRD: Diese PDF/A-3 trägt die XML als eingebettete Datei bereits in sich, ab Version ${S.zugferdMindest} und ab Profil BASIC ist sie eine E-Rechnung. Das Werkzeug oben öffnet Ihre PDF im Browser, sucht nach factur-x.xml oder xrechnung.xml und bietet die Datei zum Herunterladen an. Findet es keine XML, erstellen Sie die Rechnung mit dem Ersteller neu; das dauert für eine Rechnung mit wenigen Positionen etwa fünf Minuten und ergibt eine geprüfte Datei. Bis zum ${PF.papierBis.split('-').reverse().join('.')} bleibt die PDF mit Zustimmung des Kunden zulässig.`,
    faqs: [
      { q: 'Kann ich eine Rechnungs-PDF per Texterkennung in eine XRechnung verwandeln?', a: 'Technisch ja, verlässlich nein. Texterkennung muss Beträge, Steuersätze und Anschriften aus einem Bild lesen und jedem Feld der Norm zuordnen. Schon ein falsch gelesenes Komma ergibt eine falsche Summe, und die XML enthält dann eine andere Rechnung als die PDF. Für die Richtigkeit haften Sie als Aussteller. Sicherer ist es, die Rechnung aus den Originaldaten neu zu erzeugen.' },
      { q: 'Woran erkenne ich, ob meine PDF schon eine E-Rechnung ist?', a: 'Öffnen Sie die PDF im Werkzeug auf dieser Seite. Es listet die eingebetteten Dateien auf, nennt den PDF/A-Stand und erkennt Standard und Profil der XML. Steht dort ZUGFeRD mit Profil BASIC, EN 16931, EXTENDED oder XRECHNUNG, liegt eine E-Rechnung vor. Ohne eingebettete Datei oder im Profil MINIMUM oder BASIC WL ist die PDF nur eine sonstige Rechnung.' },
      { q: 'Was mache ich mit der herausgeholten XML aus einer ZUGFeRD-PDF?', a: 'Sie können sie an Empfänger schicken, die nur reine XML-Dateien annehmen, sie in Ihre Buchhaltung einlesen oder mit der Vorprüfung kontrollieren. Ist die XML im Profil XRECHNUNG, entspricht sie inhaltlich einer XRechnung in CII-Syntax. Eine Datei im Profil EN 16931 ist eine gültige E-Rechnung, erfüllt aber nicht automatisch die zusätzlichen deutschen Regeln der XRechnung.' },
      { q: 'Wird meine PDF beim Umwandeln an einen Server geschickt?', a: 'Nein. Die PDF wird in Ihrem Browser mit einer Programmbibliothek geöffnet, die erst beim Auswählen der Datei geladen wird. Die Suche nach der eingebetteten XML, das Auslesen und der Download geschehen auf Ihrem Gerät. Radif Partners sieht weder die Datei noch ihren Inhalt, und nach dem Schließen des Fensters ist nichts gespeichert.' },
    ],
    body: (h) => `
<h2>Zwei Arten von PDF</h2>
<p>Hinter der Endung .pdf verbergen sich bei Rechnungen zwei sehr verschiedene Dinge. Die erste Art entsteht, wenn ein Textprogramm oder eine Buchhaltung die Rechnung als Seite ausgibt: Buchstaben und Linien an festen Positionen, gut lesbar für Menschen, für Software aber nur eine Grafik mit Text. Die zweite Art ist eine hybride Rechnung nach ZUGFeRD: eine PDF/A-3, in der zusätzlich eine XML-Datei mit allen Rechnungsdaten liegt. Die Seite zeigt die Rechnung, die XML liefert die Werte für die Buchhaltung.</p>
<p>Nur die zweite Art ist eine E-Rechnung im Sinne von ${h.src('ustg14', '§ 14 Abs. 1 UStG')}, und auch nur dann, wenn die XML der Norm EN 16931 entspricht. Nach den Angaben des ${h.src('ferd', 'Forums elektronische Rechnung Deutschland')} gilt das ab ZUGFeRD ${K.P.standards.zugferdMindest} für die Profile BASIC, EN 16931, EXTENDED und XRECHNUNG. Aktuell ist die Version ${K.P.standards.zugferd}.</p>
${h.table(['Art der PDF', 'Enthält XML', 'E-Rechnung', 'Was tun'], [
  ['Ausdruck aus Word oder Buchhaltung', 'nein', 'nein', 'Rechnung neu erstellen'],
  ['Scan oder Foto', 'nein', 'nein', 'Rechnung neu erstellen'],
  ['ZUGFeRD MINIMUM oder BASIC WL', 'ja, unvollständig', 'nein', 'mit Profil ab BASIC neu erzeugen'],
  ['ZUGFeRD BASIC, EN 16931, EXTENDED', 'ja', 'ja', 'XML herausholen, falls nötig'],
  ['ZUGFeRD XRECHNUNG', 'ja', 'ja', 'XML entspricht einer XRechnung (CII)'],
], 'Welche PDF sich wie in eine XRechnung überführen lässt.', ['l', 'l', 'l', 'l'])}
<h2>Warum Texterkennung keine Lösung ist</h2>
<p>Angebote, die eine beliebige PDF in eine XRechnung verwandeln, arbeiten mit Texterkennung und Zuordnungsregeln. Das funktioniert bei sauber gesetzten Rechnungen oft, aber nicht immer. Typische Fehler sind vertauschte Spalten für Menge und Einzelpreis, ein als Tausendertrennzeichen gelesener Dezimalpunkt, ein Steuersatz, der der falschen Position zugeordnet wird, oder eine Anschrift, deren Postleitzahl im Ortsfeld landet. Die erzeugte XML ist dann formal gültig und inhaltlich falsch.</p>
<p>Das ist mehr als ein Schönheitsfehler. Die XML ist das Original der E-Rechnung; was in ihr steht, gilt. Stimmt der Steuerbetrag nicht, schulden Sie nach dem Umsatzsteuergesetz trotzdem den ausgewiesenen Betrag, und Ihr Kunde kann die Vorsteuer nur aus einer richtigen Rechnung ziehen. Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} stellt klar, dass bei Abweichungen zwischen Bild und Daten einer hybriden Rechnung die XML maßgeblich ist. Wer konvertiert, muss deshalb jede Zahl gegenprüfen, und dann ist eine Neuerstellung kaum langsamer.</p>
<h2>So arbeitet das Werkzeug</h2>
<p>Sie wählen eine PDF aus oder ziehen sie auf das Feld. Der Browser liest die Datei, sucht im PDF-Katalog nach eingebetteten Dateien und meldet, was er findet: keine Datei, eine factur-x.xml, eine xrechnung.xml oder andere Anhänge. Ist eine Rechnungs-XML dabei, erkennt das Werkzeug Standard, Profil und Version, zeigt die Rechnung lesbar an und bietet die XML zum Herunterladen an. Ist keine dabei, sagt es das klar und verweist auf den ${h.a('erstellen', 'Rechnungsersteller')}.</p>
<p>Prüfen Sie vorab, wie Ihre Datei rechtlich einzuordnen ist:</p>
${h.mini('istes', { p: ['datei'], c: 'Format genauer prüfen' })}
<h2>Neu erstellen statt umwandeln</h2>
<p>Für eine Rechnung, die nur als gewöhnliche PDF existiert, ist der sauberste Weg die Neuerstellung mit denselben Daten. Der Ersteller fragt Verkäufer, Käufer, Rechnungsdaten, Positionen und Bankverbindung ab, rechnet Netto, Steuer und Brutto selbst und sperrt den Download, solange Pflichtangaben fehlen. Heraus kommt wahlweise eine ZUGFeRD-PDF, die wie Ihre bisherige Rechnung aussieht und die XML enthält, oder eine XRechnung als reine XML. Verwenden Sie dieselbe Rechnungsnummer nur, wenn die alte PDF nie verschickt wurde; sonst gelten die Regeln für Rechnungskorrekturen.</p>
<p>Wer den umgekehrten Weg sucht, also aus einer XRechnung eine lesbare PDF machen will, findet die Anleitung unter ${h.a('xrechnung-pdf', 'XRechnung in PDF umwandeln')}. Was ZUGFeRD als Format ausmacht, erklärt ${h.a('zugferd', 'ZUGFeRD')}; die eigentliche Datei prüfen Sie vor dem Versand mit dem ${h.a('validator', 'XRechnung-Validator')}.</p>
`,
  },
  en: {
    slug: 'convert-pdf-to-xrechnung',
    nav: 'Convert PDF to XRechnung', card: 'Is there XML inside your PDF? Check it, extract it or create it again',
    title: 'Convert PDF to XRechnung 2026: Check Before You Convert',
    description: 'Convert a PDF to XRechnung in 2026: check whether your PDF already holds an XML file, extract it, or recreate the invoice cleanly. Nothing is uploaded anywhere.',
    h1: 'Converting a PDF to XRechnung: what actually works',
    intro: 'Pick a PDF: the tool shows whether it already carries invoice XML and lets you download it. If not, the way forward is the invoice creator.',
    resume: `An ordinary PDF cannot be converted into an XRechnung reliably, because it only holds a picture of an invoice and no data fields. Under section 14(1) of the German VAT Act an e-invoice must come in a structured format under the standard EN 16931, and every value in it must be correct and complete: invoice number, date, addresses, VAT rates, net and tax amounts. Text recognition reads those values from the image but mixes up columns, decimal separators and VAT rates, and you as the issuer are liable for the mistake. ZUGFeRD is different: this PDF/A-3 already carries the XML as an embedded file, and from version ${S.zugferdMindest} and the BASIC profile upwards it is an e-invoice. The tool above opens your PDF in the browser, looks for factur-x.xml or xrechnung.xml and offers the file for download. If it finds no XML, recreate the invoice with the creator; for an invoice with a few lines that takes about five minutes and gives you a checked file. Until 31 December 2026 a PDF stays allowed with the customer's consent.`,
    faqs: [
      { q: 'Can text recognition turn an invoice PDF into an XRechnung?', a: 'Technically yes, reliably no. Text recognition has to read amounts, VAT rates and addresses from an image and assign each one to a field of the standard. A single misread decimal separator gives a wrong total, and the XML then describes a different invoice from the PDF. You as the issuer are liable for its accuracy, so recreating the invoice from the original data is safer.' },
      { q: 'How can I tell whether my PDF is already an e-invoice?', a: 'Open the PDF in the tool on this page. It lists the embedded files, states the PDF/A level and identifies the standard and profile of the XML. If it reports ZUGFeRD with the BASIC, EN 16931, EXTENDED or XRECHNUNG profile, you have an e-invoice. With no embedded file, or with the MINIMUM or BASIC WL profile, the PDF is only an ordinary invoice.' },
      { q: 'What do I do with XML extracted from a ZUGFeRD PDF?', a: 'You can send it to recipients who accept only pure XML files, import it into your accounting software or check it with the pre-check. If the XML uses the XRECHNUNG profile, its content matches an XRechnung in CII syntax. A file in the EN 16931 profile is a valid e-invoice but does not automatically meet the extra German XRechnung rules.' },
      { q: 'Is my PDF sent to a server during conversion?', a: 'No. The PDF is opened in your browser by a software library that loads only when you choose the file. Searching for the embedded XML, reading it and the download all happen on your device. Radif Partners sees neither the file nor its content, and nothing is stored once you close the window.' },
    ],
    body: (h) => `
<h2>Two kinds of PDF</h2>
<p>For invoices, the .pdf extension hides two very different things. The first kind is produced when a word processor or accounting program prints the invoice to a page: letters and lines at fixed positions, easy for people to read, but for software just a graphic with text. The second kind is a hybrid invoice under ZUGFeRD: a PDF/A-3 that also holds an XML file with all the invoice data. The page shows the invoice, the XML supplies the values for accounting.</p>
<p>Only the second kind is an e-invoice under ${h.src('ustg14', 'section 14(1) UStG')}, and only if the XML meets EN 16931. According to the ${h.src('ferd', 'German e-invoicing forum FeRD')}, that holds from ZUGFeRD ${K.P.standards.zugferdMindest} for the BASIC, EN 16931, EXTENDED and XRECHNUNG profiles. The current version is ${K.P.standards.zugferd}.</p>
${h.table(['Kind of PDF', 'Holds XML', 'E-invoice', 'What to do'], [
  ['Printed from Word or accounting software', 'no', 'no', 'create the invoice again'],
  ['Scan or photo', 'no', 'no', 'create the invoice again'],
  ['ZUGFeRD MINIMUM or BASIC WL', 'yes, incomplete', 'no', 'regenerate with BASIC or higher'],
  ['ZUGFeRD BASIC, EN 16931, EXTENDED', 'yes', 'yes', 'extract the XML if needed'],
  ['ZUGFeRD XRECHNUNG', 'yes', 'yes', 'XML matches an XRechnung (CII)'],
], 'Which PDF can be turned into an XRechnung, and how.', ['l', 'l', 'l', 'l'])}
<h2>Why text recognition is no answer</h2>
<p>Services that turn any PDF into an XRechnung rely on text recognition and mapping rules. With neatly laid-out invoices that often works, but not always. Typical errors are swapped columns for quantity and unit price, a decimal point read as a thousands separator, a VAT rate attached to the wrong line, or an address whose postcode ends up in the city field. The resulting XML is formally valid and wrong in substance.</p>
<p>That is more than a cosmetic flaw. The XML is the original of the e-invoice, and what it says is what counts. If the VAT amount is wrong, the VAT Act still makes you owe the amount shown, and your customer can deduct input VAT only from a correct invoice. The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} states that where the picture and the data of a hybrid invoice differ, the XML prevails. Anyone converting must therefore check every figure, at which point recreating the invoice is hardly slower.</p>
<h2>How the tool works</h2>
<p>You pick a PDF or drop it on the field. The browser reads the file, searches the PDF catalogue for embedded files and reports what it finds: no file, a factur-x.xml, an xrechnung.xml or other attachments. If invoice XML is present, the tool identifies the standard, profile and version, shows the invoice in readable form and offers the XML for download. If none is present, it says so plainly and points to the ${h.a('erstellen', 'invoice creator')}.</p>
<p>Check first how your file is classified in law:</p>
${h.mini('istes', { p: ['datei'], c: 'Check the format in detail' })}
<h2>Recreate rather than convert</h2>
<p>For an invoice that exists only as an ordinary PDF, the cleanest route is to create it again from the same data. The creator asks for seller, buyer, invoice details, line items and bank details, works out net, VAT and gross itself and blocks the download while mandatory details are missing. The result is either a ZUGFeRD PDF that looks like your old invoice and carries the XML, or an XRechnung as pure XML. Reuse the same invoice number only if the old PDF was never sent; otherwise the rules on invoice corrections apply.</p>
<p>If you need the opposite, turning an XRechnung into a readable PDF, see ${h.a('xrechnung-pdf', 'XRechnung to PDF')}. What makes ZUGFeRD a format of its own is explained on ${h.a('zugferd', 'ZUGFeRD')}, and you check the actual file before sending with the ${h.a('validator', 'XRechnung validator')}.</p>
`,
  },
});
