import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Vorprüfung : engine/validate.ts (BR-01..BR-27, BR-CO, BR-S/E/AE/K/G/O, BR-DE, PEPPOL-EN16931-R010/R020, LEITWEG).
   Abgleich mit dem KoSIT-Validator 1.6.3 / Konfiguration XRechnung 3.0.2 : alle erzeugten Testdateien « acceptable ».
   Folgen der Fehlerarten : BMF-Schreiben 15.10.2025 Rn. 6a, 6b, 35a. */
const S = K.P.standards;

export default defineGuide({
  id: 'validator', group: 'werkzeuge', order: 2,
  tool: 'viewer', toolArg: { mode: 'check' },
  related: ['oeffnen', 'bmf', 'xrechnung', 'en-16931', 'leitweg', 'erstellen'],
  sources: ['kosit-validator', 'kosit-xrechnung', 'kosit-testsuite', 'bmf-2025', 'ustg14'],
  de: {
    slug: 'xrechnung-validator',
    nav: 'XRechnung-Validator', card: 'E-Rechnung vorprüfen: Pflichtfelder, Summen, BR-DE-Regeln, Leitweg-ID',
    title: 'XRechnung Validator 2026: E-Rechnung online vorprüfen',
    description: 'XRechnung Validator 2026: E-Rechnung im Browser vorprüfen: Regeln der EN 16931 und BR-DE, Summen und Leitweg-ID. Jede Meldung mit Feld und Bedeutung erklärt.',
    h1: 'XRechnung prüfen: Vorprüfung mit verständlichen Meldungen',
    intro: 'Datei ablegen: Die Vorprüfung rechnet Summen nach und listet jede verletzte Regel mit Kennung und Feld. Das Beispiel oben enthält absichtlich zwei Fehler.',
    resume: `Die Vorprüfung auf dieser Seite liest eine XRechnung oder ZUGFeRD-Datei im Browser und prüft sie gegen die wichtigsten Geschäftsregeln: die Pflichtfelder der Norm EN 16931 (Regeln BR-01 bis BR-27), die Rechenregeln BR-CO für Summen und Steuer, die Regeln der Steuerkategorien wie BR-S, BR-E und BR-AE, die deutschen Zusatzregeln BR-DE der XRechnung ${S.xrechnung} und die Prüfziffer einer Leitweg-ID. Jede Meldung nennt die Regel, das betroffene Feld (BT oder BG) und eine Erklärung in Klartext. Den vollständigen amtlichen Prüfsatz aus XML-Schema und Schematron führt nur der Validator der Koordinierungsstelle für IT-Standards (KoSIT) aus, ein Java-Programm ohne Weboberfläche. Unsere Testrechnungen haben wir mit diesem Validator in der Konfiguration für XRechnung ${S.xrechnung} abgeglichen; alle erzeugten Dateien wurden dort als gültig angenommen. Für den Alltag gilt: Meldet die Vorprüfung keinen Fehler, ist die Rechnung in aller Regel in Ordnung; meldet sie einen, wissen Sie, welches Feld Sie korrigieren müssen.`,
    faqs: [
      { q: 'Was bedeuten Kennungen wie BR-CO-15 oder BR-DE-15?', a: 'Das sind die Nummern der Geschäftsregeln. BR ohne Zusatz steht für eine Grundregel der Norm EN 16931, etwa eine Pflichtangabe. BR-CO sind Rechenregeln, BR-CO-15 verlangt zum Beispiel, dass Brutto gleich Netto plus Steuer ist. BR-DE sind die deutschen Zusatzregeln der XRechnung; BR-DE-15 fordert die Käuferreferenz im Feld BT-10. Die Kennung hilft, eine Fehlermeldung eines Portals einzuordnen.' },
      { q: 'Warum meldet ein Rechnungsportal Fehler, die die Vorprüfung nicht zeigt?', a: 'Portale führen den vollständigen Prüfsatz aus, oft zusätzlich eigene Regeln, etwa zu erlaubten Codelisten oder zur Länge von Feldern. Die Vorprüfung deckt die Regeln ab, die in der Praxis am häufigsten scheitern, aber nicht jede Schemaprüfung. Notieren Sie die Kennung aus der Meldung des Portals; die Erklärung finden Sie in der Spezifikation der KoSIT oder auf der Seite zur Norm EN 16931.' },
      { q: 'Ist eine Rechnung mit einer Warnung trotzdem gültig?', a: 'Eine Warnung zeigt eine Auffälligkeit, keinen Verstoß, etwa eine Leitweg-ID, deren Prüfziffer nicht stimmt, wenn der Empfänger kein Bundesportal ist. Fehler dagegen sind Regelverstöße. Umsatzsteuerlich zählt, ob die Pflichtangaben des Umsatzsteuergesetzes richtig sind. Ein Verstoß gegen eine rein technische Regel ohne Steuerbezug macht die Rechnung laut BMF-Schreiben nicht fehlerhaft.' },
      { q: 'Kann ich mit der Vorprüfung auch eine ZUGFeRD-PDF prüfen?', a: 'Ja. Legen Sie die PDF ab, dann liest die Vorprüfung die eingebettete XML aus und prüft deren Inhalt nach denselben Regeln. Die deutschen Regeln BR-DE wendet sie nur an, wenn die Datei als XRechnung gekennzeichnet ist oder Sie angeben, dass die Rechnung an eine Behörde geht. Ob die PDF selbst der Norm PDF/A-3 entspricht, prüft sie nicht.' },
    ],
    body: (h) => `
<h2>Was die Vorprüfung kontrolliert</h2>
<p>Die Prüfung geht die Rechnung in festen Schritten durch. Zuerst die Pflichtangaben: Rechnungsnummer, Datum, Rechnungsart, Währung, Namen und Anschriften beider Seiten, mindestens eine Position. Dann die Rechnung selbst: Jede Positionssumme muss Menge mal Preis ergeben, die Summe der Positionen muss dem Feld BT-106 entsprechen, und die Steuer je Satz muss zum Steuerbetrag passen. Danach folgen die Regeln der Steuerkategorien und zuletzt, bei einer XRechnung, die nationalen Regeln.</p>
${h.table(['Regelgruppe', 'Beispiel', 'Was geprüft wird'], [
  ['BR-01 bis BR-27', 'BR-02', 'Pflichtfelder der Norm, hier die Rechnungsnummer BT-1'],
  ['BR-CO', 'BR-CO-10', 'Summe der Positionen gleich Feld BT-106'],
  ['BR-S, BR-E, BR-AE', 'BR-AE-02', 'Reverse Charge: USt-IdNr. des Käufers vorhanden'],
  ['BR-DE', 'BR-DE-15', 'Käuferreferenz BT-10 bei einer XRechnung'],
  ['PEPPOL R010/R020', 'R020', 'Elektronische Adresse von Käufer und Verkäufer'],
  ['Leitweg-ID', 'Prüfziffer', 'Modulo 97-10 über Grob- und Feinadressierung'],
], 'Regelgruppen der Vorprüfung mit je einem Beispiel.', ['l', 'l', 'l'])}
<p>Das Beispiel, das beim Laden erscheint, ist eine XRechnung, in der zwei Dinge fehlen: die Käuferreferenz und ein stimmiger Zahlbetrag. Die Tabelle unter der Karte zeigt beide Fehler mit Regel und Feld. Wählen Sie ein anderes Beispiel, verschwinden die Meldungen.</p>
<h2>Vorprüfung und amtlicher Validator</h2>
<p>Die ${h.src('kosit-validator', 'Prüfsoftware der KoSIT')} ist das Referenzwerkzeug. Sie prüft eine Datei zuerst gegen das XML-Schema, also gegen Aufbau und Datentypen, und dann gegen die Schematron-Regeln der ${h.src('kosit-xrechnung', 'XRechnung')}. Das Ergebnis ist ein Bericht mit der Empfehlung, die Datei anzunehmen oder abzulehnen. Die Software läuft mit Java auf dem eigenen Rechner und richtet sich an Entwickler und Rechnungseingangsstellen.</p>
<p>Unsere Vorprüfung bildet den Teil der Regeln nach, der für Menschen ohne Programmierkenntnisse am meisten bringt, und erklärt jede Meldung auf Deutsch und Englisch. Um sicherzugehen, dass sie richtig rechnet, haben wir sie mit den Beispieldateien der ${h.src('kosit-testsuite', 'Testsuite der KoSIT')} geprüft: Alle gültigen Dateien laufen ohne Fehler durch. Die Rechnungen, die der Ersteller dieser Seite erzeugt, hat der KoSIT-Validator in der aktuellen Konfiguration angenommen.</p>
<h2>Welche Fehler wirklich Folgen haben</h2>
<p>Nicht jede Meldung ist gleich schwer. Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} unterscheidet drei Fälle. Ist die Datei so fehlerhaft, dass sie sich nicht lesen lässt, liegt gar keine E-Rechnung vor. Verletzt sie eine Geschäftsregel bei einer Pflichtangabe des ${h.src('ustg14', '§ 14 Abs. 4 UStG')}, etwa einem falschen Steuerbetrag, ist die Rechnung nicht ordnungsgemäß. Verletzt sie eine Regel ohne steuerlichen Bezug, etwa eine fehlende Käuferreferenz, bleibt sie umsatzsteuerlich in Ordnung, auch wenn ein Portal sie zurückweist.</p>
${h.mini('fehler', { p: ['art'], c: 'Folgen eines Fehlers genauer prüfen' })}
<h2>So lesen Sie eine Meldung</h2>
<p>Jede Zeile der Ergebnistabelle hat vier Spalten. Die Stufe sagt, ob es ein Fehler oder ein Hinweis ist. Die Regel nennt die Kennung, mit der Sie in der Spezifikation nachschlagen können. Das Feld nennt den Business Term, zum Beispiel BT-10 für die Käuferreferenz oder BT-115 für den Zahlbetrag. Der Befund erklärt den Verstoß in einem Satz und nennt bei Positionen die Zeilennummer. Mit diesen Angaben finden Sie die Stelle in Ihrem Rechnungsprogramm oder können dem Absender genau sagen, was zu ändern ist.</p>
<p>Geht die Rechnung an eine Behörde, schalten Sie die Frage nach dem Empfänger auf „Ja“. Dann prüft die Vorprüfung zusätzlich, ob im Feld BT-10 eine gültige Leitweg-ID steht. Die Prüfziffer allein können Sie auch im ${h.a('leitweg', 'Leitweg-ID-Prüfer')} kontrollieren.</p>
<h2>Fehler beheben</h2>
<p>Stammt die Rechnung von Ihnen, korrigieren Sie die Angabe in Ihrem Programm und erzeugen die Datei neu; eine XML von Hand zu ändern ist fehleranfällig. Ohne eigenes Programm können Sie die Rechnung im ${h.a('erstellen', 'Rechnungsersteller')} neu schreiben; dort ist der Download gesperrt, solange eine Regel verletzt ist. Stammt die Rechnung von einem Lieferanten und betrifft der Fehler eine Pflichtangabe, bitten Sie um eine berichtigte Rechnung, bevor Sie die Vorsteuer ziehen. Was jedes Pflichtfeld bedeutet, steht unter ${h.a('en-16931', 'EN 16931')}.</p>
`,
  },
  en: {
    slug: 'xrechnung-validator',
    nav: 'XRechnung validator', card: 'Pre-check an e-invoice: mandatory fields, totals, BR-DE rules, Leitweg-ID',
    title: 'XRechnung Validator 2026: Pre-Check Your E-Invoice Online',
    description: 'XRechnung validator 2026: pre-check an e-invoice in your browser against EN 16931 and BR-DE rules, totals and the Leitweg-ID. Every message explained by field.',
    h1: 'Check an XRechnung: a pre-check with plain-language messages',
    intro: 'Drop a file: the pre-check recalculates the totals and lists every broken rule with its identifier and field. The sample above contains two deliberate errors.',
    resume: `The pre-check on this page reads an XRechnung or ZUGFeRD file in your browser and tests it against the most important business rules: the mandatory fields of the European standard EN 16931 (rules BR-01 to BR-27), the calculation rules BR-CO for totals and VAT, the VAT category rules such as BR-S, BR-E and BR-AE, the German extra rules BR-DE of XRechnung ${S.xrechnung}, and the check digits of a Leitweg-ID. Each message names the rule, the field concerned (BT or BG) and a plain explanation. Only the validator of the German Coordination Office for IT Standards (KoSIT), a Java program without a web interface, runs the complete official set of XML schema and Schematron rules. We compared our test invoices against that validator in its XRechnung ${S.xrechnung} configuration, and it accepted every file we generated. In daily use: if the pre-check reports no error, the invoice is almost always fine; if it reports one, you know which field to fix.`,
    faqs: [
      { q: 'What do identifiers like BR-CO-15 or BR-DE-15 mean?', a: 'They are business rule numbers. BR on its own marks a core rule of EN 16931, such as a mandatory field. BR-CO rules are calculations; BR-CO-15, for example, requires gross to equal net plus VAT. BR-DE rules are the German additions in XRechnung; BR-DE-15 demands the buyer reference in field BT-10. The identifier helps you make sense of an error message from a portal.' },
      { q: 'Why does an invoice portal report errors the pre-check misses?', a: 'Portals run the full rule set and often rules of their own, for instance on permitted code lists or field lengths. The pre-check covers the rules that fail most often in practice, not every schema test. Note the identifier from the portal’s message; you will find the explanation in the KoSIT specification or on the page about EN 16931.' },
      { q: 'Is an invoice with a warning still valid?', a: 'A warning flags something unusual, not a breach, such as a Leitweg-ID with wrong check digits when the recipient is not a federal portal. Errors, by contrast, are rule breaches. For VAT what counts is whether the mandatory details under the VAT Act are correct. According to the Finance Ministry letter, breaking a purely technical rule with no tax relevance does not make the invoice defective.' },
      { q: 'Can the pre-check also test a ZUGFeRD PDF?', a: 'Yes. Drop the PDF and the pre-check extracts the embedded XML and tests its content with the same rules. It applies the German BR-DE rules only if the file is marked as an XRechnung or you say the invoice goes to a public body. It does not test whether the PDF itself conforms to PDF/A-3.' },
    ],
    body: (h) => `
<h2>What the pre-check covers</h2>
<p>The check runs through the invoice in fixed steps. First the mandatory details: invoice number, date, invoice type, currency, names and addresses of both parties, at least one line. Then the arithmetic: each line total must equal quantity times price, the sum of lines must match field BT-106, and the VAT per rate must match the VAT amount. Then come the VAT category rules and finally, for an XRechnung, the national rules.</p>
${h.table(['Rule group', 'Example', 'What is tested'], [
  ['BR-01 to BR-27', 'BR-02', 'Mandatory fields of the standard, here invoice number BT-1'],
  ['BR-CO', 'BR-CO-10', 'Sum of lines equals field BT-106'],
  ['BR-S, BR-E, BR-AE', 'BR-AE-02', 'Reverse charge: buyer VAT ID present'],
  ['BR-DE', 'BR-DE-15', 'Buyer reference BT-10 in an XRechnung'],
  ['PEPPOL R010/R020', 'R020', 'Electronic address of buyer and seller'],
  ['Leitweg-ID', 'Check digits', 'Modulo 97-10 over coarse and fine address'],
], 'Rule groups of the pre-check, one example each.', ['l', 'l', 'l'])}
<p>The sample that loads first is an XRechnung missing two things: the buyer reference and a consistent amount due. The table under the card shows both errors with rule and field. Pick another sample and the messages disappear.</p>
<h2>Pre-check versus the official validator</h2>
<p>The ${h.src('kosit-validator', 'KoSIT validation software')} is the reference tool. It first tests a file against the XML schema, that is structure and data types, and then against the Schematron rules of ${h.src('kosit-xrechnung', 'XRechnung')}. The output is a report recommending to accept or reject the file. It runs with Java on your own machine and is aimed at developers and invoice receipt offices.</p>
<p>Our pre-check reproduces the part of the rules that helps people without programming skills most, and explains every message in German and English. To make sure it calculates correctly we ran it over the sample files of the ${h.src('kosit-testsuite', 'KoSIT test suite')}: every valid file passes without error. The invoices produced by this site’s creator were accepted by the KoSIT validator in its current configuration.</p>
<h2>Which errors really have consequences</h2>
<p>Not every message weighs the same. The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} distinguishes three cases. If the file is so broken it cannot be read, there is no e-invoice at all. If it breaks a business rule on a mandatory detail under ${h.src('ustg14', 'section 14(4) UStG')}, such as a wrong VAT amount, the invoice is not proper. If it breaks a rule with no tax relevance, such as a missing buyer reference, it stays fine for VAT purposes even if a portal rejects it.</p>
${h.mini('fehler', { p: ['art'], c: 'Check the consequences of an error' })}
<h2>How to read a message</h2>
<p>Each row of the results table has four columns. The level says whether it is an error or a note. The rule gives the identifier you can look up in the specification. The field names the business term, for example BT-10 for the buyer reference or BT-115 for the amount due. The finding explains the breach in one sentence and, for lines, gives the line number. With these details you can find the spot in your invoicing software or tell the sender exactly what to change.</p>
<p>If the invoice goes to a public body, set the recipient question to “Yes”. The pre-check then also tests whether field BT-10 holds a valid Leitweg-ID. You can check the check digits alone with the ${h.a('leitweg', 'Leitweg-ID checker')}.</p>
<h2>Fixing errors</h2>
<p>If the invoice is yours, correct the detail in your software and generate the file again; editing XML by hand is error-prone. Without software of your own, rewrite the invoice in the ${h.a('erstellen', 'invoice creator')}, where the download stays locked while any rule is broken. If the invoice comes from a supplier and the error concerns a mandatory detail, ask for a corrected invoice before you deduct input VAT. What each mandatory field means is explained on ${h.a('en-16931', 'EN 16931')}.</p>
`,
  },
});
