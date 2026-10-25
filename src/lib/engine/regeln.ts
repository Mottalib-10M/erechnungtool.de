/**
 * Die Regeln der E-Rechnungspflicht als reine Funktionen. Jede Zahl und jedes Datum kommt aus
 * params-2026.json (UStG, UStDV, AO, ERechV, BMF-Schreiben), nie aus dem Code.
 * Tests : tests/regeln.test.ts.
 */
import P from '../../data/params-2026.json';

const PF = P.pflicht, AU = P.ausnahmen, KU = P.kleinunternehmer;

/* ---------------------------------------------------------------- Pflicht-Check */
export type Kunden = 'b2b' | 'gemischt' | 'b2c' | 'ausland';
export interface PflichtIn {
  /** Gesamtumsatz des Vorjahres 2026 nach § 19 Abs. 2 UStG, in Euro. */
  vorjahr: number;
  /** Kleinunternehmerregelung nach § 19 UStG angewandt ? */
  klein: boolean;
  kunden: Kunden;
  /** Nur steuerfreie Umsätze nach § 4 Nr. 8 bis 29 UStG (Ärzte, Vermietung von Wohnraum …) ? */
  steuerfrei: boolean;
}
export type Status = 'pflicht2027' | 'pflicht2028' | 'keine-klein' | 'keine-b2c' | 'keine-ausland' | 'keine-steuerfrei';
export interface PflichtOut {
  /** Empfangspflicht seit dem 1.1.2025 : gilt für jeden inländischen Unternehmer. */
  empfangAb: string;
  status: Status;
  /** Erster Tag, ab dem Leistungen an inländische Unternehmer mit E-Rechnung abzurechnen sind ; null = keine Pflicht. */
  ausstellenAb: string | null;
  /** Bis wann Papier oder PDF (mit Zustimmung) noch geht ; null wenn nie Pflicht. */
  papierBis: string | null;
  ediBis: string;
  ueberGrenze: boolean;
}
export function pflicht(i: PflichtIn): PflichtOut {
  const ueber = i.vorjahr > PF.umsatzgrenze;
  const base = { empfangAb: PF.empfangAb, ediBis: PF.ediBis, ueberGrenze: ueber };
  if (i.klein) return { ...base, status: 'keine-klein', ausstellenAb: null, papierBis: null };
  if (i.kunden === 'b2c') return { ...base, status: 'keine-b2c', ausstellenAb: null, papierBis: null };
  if (i.kunden === 'ausland') return { ...base, status: 'keine-ausland', ausstellenAb: null, papierBis: null };
  if (i.steuerfrei) return { ...base, status: 'keine-steuerfrei', ausstellenAb: null, papierBis: null };
  return ueber
    ? { ...base, status: 'pflicht2027', ausstellenAb: PF.ausstellenAb, papierBis: PF.papierBis }
    : { ...base, status: 'pflicht2028', ausstellenAb: PF.ausstellenAbKlein, papierBis: PF.kleinBis };
}

/* ---------------------------------------------------------------- Welche Rechnung für eine Leistung ? */
export type Form = 'papier' | 'pdf' | 'edi' | 'erechnung';
export type Zulaessig = 'ja' | 'zustimmung' | 'nein';
/** Darf eine Leistung an einen inländischen Unternehmer im Jahr `jahr` mit dieser Form abgerechnet werden ? */
export function formZulaessig(jahr: number, form: Form, vorjahr: number, ausnahme = false): { z: Zulaessig; bis?: string } {
  if (form === 'erechnung') return { z: 'ja' };
  if (ausnahme) return { z: form === 'papier' ? 'ja' : 'zustimmung' };
  const klein = vorjahr <= PF.umsatzgrenze;
  if (form === 'edi') return jahr <= 2027 ? { z: 'zustimmung', bis: PF.ediBis } : { z: 'nein' };
  // Papier ist bis zum Ende der Übergangszeit immer zulässig, PDF (sonstige elektronische Rechnung) nur mit Zustimmung.
  if (jahr <= 2026) return { z: form === 'papier' ? 'ja' : 'zustimmung', bis: PF.papierBis };
  if (jahr === 2027 && klein) return { z: form === 'papier' ? 'ja' : 'zustimmung', bis: PF.kleinBis };
  return { z: 'nein' };
}

