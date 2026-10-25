/** Toutes les pages prévues (id = nom du fichier de src/content/guides).
 *  Les tests acceptent un lien vers ces ids pendant la rédaction ; « toutes les pages existent » échoue tant qu'il en manque. */
export const PLANNED_GUIDES = [
  'oeffnen', 'validator', 'erstellen', 'xrechnung-erstellen', 'zugferd-erstellen', 'pdf-umwandeln', 'xrechnung-pdf', 'beispiel', 'leitweg',
  'pflicht', 'kleinunternehmer', 'fristen', 'folgen', 'bmf',
  'zugferd', 'xrechnung', 'xrechnung-oder-zugferd', 'formate', 'en-16931', 'was-ist',
  'empfangen', 'archivieren', 'per-email', 'bund', 'edi',
];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
