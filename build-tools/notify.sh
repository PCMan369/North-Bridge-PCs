#!/usr/bin/env bash
# build-tools/notify.sh — used by the publishing Action to tell the owner when a publish
# fails, and to close that notice when a later publish works.
#
#   notify.sh failed [logfile]    open (or add to) a "Website publish failed" issue that @mentions
#                                 the repository owner, so GitHub sends a notification
#   notify.sh fixed               close the open notice, if any
#
# Needs the GitHub CLI (`gh`, already on GitHub's runners) and GH_TOKEN. Environment: OWNER
# (who to mention) and RUN_URL (link to the run). It never fails the job: a missing
# notification must not hide the real result.
set -uo pipefail

MODE="${1:-}"
LOG="${2:-}"
TITLE="Website publish failed"
OWNER="${OWNER:-}"
RUN_URL="${RUN_URL:-}"

open_issue() {
  gh issue list --state open --search "\"${TITLE}\" in:title" --json number --jq '.[0].number // empty' 2>/dev/null || true
}

EXISTING="$(open_issue)"

if [ "$MODE" = "failed" ]; then
  PROBLEMS=""
  if [ -n "$LOG" ] && [ -f "$LOG" ]; then
    PROBLEMS="$(grep -E '^  - |^PROBLEM|could not|Could not' "$LOG" | head -20 || true)"
    [ -n "$PROBLEMS" ] || PROBLEMS="$(tail -n 15 "$LOG")"
  fi
  [ -n "$PROBLEMS" ] || PROBLEMS="(No details were captured. Open the run below to see what happened.)"
  BODY="$(printf '@%s The website did not publish. **The live site is unchanged**, so visitors still see the last good version.\n\nWhat the check said:\n\n```\n%s\n```\n\nRun: %s\n\nFix the item in the admin and save again. This notice closes itself when a publish succeeds.' "$OWNER" "$PROBLEMS" "$RUN_URL")"
  if [ -n "$EXISTING" ]; then
    gh issue comment "$EXISTING" --body "$BODY" || echo "Could not add the notification comment."
  else
    gh issue create --title "$TITLE" --body "$BODY" || echo "Could not create the notification (are Issues switched on for this repository?)."
  fi
elif [ "$MODE" = "fixed" ]; then
  if [ -n "$EXISTING" ]; then
    gh issue comment "$EXISTING" --body "The latest publish worked, so the site is up to date. Closing this notice. ${RUN_URL}" || true
    gh issue close "$EXISTING" || true
  fi
else
  echo "usage: notify.sh failed [logfile] | fixed"
fi
exit 0
