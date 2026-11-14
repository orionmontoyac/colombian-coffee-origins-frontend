# Factory runbook

Moved from FACTORY.md so it does not load into every session.

## How to run it

**One-time setup (owner, ~5 minutes)**
```bash
cd ~/code/colombian-coffee-origins-frontend
git switch main && git switch -c factory/website   # its own branch, from the latest home page
npx impeccable install --providers=claude --scope=project  # optional but recommended
chmod +x scripts/factory/*.sh scripts/factory/hooks/*.sh
printf '\n# website factory\n/artifacts/\n/.factory/\n' >> .gitignore
git add -A && git commit -m "Add website factory: agents, spec, tasks, gates"
```

**Option A — interactive (you can watch and step in)**
```bash
FACTORY_MODE=1 claude
```
Then say: *"Run the factory: follow FACTORY.md as the planner, starting at Phase 0."* Approve the plan once. The Stop hook keeps the session going while TASKS.md has unchecked boxes.

**Option B — unattended loop (most reliable for long runs)**
```bash
bash scripts/factory/run.sh                 # up to 40 fresh sessions
MAX_ITERATIONS=10 bash scripts/factory/run.sh
```
Each iteration starts a fresh headless session (`claude -p`), so long runs don't degrade; state lives in TASKS.md and git. Logs go to `.factory/logs/`. Stop with Ctrl+C and rerun to continue.

**Your job after that**
Look at `artifacts/screenshots/`, `artifacts/reports/review-final.md`, the Lighthouse results in `artifacts/lighthouse/`, then fill in `ASSETS.md` and answer the **OWNER** items in `DECISIONS.md`.
