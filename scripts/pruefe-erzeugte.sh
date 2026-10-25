#!/usr/bin/env bash
# Prüft die vom Ersteller erzeugten Beispieldateien mit den amtlichen Werkzeugen.
#   PRUEF_OUT=/tmp/erech npx vitest run tests/build.test.ts
#   KOSIT_DIR=… MUSTANG_JAR=… JAVA=… bash scripts/pruefe-erzeugte.sh /tmp/erech
# KOSIT_DIR : Ordner mit validator-<v>-standalone.jar und der XRechnung-Konfiguration (conf/scenarios.xml)
# MUSTANG_JAR : Mustang-CLI-<v>.jar (enthält veraPDF)
set -euo pipefail
OUT="${1:?Ordner mit den erzeugten Dateien}"
JAVA="${JAVA:-java}"
: "${KOSIT_DIR:?KOSIT_DIR setzen}" "${MUSTANG_JAR:?MUSTANG_JAR setzen}"
JAR=$(ls "$KOSIT_DIR"/validator-*-standalone.jar | head -1)
mkdir -p "$OUT/kosit"
echo "--- KoSIT (XRechnung, UBL und CII)"
"$JAVA" -jar "$JAR" -s "$KOSIT_DIR/conf/scenarios.xml" -r "$KOSIT_DIR/conf" -o "$OUT/kosit" "$OUT"/*_ubl.xml "$OUT"/*_XRECHNUNG_cii.xml | grep -E '^Acceptable:' || true
echo "--- Mustang + veraPDF (ZUGFeRD-PDF)"
for f in "$OUT"/*.pdf; do
  r=$("$JAVA" -jar "$MUSTANG_JAR" --action validate --source "$f" --no-notices 2>/dev/null | grep -o '<summary status="[a-z]*"' | head -1 || true)
  echo "$(basename "$f"): $r"
done
