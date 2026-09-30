#!/bin/bash
source "${VENV:-../../bl}/bin/activate" 2>/dev/null || true
cd "$(dirname "$0")"
mkdir -p final
S=${SAMPLES:-40}
run() { start=$(date +%s); "$@" >> final/log.txt 2>&1; echo "$(date +%T) done $* in $(( $(date +%s)-start ))s" >> final/progress.txt; }
run python abbasid.py -- variant=abbasid res=2400x1350 samples=$S out=final/abbasid.png
run python abbasid.py -- variant=record res=2400x1350 samples=$S out=final/record.png
run python abbasid.py -- variant=ledger res=1600x900 samples=$S out=final/centuries-ledger.png
for e in centuries-printed centuries-accountbook paper mechanical computer enterprise internet cloud automation ai autonomous; do
  run python scenes.py -- era=$e res=1600x900 samples=$S out=final/$e.png
done
echo ALLDONE >> final/progress.txt
