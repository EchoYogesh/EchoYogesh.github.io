# Brijesh &amp; Sangeeta — wedding invitation site

A single, quiet page: ivory paper, ink, one antique-brass accent, hairline rules,
and the invitation set the traditional way — both sets of parents, the family,
then the couple, then the three functions.

**Haldi** Saturday 30 January 2027 · **Shaadi** Sunday 31 January 2027 ·
**Reception** Tuesday 2 February 2027 — all at the family home, Village
Jhaliyahwa, Chandauka, Kohandaur, Pratapgarh, Uttar Pradesh.

## Open it

Double-click `index.html`, or serve it locally:

```bash
python3 -m http.server 3000
```

No build step, no dependencies — three files plus your photographs.

```
index.html    the page and all the words
styles.css    the design (palette and fonts at the top)
script.js     countdown, menu, lightbox, RSVP and calendar
photos/       put photographs here
```

## What is real on the page

- Both sets of parents: Shri Ram Abhilash Yadav & Smt. Anita Yadav (groom's),
  Shri Brijendra Yadav & Smt. Kalawati Devi (bride's).
- The family line: Abhimanyu, Shanvi, Anaika, Aisha, Yogesh, Dharmendra and
  Anmol.
- The three dates, the village address and your Google Maps link.
- Three contact numbers as tap-to-call links, and `ybrijesh.005@gmail.com`.
- The shaadi evening's order of events at the times you gave.

**One thing to confirm:** the family names sit under a neutral heading,
"With our family". If they should read "brothers and sisters" or name a
particular side, change that one heading in the `family` block in `index.html`.

## What to confirm before sharing

1. **Times** — haldi 10:00, baraat 6:00 pm, muhurat 7:30 pm, reception 7:00 pm.
   Change them in the three `agenda__row` blocks, the `schedule` list, and in
   `CONFIG.weddingDate` + `CONFIG.events` in `script.js`.
2. **The story section** — it now follows the real shape: a guest introduced them
   in 2025, it was settled in 2026, and they marry in 2027. The prose is still
   written by me — read it and make it theirs.
3. **Photographs** — the gallery shows fine-line motifs for now (see below).
4. **A PIN code**, if you want one in the address — add it in the map card, the
   footer and the JSON-LD block.

Anything still marked `EDIT ME` in `index.html` is a comment pointing at these.

## The design

Deliberately restrained, because that is what was asked for:

- **Cormorant Garamond** for the display setting, **Karla** for small caps and
  body, **Tiro Devanagari Hindi** for the Hindi lines.
- Five variables in `:root` in `styles.css` drive the whole page: `--paper`
  (ivory), `--ink`, `--ink-soft`, `--brass` (the only accent) and `--ink-deep`
  (the two dark bands).
- The hero is framed with a double hairline, like a letterpress card. Dividers
  are a 1px rule with a small rotated square. No patterns, no gradients, no
  ornaments beyond that — on purpose.
- Motion is quiet but present: the hero arrives in stages, the hairline rules
  draw themselves in, sections rise as you scroll, photographs settle, the
  countdown flashes softly each second, and the hero fades as you scroll away.
  All of it switches off under `prefers-reduced-motion`.
- The RSVP is a bordered reply card with tick lists, not boxed buttons — it
  should read like something you post back, not a checkout.
- Print styles are included: ⌘P / Ctrl+P gives a clean paper copy.

## Photos

The gallery currently holds six hand-drawn line motifs — a chai cup, a paisley,
a dinner table, a mandap, mehndi and marigolds — drawn at 34% opacity so they
read as illustration rather than as broken images.

To use real photographs:

1. Save pictures into `photos/` (about 1400 px on the long edge, JPG, ~200 KB
   each keeps the page quick).
2. In each `<figure>`, replace the `<svg>…</svg>` inside `.gallery__frame` with:

```html
<img src="photos/haldi-morning.jpg" alt="The haldi, in the courtyard" />
```

The frame crops to a square — the `--tall` and `--wide` variants are 4:5 and 2:1
— and the caption comes from `data-caption`. The lightbox picks up real images
with no further change.

## RSVP

By default the form validates, then opens the guest's mail app with a reply
pre-filled to `ybrijesh.005@gmail.com`. Nothing to set up, nothing to pay for.

To collect replies automatically, paste a form endpoint into
`CONFIG.rsvpEndpoint` in `script.js`:

- **Formspree** (`https://formspree.io/f/xxxxxx`) or **Basin** — free tier is
  plenty for a wedding.
- **Google Sheet** — publish an Apps Script web app that appends a row. Usually
  the one a family wants, because the sheet can go straight to the cook.
- **Netlify Forms** — add `netlify` and a `name` attribute to the `<form>`.

The form posts JSON: `names`, `email`, `phone`, `attending`, `events` (array of
`haldi` / `shaadi` / `reception`), `guests`, `meal`, `diet`, `stay`, `note`,
`sentAt`. It insists on at least one function when the answer is yes, so the
counts handed to the kitchen are never guesses.

A guest who accepts also gets **Add all three dates** — one `.ics` file with all
three functions for Google Calendar, Apple Calendar or Outlook.

## Privacy note

The page publishes three mobile numbers and an email address. That is normal for
a wedding card and it is what you asked for — but the site will be public once
hosted. If you would rather not have the numbers indexed, put the page behind a
password on Netlify, or remove the numbers from the `contacts` block and keep
the email only.

## Publishing

Static, so anything works: Netlify or Vercel drag-and-drop, GitHub Pages,
Cloudflare Pages, or Freebuff Sites. Upload `index.html`, `styles.css`,
`script.js` and `photos/`, point a domain at it, and put the URL — or a QR code
to it — on the printed card. Most of these get forwarded in WhatsApp, so an
`og:image` (1200×630) is worth adding; the tag is commented out in `index.html`.

## Good to know

- The countdown counts to the muhurat, not to midnight, and reads
  "The pheras begin in".
- Hindi lines fall back to Nirmala UI / Noto Sans Devanagari, which most Indian
  phones have installed.
- Respects `prefers-reduced-motion`, has real labels on every field, announced
  errors, a keyboard-operable gallery and a skip link.
