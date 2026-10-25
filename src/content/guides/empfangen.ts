import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* E-Rechnungen empfangen : § 14 Abs. 1 UStG (Empfangspflicht ohne Übergang), BMF-Schreiben vom 15.10.2025 (E-Mail-Postfach genügt), BMF-FAQ, ELSTER-Viewer, § 14b UStG. */
const PF = K.P.pflicht, AB = K.P.aufbewahrung;

export default defineGuide({
  id: 'empfangen', group: 'praxis', order: 30,
  tool: 'empfang',
  related: ['oeffnen', 'validator', 'archivieren', 'pflicht', 'per-email', 'xrechnung-pdf'],
  sources: ['ustg14', 'ustg14b', 'bmf-2025', 'bmf-faq', 'elster-viewer'],
  de: {
    slug: 'e-rechnung-empfangen',
    nav: 'E-Rechnungen empfangen', card: 'Postfach, Lesen, Prüfen, Ablage: was der Empfang verlangt',
    title: 'E-Rechnung empfangen 2026: Postfach, Lesen, Prüfen',
    description: 'E-Rechnung empfangen 2026: seit 2025 Pflicht für jedes Unternehmen. Was das Postfach leisten muss, wie Sie die XML lesen, prüfen und aufbewahren. Mit Check.',
    h1: 'E-Rechnungen empfangen: sind Sie bereit?',
    intro: 'Vier Fragen mit Ja oder Nein: Der Check zeigt, was Ihnen für den Empfang von XRechnung und ZUGFeRD noch fehlt.',
    resume: `Seit dem ${PF.empfangAb.split('-').reverse().join('.')} muss jedes Unternehmen in Deutschland E-Rechnungen von inländischen Lieferanten annehmen können. Das gilt ohne Übergangsfrist und auch für Kleinunternehmer, Vereine mit wirtschaftlichem Geschäftsbetrieb und Vermieter, die als Unternehmer handeln. Ablehnen dürfen Sie eine E-Rechnung nicht, und eine Papierrechnung können Sie nicht mehr verlangen, wenn der Lieferant elektronisch abrechnet. Für den Empfang genügt nach dem Schreiben des Bundesfinanzministeriums vom 15. Oktober 2025 ein E-Mail-Postfach; eine besondere Plattform oder eine Software mit Zertifikat ist nicht vorgeschrieben. Sie brauchen aber einen Weg, die XML-Datei lesbar zu machen, etwa einen Viewer im Browser, den kostenlosen Viewer der Steuerverwaltung oder Ihre Buchhaltungssoftware. Vor der Zahlung prüfen Sie die Pflichtangaben und die Beträge wie bei jeder Rechnung. Aufbewahrt wird die empfangene XML im Original, unverändert und ${AB.rechnungJahre} Jahre lang; ein Ausdruck ersetzt sie nicht.`,
    faqs: [
      { q: 'Darf ich eine E-Rechnung ablehnen und Papier verlangen?', a: 'Nein. Seit 2025 muss jeder inländische Unternehmer E-Rechnungen annehmen. Schickt ein Lieferant eine XRechnung oder eine ZUGFeRD-Datei, ist sie in der richtigen Form zugestellt, auch wenn Sie lieber Papier hätten. Sie können ihn höchstens bitten, zusätzlich eine lesbare Kopie zu senden. Ablehnen dürfen Sie eine Rechnung nur aus inhaltlichen Gründen, etwa bei falschem Betrag oder fehlenden Angaben.' },
      { q: 'Brauche ich eine spezielle Software für den Rechnungseingang?', a: 'Nicht zwingend. Ein E-Mail-Postfach reicht für die Zustellung, und zum Lesen genügt ein Viewer, der die XML als Rechnung anzeigt. Bei wenigen Eingangsrechnungen im Monat kommen Sie damit gut aus. Wer viele Rechnungen bekommt, spart mit einer Buchhaltungssoftware Zeit, weil sie die Daten direkt übernimmt, Summen abgleicht und die Zahlung vorbereitet.' },
      { q: 'Wie gebe ich E-Rechnungen an meinen Steuerberater weiter?', a: 'Leiten Sie die Originaldatei weiter, also die XML oder die ZUGFeRD-PDF mit eingebetteter XML, nicht einen Ausdruck oder einen Screenshot. Viele Kanzleien richten dafür eine eigene Eingangsadresse oder einen Upload in ihrer Software ein. Klären Sie, wer die Datei aufbewahrt: Die Pflicht zur Aufbewahrung bleibt bei Ihnen, auch wenn die Kanzlei eine Kopie hat.' },
      { q: 'Was tue ich, wenn sich eine E-Rechnung nicht öffnen lässt?', a: 'Prüfen Sie zuerst, ob wirklich eine XML oder eine PDF mit eingebetteter Datei angekommen ist und nicht nur eine Begleitmail. Öffnet der Viewer die Datei nicht, ist sie vermutlich beschädigt oder in keinem Format nach EN 16931. Bitten Sie dann den Lieferanten um eine korrekte Datei. Bis sie vorliegt, fehlt Ihnen eine ordnungsgemäße Rechnung für den Vorsteuerabzug.' },
    ],
    body: (h) => `
<h2>Was das Gesetz vom Empfänger verlangt</h2>
<p>Die Pflicht steckt in ${h.src('ustg14', '§ 14 Abs. 1 und 2 UStG')}: Für Leistungen zwischen inländischen Unternehmen ist die E-Rechnung die Regel. Die Übergangsfristen in § 27 Abs. 38 UStG betreffen nur das Ausstellen. Für den Empfang gibt es keine Schonzeit, denn ein Lieferant, der schon heute E-Rechnungen schreibt, muss sie zustellen können. Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} nennt die Mindestausstattung: Es genügt, dass Sie ein E-Mail-Postfach für den Empfang bereitstellen. Ein bestimmtes Übertragungsverfahren dürfen Lieferant und Kunde vereinbaren, vorgeschrieben ist keines.</p>
<p>Daraus folgen vier praktische Aufgaben, die der Check oben abfragt: eine Eingangsadresse, ein Werkzeug zum Lesen, eine Prüfung vor der Zahlung und eine Ablage, die die Datei unverändert hält.</p>
<h2>Eine Eingangsadresse einrichten</h2>
<p>Bewährt hat sich eine eigene Adresse nur für Rechnungen, etwa rechnung@ oder invoice@ Ihrer Domain. Teilen Sie sie Ihren Lieferanten mit, am besten zusammen mit der Bitte, je Rechnung eine eigene E-Mail zu senden. So landen Rechnungen nicht in persönlichen Postfächern, gehen im Urlaub nicht unter und lassen sich später einem Vorgang zuordnen. Wer mit Plattformen oder dem Peppol-Netz arbeitet, kann dort zusätzlich empfangen; für die Pflicht nötig ist das nicht.</p>
<h2>Die XML lesbar machen</h2>
<p>Eine XRechnung ist reiner Text mit Feldnamen und ohne Seitenbild. Öffnen Sie sie mit einem Viewer: Der ${h.a('oeffnen', 'Viewer dieser Seite')} zeigt Absender, Positionen, Steuer und Zahlungsangaben als gewohnte Rechnung, liest die Datei im Browser und lädt sie nicht hoch. Die Steuerverwaltung bietet mit dem ${h.src('elster-viewer', 'E-Rechnungs-Viewer bei ELSTER')} ebenfalls eine kostenlose Anzeige an. Bei einer ZUGFeRD-Rechnung sehen Sie zuerst die PDF; maßgeblich sind aber die Daten der eingebetteten XML. Weichen PDF und XML voneinander ab, gilt die XML.</p>
<h2>Vor der Zahlung prüfen</h2>
<p>Die Prüfung ist dieselbe wie bei einer Papierrechnung: Stimmen Name und Anschrift, Ihre Bestellung, Menge und Preis, Steuersatz und Summen? Neu ist, dass ein Programm einen Teil davon abnehmen kann. Die ${h.a('validator', 'Vorprüfung im XRechnung-Validator')} rechnet Positionen und Gesamtbeträge nach und meldet fehlende Pflichtfelder mit der Regel, gegen die sie verstoßen. Fehlt etwas, das der Vorsteuerabzug braucht, bitten Sie um eine berichtigte Rechnung, bevor Sie zahlen.</p>
<h2>Weiterleiten und aufbewahren</h2>
<p>Geht die Rechnung an die Buchhaltung oder die Kanzlei, leiten Sie immer die Originaldatei weiter. Für die eigene Ablage gilt ${h.src('ustg14b', '§ 14b UStG')}: ${h.n(AB.rechnungJahre)} Jahre, im Originalformat und so, dass sich nachträgliche Änderungen ausschließen lassen. Wie das mit einfachen Mitteln gelingt, zeigt ${h.a('archivieren', 'E-Rechnungen archivieren')}. Ob Ihre Rechnungen schon richtig liegen, sagt der kleine Rechner:</p>
${h.mini('archiv', { p: ['jahr', 'beleg'], c: 'Aufbewahrung genau prüfen' })}
<p>Eine druckbare Fassung für Akten oder Freigaben erzeugen Sie aus der XML, wie unter ${h.a('xrechnung-pdf', 'XRechnung in PDF umwandeln')} beschrieben. Diese PDF ist eine Lesehilfe und ersetzt die XML in der Ablage nicht.</p>
`,
  },
  en: {
    slug: 'receive-e-invoices',
    nav: 'Receiving e-invoices', card: 'Inbox, reading, checking, filing: what receiving requires',
    title: 'Receive E-invoices in Germany 2026: Inbox, Read, Check',
    description: 'Receiving e-invoices in Germany 2026: required for every business since 2025. What your inbox needs, how to read, check and keep the XML files. With a check.',
    h1: 'Receiving e-invoices: are you ready?',
    intro: 'Four yes-or-no questions: the check shows what you still need to receive XRechnung and ZUGFeRD invoices.',
    resume: `Since ${displayDate(PF.empfangAb, 'en-GB')} every business in Germany must be able to accept e-invoices from domestic suppliers. This applies with no transition period, including small businesses, associations with commercial activities and landlords acting as businesses. You may not refuse an e-invoice, and you can no longer insist on paper when a supplier invoices electronically. According to the Federal Finance Ministry letter of 15 October 2025, an email inbox is enough to receive; no special platform or certified software is required. You do need a way to make the XML file readable, such as a viewer in your browser, the tax administration's free viewer or your accounting software. Before paying, check the mandatory details and amounts as with any invoice. You keep the received XML as the original, unchanged and for ${AB.rechnungJahre} years; a printout does not replace it.`,
    faqs: [
      { q: 'May I refuse an e-invoice and ask for paper?', a: 'No. Since 2025 every domestic business must accept e-invoices. If a supplier sends an XRechnung or a ZUGFeRD file, it has been delivered in the proper form, even if you would prefer paper. At most you can ask for a readable copy as well. You may reject an invoice only on grounds of content, such as a wrong amount or missing details.' },
      { q: 'Do I need special software for incoming invoices?', a: 'Not necessarily. An email inbox is enough for delivery, and a viewer that displays the XML as an invoice is enough for reading. With a few incoming invoices a month that works well. If you receive many, accounting software saves time, because it takes over the data directly, matches the totals and prepares the payment.' },
      { q: 'How do I pass e-invoices on to my tax adviser?', a: 'Forward the original file, meaning the XML or the ZUGFeRD PDF with its embedded XML, not a printout or a screenshot. Many firms set up a dedicated inbox or an upload in their software for this. Agree who keeps the file: the retention duty stays with you, even if the adviser holds a copy.' },
      { q: 'What do I do if an e-invoice will not open?', a: 'First check that an XML or a PDF with an embedded file actually arrived, not just a cover email. If the viewer cannot open the file, it is probably damaged or not in an EN 16931 format. Ask the supplier for a correct file. Until you have it, you lack a proper invoice for deducting input VAT.' },
    ],
    body: (h) => `
<h2>What the law asks of the recipient</h2>
<p>The duty sits in ${h.src('ustg14', 'section 14(1) and (2) UStG')}: for supplies between domestic businesses the e-invoice is the rule. The transition periods in section 27(38) UStG concern issuing only. Receiving has no grace period, because a supplier who already issues e-invoices must be able to deliver them. The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} sets the minimum: it is enough to provide an email inbox for receiving. Supplier and customer may agree on a particular transmission method, but none is prescribed.</p>
<p>This leads to four practical tasks, which the check above asks about: an address for incoming invoices, a tool to read them, a check before payment and storage that keeps the file unchanged.</p>
<h2>Set up an address for invoices</h2>
<p>A dedicated address used only for invoices works well, such as invoices@ or rechnung@ at your domain. Give it to your suppliers, ideally with a request to send one invoice per email. That way invoices do not land in personal inboxes, do not get lost during holidays and can later be matched to a transaction. If you work with platforms or the Peppol network, you can receive there too; the mandate does not require it.</p>
<h2>Make the XML readable</h2>
<p>An XRechnung is plain text with field names and no page layout. Open it with a viewer: the ${h.a('oeffnen', 'viewer on this site')} shows the sender, line items, VAT and payment details as a familiar invoice, reads the file in your browser and does not upload it. The tax administration also offers a free display with its ${h.src('elster-viewer', 'e-invoice viewer on ELSTER')}. With a ZUGFeRD invoice you see the PDF first, but the data of the embedded XML is what counts. If the PDF and the XML differ, the XML prevails.</p>
<h2>Check before paying</h2>
<p>The check is the same as for a paper invoice: are the name and address right, does it match your order, are quantity, price, VAT rate and totals correct? What is new is that software can take over part of it. The ${h.a('validator', 'pre-check in the XRechnung validator')} recalculates line items and totals and reports missing mandatory fields with the rule they break. If something needed for the input VAT deduction is missing, ask for a corrected invoice before you pay.</p>
<h2>Forward and keep</h2>
<p>When the invoice goes to your bookkeeping or your adviser, always forward the original file. For your own records ${h.src('ustg14b', 'section 14b UStG')} applies: ${h.n(AB.rechnungJahre)} years, in the original format and in a way that rules out later changes. How to manage that with simple means is shown on ${h.a('archivieren', 'archiving e-invoices')}. Whether your invoices are already kept correctly is what the small calculator tells you:</p>
${h.mini('archiv', { p: ['jahr', 'beleg'], c: 'Check retention in detail' })}
<p>You can produce a printable version for files or approvals from the XML, as described on ${h.a('xrechnung-pdf', 'converting XRechnung to PDF')}. That PDF is a reading aid and does not replace the XML in your records.</p>
`,
  },
});
