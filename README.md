# Brijesh & Sangeeta — wedding invitation site

One rich page: cream and gold with deep maroon bands, a gold arch over the
invitation card, a lit mandap with the couple walking in, a baraat of elephant,
dhol and horse, a vidai at the bottom of the wedding day — and flower petals
falling the whole way down. No photographs: every picture is drawn in inline
SVG, so there is nothing to load.

| Function | When | Time |
| --- | --- | --- |
| Haldi | Saturday 30 January 2027 | 3:00 pm |
| Mehndi | Saturday 30 January 2027 | 7:00 pm |
| DJ Night | Saturday 30 January 2027 | 10:00 pm |
| Shaadi (baraat muhurat) | Sunday 31 January 2027 | 4:00 pm |
| Reception | Tuesday 2 February 2027 | 5:00 pm |

All at the family home, Village Jhaliyahwa, Chandauka, Kohandaur, Pratapgarh,
Uttar Pradesh.

## Open it

Double-click `index.html`, or serve it locally:

```bash
python3 -m http.server 3000
```

No build step, no dependencies — three files, no images.

```
index.html    the page and all the words
styles.css    the design (palette and fonts at the top)
script.js     countdown, menu, RSVP and calendar
```

## What is on the page

- Both sets of parents: Shri Ram Abhilash Yadav & Smt. Anita Yadav (groom's),
  Shri Brijendra Yadav & Smt. Kalawati Devi (bride's).
- The family: Abhimanyu, Shanvi, Anaika, Aisha, Yogesh, Dharmendra, Anmol.
- The five functions with Brijesh's timings, and the order of the wedding day
  (baraat → milni → jaimala → pheras → sindoor → dinner → vidaai) without invented
  clock times.
- The village address with your Google Maps link.
- Three contact numbers as tap-to-call links, and `ybrijesh.005@gmail.com`.
- A countdown to the baraat muhurat, an RSVP reply card with a tick for each
  function, and a calendar file holding all five events.

**Deliberately not on the page:** a "our story" section (it is an arranged
marriage — there is no meet-cute to tell) and a photo gallery (there are no
photographs yet). The nav, footer and structured data reflect that.

## The design

- **Great Vibes** for the names and the script accents, **Cormorant Garamond**
  for headings and prose, **Karla** for the small gold capitals,
  **Tiro Devanagari Hindi** for the Hindi lines.
- The palette in `:root`: `--cream` and `--cream-2` (paper), `--maroon`,
  `--maroon-deep` (the dark bands), `--gold`, `--gold-light`, and warm brown ink.
- The hero is a cream card framed in gold, with an arch springing from the frame
  sides, a lotus and “॥ श्री गणेशाय नमः ॥” at the top, the names in Great Vibes,
  a three-part date bar (Sunday · 31 January 2027 · Jhaliyahwa), and a warm
  mandap scene: two lanterns, marigold strings, and Brijesh and Sangeeta, seen
  from behind, walking into the mandap.
- Laptops and desktops get their own layout: from 960 px wide the hero card opens
  into two columns, the invitation text under its arch on the left and the lit
  mandap beside it on the right. Phones keep the single centred card.
- The two households are shown as two separate families, joined by an ampersand:
  Shri Ram Abhilash Yadav & Smt. Anita Yadav, & Shri Brijendra Yadav & Smt.
  Kalawati Devi.
- The wedding day carries a baraat frieze — elephant with a flag, a dhol player,
  a horse — and the Vidai row closes with the bride leaving, lamp in hand.
- Flower petals fall across the whole page on a `<canvas id="petals">`: they drift,
  they are pushed aside by the cursor, and on a tap or a finger-drag they scatter
  from the point you touched, so the page feels like the flowers on the card.
- Invitations and the reply card are bordered like printed cards; the five
  functions are cream cards, each with its own drawing — haldi bowl, mehndi hand,
  mandap, lantern.
- Motion is quiet but present: the hero arrives in stages, rules extend, sections
  rise on scroll, petals keep drifting, the countdown flashes softly each second.
  Everything stops under `prefers-reduced-motion`, including the petals.
- Print styles included: ⌘P / Ctrl+P gives a clean paper copy.

## If a time or date changes

Change it in three places: the five `strip__item` blocks and the five
`agenda__row` blocks in `index.html`, and `CONFIG.weddingDate` (the countdown)
plus `CONFIG.events` (the calendar file) in `script.js`. All use ISO 8601 with
the Indian offset `+05:30`.

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

The form posts JSON: `names`, `email`, `phone`, `attending`, `events` (an array of
`haldi` / `mehndi` / `dj` / `shaadi` / `reception`), `guests`, `meal`, `diet`, `stay`,
`note`, `sentAt`. It requires at least one function when the answer is yes, so the
counts handed to the kitchen are never guesses.

A guest who accepts also gets **Add all five dates** — one `.ics` file with all
five functions, ready for Google Calendar, Apple Calendar or Outlook.

## Privacy note

The page publishes three mobile numbers and an email address. That is normal for a
wedding card and it is what you asked for — but the site will be public once
hosted. If you would rather not have the numbers indexed, put the page behind a
password on Netlify, or remove the numbers from the `contacts` block and keep the
email only.

## Publishing

Static, so anything works: Netlify or Vercel drag-and-drop, GitHub Pages,
Cloudflare Pages, or Freebuff Sites. Upload `index.html`, `styles.css` and
`script.js`, point a domain at it, and put the URL — or a QR code to it — on the
printed card. These get forwarded in WhatsApp, so an `og:image` (1200×630) is
worth adding later; the tag is commented out in `index.html`.

## Adding photographs later

If photos turn up, add a section back:

```html
<section class="section" id="gallery">
  <div class="wrap">
    <div class="gallery">
      <figure class="gallery__item reveal" data-caption="The haldi">
        <div class="gallery__frame"><img src="photos/haldi.jpg" alt="The haldi" /></div>
        <figcaption>The haldi</figcaption>
      </figure>
    </div>
  </div>
</section>
```

Add a `.gallery` grid to `styles.css` when you do — the old gallery styles were
removed with the section, so the markup above needs its layout written.

## Good to know

- The countdown counts to the baraat muhurat and reads "The baraat arrives in".
- Hindi lines fall back to Nirmala UI / Noto Sans Devanagari, which most Indian
  phones have installed.
- Respects `prefers-reduced-motion`, real labels on every field, announced
  errors and a skip link.

## Pushing to GitHub

The repo is `https://github.com/EchoYogesh/BrijeshWedsSangeeta.git`, already set
as `origin`. If a token is available to the shell:

```bash
GH_TOKEN=… git push -u origin HEAD:main
```

Otherwise upload `index.html`, `styles.css`, `script.js` and `README.md`
directly — the site is plain files, with nothing to build.