/* ---------------------------------------------------------------- Kleinunternehmer */
export interface KleinOut { klein: boolean; grund: 'ok' | 'vorjahr' | 'laufend' }
/** § 19 Abs. 1 UStG seit 2025 : Vorjahr höchstens 25 000 €, laufendes Jahr höchstens 100 000 €. */
export function kleinunternehmer(vorjahr: number, laufend: number): KleinOut {
  if (vorjahr > KU.vorjahr) return { klein: false, grund: 'vorjahr' };
  if (laufend > KU.laufend) return { klein: false, grund: 'laufend' };
  return { klein: true, grund: 'ok' };
}

/* ---------------------------------------------------------------- Ausnahmen je Rechnung */
export type Art = 'normal' | 'kleinbetrag' | 'fahrausweis' | 'steuerfrei' | 'b2c' | 'ausland';
/** Darf diese einzelne Rechnung immer eine sonstige Rechnung (Papier, PDF) sein ? */
export function ausnahme(art: Art, brutto: number): boolean {
  if (art === 'kleinbetrag') return brutto <= AU.kleinbetrag;
  return art !== 'normal';
}

/* ---------------------------------------------------------------- Aufbewahrung */
export type Beleg = 'rechnung' | 'handelsbrief' | 'buecher';
/** Letzter Tag der Aufbewahrung : Ende des Kalenderjahres der Ausstellung + Frist (§ 14b UStG, § 147 AO). */
export function aufbewahrenBis(jahr: number, beleg: Beleg): { jahre: number; bis: string; vernichtenAb: string } {
  const A = P.aufbewahrung;
  const jahre = beleg === 'rechnung' ? A.rechnungJahre : beleg === 'handelsbrief' ? A.handelsbriefJahre : A.buecherJahre;
  return { jahre, bis: `${jahr + jahre}-12-31`, vernichtenAb: `${jahr + jahre + 1}-01-01` };
}

/* ---------------------------------------------------------------- Fehlerarten (BMF 15.10.2025) */
export type Fehler = 'format' | 'geschaeftsregel-inhalt' | 'geschaeftsregel-sonst' | 'inhalt-unerkannt' | 'keiner';
export interface FehlerOut { erechnung: boolean; ordnungsgemaess: boolean; berichtigen: boolean }
/** Rn. 6a, 6b und 35a des BMF-Schreibens vom 15.10.2025. */
export function fehlerFolge(f: Fehler): FehlerOut {
  switch (f) {
    case 'format': return { erechnung: false, ordnungsgemaess: false, berichtigen: true };
    case 'geschaeftsregel-inhalt': return { erechnung: true, ordnungsgemaess: false, berichtigen: true };
    case 'inhalt-unerkannt': return { erechnung: true, ordnungsgemaess: false, berichtigen: true };
    case 'geschaeftsregel-sonst': return { erechnung: true, ordnungsgemaess: true, berichtigen: false };
    default: return { erechnung: true, ordnungsgemaess: true, berichtigen: false };
  }
}

/* ---------------------------------------------------------------- Ist das eine E-Rechnung ? */
export type Datei = 'papier' | 'pdf' | 'scan' | 'word' | 'xrechnung' | 'zugferd-en16931' | 'zugferd-extended' | 'zugferd-basic' | 'zugferd-basicwl' | 'zugferd-minimum' | 'zugferd1' | 'edi';
/** BMF-FAQ : XRechnung und ZUGFeRD ab 2.0.1 sind E-Rechnungen, außer den Profilen MINIMUM und BASIC-WL. */
export function istERechnung(d: Datei): 'ja' | 'nein' | 'edi' {
  if (d === 'edi') return 'edi';
  return ['xrechnung', 'zugferd-en16931', 'zugferd-extended', 'zugferd-basic'].includes(d) ? 'ja' : 'nein';
}

/* ---------------------------------------------------------------- Bund : ERechV */
export type Auftraggeber = 'bund' | 'land' | 'kommune' | 'privat';
/** Muss die Rechnung an eine Stelle des Bundes elektronisch gehen ? (§ 3 Abs. 3 Nr. 1 ERechV : Direktaufträge bis 1 000 € frei) */
export function erechvPflicht(ag: Auftraggeber, netto: number, direktauftrag: boolean): boolean {
  if (ag !== 'bund') return false;
  return !(direktauftrag && netto <= P.erechv.direktauftrag);
}

/* ---------------------------------------------------------------- Rundung */
export const round2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
