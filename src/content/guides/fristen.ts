import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formatMoney, displayDate } from '../../lib/format';

/* Übergangsfristen : § 27 Abs. 38 Nr. 1 bis 3 UStG, Ausstellungsfrist § 14 Abs. 2 Satz 1 UStG, Zustimmung BMF-Schreiben vom 15.10.2025 Rn. 22. Maßgeblich ist das Jahr des Umsatzes, nicht das Rechnungsdatum. */
const PF = K.P.pflicht;

export default defineGuide({
  id: 'fristen', group: 'pflicht', order: 12,
  tool: 'fristen',
  related: ['pflicht', 'kleinunternehmer', 'edi', 'folgen', 'erstellen', 'xrechnung-oder-zugferd'],
  sources: ['ustg27', 'ustg14', 'ustg19', 'bmf-2025', 'bmf-faq'],
  de: {
    slug: 'e-rechnung-fristen',
    nav: 'Fristen und Übergang', card: 'Bis wann Papier und PDF noch erlaubt sind, Fall für Fall',
    title: 'E-Rechnung Fristen 2026: Übergangsfrist bis 2027 und 2028',
    description: 'E-Rechnung Fristen 2026: Übergangsfrist nach § 27 Abs. 38 UStG, was für Papier, PDF und EDI gilt, warum das Leistungsjahr zählt. Ihre Rechnung sofort prüfen.',
    h1: 'Fristen der E-Rechnung: welche Rechnung wann noch erlaubt ist',
    intro: 'Leistungsjahr, Rechnungsform und Vorjahresumsatz wählen: Der Rechner sagt, ob diese Rechnung zulässig ist und bis zu welchem Stichtag die Übergangsregel trägt.',
    resume: `Die Übergangsfrist der E-Rechnung steht in § 27 Abs. 38 UStG und hat drei Nummern. Nach Nummer 1 dürfen Sie für Umsätze bis zum ${displayDate(PF.papierBis, 'de-DE')} noch eine Papierrechnung oder, mit Zustimmung des Kunden, eine Rechnung in einem anderen elektronischen Format wie PDF ausstellen. Nummer 2 verlängert das für Umsätze des Jahres 2027, aber nur für Unternehmen, deren Gesamtumsatz im Vorjahr höchstens ${formatMoney(PF.umsatzgrenze, 0, 'de')} betrug. Nummer 3 erlaubt bis zum ${displayDate(PF.ediBis, 'de-DE')} Rechnungen über ein EDI-Verfahren, wenn der Empfänger zustimmt, auch wenn das Format nicht der Norm EN 16931 entspricht. Entscheidend ist in allen drei Fällen das Jahr, in dem die Leistung ausgeführt wurde, nicht das Datum der Rechnung. Eine Leistung vom Dezember 2026 darf also auch im Januar 2027 noch als PDF abgerechnet werden. Unabhängig davon gilt die allgemeine Ausstellungsfrist: Bei Leistungen an Unternehmer muss die Rechnung innerhalb von ${PF.ausstellungsfristMonate} Monaten nach der Leistung ausgestellt werden.`,
    faqs: [
      { q: 'Zählt für die Übergangsfrist das Rechnungsdatum oder das Leistungsdatum?', a: 'Das Leistungsdatum. § 27 Abs. 38 UStG knüpft an Umsätze an, die in einem bestimmten Zeitraum ausgeführt werden. Liefern Sie im Dezember 2026 und schreiben die Rechnung im Februar 2027, gilt noch die Regel für 2026, und die PDF bleibt mit Zustimmung erlaubt. Umgekehrt hilft ein frühes Rechnungsdatum nicht, wenn die Leistung erst im neuen Jahr erbracht wird.' },
      { q: 'Wie erteilt ein Kunde die Zustimmung zur PDF-Rechnung?', a: 'Eine besondere Form ist nicht vorgeschrieben. Das BMF-Schreiben vom 15. Oktober 2025 lässt in Randnummer 22 auch eine stillschweigende Zustimmung genügen, etwa wenn der Kunde PDF-Rechnungen wie bisher annimmt und bezahlt. Sicherer ist eine kurze schriftliche Vereinbarung, zum Beispiel in den Vertragsbedingungen oder per E-Mail, die Sie zu Ihren Unterlagen nehmen.' },
      { q: 'Wie lange habe ich Zeit, eine Rechnung auszustellen?', a: `Bei Leistungen an andere Unternehmer verlangt § 14 Abs. 2 UStG die Rechnung innerhalb von ${PF.ausstellungsfristMonate} Monaten nach Ausführung der Leistung. Diese Frist ist unabhängig von der Rechnungsform. Wer sie ausschöpft, kann eine Leistung vom Ende eines Übergangsjahres noch nach dem Stichtag abrechnen, denn für die erlaubte Form zählt das Jahr der Leistung.` },
      { q: 'Gilt die Umsatzgrenze von 2027 für jeden Kunden einzeln?', a: 'Nein. Gezählt wird der Gesamtumsatz des Rechnungsausstellers nach § 19 Abs. 3 UStG im Jahr 2026, über alle Kunden zusammen. Wer darunter bleibt, darf 2027 alle Rechnungen noch auf Papier oder mit Zustimmung als PDF schreiben. Der Umsatz des Kunden spielt keine Rolle, und auch nicht die Höhe der einzelnen Rechnung, abgesehen von den Kleinbetragsrechnungen.' },
    ],
    body: (h) => `
<h2>Die drei Nummern des Übergangs</h2>
<p>Die Fristen der E-Rechnung stehen nicht in § 14 UStG selbst, sondern in der Anwendungsvorschrift ${h.src('ustg27', '§ 27 Abs. 38 UStG')}. Sie erlaubt für eine begrenzte Zeit, von der neuen Regel abzuweichen. Jede der drei Nummern hat eigene Voraussetzungen:</p>
<ul>
<li><strong>Nummer 1</strong>: Umsätze bis ${h.day(PF.papierBis)}. Erlaubt sind Papier und, mit Zustimmung des Empfängers, ein anderes elektronisches Format wie PDF. Gilt für alle Unternehmen ohne Umsatzgrenze.</li>
<li><strong>Nummer 2</strong>: Umsätze im Jahr 2027. Dieselben Formen bleiben erlaubt, aber nur, wenn der Gesamtumsatz des Ausstellers im Vorjahr höchstens ${h.eur(PF.umsatzgrenze)} betrug.</li>
<li><strong>Nummer 3</strong>: Umsätze bis ${h.day(PF.ediBis)}. Erlaubt ist eine Rechnung im EDI-Verfahren mit Zustimmung des Empfängers, auch wenn die Daten nicht der Norm EN 16931 folgen. Mehr dazu unter ${h.a('edi', 'EDI-Rechnung')}.</li>
</ul>
<p>Danach bleibt nur die E-Rechnung, außer für die dauerhaften Ausnahmen wie Kleinbetragsrechnungen, Fahrausweise und Rechnungen von Kleinunternehmern. Eine E-Rechnung dürfen Sie in jedem Jahr schon freiwillig schicken; seit 2025 braucht sie keine Zustimmung mehr, weil jedes Unternehmen sie annehmen muss.</p>
<h2>Fünf typische Fälle</h2>
<p>Die Regeln wirken einfach, bis eine Leistung über den Jahreswechsel läuft. Diese Fälle zeigen, wie die Nummern zusammenspielen:</p>
<p><strong>Die Agentur mit großem Umsatz.</strong> Eine Werbeagentur lag 2026 deutlich über ${h.eur(PF.umsatzgrenze)}. Für Leistungen bis Ende 2026 schickt sie noch PDF-Rechnungen an Kunden, die zugestimmt haben. Für jede Leistung ab Januar 2027 muss sie eine E-Rechnung ausstellen, Nummer 2 hilft ihr nicht.</p>
<p><strong>Der Handwerksbetrieb unter der Grenze.</strong> Ein Malerbetrieb blieb 2026 unter ${h.eur(PF.umsatzgrenze)}. Er darf das ganze Jahr 2027 noch Papierrechnungen oder, mit Zustimmung, PDF-Rechnungen schreiben. Ab Januar 2028 gilt auch für ihn die E-Rechnung.</p>
<p><strong>Die Leistung im Dezember.</strong> Ein Berater beendet ein Projekt am 15. Dezember 2026 und rechnet im Januar 2027 ab. Maßgeblich ist das Leistungsjahr 2026, also Nummer 1: Die PDF bleibt erlaubt, auch wenn sein Umsatz über der Grenze liegt.</p>
<p><strong>Der Großhändler mit EDI.</strong> Ein Großhändler tauscht seit Jahren EDIFACT-Nachrichten mit einer Handelskette aus. Mit deren Zustimmung darf er das bis Ende 2027 fortsetzen, unabhängig von seinem Umsatz. Ab 2028 muss sein EDI-Format die Angaben der EN 16931 vollständig abbilden können, oder er wechselt zu XRechnung oder ZUGFeRD.</p>
<p><strong>Die Bewirtung für 180 Euro.</strong> Eine Gaststätte stellt einem Firmenkunden einen Beleg über einen Betrag unter der Kleinbetragsgrenze aus. Für Kleinbetragsrechnungen gibt es keine Frist, sie dürfen dauerhaft auf Papier oder als PDF bleiben.</p>
<h2>Wann die Grenze von ${h.eur(PF.umsatzgrenze)} zählt</h2>
<p>Die Grenze bezieht sich auf den Gesamtumsatz im Sinne von ${h.src('ustg19', '§ 19 Abs. 3 UStG')}, nicht auf den Gewinn und nicht auf den Umsatz mit einem einzelnen Kunden. Für die Rechnungen des Jahres 2027 ist allein das Jahr 2026 maßgeblich. Wer 2026 neu gegründet hat, zählt den tatsächlichen Umsatz dieses Rumpfjahres. Ob Ihr Unternehmen überhaupt unter die Pflicht fällt, prüft der allgemeine Check:</p>
${h.mini('pflicht', { p: ['kunden', 'umsatz'], c: 'E-Rechnungspflicht vollständig prüfen' })}
<h2>Ausstellungsfrist und Berichtigung</h2>
<p>Neben den Übergangsfristen gilt die allgemeine Frist aus ${h.src('ustg14', '§ 14 Abs. 2 UStG')}: Rechnungen an Unternehmer sind innerhalb von ${h.n(PF.ausstellungsfristMonate)} Monaten nach der Leistung auszustellen. Das ist keine Frist für die E-Rechnung, aber sie erklärt, warum am Jahreswechsel Leistungen des alten Jahres noch im neuen abgerechnet werden. Eine Berichtigung als E-Rechnung ist immer möglich. Was bei einer falschen Form droht, erklärt ${h.a('folgen', 'Folgen einer fehlenden E-Rechnung')}.</p>
<p>Die Zustimmung zur PDF müssen Sie nicht für jede Rechnung neu einholen. Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} lässt eine Vereinbarung oder ein stillschweigendes Einverständnis genügen. Wer bereits jetzt umstellt, spart sich die Doppelarbeit im Jahr 2027: Der ${h.a('erstellen', 'Rechnungsersteller')} erzeugt E-Rechnungen ohne eigene Software.</p>
`,
  },
  en: {
    slug: 'e-invoice-deadlines',
    nav: 'Deadlines and transition', card: 'Until when paper and PDF are still allowed, case by case',
    title: 'E-Invoice Deadlines Germany 2026: Transition to 2027, 2028',
    description: 'German e-invoicing deadlines 2026: the transition under section 27(38) UStG for paper, PDF and EDI, and why the year of supply counts. Check your invoice now.',
    h1: 'E-invoicing deadlines: which invoice is still allowed when',
    intro: 'Choose the year of supply, the invoice form and last year’s turnover: the calculator says whether this invoice is allowed and until which date the transition covers it.',
    resume: `The transition period for German e-invoicing is set out in section 27(38) of the VAT Act (UStG) and has three numbers. Under number 1 you may still issue a paper invoice for supplies up to ${displayDate(PF.papierBis, 'en-GB')} or, with the customer's consent, an invoice in another electronic format such as PDF. Number 2 extends this to supplies made in 2027, but only for businesses whose total turnover in the previous year was no more than ${formatMoney(PF.umsatzgrenze, 0, 'en')}. Number 3 allows invoices via an EDI procedure until ${displayDate(PF.ediBis, 'en-GB')} if the recipient agrees, even where the format does not follow the EN 16931 standard. In all three cases what counts is the year in which the supply was made, not the invoice date. A supply made in December 2026 may therefore still be invoiced as a PDF in January 2027. The general invoicing deadline applies regardless: for supplies to businesses, the invoice must be issued within ${PF.ausstellungsfristMonate} months of the supply.`,
    faqs: [
      { q: 'Does the transition depend on the invoice date or the supply date?', a: 'On the supply date. Section 27(38) UStG refers to supplies made within a given period. If you deliver in December 2026 and invoice in February 2027, the 2026 rule still applies and a PDF remains allowed with consent. Conversely, an early invoice date does not help if the supply is only made in the new year.' },
      { q: 'How does a customer consent to PDF invoices?', a: 'No particular form is required. Paragraph 22 of the Finance Ministry letter of 15 October 2025 accepts tacit consent, for example when the customer keeps accepting and paying PDF invoices as before. A short written agreement is safer, for instance in your terms and conditions or by email, which you then file with your records.' },
      { q: 'How long do I have to issue an invoice in Germany?', a: `For supplies to other businesses, section 14(2) UStG requires the invoice within ${PF.ausstellungsfristMonate} months of the supply. This deadline does not depend on the invoice form. Using it, you can invoice a supply made at the end of a transition year after the cut-off date, because the year of supply decides which form is allowed.` },
      { q: 'Does the 2027 turnover threshold apply per customer?', a: 'No. What counts is the issuer’s total turnover under section 19(3) UStG in 2026, across all customers. Businesses below it may write all 2027 invoices on paper or, with consent, as PDF. The customer’s turnover is irrelevant, and so is the size of the individual invoice, apart from small-amount invoices.' },
    ],
    body: (h) => `
<h2>The three numbers of the transition</h2>
<p>The e-invoicing deadlines are not in section 14 UStG itself but in the application rule ${h.src('ustg27', 'section 27(38) UStG')}. It allows a departure from the new rule for a limited time. Each of its three numbers has its own conditions:</p>
<ul>
<li><strong>Number 1</strong>: supplies up to ${h.day(PF.papierBis)}. Paper is allowed and, with the recipient’s consent, another electronic format such as PDF. It applies to every business, with no turnover limit.</li>
<li><strong>Number 2</strong>: supplies in 2027. The same forms remain allowed, but only if the issuer’s total turnover in the previous year was no more than ${h.eur(PF.umsatzgrenze)}.</li>
<li><strong>Number 3</strong>: supplies up to ${h.day(PF.ediBis)}. An invoice by EDI is allowed with the recipient’s consent, even if the data does not follow EN 16931. More on ${h.a('edi', 'EDI invoicing')}.</li>
</ul>
<p>After that only the e-invoice remains, except for the permanent exceptions such as small-amount invoices, travel tickets and invoices from small businesses. You may send an e-invoice voluntarily in any year; since 2025 it no longer needs consent, because every business must accept it.</p>
<h2>Five typical cases</h2>
<p>The rules look simple until a supply runs across the turn of the year. These cases show how the numbers work together:</p>
<p><strong>The agency with high turnover.</strong> An advertising agency was well above ${h.eur(PF.umsatzgrenze)} in 2026. For supplies until the end of 2026 it still sends PDF invoices to customers who have agreed. For every supply from January 2027 it must issue an e-invoice; number 2 does not help it.</p>
<p><strong>The trade business below the limit.</strong> A painting firm stayed below ${h.eur(PF.umsatzgrenze)} in 2026. Throughout 2027 it may still write paper invoices or, with consent, PDF invoices. From January 2028 the e-invoice applies to it as well.</p>
<p><strong>The supply in December.</strong> A consultant finishes a project on 15 December 2026 and invoices in January 2027. The year of supply, 2026, decides, so number 1 applies: the PDF stays allowed, even though the consultant’s turnover is above the limit.</p>
<p><strong>The wholesaler on EDI.</strong> A wholesaler has exchanged EDIFACT messages with a retail chain for years. With the chain’s consent it may carry on until the end of 2027, whatever its turnover. From 2028 its EDI format must be able to map the EN 16931 data completely, or it switches to XRechnung or ZUGFeRD.</p>
<p><strong>The business lunch for 180 euros.</strong> A restaurant gives a business customer a receipt for an amount below the small-amount limit. Small-amount invoices have no deadline; they may stay on paper or PDF permanently.</p>
<h2>When the ${h.eur(PF.umsatzgrenze)} threshold counts</h2>
<p>The limit refers to total turnover within the meaning of ${h.src('ustg19', 'section 19(3) UStG')}, not to profit and not to the turnover with a single customer. For invoices of 2027 only the year 2026 matters. A business founded during 2026 counts the actual turnover of that short year. Whether your business falls under the mandate at all is what the general check tests:</p>
${h.mini('pflicht', { p: ['kunden', 'umsatz'], c: 'Run the full mandate check' })}
<h2>Invoicing deadline and corrections</h2>
<p>Besides the transition periods, the general deadline in ${h.src('ustg14', 'section 14(2) UStG')} applies: invoices to businesses must be issued within ${h.n(PF.ausstellungsfristMonate)} months of the supply. It is not an e-invoicing deadline, but it explains why supplies of the old year are still invoiced in the new one around the turn of the year. A correction can always be made as an e-invoice. What a wrong form can lead to is explained on ${h.a('folgen', 'consequences of a missing e-invoice')}.</p>
<p>You need not obtain consent to the PDF for every single invoice. The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} accepts an agreement or tacit acceptance. Switching now saves duplicate work in 2027: the ${h.a('erstellen', 'invoice creator')} produces e-invoices without software of your own.</p>
`,
  },
});
