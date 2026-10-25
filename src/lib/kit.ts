/**
 * Trousse de rédaction (CONTRIBUTING-SEITEN.md) : tout chiffre écrit dans une page vient d'ici, jamais tapé à la main.
 *   K.P                 paramètres datés (params-2026.json)
 *   K.pflicht, K.formZulaessig, K.kleinunternehmer, K.aufbewahrenBis …   moteurs purs (engine/regeln.ts)
 *   K.pruefziffer, K.pruefeLeitweg                                     Leitweg-ID (engine/leitweg.ts)
 *   K.beispiel(s)       factures d'exemple (engine/beispiele.ts), totaux calculés
 *   K.tool(kind, lang, args, valeurs)  lance un simulateur de tool-specs.ts et rend sa carte de résultat
 */
import P from '../data/params-2026.json';
import * as R from './engine/regeln';
import { pruefziffer, pruefeLeitweg, LAENDER_KZ } from './engine/leitweg';
import { beispiel } from './engine/beispiele';
import { runTool } from './tool-specs';
import { LAST_UPDATED } from '../data/site-config';

export const KIT = { P, ...R, pruefziffer, pruefeLeitweg, LAENDER_KZ, beispiel, tool: runTool, LESEDATUM: LAST_UPDATED };
export type Kit = typeof KIT;
