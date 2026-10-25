import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* XRechnung en PDF : le viewer affiche la facture, l'impression du navigateur donne la PDF. L'original reste la XML :
   GoBD geändert am 14.07.2025 (Rn. 119, 125, 131), § 14b UStG, § 147 AO. Lu le params.retrieved_at. */
const AB = K.P.aufbewahrung;

export default defineGuide({
  id: 'xrechnung-pdf', group: 'werkzeuge', order: 7,
  tool: 'viewer', toolArg: { mode: 'view' },
  related: ['oeffnen', 'archivieren', 'pdf-umwandeln', 'empfangen', 'xrechnung'],
  sources: ['gobd', 'ustg14b', 'ao147', 'elster-viewer'],
  de: {
    slug: 'xrechnung-in-pdf-umwandeln',
    nav: 'XRechnung in PDF umwandeln', card: 'XML lesbar machen, drucken oder als PDF ablegen, ohne Upload',
    title: 'XRechnung in PDF umwandeln 2026: drucken und ablegen',
    description: 'XRechnung in PDF umwandeln 2026: XML-Datei öffnen, als lesbare Rechnung drucken oder als PDF speichern. Was Sie danach aufbewahren müssen und was nicht.',
    h1: 'XRechnung in PDF umwandeln und richtig ablegen',
    intro: 'XML-Datei auswählen: Die Rechnung erscheint lesbar, mit allen Positionen und Beträgen. Ein Klick auf Drucken erzeugt eine PDF für Ablage, Freigabe oder Steuerbüro.',
    resume: `Eine XRechnung ist eine reine XML-Datei und hat von sich aus keine Ansicht für Menschen. Um sie als PDF zu speichern, braucht es einen Viewer, der die Datenfelder in ein Rechnungslayout setzt; danach erzeugt die Druckfunktion des Browsers mit dem Ziel „Als PDF speichern“ die Datei. Das Werkzeug oben erledigt beides in Ihrem Browser, ohne Upload: Es liest UBL- und CII-Dateien, zeigt Verkäufer, Käufer, Positionen, Steueraufschlüsselung, Bankverbindung und Zahlungsziel und druckt nur die Rechnung, ohne Menü und Werbung. Wichtig für die Buchhaltung: Die PDF ist eine Lesekopie, nicht das Original. Nach den GoBD in der Fassung vom 14. Juli 2025 muss die XML-Datei aufbewahrt werden, unverändert und ${AB.rechnungJahre} Jahre lang nach § 14b UStG. Eine daraus erzeugte PDF müssen Sie nicht zusätzlich aufheben, solange sie keine eigenen steuerlich wichtigen Angaben trägt, etwa Buchungs- oder Freigabevermerke. Löschen dürfen Sie die XML nie zugunsten der PDF.`,
    faqs: [
      { q: 'Darf ich nach dem Umwandeln nur noch die PDF aufbewahren?', a: `Nein. Die XML ist das Original der E-Rechnung und muss ${AB.rechnungJahre} Jahre unverändert gespeichert bleiben. Die GoBD in der Fassung vom 14. Juli 2025 verlangen die Aufbewahrung der strukturierten Datei; eine daraus gedruckte PDF ersetzt sie nicht. Die PDF dürfen Sie zusätzlich ablegen, etwa für die Freigabe im Team, müssen es aber nicht.` },
      { q: 'Warum sieht die PDF anders aus als die Rechnung meines Lieferanten?', a: 'Eine XRechnung enthält nur Daten, kein Layout. Jeder Viewer setzt dieselben Felder in seine eigene Darstellung, mit eigener Schrift, Reihenfolge und Beschriftung. Inhaltlich sind die Angaben identisch, denn sie stammen alle aus derselben XML. Logo, Farben und Briefkopf des Lieferanten fehlen, weil sie nicht Teil der Rechnungsdaten sind.' },
      { q: 'Welche Angaben der XRechnung erscheinen in der gedruckten PDF?', a: 'Der Viewer zeigt Verkäufer und Käufer mit Anschrift, Steuernummer oder USt-IdNr., Rechnungsnummer, Datum, Leistungsdatum, Fälligkeit, Käuferreferenz, alle Positionen mit Menge, Einheit und Preis, die Steueraufschlüsselung, die Summen, Zahlungsart, IBAN und Bemerkungen. Anhänge werden mit Namen aufgelistet. Unter den technischen Angaben stehen Syntax, Profil und Kennung der Spezifikation.' },
      { q: 'Wie drucke ich mehrere XRechnungen auf einmal als PDF?', a: 'Das Werkzeug öffnet jeweils eine Datei, damit jede Rechnung einzeln geprüft wird. Für viele Rechnungen im Monat ist ein Buchhaltungsprogramm mit Stapelverarbeitung sinnvoller. Für gelegentliche Rechnungen wählen Sie die nächste Datei einfach über denselben Knopf aus; die vorige Ansicht wird ersetzt, und es bleibt nichts gespeichert.' },
    ],
    body: (h) => `
<h2>Vom Datensatz zur lesbaren Seite</h2>
<p>Wer eine XRechnung zum ersten Mal in einem Texteditor öffnet, sieht verschachtelte Elemente mit Namen wie <code>cbc:PayableAmount</code> oder <code>ram:GrandTotalAmount</code>. Diese Elemente entsprechen den Feldern der Norm EN 16931: BT-1 für die Rechnungsnummer, BT-27 für den Verkäufer, BT-115 für den Zahlbetrag. Ein Viewer übersetzt sie in eine gewohnte Rechnung. Er liest die Datei, erkennt die Syntax, also UBL oder CII, und ordnet jedes Element seinem Platz im Layout zu.</p>
<p>Die Druckfunktion des Browsers macht daraus eine PDF. Wählen Sie im Druckdialog als Ziel „Als PDF speichern“; das Werkzeug druckt dabei nur die Rechnung selbst, ohne Seitennavigation, Werbeflächen oder Formulare. Format A4, Ränder und Seitenumbruch stellt die Seite passend ein. Die amtliche Alternative ist der ${h.src('elster-viewer', 'Viewer im Rahmen von ELSTER')}, der ebenfalls eine Ansicht erzeugt.</p>
<h2>Was in der PDF steht und was nicht</h2>
${h.table(['Bereich', 'In der PDF', 'Hinweis'], [
  ['Verkäufer, Käufer', 'ja', 'mit Anschrift, Steuernummer, USt-IdNr., Kontakt'],
  ['Positionen', 'ja', 'Menge, Einheit, Einzelpreis, Nettobetrag, Steuersatz'],
  ['Steuer und Summen', 'ja', 'Aufschlüsselung je Steuersatz, Zahlbetrag'],
  ['Zahlung', 'ja', 'Zahlungsart, IBAN, Zahlungsbedingungen'],
  ['Anhänge (BG-24)', 'nur Name', 'Inhalt bleibt in der XML'],
  ['Logo, Briefkopf', 'nein', 'nicht Teil der Rechnungsdaten'],
], 'Inhalt einer aus einer XRechnung erzeugten PDF.', ['l', 'l', 'l'])}
<p>Eingebettete Anhänge, etwa ein Stundennachweis oder ein Lieferschein, liegen in der XML als Base64-Text. Der Viewer nennt sie mit Dateiname und Typ, druckt sie aber nicht mit. Brauchen Sie diese Belege, bewahren Sie sie zusammen mit der XML auf, denn sie gehören zur Rechnung.</p>
<h2>Aufbewahren: die XML, nicht die PDF</h2>
<p>Mit der zweiten Änderung der GoBD vom 14. Juli 2025 hat das Bundesfinanzministerium geklärt, wie hybride und reine E-Rechnungen aufzubewahren sind. Nach den ${h.src('gobd', 'Randnummern 119, 125 und 131 der GoBD')} genügt es, den strukturierten Teil aufzubewahren. Eine Ansicht oder PDF, die nur dieselben Daten zeigt, muss nicht zusätzlich archiviert werden. Anders ist es, wenn die PDF eigene Angaben trägt, die für die Besteuerung wichtig sind, etwa Buchungsvermerke, Kontierungen oder Freigaben: Dann gehört auch sie ins Archiv.</p>
<p>Die Frist beträgt ${h.n(AB.rechnungJahre)} Jahre nach ${h.src('ustg14b', '§ 14b UStG')} und ${h.src('ao147', '§ 147 Abs. 3 AO')}. Sie beginnt mit dem Schluss des Kalenderjahres, in dem die Rechnung ausgestellt wurde. Wie lange eine bestimmte Rechnung noch aufzuheben ist, zeigt der kleine Rechner:</p>
${h.mini('archiv', { p: ['jahr', 'beleg'], c: 'Aufbewahrung im Detail' })}
<h2>Typische Anlässe für die PDF</h2>
<p>In der Praxis brauchen viele Unternehmen die PDF nicht für das Finanzamt, sondern für Menschen: die Freigabe durch den Abteilungsleiter, die Rückfrage beim Lieferanten, die Weitergabe an ein Steuerbüro, das noch keine XML liest, oder die Ablage beim Projekt. Für all das ist die gedruckte Ansicht gut geeignet. Kennzeichnen Sie Freigaben und Vermerke so, dass klar bleibt, zu welcher XML die PDF gehört, am besten über die Rechnungsnummer im Dateinamen.</p>
<p>Wer Rechnungen regelmäßig empfängt, findet die Abläufe unter ${h.a('empfangen', 'E-Rechnungen empfangen')} und die Regeln zum Archiv unter ${h.a('archivieren', 'E-Rechnungen archivieren')}. Für das bloße Ansehen ohne Druck genügt der ${h.a('oeffnen', 'Viewer zum Öffnen')}; den umgekehrten Weg beschreibt ${h.a('pdf-umwandeln', 'PDF in XRechnung umwandeln')}.</p>
`,
  },
  en: {
    slug: 'xrechnung-to-pdf',
    nav: 'XRechnung to PDF', card: 'Make the XML readable, print it or file it as a PDF, without uploading',
    title: 'XRechnung to PDF 2026: Print, Save and File Correctly',
    description: 'Turn an XRechnung into a PDF in 2026: open the XML file, print it as a readable invoice or save it as a PDF, and see what you must keep afterwards, and why.',
    h1: 'Turning an XRechnung into a PDF and filing it correctly',
    intro: 'Pick an XML file: the invoice appears in readable form with every line and amount. One click on print gives you a PDF for filing, approval or your tax adviser.',
    resume: `An XRechnung is a pure XML file and has no human-readable view of its own. To save it as a PDF you need a viewer that places the data fields into an invoice layout; the browser's print function with the destination “Save as PDF” then creates the file. The tool above does both in your browser, with no upload: it reads UBL and CII files, shows seller, buyer, line items, VAT breakdown, bank details and due date, and prints only the invoice, without menus or advertising. One point matters for your records: the PDF is a reading copy, not the original. Under the German GoBD rules as amended on 14 July 2025 the XML file must be kept, unchanged and for ${AB.rechnungJahre} years under section 14b of the VAT Act. You need not keep a PDF generated from it as well, as long as it carries no tax-relevant details of its own, such as posting or approval notes. Never delete the XML in favour of the PDF.`,
    faqs: [
      { q: 'May I keep only the PDF after converting an XRechnung?', a: `No. The XML is the original e-invoice and must stay stored unchanged for ${AB.rechnungJahre} years. The GoBD rules as amended on 14 July 2025 require you to keep the structured file, and a PDF printed from it does not replace it. You may file the PDF as well, for example for approval within your team, but you do not have to.` },
      { q: 'Why does the PDF look different from my supplier’s invoice?', a: 'An XRechnung contains data only, no layout. Every viewer places the same fields into its own design, with its own font, order and labels. The content is identical, because it all comes from the same XML. The supplier’s logo, colours and letterhead are missing because they are not part of the invoice data.' },
      { q: 'Which XRechnung details appear in the printed PDF?', a: 'The viewer shows seller and buyer with address, tax number or VAT ID, invoice number, date, date of supply, due date, buyer reference, every line with quantity, unit and price, the VAT breakdown, the totals, payment means, IBAN and notes. Attachments are listed by name. The technical section shows the syntax, profile and specification identifier.' },
      { q: 'How do I print several XRechnung files to PDF at once?', a: 'The tool opens one file at a time so that each invoice gets looked at on its own. For many invoices a month, accounting software with batch processing makes more sense. For occasional invoices, simply pick the next file with the same button; the previous view is replaced and nothing is stored.' },
    ],
    body: (h) => `
<h2>From data record to readable page</h2>
<p>Anyone who opens an XRechnung in a text editor for the first time sees nested elements with names like <code>cbc:PayableAmount</code> or <code>ram:GrandTotalAmount</code>. These elements correspond to the fields of EN 16931: BT-1 for the invoice number, BT-27 for the seller, BT-115 for the amount due. A viewer translates them into a familiar invoice. It reads the file, detects the syntax, UBL or CII, and maps each element to its place in the layout.</p>
<p>The browser’s print function turns that into a PDF. In the print dialog choose “Save as PDF” as the destination; the tool prints only the invoice itself, without site navigation, ad spaces or forms. A4 format, margins and page breaks are set by the page. The official alternative is the ${h.src('elster-viewer', 'viewer provided through ELSTER')}, which also produces a view.</p>
<h2>What the PDF contains and what it does not</h2>
${h.table(['Section', 'In the PDF', 'Note'], [
  ['Seller, buyer', 'yes', 'with address, tax number, VAT ID, contact'],
  ['Line items', 'yes', 'quantity, unit, unit price, net amount, VAT rate'],
  ['VAT and totals', 'yes', 'breakdown per VAT rate, amount due'],
  ['Payment', 'yes', 'payment means, IBAN, payment terms'],
  ['Attachments (BG-24)', 'name only', 'content stays in the XML'],
  ['Logo, letterhead', 'no', 'not part of the invoice data'],
], 'Content of a PDF generated from an XRechnung.', ['l', 'l', 'l'])}
<p>Embedded attachments, such as a timesheet or a delivery note, sit in the XML as Base64 text. The viewer names them with file name and type but does not print them. If you need these documents, keep them together with the XML, because they belong to the invoice.</p>
<h2>Retention: the XML, not the PDF</h2>
<p>With the second amendment of the GoBD on 14 July 2025, the Federal Ministry of Finance clarified how hybrid and pure e-invoices are to be kept. Under ${h.src('gobd', 'paragraphs 119, 125 and 131 of the GoBD')} it is enough to keep the structured part. A view or PDF that only shows the same data need not be archived as well. It is different if the PDF carries details of its own that matter for tax, such as posting notes, account assignments or approvals: then it belongs in the archive too.</p>
<p>The period is ${h.n(AB.rechnungJahre)} years under ${h.src('ustg14b', 'section 14b UStG')} and ${h.src('ao147', 'section 147(3) of the Fiscal Code')}. It starts at the end of the calendar year in which the invoice was issued. How long a given invoice must still be kept is shown by the small calculator:</p>
${h.mini('archiv', { p: ['jahr', 'beleg'], c: 'Retention in detail' })}
<h2>Typical reasons for needing the PDF</h2>
<p>In practice many businesses need the PDF not for the tax office but for people: approval by a department head, a query to the supplier, passing it to a tax adviser who cannot yet read XML, or filing it with a project. The printed view works well for all of that. Mark approvals and notes so it stays clear which XML the PDF belongs to, ideally with the invoice number in the file name.</p>
<p>If you receive invoices regularly, the workflow is on ${h.a('empfangen', 'receiving e-invoices')} and the archive rules on ${h.a('archivieren', 'archiving e-invoices')}. For viewing without printing, the ${h.a('oeffnen', 'viewer')} is enough; the opposite direction is covered on ${h.a('pdf-umwandeln', 'converting a PDF to XRechnung')}.</p>
`,
  },
});
