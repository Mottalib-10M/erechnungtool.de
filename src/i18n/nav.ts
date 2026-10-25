import { route, hasRoute, type Locale } from './routes';
import { GUIDES, guideById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  de: { home: 'E-Rechnung 2026', method: 'Methode', about: 'Über uns', widget: 'Werkzeuge einbinden', contact: 'Kontakt', editorial: 'Redaktionsgrundsätze', privacy: 'Datenschutz', terms: 'Impressum', cookies: 'Cookies' },
  en: { home: 'E-invoicing 2026', method: 'Method', about: 'About', widget: 'Embed the tools', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
export const GROUPS: Array<{ id: Group; label: Record<Locale, string> }> = [
  { id: 'werkzeuge', label: { de: 'Werkzeuge', en: 'Tools' } },
  { id: 'pflicht', label: { de: 'Pflicht und Fristen', en: 'Mandate and deadlines' } },
  { id: 'formate', label: { de: 'Formate', en: 'Formats' } },
  { id: 'praxis', label: { de: 'Praxis', en: 'In practice' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? guideById(id)?.[lang]?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label[lang], links: inGroup(g.id, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => {
  const site = { label: { de: 'Diese Seite', en: 'This site' }[lang], links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) };
  return [
    { label: GROUPS[1].label[lang], links: inGroup('pflicht', lang) },
    { label: GROUPS[2].label[lang], links: inGroup('formate', lang) },
    { label: GROUPS[3].label[lang], links: inGroup('praxis', lang) },
    site,
  ];
};
/** Les outils, à un clic de toute page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => inGroup('werkzeuge', lang);
