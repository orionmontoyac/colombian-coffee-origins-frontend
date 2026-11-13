#!/usr/bin/env bash
# Stop hook: while the factory runs (FACTORY_MODE=1), refuse to stop while TASKS.md still has unchecked boxes.
# Outside factory mode it does nothing, so normal Claude Code sessions are never trapped.
# Safety valve: after FACTORY_MAX_STOP_BLOCKS consecutive blocks (default 25) it lets the session stop;
# scripts/factory/run.sh then starts a fresh session.
[ "${FACTORY_MODE:-0}" = "1" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
input="$(cat)"
mkdir -p .factory
count=$(cat .factory/stop-count 2>/dev/null || echo 0)
max="${FACTORY_MAX_STOP_BLOCKS:-25}"

next=$(grep -m1 -E '^[[:space:]]*- \[ \]' TASKS.md 2>/dev/null | sed -E 's/^[[:space:]]*//')
if [ -z "$next" ]; then
  echo 0 > .factory/stop-count
  exit 0   # all ticked; is-done.sh / run.sh do the final verify
fi
if [ "$count" -ge "$max" ]; then
  echo 0 > .factory/stop-count
  echo "Stop gate: $max consecutive blocks — allowing stop so a fresh session can continue." >&2
  exit 0
fi
echo $((count + 1)) > .factory/stop-count
open=$(grep -cE '^[[:space:]]*- \[ \]' TASKS.md)
cat >&2 <<MSG
The factory is not finished: $open unchecked item(s) remain in TASKS.md.
Next unchecked item: $next
Continue: delegate it to its owner agent, run its Verify command, tick it only when it passes, commit, and move on.
If you are blocked, make the most reasonable decision, log it in DECISIONS.md, and continue with another unblocked task.
MSG
exit 2
