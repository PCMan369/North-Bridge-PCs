#!/usr/bin/env bash
# build-tools/assemble-site.sh — copies ONLY the public website files into _site/
# (no scripts, docs, content sources or tests).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site && mkdir -p _site
cp ./*.html _site/
for f in sitemap.xml robots.txt favicon.ico CNAME; do [ -f "$f" ] && cp "$f" _site/ || true; done
cp -r css js images _site/
# the data files for the website are in js/; drop the build-time-only partial sources
rm -rf _site/js/partials
touch _site/.nojekyll
echo "Assembled _site/ with $(find _site -type f | wc -l) files."
