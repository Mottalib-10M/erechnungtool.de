/**
 * Leitweg-ID nach der Formatspezifikation der KoSIT, Version 2.0.2 (params: sources.leitweg-spec).
 *   Grobadressierung : 2 bis 12 Ziffern, die ersten zwei = Kennzahl des Landes (01 bis 16) oder 99 (Bund)
 *   Feinadressierung : optional, bis 30 Zeichen A-Z / 0-9, Groß- und Kleinschreibung gleichwertig
 *   Prüfziffer       : zwei Ziffern, ISO/IEC 7064 Modulo 97-10 über Grob + Fein ohne Bindestriche
 * Rein und deterministisch : Tests in tests/leitweg.test.ts.
 */
export const LAENDER_KZ: Record<string, string> = {
  '01': 'Schleswig-Holstein', '02': 'Hamburg', '03': 'Niedersachsen', '04': 'Bremen', '05': 'Nordrhein-Westfalen',
  '06': 'Hessen', '07': 'Rheinland-Pfalz', '08': 'Baden-Württemberg', '09': 'Bayern', '10': 'Saarland', '11': 'Berlin',
  '12': 'Brandenburg', '13': 'Mecklenburg-Vorpommern', '14': 'Sachsen', '15': 'Sachsen-Anhalt', '16': 'Thüringen', '99': 'Bund',
};

/** Buchstaben in Zahlen (A = 10 … Z = 35), Ziffern unverändert. */
export function toDigits(s: string): string {
  return s.toUpperCase().replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
}
/** Rest einer langen Ziffernfolge modulo 97, stückweise gerechnet. */
export function mod97(digits: string): number {
  let r = 0;
  for (const ch of digits) r = (r * 10 + Number(ch)) % 97;
  return r;
}
/** Prüfziffer für Grob- und Feinadressierung (ohne Bindestriche). */
export function pruefziffer(grob: string, fein = ''): string {
  const r = mod97(toDigits(`${grob}${fein}`) + '00');
  return String(98 - r).padStart(2, '0');
}

export interface LeitwegResult {
  ok: boolean;
  /** Eingabe ohne Leerzeichen, Großbuchstaben. */
  norm: string;
  grob?: string; fein?: string; pz?: string;
  /** Erwartete Prüfziffer, wenn Grob- und Feinadressierung lesbar sind. */
  erwartet?: string;
  land?: string;
  /** Fehlercodes : leer, zeichen, aufbau, grob, land, fein, laenge, pz. */
  fehler: string[];
}

export function pruefeLeitweg(input: string): LeitwegResult {
  const norm = input.trim().replace(/\s+/g, '').toUpperCase();
  const fehler: string[] = [];
  if (!norm) return { ok: false, norm, fehler: ['leer'] };
  if (/[^0-9A-Z-]/.test(norm)) fehler.push('zeichen');
  const teile = norm.split('-');
  if (teile.length < 2 || teile.length > 3 || teile.some((t) => !t)) return { ok: false, norm, fehler: [...fehler, 'aufbau'] };
  const grob = teile[0];
  const fein = teile.length === 3 ? teile[1] : '';
  const pz = teile[teile.length - 1];
  if (!/^\d{2,12}$/.test(grob)) fehler.push('grob');
  const land = LAENDER_KZ[grob.slice(0, 2)];
  if (/^\d{2}/.test(grob) && !land) fehler.push('land');
  if (fein && !/^[0-9A-Z]{1,30}$/.test(fein)) fehler.push('fein');
  if (norm.length < 5 || norm.length > 46) fehler.push('laenge');
  const lesbar = /^\d{2,12}$/.test(grob) && (!fein || /^[0-9A-Z]{1,30}$/.test(fein));
  const erwartet = lesbar ? pruefziffer(grob, fein) : undefined;
  if (!/^\d{2}$/.test(pz) || (lesbar && mod97(toDigits(grob + fein + pz)) !== 1)) fehler.push('pz');
  return { ok: fehler.length === 0, norm, grob, fein: fein || undefined, pz, erwartet, land, fehler };
}

/** Sieht ein BT-10 wie eine Leitweg-ID aus (Ziffern, Bindestrich, zwei Ziffern am Ende) ? */
export const siehtAusWieLeitweg = (s: string) => /^\d{2,12}(-[0-9A-Za-z]{1,30})?-\d{2}$/.test(s.trim());
