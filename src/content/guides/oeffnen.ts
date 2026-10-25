import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Viewer : lit UBL (Invoice, CreditNote) et CII, XML seule ou PDF avec XML jointe (ZUGFeRD / Factur-X). Lecture dans le navigateur, rien n'est envoyé.
   Faits : § 14 Abs. 1 UStG (E-Rechnung = format structuré EN 16931), § 14b UStG (8 ans), GoBD Rn. 119/125/131 (2025-07-14 : l'XML est l'original), BMF-FAQ (boîte e-mail suffit). */
const S = K.P.standards, AU = K.P.aufbewahrung;

export default defineGuide({
  id: 'oeffnen', group: 'werkzeuge', order: 1,
  tool: 'viewer', toolArg: { mode: 'view' },
  related: ['validator', 'xrechnung-pdf', 'empfangen', 'archivieren', 'formate', 'pdf-umwandeln'],
  sources: ['ustg14', 'ustg14b', 'gobd', 'bmf-faq', 'elster-viewer', 'kosit-xrechnung'],
  de: {
    slug: 'e-rechnung-oeffnen',
    nav: 'E-Rechnung öffnen', card: 'XRechnung und ZUGFeRD als lesbare Rechnung anzeigen, drucken, speichern',
    title: 'E-Rechnung öffnen 2026: XRechnung Viewer ohne Upload',
    description: 'E-Rechnung öffnen 2026: XRechnung oder ZUGFeRD hineinziehen und als normale Rechnung lesen, drucken oder als PDF sichern. Die Datei verlässt Ihr Gerät nicht.',
    h1: 'E-Rechnung öffnen und lesen, auch ohne Buchhaltungsprogramm',
    intro: 'Datei in das Feld ziehen oder auswählen: Absender, Positionen, Steuer und Zahlbetrag erscheinen sofort als Rechnung. Gelesen wird nur in Ihrem Browser.',
    resume: `Eine XRechnung ist eine reine XML-Datei; wer sie mit einem Doppelklick öffnet, sieht im Browser oder Editor nur verschachtelte Codezeilen. Lesbar wird sie erst durch einen Viewer, der die Felder der Norm EN 16931 in eine gewohnte Rechnungsansicht übersetzt. Der Viewer auf dieser Seite liest XRechnung in beiden Syntaxen (UBL und CII), ZUGFeRD und Factur-X als XML oder als PDF mit eingebetteter XML sowie Gutschriften. Er zeigt Verkäufer und Käufer, Rechnungsnummer, Datum, jede Position mit Menge und Preis, die Steueraufschlüsselung, den Zahlbetrag und die Bankverbindung. Die Ansicht lässt sich drucken oder über den Druckdialog als PDF speichern. Wichtig für die Buchhaltung: Rechtlich maßgeblich bleibt die XML, nicht der Ausdruck. Sie müssen die empfangene Datei ${AU.rechnungJahre} Jahre unverändert aufbewahren. Die Datei wird nicht hochgeladen: Das Lesen geschieht vollständig in Ihrem Browserfenster, ohne Konto und ohne Speicherung auf einem Server.`,
    faqs: [
      { q: 'Warum zeigt mein Mailprogramm die XRechnung nur als Code an?', a: 'Weil eine XRechnung keine Seitenansicht enthält. Sie ist ein Datensatz für Programme, in dem jede Angabe in einem benannten Feld steht, etwa cbc:IssueDate für das Rechnungsdatum. Mailprogramme und Browser zeigen diesen Text roh an. Ein Viewer ordnet die Felder wieder einer Rechnung zu. Die Datei ist also nicht beschädigt, sie braucht nur das passende Werkzeug zum Lesen.' },
      { q: 'Kann ich eine ZUGFeRD-PDF nicht einfach im PDF-Programm öffnen?', a: 'Doch, die sichtbare PDF-Seite öffnet jedes PDF-Programm. Ob die eingebettete XML zur Ansicht passt, sehen Sie dort aber nicht, und bei einer Abweichung gelten die XML-Daten. Der Viewer liest deshalb die angehängte Datei factur-x.xml aus und zeigt deren Inhalt. Über einen Link können Sie die XML zusätzlich separat herunterladen, etwa für Ihre Buchhaltung.' },
      { q: 'Darf ich statt der XML den Ausdruck aus dem Viewer aufbewahren?', a: 'Nein. Für eine E-Rechnung ist die strukturierte Datei das Original. Nach den Grundsätzen ordnungsmäßiger Buchführung in der Fassung vom Juli 2025 muss die XML in der empfangenen Form aufbewahrt werden. Ein Ausdruck oder eine daraus erzeugte PDF darf als Lesehilfe daneben liegen, ersetzt die XML aber nicht. Die Frist beträgt acht Jahre ab Ende des Jahres der Rechnung.' },
      { q: 'Welche Rechnungen kann der Viewer nicht anzeigen?', a: 'Reine Bild-PDFs ohne eingebettete XML, Scans und Word-Dateien, weil sie keine strukturierten Daten enthalten. Bei ZUGFeRD 1.0 meldet der Viewer das alte Format, das nicht als E-Rechnung im Sinne des Umsatzsteuergesetzes gilt. Exotische Erweiterungen aus dem Profil EXTENDED zeigt er nur so weit, wie sie Feldern der Norm EN 16931 entsprechen; der Rest bleibt in der Datei erhalten.' },
    ],
    body: (h) => `
<h2>So öffnen Sie eine E-Rechnung in drei Schritten</h2>
<p>Speichern Sie zuerst den Anhang aus der E-Mail auf Ihrem Rechner, meist heißt er wie die Rechnungsnummer und endet auf .xml oder .pdf. Ziehen Sie die Datei dann in das gestrichelte Feld oben oder klicken Sie auf den Knopf zur Dateiauswahl. Nach einem Augenblick erscheint rechts eine Karte mit Absender, Zahlbetrag, Nummer, Datum und Fälligkeit, darunter die vollständige Rechnung. Ohne eigene Datei zeigt der Viewer ein Beispiel mit erfundenen Daten, damit Sie die Ansicht vorab kennenlernen.</p>
<p>Der Viewer erkennt die Datei selbst. Eine XML prüft er darauf, ob sie eine Rechnung im Format UBL oder CII ist, und liest dann die Kennung der Spezifikation im Feld BT-24. Daraus ergibt sich, ob eine XRechnung, eine ZUGFeRD- oder Factur-X-Datei oder eine Peppol-Rechnung vorliegt. Eine PDF durchsucht er nach angehängten Dateien und liest die Rechnungs-XML aus, wenn eine vorhanden ist.</p>
<h2>Was die Ansicht zeigt</h2>
${h.table(['Bereich', 'Felder der Norm', 'Wofür Sie es brauchen'], [
  ['Kopf', 'BT-1, BT-2, BT-3, BT-9', 'Nummer, Datum, Rechnungsart und Fälligkeit für die Zahlung'],
  ['Parteien', 'BG-4, BG-7', 'Name, Anschrift, USt-IdNr. oder Steuernummer von Verkäufer und Käufer'],
  ['Positionen', 'BG-25', 'Menge, Einheit, Einzelpreis, Nettobetrag und Steuersatz je Zeile'],
  ['Summen', 'BG-22, BG-23', 'Netto, Steuer je Satz, Brutto und Zahlbetrag'],
  ['Zahlung', 'BG-16, BT-20', 'IBAN, Zahlungsart und Zahlungsbedingungen'],
  ['Technik', 'BT-24, BG-24', 'Format, Profil, angehängte Belege'],
], 'Was der Viewer aus einer E-Rechnung anzeigt.', ['l', 'l', 'l'])}
<p>Die Angaben stammen ausschließlich aus der Datei. Der Viewer rechnet nichts um und ergänzt nichts. Fehlt in der XML zum Beispiel die Bankverbindung, bleibt das Feld leer, statt eine Vermutung zu zeigen. So sehen Sie, was der Absender tatsächlich geschickt hat.</p>
<h2>Ist das überhaupt eine E-Rechnung?</h2>
<p>Nicht jede Datei im Anhang ist eine E-Rechnung. Nach ${h.src('ustg14', '§ 14 Abs. 1 UStG')} zählt nur ein strukturiertes Format nach EN 16931. Eine PDF ohne XML ist eine sonstige Rechnung, ebenso ein Scan. Wenn Sie unsicher sind, was Sie bekommen haben, hilft die kurze Einordnung:</p>
${h.mini('istes', { p: ['datei'], c: 'Datei genauer einordnen' })}
<p>Ab ${h.day(K.P.pflicht.empfangAb)} dürfen Sie eine echte E-Rechnung eines inländischen Lieferanten nicht ablehnen. Laut ${h.src('bmf-faq', 'FAQ des Bundesfinanzministeriums')} genügt für den Empfang ein E-Mail-Postfach; ein Viewer wie dieser reicht, um den Inhalt zu lesen und die Zahlung anzuweisen.</p>
<h2>Drucken, als PDF sichern, XML herunterladen</h2>
<p>Mit dem Link „Rechnung drucken oder als PDF speichern“ öffnet sich der Druckdialog Ihres Browsers mit der Rechnungsansicht im Format A4. Wählen Sie dort einen Drucker oder „Als PDF speichern“. Diese PDF ist eine Lesehilfe, etwa für die Freigabe durch eine Kollegin. Bei einer ZUGFeRD-PDF können Sie außerdem die eingebettete XML getrennt speichern, was manche Buchhaltungsprogramme beim Import verlangen. Wie Sie aus einer XRechnung eine dauerhafte Druckfassung machen, beschreibt ${h.a('xrechnung-pdf', 'XRechnung in PDF umwandeln')}.</p>
<h2>Datenschutz: warum nichts hochgeladen wird</h2>
<p>Rechnungen enthalten Bankdaten, Preise und Namen. Der Viewer verarbeitet die Datei deshalb mit JavaScript direkt in Ihrem Browser. Es gibt keinen Server, der die Datei empfängt, kein Konto und keinen Verlauf. Schließen Sie den Tab, ist die Rechnung aus dem Speicher des Browsers verschwunden. Wer eine amtliche Alternative sucht, findet bei der Steuerverwaltung der Länder einen ${h.src('elster-viewer', 'eigenen Visualisierer')}, der ebenfalls kostenlos ist.</p>
<h2>Nach dem Öffnen: prüfen und ablegen</h2>
<p>Bevor Sie zahlen, lohnt ein Blick auf Rechenfehler und fehlende Pflichtangaben; das übernimmt der ${h.a('validator', 'XRechnung-Validator')} mit derselben Datei. Danach gehört die XML unverändert in Ihre Ablage. Die Frist nach ${h.src('ustg14b', '§ 14b UStG')} beträgt ${h.n(AU.rechnungJahre)} Jahre, und die ${h.src('gobd', 'geänderten GoBD')} verlangen, dass das Original maschinell auswertbar bleibt. Einzelheiten unter ${h.a('archivieren', 'E-Rechnungen archivieren')}. Die aktuell gültige XRechnung hat die Version ${S.xrechnung}; ältere Fassungen liest der Viewer ebenfalls.</p>
`,
  },
  en: {
    slug: 'open-e-invoice',
    nav: 'Open an e-invoice', card: 'Show XRechnung and ZUGFeRD as a readable invoice, print it, save it',
    title: 'Open E-Invoice 2026: XRechnung Viewer With No Upload',
    description: 'Open a German e-invoice in 2026: drop an XRechnung or ZUGFeRD file and read it as a normal invoice, print it or save a PDF. The file never leaves your device.',
    h1: 'Open and read an e-invoice without accounting software',
    intro: 'Drag the file into the box or choose it: sender, line items, VAT and amount due appear at once as an invoice. Everything is read in your browser.',
    resume: `An XRechnung is a pure XML file; double-click it and your browser or editor shows nothing but nested lines of code. It only becomes readable through a viewer that translates the fields of the European standard EN 16931 into a familiar invoice layout. The viewer on this page reads XRechnung in both syntaxes (UBL and CII), ZUGFeRD and Factur-X as XML or as a PDF with embedded XML, and credit notes too. It shows seller and buyer, invoice number, date, every line with quantity and price, the VAT breakdown, the amount due and the bank details. You can print the view or save it as a PDF through the print dialog. One point matters for your books: legally the XML is what counts, not the printout. You must keep the file you received unchanged for ${AU.rechnungJahre} years. Nothing is uploaded: the file is read entirely in your browser window, with no account and no storage on any server.`,
    faqs: [
      { q: 'Why does my email program show the XRechnung as code?', a: 'Because an XRechnung contains no page layout. It is a data record for software in which every item sits in a named field, such as cbc:IssueDate for the invoice date. Email programs and browsers show that text raw. A viewer maps the fields back onto an invoice. The file is not damaged; it just needs the right tool to be read.' },
      { q: 'Can I not just open a ZUGFeRD PDF in my PDF reader?', a: 'You can, and any PDF reader shows the visible page. What it does not show is whether the embedded XML matches that page, and if they differ the XML data prevails. The viewer therefore extracts the attached factur-x.xml and displays its content. A link also lets you download the XML on its own, for example for your accounting software.' },
      { q: 'May I keep the viewer printout instead of the XML file?', a: 'No. For an e-invoice the structured file is the original. Under the German bookkeeping principles (GoBD) as amended in July 2025, the XML must be kept in the form in which it was received. A printout or a PDF made from it may sit alongside as a reading aid, but it does not replace the XML. The retention period is eight years from the end of the invoice year.' },
      { q: 'Which invoices can the viewer not display?', a: 'Image-only PDFs without embedded XML, scans and Word files, because they hold no structured data. For ZUGFeRD 1.0 the viewer flags the old format, which does not count as an e-invoice under the German VAT Act. Unusual extensions from the EXTENDED profile are shown only as far as they match EN 16931 fields; the rest stays intact in the file.' },
    ],
    body: (h) => `
<h2>Open an e-invoice in three steps</h2>
<p>First save the email attachment to your computer; it is usually named after the invoice number and ends in .xml or .pdf. Then drag the file into the dashed box above or click the button to pick it. After a moment a card appears on the right with sender, amount due, number, date and due date, and below it the full invoice. Without a file of your own the viewer shows a sample with made-up data, so you can get to know the layout first.</p>
<p>The viewer identifies the file by itself. For an XML file it checks whether it is a UBL or CII invoice and then reads the specification identifier in field BT-24. That tells it whether it is an XRechnung, a ZUGFeRD or Factur-X file, or a Peppol invoice. For a PDF it looks through the attached files and extracts the invoice XML if there is one.</p>
<h2>What the view shows</h2>
${h.table(['Section', 'Standard fields', 'What you need it for'], [
  ['Header', 'BT-1, BT-2, BT-3, BT-9', 'Number, date, invoice type and due date for payment'],
  ['Parties', 'BG-4, BG-7', 'Name, address, VAT ID or tax number of seller and buyer'],
  ['Lines', 'BG-25', 'Quantity, unit, unit price, net amount and VAT rate per line'],
  ['Totals', 'BG-22, BG-23', 'Net, VAT per rate, gross and amount due'],
  ['Payment', 'BG-16, BT-20', 'IBAN, payment means and payment terms'],
  ['Technical', 'BT-24, BG-24', 'Format, profile, attached documents'],
], 'What the viewer displays from an e-invoice.', ['l', 'l', 'l'])}
<p>Everything comes from the file alone. The viewer converts nothing and adds nothing. If the XML lacks bank details, for example, the field stays empty rather than showing a guess. You see exactly what the sender actually sent.</p>
<h2>Is it an e-invoice at all?</h2>
<p>Not every attachment is an e-invoice. Under ${h.src('ustg14', 'section 14(1) UStG')} only a structured format under EN 16931 qualifies. A PDF without XML is an ordinary invoice, and so is a scan. If you are unsure what you received, this quick classification helps:</p>
${h.mini('istes', { p: ['datei'], c: 'Classify the file in detail' })}
<p>Since ${h.day(K.P.pflicht.empfangAb)} you may not refuse a genuine e-invoice from a domestic supplier. According to the ${h.src('bmf-faq', 'Federal Finance Ministry FAQ')} an email inbox is enough to receive it, and a viewer like this one is enough to read it and approve the payment.</p>
<h2>Print, save as PDF, download the XML</h2>
<p>The link “Print the invoice or save as PDF” opens your browser’s print dialog with the invoice view in A4. Choose a printer or “Save as PDF”. That PDF is a reading aid, for instance for a colleague who signs off payments. For a ZUGFeRD PDF you can also save the embedded XML separately, which some accounting programs ask for on import. How to turn an XRechnung into a lasting print version is covered in ${h.a('xrechnung-pdf', 'XRechnung to PDF')}.</p>
<h2>Privacy: why nothing is uploaded</h2>
<p>Invoices carry bank details, prices and names. The viewer therefore processes the file with JavaScript directly in your browser. There is no server that receives the file, no account and no history. Close the tab and the invoice is gone from the browser’s memory. If you prefer a public alternative, the German state tax administrations offer their own free ${h.src('elster-viewer', 'visualisation tool')}.</p>
<h2>After opening: check and file</h2>
<p>Before you pay, it is worth checking for arithmetic errors and missing mandatory details; the ${h.a('validator', 'XRechnung validator')} does that with the same file. Afterwards the XML goes unchanged into your records. The period under ${h.src('ustg14b', 'section 14b UStG')} is ${h.n(AU.rechnungJahre)} years, and the ${h.src('gobd', 'amended GoBD')} require the original to stay machine-readable. Details on ${h.a('archivieren', 'archiving e-invoices')}. The XRechnung version currently in force is ${S.xrechnung}; the viewer reads older versions too.</p>
`,
  },
});
