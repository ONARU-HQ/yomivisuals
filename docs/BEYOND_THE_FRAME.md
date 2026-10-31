# Beyond the Frame: how this site is built

Think of it like Photoshop: the site is a stack of layers. Each layer has one job, and you almost never edit two at once.

| Layer | Job | Where it lives |
|---|---|---|
| 01 Content | Photos, set names, bio facts, lab entries | `src/content/*`, `src/lib/film/portfolio.ts`, `public/portfolio/` |
| 02 Design system | Colours, type, spacing, motion timings | `src/styles.css` (`--film-*`, `--m-*`), `src/lib/film/motion.ts` |
| 03 Components | Nav, footer, photo, lightbox, form, app shell | `src/components/btf/*` |
| 04 Application logic | Routes, filtering, form submit | `src/routes/*` |
| 05 Motion | Scroll timelines | `src/hooks/use-film-scroll.ts`, the `useFilmScroll(...)` calls in Hero, ActI, LayerLab, Acts |
| 06 3D | The gallery room | `src/components/btf/GalleryScene.tsx` |
| 07 Integrations | Studio link, Instagram, leads table, SEO helper | `src/content/site.ts`, `LeadForm.tsx`, `src/lib/film/seo.ts` |
| 08 Infrastructure | Build and deploy | `.github/workflows/deploy-cloudflare.yml`, `vite.config.ts` |

## How the homepage film works
Each act is a tall section with a sticky stage (`.film-track` + `.film-stage` in `styles.css`). GSAP ScrollTrigger scrubs a timeline as you scroll. Both the CSS and the JS only switch on when the screen is at least 768px wide AND the visitor has not asked for reduced motion; otherwise the same content shows as a normal stacked page. The 3D gallery additionally needs a 1024px+ screen and WebGL.

## Common jobs
- **Change the hero photo:** edit `PICKS.hero` in `src/lib/film/portfolio.ts`.
- **Add/replace photos:** put originals in a folder, run `node scripts/build-portfolio.mjs <folder>`; it writes the WebP sizes and the manifest. Originals are never modified.
- **Add a journal entry:** add an object to `ENTRIES` in `src/content/journal.ts`. It appears at `/journal` and `/journal/<slug>` automatically.
- **Add a lab experiment:** add to `EXPERIMENTS` in `src/content/lab.ts`.
- **Change motion speed:** `src/lib/film/motion.ts` (JS) and `--m-*` in `styles.css` (CSS).

## Debugging
- Animation not running? Check you are at 768px+ and reduced-motion is off (OS setting).
- Gallery shows a carousel instead of 3D? Screen under 1024px, reduced motion on, or WebGL unavailable. That is by design.
- Form says it failed? The `leads` insert is rejected: check Supabase RLS on `leads`.

## Exercises
1. Change the Act I headline and see it update.
2. Swap one `PICKS.gallery` id for another photo.
3. Add a fifth layer ("Texture") to `LayerLab.tsx`: one entry in `LAYERS`, one overlay div, one CSS rule.


## Update: Mondragon-style redesign
The scroll-film, GSAP and 3D gallery were removed. The site now follows a light editorial system: `#f4f4f4` page, white cards, Space Mono capitals for headlines and Inter for body copy. The home page is built from sections in `src/components/mx/Home.tsx` (hero ribbon, about, sets, featured work, numbers, four layers, journal, start a project). Inner pages inherit the same tokens through the `--film-*` variables in `src/styles.css`.
