import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Begriff : § 14 Abs. 1 Satz 3 bis 6 UStG (E-Rechnung, sonstige Rechnung), BMF-Schreiben 15.10.2025, BMF-FAQ. Einordnung der Dateiarten wie engine/regeln.ts istERechnung. */
const S = K.P.standards, PF = K.P.pflicht;

export default defineGuide({
  id: 'was-ist', group: 'formate', order: 25,
  tool: 'istes',
  related: ['pflicht', 'formate', 'en-16931', 'empfangen', 'oeffnen', 'zugferd'],
  sources: ['ustg14', 'bmf-2025', 'bmf-faq', 'ustg27', 'elster-viewer'],
  de: {
    slug: 'was-ist-eine-e-rechnung',
    nav: 'Was ist eine E-Rechnung?', card: 'Die Definition im UStG und welche Dateien dazugehören',
    title: 'E-Rechnung einfach erklärt 2026: Definition und Beispiele',
    description: 'E-Rechnung einfach erklärt, Stand 2026: was das Umsatzsteuergesetz darunter versteht, warum PDF, Scan und Word nicht zählen und wie Sie Ihre Datei einordnen.',
    h1: 'Was ist eine E-Rechnung, und was nicht?',
    intro: 'Wählen Sie, was Sie bekommen oder verschickt haben: Der Check sagt, ob das eine E-Rechnung im Sinne des Gesetzes ist und was daraus folgt.',
    resume: `Eine E-Rechnung ist nach § 14 Abs. 1 UStG eine Rechnung, die in einem strukturierten elektronischen Format ausgestellt, übermittelt und empfangen wird und eine elektronische Verarbeitung ermöglicht. Das Format muss der europäischen Norm EN 16931 entsprechen oder sich, wenn die Beteiligten ein anderes vereinbaren, richtig und vollständig in ein solches Format übertragen lassen. Entscheidend ist also nicht, dass die Rechnung digital ankommt, sondern dass ihre Angaben als Daten in festen Feldern vorliegen. Alles andere nennt das Gesetz eine sonstige Rechnung: die Papierrechnung ebenso wie die PDF aus Word oder dem Buchhaltungsprogramm, das Foto, der Scan und die Excel-Tabelle. Typische E-Rechnungen sind die XRechnung, eine reine XML-Datei, und die ZUGFeRD-Rechnung ab Version ${S.zugferdMindest}, eine PDF mit eingebetteter XML, sofern sie mindestens das Profil BASIC nutzt. Seit 2025 muss jedes Unternehmen in Deutschland E-Rechnungen von anderen inländischen Unternehmen annehmen; ausstellen müssen es je nach Umsatz ab 2027 oder 2028.`,
    faqs: [
      { q: 'Ist eine eingescannte Papierrechnung eine E-Rechnung?', a: 'Nein. Ein Scan ist ein Bild der Rechnung, auch wenn eine Texterkennung den Inhalt durchsuchbar macht. Die Angaben stehen nicht in festen Datenfeldern nach der Norm, also bleibt der Scan eine sonstige Rechnung. Für Ihre Buchhaltung ändert das nichts am Wert des Belegs, wohl aber an der Frage, ob der Lieferant damit seine Pflicht zur E-Rechnung erfüllt.' },
      { q: 'Wie sieht eine E-Rechnung aus, wenn ich sie öffne?', a: 'Eine XRechnung zeigt im Texteditor nur XML-Code mit Elementnamen wie Invoice oder PayableAmount. Lesbar wird sie erst in einem Viewer, der die Felder als Rechnung darstellt. Eine ZUGFeRD-Rechnung öffnet sich dagegen wie jede PDF; die Daten stecken unsichtbar als Anhang darin. Der Viewer auf dieser Seite zeigt beide Arten als Rechnung, ohne die Datei hochzuladen.' },
      { q: 'Muss eine E-Rechnung elektronisch signiert sein?', a: 'Nein. Eine qualifizierte elektronische Signatur ist für E-Rechnungen nicht vorgeschrieben. Echtheit der Herkunft und Unversehrtheit des Inhalts müssen Sie zwar gewährleisten, das gelingt aber auch über ein innerbetriebliches Kontrollverfahren, das Rechnung und Leistung abgleicht. In der Praxis bedeutet das: Bestellung, Lieferung und Rechnung passen zusammen, und die Datei wird unverändert aufbewahrt.' },
      { q: 'Ist jede XML-Datei mit Rechnungsdaten automatisch eine E-Rechnung?', a: 'Nein. Die XML muss einem Format nach EN 16931 folgen, erkennbar an der Kennung im Feld BT-24, und alle Pflichtangaben enthalten. Ein selbst gebauter XML-Export aus einer Tabellenkalkulation erfüllt das in der Regel nicht. Prüfen können Sie das mit der Formaterkennung und der Vorprüfung dieser Seite, für die vollständige Prüfung mit dem Validator der KoSIT.' },
    ],
    body: (h) => `
<h2>Die Definition im Gesetz</h2>
<p>Seit 2025 unterscheidet ${h.src('ustg14', '§ 14 Abs. 1 UStG')} nur noch zwei Arten von Rechnungen. Die elektronische Rechnung ist strukturiert, maschinell verarbeitbar und normgerecht. Die sonstige Rechnung ist alles andere, gleich ob auf Papier oder in einem anderen elektronischen Format. Früher galt jede per E-Mail versandte PDF als elektronische Rechnung; diesen Sprachgebrauch hat das Gesetz aufgegeben. Wer heute von E-Rechnung spricht, meint im steuerlichen Sinn nur noch Dateien, deren Inhalt ein Programm ohne Texterkennung auslesen kann.</p>
<p>Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} erläutert die Begriffe. Danach muss das Format der Norm EN 16931 entsprechen; zulässig ist auch ein anderes Format, wenn Aussteller und Empfänger es vereinbaren und die Angaben richtig und vollständig in ein normgerechtes Format übertragbar sind. Das betrifft vor allem eingespielte EDI-Verfahren.</p>
<h2>Welche Dateien zählen</h2>
${h.table(['Datei', 'Einordnung', 'Grund'], [
  ['Papierrechnung', 'Sonstige Rechnung', 'Nicht elektronisch'],
  ['PDF aus Word oder Buchhaltung', 'Sonstige Rechnung', 'Nur ein Bild, keine Datenfelder'],
  ['Scan oder Foto', 'Sonstige Rechnung', 'Bild, auch mit Texterkennung'],
  ['Word- oder Excel-Datei', 'Sonstige Rechnung', 'Nicht nach EN 16931 strukturiert'],
  [`XRechnung ${S.xrechnung}`, 'E-Rechnung', 'Deutsche Ausprägung der Norm'],
  ['ZUGFeRD BASIC, EN 16931, EXTENDED', 'E-Rechnung', `Ab Version ${S.zugferdMindest}`],
  ['ZUGFeRD MINIMUM, BASIC WL', 'Sonstige Rechnung', 'Keine Rechnungspositionen'],
  ['ZUGFeRD 1.0', 'Sonstige Rechnung', 'Älter als die Norm'],
  ['EDI-Nachricht', `Übergang bis ${h.day(PF.ediBis)}`, 'Danach nur, wenn normgerecht übertragbar'],
], 'Einordnung gängiger Rechnungsdateien nach § 14 Abs. 1 UStG.', ['l', 'l', 'l'])}
<p>Die Tabelle erklärt auch, warum zwei Dateien, die gleich aussehen, rechtlich verschieden sein können. Eine PDF mit eingebetteter ZUGFeRD-XML im Profil EN 16931 und eine PDF ohne Anhang sehen auf dem Bildschirm identisch aus. Erst ein Blick in die Anhänge oder in die PDF-Prüfung dieser Seite zeigt, ob Daten darin stecken.</p>
<h2>Was der Unterschied für Ihr Unternehmen bedeutet</h2>
<p>Für den Empfang heißt die Unterscheidung: Eine E-Rechnung müssen Sie seit dem ${h.day(PF.empfangAb)} annehmen, eine sonstige Rechnung nur, wenn Sie zustimmen. Für den Versand heißt sie: Ab dem Zeitpunkt, an dem für Sie die Ausstellungspflicht gilt, genügt eine sonstige Rechnung bei Inlandsumsätzen an Unternehmen nicht mehr, außer in den gesetzlichen Ausnahmen. Die Stichtage stehen unter ${h.a('pflicht', 'E-Rechnungspflicht')} und ${h.a('fristen', 'Fristen')}.</p>
<p>Ob Ihr Betrieb für den Empfang schon bereit ist, zeigt diese kurze Liste in vier Fragen:</p>
${h.mini('empfang', { p: ['postfach', 'lesen', 'pruefen', 'archiv'], c: 'Empfang vollständig einrichten' })}
<h2>E-Rechnungen lesen</h2>
<p>Eine reine XML-Datei ist für Menschen unhandlich. Um sie zu lesen, brauchen Sie einen Viewer. Neben dem ${h.a('oeffnen', 'Viewer dieser Seite')}, der im Browser arbeitet, bietet die Finanzverwaltung mit dem ${h.src('elster-viewer', 'E-Rechnungs-Viewer auf ELSTER')} ein eigenes Werkzeug an. Für die Buchhaltung bleibt immer die Originaldatei maßgeblich; eine daraus gedruckte Ansicht ist eine Lesehilfe, kein Ersatz. Welches Format eine Datei genau hat, zeigt ${h.a('formate', 'E-Rechnung Formate')}.</p>
`,
  },
  en: {
    slug: 'what-is-an-e-invoice',
    nav: 'What is an e-invoice?', card: 'The legal definition and which files count',
    title: 'E-Invoice Meaning in Germany 2026: Definition and Examples',
    description: 'E-invoice meaning in Germany for 2026: how the VAT Act defines it, why PDF, scan and Word files do not count and how to classify your own file in a few seconds.',
    h1: 'What is an e-invoice, and what is not?',
    intro: 'Pick what you received or sent: the check says whether it is an e-invoice in the legal sense and what follows from that.',
    resume: `Under section 14(1) of the German VAT Act (UStG), an e-invoice is an invoice that is issued, transmitted and received in a structured electronic format that allows electronic processing. The format must comply with the European standard EN 16931 or, if the parties agree on another one, allow the data to be converted correctly and completely into such a format. What matters is therefore not that the invoice arrives digitally but that its details exist as data in fixed fields. The Act calls everything else an ordinary invoice: the paper invoice as well as the PDF from Word or accounting software, the photo, the scan and the spreadsheet. Typical e-invoices are XRechnung, a pure XML file, and the ZUGFeRD invoice from version ${S.zugferdMindest}, a PDF with embedded XML, provided it uses at least the BASIC profile. Since 2025 every business in Germany must accept e-invoices from other domestic businesses; issuing becomes mandatory from 2027 or 2028 depending on turnover.`,
    faqs: [
      { q: 'Is a scanned paper invoice an e-invoice?', a: 'No. A scan is a picture of the invoice, even if text recognition makes the content searchable. The details are not held in fixed data fields under the standard, so the scan remains an ordinary invoice. For your accounting the document keeps its value, but it does affect whether the supplier has met its duty to issue an e-invoice.' },
      { q: 'What does an e-invoice look like when I open it?', a: 'In a text editor an XRechnung shows only XML code with element names such as Invoice or PayableAmount. It only becomes readable in a viewer that displays the fields as an invoice. A ZUGFeRD invoice, by contrast, opens like any PDF; the data sits inside it as an invisible attachment. The viewer on this site shows both kinds as an invoice without uploading the file.' },
      { q: 'Does an e-invoice need an electronic signature?', a: 'No. A qualified electronic signature is not required for e-invoices. You must ensure the authenticity of origin and the integrity of the content, but an internal control procedure that matches invoice and supply achieves this. In practice: order, delivery and invoice fit together, and the file is stored unchanged.' },
      { q: 'Is every XML file with invoice data automatically an e-invoice?', a: 'No. The XML must follow an EN 16931 format, recognisable by the identifier in field BT-24, and contain all mandatory details. A home-made XML export from a spreadsheet usually does not. You can check this with the format detector and the pre-check on this site, and run the full check with the KoSIT validator.' },
    ],
    body: (h) => `
<h2>The legal definition</h2>
<p>Since 2025 ${h.src('ustg14', 'section 14(1) UStG')} distinguishes only two kinds of invoice. The electronic invoice is structured, machine-processable and standard-compliant. The ordinary invoice is everything else, whether on paper or in another electronic format. In the past any PDF sent by email counted as an electronic invoice; the Act has dropped that usage. Today, in the tax sense, an e-invoice means only files whose content software can read without text recognition.</p>
<p>The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} explains the terms. The format must comply with EN 16931; another format is also allowed if issuer and recipient agree on it and the details can be converted correctly and completely into a compliant format. This mainly concerns established EDI procedures.</p>
<h2>Which files count</h2>
${h.table(['File', 'Classification', 'Reason'], [
  ['Paper invoice', 'Ordinary invoice', 'Not electronic'],
  ['PDF from Word or accounting software', 'Ordinary invoice', 'Only a picture, no data fields'],
  ['Scan or photo', 'Ordinary invoice', 'Picture, even with text recognition'],
  ['Word or Excel file', 'Ordinary invoice', 'Not structured to EN 16931'],
  [`XRechnung ${S.xrechnung}`, 'E-invoice', 'German specification of the standard'],
  ['ZUGFeRD BASIC, EN 16931, EXTENDED', 'E-invoice', `From version ${S.zugferdMindest}`],
  ['ZUGFeRD MINIMUM, BASIC WL', 'Ordinary invoice', 'No invoice lines'],
  ['ZUGFeRD 1.0', 'Ordinary invoice', 'Predates the standard'],
  ['EDI message', `Transition until ${h.day(PF.ediBis)}`, 'Afterwards only if convertible to the standard'],
], 'Classification of common invoice files under section 14(1) UStG.', ['l', 'l', 'l'])}
<p>The table also explains why two files that look the same can differ legally. A PDF with embedded ZUGFeRD XML in the EN 16931 profile and a PDF without an attachment look identical on screen. Only a look at the attachments, or the PDF check on this site, shows whether data is inside.</p>
<h2>What the difference means for your business</h2>
<p>For receiving, the distinction means: you have had to accept an e-invoice since ${h.day(PF.empfangAb)}, an ordinary invoice only if you agree. For sending it means: once the duty to issue applies to you, an ordinary invoice is no longer enough for domestic supplies to businesses, except in the legal exceptions. The cut-off dates are on ${h.a('pflicht', 'e-invoicing mandate')} and ${h.a('fristen', 'deadlines')}.</p>
<p>Whether your business is ready to receive is shown by this short list of four questions:</p>
${h.mini('empfang', { p: ['postfach', 'lesen', 'pruefen', 'archiv'], c: 'Set up receiving completely' })}
<h2>Reading e-invoices</h2>
<p>A pure XML file is awkward for people. To read it you need a viewer. Besides the ${h.a('oeffnen', 'viewer on this site')}, which works in your browser, the tax administration offers its own tool, the ${h.src('elster-viewer', 'e-invoice viewer on ELSTER')}. For your accounting the original file always counts; a view printed from it is a reading aid, not a replacement. Which exact format a file has is shown on ${h.a('formate', 'e-invoice formats')}.</p>
`,
  },
});
