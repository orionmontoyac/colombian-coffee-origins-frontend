#!/usr/bin/env bash
# Exit 0 only when the factory is finished: no unchecked boxes in TASKS.md AND the full verify passes.
cd "$(dirname "$0")/../.."
open=$(grep -cE '^[[:space:]]*- \[ \]' TASKS.md || true)
if [ "$open" -gt 0 ]; then
  echo "Not done: $open unchecked item(s) in TASKS.md. Next: $(grep -m1 -E '^[[:space:]]*- \[ \]' TASKS.md | sed -E 's/^[[:space:]]*//')"
  exit 1
fi
bash scripts/factory/verify.sh || { echo "Not done: verify failed."; exit 1; }
echo "Factory DONE."
