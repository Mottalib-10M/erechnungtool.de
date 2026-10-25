import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formatMoney } from '../../lib/format';

/* Folgen : § 26a Abs. 2 Nr. 1 und 2, Abs. 3 UStG (Bußgeld bis 5.000 €, kein eigener Tatbestand « fehlende E-Rechnung ») ; Vorsteuer : § 15 UStG mit Abschnitt 15.2a Abs. 1a Satz 12 und 13 UStAE in der Fassung des BMF-Schreibens vom 15.10.2025 ; Fehlerarten Rn. 6a, 6b, 35a. */
const B = K.P.bussgeld;

export default defineGuide({
  id: 'folgen', group: 'pflicht', order: 13,
  tool: 'folgen',
  related: ['bmf', 'pflicht', 'fristen', 'validator', 'erstellen', 'archivieren'],
  sources: ['ustg26a', 'ustg14', 'ustg14b', 'bmf-2025', 'kosit-validator'],
  de: {
    slug: 'e-rechnung-folgen',
    nav: 'Folgen und Bußgeld', card: 'Was droht, wenn die E-Rechnung fehlt oder fehlerhaft ist',
    title: 'E-Rechnung Strafe 2026: Bußgeld, Vorsteuer und Berichtigung',
    description: 'E-Rechnung Strafe und Folgen 2026: Bußgeld nach § 26a UStG, Risiko für den Vorsteuerabzug, Formatfehler gegen Regelfehler und Berichtigung. Ihren Fall prüfen.',
    h1: 'Folgen einer fehlenden oder fehlerhaften E-Rechnung',
    intro: 'Pflicht, ausgestellte Rechnung und Inhalt wählen: Der Rechner schätzt das Risiko für den Vorsteuerabzug Ihres Kunden und sagt, ob Sie berichtigen sollten.',
    resume: `Eine eigene Strafe für die fehlende E-Rechnung kennt das Umsatzsteuergesetz nicht. Der Bußgeldtatbestand in § 26a UStG betrifft den Fall, dass eine Rechnung gar nicht oder nicht rechtzeitig ausgestellt oder nicht aufbewahrt wird; die Geldbuße kann dann bis zu ${formatMoney(B.rechnungHoechst, 0, 'de')} betragen. Die eigentliche Folge einer falschen Form trifft meist den Kunden: Wer statt der vorgeschriebenen E-Rechnung eine PDF oder Papierrechnung bekommt, hat dem Grunde nach keine ordnungsgemäße Rechnung für den Vorsteuerabzug. Das BMF-Schreiben vom 15. Oktober 2025 mildert das ab, wenn der Inhalt stimmt, doch der Kunde wird eine korrekte E-Rechnung verlangen. Bei fehlerhaften E-Rechnungen unterscheidet das Ministerium drei Fälle. Formatfehler machen die Datei zur sonstigen Rechnung. Verstöße gegen Geschäftsregeln, die eine Pflichtangabe nach § 14 Abs. 4 UStG betreffen, machen die Rechnung fehlerhaft. Verstöße ohne Bezug zu den Pflichtangaben, etwa eine fehlende Käuferreferenz, sind umsatzsteuerlich unbeachtlich. Berichtigt wird mit einer neuen E-Rechnung, die auf die alte verweist.`,
    faqs: [
      { q: 'Gibt es ein Bußgeld speziell für eine fehlende E-Rechnung?', a: `Nein, einen eigenen Tatbestand dafür enthält das Umsatzsteuergesetz nicht. § 26a UStG ahndet, wenn eine Rechnung überhaupt nicht oder nicht rechtzeitig ausgestellt oder nicht aufbewahrt wird, mit bis zu ${formatMoney(B.rechnungHoechst, 0, 'de')}. Eine PDF statt der vorgeschriebenen E-Rechnung ist zwar keine ordnungsgemäße Rechnung, ob das Finanzamt sie wie eine fehlende Rechnung behandelt, ist offen. Das größere Risiko liegt beim Vorsteuerabzug des Kunden.` },
      { q: 'Verliert mein Kunde die Vorsteuer, wenn ich eine PDF statt E-Rechnung schicke?', a: 'Dem Grunde nach fehlt ihm eine ordnungsgemäße Rechnung. Abschnitt 15.2a des Umsatzsteuer-Anwendungserlasses in der Fassung des BMF-Schreibens vom 15. Oktober 2025 lässt den Abzug aber regelmäßig zu, wenn die sonstige Rechnung inhaltlich richtig ist. Darauf sollten sich beide Seiten nicht verlassen. Schicken Sie die E-Rechnung nach, sobald der Kunde sie verlangt; das beseitigt jeden Zweifel.' },
      { q: 'Ist eine E-Rechnung mit Validierungsfehlern ungültig?', a: 'Das hängt vom Fehler ab. Kann die Datei wegen eines Formatfehlers nicht gelesen werden, ist sie keine E-Rechnung. Verletzt sie eine Geschäftsregel bei einer Pflichtangabe, etwa einem falschen Steuerbetrag, ist sie nicht ordnungsgemäß. Betrifft der Regelverstoß dagegen nur ein technisches Feld wie die Käuferreferenz, bleibt die Rechnung umsatzsteuerlich in Ordnung, so das BMF in Randnummer 35a.' },
      { q: 'Wie berichtige ich eine fehlerhafte E-Rechnung?', a: 'Sie stellen ein neues Dokument aus, das sich eindeutig auf die ursprüngliche Rechnung bezieht, und schicken es ebenfalls als E-Rechnung. Die Nummer der alten Rechnung gehört in das Feld für die vorausgegangene Rechnung. Eine bloße Korrektur der XML-Datei mit derselben Nummer reicht nicht, denn das Original muss beim Empfänger unverändert aufbewahrt bleiben.' },
    ],
    body: (h) => `
<h2>Bußgeld: was das Gesetz tatsächlich sagt</h2>
<p>Viele Darstellungen sprechen von einer „Strafe“ für fehlende E-Rechnungen. Im Gesetz steht etwas Engeres. ${h.src('ustg26a', '§ 26a Abs. 2 UStG')} nennt als Ordnungswidrigkeit unter anderem, eine Rechnung entgegen § 14 Abs. 2 nicht oder nicht rechtzeitig auszustellen und eine Rechnung entgegen ${h.src('ustg14b', '§ 14b UStG')} nicht oder nicht lange genug aufzubewahren. Nach Absatz 3 kann das mit einer Geldbuße bis zu ${h.eur(B.rechnungHoechst)} geahndet werden. Ein Tatbestand „Rechnung im falschen Format“ ist nicht darunter.</p>
<p>Wer also überhaupt keine Rechnung schreibt oder seine Eingangsrechnungen nicht aufbewahrt, riskiert dieses Bußgeld. Ob eine PDF, die eigentlich eine E-Rechnung hätte sein müssen, als „nicht ausgestellte“ Rechnung zählt, hat bisher weder Gesetz noch Verwaltung ausdrücklich gesagt. Seriös lässt sich nur sagen: Es ist ein vermeidbares Risiko.</p>
<h2>Vorsteuer: das Risiko liegt beim Kunden</h2>
<p>Für den Empfänger ist die Rechnung die Grundlage des Vorsteuerabzugs. Fehlt eine ordnungsgemäße Rechnung, darf er die Vorsteuer dem Grunde nach nicht abziehen. Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} hat dazu den Umsatzsteuer-Anwendungserlass ergänzt. Nach Abschnitt 15.2a Absatz 1a Satz 12 und 13 bleibt der Abzug bei einer sonstigen Rechnung statt der vorgeschriebenen E-Rechnung in der Regel möglich, wenn die übrigen Voraussetzungen und der Inhalt stimmen. Das ist eine Billigkeitsregel der Verwaltung, kein Freibrief: Ihr Kunde wird trotzdem eine korrekte E-Rechnung verlangen, und Sie schulden sie ihm.</p>
${h.table(['Ausgestellt wurde', 'Gilt als E-Rechnung', 'Folge für den Kunden'], [
  ['Korrekte E-Rechnung', 'Ja', 'Kein Risiko aus der Form'],
  ['E-Rechnung, Regelfehler ohne Steuerbezug', 'Ja', 'Unbeachtlich, Rn. 35a'],
  ['E-Rechnung, Fehler bei einer Pflichtangabe', 'Ja', 'Nicht ordnungsgemäß, berichtigen'],
  ['XML mit Formatfehler', 'Nein', 'Sonstige Rechnung, Rn. 6a'],
  ['PDF oder Papier trotz Pflicht', 'Nein', 'Abzug regelmäßig möglich, E-Rechnung nachreichen'],
], 'Folgen nach Art der ausgestellten Rechnung, BMF-Schreiben vom 15. Oktober 2025.', ['l', 'l', 'l'])}
<h2>Formatfehler, Regelfehler, Inhaltsfehler</h2>
<p>Die Unterscheidung des Ministeriums folgt der technischen Prüfung. Ein <strong>Formatfehler</strong> liegt vor, wenn die Datei nicht dem Schema entspricht und deshalb nicht verarbeitet werden kann; sie ist dann nur eine Rechnung in einem anderen elektronischen Format (Rn. 6a). Ein <strong>Geschäftsregelfehler</strong> liegt vor, wenn die Datei zwar lesbar ist, aber gegen eine Regel der Norm oder der XRechnung verstößt (Rn. 6b). Ob dieser Fehler schadet, hängt davon ab, ob er eine Pflichtangabe nach ${h.src('ustg14', '§ 14 Abs. 4 UStG')} betrifft, etwa den Steuerbetrag oder die Anschrift.</p>
<p>Ein <strong>Inhaltsfehler</strong> schließlich kann auch in einer formal fehlerfreien Datei stecken, etwa ein falscher Steuersatz. Die Validierung findet ihn nicht, und sie ersetzt nach Randnummer 35a auch nicht die inhaltliche Prüfung. Welche Fehlerart Ihre Prüfmeldung beschreibt, ordnet der kleine Rechner ein:</p>
${h.mini('fehler', { p: ['art'], c: 'Fehlerart ausführlich einordnen' })}
<h2>Berichtigen statt löschen</h2>
<p>Eine fehlerhafte Rechnung wird nicht überschrieben, sondern berichtigt. Dazu stellen Sie ein neues Dokument aus, das eindeutig auf die ursprüngliche Rechnung verweist, und schicken es als E-Rechnung. Der Empfänger bewahrt beide Dateien auf, denn die erste darf nach den Aufbewahrungsregeln nicht verändert werden. In der Praxis ist es oft einfacher, die alte Rechnung mit einer Gutschrift vollständig zu stornieren und eine neue mit neuer Nummer zu schreiben.</p>
<p>Prüfen Sie Ihre Dateien vor dem Versand: Der ${h.a('validator', 'XRechnung-Validator')} zeigt jede verletzte Regel mit Feld und Kennung, ohne die Datei hochzuladen. Für die vollständige Prüfung gibt es den ${h.src('kosit-validator', 'Validator der KoSIT')}, den auch viele Rechnungsportale verwenden. Wie die Randnummern im Einzelnen lauten, steht unter ${h.a('bmf', 'BMF-Schreiben zur E-Rechnung')}.</p>
`,
  },
  en: {
    slug: 'e-invoice-penalties',
    nav: 'Consequences and fines', card: 'What happens when the e-invoice is missing or faulty',
    title: 'E-Invoice Penalties Germany 2026: Fines, Input VAT, Fixes',
    description: 'German e-invoicing penalties in 2026: fines under section 26a UStG, the risk to input VAT, format errors versus rule errors, and how to correct an invoice.',
    h1: 'Consequences of a missing or faulty e-invoice',
    intro: 'Choose whether an e-invoice was required, what you issued and whether the content is right: the calculator rates the risk to your customer’s input VAT and says whether to correct.',
    resume: `The German VAT Act contains no penalty specifically for a missing e-invoice. The fine in section 26a UStG covers failing to issue an invoice at all or on time, or failing to keep one; the fine can then reach ${formatMoney(B.rechnungHoechst, 0, 'en')}. The real consequence of a wrong form usually falls on the customer: anyone who receives a PDF or paper invoice instead of the required e-invoice lacks, in principle, a proper invoice for deducting input VAT. The Finance Ministry letter of 15 October 2025 softens this where the content is correct, but the customer will still ask for a proper e-invoice. For faulty e-invoices the ministry distinguishes three cases. Format errors turn the file into an ordinary invoice. Business-rule breaches that concern a mandatory detail under section 14(4) UStG make the invoice defective. Breaches unrelated to the mandatory details, such as a missing buyer reference, do not matter for VAT. Corrections are made with a new e-invoice that refers to the old one.`,
    faqs: [
      { q: 'Is there a specific fine for not sending an e-invoice?', a: `No, the VAT Act has no separate offence for that. Section 26a UStG penalises failing to issue an invoice at all or on time, or failing to keep it, with up to ${formatMoney(B.rechnungHoechst, 0, 'en')}. A PDF instead of a required e-invoice is not a proper invoice, but whether the tax office would treat it like a missing one is unsettled. The bigger risk lies with the customer’s input VAT.` },
      { q: 'Does my customer lose input VAT if I send a PDF instead?', a: 'In principle the customer lacks a proper invoice. However, section 15.2a of the VAT application decree, as amended by the Finance Ministry letter of 15 October 2025, generally still allows the deduction if the ordinary invoice is correct in content. Neither side should rely on that. Send the e-invoice as soon as the customer asks for it; that removes any doubt.' },
      { q: 'Is an e-invoice with validation errors invalid?', a: 'It depends on the error. If a format error means the file cannot be read, it is not an e-invoice. If it breaks a business rule on a mandatory detail, such as a wrong VAT amount, it is not a proper invoice. If the breach only concerns a technical field like the buyer reference, the invoice remains fine for VAT, according to paragraph 35a of the ministry letter.' },
      { q: 'How do I correct a faulty e-invoice?', a: 'You issue a new document that refers clearly to the original invoice, and you send it as an e-invoice too. The old invoice number belongs in the preceding invoice field. Simply editing the XML file and keeping the same number is not enough, because the recipient must keep the original unchanged.' },
    ],
    body: (h) => `
<h2>Fines: what the law actually says</h2>
<p>Many write-ups speak of a “penalty” for missing e-invoices. The law says something narrower. ${h.src('ustg26a', 'Section 26a(2) UStG')} lists as administrative offences, among others, failing to issue an invoice under section 14(2) at all or on time, and failing to keep an invoice for as long as ${h.src('ustg14b', 'section 14b UStG')} requires. Under subsection 3 this can be fined up to ${h.eur(B.rechnungHoechst)}. An offence of “invoice in the wrong format” is not among them.</p>
<p>So anyone who writes no invoice at all or does not keep incoming invoices risks this fine. Whether a PDF that should have been an e-invoice counts as an invoice “not issued” has not been stated expressly, either by the law or by the administration. All that can be said responsibly is: it is an avoidable risk.</p>
<h2>Input VAT: the risk lies with the customer</h2>
<p>For the recipient, the invoice is the basis of the input VAT deduction. Without a proper invoice the deduction is, in principle, not allowed. The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} added to the VAT application decree on this point. Under section 15.2a(1a) sentences 12 and 13, the deduction generally remains possible with an ordinary invoice instead of the required e-invoice, as long as the other conditions and the content are right. That is an administrative concession, not a blank cheque: your customer will still ask for a correct e-invoice, and you owe it.</p>
${h.table(['What was issued', 'Counts as e-invoice', 'Effect for the customer'], [
  ['Correct e-invoice', 'Yes', 'No risk from the form'],
  ['E-invoice, rule error without VAT relevance', 'Yes', 'Irrelevant, para. 35a'],
  ['E-invoice, error in a mandatory detail', 'Yes', 'Not proper, correct it'],
  ['XML with a format error', 'No', 'Ordinary invoice, para. 6a'],
  ['PDF or paper despite the mandate', 'No', 'Deduction generally possible, send the e-invoice'],
], 'Effects by type of invoice issued, Finance Ministry letter of 15 October 2025.', ['l', 'l', 'l'])}
<h2>Format errors, rule errors, content errors</h2>
<p>The ministry’s distinction follows the technical check. A <strong>format error</strong> exists if the file does not match the schema and therefore cannot be processed; it is then merely an invoice in another electronic format (para. 6a). A <strong>business-rule error</strong> exists if the file is readable but breaks a rule of the standard or of XRechnung (para. 6b). Whether that error matters depends on whether it concerns a mandatory detail under ${h.src('ustg14', 'section 14(4) UStG')}, such as the VAT amount or the address.</p>
<p>Finally, a <strong>content error</strong> can hide in a formally flawless file, for instance a wrong VAT rate. Validation does not find it, and under paragraph 35a it does not replace checking the content either. The small calculator places the error your check reports into one of these classes:</p>
${h.mini('fehler', { p: ['art'], c: 'Classify the error in detail' })}
<h2>Correct, do not overwrite</h2>
<p>A faulty invoice is not overwritten but corrected. You issue a new document that clearly refers to the original invoice and send it as an e-invoice. The recipient keeps both files, because the first one must not be altered under the retention rules. In practice it is often simpler to cancel the old invoice with a credit note and write a new one with a new number.</p>
<p>Check your files before sending: the ${h.a('validator', 'XRechnung validator')} shows each broken rule with its field and identifier, without uploading the file. For the complete check there is the ${h.src('kosit-validator', 'KoSIT validator')}, which many invoice portals also use. The paragraphs themselves are set out on ${h.a('bmf', 'the Finance Ministry letter on e-invoicing')}.</p>
`,
  },
});
