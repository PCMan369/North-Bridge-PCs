#!/usr/bin/env bash
# build-tools/assemble-site.sh — copies ONLY the public website files into _site/
# (no scripts, docs, content sources or tests).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site && mkdir -p _site
cp ./*.html _site/
for f in sitemap.xml robots.txt favicon.ico CNAME; do [ -f "$f" ] && cp "$f" _site/ || true; done
cp -r css js images _site/
[ -d videos ] && cp -r videos _site/ || true
# the data files for the website are in js/; drop the build-time-only partial sources
rm -rf _site/js/partials
touch _site/.nojekyll
MB=$(( $(du -sk _site | cut -f1) / 1024 ))
echo "Assembled _site/ with $(find _site -type f | wc -l) files, ${MB} MB."
# GitHub Pages sites are limited to 1 GB: warn early, stop before it would fail.
if [ "$MB" -gt 950 ]; then
  echo "PROBLEM: the website is ${MB} MB; GitHub Pages allows 1 GB. Remove unused photos/clips (ask Claude)."; exit 1
elif [ "$MB" -gt 700 ]; then
  echo "WARNING: the website is ${MB} MB; GitHub Pages allows 1 GB. Time to tidy unused photos and clips."
fi
