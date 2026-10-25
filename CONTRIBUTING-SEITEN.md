# Ajouter ou étoffer une page d'E-Rechnung-Check

Cette notice s'adresse aux agents qui prolongent le site. Lisez-la en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §3, §6, §7, §9.3, §11, §21, §26).

## Principe

Une page = **un fichier** `src/content/guides/<id>.ts` (`defineGuide`). Ce fichier porte l'allemand (`de`) et l'anglais (`en`) côte à côte : slug, titre, description, H1, chapeau, bloc citable (`resume`), FAQ, corps, sources, outil de tête et pages liées. L'`id` est le nom du fichier.

Routes, menus, sitemap, hreflang et schémas lisent ces fichiers. **Ne touchez à aucun fichier du cœur pour ajouter une page.** Ajoutez l'id dans `src/lib/planned.ts`.

## Les outils

| `tool` | Composant | Rôle |
|---|---|---|
| clé de `src/lib/tool-specs.ts` (`pflicht`, `fristen`, `klein`, `archiv`, `folgen`, `fehler`, `istes`, `zf`, `wahl`, `felder`, `empfang`, `versand`, `bund`, `edi`, `lw`) | `calc/SpecTool.tsx` | Simulateurs déclaratifs ; ce sont aussi les seuls admis en mini-simulateur (`h.mini`) |
| `viewer` + `toolArg.mode` = `view` / `check` / `format` / `pdf` | `erech/Viewer.tsx` | Ouvrir, pré-contrôler, reconnaître le format, extraire le XML d'un PDF |
| `creator` + `toolArg.preset` = `zugferd` / `xrechnung` | `erech/Creator.tsx` | Créer une XRechnung (UBL, CII) ou un ZUGFeRD PDF/A-3b |
| `leitweg`, `beispiel` | `erech/Leitweg.tsx`, `erech/Beispiel.tsx` | Leitweg-ID, factures d'exemple |

Les moteurs sont dans `src/lib/engine/` :

- `regeln.ts` : délais du § 27 Abs. 38 UStG ;
- `leitweg.ts` : clé MOD 97-10 ;
- `parse.ts`, `validate.ts`, `build.ts`, `pdf.ts` : lecture, règles EN 16931 et XRechnung, génération UBL, CII et PDF/A-3.

Ce sont des fonctions pures, testées dans `tests/`.

**Rien n'est envoyé** : aucun outil ne fait de requête réseau avec un fichier ou une saisie. Toute nouvelle fonction respecte cette règle et ne retire pas la phrase qui le dit.

## Les données

`src/data/params-2026.json` contient toutes les valeurs juridiques et techniques :

- dates de l'obligation, seuil de 800 000 € ;
- 250 € (§ 33 UStDV), § 19 UStG, 8 ans de conservation, 5 000 € (§ 26a) ;
- ERechV, versions XRechnung et ZUGFeRD ;
- les **sources**, avec `retrieved_at`.

Tout chiffre d'une page vient de là, par `K.P` ou `h.eur` / `h.day` / `h.n`.

## Vérification des fichiers générés

Les fichiers générés sont validés par les outils officiels.

1. Écrire les exemples : `PRUEF_OUT=/chemin npx vitest run tests/build.test.ts`.
2. Lancer `bash scripts/pruefe-erzeugte.sh /chemin`, qui demande Java 17 ou plus récent, le validateur KoSIT avec la configuration XRechnung, et Mustang-CLI.
3. Résultat attendu :
   - 8 XRechnung « acceptable » au validateur KoSIT ;
   - 4 ZUGFeRD conformes PDF/A-3b avec un XML valide (Mustang + veraPDF).

## Mise à jour

1. KoSIT publie chaque année une version de XRechnung, et FeRD publie les versions de ZUGFeRD. Lisez les notes de version, puis mettez à jour `standards` dans `params-2026.json` et les identifiants de spécification si la version change.
2. Relancez `npx vitest run`, la vérification officielle ci-dessus et `npm run check`.
3. Au 1er janvier, créez `params-<année>.json` et relisez les dates de transition.

## Règles propres au site

- **Aucune autorité** : pas de logo du BMF, de la KoSIT, de FeRD ou du Bund ; le site dit qu'il n'est pas un service public.
- **Pas de conseil fiscal individuel**, pas de lien vers un éditeur de logiciel, ni affiliation ni formulaire commercial.
- **Aucun nom de concurrent ni de moteur de recherche** sur le site ; `tests/pages.test.ts` les refuse.
- **Pas de `textarea` ni d'`input type=email`** dans les formulaires des outils, car `check-premier-ecran` les prendrait pour un formulaire de contact. Utilisez `type=text` avec `inputMode="email"`.
- **Licences** : les fichiers de test KoSIT et Mustang (Apache-2.0) restent dans `tests/fixtures/` avec leur LICENSE. DejaVu et le profil sRGB se trouvent dans `public/fonts/pdf/` avec leurs NOTICE.
