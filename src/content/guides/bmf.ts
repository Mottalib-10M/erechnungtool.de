import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* BMF-Schreiben vom 15.10.2024 und 15.10.2025 (GZ in params.bmf.gz2025), gelesen im PDF : Rn. 6a (Formatfehler), 6b (Geschäftsregelfehler), 17 (Gutschrift), 22 (Ausnahmen, Zustimmung auch stillschweigend), 35a (Validierung ersetzt keine inhaltliche Prüfung) ; Abschnitt 15.2a Abs. 1a Satz 12 und 13 UStAE. Profile MINIMUM und BASIC WL : BMF-FAQ. */
const M = K.P.bmf, S = K.P.standards;

export default defineGuide({
  id: 'bmf', group: 'pflicht', order: 14,
  tool: 'fehler',
  related: ['folgen', 'pflicht', 'validator', 'zugferd', 'was-ist', 'edi'],
  sources: ['bmf-2025', 'bmf-faq', 'ustg14', 'ustg27', 'gobd'],
  de: {
    slug: 'bmf-schreiben-e-rechnung',
    nav: 'BMF-Schreiben', card: 'Die Randnummern, die in der Praxis zählen, verständlich erklärt',
    title: 'BMF-Schreiben E-Rechnung 2026: die wichtigsten Randnummern',
    description: 'BMF-Schreiben zur E-Rechnung 2026: was die Schreiben vom Oktober 2024 und 2025 zu Formatfehlern, Regelfehlern, Zustimmung und Profilen sagen. Fehlerart prüfen.',
    h1: 'BMF-Schreiben zur E-Rechnung: was die Verwaltung festgelegt hat',
    intro: 'Wählen Sie, was die Prüfung meldet: Das Werkzeug sagt, wie das BMF-Schreiben den Fehler einordnet, welche Randnummer gilt und ob Sie berichtigen müssen.',
    resume: `Das Bundesministerium der Finanzen hat die Pflicht zur E-Rechnung in zwei Schreiben ausgelegt, vom ${displayDate(M.schreiben2024, 'de-DE')} und vom ${displayDate(M.schreiben2025, 'de-DE')} mit dem Geschäftszeichen ${M.gz2025}. Das zweite Schreiben fasst die Auslegung neu und ergänzt den Umsatzsteuer-Anwendungserlass. Für die Praxis zählen vor allem vier Punkte. Erstens die Einordnung von Fehlern: Eine Datei mit Formatfehlern ist keine E-Rechnung, sondern eine sonstige Rechnung (Randnummer 6a); Verstöße gegen Geschäftsregeln schaden nur, wenn sie eine Pflichtangabe betreffen (Randnummern 6b und 35a). Zweitens der Empfang: Ein E-Mail-Postfach genügt, ablehnen darf man eine E-Rechnung nicht. Drittens die Zustimmung zu sonstigen Rechnungen, die auch stillschweigend erteilt werden kann (Randnummer 22). Viertens die Formate: XRechnung und ZUGFeRD ab Version ${S.zugferdMindest} sind E-Rechnungen, nicht aber die ZUGFeRD-Profile MINIMUM und BASIC WL. Die Schreiben binden die Finanzverwaltung, nicht die Gerichte, und sind deshalb eine Auslegung, kein Gesetz.`,
    faqs: [
      { q: 'Welches BMF-Schreiben zur E-Rechnung gilt aktuell?', a: `Maßgeblich ist das Schreiben vom ${displayDate(M.schreiben2025, 'de-DE')} mit dem Geschäftszeichen ${M.gz2025}. Es baut auf dem ersten Schreiben vom Oktober 2024 auf, fasst die Auslegung neu und übernimmt sie in den Umsatzsteuer-Anwendungserlass. Wer noch mit Zitaten aus dem Schreiben von 2024 arbeitet, sollte die Randnummern im neuen Text nachschlagen, denn einige Aussagen sind präzisiert worden.` },
      { q: 'Was ist der Unterschied zwischen Formatfehler und Geschäftsregelfehler?', a: 'Ein Formatfehler liegt vor, wenn die Datei nicht dem Schema des Formats entspricht und nicht verarbeitet werden kann; nach Randnummer 6a ist sie dann keine E-Rechnung. Ein Geschäftsregelfehler liegt vor, wenn die Datei lesbar ist, aber gegen eine Regel des Formats verstößt, etwa eine fehlende Käuferreferenz. Ob er schadet, hängt davon ab, ob eine Pflichtangabe betroffen ist.' },
      { q: 'Gilt die E-Rechnungspflicht auch für Gutschriften?', a: 'Ja. Das BMF-Schreiben stellt in Randnummer 17 klar, dass die Regeln zur verpflichtenden E-Rechnung genauso gelten, wenn ein Leistungsempfänger im Gutschriftverfahren abrechnet (§ 14 Abs. 2 Satz 5 UStG). Wer also als Kunde für seinen Lieferanten abrechnet, etwa bei Provisionen, muss diese Gutschrift ab den bekannten Stichtagen ebenfalls als E-Rechnung ausstellen.' },
      { q: 'Muss ich jede E-Rechnung vor der Zahlung validieren?', a: 'Eine ausdrückliche Pflicht zur technischen Validierung enthält das Schreiben nicht. Randnummer 35a sagt, dass eine Validierung die Prüfung der Rechnung auf Richtigkeit nicht ersetzt, sondern unterstützt. Wer den Vorsteuerabzug sichern will, prüft also Inhalt und Beträge wie bei jeder Rechnung. Eine Vorprüfung hilft dabei, weil sie Rechenfehler und fehlende Felder sofort zeigt.' },
    ],
    body: (h) => `
<h2>Zwei Schreiben, eine Linie</h2>
<p>Das Gesetz regelt die E-Rechnung in wenigen Sätzen von ${h.src('ustg14', '§ 14 UStG')} und der Übergangsregel in ${h.src('ustg27', '§ 27 Abs. 38 UStG')}. Was diese Sätze im Alltag bedeuten, hat das Bundesministerium der Finanzen in Schreiben an die obersten Finanzbehörden der Länder festgelegt. Das erste stammt vom ${h.day(M.schreiben2024)}, das zweite vom ${h.day(M.schreiben2025)} (Geschäftszeichen ${M.gz2025}). Das ${h.src('bmf-2025', 'Schreiben von 2025')} ist das aktuelle; es übernimmt die Auslegung in den Umsatzsteuer-Anwendungserlass, den die Finanzämter anwenden.</p>
<p>Solche Schreiben binden die Verwaltung. Für Unternehmen sind sie trotzdem die wichtigste Orientierung, weil die Betriebsprüfung nach ihnen vorgeht. Gerichte können anders entscheiden; Urteile zur E-Rechnungspflicht gibt es bisher kaum, denn die Pflicht zum Ausstellen beginnt erst 2027.</p>
<h2>Die Randnummern, die Sie kennen sollten</h2>
${h.table(['Randnummer', 'Thema', 'Kernaussage'], [
  ['6a', 'Formatfehler', 'Datei nicht nach Schema verarbeitbar: keine E-Rechnung, sondern sonstige Rechnung'],
  ['6b', 'Geschäftsregelfehler', 'Datei lesbar, aber Regelverstoß; Folgen je nach betroffener Angabe'],
  ['17', 'Gutschrift', 'Pflicht gilt auch im Gutschriftverfahren'],
  ['22', 'Ausnahmen und Zustimmung', 'Kleinbeträge, Kleinunternehmer, Fahrausweise dürfen sonstige Rechnung sein; Zustimmung auch stillschweigend'],
  ['35a', 'Validierung', 'Ersetzt nicht die inhaltliche Prüfung; Regelfehler ohne Bezug zu Pflichtangaben unbeachtlich'],
], `BMF-Schreiben vom ${h.day(M.schreiben2025)}, Auswahl.`, ['l', 'l', 'l'])}
<p>Die Randnummern 6a, 6b und 35a gehören zusammen. Sie übersetzen die Meldungen einer technischen Prüfung in umsatzsteuerliche Folgen. Ein Prüfprogramm wie der Validator der KoSIT unterscheidet zwischen Schemafehlern, die das Lesen verhindern, und Schematron-Regeln, die einzelne Inhalte prüfen. Genau diese Grenze zieht auch das Ministerium.</p>
<h2>Was die Fehlerarten für den Vorsteuerabzug bedeuten</h2>
<p>Eine Datei mit Formatfehler ist nach Randnummer 6a lediglich eine Rechnung in einem anderen elektronischen Format. Wo die E-Rechnung vorgeschrieben ist, fehlt dann die richtige Form. Für diesen Fall hat das Schreiben den Abschnitt 15.2a des Anwendungserlasses um die Sätze 12 und 13 in Absatz 1a ergänzt: Der Vorsteuerabzug aus einer solchen sonstigen Rechnung bleibt in der Regel erhalten, wenn ihr Inhalt stimmt. Verlangen darf der Kunde die richtige E-Rechnung trotzdem.</p>
<p>Ein Geschäftsregelfehler ist feiner zu betrachten. Betrifft er eine Pflichtangabe nach § 14 Abs. 4 UStG, etwa einen Steuerbetrag, der nicht zum Satz passt, ist die Rechnung nicht ordnungsgemäß und zu berichtigen. Betrifft er eine Angabe, die nur das Format verlangt, etwa die Käuferreferenz BT-10 einer XRechnung, ist er nach Randnummer 35a umsatzsteuerlich unbeachtlich. Ihre Prüfmeldung ordnet das Werkzeug oben ein; ob eine Datei überhaupt als E-Rechnung zählt, zeigt dieser Rechner:</p>
${h.mini('istes', { p: ['datei'], c: 'Alle Formate einordnen' })}
<h2>Empfang, Formate und EDI</h2>
<p>Zum Empfang stellt das Ministerium klar, dass ein E-Mail-Postfach genügt und dass ein Unternehmer eine E-Rechnung nicht zurückweisen darf; die ${h.src('bmf-faq', 'FAQ des Ministeriums')} wiederholen das. Als E-Rechnung gelten XRechnung und ZUGFeRD ab Version ${S.zugferdMindest}, ausgenommen die Profile MINIMUM und BASIC WL, die keine vollständige Rechnung enthalten. Mehr dazu unter ${h.a('zugferd', 'ZUGFeRD')} und ${h.a('was-ist', 'Was ist eine E-Rechnung?')}.</p>
<p>Daneben bleiben strukturierte Formate zulässig, die von der Norm EN 16931 abweichen, etwa EDI-Verfahren nach Artikel 2 der Empfehlung 94/820/EG der Kommission, wenn sich die Angaben richtig und vollständig in ein normgerechtes Format übertragen lassen. Die Übergangsregel für bestehende EDI-Verfahren läuft Ende 2027 aus; Einzelheiten unter ${h.a('edi', 'EDI-Rechnung')}.</p>
<h2>Aufbewahrung nach den GoBD</h2>
<p>Für die Aufbewahrung verweist das Umsatzsteuerrecht auf die Grundsätze ordnungsmäßiger Buchführung in elektronischer Form. Deren ${h.src('gobd', 'Änderung vom 14. Juli 2025')} stellt klar, dass bei einer E-Rechnung die strukturierte Datei aufzubewahren ist; den Bildteil einer ZUGFeRD-Rechnung nur, wenn er steuerlich wichtige Zusätze enthält. Die Frist beträgt ${h.n(K.P.aufbewahrung.rechnungJahre)} Jahre. Was das praktisch heißt, erklärt ${h.a('archivieren', 'E-Rechnungen archivieren')}; die Folgen fehlerhafter Rechnungen ${h.a('folgen', 'Folgen und Bußgeld')}.</p>
`,
  },
  en: {
    slug: 'bmf-letter-e-invoicing',
    nav: 'Finance Ministry letter', card: 'The paragraphs that matter in practice, explained plainly',
    title: 'BMF Letter E-Invoicing 2026: The Key Paragraphs Explained',
    description: 'The German Finance Ministry letters on e-invoicing in 2026: what the October 2024 and 2025 letters say on format errors, rule errors, consent and profiles.',
    h1: 'Finance Ministry letters on e-invoicing: what the administration decided',
    intro: 'Choose what the check reports: the tool shows how the ministry letter classifies the error, which paragraph applies and whether you need to correct the invoice.',
    resume: `The German Federal Ministry of Finance (BMF) has interpreted the e-invoicing mandate in two letters, dated ${displayDate(M.schreiben2024, 'en-GB')} and ${displayDate(M.schreiben2025, 'en-GB')}, the latter with reference ${M.gz2025}. The second letter restates the interpretation and adds it to the VAT application decree. Four points matter most in practice. First, how errors are classified: a file with format errors is not an e-invoice but an ordinary invoice (paragraph 6a), and breaches of business rules only matter if they concern a mandatory detail (paragraphs 6b and 35a). Second, receiving: an email inbox is enough, and an e-invoice may not be refused. Third, consent to ordinary invoices, which may also be given tacitly (paragraph 22). Fourth, formats: XRechnung and ZUGFeRD from version ${S.zugferdMindest} are e-invoices, but the ZUGFeRD profiles MINIMUM and BASIC WL are not. The letters bind the tax administration, not the courts, so they are an interpretation rather than law.`,
    faqs: [
      { q: 'Which Finance Ministry letter on e-invoicing applies now?', a: `The letter of ${displayDate(M.schreiben2025, 'en-GB')} with reference ${M.gz2025} is the one to use. It builds on the first letter of October 2024, restates the interpretation and transfers it into the VAT application decree. If you still work with quotes from the 2024 letter, look the paragraphs up in the new text, because some statements have been refined.` },
      { q: 'What is the difference between a format error and a business-rule error?', a: 'A format error exists when the file does not match the format’s schema and cannot be processed; under paragraph 6a it is then not an e-invoice. A business-rule error exists when the file is readable but breaks one of the format’s rules, for example a missing buyer reference. Whether it matters depends on whether a mandatory detail is affected.' },
      { q: 'Does the e-invoicing mandate apply to self-billing credit notes?', a: 'Yes. Paragraph 17 of the ministry letter makes clear that the mandatory e-invoicing rules apply equally when the customer issues the invoice by self-billing (section 14(2) sentence 5 UStG). A customer who bills on behalf of a supplier, for example for commissions, must therefore issue that self-billed invoice as an e-invoice from the known cut-off dates as well.' },
      { q: 'Must I validate every e-invoice before paying it?', a: 'The letter contains no express duty to run a technical validation. Paragraph 35a says that validation does not replace checking the invoice for correctness but supports it. If you want to secure your input VAT deduction, check content and amounts as with any invoice. A pre-check helps, because it shows arithmetic errors and missing fields at once.' },
    ],
    body: (h) => `
<h2>Two letters, one line</h2>
<p>The law covers e-invoicing in a few sentences of ${h.src('ustg14', 'section 14 UStG')} and the transitional rule in ${h.src('ustg27', 'section 27(38) UStG')}. What those sentences mean day to day was set out by the Federal Ministry of Finance in letters to the state tax authorities. The first is dated ${h.day(M.schreiben2024)}, the second ${h.day(M.schreiben2025)} (reference ${M.gz2025}). The ${h.src('bmf-2025', '2025 letter')} is the current one; it transfers the interpretation into the VAT application decree that tax offices apply.</p>
<p>Such letters bind the administration. For businesses they are still the main point of reference, because tax audits follow them. Courts may decide otherwise; there is hardly any case law on the mandate yet, since the duty to issue only begins in 2027.</p>
<h2>The paragraphs you should know</h2>
${h.table(['Paragraph', 'Topic', 'Key statement'], [
  ['6a', 'Format errors', 'File cannot be processed against the schema: not an e-invoice but an ordinary invoice'],
  ['6b', 'Business-rule errors', 'File readable, but a rule is broken; effect depends on the detail concerned'],
  ['17', 'Self-billing', 'The mandate applies to self-billed invoices too'],
  ['22', 'Exceptions and consent', 'Small amounts, small businesses, travel tickets may be ordinary invoices; consent may be tacit'],
  ['35a', 'Validation', 'Does not replace checking content; rule errors unrelated to mandatory details are irrelevant'],
], `Finance Ministry letter of ${h.day(M.schreiben2025)}, selection.`, ['l', 'l', 'l'])}
<p>Paragraphs 6a, 6b and 35a belong together. They translate the messages of a technical check into VAT consequences. A checking program such as the KoSIT validator separates schema errors, which prevent reading, from Schematron rules, which test individual content. The ministry draws exactly the same line.</p>
<h2>What the error classes mean for input VAT</h2>
<p>Under paragraph 6a a file with a format error is merely an invoice in another electronic format. Where the e-invoice is mandatory, the correct form is then missing. For this case the letter added sentences 12 and 13 to section 15.2a(1a) of the application decree: input VAT from such an ordinary invoice generally remains deductible if its content is right. The customer may still demand the correct e-invoice.</p>
<p>A business-rule error needs a closer look. If it concerns a mandatory detail under section 14(4) UStG, such as a VAT amount that does not match the rate, the invoice is not proper and must be corrected. If it concerns a detail required only by the format, such as the buyer reference BT-10 of an XRechnung, it is irrelevant for VAT under paragraph 35a. The tool above classifies your check message; whether a file counts as an e-invoice at all is shown by this calculator:</p>
${h.mini('istes', { p: ['datei'], c: 'Classify every format' })}
<h2>Receiving, formats and EDI</h2>
<p>On receiving, the ministry confirms that an email inbox is enough and that a business may not reject an e-invoice; the ${h.src('bmf-faq', 'ministry’s FAQ')} repeats this. XRechnung and ZUGFeRD from version ${S.zugferdMindest} count as e-invoices, except the MINIMUM and BASIC WL profiles, which do not hold a complete invoice. More on ${h.a('zugferd', 'ZUGFeRD')} and ${h.a('was-ist', 'what is an e-invoice?')}.</p>
<p>Structured formats that depart from EN 16931 also remain allowed, such as EDI procedures under Article 2 of Commission Recommendation 94/820/EC, provided the data can be converted correctly and completely into a compliant format. The transitional rule for existing EDI set-ups ends in late 2027; details on ${h.a('edi', 'EDI invoicing')}.</p>
<h2>Retention under the GoBD</h2>
<p>For retention, VAT law relies on the German principles for electronic bookkeeping (GoBD). Their ${h.src('gobd', 'amendment of 14 July 2025')} makes clear that for an e-invoice the structured file must be kept, and the visual part of a ZUGFeRD invoice only if it carries tax-relevant additions. The period is ${h.n(K.P.aufbewahrung.rechnungJahre)} years. What that means in practice is explained on ${h.a('archivieren', 'archiving e-invoices')}, and the consequences of faulty invoices on ${h.a('folgen', 'consequences and fines')}.</p>
`,
  },
});
