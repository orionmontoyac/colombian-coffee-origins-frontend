#!/usr/bin/env bash
# Runs the factory unattended: a fresh headless Claude session per iteration, until is-done passes
# or MAX_ITERATIONS is reached. State lives in files (TASKS.md, DECISIONS.md, git), not in chat.
#
# Usage:  bash scripts/factory/run.sh            (default 40 iterations)
#         MAX_ITERATIONS=10 bash scripts/factory/run.sh
# Stop anytime with Ctrl+C; rerun to continue where it left off.
set -uo pipefail
cd "$(dirname "$0")/../.."
MAX_ITERATIONS="${MAX_ITERATIONS:-40}"
mkdir -p .factory/logs
export FACTORY_MODE=1   # turns on the Stop hook gate (see .claude/settings.json)

PROMPT='You are running the website factory unattended. Read FACTORY.md and follow it exactly.
Act as the planner: read TASKS.md, DECISIONS.md and git log, pick the next unchecked task(s) (parallel only
when their Owns paths do not overlap), delegate each to its owner subagent from .claude/agents/, then run the
task Verify command yourself. Tick boxes only when Verify passes, commit after each ticked task, and keep going.
Never ask the human; record decisions in DECISIONS.md and missing assets in ASSETS.md.'

for i in $(seq 1 "$MAX_ITERATIONS"); do
  if bash scripts/factory/is-done.sh >/dev/null 2>&1; then
    echo "✅ Factory finished after $((i-1)) iteration(s)."; exit 0
  fi
  echo "=== Iteration $i / $MAX_ITERATIONS — next: $(grep -m1 -E '^[[:space:]]*- \[ \]' TASKS.md | sed -E 's/^[[:space:]]*//') ==="
  claude -p "$PROMPT" --permission-mode acceptEdits --output-format text \
    2>&1 | tee ".factory/logs/iteration-$(printf '%03d' "$i").log"
  echo "0" > .factory/stop-count   # reset the Stop-hook counter between iterations
done
echo "⚠ Reached MAX_ITERATIONS=$MAX_ITERATIONS without finishing. Check TASKS.md, DECISIONS.md and .factory/logs/."
exit 1
