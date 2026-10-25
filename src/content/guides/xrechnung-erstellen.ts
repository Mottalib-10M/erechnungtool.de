import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* XRechnung erzeugen : build.ts toUBL (XRechnung 3.0 UBL) und toCII(…, 'XRECHNUNG'). BR-DE-Regeln der KoSIT ; ERechV §§ 3–5 ; Leitweg-ID Schema 0204.
   KoSIT-Validator 1.6.3, Konfiguration XRechnung 3.0.2 : alle erzeugten Dateien (UBL und CII, 4 Fälle) « acceptable ». */
const S = K.P.standards, E = K.P.erechv;

export default defineGuide({
  id: 'xrechnung-erstellen', group: 'werkzeuge', order: 4,
  tool: 'creator', toolArg: { preset: 'xrechnung' },
  related: ['xrechnung', 'bund', 'leitweg', 'validator', 'erstellen', 'per-email'],
  sources: ['kosit-xrechnung', 'kosit-validator', 'erechv', 'erechnung-bund', 'leitweg-spec'],
  de: {
    slug: 'xrechnung-erstellen',
    nav: 'XRechnung erstellen', card: 'XRechnung 3.0 in UBL oder CII erzeugen, mit Leitweg-ID für Behörden',
    title: 'XRechnung erstellen kostenlos 2026: UBL oder CII, geprüft',
    description: 'XRechnung kostenlos erstellen 2026: Version 3.0 in UBL oder CII, mit Leitweg-ID für Behörden und allen BR-DE-Pflichtfeldern. Läuft im Browser, ohne Upload.',
    h1: 'XRechnung erstellen: kostenlos, mit allen deutschen Pflichtfeldern',
    intro: 'Daten eintragen, Leitweg-ID ergänzen, als UBL oder CII laden. Das Formular kennt die Zusatzregeln der XRechnung und meldet jede fehlende Angabe sofort.',
    resume: `Eine XRechnung ist die deutsche Ausprägung der europäischen Norm EN 16931: eine reine XML-Datei, die alle Pflichtangaben einer Rechnung in festen Feldern enthält und zusätzlich die nationalen Geschäftsregeln BR-DE der Koordinierungsstelle für IT-Standards erfüllt. Gültig ist derzeit die Version ${S.xrechnung}. Das Formular auf dieser Seite erzeugt eine solche Datei wahlweise in der Syntax UBL oder CII; beide sind gleichwertig und werden von Rechnungsportalen angenommen. Es verlangt die Angaben, an denen XRechnungen am häufigsten scheitern: die Käuferreferenz im Feld BT-10, bei Behörden die Leitweg-ID, die vollständige Anschrift des Verkäufers, einen Ansprechpartner mit Telefon und E-Mail sowie die Bankverbindung. Unsere erzeugten Dateien haben wir mit dem amtlichen Validator der KoSIT in der Konfiguration für XRechnung ${S.xrechnung} geprüft, und er hat alle als gültig angenommen. Für Aufträge des Bundes über ${K.P.erechv.direktauftrag} Euro ist die XRechnung oder ein anderes Format nach EN 16931 seit Jahren Pflicht. Die Datei entsteht in Ihrem Browser und wird nirgendwohin gesendet.`,
    faqs: [
      { q: 'Soll ich die XRechnung als UBL oder als CII herunterladen?', a: 'Inhaltlich sind beide gleich, denn die XRechnung legt die Daten fest, nicht die Syntax. UBL ist bei Behörden und im Peppol-Netz verbreitet, CII ist die Grundlage von ZUGFeRD. Verlangt Ihr Empfänger nichts Bestimmtes, nehmen Sie UBL. Die Plattformen des Bundes akzeptieren beide Varianten; im Zweifel fragen Sie den Rechnungsempfänger, was sein Programm am besten liest.' },
      { q: 'Was trage ich als Käuferreferenz ein, wenn der Kunde keine Behörde ist?', a: 'Die Regel BR-DE-15 verlangt in jeder XRechnung eine Käuferreferenz im Feld BT-10. Bei Behörden ist das die Leitweg-ID. Unternehmen nennen oft eine Bestell- oder Kostenstellennummer; fragen Sie danach. Gibt der Kunde nichts vor, setzt das Formular einen Bindestrich ein, den die Prüfregeln als Platzhalter akzeptieren. So bleibt die Datei gültig.' },
      { q: 'Warum verlangt die XRechnung Telefon und E-Mail des Verkäufers?', a: 'Die deutschen Regeln BR-DE-2 bis BR-DE-7 schreiben eine Kontaktgruppe des Verkäufers mit Name, Telefonnummer und E-Mail-Adresse vor. Der Rechnungsempfänger soll bei Rückfragen sofort eine Person erreichen. In einer ZUGFeRD-Rechnung nach EN 16931 sind diese Angaben freiwillig. Fehlt eine davon, zeigt das Formular das betroffene Feld rot an und sperrt den Download.' },
      { q: 'Kann ich die erzeugte XRechnung selbst noch einmal kontrollieren?', a: 'Ja. Öffnen Sie die heruntergeladene Datei im Viewer dieser Seite, dann sehen Sie sie als normale Rechnung mit allen Beträgen. Die Vorprüfung im Validator zeigt zusätzlich die geprüften Regeln. Wer ganz sichergehen will, lässt die Datei durch den Validator der KoSIT laufen, der kostenlos zum Herunterladen bereitsteht und auf dem eigenen Rechner arbeitet.' },
    ],
    body: (h) => `
<h2>Was eine XRechnung von anderen E-Rechnungen unterscheidet</h2>
<p>Jede XRechnung ist eine E-Rechnung nach EN 16931, aber nicht jede E-Rechnung ist eine XRechnung. Die ${h.src('kosit-xrechnung', 'Spezifikation der KoSIT')} schränkt die Norm für Deutschland ein: Manche Felder, die europaweit freiwillig sind, werden Pflicht, und einige Codelisten werden enger. Erkennbar ist eine XRechnung an der Kennung im Feld BT-24, die mit „urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0“ beginnt.</p>
${h.table(['Angabe', 'EN 16931 allgemein', 'XRechnung'], [
  ['Käuferreferenz BT-10', 'freiwillig', 'Pflicht (BR-DE-15)'],
  ['Kontakt des Verkäufers BG-6', 'freiwillig', 'Pflicht mit Name, Telefon, E-Mail'],
  ['Ort und PLZ des Verkäufers', 'freiwillig', 'Pflicht (BR-DE-3, BR-DE-4)'],
  ['Zahlungsanweisungen BG-16', 'freiwillig', 'Pflicht (BR-DE-1)'],
  ['Elektronische Adressen BT-34, BT-49', 'freiwillig', 'Pflicht für beide Seiten'],
], 'Felder, die eine XRechnung zusätzlich zur Norm verlangt.', ['l', 'l', 'l'])}
<p>Das Formular blendet diese Felder bei der Einstellung „XRechnung“ als Pflicht ein. Ihre E-Mail-Adresse dient zugleich als elektronische Adresse des Verkäufers; beim Empfänger tragen Sie dessen Rechnungsadresse oder bei einer Behörde die Leitweg-ID ein.</p>
<h2>XRechnung an eine Behörde</h2>
<p>Stellen Sie den Empfänger auf „Behörde“, erscheint statt der E-Mail des Kunden das Feld für die Leitweg-ID. Das Formular trägt sie zweimal ein: als Käuferreferenz in BT-10 und als elektronische Adresse des Käufers in BT-49 mit dem Schema 0204, wie es die Plattformen der Verwaltung erwarten. Eine Leitweg-ID mit falscher Prüfziffer wird sofort angezeigt, denn eine solche Rechnung kommt nicht an. Die Kennung erhalten Sie vom Auftraggeber, meist in der Bestellung.</p>
<p>Für die Bundesverwaltung gilt die ${h.src('erechv', 'E-Rechnungsverordnung')}. Sie verlangt eine Rechnung nach EN 16931, nennt die XRechnung als Standard und schreibt neben der Leitweg-ID die Bankverbindung, die Zahlungsbedingungen und die E-Mail-Adresse des Rechnungsstellers vor. Bei Direktaufträgen bis ${h.eur(E.direktauftrag)} netto entfällt die Pflicht. Ob Ihr Auftrag darunter fällt, zeigt der kurze Test:</p>
${h.mini('bund', { p: ['ag', 'betrag', 'direkt'], c: 'Regeln für öffentliche Auftraggeber' })}
<h2>Wie wir die erzeugten Dateien prüfen</h2>
<p>Die XML entsteht nach der Reihenfolge der Elemente, die das Schema vorgibt, damit auch strenge Prüfprogramme sie annehmen. Für die Methode haben wir vier typische Fälle erzeugt, je in UBL und CII: eine Dienstleistung mit zwei Steuersätzen, eine Kleinunternehmerrechnung, eine Bauleistung mit Reverse Charge und eine Rechnung an eine Bundesbehörde. Alle acht Dateien hat der ${h.src('kosit-validator', 'Validator der KoSIT')} mit der Empfehlung „annehmen“ bewertet. Zusätzlich liest der Viewer jede erzeugte Datei wieder ein, und die Beträge müssen mit dem Formular übereinstimmen.</p>
<h2>Versenden und Portale</h2>
<p>An Unternehmen schicken Sie die XRechnung als Anhang einer E-Mail. An den Bund geht sie über die Plattformen der Verwaltung, die ${h.src('erechnung-bund', 'Rechnungseingangsplattform')} nimmt Rechnungen per Upload, Weberfassung, Peppol oder E-Mail an. Per E-Mail gilt dort: eine Rechnung pro Nachricht, und nur die strukturierte Datei. Einzelheiten unter ${h.a('per-email', 'E-Rechnung per E-Mail')} und ${h.a('bund', 'E-Rechnung an den Bund')}. Zum Aufbau der Leitweg-ID gibt die ${h.src('leitweg-spec', 'Formatspezifikation')} Auskunft; den Prüfer finden Sie unter ${h.a('leitweg', 'Leitweg-ID')}.</p>
<h2>Häufige Stolpersteine</h2>
<p>Drei Fehler tauchen bei selbst erstellten XRechnungen immer wieder auf. Erstens eine Leitweg-ID mit vertauschten Ziffern; die Prüfziffer verrät das. Zweitens ein Ansprechpartner ohne Telefonnummer, weil das Feld auf Papierrechnungen selten vorkommt. Drittens eine Rechnungsnummer, die schon einmal verwendet wurde. Gegen die ersten beiden hilft das Formular; die Nummer müssen Sie selbst fortlaufend vergeben. Hintergrund zum Format selbst finden Sie unter ${h.a('xrechnung', 'XRechnung')}.</p>
`,
  },
  en: {
    slug: 'create-xrechnung',
    nav: 'Create an XRechnung', card: 'Generate XRechnung 3.0 in UBL or CII, with a Leitweg-ID for public bodies',
    title: 'Create XRechnung Free 2026: UBL or CII File, Pre-Checked',
    description: 'Create an XRechnung free in 2026: version 3.0 in UBL or CII, with the Leitweg-ID for public bodies and all BR-DE mandatory fields. In your browser, no upload.',
    h1: 'Create an XRechnung: free, with every German mandatory field',
    intro: 'Enter your data, add the Leitweg-ID, download as UBL or CII. The form knows the extra XRechnung rules and flags every missing detail at once.',
    resume: `An XRechnung is the German version of the European standard EN 16931: a pure XML file that holds every mandatory invoice detail in fixed fields and also meets the national BR-DE business rules of the German Coordination Office for IT Standards (KoSIT). The version currently in force is ${S.xrechnung}. The form on this page produces such a file in either UBL or CII syntax; both are equivalent and accepted by invoice portals. It asks for the details on which XRechnung files fail most often: the buyer reference in field BT-10, the Leitweg-ID for public bodies, the seller's full address, a contact person with phone and email, and the bank details. We checked our generated files with the official KoSIT validator in its configuration for XRechnung ${S.xrechnung}, and it accepted all of them. For federal contracts above ${K.P.erechv.direktauftrag} euros, XRechnung or another EN 16931 format has been mandatory for years. The file is built in your browser and sent nowhere.`,
    faqs: [
      { q: 'Should I download the XRechnung as UBL or as CII?', a: 'The content is the same, because XRechnung defines the data, not the syntax. UBL is common with public bodies and on the Peppol network, CII is the basis of ZUGFeRD. If your recipient asks for nothing specific, take UBL. The federal platforms accept both; if in doubt, ask the recipient which one their software reads best.' },
      { q: 'What goes in the buyer reference if the customer is a company?', a: 'Rule BR-DE-15 requires a buyer reference in field BT-10 of every XRechnung. For public bodies it is the Leitweg-ID. Companies often give an order or cost centre number, so ask for one. If the customer specifies nothing, the form inserts a hyphen, which the validation rules accept as a placeholder. The file stays valid that way.' },
      { q: 'Why does an XRechnung need the seller’s phone and email?', a: 'The German rules BR-DE-2 to BR-DE-7 require a seller contact group with name, phone number and email address. The recipient should be able to reach a person straight away if there is a question. In a ZUGFeRD invoice under EN 16931 these details are optional. If one is missing, the form marks the field red and locks the download.' },
      { q: 'Can I double-check the XRechnung I generated?', a: 'Yes. Open the downloaded file in this site’s viewer and you see it as a normal invoice with all amounts. The pre-check in the validator also lists the rules tested. If you want full certainty, run the file through the KoSIT validator, which is free to download and works on your own computer.' },
    ],
    body: (h) => `
<h2>How an XRechnung differs from other e-invoices</h2>
<p>Every XRechnung is an EN 16931 e-invoice, but not every e-invoice is an XRechnung. The ${h.src('kosit-xrechnung', 'KoSIT specification')} narrows the standard for Germany: some fields that are optional across Europe become mandatory, and some code lists get tighter. You recognise an XRechnung by the identifier in field BT-24, which begins with “urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0”.</p>
${h.table(['Detail', 'EN 16931 in general', 'XRechnung'], [
  ['Buyer reference BT-10', 'optional', 'mandatory (BR-DE-15)'],
  ['Seller contact BG-6', 'optional', 'mandatory with name, phone, email'],
  ['Seller city and postcode', 'optional', 'mandatory (BR-DE-3, BR-DE-4)'],
  ['Payment instructions BG-16', 'optional', 'mandatory (BR-DE-1)'],
  ['Electronic addresses BT-34, BT-49', 'optional', 'mandatory for both parties'],
], 'Fields an XRechnung requires on top of the standard.', ['l', 'l', 'l'])}
<p>With the “XRechnung” setting the form treats these fields as mandatory. Your email address also serves as the seller’s electronic address; for the recipient you enter their invoice address or, for a public body, the Leitweg-ID.</p>
<h2>XRechnung to a public body</h2>
<p>Set the recipient to “Authority” and the customer email field is replaced by one for the Leitweg-ID. The form enters it twice: as the buyer reference in BT-10 and as the buyer’s electronic address in BT-49 with scheme 0204, as the administration’s platforms expect. A Leitweg-ID with wrong check digits is flagged immediately, because such an invoice will not arrive. You get the ID from the contracting body, usually in the purchase order.</p>
<p>The federal administration is governed by the ${h.src('erechv', 'E-Invoicing Regulation (ERechV)')}. It requires an invoice under EN 16931, names XRechnung as the standard and, besides the Leitweg-ID, requires bank details, payment terms and the issuer’s email address. For direct awards up to ${h.eur(E.direktauftrag)} net the requirement does not apply. Whether your contract falls under it is shown by the quick test:</p>
${h.mini('bund', { p: ['ag', 'betrag', 'direkt'], c: 'Rules for public contracting bodies' })}
<h2>How we test the generated files</h2>
<p>The XML is written in the element order the schema prescribes, so that strict validators accept it too. For our method we generated four typical cases, each in UBL and CII: a service at two VAT rates, a small-business invoice, a construction service under the reverse charge and an invoice to a federal authority. The ${h.src('kosit-validator', 'KoSIT validator')} rated all eight files “accept”. On top of that the viewer reads every generated file back in, and the amounts must match the form.</p>
<h2>Sending and portals</h2>
<p>To businesses you send the XRechnung as an email attachment. To the federal government it goes through the administration’s platforms; the ${h.src('erechnung-bund', 'federal invoice receipt platform')} accepts invoices by upload, web entry, Peppol or email. By email the rule there is one invoice per message, structured file only. Details on ${h.a('per-email', 'sending e-invoices by email')} and ${h.a('bund', 'e-invoicing the federal government')}. The structure of the Leitweg-ID is set out in the ${h.src('leitweg-spec', 'format specification')}; the checker is on ${h.a('leitweg', 'Leitweg-ID')}.</p>
<h2>Common pitfalls</h2>
<p>Three mistakes keep turning up in self-made XRechnung files. First, a Leitweg-ID with swapped digits, which the check digits reveal. Second, a contact person without a phone number, because the field rarely appears on paper invoices. Third, an invoice number that has been used before. The form guards against the first two; you have to assign numbers consecutively yourself. Background on the format itself is on ${h.a('xrechnung', 'XRechnung')}.</p>
`,
  },
});
