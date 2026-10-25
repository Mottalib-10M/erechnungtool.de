import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* ZUGFeRD : Versionen und Profile nach FeRD (ferd-net.de), Zulässigkeit nach BMF-FAQ und BMF-Schreiben vom 15.10.2025, Bund nach FAQ E-Rechnung Bund. */
const S = K.P.standards;

export default defineGuide({
  id: 'zugferd', group: 'formate', order: 20,
  tool: 'zf',
  related: ['zugferd-erstellen', 'xrechnung-oder-zugferd', 'xrechnung', 'pdf-umwandeln', 'formate', 'oeffnen'],
  sources: ['ferd', 'bmf-faq', 'bmf-2025', 'erechnung-bund-faq', 'ustg14'],
  de: {
    slug: 'zugferd',
    nav: 'ZUGFeRD', card: 'PDF mit eingebetteter XML: Versionen, Profile und was als E-Rechnung zählt',
    title: 'ZUGFeRD 2026: Versionen, Profile und Pflicht im Überblick',
    description: 'ZUGFeRD 2026 erklärt: welche Version und welches Profil als E-Rechnung zählt, wie die XML in der PDF steckt und wann Behörden es annehmen. Mit Profil-Check.',
    h1: 'ZUGFeRD: Bedeutung, Version und Profil Ihrer Rechnung',
    intro: 'Version und Profil wählen: Der Check zeigt, ob diese ZUGFeRD-Rechnung als E-Rechnung zwischen Unternehmen genügt und wie die XML in der PDF heißen muss.',
    resume: `ZUGFeRD ist ein hybrides Rechnungsformat des Forums elektronische Rechnung Deutschland (FeRD): Eine PDF/A-3 zeigt die Rechnung für Menschen, und in dieser PDF steckt als Anhang eine XML-Datei in der Syntax UN/CEFACT CII mit denselben Angaben für Programme. Die aktuelle Fassung ist ZUGFeRD ${S.zugferd}, veröffentlicht am ${displayDate(S.zugferdStand, 'de-DE')}; inhaltlich ist sie mit dem französischen Factur-X identisch. Als E-Rechnung im Sinne des Umsatzsteuergesetzes gilt ZUGFeRD nach Auskunft des Bundesfinanzministeriums ab Version ${S.zugferdMindest}, und zwar in den Profilen BASIC, EN 16931 (früher COMFORT), EXTENDED und XRECHNUNG. Die Profile MINIMUM und BASIC WL enthalten keine Rechnungspositionen und reichen deshalb nicht. Maßgeblich sind bei einer ZUGFeRD-Rechnung die XML-Daten; weicht die sichtbare PDF davon ab, gehen die Daten der XML vor. Für Rechnungen an Stellen des Bundes kommt ZUGFeRD nur im Profil XRECHNUNG und dann als reine XML ohne PDF in Frage.`,
    faqs: [
      { q: 'Welche ZUGFeRD-Profile gelten als E-Rechnung?', a: `BASIC, EN 16931, EXTENDED und XRECHNUNG, jeweils ab Version ${S.zugferdMindest}. Diese Profile enthalten alle Pflichtangaben der Norm EN 16931 bis hinunter auf die einzelne Position. MINIMUM und BASIC WL tragen nur Kopfdaten und Summen; sie waren für die Buchung beim Empfänger gedacht, nicht als vollständige Rechnung, und gelten deshalb nicht als E-Rechnung im Sinne des Umsatzsteuergesetzes.` },
      { q: 'Wie erkenne ich, ob in meiner PDF eine ZUGFeRD-XML steckt?', a: 'Öffnen Sie die Anhänge der PDF, im Adobe Reader etwa über das Büroklammer-Symbol. Heißt dort eine Datei factur-x.xml, zugferd-invoice.xml oder xrechnung.xml, ist es eine hybride Rechnung. Schneller geht es mit der PDF-Prüfung dieser Seite: Sie liest die eingebettete Datei im Browser aus, nennt Profil und Version und zeigt die Daten als Rechnung an.' },
      { q: 'Was ist der Unterschied zwischen ZUGFeRD und Factur-X?', a: 'Seit ZUGFeRD 2.1 sind beide technisch dasselbe Format, gemeinsam gepflegt vom deutschen FeRD und dem französischen FNFE-MPE. Die eingebettete Datei heißt factur-x.xml, die Profile tragen dieselben Kennungen. Eine Factur-X-Rechnung aus Frankreich können Sie deshalb in Deutschland wie eine ZUGFeRD-Rechnung lesen und verbuchen; nur das deutsche Profil XRECHNUNG kennt Factur-X nicht in gleicher Weise.' },
      { q: 'Muss ich die PDF einer ZUGFeRD-Rechnung aufbewahren?', a: 'Aufbewahrungspflichtig ist die XML, denn sie ist die eigentliche Rechnung. Den PDF-Teil müssen Sie nach den geänderten GoBD nur zusätzlich aufbewahren, wenn er steuerlich relevante Angaben enthält, die in der XML fehlen. Am einfachsten bewahren Sie die ganze Datei unverändert auf: Dann sind XML und Bild zusammen gesichert, acht Jahre lang.' },
    ],
    body: (h) => `
<h2>So ist eine ZUGFeRD-Datei aufgebaut</h2>
<p>Von außen ist eine ZUGFeRD-Rechnung eine gewöhnliche PDF. Sie folgt allerdings dem Archivstandard PDF/A-3, der Schriften und Farbprofil in die Datei einbettet und Anhänge erlaubt. Einer dieser Anhänge ist die Rechnung in Datenform: eine XML-Datei in der Syntax UN/CEFACT Cross Industry Invoice (CII). In den Metadaten der PDF steht, welches Profil die XML nutzt, und der Anhang ist mit der Beziehung „Alternative“ verknüpft. Das bedeutet: Bild und Daten zeigen dieselbe Rechnung, nur in zwei Formen.</p>
<p>Für den Empfänger hat das einen praktischen Vorteil. Wer keine Software für E-Rechnungen hat, öffnet die PDF wie bisher und kann sie lesen, drucken und bezahlen. Wer eine Buchhaltung mit Import hat, bekommt die Daten ohne Abtippen. Rechtlich entscheiden die Daten: Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} stellt klar, dass bei Abweichungen die XML vorgeht.</p>
<h2>Versionen und Dateinamen</h2>
${h.table(['Version', 'Name der XML', 'E-Rechnung nach UStG'], [
  ['1.0', 'ZUGFeRD-invoice.xml', 'Nein, älter als EN 16931'],
  ['2.0', 'zugferd-invoice.xml', 'Nein'],
  [S.zugferdMindest, 'zugferd-invoice.xml', 'Ja, in den Profilen ab BASIC'],
  ['2.1.1 bis 2.4', 'factur-x.xml', 'Ja, in den Profilen ab BASIC'],
  [S.zugferd, 'factur-x.xml', 'Ja, aktuelle Fassung'],
], 'ZUGFeRD-Versionen und ihre Zulässigkeit nach der BMF-FAQ.', ['l', 'l', 'l'])}
<p>Ältere Rechnungen nach ZUGFeRD 1.0 tauchen in Archiven noch auf. Sie lassen sich weiter lesen, sind aber für Inlandsumsätze an Unternehmen keine E-Rechnung mehr, weil die Version vor der europäischen Norm entstanden ist. Wer heute neu erzeugt, sollte die jeweils aktuelle Fassung von der ${h.src('ferd', 'Seite des FeRD')} nehmen; Programme, die eine ältere Version ab ${S.zugferdMindest} schreiben, bleiben trotzdem zulässig.</p>
<h2>Die sechs Profile</h2>
<p>Ein Profil legt fest, wie viele Angaben die XML enthält. Je höher das Profil, desto mehr Felder stehen zur Verfügung:</p>
<ul>
<li><strong>MINIMUM</strong>: nur Kopfdaten wie Rechnungsnummer, Datum, Parteien und Gesamtbeträge. Keine E-Rechnung.</li>
<li><strong>BASIC WL</strong> („without lines“): Kopfdaten und Steueraufschlüsselung ohne Positionen. Keine E-Rechnung.</li>
<li><strong>BASIC</strong>: der Kern der Norm EN 16931 mit Positionen. E-Rechnung.</li>
<li><strong>EN 16931</strong>, früher COMFORT: die vollständige Norm. Für die meisten Unternehmen das passende Profil.</li>
<li><strong>EXTENDED</strong>: zusätzliche Felder für Branchen mit komplexen Rechnungen, etwa mehrere Lieferorte.</li>
<li><strong>XRECHNUNG</strong>: die deutschen Zusatzregeln der KoSIT, seit ZUGFeRD 2.2. Die XML heißt dann xrechnung.xml.</li>
</ul>
<p>Der Rechnungsersteller dieser Seite schreibt Profil EN 16931. Damit ist die Rechnung für jeden Empfänger in Deutschland eine vollständige E-Rechnung, und die PDF bleibt für Menschen lesbar. Selbst ausprobieren können Sie das unter ${h.a('zugferd-erstellen', 'ZUGFeRD-Rechnung erstellen')}.</p>
<h2>Ist die Datei, die Sie bekommen haben, eine E-Rechnung?</h2>
<p>Viele Lieferanten schreiben „ZUGFeRD“ auf ihre Rechnung, auch wenn nur MINIMUM eingebettet ist oder gar keine XML. Der Check unten ordnet jede Art von Datei ein, von der Papierrechnung bis zur EDI-Nachricht:</p>
${h.mini('istes', { p: ['datei'], c: 'Datei genauer einordnen' })}
<h2>ZUGFeRD bei Behörden</h2>
<p>Die Rechnungseingangsplattformen des Bundes verarbeiten nach der ${h.src('erechnung-bund-faq', 'FAQ von E-Rechnung Bund')} ZUGFeRD nur im Profil XRECHNUNG, und zwar als reine XML ohne den PDF-Teil. Eine hybride PDF mit Profil EN 16931 wird dort nicht angenommen. Für Länder und Kommunen gelten eigene Regeln; viele verlangen ebenfalls eine XRechnung. Wer regelmäßig an Behörden liefert, fährt mit ${h.a('xrechnung', 'XRechnung')} meist einfacher, wer an Unternehmen liefert, mit ZUGFeRD.</p>
`,
  },
  en: {
    slug: 'zugferd',
    nav: 'ZUGFeRD', card: 'PDF with embedded XML: versions, profiles and what counts as an e-invoice',
    title: 'ZUGFeRD 2026: Versions, Profiles and the German Mandate',
    description: 'ZUGFeRD explained for 2026: which version and profile count as an e-invoice, how the XML sits in the PDF and when public bodies accept it. With a profile check.',
    h1: 'ZUGFeRD: check the version and profile of your invoice',
    intro: 'Pick a version and a profile: the check shows whether this ZUGFeRD invoice is enough as a business e-invoice and what the XML inside the PDF must be called.',
    resume: `ZUGFeRD is a hybrid invoice format from the German Forum for Electronic Invoicing (FeRD): a PDF/A-3 shows the invoice to people, and inside that PDF an XML file in the UN/CEFACT CII syntax carries the same details for software. The current release is ZUGFeRD ${S.zugferd}, published on ${displayDate(S.zugferdStand, 'en-GB')}; in content it is identical to the French Factur-X. According to the Federal Ministry of Finance, ZUGFeRD counts as an e-invoice under the German VAT Act from version ${S.zugferdMindest}, in the BASIC, EN 16931 (formerly COMFORT), EXTENDED and XRECHNUNG profiles. The MINIMUM and BASIC WL profiles hold no invoice lines and are therefore not enough. With a ZUGFeRD invoice the XML data is what counts; if the visible PDF differs from it, the XML prevails. For invoices to federal bodies ZUGFeRD is an option only in the XRECHNUNG profile, and then as plain XML without the PDF.`,
    faqs: [
      { q: 'Which ZUGFeRD profiles count as an e-invoice?', a: `BASIC, EN 16931, EXTENDED and XRECHNUNG, each from version ${S.zugferdMindest}. These profiles carry all mandatory details of the EN 16931 standard down to the individual line. MINIMUM and BASIC WL only hold header data and totals; they were meant for booking at the recipient, not as a complete invoice, so they are not e-invoices under the German VAT Act.` },
      { q: 'How can I tell whether my PDF contains ZUGFeRD XML?', a: 'Open the attachments of the PDF, in Adobe Reader for example through the paperclip icon. If you see a file named factur-x.xml, zugferd-invoice.xml or xrechnung.xml, it is a hybrid invoice. The PDF check on this site is quicker: it reads the embedded file in your browser, names profile and version and shows the data as an invoice.' },
      { q: 'What is the difference between ZUGFeRD and Factur-X?', a: 'Since ZUGFeRD 2.1 both are technically the same format, maintained jointly by the German FeRD and the French FNFE-MPE. The embedded file is called factur-x.xml and the profiles share the same identifiers. A Factur-X invoice from France can therefore be read and booked in Germany like a ZUGFeRD invoice; only the German XRECHNUNG profile has no exact French counterpart.' },
      { q: 'Do I have to keep the PDF part of a ZUGFeRD invoice?', a: 'What you must keep is the XML, because it is the actual invoice. Under the amended GoBD you only have to keep the PDF part as well if it holds tax-relevant details missing from the XML. The simplest approach is to keep the whole file unchanged: XML and image are then stored together, for eight years.' },
    ],
    body: (h) => `
<h2>How a ZUGFeRD file is built</h2>
<p>From the outside a ZUGFeRD invoice is an ordinary PDF. It follows the PDF/A-3 archiving standard, however, which embeds fonts and a colour profile in the file and allows attachments. One of those attachments is the invoice as data: an XML file in the UN/CEFACT Cross Industry Invoice (CII) syntax. The PDF metadata states which profile the XML uses, and the attachment is linked with the relationship “Alternative”. In plain terms, image and data show the same invoice in two forms.</p>
<p>This has a practical benefit for the recipient. Someone without e-invoicing software opens the PDF as before and can read, print and pay it. Someone whose accounting imports invoices gets the data without retyping. Legally, the data decides: the ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} makes clear that the XML prevails where the two differ.</p>
<h2>Versions and file names</h2>
${h.table(['Version', 'XML file name', 'E-invoice under the VAT Act'], [
  ['1.0', 'ZUGFeRD-invoice.xml', 'No, predates EN 16931'],
  ['2.0', 'zugferd-invoice.xml', 'No'],
  [S.zugferdMindest, 'zugferd-invoice.xml', 'Yes, in profiles from BASIC'],
  ['2.1.1 to 2.4', 'factur-x.xml', 'Yes, in profiles from BASIC'],
  [S.zugferd, 'factur-x.xml', 'Yes, current release'],
], 'ZUGFeRD versions and their acceptance under the Finance Ministry FAQ.', ['l', 'l', 'l'])}
<p>Older invoices under ZUGFeRD 1.0 still turn up in archives. They remain readable, but for domestic business supplies they are no longer e-invoices, because that version was created before the European standard. If you generate invoices today, take the current release from the ${h.src('ferd', 'FeRD website')}; software that writes an older version from ${S.zugferdMindest} onwards remains acceptable.</p>
<h2>The six profiles</h2>
<p>A profile defines how much information the XML holds. The higher the profile, the more fields are available:</p>
<ul>
<li><strong>MINIMUM</strong>: header data only, such as invoice number, date, parties and totals. Not an e-invoice.</li>
<li><strong>BASIC WL</strong> (“without lines”): header data and VAT breakdown without line items. Not an e-invoice.</li>
<li><strong>BASIC</strong>: the core of EN 16931 with line items. An e-invoice.</li>
<li><strong>EN 16931</strong>, formerly COMFORT: the full standard. The right profile for most businesses.</li>
<li><strong>EXTENDED</strong>: extra fields for sectors with complex invoices, such as several delivery locations.</li>
<li><strong>XRECHNUNG</strong>: the German KoSIT rules, available since ZUGFeRD 2.2. The XML is then called xrechnung.xml.</li>
</ul>
<p>The invoice creator on this site writes the EN 16931 profile. The invoice is then a complete e-invoice for any recipient in Germany, and the PDF stays readable for people. You can try it on ${h.a('zugferd-erstellen', 'create a ZUGFeRD invoice')}.</p>
<h2>Is the file you received an e-invoice?</h2>
<p>Many suppliers print “ZUGFeRD” on their invoices even when only MINIMUM is embedded, or no XML at all. The check below classifies any kind of file, from a paper invoice to an EDI message:</p>
${h.mini('istes', { p: ['datei'], c: 'Classify the file in detail' })}
<h2>ZUGFeRD and public bodies</h2>
<p>According to the ${h.src('erechnung-bund-faq', 'E-Rechnung Bund FAQ')}, the federal invoice platforms process ZUGFeRD only in the XRECHNUNG profile, and only as plain XML without the PDF part. A hybrid PDF with the EN 16931 profile is not accepted there. States and municipalities have their own rules, and many also ask for XRechnung. If you deliver to public bodies regularly, ${h.a('xrechnung', 'XRechnung')} is usually simpler; if you deliver to businesses, ZUGFeRD is.</p>
`,
  },
});
