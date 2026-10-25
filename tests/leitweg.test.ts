import { describe, it, expect } from 'vitest';
import { pruefeLeitweg, pruefziffer, siehtAusWieLeitweg } from '../src/lib/engine/leitweg';

describe('Leitweg-ID (Formatspezifikation 2.0.2)', () => {
  it('Beispiel der Spezifikation : 04011000-1234512345 → 06', () => {
    expect(pruefziffer('04011000', '1234512345')).toBe('06');
    expect(pruefeLeitweg('04011000-1234512345-06').ok).toBe(true);
  });
  it('Beispiel der KoSIT-Testsuite : 04011000-12345-03', () => {
    const r = pruefeLeitweg('04011000-12345-03');
    expect(r.ok).toBe(true); expect(r.land).toBe('Bremen');
  });
  it('Buchstaben in der Feinadressierung, Kleinschreibung gleichwertig', () => {
    expect(pruefeLeitweg('991-12345abcde-16').ok).toBe(true);
    expect(pruefeLeitweg('991-12345ABCDE-16').land).toBe('Bund');
  });
  it('falsche Prüfziffer wird erkannt und die richtige genannt', () => {
    const r = pruefeLeitweg('04011000-1234512345-07');
    expect(r.ok).toBe(false); expect(r.fehler).toContain('pz'); expect(r.erwartet).toBe('06');
  });
  it('Aufbau und Land', () => {
    expect(pruefeLeitweg('').fehler).toEqual(['leer']);
    expect(pruefeLeitweg('12345').fehler).toContain('aufbau');
    expect(pruefeLeitweg('17123-45').fehler).toContain('land');
  });
  it('erkennt Leitweg-artige Käuferreferenzen', () => {
    expect(siehtAusWieLeitweg('04011000-12345-03')).toBe(true);
    expect(siehtAusWieLeitweg('-')).toBe(false);
    expect(siehtAusWieLeitweg('PO 4711')).toBe(false);
  });
});
