/** Leitweg-ID prüfen : Aufbau, Länderkennzahl und Prüfziffer (Modulo 97-10), im Browser, ohne Abfrage einer Datenbank. */
import { useState } from 'react';
import { ResultCard, Rows } from '../calc/parts';
import { pruefeLeitweg } from '../../lib/engine/leitweg';
import type { Lang } from '../../lib/format';

const L = {
  de: {
    label: 'Leitweg-ID', help: 'Mit Bindestrichen, zum Beispiel 04011000-1234512345-06', ergebnis: 'Ergebnis der Prüfung', ok: 'Formal gültig', nok: 'Nicht gültig',
    subOk: 'Aufbau und Prüfziffer stimmen. Ob die Stelle unter dieser ID Rechnungen annimmt, sagt nur der Auftraggeber.', grob: 'Grobadressierung', fein: 'Feinadressierung', pz: 'Prüfziffer', erw: 'Richtige Prüfziffer', land: 'Bereich', ohne: 'keine',
    f: { leer: 'Bitte eine Leitweg-ID eingeben.', zeichen: 'Erlaubt sind nur Ziffern, Buchstaben A bis Z und Bindestriche.', aufbau: 'Erwartet werden zwei oder drei Teile, getrennt durch Bindestriche.', grob: 'Die Grobadressierung hat 2 bis 12 Ziffern.', land: 'Die ersten zwei Ziffern sind 01 bis 16 (Länder) oder 99 (Bund).', fein: 'Die Feinadressierung besteht aus bis zu 30 Ziffern oder Buchstaben.', laenge: 'Die ID ist länger als 46 Zeichen.', pz: 'Die Prüfziffer passt nicht zu den Ziffern davor: vermutlich ein Tippfehler.' } as Record<string, string>,
  },
  en: {
    label: 'Leitweg-ID', help: 'With hyphens, for example 04011000-1234512345-06', ergebnis: 'Check result', ok: 'Formally valid', nok: 'Not valid',
    subOk: 'Structure and check digits match. Only the contracting authority can say whether this ID receives invoices.', grob: 'Coarse address', fein: 'Fine address', pz: 'Check digits', erw: 'Correct check digits', land: 'Area', ohne: 'none',
    f: { leer: 'Please enter a Leitweg-ID.', zeichen: 'Only digits, letters A to Z and hyphens are allowed.', aufbau: 'Two or three parts separated by hyphens are expected.', grob: 'The coarse address has 2 to 12 digits.', land: 'The first two digits are 01 to 16 (federal states) or 99 (federal government).', fein: 'The fine address has up to 30 digits or letters.', laenge: 'The ID is longer than 46 characters.', pz: 'The check digits do not match the characters before them: most likely a typo.' } as Record<string, string>,
  },
};

export default function Leitweg({ lang, idPrefix = 'lw' }: { lang: Lang; idPrefix?: string }) {
  const t = L[lang];
  const [v, setV] = useState('04011000-1234512345-06');
  const r = pruefeLeitweg(v);
  const sub = r.ok ? t.subOk : r.fehler.map((f) => t.f[f] ?? f).join(' ');
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start gap-y-1" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor={`${idPrefix}-id`} className="mb-1 block text-sm font-medium text-navy-700">{t.label}</label>
          <input id={`${idPrefix}-id`} type="text" value={v} onChange={(e) => setV(e.target.value)} spellCheck={false} autoComplete="off" aria-describedby={`${idPrefix}-help`}
            className="h-12 w-full rounded-lg border border-navy-300 bg-white px-4 font-mono text-lg uppercase text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
          <p id={`${idPrefix}-help`} className="mt-1 text-xs text-navy-500">{t.help}</p>
        </form>
        <ResultCard label={t.ergebnis} value={r.ok ? t.ok : t.nok} sub={sub}>
          <Rows rows={[[t.grob, r.grob ?? '–'], [t.land, r.land ?? '–'], [t.fein, r.fein || t.ohne], [t.pz, r.pz ?? '–'], [t.erw, r.erwartet ?? '–']]} />
        </ResultCard>
      </div>
    </div>
  );
}
