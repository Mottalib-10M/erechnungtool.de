import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Ersteller : components/erech/Creator.tsx. Pflichtangaben § 14 Abs. 4 UStG ; Kleinunternehmer § 19 UStG / § 34a UStDV ; Reverse Charge § 13b, Hinweis § 14a Abs. 5 UStG.
   Startwerte = beispiel('standard') : Summe erfundener Daten, berechnet mit computeTotals. */
const PF = K.P.pflicht, ST = K.P.steuer;
const B = K.beispiel('standard', 'de'), BE = K.beispiel('standard', 'en');

export default defineGuide({
  id: 'erstellen', group: 'werkzeuge', order: 3,
  tool: 'creator', toolArg: { preset: 'zugferd' },
  related: ['xrechnung-erstellen', 'zugferd-erstellen', 'xrechnung-oder-zugferd', 'en-16931', 'validator', 'kleinunternehmer'],
  sources: ['ustg14', 'ustg19', 'ustdv34a', 'ustg27', 'ustg14b'],
  de: {
    slug: 'e-rechnung-erstellen',
    nav: 'E-Rechnung erstellen', card: 'Kostenlos eine ZUGFeRD-PDF oder XRechnung aus einem Formular erzeugen',
    title: 'E-Rechnung erstellen kostenlos 2026: ohne Software, online',
    description: 'E-Rechnung kostenlos erstellen 2026: Formular ausfüllen, Summen werden gerechnet, Pflichtangaben geprüft, Download als ZUGFeRD-PDF oder XRechnung. Ohne Konto.',
    h1: 'E-Rechnung erstellen: kostenlos, ohne Konto, im Browser',
    intro: 'Format wählen, Daten eintragen, herunterladen. Netto, Steuer und Brutto rechnet das Formular selbst, und der Download bleibt gesperrt, bis alle Pflichtangaben stimmen.',
    resume: `Mit dem Formular auf dieser Seite erstellen Sie eine E-Rechnung nach der Norm EN 16931, ohne Software zu kaufen und ohne Konto. Zur Wahl stehen zwei Formate: eine ZUGFeRD-PDF, die Ihr Kunde wie gewohnt lesen kann und in der die Rechnungsdaten als XML stecken, oder eine XRechnung als reine XML-Datei, wahlweise in der Syntax UBL oder CII. Sie geben Ihre Firmendaten, den Empfänger, Rechnungsnummer, Datum und die Positionen ein; das Formular rechnet je Steuersatz die Steuer aus (${ST.regel} oder ${ST.ermaessigt} Prozent) und bildet die Summen auf den Cent. Für Kleinunternehmer nach § 19 UStG und für Bauleistungen mit Reverse Charge setzt es die richtige Steuerkategorie und den gesetzlichen Hinweis. Eine laufende Vorprüfung zeigt fehlende Angaben, und erst wenn keine Fehler mehr offen sind, lässt sich die Datei herunterladen. Alles geschieht in Ihrem Browser: Es wird nichts gespeichert und nichts übertragen. Pflicht wird das Ausstellen für die meisten Unternehmen ab ${PF.ausstellenAb.slice(0, 4)}, für alle ab ${PF.ausstellenAbKlein.slice(0, 4)}.`,
    faqs: [
      { q: 'Welches Format soll ich im Rechnungsersteller wählen?', a: 'Für Rechnungen an Unternehmen ist die ZUGFeRD-PDF meist die bequemste Wahl: Ihr Kunde kann sie ohne Spezialsoftware lesen, und seine Buchhaltung liest die Daten automatisch aus. Die XRechnung wählen Sie, wenn der Kunde sie ausdrücklich verlangt oder eine Behörde ist. Stellen Sie den Empfänger auf Behörde, erzeugt das Formular automatisch eine XRechnung mit Leitweg-ID.' },
      { q: 'Werden meine Kundendaten im Ersteller gespeichert?', a: 'Nein. Das Formular lebt nur in Ihrem Browserfenster. Weder Ihre Firmendaten noch die Ihres Kunden werden an einen Server geschickt oder für ein späteres Mal abgelegt. Laden Sie die Seite neu, stehen wieder die Beispieldaten im Formular. Bewahren Sie deshalb die heruntergeladene Datei auf; sie ist zugleich Ihr Rechnungsoriginal für die Aufbewahrungsfrist.' },
      { q: 'Warum lässt sich die Datei nicht herunterladen?', a: 'Der Download bleibt gesperrt, solange die Vorprüfung einen Fehler meldet. Die betroffenen Felder sind rot umrandet, und unter dem Rechnungsbetrag steht eine Liste mit dem, was noch fehlt. Häufige Ursachen sind eine leere Positionsbezeichnung, eine fehlende Straße beim Empfänger oder bei der XRechnung eine fehlende Telefonnummer des Ansprechpartners.' },
      { q: 'Muss ich jede Rechnung fortlaufend nummerieren?', a: 'Ja, das verlangt § 14 Abs. 4 UStG unabhängig vom Format. Die Nummer muss einmalig sein und darf aus Zahlen und Buchstaben bestehen, etwa RE-2026-0415. Lücken sind nicht verboten, doppelte Nummern aber schon. Das Formular übernimmt Ihre Nummer unverändert in das Feld BT-1; zählen müssen Sie selbst, denn der Ersteller merkt sich keine früheren Rechnungen.' },
    ],
    body: (h) => `
<h2>Schritt für Schritt zur ersten E-Rechnung</h2>
<p>Oben im Formular treffen Sie drei Entscheidungen. Das Format legt fest, ob Sie eine ZUGFeRD-PDF oder eine XRechnung bekommen. Der Empfänger unterscheidet zwischen einem Unternehmen und einer Behörde; bei einer Behörde verlangt das Formular die Leitweg-ID und erzeugt immer eine XRechnung. Die Umsatzsteuer steht auf „Normal“, auf „§ 19“ für Kleinunternehmer oder auf „§ 13b“, wenn Ihr Kunde die Steuer schuldet.</p>
<p>Danach füllen Sie fünf Blöcke aus: Ihr Unternehmen, den Empfänger, die Rechnungsdaten, die Positionen und die Zahlung. Zum Ausprobieren sind alle Felder mit erfundenen Daten vorbelegt; die Beispielrechnung ergibt ${h.eur(B.totals.payable, 2)} Zahlbetrag aus drei Positionen mit zwei Steuersätzen. Mit „Alle Felder leeren“ beginnen Sie von vorn. Rechts sehen Sie während der Eingabe den Rechnungsbetrag, Netto und Steuer und den Stand der Prüfung.</p>
<h2>Welche Angaben eine Rechnung braucht</h2>
<p>Das Format ändert nichts an den Pflichtangaben. ${h.src('ustg14', '§ 14 Abs. 4 UStG')} verlangt in jeder Rechnung über 250 Euro dieselben Inhalte, ob auf Papier oder als XML. Die Norm EN 16931 gibt jedem davon ein festes Feld:</p>
${h.table(['Pflichtangabe', 'Feld', 'Im Formular'], [
  ['Name und Anschrift des Leistenden', 'BT-27, BG-5', 'Ihr Unternehmen'],
  ['Name und Anschrift des Empfängers', 'BT-44, BG-8', 'Empfänger der Rechnung'],
  ['Steuernummer oder USt-IdNr.', 'BT-31, BT-32', 'Ihr Unternehmen'],
  ['Ausstellungsdatum', 'BT-2', 'Rechnungsdatum'],
  ['Fortlaufende Rechnungsnummer', 'BT-1', 'Rechnungsnummer'],
  ['Menge und Art der Leistung', 'BT-129, BT-153', 'Positionen'],
  ['Zeitpunkt der Leistung', 'BT-72', 'Leistungsdatum'],
  ['Entgelt nach Steuersätzen, Steuersatz und Steuerbetrag', 'BG-23', 'wird berechnet'],
  ['Hinweis auf Steuerbefreiung', 'BT-120', 'wird bei § 19 und § 13b gesetzt'],
], 'Pflichtangaben nach § 14 Abs. 4 UStG und ihre Felder in der E-Rechnung.', ['l', 'l', 'l'])}
<p>Welche Felder in Ihrem konkreten Fall dazukommen, etwa die Käuferreferenz einer XRechnung oder die USt-IdNr. des Kunden beim Reverse Charge, zeigt die Übersicht:</p>
${h.mini('felder', { p: ['steuer', 'empf'], c: 'Alle Pflichtfelder anzeigen' })}
<h2>Kleinunternehmer und Reverse Charge</h2>
<p>Als Kleinunternehmer nach ${h.src('ustg19', '§ 19 UStG')} weisen Sie keine Umsatzsteuer aus. Im Formular wählen Sie dafür „§ 19“: Alle Positionen erhalten die Kategorie E (steuerbefreit), der Steuersatz beträgt 0 Prozent, und als Befreiungsgrund steht der Hinweis auf § 19 Abs. 1 UStG in der Rechnung. Das Feld für die USt-IdNr. verschwindet; Ihre Steuernummer dient dann zugleich als Kennung des Verkäufers. Ausstellen müssen Sie als Kleinunternehmer keine E-Rechnung, denn ${h.src('ustdv34a', '§ 34a UStDV')} erlaubt Ihnen immer eine sonstige Rechnung; freiwillig dürfen Sie es aber. Mehr unter ${h.a('kleinunternehmer', 'E-Rechnung für Kleinunternehmer')}.</p>
<p>Bei Bauleistungen und anderen Fällen des § 13b UStG schuldet Ihr Kunde die Steuer. Die Einstellung „§ 13b“ setzt die Kategorie AE, verlangt die USt-IdNr. des Empfängers und schreibt den Hinweis auf die Steuerschuldnerschaft des Leistungsempfängers in die Rechnung.</p>
<h2>Prüfen, herunterladen, versenden</h2>
<p>Während Sie tippen, läuft im Hintergrund dieselbe Vorprüfung wie im ${h.a('validator', 'XRechnung-Validator')}. Solange ein Fehler offen ist, sind die Download-Knöpfe grau. Ist alles vollständig, laden Sie bei ZUGFeRD die PDF herunter, wahlweise auch nur die enthaltene factur-x.xml; bei der XRechnung erhalten Sie die Datei in UBL oder CII. Verschicken Sie die Datei per E-Mail als Anhang. Bewahren Sie eine Kopie ${h.n(K.P.aufbewahrung.rechnungJahre)} Jahre lang auf, wie es ${h.src('ustg14b', '§ 14b UStG')} verlangt.</p>
<h2>Wann sich ein Programm lohnt</h2>
<p>Der Ersteller ist für einzelne Rechnungen gedacht: die erste E-Rechnung für einen Großkunden, eine Rechnung an eine Behörde, eine Gelegenheitsrechnung neben dem Hauptberuf. Er merkt sich keine Kunden und keine Nummern. Wer jeden Monat viele Rechnungen schreibt, spart mit einem Buchhaltungsprogramm Zeit, das XRechnung oder ZUGFeRD aus den Stammdaten erzeugt. Bis zum ${h.day(PF.papierBis)} dürfen Sie noch Papier oder PDF verwenden; ab ${PF.ausstellenAb.slice(0, 4)} gilt nach ${h.src('ustg27', '§ 27 Abs. 38 UStG')} die Pflicht stufenweise. Welches Format besser passt, vergleicht ${h.a('xrechnung-oder-zugferd', 'XRechnung oder ZUGFeRD')}.</p>
`,
  },
  en: {
    slug: 'create-e-invoice',
    nav: 'Create an e-invoice', card: 'Build a ZUGFeRD PDF or XRechnung from a form, free of charge',
    title: 'Create E-Invoice Free 2026: No Software, Right in Browser',
    description: 'Create a German e-invoice free in 2026: fill in a form, totals are calculated, mandatory details checked, download as ZUGFeRD PDF or XRechnung. No account.',
    h1: 'Create an e-invoice: free, no account, in your browser',
    intro: 'Pick a format, enter your data, download. The form works out net, VAT and gross itself, and the download stays locked until every mandatory detail is right.',
    resume: `With the form on this page you create an e-invoice under the European standard EN 16931 without buying software and without an account. You choose between two formats: a ZUGFeRD PDF, which your customer reads as usual and which carries the invoice data as XML inside, or an XRechnung as a pure XML file, in either UBL or CII syntax. You enter your business details, the recipient, invoice number, date and line items; the form calculates the VAT per rate (${ST.regel} or ${ST.ermaessigt} percent) and builds the totals to the cent. For small businesses under section 19 of the VAT Act and for construction services under the reverse charge it sets the right VAT category and the legal note. A running pre-check shows missing details, and the file can only be downloaded once no errors remain. Everything happens in your browser: nothing is stored and nothing is sent. Issuing becomes mandatory for most businesses from ${PF.ausstellenAb.slice(0, 4)} and for everyone from ${PF.ausstellenAbKlein.slice(0, 4)}.`,
    faqs: [
      { q: 'Which format should I pick in the invoice creator?', a: 'For invoices to businesses the ZUGFeRD PDF is usually the easiest choice: your customer can read it without special software, and their accounting reads the data automatically. Choose XRechnung if the customer asks for it explicitly or is a public body. If you set the recipient to authority, the form automatically produces an XRechnung with a Leitweg-ID.' },
      { q: 'Does the creator store my customer data?', a: 'No. The form lives only in your browser window. Neither your business details nor your customer’s are sent to a server or kept for next time. Reload the page and the sample data is back in the form. So keep the downloaded file; it is also your original invoice for the retention period.' },
      { q: 'Why can I not download the file?', a: 'The download stays locked while the pre-check reports an error. The fields concerned have a red border, and a list under the invoice total shows what is still missing. Common causes are an empty line description, a missing street for the recipient or, for an XRechnung, a missing phone number for the contact person.' },
      { q: 'Must German invoices be numbered consecutively?', a: 'Yes, section 14(4) of the VAT Act requires it whatever the format. The number must be unique and may combine digits and letters, such as RE-2026-0415. Gaps are not forbidden, duplicates are. The form copies your number unchanged into field BT-1; you have to keep count yourself, because the creator does not remember earlier invoices.' },
    ],
    body: (h) => `
<h2>Step by step to your first e-invoice</h2>
<p>At the top of the form you make three choices. The format decides whether you get a ZUGFeRD PDF or an XRechnung. The recipient distinguishes a business from a public authority; for an authority the form asks for the Leitweg-ID and always produces an XRechnung. VAT is set to “Normal”, to “Sec. 19” for small businesses or to “Sec. 13b” if your customer owes the VAT.</p>
<p>Then you fill in five blocks: your business, the recipient, the invoice details, the line items and the payment. To try it out, every field is pre-filled with made-up data; the sample invoice comes to ${h.eur(BE.totals.payable, 2)} due from three lines at two VAT rates. “Clear all fields” starts from scratch. On the right you see the invoice total, net, VAT and the status of the check as you type.</p>
<h2>What an invoice must contain</h2>
<p>The format does not change the mandatory details. ${h.src('ustg14', 'Section 14(4) UStG')} requires the same content in every invoice above 250 euros, on paper or as XML. EN 16931 gives each item a fixed field:</p>
${h.table(['Mandatory detail', 'Field', 'In the form'], [
  ['Name and address of the supplier', 'BT-27, BG-5', 'Your business'],
  ['Name and address of the recipient', 'BT-44, BG-8', 'Invoice recipient'],
  ['Tax number or VAT ID', 'BT-31, BT-32', 'Your business'],
  ['Date of issue', 'BT-2', 'Invoice date'],
  ['Consecutive invoice number', 'BT-1', 'Invoice number'],
  ['Quantity and nature of the supply', 'BT-129, BT-153', 'Line items'],
  ['Time of supply', 'BT-72', 'Date of supply'],
  ['Net amount per rate, VAT rate and VAT amount', 'BG-23', 'calculated'],
  ['Note on VAT exemption', 'BT-120', 'set for sec. 19 and sec. 13b'],
], 'Mandatory details under section 14(4) UStG and their e-invoice fields.', ['l', 'l', 'l'])}
<p>Which fields are added in your particular case, such as the buyer reference of an XRechnung or the customer’s VAT ID under the reverse charge, is shown here:</p>
${h.mini('felder', { p: ['steuer', 'empf'], c: 'Show every mandatory field' })}
<h2>Small businesses and reverse charge</h2>
<p>As a small business under ${h.src('ustg19', 'section 19 UStG')} you charge no VAT. Choose “Sec. 19” in the form: every line gets category E (exempt), the rate becomes zero, and the exemption reason cites section 19(1) UStG. The VAT ID field disappears, and your tax number doubles as the seller identifier. Small businesses do not have to issue e-invoices, because ${h.src('ustdv34a', 'section 34a UStDV')} always allows them an ordinary invoice, but they may do so voluntarily. More on ${h.a('kleinunternehmer', 'e-invoices for small businesses')}.</p>
<p>For construction services and other cases under section 13b UStG your customer owes the VAT. The “Sec. 13b” setting applies category AE, asks for the recipient’s VAT ID and writes the reverse charge note into the invoice.</p>
<h2>Check, download, send</h2>
<p>While you type, the same pre-check as in the ${h.a('validator', 'XRechnung validator')} runs in the background. As long as an error is open, the download buttons are grey. Once everything is complete, ZUGFeRD gives you the PDF, or only the embedded factur-x.xml if you prefer; XRechnung gives you the file in UBL or CII. Send the file as an email attachment and keep a copy for ${h.n(K.P.aufbewahrung.rechnungJahre)} years, as ${h.src('ustg14b', 'section 14b UStG')} requires.</p>
<h2>When software pays off</h2>
<p>The creator is meant for single invoices: the first e-invoice for a large customer, an invoice to a public body, an occasional invoice alongside your main job. It remembers no customers and no numbers. If you write many invoices every month, accounting software that builds XRechnung or ZUGFeRD from your records saves time. Until ${h.day(PF.papierBis)} you may still use paper or PDF; from ${PF.ausstellenAb.slice(0, 4)} the mandate applies in stages under ${h.src('ustg27', 'section 27(38) UStG')}. Which format suits you better is compared on ${h.a('xrechnung-oder-zugferd', 'XRechnung or ZUGFeRD')}.</p>
`,
  },
});
