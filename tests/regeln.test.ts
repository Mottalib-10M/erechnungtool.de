import { describe, it, expect } from 'vitest';
import { pflicht, formZulaessig, kleinunternehmer, ausnahme, aufbewahrenBis, fehlerFolge, istERechnung, erechvPflicht } from '../src/lib/engine/regeln';
import P from '../src/data/params-2026.json';

describe('Pflicht-Check (§ 14, § 27 Abs. 38 UStG)', () => {
  it('über 800 000 € : E-Rechnung ab 1.1.2027', () => {
    const r = pflicht({ vorjahr: 900000, klein: false, kunden: 'b2b', steuerfrei: false });
    expect(r.status).toBe('pflicht2027'); expect(r.ausstellenAb).toBe('2027-01-01'); expect(r.papierBis).toBe('2026-12-31');
  });
  it('genau 800 000 € : noch Übergang bis Ende 2027', () => {
    const r = pflicht({ vorjahr: P.pflicht.umsatzgrenze, klein: false, kunden: 'gemischt', steuerfrei: false });
    expect(r.status).toBe('pflicht2028'); expect(r.ausstellenAb).toBe('2028-01-01');
  });
  it('Kleinunternehmer : nie Pflicht zum Ausstellen, aber Empfang seit 2025', () => {
    const r = pflicht({ vorjahr: 20000, klein: true, kunden: 'b2b', steuerfrei: false });
    expect(r.status).toBe('keine-klein'); expect(r.ausstellenAb).toBeNull(); expect(r.empfangAb).toBe('2025-01-01');
  });
  it('nur Privatkunden, Ausland, steuerfrei : keine Pflicht', () => {
    expect(pflicht({ vorjahr: 2e6, klein: false, kunden: 'b2c', steuerfrei: false }).status).toBe('keine-b2c');
    expect(pflicht({ vorjahr: 2e6, klein: false, kunden: 'ausland', steuerfrei: false }).status).toBe('keine-ausland');
    expect(pflicht({ vorjahr: 2e6, klein: false, kunden: 'b2b', steuerfrei: true }).status).toBe('keine-steuerfrei');
  });
});
describe('Form einer Rechnung je Leistungsjahr', () => {
  it('2026 : Papier ja, PDF mit Zustimmung', () => {
    expect(formZulaessig(2026, 'papier', 5e6).z).toBe('ja');
    expect(formZulaessig(2026, 'pdf', 5e6).z).toBe('zustimmung');
  });
  it('2027 : nur bis 800 000 € Vorjahresumsatz', () => {
    expect(formZulaessig(2027, 'pdf', 500000).z).toBe('zustimmung');
    expect(formZulaessig(2027, 'pdf', 900000).z).toBe('nein');
    expect(formZulaessig(2027, 'edi', 900000).z).toBe('zustimmung');
  });
  it('2028 : nur E-Rechnung, EDI nur wenn EN-16931-tauglich', () => {
    expect(formZulaessig(2028, 'papier', 1000).z).toBe('nein');
    expect(formZulaessig(2028, 'edi', 1000).z).toBe('nein');
    expect(formZulaessig(2028, 'erechnung', 1000).z).toBe('ja');
    expect(formZulaessig(2028, 'papier', 1000, true).z).toBe('ja');
  });
});
describe('Kleinunternehmer, Ausnahmen, Aufbewahrung', () => {
  it('§ 19 : 25 000 / 100 000 €', () => {
    expect(kleinunternehmer(25000, 100000).klein).toBe(true);
    expect(kleinunternehmer(25001, 0).grund).toBe('vorjahr');
    expect(kleinunternehmer(1000, 100001).grund).toBe('laufend');
  });
  it('Kleinbetrag bis 250 € brutto', () => {
    expect(ausnahme('kleinbetrag', 250)).toBe(true);
    expect(ausnahme('kleinbetrag', 250.01)).toBe(false);
    expect(ausnahme('fahrausweis', 900)).toBe(true);
    expect(ausnahme('normal', 10)).toBe(false);
  });
  it('8 Jahre ab Ende des Ausstellungsjahres', () => {
    expect(aufbewahrenBis(2025, 'rechnung')).toEqual({ jahre: 8, bis: '2033-12-31', vernichtenAb: '2034-01-01' });
    expect(aufbewahrenBis(2025, 'buecher').bis).toBe('2035-12-31');
  });
});
describe('Fehlerarten, Format, ERechV', () => {
  it('BMF 15.10.2025 Rn. 6a/6b/35a', () => {
    expect(fehlerFolge('format').erechnung).toBe(false);
    expect(fehlerFolge('geschaeftsregel-sonst').ordnungsgemaess).toBe(true);
    expect(fehlerFolge('geschaeftsregel-inhalt').ordnungsgemaess).toBe(false);
  });
  it('ZUGFeRD MINIMUM und BASIC WL sind keine E-Rechnung', () => {
    expect(istERechnung('zugferd-minimum')).toBe('nein');
    expect(istERechnung('zugferd-basicwl')).toBe('nein');
    expect(istERechnung('zugferd-basic')).toBe('ja');
    expect(istERechnung('pdf')).toBe('nein');
  });
  it('Direktauftrag bis 1 000 € frei', () => {
    expect(erechvPflicht('bund', 1000, true)).toBe(false);
    expect(erechvPflicht('bund', 1000.01, true)).toBe(true);
    expect(erechvPflicht('land', 50000, false)).toBe(false);
  });
});
