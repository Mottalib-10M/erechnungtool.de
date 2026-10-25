import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Leitweg-ID : spécification de format de la KoSIT 2.0.2 (sources.leitweg-spec), § 5 ERechV, champs BT-10 et BT-49 (schéma 0204).
   Chiffres de contrôle calculés par engine/leitweg.ts (ISO/IEC 7064 MOD 97-10), testés dans tests/leitweg.test.ts. */
const SPEC = '04011000-1234512345-06';
const KURZ = `04011000-12345-${K.pruefziffer('04011000', '12345')}`;
const BUND = `991-12345ABCDE-${K.pruefziffer('991', '12345ABCDE')}`;

export default defineGuide({
  id: 'leitweg', group: 'werkzeuge', order: 9,
  tool: 'leitweg',
  related: ['bund', 'xrechnung', 'xrechnung-erstellen', 'validator', 'beispiel'],
  sources: ['leitweg-spec', 'erechv', 'erechnung-bund-faq', 'kosit-xrechnung'],
  de: {
    slug: 'leitweg-id',
    nav: 'Leitweg-ID prüfen', card: 'Aufbau, Länderkennzahl und Prüfziffer einer Leitweg-ID sofort kontrollieren',
    title: 'Leitweg-ID 2026: Beispiel, Aufbau, Prüfziffer, herausfinden',
    description: 'Leitweg-ID 2026 prüfen: Grobadressierung, Feinadressierung und Prüfziffer nach Modulo 97-10 kontrollieren. Woher die ID kommt und in welches Feld sie gehört.',
    h1: 'Leitweg-ID prüfen: was ist das, Beispiel und Prüfziffer',
    intro: 'Leitweg-ID eintippen oder einfügen: Der Prüfer zerlegt sie in ihre Teile, nennt Land oder Bund und rechnet die Prüfziffer nach. Ein Tippfehler fällt sofort auf.',
    resume: `Die Leitweg-ID ist die Adresse einer Rechnung innerhalb der öffentlichen Verwaltung. Sie wird nach der Formatspezifikation der KoSIT gebildet und besteht aus bis zu drei Teilen, getrennt durch Bindestriche: der Grobadressierung mit 2 bis 12 Ziffern, deren erste zwei das Bundesland (01 bis 16) oder mit 99 den Bund bezeichnen, einer optionalen Feinadressierung mit bis zu 30 Ziffern oder Buchstaben und einer zweistelligen Prüfziffer. Die Prüfziffer wird nach dem Verfahren ISO/IEC 7064 Modulo 97-10 aus allen Zeichen davor berechnet, Buchstaben zählen dabei als Zahlen von 10 bis 35. Ein Beispiel aus der Spezifikation lautet ${SPEC}. Ihre Leitweg-ID erfinden oder recherchieren Sie nicht: Der öffentliche Auftraggeber teilt sie mit, meist in der Bestellung oder im Vertrag. In der XRechnung gehört sie in das Feld Käuferreferenz (BT-10) und bei Rechnungen an den Bund zusätzlich als elektronische Adresse des Käufers (BT-49) mit dem Schema 0204. Der Prüfer oben bestätigt Aufbau und Prüfziffer, kann aber nicht wissen, ob die Stelle unter dieser ID tatsächlich Rechnungen annimmt.`,
    faqs: [
      { q: 'Wo bekomme ich die Leitweg-ID meines öffentlichen Auftraggebers?', a: 'Vom Auftraggeber selbst. Er nennt sie in der Bestellung, im Auftragsschreiben oder im Vertrag, oft auch auf Nachfrage bei der Beschaffungsstelle. Ein öffentliches Gesamtverzeichnis aller Leitweg-IDs gibt es nicht. Fehlt die Angabe, fragen Sie vor dem Rechnungsversand nach, denn ohne gültige Leitweg-ID wird eine Rechnung an den Bund in der Regel abgewiesen.' },
      { q: 'Was bedeutet es, wenn die Prüfziffer nicht stimmt?', a: 'Dann passt mindestens ein Zeichen nicht zu den übrigen, fast immer ein Tippfehler oder ein Zahlendreher. Das Verfahren Modulo 97-10 erkennt jede einzelne falsche Ziffer und jede Vertauschung zweier benachbarter Zeichen. Der Prüfer zeigt die rechnerisch richtige Prüfziffer an; verlassen Sie sich darauf aber nicht, sondern gleichen Sie die ganze ID mit der Angabe Ihres Auftraggebers ab.' },
      { q: 'Spielt Groß- oder Kleinschreibung in der Leitweg-ID eine Rolle?', a: 'Nein. Nach der Formatspezifikation sind Groß- und Kleinbuchstaben in der Feinadressierung gleichwertig, und bei der Berechnung der Prüfziffer zählt jeder Buchstabe gleich, egal wie er geschrieben ist. Üblich ist die Schreibweise in Großbuchstaben. Leerzeichen gehören nicht in die ID; die Bindestriche zwischen den Teilen dagegen schon.' },
      { q: 'Brauchen Rechnungen an Unternehmen auch eine Leitweg-ID?', a: 'Nein. Die Leitweg-ID gibt es nur in der öffentlichen Verwaltung. Bei Rechnungen an Unternehmen steht im Feld Käuferreferenz eine Bestell- oder Kostenstellennummer des Kunden, und wenn er keine nennt, darf in einer XRechnung auch ein Platzhalter stehen. Die elektronische Adresse ist dann meist eine E-Mail-Adresse mit dem Schema EM.' },
    ],
    body: (h) => `
<h2>Die drei Teile einer Leitweg-ID</h2>
${h.table(['Teil', 'Zeichen', 'Bedeutung', 'Beispiel'], [
  ['Grobadressierung', '2 bis 12 Ziffern', 'Land (01 bis 16) oder Bund (99), dann Behörde', '04011000'],
  ['Feinadressierung', 'optional, bis 30 Ziffern oder Buchstaben', 'Stelle innerhalb der Behörde', '1234512345'],
  ['Prüfziffer', '2 Ziffern', 'Modulo 97-10 über alle Zeichen davor', '06'],
], 'Aufbau nach der Formatspezifikation Leitweg-ID der KoSIT.', ['l', 'l', 'l', 'l'])}
<p>Die ${h.src('leitweg-spec', 'Formatspezifikation der KoSIT')} legt fest, dass eine Leitweg-ID höchstens 46 Zeichen lang ist. Die ersten beiden Ziffern der Grobadressierung bezeichnen den Bereich: 01 steht für Schleswig-Holstein, 04 für Bremen, 09 für Bayern, 16 für Thüringen und 99 für den Bund. Wie die Länder die übrigen Ziffern vergeben, regeln sie selbst; oft folgt eine Kennung der Kommune oder Behörde. Die Feinadressierung leitet die Rechnung innerhalb der Behörde weiter, etwa an ein Referat oder eine Kostenstelle.</p>
<h2>So wird die Prüfziffer berechnet</h2>
<p>Das Verfahren ist dasselbe wie bei der IBAN. Grob- und Feinadressierung werden ohne Bindestriche hintereinander geschrieben, jeder Buchstabe wird durch eine Zahl ersetzt (A = 10, B = 11 bis Z = 35), und hinten werden zwei Nullen angehängt. Von der so entstandenen langen Zahl wird der Rest bei Division durch 97 gebildet. Die Prüfziffer ist 98 minus dieser Rest, zweistellig mit führender Null. Für die kurze Leitweg-ID aus Grobadressierung 04011000 und Feinadressierung 12345 ergibt sich so ${KURZ}; für die erfundene Bundes-ID unserer Musterrechnung ${BUND}.</p>
<p>Probieren Sie es mit eigenen Ziffern aus. Der kleine Rechner bildet aus Grob- und Feinadressierung die vollständige Leitweg-ID mit Prüfziffer:</p>
${h.mini('lw', { p: ['grob', 'fein'], c: 'Leitweg-ID zusammensetzen' })}
<h2>Wo die Leitweg-ID in der Rechnung steht</h2>
<p>Nach ${h.src('erechv', '§ 5 der E-Rechnungsverordnung')} gehört die Leitweg-ID zu den Angaben, die eine Rechnung an den Bund neben den Pflichtangaben des Umsatzsteuerrechts enthalten muss. In der XRechnung steht sie im Feld BT-10, der Käuferreferenz; die Regel BR-DE-15 verlangt dieses Feld in jeder XRechnung. Bei der Übermittlung über Peppol und an die Plattformen des Bundes dient sie außerdem als elektronische Adresse des Käufers im Feld BT-49, mit dem Schema 0204. In der UBL-Syntax heißt das Element <code>cbc:BuyerReference</code>, in CII <code>ram:BuyerReference</code>.</p>
<p>Ein häufiger Fehler ist eine Leitweg-ID, die nur in der Bemerkung oder im Betreff einer E-Mail steht. Die Plattformen lesen sie aber aus dem Datenfeld. Der ${h.a('xrechnung-erstellen', 'XRechnung-Ersteller')} setzt sie automatisch in beide Felder, sobald Sie als Empfänger eine Behörde wählen, und prüft die Prüfziffer, bevor er den Download freigibt.</p>
<h2>Grenzen der Prüfung</h2>
<p>Eine formal richtige Leitweg-ID kann trotzdem die falsche sein: Ein Zahlendreher, der zufällig wieder eine passende Prüfziffer ergibt, ist selten, aber die ID einer anderen Dienststelle besteht jede Prüfung. Ob unter einer ID tatsächlich Rechnungen angenommen werden, weiß nur der Auftraggeber. Der Prüfer fragt keine Datenbank ab und schickt Ihre Eingabe nirgendwohin. Mehr zum Rechnungsweg an Behörden lesen Sie unter ${h.a('bund', 'E-Rechnung an den Bund')}; die ${h.src('erechnung-bund-faq', 'Fragen und Antworten zur E-Rechnung des Bundes')} erklären die Plattformen.</p>
`,
  },
  en: {
    slug: 'leitweg-id',
    nav: 'Check a Leitweg-ID', card: 'Check the structure, state code and check digits of a Leitweg-ID at once',
    title: 'Leitweg-ID 2026: Structure Explained and Check Digit Test',
    description: 'Check a Leitweg-ID in 2026: coarse address, fine address and modulo 97-10 check digits verified. Where the ID comes from and which invoice field it goes in.',
    h1: 'Checking a Leitweg-ID: structure, check digits, right field',
    intro: 'Type or paste a Leitweg-ID: the checker splits it into its parts, names the state or federal level and recalculates the check digits. A typo shows up at once.',
    resume: `The Leitweg-ID is the address of an invoice inside the German public administration. It is formed under the KoSIT format specification and has up to three parts separated by hyphens: a coarse address of 2 to 12 digits, whose first two name the federal state (01 to 16) or, with 99, the federal government; an optional fine address of up to 30 digits or letters; and two check digits. The check digits are computed with the ISO/IEC 7064 modulo 97-10 method over all characters before them, with letters counting as numbers from 10 to 35. An example from the specification is ${SPEC}. You do not invent or look up your Leitweg-ID: the public contracting body gives it to you, usually in the purchase order or contract. In an XRechnung it goes into the buyer reference field (BT-10) and, for invoices to the federal government, also into the buyer's electronic address (BT-49) with scheme 0204. The checker above confirms structure and check digits, but it cannot know whether the office actually receives invoices under that ID.`,
    faqs: [
      { q: 'Where do I get my public client’s Leitweg-ID?', a: 'From the contracting body itself. It states the ID in the purchase order, the award letter or the contract, often also on request from the procurement office. There is no public directory of all Leitweg-IDs. If it is missing, ask before sending the invoice, because an invoice to the federal government without a valid Leitweg-ID is normally rejected.' },
      { q: 'What does it mean if the check digits do not match?', a: 'At least one character does not fit the others, almost always a typo or two swapped digits. The modulo 97-10 method detects every single wrong digit and every swap of two neighbouring characters. The checker shows the arithmetically correct check digits, but do not rely on them alone: compare the whole ID with the one your contracting body gave you.' },
      { q: 'Does upper or lower case matter in a Leitweg-ID?', a: 'No. Under the format specification upper and lower case letters in the fine address are equivalent, and for the check digits each letter counts the same however it is written. Upper case is the usual spelling. Spaces do not belong in the ID, while the hyphens between the parts do.' },
      { q: 'Do invoices to businesses need a Leitweg-ID too?', a: 'No. Leitweg-IDs exist only in the public administration. On invoices to businesses the buyer reference field holds the customer’s order or cost centre number, and if they give none, an XRechnung may carry a placeholder. The electronic address is then usually an email address with scheme EM.' },
    ],
    body: (h) => `
<h2>The three parts of a Leitweg-ID</h2>
${h.table(['Part', 'Characters', 'Meaning', 'Example'], [
  ['Coarse address', '2 to 12 digits', 'state (01 to 16) or federal level (99), then authority', '04011000'],
  ['Fine address', 'optional, up to 30 digits or letters', 'office within the authority', '1234512345'],
  ['Check digits', '2 digits', 'modulo 97-10 over all preceding characters', '06'],
], 'Structure under the KoSIT Leitweg-ID format specification.', ['l', 'l', 'l', 'l'])}
<p>The ${h.src('leitweg-spec', 'KoSIT format specification')} sets a maximum length of 46 characters. The first two digits of the coarse address name the area: 01 stands for Schleswig-Holstein, 04 for Bremen, 09 for Bavaria, 16 for Thuringia and 99 for the federal government. How the states allocate the remaining digits is up to them; often an identifier of the municipality or authority follows. The fine address routes the invoice within the authority, for example to a unit or cost centre.</p>
<h2>How the check digits are calculated</h2>
<p>The method is the same as for an IBAN. Coarse and fine address are written one after the other without hyphens, every letter is replaced by a number (A = 10, B = 11 up to Z = 35), and two zeros are appended. The remainder of that long number divided by 97 is taken. The check digits are 98 minus that remainder, two digits with a leading zero. For the short Leitweg-ID made of coarse address 04011000 and fine address 12345 this gives ${KURZ}; for the fictitious federal ID in our sample invoice, ${BUND}.</p>
<p>Try it with your own digits. The small calculator builds the complete Leitweg-ID with check digits from a coarse and a fine address:</p>
${h.mini('lw', { p: ['grob', 'fein'], c: 'Build a Leitweg-ID' })}
<h2>Where the Leitweg-ID goes in the invoice</h2>
<p>Under ${h.src('erechv', 'section 5 of the E-Invoicing Regulation')} the Leitweg-ID is one of the details an invoice to the federal government must carry on top of the VAT requirements. In an XRechnung it sits in field BT-10, the buyer reference; rule BR-DE-15 requires this field in every XRechnung. For transmission via Peppol and to the federal platforms it also serves as the buyer’s electronic address in field BT-49, with scheme 0204. In UBL syntax the element is called <code>cbc:BuyerReference</code>, in CII <code>ram:BuyerReference</code>.</p>
<p>A common mistake is a Leitweg-ID that appears only in a note or in the subject line of an email. The platforms, however, read it from the data field. The ${h.a('xrechnung-erstellen', 'XRechnung creator')} puts it into both fields automatically as soon as you choose an authority as recipient, and it checks the check digits before releasing the download.</p>
<h2>Limits of the check</h2>
<p>A formally correct Leitweg-ID can still be the wrong one: a slip that happens to produce matching check digits is rare, but the ID of a different office passes every test. Only the contracting body knows whether invoices are accepted under an ID. The checker queries no database and sends your input nowhere. More on the invoicing route to public bodies on ${h.a('bund', 'e-invoicing the federal government')}; the ${h.src('erechnung-bund-faq', 'federal e-invoicing FAQ')} explains the platforms.</p>
`,
  },
});
