import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* ZUGFeRD-PDF : engine/pdf.ts makeZugferdPdf, PDF/A-3b (Schriften eingebettet, XMP mit pdfaid und Factur-X-Schema, OutputIntent sRGB),
   Anhang factur-x.xml mit AFRelationship « Alternative ». Profil EN 16931 (COMFORT). Prüfung : Mustang-CLI 2.26.0 mit veraPDF, alle 4 Fälle gültig.
   GoBD-Änderung 14.07.2025 Rn. 119/125/131 : aufzubewahren ist die XML, die PDF nur bei steuerlich relevanten Zusätzen. */
const S = K.P.standards;

export default defineGuide({
  id: 'zugferd-erstellen', group: 'werkzeuge', order: 5,
  tool: 'creator', toolArg: { preset: 'zugferd' },
  related: ['zugferd', 'erstellen', 'xrechnung-oder-zugferd', 'oeffnen', 'archivieren', 'pdf-umwandeln'],
  sources: ['ferd', 'ustg14', 'gobd', 'bmf-2025', 'erechnung-bund-faq'],
  de: {
    slug: 'zugferd-rechnung-erstellen',
    nav: 'ZUGFeRD-Rechnung erstellen', card: 'PDF/A-3 mit eingebetteter factur-x.xml im Profil EN 16931 erzeugen',
    title: 'ZUGFeRD Rechnung erstellen 2026: PDF/A-3 mit XML, gratis',
    description: 'ZUGFeRD-Rechnung erstellen 2026: lesbare PDF/A-3 mit eingebetteter factur-x.xml im Profil EN 16931, kostenlos im Browser erzeugt und vor dem Laden vorgeprüft.',
    h1: 'ZUGFeRD-Rechnung erstellen: eine PDF für Menschen, eine XML für Programme',
    intro: 'Formular ausfüllen und die fertige ZUGFeRD-PDF laden: Die Seite für Ihren Kunden und die XML für dessen Buchhaltung entstehen aus denselben Daten.',
    resume: `Eine ZUGFeRD-Rechnung ist eine PDF-Datei im Archivformat PDF/A-3, in die eine XML-Datei mit den Rechnungsdaten eingebettet ist. Menschen lesen die PDF wie jede andere Rechnung, Buchhaltungsprogramme lesen die angehängte Datei factur-x.xml und übernehmen die Daten ohne Abtippen. Als E-Rechnung im Sinne des Umsatzsteuergesetzes zählt ZUGFeRD ab Version ${S.zugferdMindest} und in den Profilen ab BASIC; die aktuelle Fassung trägt die Nummer ${S.zugferd}. Der Ersteller auf dieser Seite erzeugt die XML im Profil EN 16931, das früher COMFORT hieß und die vollständige europäische Norm abbildet, und baut daraus eine PDF/A-3b mit eingebetteten Schriften, Farbprofil und den Metadaten, die ein Programm zum Erkennen der Rechnung braucht. Die PDF-Seite zeigt genau die Beträge der XML, denn beide entstehen aus denselben Eingaben. Wir haben die erzeugten Dateien mit dem quelloffenen Prüfwerkzeug Mustang samt veraPDF geprüft: Alle sind gültige PDF/A-3b mit gültiger XML. Erzeugt wird die Datei in Ihrem Browser, ohne Upload.`,
    faqs: [
      { q: 'Was steckt technisch in einer ZUGFeRD-PDF?', a: 'Eine PDF/A-3, also eine Archiv-PDF mit eingebetteten Schriften und festem Farbprofil, dazu als Anhang die Datei factur-x.xml. In den Metadaten der PDF steht, dass sie eine Factur-X-Rechnung enthält und in welchem Profil. Die Verknüpfung des Anhangs trägt die Beziehung „Alternative“: Die XML ist eine gleichwertige Darstellung derselben Rechnung, die Programme bevorzugt auslesen.' },
      { q: 'Welches ZUGFeRD-Profil erzeugt der Ersteller und warum?', a: 'Das Profil EN 16931, früher COMFORT genannt. Es deckt alle Felder der europäischen Norm ab, auch Positionsdaten, und gilt damit sicher als E-Rechnung. Das Profil BASIC wäre ebenfalls zulässig, MINIMUM und BASIC WL dagegen nicht, weil ihnen die Positionen fehlen. EXTENDED geht über die Norm hinaus und ist für Branchen mit besonderen Angaben gedacht.' },
      { q: 'Was gilt, wenn PDF-Seite und XML voneinander abweichen?', a: 'Dann sind die XML-Daten maßgeblich, so sieht es das BMF-Schreiben zur E-Rechnung vor. Bei Rechnungen aus diesem Ersteller kann das nicht passieren, weil Seite und XML aus denselben Eingaben erzeugt werden. Bei Rechnungen anderer Absender lohnt ein Blick in den Viewer: Er zeigt den Inhalt der eingebetteten XML, nicht die gedruckte Seite.' },
      { q: 'Nimmt die Rechnungsplattform des Bundes eine ZUGFeRD-PDF an?', a: 'Nur eingeschränkt. Die Plattformen des Bundes akzeptieren ZUGFeRD ausschließlich im Profil XRECHNUNG und verarbeiten dabei nur die XML, nicht die sichtbare PDF. Für Behörden wählen Sie im Ersteller deshalb den Empfänger Behörde; das Formular erzeugt dann eine XRechnung mit Leitweg-ID, die ohne Umweg angenommen wird.' },
    ],
    body: (h) => `
<h2>Warum ZUGFeRD und nicht nur XML?</h2>
<p>ZUGFeRD wurde vom ${h.src('ferd', 'Forum elektronische Rechnung Deutschland')} entwickelt, damit eine E-Rechnung auch dort funktioniert, wo noch kein Programm sie verarbeitet. Ihr Kunde öffnet die Datei wie jede PDF, prüft sie mit dem Auge und gibt sie frei. Seine Buchhaltung findet dieselbe Rechnung zusätzlich als strukturierte Daten. Das macht ZUGFeRD zum naheliegenden Format für kleine und mittlere Unternehmen, die an andere Unternehmen schreiben und nicht wissen, wie weit der Kunde technisch ist. Die französische Variante heißt Factur-X und ist technisch identisch.</p>
<h2>Was der Ersteller in die Datei schreibt</h2>
${h.table(['Baustein', 'Inhalt', 'Zweck'], [
  ['Sichtbare Seite', 'Rechnung im Format A4 mit allen Angaben', 'Lesen, freigeben, ausdrucken'],
  ['Schriften', 'vollständig eingebettet', 'gleiche Darstellung auf jedem Gerät, Pflicht für PDF/A'],
  ['Farbprofil', 'sRGB als OutputIntent', 'eindeutige Farben, Pflicht für PDF/A'],
  ['XMP-Metadaten', 'PDF/A-Kennung, Factur-X-Schema, Profil', 'Programme erkennen die E-Rechnung'],
  ['Anhang factur-x.xml', 'CII-XML im Profil EN 16931', 'die eigentlichen Rechnungsdaten'],
], 'Aufbau einer ZUGFeRD-PDF aus dem Ersteller.', ['l', 'l', 'l'])}
<p>Die XML folgt der Syntax UN/CEFACT CII, auf der ZUGFeRD beruht. Ihre Kennung im Feld BT-24 lautet „urn:cen.eu:en16931:2017“, das ist das Profil EN 16931. Die Datei heißt immer factur-x.xml, weil Lesesoftware genau nach diesem Namen sucht.</p>
<h2>Version und Profil richtig einordnen</h2>
<p>Ob eine ZUGFeRD-Datei als E-Rechnung zählt, hängt von zwei Angaben ab: der Version und dem Profil. Die Version 1.0 erfüllt die Norm nicht, ab Version ${S.zugferdMindest} ist es eine Frage des Profils. Prüfen Sie eine Kombination, die Ihnen ein Lieferant oder Ihr Programm anbietet:</p>
${h.mini('zf', { p: ['version', 'profil'], c: 'Alle Versionen und Profile vergleichen' })}
<h2>Wie wir die PDF prüfen</h2>
<p>Eine ZUGFeRD-Datei muss zweierlei bestehen: Die PDF muss der Norm PDF/A-3 entsprechen, und die XML muss gültig sein. Beides prüft das quelloffene Werkzeug Mustang, das intern den PDF/A-Prüfer veraPDF nutzt. Für die Methode haben wir vier Rechnungen erzeugt, eine Dienstleistung mit zwei Steuersätzen, eine Kleinunternehmerrechnung, eine Bauleistung mit Reverse Charge und eine Rechnung an eine Behörde. Alle vier wurden als gültige PDF/A-3b mit gültiger XML bewertet. Wer eine erzeugte PDF selbst kontrollieren will, legt sie in den ${h.a('oeffnen', 'Viewer')}: Er zeigt die eingebettete XML und meldet die PDF/A-Kennung.</p>
<h2>Was Sie aufbewahren müssen</h2>
<p>Bei einer ZUGFeRD-Rechnung ist die XML das Original. Die ${h.src('gobd', 'geänderten GoBD vom Juli 2025')} verlangen, die strukturierten Daten aufzubewahren; die PDF-Seite nur dann, wenn sie steuerlich bedeutsame Angaben enthält, die in der XML fehlen. Bei Rechnungen aus diesem Ersteller steht alles in der XML. Am einfachsten bewahren Sie trotzdem die ganze PDF auf, denn sie enthält die XML unverändert. Mehr unter ${h.a('archivieren', 'E-Rechnungen archivieren')}.</p>
<h2>Eine PDF ohne XML umrüsten</h2>
<p>Haben Sie bisher Rechnungen als PDF aus einem Textprogramm verschickt, lassen sich diese nicht nachträglich zu ZUGFeRD machen, indem man eine XML anhängt; die Daten müssen sauber aus den Rechnungsangaben entstehen. Tragen Sie die Rechnung stattdessen einmal in das Formular ein. Eine Anleitung für diesen Weg steht unter ${h.a('pdf-umwandeln', 'PDF in XRechnung umwandeln')}, der Vergleich der Formate unter ${h.a('xrechnung-oder-zugferd', 'XRechnung oder ZUGFeRD')}. Für das ${h.src('ustg14', 'Umsatzsteuergesetz')} sind beide gleichwertig, solange das Profil stimmt.</p>
`,
  },
  en: {
    slug: 'create-zugferd-invoice',
    nav: 'Create a ZUGFeRD invoice', card: 'Produce a PDF/A-3 with embedded factur-x.xml in the EN 16931 profile',
    title: 'ZUGFeRD Invoice Creator 2026: PDF/A-3 With XML, Free',
    description: 'Create a ZUGFeRD invoice in 2026: a readable PDF/A-3 with embedded factur-x.xml in the EN 16931 profile, built free in your browser, pre-checked before saving.',
    h1: 'Create a ZUGFeRD invoice: a PDF for people, XML for software',
    intro: 'Fill in the form and download the finished ZUGFeRD PDF: the page for your customer and the XML for their accounting come from the same data.',
    resume: `A ZUGFeRD invoice is a PDF file in the archive format PDF/A-3 with an XML file holding the invoice data embedded inside. People read the PDF like any other invoice; accounting software reads the attached factur-x.xml file and takes over the data without retyping. Under the German VAT Act ZUGFeRD counts as an e-invoice from version ${S.zugferdMindest} and in the profiles from BASIC upwards; the current release is numbered ${S.zugferd}. The creator on this page produces the XML in the EN 16931 profile, formerly called COMFORT, which covers the full European standard, and builds a PDF/A-3b from it with embedded fonts, a colour profile and the metadata software needs to recognise the invoice. The PDF page shows exactly the amounts in the XML, because both come from the same input. We tested the generated files with the open-source validation tool Mustang, which includes veraPDF: every one is a valid PDF/A-3b with valid XML. The file is built in your browser, with no upload.`,
    faqs: [
      { q: 'What is inside a ZUGFeRD PDF technically?', a: 'A PDF/A-3, an archive PDF with embedded fonts and a fixed colour profile, plus the attachment factur-x.xml. The PDF metadata state that it contains a Factur-X invoice and in which profile. The link to the attachment carries the relationship “Alternative”: the XML is an equivalent representation of the same invoice, and software prefers to read it.' },
      { q: 'Which ZUGFeRD profile does the creator use, and why?', a: 'The EN 16931 profile, formerly called COMFORT. It covers every field of the European standard, line items included, so it safely counts as an e-invoice. BASIC would also be allowed, whereas MINIMUM and BASIC WL are not, because they lack line items. EXTENDED goes beyond the standard and is meant for industries with special requirements.' },
      { q: 'What applies if the PDF page and the XML differ?', a: 'Then the XML data prevails, as the German Finance Ministry letter on e-invoicing provides. With invoices from this creator that cannot happen, because page and XML are generated from the same input. With invoices from other senders, a look in the viewer helps: it shows the content of the embedded XML, not the printed page.' },
      { q: 'Does the federal invoice platform accept a ZUGFeRD PDF?', a: 'Only in a limited way. The federal platforms accept ZUGFeRD solely in the XRECHNUNG profile and then process only the XML, not the visible PDF. For public bodies, set the recipient to authority in the creator; the form then produces an XRechnung with a Leitweg-ID, which is accepted directly.' },
    ],
    body: (h) => `
<h2>Why ZUGFeRD and not just XML?</h2>
<p>ZUGFeRD was developed by the ${h.src('ferd', 'German e-invoicing forum FeRD')} so that an e-invoice also works where no software processes it yet. Your customer opens the file like any PDF, checks it by eye and approves it. Their accounting finds the same invoice as structured data too. That makes ZUGFeRD the natural format for small and medium businesses that invoice other businesses and do not know how far along their customer is technically. The French variant is called Factur-X and is technically identical.</p>
<h2>What the creator writes into the file</h2>
${h.table(['Component', 'Content', 'Purpose'], [
  ['Visible page', 'A4 invoice with every detail', 'Read, approve, print'],
  ['Fonts', 'fully embedded', 'same look on every device, required for PDF/A'],
  ['Colour profile', 'sRGB as OutputIntent', 'unambiguous colours, required for PDF/A'],
  ['XMP metadata', 'PDF/A identifier, Factur-X schema, profile', 'software recognises the e-invoice'],
  ['Attachment factur-x.xml', 'CII XML in the EN 16931 profile', 'the actual invoice data'],
], 'Structure of a ZUGFeRD PDF from the creator.', ['l', 'l', 'l'])}
<p>The XML follows the UN/CEFACT CII syntax on which ZUGFeRD is based. Its identifier in field BT-24 reads “urn:cen.eu:en16931:2017”, which is the EN 16931 profile. The file is always named factur-x.xml, because reading software looks for exactly that name.</p>
<h2>Placing version and profile correctly</h2>
<p>Whether a ZUGFeRD file counts as an e-invoice depends on two things: the version and the profile. Version 1.0 does not meet the standard; from version ${S.zugferdMindest} it is a question of profile. Check a combination that a supplier or your software offers you:</p>
${h.mini('zf', { p: ['version', 'profil'], c: 'Compare every version and profile' })}
<h2>How we test the PDF</h2>
<p>A ZUGFeRD file has to pass two tests: the PDF must conform to PDF/A-3, and the XML must be valid. The open-source tool Mustang checks both, using the PDF/A validator veraPDF internally. For our method we generated four invoices: a service at two VAT rates, a small-business invoice, a construction service under the reverse charge and an invoice to a public body. All four were rated valid PDF/A-3b with valid XML. If you want to check a generated PDF yourself, drop it into the ${h.a('oeffnen', 'viewer')}: it shows the embedded XML and reports the PDF/A identifier.</p>
<h2>What you must keep</h2>
<p>For a ZUGFeRD invoice the XML is the original. The ${h.src('gobd', 'GoBD as amended in July 2025')} require the structured data to be kept, and the PDF page only if it carries tax-relevant details missing from the XML. In invoices from this creator everything is in the XML. The simplest course is still to keep the whole PDF, since it contains the XML unchanged. More on ${h.a('archivieren', 'archiving e-invoices')}.</p>
<h2>Upgrading a PDF without XML</h2>
<p>If you have so far sent invoices as PDFs from a word processor, you cannot turn them into ZUGFeRD after the fact by attaching some XML; the data has to come cleanly from the invoice details. Enter the invoice in the form once instead. A guide to that route is on ${h.a('pdf-umwandeln', 'convert PDF to XRechnung')}, and the format comparison on ${h.a('xrechnung-oder-zugferd', 'XRechnung or ZUGFeRD')}. For the ${h.src('ustg14', 'VAT Act')} both are equivalent as long as the profile is right.</p>
`,
  },
});
