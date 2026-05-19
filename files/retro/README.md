# Retro mode assets

The retro toggle flips the site into a Cameron's World / GeoCities-era homage.

All animated GIFs are real period artifacts originally sourced from **gifcities.org** (Internet Archive's index of GeoCities GIFs). They've been downloaded to `files/retro/gifs/` and are served locally — no third-party dependencies at runtime.

## Where GIFs are referenced

| File | What it contains |
|---|---|
| `js/retro.js` (`DECO_URLS`) | 80 clip-art GIFs used as floating decorations (planets, ufos, mountains, frogs, dogs, etc.) |
| `_includes/footer.html` | Hit counter, under-construction sign, webring, badges, divider rules, guestbook icons |
| `_layouts/default.html` | Top-of-page rainbow dividers |
| `index.html` | Welcome banner, hobby icons, link arrows, "ALL ABOUT ME" divider rules |

## Adding or replacing GIFs

To find new ones, browse **https://gifcities.org/?q=YOUR+QUERY** and copy the URL of any result. Download it to `files/retro/gifs/` and reference it from the file you're editing.

## Filtering for clip-art-sized GIFs

The decoration pool was filtered to drop banners, HD photos, and broken tiny GIFs using this rule:

- width ≤ 200px AND height ≤ 200px
- aspect ratio ≤ 2.5:1
- size ≥ 1500 bytes

If you add new URLs to `DECO_URLS`, this filter is documented as the criterion.

## Music (not wired)

To add a MIDI player: drop `theme.mid` in this directory and add an opt-in button to the footer that calls `new Audio('/files/retro/theme.mid').play()`. **Do not autoplay** — modern browsers block it and it's user-hostile.

## Re-fetching from gifcities (if you ever wipe the gifs/ folder)

```bash
# from repo root
mkdir -p files/retro/gifs
grep -rohE '/files/retro/gifs/[A-Z0-9]+\.gif' \
  js/retro.js _includes/footer.html _layouts/default.html index.html \
  | sort -u \
  | while read path; do
      name=$(basename "$path")
      [ -f "files/retro/gifs/$name" ] || curl -sL "https://blob.gifcities.org/gifcities/$name" -o "files/retro/gifs/$name"
    done
```
