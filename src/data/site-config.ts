/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://erechnungtool.de";
export const SITE_NAMES: Record<string, string> = {"de": "E-Rechnung-Check", "en": "E-Rechnung-Check"};
export const LANG_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-DE"};
/** Locale des nombres et des dates : anglais britannique pour la version anglaise. */
export const NUM_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-GB"};
export const OG_LOCALES: Record<string, string> = {"de": "de_DE", "en": "en_GB"};
export const LOCALE_TAG = 'de-DE';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-25';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber eines kostenlosen E-Rechnung-Werkzeugs: Pflicht-Check nach UStG, Viewer, Prüfung und Erstellung von XRechnung und ZUGFeRD im Browser", "en": "Publisher of a free German e-invoicing toolkit: obligation check under the VAT Act, viewer, checker and creator for XRechnung and ZUGFeRD in the browser"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners ist ein unabhängiger Herausgeber. Für E-Rechnung-Check liest es § 14 und § 27 Abs. 38 UStG, die §§ 33, 34 und 34a UStDV, die BMF-Schreiben vom 15. Oktober 2024 und 15. Oktober 2025 sowie die Spezifikationen von KoSIT (XRechnung 3.0.2) und FeRD (ZUGFeRD 2.5.2) und baut daraus Werkzeuge, die vollständig im Browser laufen. Radif Partners ist keine Behörde, kein Steuerberater und gibt keine Steuerberatung.", "en": "Radif Partners is an independent publisher. For E-Rechnung-Check it reads sections 14 and 27(38) of the German VAT Act, sections 33, 34 and 34a of the VAT Implementing Ordinance, the Federal Finance Ministry letters of 15 October 2024 and 15 October 2025 and the KoSIT (XRechnung 3.0.2) and FeRD (ZUGFeRD 2.5.2) specifications, and turns them into tools that run entirely in your browser. It is not an authority or a tax adviser and gives no tax advice."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["E-Rechnungspflicht nach § 14 UStG", "XRechnung", "ZUGFeRD", "EN 16931", "Leitweg-ID", "Kleinunternehmer und E-Rechnung"], "en": ["German e-invoicing mandate", "XRechnung", "ZUGFeRD and Factur-X", "EN 16931", "Leitweg-ID"]};
export const CONTACT_EMAIL = "kontakt@erechnungtool.de";
export const THEME_COLOR = '#9B1B1E';
export const LOGO_SYMBOL = 'XML';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = '555625587b191bca0cfca2eb4c0a217b';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt-IdNr.",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city']; // legalForm vide à dessein, comme les autres sites du portefeuille

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
