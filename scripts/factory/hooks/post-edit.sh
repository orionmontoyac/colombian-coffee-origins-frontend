#!/usr/bin/env bash
# PostToolUse hook (Edit|Write): lint the edited TS/TSX file right away so broken code is caught immediately.
# Exit 2 feeds the errors back to Claude; anything else is silent.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log(j.tool_input?.file_path||"")}catch{console.log("")}})')
case "$file" in
  *.ts|*.tsx|*.mjs) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0
out=$(npx --no-install eslint --no-warn-ignored "$file" 2>&1) || { echo "ESLint errors in $file:" >&2; echo "$out" >&2; exit 2; }
exit 0
