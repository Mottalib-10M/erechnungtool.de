#!/usr/bin/env python3
"""Relecture des sources officielles d'E-Rechnung-Check (UStG, UStDV, AO, ERechV, BMF, KoSIT, FeRD).

Ce que le script fait, à chaque lancement (workflow hebdomadaire .github/workflows/update-data.yml) :
  1. relit chaque source listée dans src/data/params-2026.json → "sources" (gesetze-im-internet.de, BMF,
     KoSIT, FeRD, plateformes du Bund) ;
  2. réduit chaque page à son texte utile (paragraphe de loi, liste de la page) et en calcule l'empreinte SHA-256 ;
  3. compare avec src/data/quellen-stand.json (empreintes et date de la dernière relecture) ;
  4. si rien n'a changé : met à jour la date « geprueft_am » et sort avec le code 0 ;
     si une source a changé : écrit la liste des changements (sortie standard et résumé GitHub), ne touche à
     aucun chiffre et sort avec le code 2, pour qu'une personne relise le texte avant toute nouvelle version.

Pourquoi il ne réécrit pas les chiffres lui-même : les délais du § 27 Abs. 38 UStG, les seuils et les versions
de XRechnung et ZUGFeRD sont établis à la main sur la source primaire (voir /de/methode/). Un changement de loi ou de norme doit être lu,
pas recopié par une machine. Le script garantit qu'aucun changement ne passe inaperçu.

Usage :
  python3 scripts/update-data.py           relecture et comparaison
  python3 scripts/update-data.py --init    enregistre l'état actuel comme référence (après une relecture humaine)
Sources sans API : pages HTML de gesetze-im-internet.de (format stable, un paragraphe par page) et PDF du BMF.
Aucune page d'un site concurrent n'est lue.
"""
import hashlib, html, json, os, re, sys, urllib.request
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARAMS = os.path.join(ROOT, 'src', 'data', 'params-2026.json')
STAND = os.path.join(ROOT, 'src', 'data', 'quellen-stand.json')
UA = 'Mozilla/5.0 (compatible; E-Rechnung-Check-Quellenpruefung)'


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers.get('Content-Type', '')


def text_of(raw, ctype, url):
    """Texte utile d'une source, sans menus ni horodatage, pour une empreinte stable."""
    if raw[:4] == b'%PDF' or 'pdf' in ctype:
        return pdf_text(raw)
    s = raw.decode('utf-8', 'replace')
    if 'gesetze-im-internet.de' in url:
        # Le texte de la norme est dans les blocs « jnhtml » ; le reste (menus, pied) change sans que la loi change.
        # En-tête de la norme (titre, « weggefallen ») et texte, jusqu'au pied de page.
        i = s.find('class="jnheader"'); j = s.find('class="footerul"')
        s = s[i if i >= 0 else 0: j if j > i else len(s)]
    else:
        m = re.search(r'<main\b.*?</main>', s, re.S | re.I)
        s = m.group(0) if m else s
        s = re.sub(r'<(script|style|nav|header|footer)\b.*?</\1>', ' ', s, flags=re.S | re.I)
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()


def pdf_text(raw):
    """Texte du PDF par pypdf (pip install pypdf), le même en local et dans le workflow."""
    import io
    from pypdf import PdfReader
    return '\n'.join((pg.extract_text() or '') for pg in PdfReader(io.BytesIO(raw)).pages)


def main():
    init = '--init' in sys.argv
    params = json.load(open(PARAMS, encoding='utf-8'))
    old = json.load(open(STAND, encoding='utf-8')) if os.path.exists(STAND) else {'quellen': {}}
    new, changes, errors = {}, [], []
    for key, src in params['sources'].items():
        url = src['url']
        try:
            raw, ctype = fetch(url)
        except Exception as e:  # une source injoignable ne bloque pas les autres
            errors.append(f'{key}: {url} nicht erreichbar ({e})')
            if key in old['quellen']: new[key] = old['quellen'][key]
            continue
        txt = text_of(raw, ctype, url)
        entry = {'url': url, 'sha256': hashlib.sha256(txt.encode('utf-8')).hexdigest(), 'zeichen': len(txt)}
        prev = old['quellen'].get(key)
        if prev and prev['sha256'] != entry['sha256']:
            changes.append(f'{key}: Text geändert ({prev["zeichen"]} → {entry["zeichen"]} Zeichen) – {url}')
        elif not prev and not init:
            changes.append(f'{key}: neue Quelle ohne Referenz – mit --init nach Prüfung aufnehmen')
        new[key] = entry

    report = []
    if errors: report += ['Nicht erreichbar:'] + [f'- {e}' for e in errors]
    if changes and not init: report += ['Geänderte Quellen (bitte lesen, Zahlen und Regeln von Hand anpassen, dann --init):'] + [f'- {c}' for c in changes]
    if not report: report = [f'{len(new)} Quellen geprüft, keine Änderung.']
    print('\n'.join(report))
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        open(os.environ['GITHUB_STEP_SUMMARY'], 'a').write('\n'.join(report) + '\n')

    if changes and not init:
        sys.exit(2)
    out = {'_lisezmoi': 'Empreintes des sources officielles, écrites par scripts/update-data.py. Ne pas éditer à la main.',
           'geprueft_am': date.today().isoformat(), 'quellen': new}
    json.dump(out, open(STAND, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(STAND, 'a').write('\n')


if __name__ == '__main__':
    main()
