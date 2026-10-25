import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Aufbewahrung : § 14b Abs. 1 UStG, § 147 Abs. 3 und 4 AO (Fassung Viertes Bürokratieentlastungsgesetz), GoBD in der Fassung des BMF-Schreibens vom 14.07.2025 (Rn. 119, 125, 131). */
const AB = K.P.aufbewahrung, B = K.P.bmf;
const bsp = K.aufbewahrenBis(2025, 'rechnung');

export default defineGuide({
  id: 'archivieren', group: 'praxis', order: 31,
  tool: 'archiv',
  related: ['empfangen', 'zugferd', 'xrechnung-pdf', 'oeffnen', 'pflicht'],
  sources: ['ustg14b', 'ao147', 'gobd', 'bmf-2025'],
  de: {
    slug: 'e-rechnung-archivieren',
    nav: 'E-Rechnungen archivieren', card: 'Was Sie wie lange aufbewahren: XML, PDF, Belege',
    title: 'E-Rechnung archivieren 2026: Fristen, XML, GoBD-Regeln',
    description: 'E-Rechnung archivieren 2026: acht Jahre, ab Ende des Ausstellungsjahres, die XML im Original und unveränderbar. Was die GoBD zu ZUGFeRD sagen, mit Fristrechner.',
    h1: 'E-Rechnungen aufbewahren: was, wie lange, in welcher Form',
    intro: 'Jahr und Art der Unterlage wählen: Der Rechner nennt das Ende der Aufbewahrungsfrist und sagt, welche Datei Sie behalten müssen.',
    resume: `Rechnungen müssen Sie nach § 14b UStG und § 147 Abs. 3 AO ${AB.rechnungJahre} Jahre aufbewahren; das gilt für ausgestellte wie für empfangene Rechnungen und seit dem Vierten Bürokratieentlastungsgesetz auch für andere Buchungsbelege. Die Frist beginnt mit dem Schluss des Kalenderjahres, in dem die Rechnung ausgestellt wurde. Eine Rechnung vom Mai 2025 darf deshalb erst nach dem 31. Dezember ${bsp.bis.slice(0, 4)} vernichtet werden, sofern keine Ablaufhemmung greift, etwa weil eine Betriebsprüfung läuft oder die Festsetzungsfrist einer Steuer noch offen ist. Bei der E-Rechnung ist die strukturierte Datei das Original: Die XML einer XRechnung oder die in eine ZUGFeRD-PDF eingebettete XML müssen Sie im empfangenen Format behalten. Nach den im Juli 2025 geänderten GoBD brauchen Sie die Bildseite einer ZUGFeRD-Rechnung nur dann zusätzlich, wenn sie steuerlich bedeutsame Angaben enthält, die nicht in der XML stehen. Die Ablage muss Änderungen ausschließen oder nachvollziehbar machen, und die Datei muss während der ganzen Frist lesbar und maschinell auswertbar bleiben. Ein Ausdruck genügt nicht.`,
    faqs: [
      { q: 'Reicht es, eine E-Rechnung auszudrucken und abzuheften?', a: 'Nein. Bei einer E-Rechnung ist die elektronische Datei das Original, und die müssen Sie im empfangenen Format aufbewahren. Ein Ausdruck oder eine daraus erzeugte PDF ist nur eine Lesehilfe. Löschen Sie nach dem Drucken die XML, fehlt dem Finanzamt bei einer Prüfung der eigentliche Beleg, und der Vorsteuerabzug kann in Frage stehen.' },
      { q: 'Muss ich bei ZUGFeRD die PDF oder die XML aufbewahren?', a: 'In jedem Fall die XML, denn sie ist der maßgebliche Teil der Rechnung. Da die XML in der PDF steckt, bewahren Sie praktisch die ganze Datei auf, so wie Sie sie bekommen haben. Die GoBD verlangen die Bildseite nur ausdrücklich, wenn sie zusätzliche steuerlich wichtige Angaben enthält. Wer die Datei unverändert ablegt, ist auf der sicheren Seite.' },
      { q: 'Gelten für alte Rechnungen noch zehn Jahre?', a: 'Die Verkürzung auf acht Jahre gilt für Unterlagen, deren Frist am 1. Januar 2025 noch nicht abgelaufen war. Rechnungen aus 2016 und später fallen also unter die neue Frist. Bücher, Inventare und Jahresabschlüsse bleiben bei zehn Jahren, Handels- und Geschäftsbriefe bei sechs. Vor dem Vernichten prüfen Sie, ob eine Ablaufhemmung besteht.' },
      { q: 'Darf ich E-Rechnungen in der Cloud aufbewahren?', a: 'Ja, der Speicherort ist frei, solange die Anforderungen erfüllt sind: Die Datei bleibt unverändert oder Änderungen werden protokolliert, sie ist während der ganzen Frist auffindbar und lesbar, und das Finanzamt kann bei einer Prüfung darauf zugreifen. Bei Speicherung außerhalb der EU sind zusätzliche Voraussetzungen der Abgabenordnung zu beachten. Halten Sie Ihr Verfahren schriftlich fest.' },
    ],
    body: (h) => `
<h2>Die Frist: ${h.n(AB.rechnungJahre)} Jahre ab Jahresende</h2>
<p>${h.src('ustg14b', '§ 14b Abs. 1 UStG')} verpflichtet jeden Unternehmer, ein Doppel seiner ausgestellten Rechnungen und alle erhaltenen Rechnungen ${h.n(AB.rechnungJahre)} Jahre aufzubewahren. ${h.src('ao147', '§ 147 Abs. 3 AO')} setzt dieselbe Frist für Buchungsbelege. Die Frist läuft nach § 147 Abs. 4 AO ab dem Schluss des Kalenderjahres, in dem die Rechnung ausgestellt oder die Buchung gemacht wurde. Das Datum der Zahlung spielt keine Rolle.</p>
${h.table(['Unterlage', 'Frist', 'Rechtsgrundlage'], [
  ['Rechnungen, ausgestellt und erhalten', `${h.n(AB.rechnungJahre)} Jahre`, '§ 14b UStG, § 147 Abs. 3 AO'],
  ['Buchungsbelege', `${h.n(AB.rechnungJahre)} Jahre`, '§ 147 Abs. 3 AO'],
  ['Bücher, Inventare, Jahresabschlüsse', `${h.n(AB.buecherJahre)} Jahre`, '§ 147 Abs. 3 AO'],
  ['Handels- und Geschäftsbriefe', `${h.n(AB.handelsbriefJahre)} Jahre`, '§ 147 Abs. 3 AO'],
], 'Aufbewahrungsfristen nach Abgabenordnung und Umsatzsteuergesetz.', ['l', 'r', 'l'])}
<p>Ein Beispiel: Eine Rechnung vom 12. Mai 2025 muss bis zum ${h.day(bsp.bis)} vorhanden sein; vernichten dürfen Sie sie frühestens am ${h.day(bsp.vernichtenAb)}. Die Frist endet aber nicht, solange die Unterlage für eine Steuer von Bedeutung ist, deren Festsetzungsfrist noch läuft. Diese Ablaufhemmung steht in § 147 Abs. 3 Satz 5 AO und greift zum Beispiel während einer Außenprüfung oder eines Einspruchs.</p>
${h.mini('archiv', { p: ['jahr', 'beleg'], c: 'Frist für Ihre Unterlagen berechnen' })}
<h2>Welche Datei das Original ist</h2>
<p>Bei einer Papierrechnung ist das Blatt der Beleg, bei einer E-Rechnung die Datei. Das ${h.src('gobd', 'BMF-Schreiben vom 14. Juli 2025')} (Geschäftszeichen ${B.gobdGz}) hat die GoBD dafür angepasst. Nach Randnummer 119 ist bei einer E-Rechnung der strukturierte Teil aufzubewahren, also die XML. Bei hybriden Formaten wie ZUGFeRD verlangt Randnummer 125 die Bildseite nur, wenn sie Angaben enthält, die für die Besteuerung bedeutsam sind und in der XML fehlen, etwa handschriftliche Vermerke, die später als Beleg dienen. Randnummer 131 regelt die Umwandlung in ein eigenes Format: Wer die eingegangene Datei für seine Software umwandelt, muss das Original zusätzlich behalten.</p>
<p>In der Praxis ist die einfachste Lösung auch die sicherste. Legen Sie die Datei genau so ab, wie sie angekommen ist, und ergänzen Sie Buchungsvermerke in Ihrer Buchhaltung, nicht in der Datei. Eine XRechnung behält ihren Inhalt, auch wenn Sie sie im ${h.a('oeffnen', 'Viewer')} öffnen oder drucken; gespeichert wird dabei nichts.</p>
<h2>Unveränderbar und lesbar ablegen</h2>
<p>Die GoBD verlangen, dass eine Unterlage nicht unbemerkt verändert werden kann. Das erreichen Sie auf mehreren Wegen: mit einem Dokumentenmanagement- oder Buchhaltungsprogramm, das Änderungen protokolliert, mit einem Speicher, der Dateien gegen Überschreiben sperrt, oder mit einem festgehaltenen Verfahren, bei dem Dateien nur einmal abgelegt und danach nur gelesen werden. Ein Ordner auf dem Rechner ohne Regeln und ohne Sicherung reicht in der Regel nicht.</p>
<p>Ebenso wichtig ist die Lesbarkeit über ${h.n(AB.rechnungJahre)} Jahre. Speichern Sie die XML so, dass sie auch nach einem Wechsel der Software geöffnet werden kann, und halten Sie fest, mit welchem Programm Sie die Dateien anzeigen. Ein Viewer, der im Browser läuft, wie der dieser Seite, ist dafür eine robuste Rückfalllösung. Beschreiben Sie das Ganze in einer kurzen Verfahrensdokumentation: wo Rechnungen eingehen, wer sie ablegt, wie gesichert wird.</p>
<h2>Eingang und Ausgang gleich behandeln</h2>
<p>Die Pflicht gilt für beide Richtungen. Von Ihren eigenen Rechnungen bewahren Sie die Datei auf, die Sie verschickt haben, nicht nur die Daten in Ihrem Programm. Wie der Eingang gut organisiert wird, steht unter ${h.a('empfangen', 'E-Rechnungen empfangen')}; was eine ZUGFeRD-Datei technisch enthält, unter ${h.a('zugferd', 'ZUGFeRD')}.</p>
`,
  },
  en: {
    slug: 'archive-e-invoices',
    nav: 'Archiving e-invoices', card: 'What to keep and for how long: XML, PDF, records',
    title: 'Archive E-invoices Germany 2026: Retention, XML, GoBD',
    description: 'Archiving e-invoices in Germany 2026: eight years from the end of the issue year, the XML kept as the unchanged original. GoBD rules on ZUGFeRD, a calculator.',
    h1: 'Keeping e-invoices: what, how long, in which form',
    intro: 'Choose the year and type of record: the calculator gives the end of the retention period and tells you which file you must keep.',
    resume: `Under section 14b of the VAT Act (UStG) and section 147(3) of the Fiscal Code (AO) you must keep invoices for ${AB.rechnungJahre} years; this applies to invoices you issue and receive and, since the Fourth Bureaucracy Relief Act, to other accounting vouchers as well. The period starts at the end of the calendar year in which the invoice was issued. An invoice from May 2025 may therefore be destroyed only after 31 December ${bsp.bis.slice(0, 4)}, unless the expiry is suspended, for example because a tax audit is running or the assessment period for a tax is still open. With an e-invoice the structured file is the original: you must keep the XML of an XRechnung, or the XML embedded in a ZUGFeRD PDF, in the format received. Under the GoBD as amended in July 2025, you need the visual part of a ZUGFeRD invoice in addition only if it contains tax-relevant details not found in the XML. Storage must rule out changes or make them traceable, and the file must stay readable and machine-processable for the whole period. A printout is not enough.`,
    faqs: [
      { q: 'Is it enough to print an e-invoice and file the paper?', a: 'No. With an e-invoice the electronic file is the original, and you must keep it in the format received. A printout or a PDF made from it is only a reading aid. If you delete the XML after printing, the tax office lacks the actual record in an audit, and your input VAT deduction may be questioned.' },
      { q: 'With ZUGFeRD, do I keep the PDF or the XML?', a: 'The XML in every case, because it is the authoritative part of the invoice. As the XML sits inside the PDF, in practice you keep the whole file as you received it. The GoBD require the visual part explicitly only if it holds additional tax-relevant details. Filing the file unchanged keeps you on the safe side.' },
      { q: 'Do old invoices still need ten years?', a: 'The reduction to eight years applies to records whose period had not yet expired on 1 January 2025. Invoices from 2016 onwards therefore fall under the new period. Books, inventories and annual accounts stay at ten years, business letters at six. Before destroying anything, check whether the expiry is suspended.' },
      { q: 'May I store e-invoices in the cloud?', a: 'Yes, the location is up to you as long as the requirements are met: the file stays unchanged or changes are logged, it can be found and read for the whole period, and the tax office can access it in an audit. Storage outside the EU comes with additional conditions under the Fiscal Code. Write down your procedure.' },
    ],
    body: (h) => `
<h2>The period: ${h.n(AB.rechnungJahre)} years from the end of the year</h2>
<p>${h.src('ustg14b', 'Section 14b(1) UStG')} obliges every business to keep a copy of the invoices it issues and all invoices it receives for ${h.n(AB.rechnungJahre)} years. ${h.src('ao147', 'Section 147(3) AO')} sets the same period for accounting vouchers. Under section 147(4) AO the period runs from the end of the calendar year in which the invoice was issued or the entry made. The payment date does not matter.</p>
${h.table(['Record', 'Period', 'Legal basis'], [
  ['Invoices, issued and received', `${h.n(AB.rechnungJahre)} years`, 'Section 14b UStG, section 147(3) AO'],
  ['Accounting vouchers', `${h.n(AB.rechnungJahre)} years`, 'Section 147(3) AO'],
  ['Books, inventories, annual accounts', `${h.n(AB.buecherJahre)} years`, 'Section 147(3) AO'],
  ['Business letters', `${h.n(AB.handelsbriefJahre)} years`, 'Section 147(3) AO'],
], 'Retention periods under the Fiscal Code and the VAT Act.', ['l', 'r', 'l'])}
<p>An example: an invoice dated 12 May 2025 must be available until ${h.day(bsp.bis)}; you may destroy it on ${h.day(bsp.vernichtenAb)} at the earliest. The period does not end, however, while the record matters for a tax whose assessment period is still running. This suspension is set out in section 147(3) sentence 5 AO and applies, for example, during a tax audit or an objection.</p>
${h.mini('archiv', { p: ['jahr', 'beleg'], c: 'Work out the period for your records' })}
<h2>Which file is the original</h2>
<p>With a paper invoice the sheet is the record, with an e-invoice the file. The ${h.src('gobd', 'Finance Ministry letter of 14 July 2025')} (reference ${B.gobdGz}) adapted the GoBD, the German rules on proper electronic bookkeeping, for this. Under margin number 119 the structured part of an e-invoice must be kept, meaning the XML. For hybrid formats such as ZUGFeRD, margin number 125 requires the visual part only if it holds details that matter for taxation and are missing from the XML, such as handwritten notes that later serve as evidence. Margin number 131 deals with conversion into an in-house format: if you convert the incoming file for your software, you must keep the original as well.</p>
<p>In practice the simplest solution is also the safest. File the document exactly as it arrived, and add posting notes in your accounting system, not in the file. An XRechnung keeps its content when you open or print it in the ${h.a('oeffnen', 'viewer')}; nothing is saved in the process.</p>
<h2>Store it unchanged and readable</h2>
<p>The GoBD require that a record cannot be changed unnoticed. You can achieve that in several ways: with document management or accounting software that logs changes, with storage that locks files against overwriting, or with a written procedure under which files are filed once and only read afterwards. A folder on your computer with no rules and no backup is usually not enough.</p>
<p>Readability over ${h.n(AB.rechnungJahre)} years matters just as much. Store the XML so that it can be opened after a change of software too, and note which program you use to display the files. A viewer that runs in the browser, like the one on this site, is a robust fallback. Describe the whole setup in short procedure documentation: where invoices arrive, who files them, how backups are made.</p>
<h2>Treat incoming and outgoing invoices alike</h2>
<p>The duty applies in both directions. For your own invoices, keep the file you actually sent, not just the data in your program. How to organise incoming invoices well is on ${h.a('empfangen', 'receiving e-invoices')}; what a ZUGFeRD file contains technically is on ${h.a('zugferd', 'ZUGFeRD')}.</p>
`,
  },
});
