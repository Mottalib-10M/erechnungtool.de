import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* E-Rechnung an den Bund : ERechV (§ 3 Abs. 3 Nr. 1 Direktauftrag, § 4 Format und Übermittlung über das Verwaltungsportal mit Nutzerkonto,
   § 5 weitere Angaben), Pflicht seit 27.11.2020 ; Kanäle und E-Mail-Regeln nach e-rechnung-bund.de (FAQ, E-Mail-Versand). */
const E = K.P.erechv;

export default defineGuide({
  id: 'bund', group: 'praxis', order: 33,
  tool: 'bund',
  related: ['leitweg', 'xrechnung', 'xrechnung-erstellen', 'per-email', 'xrechnung-oder-zugferd'],
  sources: ['erechv', 'erechnung-bund', 'erechnung-bund-faq', 'erechnung-bund-mail', 'richtlinie-2014-55'],
  de: {
    slug: 'e-rechnung-bund',
    nav: 'E-Rechnung an den Bund', card: 'Rechnungen an Bundesbehörden: Format, Leitweg-ID, Kanäle und Ausnahmen',
    title: 'E-Rechnung Bund 2026: Pflicht, Leitweg-ID und Kanäle',
    description: 'E-Rechnung Bund 2026: wann die E-Rechnungsverordnung gilt, welche Angaben dazugehören, welche Kanäle offenstehen und was bei Aufträgen bis 1.000 Euro gilt.',
    h1: 'XRechnung an den Bund: was Lieferanten wissen müssen',
    intro: 'Auftraggeber, Betrag und Vergabeart eingeben: Der Check sagt, ob eine E-Rechnung nach der E-Rechnungsverordnung nötig ist und welches Format passt.',
    resume: `Wer Bundesbehörden beliefert, muss seit dem ${displayDate(E.pflichtSeit, 'de-DE')} elektronisch abrechnen. Grundlage ist die E-Rechnungsverordnung des Bundes (ERechV), die die europäische Richtlinie 2014/55/EU umsetzt. Nach § 4 ERechV ist die Rechnung im Format XRechnung oder in einem anderen Format zu stellen, das der Norm EN 16931 entspricht, und über das Verwaltungsportal des Bundes zu übermitteln, wofür Rechnungssteller ein Nutzerkonto brauchen. Zugelassene Wege sind Weberfassung, Upload, Peppol und E-Mail. Neben den Angaben des Umsatzsteuerrechts verlangt § 5 ERechV die Leitweg-ID als Adresse der Rechnung, die Bankverbindung, die Zahlungsbedingungen und die E-Mail-Adresse des Rechnungsstellers. Ausgenommen sind nach § 3 Abs. 3 Nr. 1 ERechV Direktaufträge bis ${E.direktauftrag.toLocaleString('de-DE')} Euro. Für Länder und Kommunen gelten eigene Gesetze und Portale, die sich in Einzelheiten unterscheiden. Eine ZUGFeRD-Datei verarbeiten die Plattformen des Bundes nur im Profil XRECHNUNG; am sichersten ist die reine XRechnung.`,
    faqs: [
      { q: 'Gilt die E-Rechnungspflicht des Bundes auch für kleine Aufträge?', a: `Nicht für alle. Nach § 3 Abs. 3 Nr. 1 ERechV sind Rechnungen über Direktaufträge bis ${E.direktauftrag.toLocaleString('de-DE')} Euro ausgenommen, also kleine Beschaffungen ohne förmliches Vergabeverfahren. Oberhalb dieser Grenze und bei jedem anderen Auftrag des Bundes ist die E-Rechnung Pflicht, unabhängig von der Größe Ihres Unternehmens. Freiwillig dürfen Sie auch kleine Rechnungen elektronisch senden.` },
      { q: 'Kann ich eine Rechnung an den Bund per E-Mail schicken?', a: 'Ja, die E-Mail ist einer der zugelassenen Kanäle. Dabei gelten feste Regeln: eine Rechnung pro E-Mail, als Anhang nur die strukturierte Rechnungsdatei samt ihren Anlagen, keine reine PDF. Die Zieladresse und die technischen Vorgaben veröffentlicht der Betreiber der Plattform. Für den E-Mail-Weg brauchen Sie ebenfalls ein Nutzerkonto, in dem Ihre Absenderadresse hinterlegt ist.' },
      { q: 'Welche Angaben verlangt der Bund zusätzlich zum Umsatzsteuergesetz?', a: 'Nach § 5 ERechV die Leitweg-ID, die Bankverbindung, die Zahlungsbedingungen und die E-Mail-Adresse des Rechnungsstellers. Hat der Auftraggeber eine Lieferantennummer oder Bestellnummer mitgeteilt, gehören auch diese in die Rechnung. In der XRechnung sind die meisten dieser Angaben ohnehin Pflichtfelder, etwa Käuferreferenz, Kontaktdaten des Verkäufers und Zahlungsanweisungen.' },
      { q: 'Gilt die Verordnung des Bundes auch für Rechnungen an Städte?', a: 'Nein. Die ERechV gilt für Auftraggeber des Bundes. Länder, Städte, Gemeinden und Landkreise richten sich nach den Gesetzen und Verordnungen ihres Landes, die eigene Schwellen, Portale und Fristen vorsehen können. Fast überall wird die XRechnung angenommen, und eine Leitweg-ID ist üblich. Die genauen Vorgaben erfahren Sie vom jeweiligen Auftraggeber.' },
    ],
    body: (h) => `
<h2>Rechtsgrundlage und Geltungsbereich</h2>
<p>Die ${h.src('richtlinie-2014-55', 'Richtlinie 2014/55/EU')} verpflichtet öffentliche Auftraggeber in der EU, elektronische Rechnungen nach der europäischen Norm anzunehmen. Deutschland hat das für den Bund mit dem E-Rechnungsgesetz und der ${h.src('erechv', 'E-Rechnungsverordnung')} umgesetzt und ist dabei weiter gegangen: Lieferanten des Bundes müssen nicht nur dürfen, sondern elektronisch abrechnen. Seit dem ${h.day(E.pflichtSeit)} gilt das für alle Rechnungen an Bundesministerien, Bundesbehörden und andere Auftraggeber des Bundes, die nach Vergabe eines Auftrags gestellt werden.</p>
${h.table(['Frage', 'Regel', 'Fundstelle'], [
  ['Wer ist betroffen?', 'Rechnungssteller gegenüber Auftraggebern des Bundes', '§ 1, § 3 ERechV'],
  ['Ausnahme', `Direktaufträge bis ${h.eur(E.direktauftrag)}`, '§ 3 Abs. 3 Nr. 1 ERechV'],
  ['Format', 'XRechnung oder anderes Format nach EN 16931', '§ 4 Abs. 1 ERechV'],
  ['Übermittlung', 'Verwaltungsportal des Bundes, mit Nutzerkonto', '§ 4 ERechV'],
  ['Zusätzliche Angaben', 'Leitweg-ID, Bankverbindung, Zahlungsbedingungen, E-Mail', '§ 5 ERechV'],
], 'Die E-Rechnungsverordnung des Bundes in Kürze.', ['l', 'l', 'l'])}
<h2>Die vier Wege zur Plattform</h2>
<p>Die ${h.src('erechnung-bund', 'Rechnungseingangsplattformen des Bundes')} nehmen Rechnungen auf vier Wegen an: ${E.kanaele.join(', ')}. Bei der <strong>Weberfassung</strong> tippen Sie die Rechnung in ein Formular im Browser; das eignet sich für einzelne Rechnungen ohne eigene Software, braucht aber Zeit. Beim <strong>Upload</strong> laden Sie eine fertige XRechnung hoch, etwa aus dem ${h.a('xrechnung-erstellen', 'XRechnung-Ersteller')} oder Ihrem Buchhaltungsprogramm. <strong>Peppol</strong> ist ein europäisches Netz für den Austausch von E-Rechnungen; es lohnt sich für Unternehmen, die regelmäßig an öffentliche Auftraggeber in mehreren Ländern liefern, und setzt einen Zugangsdienstleister voraus. Die <strong>E-Mail</strong> ist der einfachste technische Weg, hat aber eigene Regeln.</p>
<p>Für die E-Mail gilt nach den ${h.src('erechnung-bund-mail', 'Vorgaben zum E-Mail-Versand')}: genau eine Rechnung pro Nachricht, als Anhang die strukturierte Rechnungsdatei und gegebenenfalls ihre Anlagen. Eine PDF ohne Daten wird nicht als Rechnung verarbeitet. Der Text der E-Mail wird nicht ausgewertet; was zählt, steht in der Datei. Mehr zur Übermittlung per E-Mail allgemein unter ${h.a('per-email', 'E-Rechnung per E-Mail')}.</p>
<h2>Welches Format der Bund annimmt</h2>
<p>Die XRechnung ist das Standardformat der Verwaltung, in der aktuellen Version ${K.P.standards.xrechnung}. Andere Formate nach EN 16931 sind nach der Verordnung zugelassen. Für ZUGFeRD heißt das nach den ${h.src('erechnung-bund-faq', 'Antworten der Plattformbetreiber')}: Verarbeitet wird nur das Profil XRECHNUNG, und maßgeblich sind die XML-Daten, nicht das Bild der PDF. Wer ohnehin eine ZUGFeRD-Rechnung im Profil EN 16931 erzeugt, erfüllt damit die deutschen Zusatzregeln nicht automatisch. Am wenigsten Rückfragen gibt es mit einer reinen XRechnung. Welches Format für welchen Empfänger passt, zeigt der kleine Rechner:</p>
${h.mini('wahl', { p: ['empf', 'mensch'], d: { empf: 'bund' }, c: 'Format für jeden Empfänger' })}
<h2>Die Leitweg-ID und weitere Pflichtangaben</h2>
<p>Ohne Leitweg-ID erreicht eine Rechnung die zuständige Stelle nicht. Sie steht in der XRechnung im Feld Käuferreferenz (BT-10) und als elektronische Adresse des Käufers mit dem Schema 0204. Prüfen Sie Aufbau und Prüfziffer vor dem Versand mit dem ${h.a('leitweg', 'Leitweg-ID-Prüfer')}. Hat der Auftraggeber eine Bestellnummer oder Lieferantennummer genannt, gehört auch sie in die Rechnung; die Bestellnummer steht im Feld BT-13. Dazu kommen die Kontaktdaten des Verkäufers mit Name, Telefon und E-Mail, die Bankverbindung und die Zahlungsbedingungen.</p>
<h2>Länder und Kommunen</h2>
<p>Für Rechnungen an Länder, Städte, Gemeinden und Landkreise gilt die Verordnung des Bundes nicht. Jedes Land hat eigene Vorschriften erlassen, mit teils anderen Schwellen, eigenen Portalen und unterschiedlichen Fristen. Gemeinsam ist fast allen, dass sie die XRechnung annehmen und mit Leitweg-IDs arbeiten, deren erste zwei Ziffern das Land bezeichnen. Die verbindlichen Vorgaben für einen Auftrag erfahren Sie vom Auftraggeber, am besten schon bei der Bestellung. Die Grundlagen des Formats erklärt ${h.a('xrechnung', 'XRechnung')}.</p>
`,
  },
  en: {
    slug: 'e-invoicing-federal-government',
    nav: 'E-invoicing the federal government', card: 'Invoices to federal authorities: format, Leitweg-ID, channels and exceptions',
    title: 'E-Invoicing Federal Government 2026: Rules and Channels',
    description: 'E-invoicing the federal government in 2026: when the German E-Invoicing Regulation applies, the details required, the channels and the rule up to 1,000 euros.',
    h1: 'E-invoicing the German federal government: what suppliers need to know',
    intro: 'Enter the contracting body, amount and type of award: the check says whether the E-Invoicing Regulation requires an e-invoice and which format fits.',
    resume: `Anyone supplying German federal authorities has had to invoice electronically since ${displayDate(E.pflichtSeit, 'en-GB')}. The legal basis is the federal E-Invoicing Regulation (ERechV), which implements the European Directive 2014/55/EU. Under section 4 ERechV the invoice must be issued as an XRechnung or in another format that complies with the standard EN 16931, and sent through the federal administration portal, for which invoice issuers need a user account. The permitted routes are web entry, upload, Peppol and email. On top of the VAT requirements, section 5 ERechV requires the Leitweg-ID as the invoice address, bank details, payment terms and the issuer's email address. Under section 3(3) no. 1 ERechV, direct awards up to ${E.direktauftrag.toLocaleString('en-GB')} euros are exempt. States and municipalities have their own laws and portals, which differ in detail. The federal platforms process a ZUGFeRD file only in the XRECHNUNG profile; a pure XRechnung is the safest choice.`,
    faqs: [
      { q: 'Does the federal e-invoicing duty apply to small orders?', a: `Not to all of them. Under section 3(3) no. 1 ERechV invoices for direct awards up to ${E.direktauftrag.toLocaleString('en-GB')} euros are exempt, meaning small purchases without a formal procurement procedure. Above that limit, and for any other federal contract, the e-invoice is mandatory regardless of the size of your business. You may still send small invoices electronically if you wish.` },
      { q: 'Can I email an invoice to the federal government?', a: 'Yes, email is one of the permitted channels. Fixed rules apply: one invoice per email, and as attachment only the structured invoice file with its supporting documents, never a plain PDF. The platform operator publishes the target address and technical requirements. The email route also needs a user account in which your sender address is registered.' },
      { q: 'Which details does the federal government require beyond VAT law?', a: 'Under section 5 ERechV the Leitweg-ID, bank details, payment terms and the issuer’s email address. If the contracting body has given you a supplier number or order number, those belong in the invoice too. In an XRechnung most of these details are mandatory fields anyway, such as the buyer reference, the seller contact and the payment instructions.' },
      { q: 'Does the federal regulation also cover invoices to cities?', a: 'No. The ERechV applies to federal contracting bodies. States, cities, municipalities and districts follow the laws and regulations of their state, which may set their own thresholds, portals and deadlines. Almost all accept XRechnung, and a Leitweg-ID is usual. The exact requirements come from the contracting body concerned.' },
    ],
    body: (h) => `
<h2>Legal basis and scope</h2>
<p>${h.src('richtlinie-2014-55', 'Directive 2014/55/EU')} obliges public contracting authorities in the EU to accept electronic invoices under the European standard. Germany implemented this for the federal level with the E-Invoicing Act and the ${h.src('erechv', 'E-Invoicing Regulation')}, and went further: federal suppliers are not just allowed but required to invoice electronically. Since ${h.day(E.pflichtSeit)} this has covered all invoices to federal ministries, federal authorities and other federal contracting bodies issued after a contract award.</p>
${h.table(['Question', 'Rule', 'Provision'], [
  ['Who is affected?', 'Invoice issuers dealing with federal contracting bodies', 'sections 1 and 3 ERechV'],
  ['Exception', `Direct awards up to ${h.eur(E.direktauftrag)}`, 'section 3(3) no. 1 ERechV'],
  ['Format', 'XRechnung or another EN 16931 format', 'section 4(1) ERechV'],
  ['Transmission', 'Federal administration portal, with user account', 'section 4 ERechV'],
  ['Extra details', 'Leitweg-ID, bank details, payment terms, email', 'section 5 ERechV'],
], 'The federal E-Invoicing Regulation in brief.', ['l', 'l', 'l'])}
<h2>Four routes to the platform</h2>
<p>The ${h.src('erechnung-bund', 'federal invoice receipt platforms')} accept invoices by four routes: ${E.kanaele.join(', ')}. With <strong>web entry</strong> you type the invoice into a browser form; that suits single invoices without software of your own but takes time. With <strong>upload</strong> you send a finished XRechnung, for example from the ${h.a('xrechnung-erstellen', 'XRechnung creator')} or your accounting software. <strong>Peppol</strong> is a European network for exchanging e-invoices; it pays off for businesses that regularly supply public bodies in several countries and requires an access provider. <strong>Email</strong> is the simplest route technically but has rules of its own.</p>
<p>Under the ${h.src('erechnung-bund-mail', 'rules for sending by email')}: exactly one invoice per message, with the structured invoice file and any supporting documents attached. A PDF without data is not processed as an invoice. The email text is not read; what counts is in the file. More on sending by email in general on ${h.a('per-email', 'sending e-invoices by email')}.</p>
<h2>Which format the federal government accepts</h2>
<p>XRechnung is the standard format of the administration, currently in version ${K.P.standards.xrechnung}. Other EN 16931 formats are allowed under the regulation. For ZUGFeRD, according to the ${h.src('erechnung-bund-faq', 'answers of the platform operators')}, only the XRECHNUNG profile is processed, and what counts is the XML data, not the picture in the PDF. A ZUGFeRD invoice in the EN 16931 profile does not automatically meet the extra German rules. A pure XRechnung leads to the fewest queries. The small calculator shows which format fits which recipient:</p>
${h.mini('wahl', { p: ['empf', 'mensch'], d: { empf: 'bund' }, c: 'Format for every recipient' })}
<h2>The Leitweg-ID and other mandatory details</h2>
<p>Without a Leitweg-ID an invoice does not reach the responsible office. In an XRechnung it sits in the buyer reference field (BT-10) and as the buyer’s electronic address with scheme 0204. Check its structure and check digits before sending with the ${h.a('leitweg', 'Leitweg-ID checker')}. If the contracting body named an order number or supplier number, it belongs in the invoice as well; the order number goes into field BT-13. Add the seller’s contact details with name, phone and email, the bank details and the payment terms.</p>
<h2>States and municipalities</h2>
<p>The federal regulation does not apply to invoices to states, cities, municipalities or districts. Each state has issued its own rules, with partly different thresholds, its own portals and different deadlines. What almost all have in common is that they accept XRechnung and work with Leitweg-IDs whose first two digits name the state. The binding requirements for a contract come from the contracting body, ideally when the order is placed. The basics of the format are explained on ${h.a('xrechnung', 'XRechnung')}.</p>
`,
  },
});
