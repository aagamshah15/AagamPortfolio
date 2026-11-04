# CLAUDE.md

Personal portfolio site for Aagam Shah. Static, no build step, no dependencies.

## Deploy

GitHub Pages serves `main` at root → https://aagamshah15.github.io/AagamPortfolio/
Pushing to `main` deploys. There is no CI, no staging.

To preview locally: `python3 -m http.server 8777` and open `http://localhost:8777/index.html`.

## What's actually live

`index.html` is the entire site — a single page, custom-built. It loads exactly two
local assets:

- `assets/css/style.css` — all styling
- `assets/js/main.js` — all behavior

Everything else under `assets/` (`main.css`, `noscript.css`, `custom.css`,
`fontawesome-all.min.css`, `sass/`, `jquery.min.js`, `util.js`, `browser.min.js`,
`breakpoints.min.js`, `webfonts/`) and most of `images/` (`avatar.png`, `bg.jpg`,
`overlay.png`, `pic0*.jpg`) are dead remnants of the HTML5-UP "Dimension" template
this started from. Nothing references them. Don't edit them expecting a change.

Sections, in order: `#about`, `#experience`, `#education`, `#work`, `#contact`.

## Design system

Terminal / code-editor aesthetic, settled after two full revamps. Don't redesign it
without being asked.

- Hero is an editor window rendering a Python-flavored identity object with a
  typewriter reveal (`#editorBody`).
- Stats read as `//` code comments; timelines use `$` prompts; section eyebrows are
  `$ cat experience.log`-style commands; contact links are terminal commands.
- Type: JetBrains Mono (`--font-mono`) + Inter (`--font-body`), from Google Fonts.
- Motion: typewriter, scroll-tied word-fill pull quote (`#pullQuote`), section
  reveals, floating pill nav (`#navPill`). All in `main.js`, one shared scroll handler.
- Nav: the floating pill (appears after scrolling past the top nav) is deliberately
  large: 1.02rem links, active-section underline, its own theme button. It stays
  visible on phones (the mark and theme label hide; `edu` drops under 400px). Theme
  buttons are bound by the `.theme-btn` class, not an id, so there can be several.
- Work: a 5-slide carousel (`#carousel`) with file-tab navigation, one slide per
  shipped project with a real screenshot in `images/projects/`. Projects without
  a live demo or public proof go in the collapsible `ls ~/projects --all` list
  below it, never in the carousel. Vigil's slide swaps dark/light screenshots
  through the `--show-dark` / `--show-light` tokens.

**Theming is a hard requirement.** Three states cycled by `#themeBtn`: system / light
/ dark. Colors are tokens on `:root`, redefined under
`@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`
and again under `:root[data-theme="dark"]`. Any new color goes in all three blocks or
one theme breaks.

### Taste

Likes: bold, prominent type; resume-as-website where every claim links to visible
proof; short nav; motion that feels alive.

Dislikes: thin or generic fonts; long info-heavy navs; decorative background patterns
unrelated to content (a blueprint grid was built and rejected); **fake links or
fabricated project imagery**.

Where a repo is private or under NDA, say so honestly — `.proj-proof.locked` renders
"independent research — no repo" style labels. Never invent a URL to fill a slot.

## Content rules

- `final_content.txt` is the source of truth for bio, roles, projects and links.
- `content.txt` is an older near-duplicate. Superseded — don't pull from it.
- `README.md` still describes an older Tableau/data-analytics portfolio and does not
  match the live site. Stale.
- Aagam's current consulting client is under NDA. **Never name the client** in any
  generated copy; refer to it as a B2B client.
- Frame him as a data & AI product builder (LLM pipelines, agents, PRDs), not a
  generic analyst or SWE.

## Gotchas

- **Images:** use the `*-web.jpg` copies (`photo-web.jpg`, `bangalore-web.jpg`,
  `champaign-web.jpg`, `manipal-web.jpg`) — 1200px, sips-optimized. The originals are
  multi-MB, and `champaign.jpg` is actually a HEIC despite the extension, so it will
  not render in a browser. Never reference originals from HTML.
- **Tableau embed:** the embed URL bakes in the *sheet* name, not just the workbook
  (`/views/<Workbook>/<SheetName>`). Renaming the dashboard tab inside Tableau Public
  silently breaks the iframe with "Where's the viz?" — this already happened once when
  the sheet was renamed off `Dashboard1`. The URL appears in four places in
  `index.html`; change all four together.
- **Cache busting:** `index.html` loads `style.css?v=YYYYMMDD` and `main.js?v=YYYYMMDD`.
  Bump the date whenever either file changes, or browsers (and Pages' ~10 min cache)
  serve the new HTML with the old CSS/JS and the carousel and theme buttons break.
- **Browser automation:** tabs driven by automation report
  `visibilityState: 'hidden'`, so `requestAnimationFrame` never fires and scroll-tied
  animations appear frozen. Screenshots of the typewriter / pull quote / reveals will
  mislead you. Verify motion another way.

## Workflow

For anything that changes the look, iterate in a published artifact mockup and get
sign-off before touching `index.html`. Two full implementations were thrown away by
going straight to code.
