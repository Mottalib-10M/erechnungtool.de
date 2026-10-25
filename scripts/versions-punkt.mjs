// Ajout local (à remonter à la trame) : typo-nbsp.mjs passe en mode correction toute décimale « 1.0 » à la
// virgule dans les pages allemandes, y compris les numéros de version (« ZUGFeRD 1.0 » devenait « ZUGFeRD 1,0 »),
// alors que son mode --check reconnaît déjà un numéro de version précédé d'un nom propre. Ce script rend le point
// aux numéros de version des normes citées, dans dist, juste après typo-nbsp.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const RE = /\b(ZUGFeRD|XRechnung|Version|UBL|Billing|Apache|Factur-X|CII|BIS|Peppol|EN16931|Profil|Mustang|veraPDF|PDF\/A)((?:&nbsp;| |\s)+)(\d{1,2}),(\d{1,2})(?![\d,])/g;
let n = 0;
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.html')) { const s = readFileSync(p, 'utf8'); const t = s.replace(RE, (_m, a, sp, x, y) => (n++, `${a}${sp}${x}.${y}`)); if (t !== s) writeFileSync(p, t); } } };
walk(process.argv[2] ?? 'dist');
console.log(`versions-punkt : ${n} numéro(s) de version remis au point`);
