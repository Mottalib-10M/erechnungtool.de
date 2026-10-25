import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formatMoney } from '../../lib/format';

/* Kleinunternehmer : § 19 Abs. 1 UStG (Fassung ab 2025), § 34a Satz 4 UStDV, BMF-Schreiben vom 15.10.2025 Rn. 22, BMF-FAQ (Empfang per E-Mail-Postfach), Geschäftsregel BR-CO-26 der EN 16931. */
const KU = K.P.kleinunternehmer, PF = K.P.pflicht;
const de = (x: number) => formatMoney(x, 0, 'de'), en = (x: number) => formatMoney(x, 0, 'en');

export default defineGuide({
  id: 'kleinunternehmer', group: 'pflicht', order: 11,
  tool: 'klein',
  related: ['pflicht', 'empfangen', 'erstellen', 'fristen', 'oeffnen', 'archivieren'],
  sources: ['ustg19', 'ustdv34a', 'bmf-2025', 'bmf-faq', 'ustg14'],
  de: {
    slug: 'e-rechnung-kleinunternehmer',
    nav: 'E-Rechnung für Kleinunternehmer', card: 'Was § 19 UStG beim Empfangen und Ausstellen ändert',
    title: 'E-Rechnung Kleinunternehmer 2026: was Sie wirklich müssen',
    description: 'E-Rechnung für Kleinunternehmer 2026: Empfang ist Pflicht, Ausstellen nicht. Umsatzgrenzen nach § 19 UStG prüfen und freiwillige E-Rechnung richtig ausfüllen.',
    h1: 'E-Rechnung für Kleinunternehmer: Empfang ja, Ausstellen freiwillig',
    intro: 'Umsatz des Vorjahres und des laufenden Jahres eingeben: Der Rechner zeigt, ob die Kleinunternehmerregelung greift und welche Pflichten bei der E-Rechnung bleiben.',
    resume: `Für Kleinunternehmer teilt sich die E-Rechnungspflicht in zwei Hälften. Empfangen müssen auch sie seit dem 1. Januar 2025 jede E-Rechnung, die ein inländischer Lieferant schickt; dafür genügt ein E-Mail-Postfach und ein Programm oder Viewer, der die XML lesbar macht. Ausstellen müssen sie keine: Nach § 34a Satz 4 UStDV dürfen Kleinunternehmer ihre Rechnungen immer als sonstige Rechnung schreiben, also auf Papier oder als PDF, auch nach 2027. Kleinunternehmer ist seit 2025, wer im Vorjahr höchstens ${de(KU.vorjahr)} Gesamtumsatz hatte und im laufenden Jahr ${de(KU.laufend)} nicht überschreitet; wird diese zweite Grenze überschritten, endet die Regelung schon mit dem Umsatz, der sie reißt. Wer freiwillig eine XRechnung oder ZUGFeRD-Rechnung ausstellt, weist keine Steuer aus, verwendet die Steuerkategorie E mit einem Befreiungsgrund und gibt die Steuernummer als Kennung an, wenn keine USt-IdNr. vorhanden ist. Rechnungen, die Sie bekommen, bewahren Sie im Original-XML acht Jahre auf.`,
    faqs: [
      { q: 'Darf ich als Kleinunternehmer freiwillig eine XRechnung schicken?', a: 'Ja. Die Ausnahme in § 34a UStDV erlaubt Ihnen die sonstige Rechnung, sie verbietet die E-Rechnung nicht. Wichtig ist, dass die Datei keine Umsatzsteuer ausweist: Jede Position bekommt die Kategorie E, und im Feld für den Befreiungsgrund steht der Hinweis auf § 19 UStG. Der Ersteller auf dieser Seite setzt beides automatisch, wenn Sie oben § 19 wählen.' },
      { q: 'Welche Kennung gebe ich ohne USt-IdNr. in der E-Rechnung an?', a: 'Die Norm EN 16931 verlangt mit der Regel BR-CO-26 mindestens eine Kennung des Verkäufers: eine USt-IdNr., eine Registernummer oder eine andere Kennung. Viele Kleinunternehmer haben keine USt-IdNr. Dann tragen Sie die Steuernummer des Finanzamts ein; in der XRechnung erscheint sie zusätzlich als Steuernummer im eigenen Feld. Ohne jede Kennung lehnt der Validator der KoSIT die Datei ab.' },
      { q: 'Was passiert mit der E-Rechnung, wenn ich die Umsatzgrenze überschreite?', a: `Überschreitet Ihr Umsatz im laufenden Jahr ${de(KU.laufend)}, gilt ab diesem Umsatz die Regelbesteuerung. Sie weisen dann Umsatzsteuer aus und fallen unter die normalen Fristen der E-Rechnung, also Ausstellen spätestens ab 2028 oder ab 2027 bei mehr als ${de(PF.umsatzgrenze)} Vorjahresumsatz. Für das Jahr danach zählt der Vorjahresumsatz neu.` },
      { q: 'Muss ich als Kleinunternehmer eine Software für E-Rechnungen kaufen?', a: 'Nein. Für den Empfang reicht nach Auskunft des Bundesfinanzministeriums ein E-Mail-Postfach. Lesen können Sie XRechnung und ZUGFeRD kostenlos, etwa mit dem Viewer dieser Seite, der die Datei im Browser öffnet und nichts hochlädt. Wichtig ist nur die Ablage: Die XML-Datei muss unverändert und auffindbar aufbewahrt werden, ein Ausdruck allein genügt nicht.' },
    ],
    body: (h) => `
<h2>Wer Kleinunternehmer ist</h2>
<p>Die Kleinunternehmerregelung steht in ${h.src('ustg19', '§ 19 UStG')} und wurde zum 1. Januar 2025 neu gefasst. Seitdem gelten zwei Grenzen für den Gesamtumsatz: höchstens ${h.eur(KU.vorjahr)} im vorangegangenen Kalenderjahr und höchstens ${h.eur(KU.laufend)} im laufenden Jahr. Die zweite Grenze ist keine Prognose mehr wie früher, sondern wirkt sofort: Der Umsatz, mit dem Sie sie überschreiten, unterliegt schon der Regelbesteuerung. Wer die Regelung nutzt, weist keine Umsatzsteuer aus und zieht keine Vorsteuer ab.</p>
<p>Für die E-Rechnung hat das eine praktische Folge. Ihre Kunden können aus Ihren Rechnungen keine Vorsteuer ziehen, weil keine Steuer darin steht. Deshalb hat der Verordnungsgeber Kleinunternehmer vom Ausstellen ausgenommen: Die Form ihrer Rechnung spielt für den Vorsteuerabzug des Empfängers keine Rolle.</p>
<h2>Empfangen: die Pflicht gilt auch für Sie</h2>
<p>Die Empfangspflicht kennt keine Ausnahme nach Größe. Das ${h.src('bmf-2025', 'BMF-Schreiben vom 15. Oktober 2025')} nennt Kleinunternehmer ausdrücklich als Empfänger, die eine E-Rechnung annehmen müssen. Das klingt aufwendiger, als es ist. Laut ${h.src('bmf-faq', 'FAQ des Bundesfinanzministeriums')} genügt ein E-Mail-Postfach, an das Lieferanten die Dateien schicken. Was Sie zusätzlich brauchen, ist ein Weg, die XML zu lesen, und eine Ablage, die sie unverändert hält. Wie bereit Sie sind, zeigt die kurze Liste:</p>
${h.mini('empfang', { p: ['postfach', 'lesen'], c: 'Alle vier Punkte prüfen' })}
<p>Typische Lieferanten, von denen Kleinunternehmer schon heute E-Rechnungen bekommen, sind Telefon- und Internetanbieter, Großhändler und Plattformen. Kommt eine reine XML-Datei, öffnen Sie sie im ${h.a('oeffnen', 'Viewer')} und speichern sie danach als Original ab. Eine ZUGFeRD-Rechnung sieht aus wie eine normale PDF; auch hier ist die eingebettete XML der maßgebliche Teil.</p>
<h2>Ausstellen: freiwillig, aber dann richtig</h2>
<p>Nach ${h.src('ustdv34a', '§ 34a Satz 4 UStDV')} dürfen Kleinunternehmer immer eine sonstige Rechnung ausstellen. Diese Erlaubnis läuft nicht aus, sie gilt auch nach 2027 und nach 2028. Eine elektronische sonstige Rechnung, etwa eine PDF per E-Mail, braucht wie jede andere die Zustimmung des Empfängers; das BMF-Schreiben lässt in Randnummer 22 auch eine stillschweigende Zustimmung genügen, etwa wenn der Kunde die PDF widerspruchslos bezahlt.</p>
<p>Manche Kunden bitten dennoch um eine E-Rechnung, weil ihre Buchhaltung nur noch XML verarbeitet. Dann gelten für die Datei dieselben Regeln wie für alle anderen, mit drei Besonderheiten:</p>
<ul>
<li><strong>Steuerkategorie E</strong> für jede Position, Steuersatz 0 % und keine Steuersumme.</li>
<li><strong>Befreiungsgrund</strong> im Feld BT-120, etwa „Steuerbefreit als Kleinunternehmer nach § 19 Abs. 1 UStG“. Ohne ihn meldet die Prüfung den Fehler BR-E-10.</li>
<li><strong>Kennung des Verkäufers</strong>: Fehlt eine USt-IdNr., tragen Sie die Steuernummer ein, sonst verletzt die Datei die Regel BR-CO-26.</li>
</ul>
<p>Der ${h.a('erstellen', 'Rechnungsersteller')} kennt diesen Fall: Wählen Sie bei der Umsatzsteuer „§ 19“, und er setzt Kategorie, Befreiungsgrund und Kennung selbst. Die erzeugte Datei haben wir mit dem Validator der KoSIT geprüft.</p>
<h2>Wenn aus dem Kleinunternehmen ein normales wird</h2>
<p>Wachsen Sie über die Grenze, wechseln Sie in die Regelbesteuerung und damit in den normalen Fahrplan der E-Rechnung. Wer im laufenden Jahr ${h.eur(KU.laufend)} überschreitet, muss ab diesem Umsatz Steuer ausweisen; ob die Rechnung dann schon elektronisch sein muss, hängt vom Jahr ab. Im Jahr 2026 dürfen alle noch Papier oder PDF verwenden, 2027 alle mit höchstens ${h.eur(PF.umsatzgrenze)} Vorjahresumsatz, ab ${h.day(PF.ausstellenAbKlein)} niemand mehr. Die Einzelheiten stehen unter ${h.a('fristen', 'Fristen der E-Rechnung')}.</p>
<p>Planen Sie den Wechsel rechtzeitig: Ein Rechnungsprogramm, das XRechnung oder ZUGFeRD erzeugt, kostet Zeit bei der Einrichtung. Für die ersten Rechnungen genügt der kostenlose Ersteller, der nichts speichert und keine Daten überträgt.</p>
`,
  },
  en: {
    slug: 'small-business-e-invoice',
    nav: 'E-invoicing for small businesses', card: 'What section 19 UStG changes for receiving and issuing',
    title: 'Small Business E-Invoice Germany 2026: What You Must Do',
    description: 'E-invoicing for German small businesses in 2026: receiving is required, issuing is not. Check the section 19 thresholds and fill in a voluntary e-invoice right.',
    h1: 'E-invoicing for small businesses: receive yes, issue optional',
    intro: 'Enter last year’s and this year’s turnover: the calculator shows whether the small-business scheme applies and which e-invoicing duties remain.',
    resume: `For small businesses under the German scheme (Kleinunternehmer), the e-invoicing mandate splits in two. Like everyone else, they have had to receive every e-invoice a domestic supplier sends since 1 January 2025; an email inbox and a program or viewer that makes the XML readable are enough. They never have to issue one: under section 34a sentence 4 of the VAT implementing regulation (UStDV), small businesses may always write an ordinary invoice, on paper or as a PDF, after 2027 too. Since 2025 a small business is one whose total turnover was no more than ${en(KU.vorjahr)} in the previous year and does not exceed ${en(KU.laufend)} in the current year; once that second limit is crossed, the scheme ends with the very supply that crosses it. Anyone who voluntarily issues an XRechnung or ZUGFeRD invoice shows no VAT, uses VAT category E with an exemption reason and gives the tax number as identifier if there is no VAT ID. Invoices you receive are kept in their original XML for eight years.`,
    faqs: [
      { q: 'May a small business send an XRechnung voluntarily?', a: 'Yes. The exception in section 34a UStDV allows the ordinary invoice; it does not forbid the e-invoice. What matters is that the file shows no VAT: every line gets category E, and the exemption reason field refers to section 19 UStG. The creator on this site sets both automatically when you choose section 19 at the top.' },
      { q: 'Which identifier goes into the e-invoice without a VAT ID?', a: 'EN 16931 requires at least one seller identifier under rule BR-CO-26: a VAT ID, a register number or another identifier. Many small businesses have no VAT ID. In that case enter the tax number issued by your tax office; in an XRechnung it also appears in its own tax number field. Without any identifier the KoSIT validator rejects the file.' },
      { q: 'What changes for e-invoices once I cross the turnover limit?', a: `If your turnover this year exceeds ${en(KU.laufend)}, standard VAT applies from that supply on. You then show VAT and fall under the normal e-invoicing deadlines, meaning issuing from 2028 at the latest, or from 2027 if prior-year turnover was above ${en(PF.umsatzgrenze)}. For the following year the previous year’s turnover is assessed afresh.` },
      { q: 'Does a small business need to buy e-invoicing software?', a: 'No. According to the Federal Ministry of Finance an email inbox is enough to receive. You can read XRechnung and ZUGFeRD for free, for instance with this site’s viewer, which opens the file in your browser and uploads nothing. What matters is storage: the XML file must be kept unchanged and retrievable, and a printout alone is not enough.' },
    ],
    body: (h) => `
<h2>Who counts as a small business</h2>
<p>The small-business scheme is set out in ${h.src('ustg19', 'section 19 UStG')} and was rewritten with effect from 1 January 2025. Since then there are two limits on total turnover: no more than ${h.eur(KU.vorjahr)} in the previous calendar year and no more than ${h.eur(KU.laufend)} in the current year. The second limit is no longer a forecast as it used to be; it bites immediately, and the supply that crosses it is already taxed normally. Businesses using the scheme charge no VAT and deduct no input VAT.</p>
<p>For e-invoicing this has a practical consequence. Your customers cannot reclaim input VAT from your invoices, because there is no VAT on them. That is why the regulation exempts small businesses from issuing: the form of their invoice makes no difference to the recipient’s deduction.</p>
<h2>Receiving: the duty applies to you too</h2>
<p>The duty to receive has no size exemption. The ${h.src('bmf-2025', 'Finance Ministry letter of 15 October 2025')} names small businesses expressly as recipients who must accept an e-invoice. It sounds more demanding than it is. According to the ${h.src('bmf-faq', 'ministry’s FAQ')} an email inbox that suppliers send the files to is enough. What you also need is a way to read the XML and storage that keeps it unchanged. The short list shows how ready you are:</p>
${h.mini('empfang', { p: ['postfach', 'lesen'], c: 'Check all four points' })}
<p>Suppliers that already send small businesses e-invoices are typically phone and internet providers, wholesalers and platforms. If a pure XML file arrives, open it in the ${h.a('oeffnen', 'viewer')} and then save it as the original. A ZUGFeRD invoice looks like a normal PDF; here too the embedded XML is the part that counts.</p>
<h2>Issuing: optional, but then done properly</h2>
<p>Under ${h.src('ustdv34a', 'section 34a sentence 4 UStDV')} small businesses may always issue an ordinary invoice. This permission does not expire; it holds after 2027 and after 2028. An electronic ordinary invoice, such as a PDF by email, needs the recipient’s consent like any other; paragraph 22 of the ministry letter accepts tacit consent, for example when the customer pays the PDF without objecting.</p>
<p>Some customers still ask for an e-invoice because their accounting only processes XML. The file then follows the same rules as any other, with three particular points:</p>
<ul>
<li><strong>VAT category E</strong> on every line, a zero rate and no VAT total.</li>
<li><strong>Exemption reason</strong> in field BT-120, such as “Exempt as a small business under section 19(1) UStG”. Without it the check reports error BR-E-10.</li>
<li><strong>Seller identifier</strong>: if there is no VAT ID, enter the tax number, otherwise the file breaks rule BR-CO-26.</li>
</ul>
<p>The ${h.a('erstellen', 'invoice creator')} handles this case: choose “Sec. 19” under VAT and it sets the category, the exemption reason and the identifier itself. We checked the resulting file with the KoSIT validator.</p>
<h2>When the small business becomes a normal one</h2>
<p>If you grow beyond the limit, you move to standard taxation and thus onto the normal e-invoicing timetable. Exceed ${h.eur(KU.laufend)} in the current year and you must show VAT from that supply on; whether the invoice must already be electronic depends on the year. In 2026 everyone may still use paper or PDF, in 2027 everyone with prior-year turnover of no more than ${h.eur(PF.umsatzgrenze)}, and from ${h.day(PF.ausstellenAbKlein)} nobody. The details are on ${h.a('fristen', 'e-invoicing deadlines')}.</p>
<p>Plan the switch in time: setting up invoicing software that produces XRechnung or ZUGFeRD takes a while. For the first invoices the free creator is enough; it stores nothing and transmits no data.</p>
`,
  },
});
