#!/usr/bin/env bash
# build-tools/backup.sh — makes a backup zip of everything the admin can change and keeps it as a
# GitHub Release. The newest 8 backups are kept; older ones are deleted.
#
#   backup.sh            run from the repository root (used by the weekly "Backup" workflow)
#
# The zip holds: content/ (listings, part boxes, photo descriptions), images/, videos/ (if any),
# js/data/ (events, FAQ, settings), and .pages.yml. Needs `zip` and the GitHub CLI with GH_TOKEN.
set -euo pipefail
cd "$(dirname "$0")/.."

KEEP="${BACKUP_KEEP:-8}"
STAMP="$(date -u +%Y-%m-%d-%H%M)"
TAG="backup-${STAMP}"
OUT="${RUNNER_TEMP:-/tmp}/north-bridge-backup-${STAMP}.zip"

EXTRA=""; [ -d videos ] && EXTRA="videos"
zip -qr "$OUT" content images $EXTRA js/data .pages.yml
echo "Backup file: $OUT ($(du -h "$OUT" | cut -f1))"

gh release create "$TAG" "$OUT" --prerelease \
  --title "Backup ${STAMP} (UTC)" \
  --notes "Automatic backup of the listings, part boxes, photos and data files. To restore, download the zip, unzip it over the project folder, then commit and push (see ADMIN_SETUP.md, 'Restore from a backup')."

# keep the newest $KEEP backups
gh release list --limit 100 --json tagName --jq '.[].tagName' \
  | grep '^backup-' | tail -n +"$((KEEP + 1))" \
  | while read -r old; do
      echo "Removing old backup $old"
      gh release delete "$old" --yes --cleanup-tag
    done
echo "Backup done."
