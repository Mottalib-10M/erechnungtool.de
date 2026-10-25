import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* E-Rechnung per E-Mail : BMF-Schreiben 15.10.2025 (Übermittlungswege, E-Mail-Postfach genügt für den Empfang), § 14 Abs. 1 UStG,
   GoBD (E-Mail als bloßes Transportmittel), Regeln des Bundes für den E-Mail-Kanal (e-rechnung-bund.de). */
const PF = K.P.pflicht, AB = K.P.aufbewahrung;

export default defineGuide({
  id: 'per-email', group: 'praxis', order: 32,
  tool: 'versand',
  related: ['empfangen', 'bund', 'archivieren', 'zugferd', 'oeffnen'],
  sources: ['bmf-2025', 'bmf-faq', 'ustg14', 'gobd', 'erechnung-bund-mail'],
  de: {
    slug: 'e-rechnung-per-e-mail',
    nav: 'E-Rechnung per E-Mail', card: 'Versenden und empfangen per E-Mail: was in den Anhang gehört und was nicht',
    title: 'E-Rechnung per E-Mail 2026: Anhang, Empfang, Regeln',
    description: 'E-Rechnung per E-Mail 2026: welche Datei in den Anhang gehört, warum der Mailtext keine Rechnung ist, was beim Empfang genügt und was für den Bund gilt.',
    h1: 'E-Rechnung per E-Mail versenden und empfangen',
    intro: 'Empfänger und Anhang wählen: Der Check zeigt, ob Ihre E-Mail eine gültige E-Rechnung transportiert und worauf Sie beim Versand achten sollten.',
    resume: `Die E-Mail ist ein zulässiger Weg, um E-Rechnungen zu übermitteln, und für die meisten kleinen und mittleren Unternehmen der einfachste. Das Bundesfinanzministerium nennt sie in seinem Schreiben vom 15. Oktober 2025 ausdrücklich und stellt klar, dass für den Empfang ein E-Mail-Postfach genügt. Entscheidend ist, was im Anhang steckt: Die E-Rechnung ist die angehängte Datei, also eine XRechnung als XML oder eine ZUGFeRD-PDF mit eingebetteter XML nach der Norm EN 16931. Der Text der Nachricht ist nicht Teil der Rechnung, und eine angehängte PDF ohne XML bleibt eine sonstige Rechnung, die nach dem ${PF.papierBis.split('-').reverse().join('.')} nur noch in Ausnahmefällen genügt. Eine Signatur oder Verschlüsselung schreibt das Umsatzsteuergesetz nicht vor. Aufbewahren müssen Sie die angehängte Rechnungsdatei, ${AB.rechnungJahre} Jahre und unverändert; die E-Mail selbst nur, wenn sie zusätzliche steuerlich wichtige Angaben enthält. Für Rechnungen an den Bund gelten strengere Regeln: eine Rechnung pro E-Mail und nur strukturierte Dateien als Anhang.`,
    faqs: [
      { q: 'Darf ich mehrere E-Rechnungen in einer E-Mail verschicken?', a: 'Zwischen Unternehmen schreibt das Gesetz dazu nichts vor. Praktisch ist eine Rechnung pro E-Mail trotzdem besser, weil viele Empfänger ihren Rechnungseingang automatisch auslesen und Sammelnachrichten Rückfragen erzeugen. Für Rechnungen an den Bund ist es Pflicht: Dort verarbeitet die Plattform genau eine Rechnung pro E-Mail, Anlagen zu dieser Rechnung dürfen beiliegen.' },
      { q: 'Muss ich die E-Mail mit der Rechnung aufbewahren?', a: `In der Regel nur den Anhang. Nach den GoBD dient eine E-Mail, die lediglich die Rechnung transportiert, wie ein Briefumschlag. Aufzubewahren ist die Rechnungsdatei, ${AB.rechnungJahre} Jahre lang und so, dass sie nicht verändert werden kann. Enthält der Mailtext zusätzliche Angaben mit steuerlicher Bedeutung, etwa eine Vereinbarung zum Skonto, gehört auch die Nachricht ins Archiv.` },
      { q: 'Woran erkenne ich eine gefälschte Rechnungs-E-Mail?', a: 'Achten Sie auf unbekannte Absender, Anhänge in ungewöhnlichen Formaten wie ZIP oder ausführbaren Dateien, Zeitdruck im Text und vor allem auf geänderte Bankverbindungen. Eine echte E-Rechnung ist eine XML- oder PDF-Datei. Öffnen Sie sie mit einem Viewer, der nichts ausführt, und vergleichen Sie die IBAN mit früheren Rechnungen, bevor Sie zahlen; bei Abweichungen rufen Sie den Lieferanten an.' },
      { q: 'Brauche ich für den Empfang per E-Mail eine eigene Adresse?', a: 'Vorgeschrieben ist sie nicht, ein vorhandenes Postfach genügt. Sinnvoll ist eine feste Adresse wie rechnung@ oder buchhaltung@, die Sie Ihren Lieferanten mitteilen. So landen Rechnungen nicht in persönlichen Postfächern, gehen bei Urlaub oder Personalwechsel nicht verloren und lassen sich gesammelt ablegen oder an ein Buchhaltungsprogramm weiterleiten.' },
    ],
    body: (h) => `
<h2>Was eine E-Mail mit E-Rechnung enthält</h2>
<p>Eine E-Mail ist nur der Umschlag. Die eigentliche Rechnung ist die angehängte Datei, und ob es sich um eine E-Rechnung handelt, entscheidet allein deren Format. Nach ${h.src('ustg14', '§ 14 Abs. 1 UStG')} muss sie strukturiert sein und der Norm EN 16931 entsprechen. Das erfüllen eine XRechnung als XML-Datei und eine ZUGFeRD-PDF ab Profil BASIC. Eine PDF, die ein Buchhaltungsprogramm als Seite ausgibt, erfüllt es nicht, auch wenn sie per E-Mail kommt.</p>
${h.table(['Anhang', 'E-Rechnung', 'An Unternehmen', 'An den Bund'], [
  ['XRechnung (XML)', 'ja', 'erlaubt', 'erlaubt'],
  ['ZUGFeRD-PDF ab BASIC', 'ja', 'erlaubt', 'nur Profil XRECHNUNG'],
  ['PDF ohne XML', 'nein', `mit Zustimmung bis ${h.day(PF.papierBis)}, danach nur in Ausnahmen`, 'nein'],
  ['Rechnung im Mailtext', 'nein', 'keine ordnungsgemäße Rechnung', 'nein'],
], 'Was als Anhang einer Rechnungs-E-Mail taugt.', ['l', 'l', 'l', 'l'])}
<p>Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} lässt die Wahl des Übermittlungswegs offen: E-Mail, Bereitstellung zum Download in einem Portal, Austausch über Schnittstellen oder Netze wie Peppol. Kein Weg ist vorgeschrieben, solange die Rechnung im richtigen Format ankommt. Auch eine qualifizierte Signatur verlangt das Gesetz nicht; Echtheit und Unversehrtheit sichern Sie über ein innerbetriebliches Kontrollverfahren, etwa den Abgleich mit Bestellung und Lieferung.</p>
<h2>Versenden: so kommt die Rechnung an</h2>
<p>Hängen Sie genau die Datei an, die Ihr Programm oder der ${h.a('erstellen', 'Rechnungsersteller')} erzeugt hat, ohne sie umzubenennen in eine andere Endung oder in ein ZIP-Archiv zu packen. Ein Dateiname mit Rechnungsnummer hilft dem Empfänger. Der Mailtext darf freundlich sein und die Rechnung ankündigen, sollte aber keine abweichenden Beträge oder Zahlungsbedingungen nennen: Was zählt, steht in der Datei, und widersprüchliche Angaben erzeugen Rückfragen. Fragen Sie neue Kunden nach ihrer Adresse für den Rechnungseingang, statt an die Adresse des Ansprechpartners zu schreiben.</p>
<h2>Empfangen: was wirklich nötig ist</h2>
<p>Seit dem ${h.day(PF.empfangAb)} müssen Sie E-Rechnungen annehmen können. Laut ${h.src('bmf-faq', 'den Fragen und Antworten des Bundesfinanzministeriums')} genügt dafür ein E-Mail-Postfach. Damit ist es aber nicht getan: Sie brauchen einen Weg, die XML zu lesen, eine Prüfung vor der Zahlung und eine Ablage, die die Datei unverändert aufbewahrt. Wie weit Sie sind, zeigt der kleine Check:</p>
${h.mini('empfang', { p: ['postfach', 'lesen', 'pruefen', 'archiv'], c: 'Empfang vollständig einrichten' })}
<p>Eine XRechnung aus dem Postfach öffnen Sie im ${h.a('oeffnen', 'Viewer')} dieser Seite, ohne sie hochzuladen. Für viele Rechnungen lohnt es sich, das Postfach mit einem Buchhaltungsprogramm zu verbinden, das Anhänge automatisch übernimmt.</p>
<h2>Aufbewahren: der Anhang, nicht die Nachricht</h2>
<p>Die ${h.src('gobd', 'GoBD')} behandeln eine E-Mail, die nur als Transportmittel dient, wie einen Briefumschlag: Sie muss nicht aufbewahrt werden. Aufzubewahren ist die angehängte Rechnung im Originalformat, also die XML oder die ZUGFeRD-PDF, für ${h.n(AB.rechnungJahre)} Jahre. Speichern Sie die Datei so, dass spätere Änderungen ausgeschlossen oder nachvollziehbar sind. Ein Postfach, in dem Nachrichten gelöscht oder verschoben werden können, ist dafür allein kein geeignetes Archiv. Einzelheiten unter ${h.a('archivieren', 'E-Rechnungen archivieren')}.</p>
<h2>Besondere Regeln für Rechnungen an den Bund</h2>
<p>Die Rechnungseingangsplattformen des Bundes nehmen E-Mails nur nach ihren ${h.src('erechnung-bund-mail', 'Vorgaben zum E-Mail-Versand')} an: eine Rechnung pro Nachricht, als Anhang die strukturierte Rechnungsdatei und ihre Anlagen, keine reine PDF. Der Mailtext wird nicht verarbeitet. Die Leitweg-ID muss in der Rechnungsdatei stehen, nicht im Betreff. Alles Weitere zu Format und Pflichtangaben steht unter ${h.a('bund', 'E-Rechnung an den Bund')}.</p>
`,
  },
  en: {
    slug: 'send-e-invoice-by-email',
    nav: 'E-invoice by email', card: 'Sending and receiving by email: what belongs in the attachment and what does not',
    title: 'E-Invoice by Email 2026: Attachment, Receipt and Rules',
    description: 'E-invoice by email in 2026: which file goes in the attachment, why the message text is no invoice, what is enough to receive and the federal rules too.',
    h1: 'Sending and receiving e-invoices by email',
    intro: 'Choose recipient and attachment: the check shows whether your email carries a valid e-invoice and what to watch when sending.',
    resume: `Email is a permitted way to transmit e-invoices in Germany and, for most small and medium-sized businesses, the simplest. The Federal Ministry of Finance names it explicitly in its letter of 15 October 2025 and confirms that an email inbox is enough to receive. What matters is the attachment: the e-invoice is the attached file, either an XRechnung as XML or a ZUGFeRD PDF with embedded XML under the standard EN 16931. The message text is not part of the invoice, and an attached PDF without XML remains an ordinary invoice, which after 31 December 2026 will be enough only in exceptional cases. The VAT Act requires neither a signature nor encryption. You must keep the attached invoice file, for ${AB.rechnungJahre} years and unchanged; the email itself only if it holds additional tax-relevant details. Invoices to the federal government follow stricter rules: one invoice per email and only structured files as attachments.`,
    faqs: [
      { q: 'May I send several e-invoices in one email?', a: 'Between businesses the law says nothing about it. In practice one invoice per email is still better, because many recipients read their invoice inbox automatically and bundled messages cause queries. For invoices to the federal government it is mandatory: the platform processes exactly one invoice per email, and supporting documents for that invoice may be attached.' },
      { q: 'Do I have to keep the email the invoice came with?', a: `Usually only the attachment. Under the GoBD an email that merely carries the invoice is treated like an envelope. What you keep is the invoice file, for ${AB.rechnungJahre} years and in a way that rules out changes. If the message text contains extra tax-relevant details, such as an agreed early payment discount, the email belongs in the archive too.` },
      { q: 'How can I spot a fake invoice email?', a: 'Watch for unknown senders, attachments in unusual formats such as ZIP or executable files, pressure to act quickly, and above all changed bank details. A real e-invoice is an XML or PDF file. Open it with a viewer that runs nothing, and compare the IBAN with earlier invoices before paying; if it differs, phone the supplier.' },
      { q: 'Do I need a separate address to receive e-invoices by email?', a: 'It is not required; an existing inbox is enough. A fixed address such as invoices@ or accounts@ that you give to your suppliers makes sense. Invoices then do not land in personal inboxes, do not get lost during holidays or staff changes, and can be filed together or forwarded to accounting software.' },
    ],
    body: (h) => `
<h2>What an email with an e-invoice contains</h2>
<p>An email is only the envelope. The actual invoice is the attached file, and whether it is an e-invoice depends solely on its format. Under ${h.src('ustg14', 'section 14(1) UStG')} it must be structured and comply with EN 16931. An XRechnung as an XML file and a ZUGFeRD PDF from the BASIC profile up meet that. A PDF printed to a page by accounting software does not, even if it arrives by email.</p>
${h.table(['Attachment', 'E-invoice', 'To businesses', 'To the federal government'], [
  ['XRechnung (XML)', 'yes', 'allowed', 'allowed'],
  ['ZUGFeRD PDF from BASIC', 'yes', 'allowed', 'XRECHNUNG profile only'],
  ['PDF without XML', 'no', `with consent until ${h.day(PF.papierBis)}, then only in exceptions`, 'no'],
  ['Invoice in the message text', 'no', 'not a proper invoice', 'no'],
], 'What works as the attachment of an invoice email.', ['l', 'l', 'l', 'l'])}
<p>The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} leaves the choice of transmission route open: email, download from a portal, exchange through interfaces or networks such as Peppol. No route is prescribed, as long as the invoice arrives in the right format. Nor does the law require a qualified signature; you secure authenticity and integrity through an internal control procedure, such as matching the invoice against order and delivery.</p>
<h2>Sending: how the invoice gets through</h2>
<p>Attach exactly the file that your software or the ${h.a('erstellen', 'invoice creator')} produced, without changing its extension or packing it into a ZIP archive. A file name containing the invoice number helps the recipient. The message text may be friendly and announce the invoice, but should not state different amounts or payment terms: what counts is in the file, and contradictions cause queries. Ask new customers for their invoice inbox address rather than writing to your contact person.</p>
<h2>Receiving: what is really needed</h2>
<p>Since ${h.day(PF.empfangAb)} you must be able to accept e-invoices. According to ${h.src('bmf-faq', 'the Finance Ministry FAQ')} an email inbox is enough for that. That alone is not the whole job: you need a way to read the XML, a check before paying and storage that keeps the file unchanged. The small check shows how far you are:</p>
${h.mini('empfang', { p: ['postfach', 'lesen', 'pruefen', 'archiv'], c: 'Set up receiving completely' })}
<p>You open an XRechnung from your inbox in the ${h.a('oeffnen', 'viewer')} on this site without uploading it. For many invoices it pays to connect the inbox to accounting software that takes over attachments automatically.</p>
<h2>Retention: the attachment, not the message</h2>
<p>The ${h.src('gobd', 'GoBD')} treat an email that serves only as a means of transport like an envelope: it need not be kept. What you keep is the attached invoice in its original format, the XML or the ZUGFeRD PDF, for ${h.n(AB.rechnungJahre)} years. Store the file so that later changes are ruled out or traceable. An inbox where messages can be deleted or moved is not a suitable archive on its own. Details on ${h.a('archivieren', 'archiving e-invoices')}.</p>
<h2>Special rules for invoices to the federal government</h2>
<p>The federal invoice receipt platforms accept emails only under their ${h.src('erechnung-bund-mail', 'rules for sending by email')}: one invoice per message, with the structured invoice file and its supporting documents attached, never a plain PDF. The message text is not processed. The Leitweg-ID must be inside the invoice file, not in the subject line. Everything else on format and mandatory details is on ${h.a('bund', 'e-invoicing the federal government')}.</p>
`,
  },
});
