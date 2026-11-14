#!/usr/bin/env bash
# Full quality gate for the website factory. Exit 0 only when everything passes.
# Steps: lint → typecheck → token check → build → start on :3100 → SEO/AI checker → Playwright (e2e + axe) → Lighthouse CI.
# Works with macOS bash 3.2 (no mapfile).
set -uo pipefail
cd "$(dirname "$0")/../.."
PORT="${FACTORY_PORT:-3100}"
export FACTORY_BASE_URL="http://localhost:${PORT}"
mkdir -p artifacts/reports
LOG="artifacts/reports/verify-$(date +%Y%m%d-%H%M%S).log"
status=0
step() { echo; echo "▶ $1"; }
run() { # run "label" cmd...
  local label="$1"; shift
  step "$label"
  if "$@" 2>&1 | tee -a "$LOG"; then echo "✓ $label"; else echo "✗ $label"; status=1; fi
}
has_script() { node -e "process.exit(require('./package.json').scripts?.['$1']?0:1)"; }
need_script() { has_script "$1" || { echo "✗ npm script '$1' missing (task T1.1)"; status=1; return 1; }; }

need_script lint && run "lint" npm run --silent lint
need_script typecheck && run "typecheck" npm run --silent typecheck
need_script check:tokens && run "design tokens" npm run --silent check:tokens

step "build"
if ! npm run --silent build 2>&1 | tee -a "$LOG"; then echo "✗ build failed — stopping"; exit 1; fi

step "start server on :$PORT"
npm run --silent start -- -p "$PORT" >"artifacts/reports/server.log" 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT
for _ in $(seq 1 60); do curl -sf -o /dev/null "$FACTORY_BASE_URL/en" && break; sleep 1; done
curl -sf -o /dev/null "$FACTORY_BASE_URL/en" || { echo "✗ server did not start (see artifacts/reports/server.log)"; exit 1; }

run "SEO + AI checker" node scripts/factory/check-seo-ai.mjs --base "$FACTORY_BASE_URL"

if need_script test:e2e; then
  run "Playwright e2e + axe" env PLAYWRIGHT_BASE_URL="$FACTORY_BASE_URL" npm run --silent test:e2e
fi

if npx --no-install lhci --version >/dev/null 2>&1; then
  step "Lighthouse CI (mobile)"
  LH_LIST=$(node -e "const p=require('./scripts/factory/pages.json');for(const u of p.lighthouse){const pg=p.pages.find(x=>x.path===u)||{};console.log(u+' '+(pg.country||'-'))}")
  ARGS=""
  while read -r u c; do
    [ -n "$u" ] || continue
    if [ "$c" = "-" ]; then
      ARGS="$ARGS --collect.url=$FACTORY_BASE_URL$u"
    else
      # Colombia-only pages need the country header
      npx --no-install lhci autorun --config=lighthouserc.json "--collect.url=$FACTORY_BASE_URL$u" \
        "--collect.settings.extraHeaders={\"x-country\":\"$c\"}" 2>&1 | tee -a "$LOG" || status=1
    fi
  done <<< "$LH_LIST"
  # shellcheck disable=SC2086
  npx --no-install lhci autorun --config=lighthouserc.json $ARGS 2>&1 | tee -a "$LOG" || status=1
else
  echo "✗ Lighthouse CI not installed (npm i -D @lhci/cli — task T1.1)"; status=1
fi

echo
if [ "$status" -eq 0 ]; then echo "✅ verify PASSED (log: $LOG)"; else echo "❌ verify FAILED (log: $LOG)"; fi
exit "$status"
