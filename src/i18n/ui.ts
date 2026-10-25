import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsgrundsätze', contactLabel: 'Kontakt', reviewedBy: 'Erstellt von',
  skipToContent: 'Zum Inhalt springen', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Brotkrumen', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Häufige Fragen', relatedCalculators: 'Weiter mit', sourcesTitle: 'Amtliche Quellen dieser Seite', writtenBy: 'Erstellt von',
  asOf: 'Stand', lastUpdated: 'Gesetze, BMF-Schreiben und Standards geprüft am', footerValidated: 'Quellen: UStG und UStDV auf gesetze-im-internet.de, BMF-Schreiben vom 15. Oktober 2025, XRechnung 3.0.2 (KoSIT), ZUGFeRD 2.5.2 (FeRD)',
  footerBrowser: 'Alles läuft in Ihrem Browser · keine Datei wird hochgeladen · kein Konto, keine Anmeldung',
  footerDisclaimer: 'Unabhängige Seite von Radif Partners, ohne Verbindung zum Bundesministerium der Finanzen, zur KoSIT, zum FeRD oder zu einer Finanzbehörde. Die Vorprüfung ersetzt nicht den amtlichen KoSIT-Validator, die Seite ersetzt keine Steuerberatung.',
  footerPopular: 'Werkzeuge',
  notFound: 'Unter dieser Adresse gibt es keine Seite. Auf der Startseite finden Sie den Pflicht-Check, den Viewer für XRechnung und ZUGFeRD und den kostenlosen Rechnungsersteller.',
  readMore: 'Weiterlesen',
  moreOptions: 'Weitere Angaben', copyLink: 'Link kopieren', copied: 'Link kopiert', print: 'Drucken', howComputed: 'So wird geprüft', openFull: 'Zum vollständigen Werkzeug',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'laws, ministry letters and standards checked on', footerValidated: 'Sources: VAT Act and Implementing Ordinance on gesetze-im-internet.de, Finance Ministry letter of 15 October 2025, XRechnung 3.0.2 (KoSIT), ZUGFeRD 2.5.2 (FeRD)',
  footerBrowser: 'Everything runs in your browser · no file is uploaded · no account, no sign-up',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with the Federal Ministry of Finance, KoSIT, FeRD or any tax authority. The pre-check does not replace the official KoSIT validator, and nothing here is tax advice.',
  footerPopular: 'Tools',
  notFound: 'Nothing lives at this address. The home page has the obligation check, the XRechnung and ZUGFeRD viewer and the free invoice creator.',
  readMore: 'Read more',
  moreOptions: 'More details', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is checked', openFull: 'Open the full tool',
};
const ALL = { de, en };
export function t(lang: Locale) { return ALL[lang] ?? de; }
