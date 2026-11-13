# FACTORY.md — how the website factory works

A small team of Claude Code subagents builds the Colombian Coffee Origins website from files, not from chat. You (the owner) approve the plan once; the factory works until a command says it is done.

## The files

| File | What it is | Who edits it |
| --- | --- | --- |
| `DESIGN.md` | How it looks: tokens, components, rules. **Single source of truth for design.** | planner (only for rule updates logged in DECISIONS.md) |
| `SPEC.md` | What to build: pages, sections, keywords, schema, shop practices | owner |
| `TASKS.md` | State: phased checklist with checkpoints and Verify commands | planner |
| `DECISIONS.md` | Every call an agent made without asking, with reason and how to undo | any agent (append only) |
| `ASSETS.md` | Every placeholder: what photo/file belongs there and its specs | any agent (append only) |
| `.claude/agents/*.md` | One file per worker: role, owned files, tools, model, how to prove its work | owner |
| `design/boards/*.dc.html` | Exported Claude Design boards (exact sizes, spacing, copy) | read only |
| `scripts/factory/*` | `verify.sh` (all gates), `is-done.sh` (finish line), `run.sh` (unattended loop), checkers, hooks | owner |

## The crew

| Agent | Model | Job |
| --- | --- | --- |
| planner | opus | Picks next tasks, assigns file ownership, runs Verify, ticks, commits |
| foundation-builder | sonnet | Tooling, tokens, fonts, shared components, routes, data (runs alone) |
| page-builder | sonnet | One page per instance; up to 4 in parallel |
| content-seo | sonnet | Metadata, keywords, hreflang, sitemap, robots, OG images, JSON-LD |
| ai-discoverability | sonnet | llms.txt, llms-full.txt, Markdown pages, FAQ, entity facts |
| motion | sonnet | Opening effects, view transitions, interaction states, reduced motion |
| qa | sonnet | Playwright e2e, screenshots vs boards, axe, Colombia-only checks |
| reviewer | opus | Lighthouse, SEO/AI checker, DESIGN.md compliance, code review, impeccable audit |

## Autonomy rules (every agent)

1. Work through `TASKS.md` top to bottom. **Do not ask the owner what to do next.**
2. A box is ticked only when its task's `Verify` command passes. "It looks done" is not done.
3. Stay inside your `Owns` paths. Need a change elsewhere? Report it to the planner as a request; the planner makes a small task for the owner of that file.
4. Blocked? Make the most reasonable decision that fits SPEC.md and DESIGN.md, write it in `DECISIONS.md` (date, decision, why, how to undo), and continue with another unblocked task.
5. Missing photo, logo, number or text from the owner? Use `PlaceholderImage` / a clearly marked placeholder, and add a row to `ASSETS.md`. Never invent facts about real people, prices or reviews.
6. Commit after every ticked task on the `factory/website` branch: `git add -A && git commit -m "<task id>: <summary>"`. Never push, never rewrite history, never touch `.env*`.
7. Read `AGENTS.md` before writing Next.js code: Next 16 differs from training data; check `node_modules/next/dist/docs/`.
8. The factory is finished only when every box in `TASKS.md` is ticked **and** `bash scripts/factory/is-done.sh` exits 0.

## Skills the agents use

- **DESIGN.md** is always read first.
- **impeccable** (if installed in `.claude/skills/impeccable`): page-builder, foundation-builder and motion preload it; they run its setup once and `reference/craft-floor.md` before UI edits; reviewer runs `/impeccable audit` and `/impeccable critique`. Install once with `npx impeccable install --providers=claude --scope=project`.

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

## Safety

- Runs with `--permission-mode acceptEdits` plus the allowlist in `.claude/settings.json`; `git push`, `rm -rf`, `sudo` and `.env` access are denied.
- Never use `--dangerously-skip-permissions` on your main machine. If you want fully hands-off runs, use a container or VM with a copy of the repo.
- The Stop hook only acts when `FACTORY_MODE=1`, and lets a session stop after 25 consecutive blocks so nothing loops forever.
