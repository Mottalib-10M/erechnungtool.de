import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* E-Rechnungspflicht : § 14 Abs. 1 und 2 UStG, Übergang § 27 Abs. 38 UStG, Ausnahmen §§ 33, 34, 34a UStDV, BMF-Schreiben vom 15.10.2025 (Rn. 1 ff.). Alles gelesen am params.retrieved_at. */
const PF = K.P.pflicht, A = K.P.ausnahmen;

export default defineGuide({
  id: 'pflicht', group: 'pflicht', order: 10,
  tool: 'pflicht',
  related: ['fristen', 'kleinunternehmer', 'folgen', 'empfangen', 'was-ist', 'bmf'],
  sources: ['ustg14', 'ustg27', 'ustdv33', 'ustdv34', 'ustdv34a', 'bmf-2025', 'bmf-faq'],
  de: {
    slug: 'e-rechnungspflicht',
    nav: 'E-Rechnungspflicht', card: 'Wer muss ab wann E-Rechnungen empfangen und ausstellen?',
    title: 'E-Rechnungspflicht 2026: wer, ab wann, welche Ausnahmen',
    description: 'E-Rechnungspflicht 2026 im Überblick: Empfang seit 2025 für alle Firmen, Ausstellen ab 2027 oder 2028 je nach Umsatz. Mit Prüfung Ihres Falls in einer Minute.',
    h1: 'E-Rechnungspflicht: Gilt sie für Ihr Unternehmen?',
    intro: 'Kundenkreis und Umsatz eingeben: Der Check zeigt, ab wann Sie E-Rechnungen ausstellen müssen und was Sie heute schon empfangen können müssen.',
    resume: `Die E-Rechnungspflicht gilt für Umsätze zwischen inländischen Unternehmen. Seit dem ${displayDate(PF.empfangAb, 'de-DE')} muss jedes Unternehmen in Deutschland eine E-Rechnung annehmen können; eine Übergangsfrist für den Empfang gibt es nicht, ein E-Mail-Postfach genügt. Für das Ausstellen gelten Übergangsregeln aus § 27 Abs. 38 UStG: Bis Ende 2026 dürfen Sie noch Papier- oder PDF-Rechnungen schreiben, eine PDF allerdings nur mit Zustimmung des Kunden. Im Jahr 2027 bleibt das nur erlaubt, wenn Ihr Gesamtumsatz im Vorjahr höchstens 800.000 Euro betrug; ab dem 1. Januar 2028 ist die E-Rechnung für alle inländischen B2B-Rechnungen Pflicht. Ausgenommen sind Rechnungen bis 250 Euro, Fahrausweise, die meisten steuerfreien Leistungen und Kleinunternehmer, die stets auch eine sonstige Rechnung ausstellen dürfen. Rechnungen an Privatkunden betrifft die Pflicht nicht. Als E-Rechnung zählt nur ein strukturiertes Format nach der Norm EN 16931, etwa XRechnung oder ZUGFeRD ab Version 2.0.1; eine bloße PDF ist keine E-Rechnung.`,
    faqs: [
      { q: 'Gilt die E-Rechnungspflicht auch für Rechnungen an Privatkunden?', a: 'Nein. Die Pflicht betrifft nur Leistungen an andere Unternehmer, die in Deutschland ansässig sind. Einer Privatperson dürfen Sie weiter eine Papier- oder PDF-Rechnung geben, auch nach 2027. Wer gemischt an Firmen und Privatleute verkauft, braucht die E-Rechnung also nur für den geschäftlichen Teil und kann für Privatkunden bei der gewohnten Rechnung bleiben.' },
      { q: 'Muss ich schon heute E-Rechnungen empfangen können?', a: 'Ja, seit dem 1. Januar 2025 ohne Übergangsfrist. Schickt Ihnen ein Lieferant eine XRechnung oder eine ZUGFeRD-Datei, dürfen Sie sie nicht zurückweisen und eine Papierrechnung verlangen. Für den Empfang reicht laut Bundesfinanzministerium ein E-Mail-Postfach. Lesen können Sie die Datei mit einem Viewer wie dem auf dieser Seite, ohne sie hochzuladen.' },
      { q: 'Zählt eine PDF-Rechnung per E-Mail als E-Rechnung?', a: 'Nein. Eine PDF ist nach dem Umsatzsteuergesetz eine sonstige Rechnung, weil ihre Daten nicht strukturiert und maschinell auswertbar sind. Erst wenn in der PDF eine XML nach EN 16931 steckt, wie bei ZUGFeRD ab Profil BASIC, liegt eine E-Rechnung vor. Bis Ende 2026 bleibt die reine PDF mit Zustimmung des Empfängers erlaubt, danach nur noch in den gesetzlichen Ausnahmen.' },
      { q: 'Wie wird der Umsatz für die Grenze von 800.000 Euro gezählt?', a: 'Maßgeblich ist der Gesamtumsatz nach § 19 Abs. 3 UStG im vorangegangenen Kalenderjahr, also für Rechnungen des Jahres 2027 der Umsatz 2026. Er umfasst die steuerbaren Umsätze ohne bestimmte steuerfreie Umsätze und ohne Umsatzsteuer. Liegt er bei höchstens 800.000 Euro, dürfen Sie 2027 noch Papier- oder PDF-Rechnungen ausstellen, mit Zustimmung des Kunden für die PDF.' },
    ],
    body: (h) => `
<h2>Die drei Stufen der Pflicht</h2>
<p>Das Wachstumschancengesetz hat ${h.src('ustg14', '§ 14 UStG')} neu gefasst. Ob eine Rechnung elektronisch sein muss, hängt seitdem von zwei Fragen ab: Geht die Leistung an einen anderen Unternehmer, und sind beide in Deutschland ansässig? Wenn ja, ist die E-Rechnung der Regelfall. Wann Sie sie tatsächlich ausstellen müssen, regelt die Übergangsvorschrift in ${h.src('ustg27', '§ 27 Abs. 38 UStG')}.</p>
${h.table(['Zeitraum', 'Empfangen', 'Ausstellen'], [
  [`ab ${h.day(PF.empfangAb)}`, 'Pflicht für alle Unternehmen', 'Papier oder PDF weiter erlaubt, PDF mit Zustimmung'],
  [`bis ${h.day(PF.papierBis)}`, 'Pflicht', 'Papier oder PDF für alle erlaubt'],
  ['im Jahr 2027', 'Pflicht', `Papier oder PDF nur bei Vorjahresumsatz bis ${h.eur(PF.umsatzgrenze)}; EDI mit Zustimmung`],
  [`ab ${h.day(PF.ausstellenAbKlein)}`, 'Pflicht', 'E-Rechnung für alle inländischen B2B-Umsätze'],
], 'Stufen der E-Rechnungspflicht nach § 27 Abs. 38 UStG.', ['l', 'l', 'l'])}
<p>Der Empfang hat keine Schonfrist. Das Bundesfinanzministerium stellt im ${h.src('bmf-2025', 'Schreiben vom 15. Oktober 2025')} klar, dass ein Unternehmer eine E-Rechnung nicht ablehnen darf und dass ein E-Mail-Postfach zur Entgegennahme ausreicht. Die Pflicht zum Ausstellen dagegen wächst stufenweise: erst die größeren Unternehmen ab 2027, dann ab 2028 alle.</p>
<h2>Wer nicht betroffen ist</h2>
<p>Die Ausnahmen stehen zum Teil im Gesetz, zum Teil in der Durchführungsverordnung. Für diese Fälle dürfen Sie auch nach 2027 eine Papier- oder PDF-Rechnung ausstellen, wenn der Kunde zustimmt:</p>
<ul>
<li><strong>Kleinbetragsrechnungen</strong> bis ${h.eur(A.kleinbetrag)} brutto nach ${h.src('ustdv33', '§ 33 UStDV')}. Typisch sind Bewirtungsbelege und Einkäufe an der Ladenkasse.</li>
<li><strong>Fahrausweise</strong> nach ${h.src('ustdv34', '§ 34 UStDV')}, etwa Bahn- und Flugtickets.</li>
<li><strong>Steuerfreie Leistungen</strong> nach § 4 Nr. ${A.steuerfreiVon} bis ${A.steuerfreiBis} UStG, zum Beispiel Vermietung von Wohnraum, ärztliche Heilbehandlung oder Versicherungsumsätze.</li>
<li><strong>Kleinunternehmer</strong>: Nach ${h.src('ustdv34a', '§ 34a Satz 4 UStDV')} dürfen sie immer eine sonstige Rechnung ausstellen. Empfangen müssen aber auch sie können.</li>
</ul>
<p>Grenzüberschreitende Rechnungen fallen nicht unter die deutsche Pflicht. Ein französischer Lieferant oder ein Kunde in Österreich ist nicht im Inland ansässig, also bleibt die Form der Rechnung zwischen Ihnen frei, solange beide zustimmen. Gleiches gilt für Leistungen an Vereine oder Behörden, die nicht als Unternehmer handeln; für Rechnungen an die Bundesverwaltung gilt allerdings seit Jahren die E-Rechnungsverordnung, siehe ${h.a('bund', 'E-Rechnung an den Bund')}.</p>
<h2>Prüfen, ob Ihre Rechnung im Jahr X erlaubt ist</h2>
<p>Die häufigste Frage im Alltag lautet nicht „gilt die Pflicht“, sondern „darf ich diese eine Rechnung noch als PDF schicken“. Das hängt vom Leistungsjahr, vom Vorjahresumsatz und von der Art der Rechnung ab. Der kleine Rechner beantwortet genau das:</p>
${h.mini('fristen', { p: ['jahr', 'form', 'umsatz'], c: 'Alle Fristen prüfen' })}
<h2>Was als E-Rechnung zählt</h2>
<p>Eine E-Rechnung ist nach § 14 Abs. 1 UStG eine Rechnung in einem strukturierten elektronischen Format, das eine elektronische Verarbeitung ermöglicht und der europäischen Norm EN 16931 entspricht. In Deutschland heißen die gängigen Formate XRechnung und ZUGFeRD. ZUGFeRD verbindet eine lesbare PDF mit einer eingebetteten XML; als E-Rechnung zählt es ab Version ${K.P.standards.zugferdMindest} und nur in den Profilen ab BASIC, nicht in MINIMUM und BASIC WL. Andere Formate wie EDI-Nachrichten sind zulässig, wenn sich die Angaben richtig und vollständig in ein EN-16931-konformes Format übertragen lassen. Was das im Detail bedeutet, erklärt ${h.a('was-ist', 'Was ist eine E-Rechnung?')}; welches Format zu Ihnen passt, ${h.a('xrechnung-oder-zugferd', 'XRechnung oder ZUGFeRD')}.</p>
<h2>Was Sie jetzt tun sollten</h2>
<p>Richten Sie zuerst den Empfang ein, denn der ist schon Pflicht: eine feste Adresse für Rechnungen, ein Programm oder Viewer zum Lesen und eine Ablage, die die XML-Datei unverändert aufbewahrt. Die Aufbewahrungsfrist beträgt ${h.n(K.P.aufbewahrung.rechnungJahre)} Jahre. Für das Ausstellen haben die meisten Unternehmen bis Ende 2026 Zeit; prüfen Sie trotzdem jetzt, ob Ihr Buchhaltungs- oder Rechnungsprogramm XRechnung oder ZUGFeRD erzeugt. Ohne eigene Software können Sie einzelne Rechnungen mit dem ${h.a('erstellen', 'kostenlosen Rechnungsersteller')} schreiben.</p>
`,
  },
  en: {
    slug: 'e-invoicing-mandate',
    nav: 'E-invoicing mandate', card: 'Who must receive and issue e-invoices, and from when?',
    title: 'E-invoicing Mandate Germany 2026: Who, When, Exceptions',
    description: 'German e-invoicing mandate in 2026: every business must receive e-invoices since 2025 and issue them from 2027 or 2028 depending on turnover. Check your case.',
    h1: 'German e-invoicing mandate: does it apply to you?',
    intro: 'Enter who you invoice and your turnover: the check shows when you must issue e-invoices and what you must already be able to receive.',
    resume: `The German e-invoicing mandate covers supplies between businesses established in Germany. Since 1 January 2025 every business in Germany must be able to accept an e-invoice; there is no transition period for receiving, and an email inbox is enough. For issuing, the transitional rules of section 27(38) of the VAT Act (UStG) apply. Until the end of 2026 you may still send paper or PDF invoices, a PDF only with the customer's consent. In 2027 this remains allowed only if your total turnover in the previous year was no more than 800,000 euros; from 1 January 2028 the e-invoice is mandatory for all domestic B2B invoices. Exceptions cover invoices up to 250 euros, travel tickets, most VAT-exempt supplies and small businesses, which may always issue an ordinary invoice. Invoices to consumers are not affected. Only a structured format under the European standard EN 16931 counts as an e-invoice, such as XRechnung or ZUGFeRD from version 2.0.1; a plain PDF does not.`,
    faqs: [
      { q: 'Does the German mandate apply to invoices for consumers?', a: 'No. It only covers supplies to other businesses established in Germany. You may keep giving consumers a paper or PDF invoice, after 2027 as well. If you sell to both businesses and private customers, you need e-invoices only for the business side and can carry on with your usual invoices for private buyers.' },
      { q: 'Must my business already be able to receive e-invoices?', a: 'Yes, since 1 January 2025, with no transition period. If a supplier sends you an XRechnung or a ZUGFeRD file, you may not reject it and demand a paper invoice instead. According to the Federal Ministry of Finance an email inbox is enough to receive. You can read the file with a viewer such as the one on this site without uploading it.' },
      { q: 'Is a PDF invoice sent by email an e-invoice?', a: 'No. Under the VAT Act a PDF is an ordinary invoice, because its data is not structured for machine processing. Only a PDF that carries an EN 16931 XML file inside, as ZUGFeRD does from the BASIC profile upwards, is an e-invoice. A plain PDF stays allowed with the recipient’s consent until the end of 2026, and after that only in the legal exceptions.' },
      { q: 'How is turnover counted for the 800,000 euro threshold?', a: 'What counts is total turnover under section 19(3) UStG in the previous calendar year, so for invoices issued in 2027 the turnover of 2026. It covers taxable supplies without certain exempt supplies and without VAT. If it was 800,000 euros or less, you may still issue paper or PDF invoices in 2027, with the customer’s consent for the PDF.' },
    ],
    body: (h) => `
<h2>The three stages of the mandate</h2>
<p>The Growth Opportunities Act rewrote ${h.src('ustg14', 'section 14 UStG')}. Whether an invoice must be electronic now depends on two questions: is the supply made to another business, and are both established in Germany? If so, the e-invoice is the rule. When you actually have to issue one is set by the transitional provision in ${h.src('ustg27', 'section 27(38) UStG')}.</p>
${h.table(['Period', 'Receiving', 'Issuing'], [
  [`from ${h.day(PF.empfangAb)}`, 'Required for every business', 'Paper or PDF still allowed, PDF with consent'],
  [`until ${h.day(PF.papierBis)}`, 'Required', 'Paper or PDF allowed for everyone'],
  ['during 2027', 'Required', `Paper or PDF only if prior-year turnover is up to ${h.eur(PF.umsatzgrenze)}; EDI with consent`],
  [`from ${h.day(PF.ausstellenAbKlein)}`, 'Required', 'E-invoice for all domestic B2B supplies'],
], 'Stages of the e-invoicing mandate under section 27(38) UStG.', ['l', 'l', 'l'])}
<p>Receiving has no grace period. In its ${h.src('bmf-2025', 'letter of 15 October 2025')} the Federal Ministry of Finance confirms that a business may not refuse an e-invoice and that an email inbox is enough to accept one. The duty to issue grows in steps: larger businesses from 2027, everyone from 2028.</p>
<h2>Who is not affected</h2>
<p>Some exceptions are in the Act itself, others in the implementing regulation (UStDV). In these cases you may keep issuing a paper or PDF invoice after 2027 if the customer agrees:</p>
<ul>
<li><strong>Small-amount invoices</strong> up to ${h.eur(A.kleinbetrag)} gross under ${h.src('ustdv33', 'section 33 UStDV')}, such as restaurant receipts and till purchases.</li>
<li><strong>Travel tickets</strong> under ${h.src('ustdv34', 'section 34 UStDV')}, such as rail and flight tickets.</li>
<li><strong>VAT-exempt supplies</strong> under section 4 nos. ${A.steuerfreiVon} to ${A.steuerfreiBis} UStG, for example residential lettings, medical treatment or insurance.</li>
<li><strong>Small businesses</strong>: under ${h.src('ustdv34a', 'section 34a sentence 4 UStDV')} they may always issue an ordinary invoice. They must still be able to receive.</li>
</ul>
<p>Cross-border invoices fall outside the German mandate. A French supplier or a customer in Austria is not established in Germany, so the invoice form between you stays free as long as both agree. The same goes for supplies to associations or public bodies that do not act as businesses; invoices to the federal administration, however, have been governed by the E-Invoicing Regulation for years, see ${h.a('bund', 'e-invoicing the federal government')}.</p>
<h2>Check whether one invoice is allowed in a given year</h2>
<p>The everyday question is rarely “does the mandate apply” but “may I still send this one invoice as a PDF”. That depends on the year of supply, the previous year’s turnover and the type of invoice. The small calculator answers exactly that:</p>
${h.mini('fristen', { p: ['jahr', 'form', 'umsatz'], c: 'Check every deadline' })}
<h2>What counts as an e-invoice</h2>
<p>Under section 14(1) UStG an e-invoice is an invoice in a structured electronic format that allows electronic processing and complies with the European standard EN 16931. In Germany the common formats are XRechnung and ZUGFeRD. ZUGFeRD combines a readable PDF with an embedded XML file; it counts as an e-invoice from version ${K.P.standards.zugferdMindest} and only in the profiles from BASIC upwards, not in MINIMUM or BASIC WL. Other formats such as EDI messages are allowed if the data can be converted correctly and completely into an EN 16931 format. The details are on ${h.a('was-ist', 'what is an e-invoice?')}, and the choice of format on ${h.a('xrechnung-oder-zugferd', 'XRechnung or ZUGFeRD')}.</p>
<h2>What to do now</h2>
<p>Set up receiving first, because it is already required: a fixed address for invoices, a program or viewer to read them and storage that keeps the XML file unchanged. The retention period is ${h.n(K.P.aufbewahrung.rechnungJahre)} years. Most businesses have until the end of 2026 for issuing; still, check now whether your accounting or invoicing software produces XRechnung or ZUGFeRD. Without software of your own you can write single invoices with the ${h.a('erstellen', 'free invoice creator')}.</p>
`,
  },
});
