#!/usr/bin/env bash
# build-tools/ci-build.sh — the build step of the publishing Action.
#
#   1. cleans new photos        (photos.py)
#   2. checks the listings and writes the data files   (content.py)
#   3. rebuilds the pages       (stitch.py)
#   4. saves any files that changed back to the repository
#
# If anything fails, the script stops (non-zero exit), nothing is deployed, and
# the live site keeps its last good version. If someone saved a change while
# this ran, it starts again from the newest version (up to 3 tries).
set -euo pipefail
cd "$(dirname "$0")/.."

BRANCH="${GITHUB_REF_NAME:-$(git rev-parse --abbrev-ref HEAD)}"
REMOTE="${PUBLISH_REMOTE:-origin}"
SAVE_PATHS=(content images js css ./*.html sitemap.xml robots.txt)

for attempt in 1 2 3; do
  python3 build-tools/photos.py
  python3 build-tools/content.py
  python3 build-tools/stitch.py

  git add -A -- "${SAVE_PATHS[@]}" 2>/dev/null || git add -A -- content images js css
  if git diff --cached --quiet; then
    echo "Nothing to save: generated files were already up to date."
    exit 0
  fi
  git commit -q -m "Update generated site files (automatic)"
  if git push -q "$REMOTE" "HEAD:${BRANCH}"; then
    echo "Saved generated files to ${BRANCH}."
    exit 0
  fi
  echo "Another change was saved while this was running. Starting again from the newest version (try ${attempt} of 3)."
  git fetch -q "$REMOTE" "${BRANCH}"
  git reset -q --hard "FETCH_HEAD"
done

echo "Could not save after 3 tries. Run the workflow again."
exit 1
