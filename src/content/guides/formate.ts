import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Formate : § 14 Abs. 1 UStG, BMF-FAQ (zulässige Formate), BMF-Schreiben 15.10.2025, Kennungen BT-24 wie in engine/parse.ts (detect) ausgewertet. EDI : § 27 Abs. 38 Nr. 3 UStG. */
const S = K.P.standards, PF = K.P.pflicht;

export default defineGuide({
  id: 'formate', group: 'formate', order: 23,
  tool: 'viewer', toolArg: { mode: 'format' },
  related: ['xrechnung', 'zugferd', 'en-16931', 'edi', 'was-ist', 'oeffnen'],
  sources: ['ustg14', 'bmf-faq', 'bmf-2025', 'kosit-xrechnung', 'ferd', 'ustg27'],
  de: {
    slug: 'e-rechnung-formate',
    nav: 'E-Rechnung Formate', card: 'XRechnung, ZUGFeRD, Peppol, EDI: welches Format eine Datei hat',
    title: 'E-Rechnung Formate 2026: XRechnung, ZUGFeRD, Peppol, EDI',
    description: 'E-Rechnung Formate 2026 erkennen: Datei wählen, und die Seite nennt Standard, Profil und Version und sagt, ob es eine E-Rechnung nach UStG ist. Ohne Upload.',
    h1: 'E-Rechnung Formate: welches Format hat Ihre Datei?',
    intro: 'Datei ablegen oder ein Beispiel wählen: Die Erkennung liest die Kennung der Rechnung und sagt, ob sie als E-Rechnung im Sinne des Umsatzsteuergesetzes gilt.',
    resume: `Als E-Rechnung zählt in Deutschland jede Rechnung in einem strukturierten elektronischen Format, das der europäischen Norm EN 16931 entspricht. Das Bundesfinanzministerium nennt dafür vor allem drei Wege: die XRechnung der KoSIT, aktuell Version ${S.xrechnung}, als reine XML in UBL oder CII; ZUGFeRD beziehungsweise Factur-X ab Version ${S.zugferdMindest}, eine PDF mit eingebetteter CII-XML, außer in den Profilen MINIMUM und BASIC WL; und andere Formate, etwa Peppol BIS Billing oder EDI-Nachrichten, wenn sich ihre Angaben richtig und vollständig in die Norm übertragen lassen. Welches Format eine Datei hat, steht in ihr selbst: Das Feld BT-24 enthält die Kennung der Spezifikation, also eine Zeichenkette, die mit urn:cen.eu:en16931:2017 beginnt und je nach Format um einen Zusatz ergänzt wird. Die Erkennung oben liest dieses Feld, die Syntax und bei PDFs die eingebettete Datei aus. Keine E-Rechnung sind PDFs ohne XML, Scans, Office-Dateien und die alte Version ZUGFeRD 1.0. EDI bleibt mit Zustimmung bis Ende 2027 zulässig.`,
    faqs: [
      { q: 'Woran erkennt man das Format einer E-Rechnung?', a: 'An der Kennung im Feld BT-24, in UBL im Element CustomizationID, in CII im Element GuidelineSpecifiedDocumentContextParameter. Endet sie auf xrechnung_3.0, ist es eine XRechnung; enthält sie factur-x.eu mit einem Profilnamen, ist es ZUGFeRD; enthält sie peppol.eu, ist es Peppol BIS. Die Formaterkennung auf dieser Seite liest das automatisch und zeigt die vollständige Kennung an.' },
      { q: 'Ist eine Peppol-Rechnung in Deutschland eine E-Rechnung?', a: 'Ja. Peppol BIS Billing 3.0 ist eine Ausprägung der EN 16931 in der Syntax UBL und damit ein zulässiges Format. Über das Peppol-Netz können Sie auch an Behörden des Bundes liefern, die Peppol als Eingangskanal anbieten. Für den Versand brauchen Sie einen Zugangspunkt, meist über Ihre Buchhaltungssoftware oder einen Dienstleister.' },
      { q: 'Warum zeigt die Erkennung bei meiner Datei unbekannt?', a: 'Dann fehlt die Kennung in BT-24 oder sie gehört zu keinem bekannten Format. Das passiert bei selbst gebauten XML-Exporten, bei Dateien, die keine Rechnung sind, etwa Lieferscheine, und bei beschädigten Dateien. Eine Rechnung ohne gültige Kennung ist keine E-Rechnung nach EN 16931. Bitten Sie den Absender um eine XRechnung oder ZUGFeRD-Datei.' },
      { q: 'Gilt ZUGFeRD 1.0 noch als E-Rechnung?', a: 'Nein. ZUGFeRD 1.0 erschien vor der europäischen Norm und erfüllt sie nicht. Für Inlandsumsätze zwischen Unternehmen ist eine solche Datei deshalb eine sonstige Rechnung. Lesen können Sie die eingebettete Datei weiterhin, und für alte Belege im Archiv ändert sich nichts. Neue Rechnungen sollten mindestens ZUGFeRD 2.0.1 nutzen, besser die aktuelle Fassung.' },
    ],
    body: (h) => `
<h2>Die zulässigen Formate im Überblick</h2>
${h.table(['Format', 'Syntax', 'Kennung in BT-24 enthält', 'E-Rechnung'], [
  ['XRechnung', 'UBL oder CII', 'xrechnung_3.0', 'Ja'],
  ['ZUGFeRD / Factur-X EN 16931', 'CII in PDF/A-3', 'nur urn:cen.eu:en16931:2017', 'Ja'],
  ['ZUGFeRD BASIC, EXTENDED', 'CII in PDF/A-3', 'factur-x.eu mit basic oder extended', 'Ja'],
  ['ZUGFeRD MINIMUM, BASIC WL', 'CII in PDF/A-3', 'factur-x.eu mit minimum oder basicwl', 'Nein'],
  ['Peppol BIS Billing 3.0', 'UBL', 'peppol.eu:2017:poacc:billing:3.0', 'Ja'],
  ['EDI, z. B. EDIFACT', 'eigene Syntax', 'keine', `Übergang bis ${h.day(PF.ediBis)}`],
], 'Formate und ihre Kennung, wie die Erkennung dieser Seite sie auswertet.', ['l', 'l', 'l', 'l'])}
<p>Die Grundlage ist ${h.src('ustg14', '§ 14 Abs. 1 UStG')}: strukturiertes Format, elektronische Verarbeitung möglich, Übereinstimmung mit der Norm. Welche Formate das konkret erfüllen, beschreibt das Bundesfinanzministerium in seiner ${h.src('bmf-faq', 'FAQ zur E-Rechnung')} und im ${h.src('bmf-2025', 'Schreiben vom 15. Oktober 2025')}. XRechnung und ZUGFeRD ab ${S.zugferdMindest} sind dort ausdrücklich genannt, andere Formate unter der Bedingung, dass die Angaben verlustfrei in die Norm übertragbar sind.</p>
<h2>So arbeitet die Erkennung</h2>
<p>Die Erkennung oben geht in drei Schritten vor. Zuerst prüft sie, ob die Datei eine PDF oder eine XML ist. Bei einer PDF sucht sie unter den Anhängen nach einer Rechnungs-XML und liest sie aus. Dann bestimmt sie die Syntax am Wurzelelement: Invoice oder CreditNote für UBL, CrossIndustryInvoice für CII, CrossIndustryDocument für das alte ZUGFeRD 1.0. Zuletzt liest sie die Kennung der Spezifikation und ordnet sie einem Format, einem Profil und einer Version zu.</p>
<p>Alles geschieht in Ihrem Browser. Die Datei wird nicht übertragen, und nach dem Schließen des Fensters ist nichts gespeichert. Für die Kennung reicht schon die Angabe in der Datei; ob der Inhalt alle Regeln einhält, prüft der ${h.a('validator', 'Validator')}.</p>
<h2>UBL und CII: zwei Schreibweisen derselben Rechnung</h2>
<p>Die Norm EN 16931 beschreibt nur, welche Angaben eine Rechnung hat. Wie sie in XML geschrieben werden, legen zwei Syntaxen fest: UBL 2.1 von OASIS und Cross Industry Invoice von UN/CEFACT. In UBL steht der Zahlbetrag im Element PayableAmount, in CII im Element DuePayableAmount; gemeint ist in beiden Fällen BT-115. Programme in Deutschland sollen beide lesen können. Für Sie als Absender bedeutet das: Die Wahl der Syntax ist Geschmackssache, die Wahl des Formats nicht.</p>
<h2>EDI im Übergang</h2>
<p>Viele Handels- und Industrieunternehmen tauschen Rechnungen seit Jahrzehnten per EDI, etwa im Format EDIFACT. Nach ${h.src('ustg27', '§ 27 Abs. 38 UStG')} bleibt das mit Zustimmung des Empfängers bis Ende 2027 zulässig. Danach ist EDI nur noch erlaubt, wenn sich die Angaben richtig und vollständig in ein Format nach EN 16931 übertragen lassen. Ob Ihr EDI-Verfahren darunter fällt, prüft der Rechner:</p>
${h.mini('edi', { p: ['jahr', 'zust', 'extrakt'], c: 'EDI im Detail prüfen' })}
<p>Mehr zu den Bedingungen steht auf ${h.a('edi', 'EDI-Rechnung')}. Was eine E-Rechnung grundsätzlich ausmacht, erklärt ${h.a('was-ist', 'Was ist eine E-Rechnung?')}, und welches Datenmodell hinter allen Formaten steckt, ${h.a('en-16931', 'EN 16931')}.</p>
`,
  },
  en: {
    slug: 'e-invoice-formats',
    nav: 'E-invoice formats', card: 'XRechnung, ZUGFeRD, Peppol, EDI: which format a file uses',
    title: 'E-Invoice Formats 2026: XRechnung, ZUGFeRD, Peppol and EDI',
    description: 'Identify e-invoice formats in 2026: pick a file and the page names standard, profile and version and says if it is an e-invoice under German VAT law. No upload.',
    h1: 'E-invoice formats: which format is your file?',
    intro: 'Drop a file or pick an example: the detector reads the invoice identifier and says whether it counts as an e-invoice under the German VAT Act.',
    resume: `In Germany an e-invoice is any invoice in a structured electronic format that complies with the European standard EN 16931. The Federal Ministry of Finance names three main routes: KoSIT’s XRechnung, currently version ${S.xrechnung}, as pure XML in UBL or CII; ZUGFeRD or Factur-X from version ${S.zugferdMindest}, a PDF with embedded CII XML, except in the MINIMUM and BASIC WL profiles; and other formats, such as Peppol BIS Billing or EDI messages, if their data can be converted into the standard correctly and completely. The file itself says which format it uses: field BT-24 holds the specification identifier, a string that starts with urn:cen.eu:en16931:2017 and is extended with a suffix depending on the format. The detector above reads this field, the syntax and, for PDFs, the embedded file. PDFs without XML, scans, office files and the old ZUGFeRD 1.0 are not e-invoices. EDI remains allowed with consent until the end of 2027.`,
    faqs: [
      { q: 'How do you recognise the format of an e-invoice?', a: 'By the identifier in field BT-24, held in UBL in the CustomizationID element and in CII in the GuidelineSpecifiedDocumentContextParameter element. If it ends in xrechnung_3.0 it is an XRechnung; if it contains factur-x.eu with a profile name it is ZUGFeRD; if it contains peppol.eu it is Peppol BIS. The detector on this site reads it automatically and shows the full identifier.' },
      { q: 'Is a Peppol invoice an e-invoice in Germany?', a: 'Yes. Peppol BIS Billing 3.0 is a specification of EN 16931 in the UBL syntax and therefore an accepted format. Via the Peppol network you can also deliver to federal authorities that offer Peppol as an intake channel. To send you need an access point, usually through your accounting software or a service provider.' },
      { q: 'Why does the detector show unknown for my file?', a: 'Then the identifier in BT-24 is missing or belongs to no known format. This happens with home-made XML exports, with files that are not invoices, such as delivery notes, and with damaged files. An invoice without a valid identifier is not an EN 16931 e-invoice. Ask the sender for an XRechnung or ZUGFeRD file.' },
      { q: 'Does ZUGFeRD 1.0 still count as an e-invoice?', a: 'No. ZUGFeRD 1.0 appeared before the European standard and does not meet it. For domestic supplies between businesses such a file is therefore an ordinary invoice. You can still read the embedded file, and nothing changes for old documents in your archive. New invoices should use at least ZUGFeRD 2.0.1, preferably the current release.' },
    ],
    body: (h) => `
<h2>The accepted formats at a glance</h2>
${h.table(['Format', 'Syntax', 'BT-24 identifier contains', 'E-invoice'], [
  ['XRechnung', 'UBL or CII', 'xrechnung_3.0', 'Yes'],
  ['ZUGFeRD / Factur-X EN 16931', 'CII in PDF/A-3', 'only urn:cen.eu:en16931:2017', 'Yes'],
  ['ZUGFeRD BASIC, EXTENDED', 'CII in PDF/A-3', 'factur-x.eu with basic or extended', 'Yes'],
  ['ZUGFeRD MINIMUM, BASIC WL', 'CII in PDF/A-3', 'factur-x.eu with minimum or basicwl', 'No'],
  ['Peppol BIS Billing 3.0', 'UBL', 'peppol.eu:2017:poacc:billing:3.0', 'Yes'],
  ['EDI, e.g. EDIFACT', 'own syntax', 'none', `Transition until ${h.day(PF.ediBis)}`],
], 'Formats and their identifiers, as the detector on this site reads them.', ['l', 'l', 'l', 'l'])}
<p>The basis is ${h.src('ustg14', 'section 14(1) UStG')}: a structured format, electronic processing possible, compliance with the standard. Which formats meet this in practice is described by the Federal Ministry of Finance in its ${h.src('bmf-faq', 'e-invoicing FAQ')} and its ${h.src('bmf-2025', 'letter of 15 October 2025')}. XRechnung and ZUGFeRD from ${S.zugferdMindest} are named explicitly there, other formats on condition that the data can be converted into the standard without loss.</p>
<h2>How the detector works</h2>
<p>The detector above works in three steps. First it checks whether the file is a PDF or an XML file. For a PDF it looks among the attachments for an invoice XML and reads it. Next it determines the syntax from the root element: Invoice or CreditNote for UBL, CrossIndustryInvoice for CII, CrossIndustryDocument for the old ZUGFeRD 1.0. Finally it reads the specification identifier and maps it to a format, a profile and a version.</p>
<p>Everything happens in your browser. The file is not transferred, and nothing is stored once you close the window. The identifier in the file is enough for the format; whether the content meets every rule is checked by the ${h.a('validator', 'validator')}.</p>
<h2>UBL and CII: two ways of writing the same invoice</h2>
<p>EN 16931 only describes which details an invoice has. How they are written in XML is set by two syntaxes: UBL 2.1 from OASIS and the Cross Industry Invoice from UN/CEFACT. In UBL the amount due sits in the PayableAmount element, in CII in DuePayableAmount; both mean BT-115. Software in Germany should be able to read both. For you as the sender, the choice of syntax is a matter of taste, the choice of format is not.</p>
<h2>EDI during the transition</h2>
<p>Many retail and industrial companies have exchanged invoices by EDI for decades, for example in the EDIFACT format. Under ${h.src('ustg27', 'section 27(38) UStG')} this stays allowed with the recipient’s consent until the end of 2027. After that, EDI is only allowed if the data can be converted correctly and completely into an EN 16931 format. The calculator checks whether your EDI process qualifies:</p>
${h.mini('edi', { p: ['jahr', 'zust', 'extrakt'], c: 'Check EDI in detail' })}
<p>More on the conditions is on ${h.a('edi', 'EDI invoicing')}. What makes an e-invoice in principle is explained on ${h.a('was-ist', 'what is an e-invoice?')}, and the data model behind every format on ${h.a('en-16931', 'EN 16931')}.</p>
`,
  },
});
