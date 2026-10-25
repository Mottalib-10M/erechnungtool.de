/** llms.txt (RECETTE §21), généré à partir du registre des pages. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const P = K.P, PF = P.pflicht, S = P.standards;
  const lines = [
    `# ${SITE_NAMES.de}`, '',
    `> German e-invoicing (E-Rechnung) tools and guides, in German and English. Mandate under sections 14 and 27(38) of the German VAT Act as read on ${P.retrieved_at}: every domestic business must receive e-invoices since ${PF.empfangAb}; paper or PDF allowed for issuing until ${PF.papierBis}; in 2027 only if prior-year turnover is up to ${PF.umsatzgrenze} EUR; e-invoices mandatory for all domestic B2B supplies from ${PF.ausstellenAbKlein}. Exceptions: invoices up to ${P.ausnahmen.kleinbetrag} EUR, travel tickets, VAT-exempt supplies, small businesses (section 34a UStDV). Browser-only tools (no upload, no account): viewer and pre-check for XRechnung ${S.xrechnung} and ZUGFeRD/Factur-X (UBL and CII, EN 16931 business rules, BR-DE rules, Leitweg-ID check digits), invoice creator producing XRechnung UBL/CII and ZUGFeRD EN 16931 PDF/A-3b (outputs validated with the KoSIT validator and veraPDF), Leitweg-ID checker, deadline, small-business and retention calculators (retention ${P.aufbewahrung.rechnungJahre} years). Independent site published by Radif Partners, not affiliated with the Federal Ministry of Finance, KoSIT or FeRD; not tax advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.de}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.de.nav}](${SITE_URL}${route(p.id, 'de')}): ${p.de.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Methode](${SITE_URL}${route('method', 'de')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Über uns](${SITE_URL}${route('about', 'de')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
