import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* EDI : § 14 Abs. 1 Satz 6 Nr. 2 UStG (vereinbartes Format, wenn die Angaben richtig und vollständig in ein Format nach EN 16931 übertragen werden können), § 27 Abs. 38 Nr. 3 UStG (EDI nach Art. 2 der Empfehlung 94/820/EG mit Zustimmung bis 31.12.2027), BMF-Schreiben vom 15.10.2025. */
const PF = K.P.pflicht;

export default defineGuide({
  id: 'edi', group: 'praxis', order: 34,
  tool: 'edi',
  related: ['fristen', 'en-16931', 'formate', 'bmf', 'xrechnung', 'pflicht'],
  sources: ['ustg14', 'ustg27', 'bmf-2025', 'richtlinie-2014-55', 'bmf-faq'],
  de: {
    slug: 'edi-rechnung',
    nav: 'EDI-Rechnung', card: 'Was mit EDIFACT und anderen EDI-Verfahren ab 2028 passiert',
    title: 'EDI Rechnung und E-Rechnung 2026: was bis 2027 erlaubt ist',
    description: 'EDI-Rechnung und E-Rechnung 2026: bestehende EDI-Verfahren bleiben mit Zustimmung bis Ende 2027 erlaubt. Was danach für EDIFACT gilt und wie Sie es prüfen.',
    h1: 'EDI-Rechnung: was mit EDIFACT unter der E-Rechnungspflicht geschieht',
    intro: 'Leistungsjahr, Zustimmung und Auslesbarkeit wählen: Der Rechner sagt, ob Ihre EDI-Rechnung zulässig ist und was ab 2028 für das Verfahren nötig wird.',
    resume: `Viele Unternehmen im Handel, in der Industrie und in der Logistik tauschen Rechnungen seit Jahren per EDI aus, meist als EDIFACT-Nachricht vom Typ INVOIC oder in einem branchenüblichen XML-Format. Die E-Rechnungspflicht schafft diese Verfahren nicht ab, stellt sie aber unter Bedingungen. Bis zum ${displayDate(PF.ediBis, 'de-DE')} dürfen Rechnungen nach § 27 Abs. 38 Nr. 3 UStG weiter in einem EDI-Verfahren übermittelt werden, wenn der Empfänger zustimmt, auch wenn das Format nicht der europäischen Norm EN 16931 entspricht. Danach gilt ein vereinbartes Format nur noch als E-Rechnung, wenn sich die umsatzsteuerlichen Angaben richtig und vollständig in ein Format nach EN 16931 übertragen lassen oder das Format damit interoperabel ist; so steht es in § 14 Abs. 1 Satz 6 Nr. 2 UStG. Für EDI-Partner heißt das: Bis Ende 2027 prüfen, ob jede Pflichtangabe der Norm im eigenen Nachrichtenprofil vorhanden und eindeutig zuordenbar ist, oder auf XRechnung oder ZUGFeRD umstellen. Die Zustimmung des Empfängers bleibt in beiden Fällen nötig.`,
    faqs: [
      { q: 'Ist eine EDIFACT-Rechnung eine E-Rechnung im Sinne des UStG?', a: 'Nicht automatisch. Eine EDIFACT-Nachricht ist ein strukturiertes elektronisches Format, entspricht aber nicht von sich aus der Norm EN 16931. Als E-Rechnung gilt sie nach § 14 Abs. 1 Satz 6 Nr. 2 UStG erst, wenn die Partner sie vereinbart haben und sich alle nötigen Angaben richtig und vollständig in ein normgerechtes Format übertragen lassen. Bis Ende 2027 genügt die Zustimmung des Empfängers.' },
      { q: 'Welche Voraussetzungen hat die EDI-Übergangsregel?', a: `Nummer 3 von § 27 Abs. 38 UStG verlangt zwei Dinge: Die Rechnung wird in einem elektronischen Datenaustausch nach Artikel 2 der Empfehlung 94/820/EG der Kommission übermittelt, und der Empfänger stimmt zu. Eine Umsatzgrenze gibt es dabei nicht. Die Regel gilt für Umsätze bis zum ${displayDate(PF.ediBis, 'de-DE')}, unabhängig davon, wie groß der Aussteller ist.` },
      { q: 'Muss ich mein EDI-Verfahren 2028 durch XRechnung ersetzen?', a: 'Nicht zwingend. Ab 2028 bleibt ein EDI-Format zulässig, wenn es die Angaben der EN 16931 vollständig abbilden kann und die Daten sich ohne Informationsverlust in ein normgerechtes Format übertragen lassen. Viele Branchenverbände arbeiten an solchen Profilen. Kann Ihr Profil das nicht, ist der Wechsel zu XRechnung oder ZUGFeRD der sichere Weg, oft als zusätzliche Ausgabe neben dem bestehenden Kanal.' },
    ],
    body: (h) => `
<h2>Warum EDI eine eigene Regel bekommt</h2>
<p>Elektronischer Datenaustausch ist älter als die E-Rechnung. Händler und Lieferanten verbinden ihre Warenwirtschaft seit Jahrzehnten über Standards wie EDIFACT, wo Bestellung, Lieferavis und Rechnung als Nachrichten fließen. Diese Rechnungen sind strukturiert und maschinell verarbeitbar, folgen aber nicht dem Datenmodell der europäischen Norm EN 16931, die erst auf die ${h.src('richtlinie-2014-55', 'Richtlinie 2014/55/EU')} zurückgeht. Hätte der Gesetzgeber nur die Norm zugelassen, hätten bewährte Verfahren über Nacht ihre Grundlage verloren.</p>
<p>Deshalb kennt ${h.src('ustg14', '§ 14 Abs. 1 Satz 6 UStG')} zwei Wege zur E-Rechnung: ein Format nach EN 16931 (Nummer 1) oder ein zwischen den Partnern vereinbartes anderes Format (Nummer 2), wenn es die richtige und vollständige Extraktion der nötigen Angaben in ein normgerechtes Format ermöglicht oder damit interoperabel ist. Für die Übergangszeit kommt eine dritte, großzügigere Regel hinzu.</p>
<h2>Die Übergangsregel bis Ende 2027</h2>
<p>${h.src('ustg27', '§ 27 Abs. 38 Nr. 3 UStG')} erlaubt für Umsätze bis zum ${h.day(PF.ediBis)} Rechnungen im EDI-Verfahren nach Artikel 2 der Empfehlung 94/820/EG der Kommission, wenn der Empfänger zustimmt. Ob sich die Daten in die Norm übertragen lassen, spielt bis dahin keine Rolle. Anders als bei der PDF gibt es auch im Jahr 2027 keine Umsatzgrenze: Ein Konzern mit Milliardenumsatz darf seine bisherigen EDI-Rechnungen ebenso weiterverwenden wie ein kleiner Zulieferer.</p>
<p>Die Zustimmung ist dabei kein Formalismus. EDI setzt ohnehin eine Vereinbarung zwischen den Partnern voraus, meist einen Rahmenvertrag mit technischen Anlagen. Wer diese Vereinbarung hat, erfüllt die Bedingung in aller Regel. Neue Partner, die nur E-Rechnungen nach der Norm verarbeiten wollen, können die Zustimmung aber verweigern; dann muss der Aussteller eine XRechnung oder ZUGFeRD-Rechnung liefern.</p>
${h.mini('fristen', { p: ['jahr', 'form'], d: { form: 'edi' }, c: 'Alle Rechnungsformen vergleichen' })}
<h2>Was ab 2028 zählt: Extraktion ohne Verlust</h2>
<p>Ab dem ${h.day(PF.ausstellenAbKlein)} muss auch eine EDI-Rechnung die Bedingung von Nummer 2 erfüllen. Praktisch bedeutet das eine Prüfung, Feld für Feld: Für jedes Pflichtelement der EN 16931, also etwa Rechnungsnummer, Datum, Anschriften, Steuernummern, Positionen, Steuerkategorien und Summen, muss es im eigenen Nachrichtenprofil ein Gegenstück geben, und die Werte müssen sich eindeutig und vollständig übertragen lassen. Fehlt ein Element oder ist es nur als Freitext vorhanden, reicht das nicht.</p>
<p>Für EDIFACT haben Normungsgremien und Branchen Abbildungen auf die Norm beschrieben. Ob Ihr konkretes Profil sie erfüllt, hängt aber von den Segmenten ab, die Sie tatsächlich befüllen. Ein guter Test ist, eine typische Rechnung testweise in eine XRechnung umzuwandeln und diese mit einem Validator zu prüfen: Was dort fehlt, fehlt auch im EDI-Profil. Welche Felder die Norm verlangt, zeigt ${h.a('en-16931', 'EN 16931: die Pflichtfelder')}.</p>
<h2>Drei Wege für EDI-Partner</h2>
<ul>
<li><strong>Profil ergänzen</strong>: Das eigene EDI-Format so erweitern, dass jede Angabe der Norm enthalten ist, und das mit dem Partner vertraglich festhalten.</li>
<li><strong>Parallel ausgeben</strong>: Neben der EDI-Nachricht eine XRechnung oder ZUGFeRD-Datei erzeugen. Viele Systeme können beides aus denselben Daten.</li>
<li><strong>Umstellen</strong>: Ganz auf ein Format nach EN 16931 wechseln, etwa XRechnung über das Peppol-Netz. Das ist vor allem für Partner mit wenigen Rechnungen der einfachste Weg.</li>
</ul>
<p>Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} nennt EDI-Verfahren ausdrücklich als zulässige Alternative, solange die Bedingungen erfüllt sind. Eine Liste anerkannter Profile führt die Verwaltung nicht; die Verantwortung für die Übertragbarkeit liegt bei den Partnern. Halten Sie deshalb fest, wie Sie die Übertragbarkeit geprüft haben. Einen Überblick über die übrigen Formate gibt ${h.a('formate', 'E-Rechnung: Formate im Vergleich')}.</p>
`,
  },
  en: {
    slug: 'edi-invoicing',
    nav: 'EDI invoicing', card: 'What happens to EDIFACT and other EDI set-ups from 2028',
    title: 'EDI Invoicing and E-Invoice Germany 2026: Rules to 2027',
    description: 'EDI invoicing and German e-invoicing in 2026: existing EDI set-ups stay allowed with consent to the end of 2027. What applies to EDIFACT next, and how to check.',
    h1: 'EDI invoicing: what happens to EDIFACT under the e-invoicing mandate',
    intro: 'Choose the year of supply, consent and whether the data is extractable: the calculator says whether your EDI invoice is allowed and what the set-up needs from 2028.',
    resume: `Many businesses in retail, manufacturing and logistics have exchanged invoices by EDI for years, mostly as EDIFACT INVOIC messages or in an industry XML format. The German e-invoicing mandate does not abolish these set-ups, but it attaches conditions to them. Until ${displayDate(PF.ediBis, 'en-GB')} invoices may continue to be sent in an EDI procedure under section 27(38) no. 3 of the VAT Act (UStG) if the recipient agrees, even where the format does not match the European standard EN 16931. After that an agreed format only counts as an e-invoice if the VAT details can be transferred correctly and completely into an EN 16931 format, or if the format is interoperable with it; this is laid down in section 14(1) sentence 6 no. 2 UStG. For EDI partners that means: by the end of 2027, check whether every mandatory element of the standard exists in their own message profile and can be mapped unambiguously, or switch to XRechnung or ZUGFeRD. The recipient's consent remains necessary either way.`,
    faqs: [
      { q: 'Is an EDIFACT invoice an e-invoice under German VAT law?', a: 'Not automatically. An EDIFACT message is a structured electronic format, but it does not comply with EN 16931 by itself. Under section 14(1) sentence 6 no. 2 UStG it only counts as an e-invoice if the partners have agreed on it and all required details can be transferred correctly and completely into a compliant format. Until the end of 2027 the recipient’s consent is enough.' },
      { q: 'What are the conditions of the EDI transitional rule?', a: `Number 3 of section 27(38) UStG requires two things: the invoice is sent by electronic data interchange under Article 2 of Commission Recommendation 94/820/EC, and the recipient agrees. There is no turnover limit. The rule covers supplies up to ${displayDate(PF.ediBis, 'en-GB')}, regardless of the issuer’s size.` },
      { q: 'Must I replace my EDI set-up with XRechnung in 2028?', a: 'Not necessarily. From 2028 an EDI format remains allowed if it can carry all EN 16931 details and the data can be transferred into a compliant format without loss. Many industry bodies are working on such profiles. If your profile cannot do that, switching to XRechnung or ZUGFeRD is the safe route, often as an additional output alongside the existing channel.' },
    ],
    body: (h) => `
<h2>Why EDI gets a rule of its own</h2>
<p>Electronic data interchange is older than the e-invoice. Retailers and suppliers have linked their merchandise systems for decades through standards such as EDIFACT, with order, despatch advice and invoice flowing as messages. These invoices are structured and machine-processable, but they do not follow the data model of the European standard EN 16931, which only dates back to ${h.src('richtlinie-2014-55', 'Directive 2014/55/EU')}. Had the legislator admitted only the standard, established set-ups would have lost their footing overnight.</p>
<p>That is why ${h.src('ustg14', 'section 14(1) sentence 6 UStG')} offers two routes to an e-invoice: a format under EN 16931 (number 1), or another format agreed between the partners (number 2) if it allows the correct and complete extraction of the required details into a compliant format or is interoperable with it. For the transition period a third, more generous rule is added.</p>
<h2>The transitional rule until the end of 2027</h2>
<p>${h.src('ustg27', 'Section 27(38) no. 3 UStG')} allows invoices for supplies up to ${h.day(PF.ediBis)} in an EDI procedure under Article 2 of Commission Recommendation 94/820/EC if the recipient agrees. Whether the data can be transferred into the standard does not matter until then. Unlike the PDF, there is no turnover limit in 2027 either: a group with billions in turnover may keep its existing EDI invoices just as a small supplier may.</p>
<p>Consent is not a mere formality here. EDI requires an agreement between partners anyway, usually a framework contract with technical annexes. Whoever has such an agreement normally meets the condition. New partners who only want to process standard e-invoices may refuse consent, though; the issuer must then deliver an XRechnung or ZUGFeRD invoice.</p>
${h.mini('fristen', { p: ['jahr', 'form'], d: { form: 'edi' }, c: 'Compare every invoice form' })}
<h2>What counts from 2028: extraction without loss</h2>
<p>From ${h.day(PF.ausstellenAbKlein)} an EDI invoice too must meet the condition of number 2. In practice that means a check, field by field: for every mandatory element of EN 16931, such as invoice number, date, addresses, tax numbers, lines, VAT categories and totals, there must be a counterpart in your own message profile, and the values must transfer unambiguously and completely. If an element is missing or only present as free text, that is not enough.</p>
<p>Standards bodies and industries have described mappings from EDIFACT to the standard. Whether your specific profile meets them depends on the segments you actually fill. A good test is to convert a typical invoice into an XRechnung on a trial basis and run it through a validator: whatever is missing there is missing in the EDI profile too. The fields the standard requires are listed on ${h.a('en-16931', 'EN 16931: the mandatory fields')}.</p>
<h2>Three routes for EDI partners</h2>
<ul>
<li><strong>Extend the profile</strong>: enlarge your EDI format so it holds every detail of the standard, and record that in the contract with your partner.</li>
<li><strong>Output in parallel</strong>: produce an XRechnung or ZUGFeRD file next to the EDI message. Many systems can generate both from the same data.</li>
<li><strong>Switch</strong>: move entirely to an EN 16931 format, for instance XRechnung over the Peppol network. For partners with few invoices this is usually the simplest route.</li>
</ul>
<p>The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} names EDI procedures expressly as an admissible alternative, as long as the conditions are met. The administration keeps no list of recognised profiles; responsibility for transferability lies with the partners. So document how you checked it. An overview of the other formats is on ${h.a('formate', 'e-invoice formats compared')}.</p>
`,
  },
});
