# Reference-led Yomi Visuals Studio redesign

## Direction and current gaps
Redesign the existing studio—not a separate application—around your supplied premium SaaS/startup references. Match their typography, hierarchy, spacing, visual weight and signature devices closely while replacing third-party identity and artwork with original elements and your own approved assets.

The current designs diverge in concrete ways:
- Services use numbered rows instead of diagonal arrows, dot accents and a sweeping guide curve.
- Trust layouts lack the floating devices and dramatic lighting.
- Curiosity layouts lack the white-space hierarchy, keyword treatment and tactile divider.
- Urgency currently uses a simple outline circle, not a dimensional metallic stopwatch.
- Statement, launch and ecosystem layouts use generic rectangles rather than flowing paths, staged mockups and detailed micro-UI.
- Poster layouts lack condensed typography, paper texture, ribbons and information badges.
- Preview text is truncated and multiline wrapping, paths, groups, gradients and shadows are not faithfully represented.
- Recipes advertise suggested fonts but actually build text using the brand kit font; new templates are not automatically favourited.

## 1. Fonts and shared rendering
- Register and load Plus Jakarta Sans, Syne, Bebas Neue, Oswald and Archivo alongside Space Grotesk and Anton. Use actual available weights: Plus Jakarta Sans ExtraBold for stacked headlines, condensed display faces for posters, lighter weights for supporting copy.
- Verify Clash Display’s official licence and web-embedding permission before adding its real files. Use Archivo for the curiosity family if those permissions cannot be established; show that substitution explicitly.
- Treat these as your selected fonts, not a claim that screenshots prove exact font identity. Preserve approved brand kits and existing project typography; the new masters use their specified template fonts.
- Share Fabric-native paths, groups, gradients, shadows, rounded rectangles, dot grids, arrows, curves and clipped image frames between library previews, editor and exports. Load fonts recursively for grouped text.
- Use the same scene-rendering path for accurate thumbnail previews rather than the current simplified SVG approximation.

## 2. Eight reference-led template families
| Family | Composition to build | Typography |
|---|---|---|
| Services Matrix | Matte dark canvas, small dot grid, two-part category heading, four arrow-led underlined rows and sweeping guide curve | Syne / Space Grotesk |
| Trust Stack | Deep brand-accent radial vignette, oversized stacked headline, floating dimensional laptop/phone frames, capability line and verified URL | Plus Jakarta Sans ExtraBold |
| Curiosity Hook | White canvas, giant hook, highlighted inline keyword, tactile paper divider and restrained footer; clean and image-led variants | Clash Display if licensed / Archivo |
| Stopwatch CTA | Dark micro-mesh, original metallic dial with editable hands/ticks, accented headline and compact CTA pill | Plus Jakarta Sans |
| Monoline Statement | Matte dark field, flowing accent path through negative space, asymmetric lower-left headline and uppercase supporting line | Syne / Space Grotesk |
| Launch Showcase | Warm or brand-approved luminous backdrop, condensed headline, perspective phone frame and sector-specific asset staging | Bebas Neue / Oswald + Plus Jakarta Sans |
| Ecosystem Widgets | Ticket, forecast, definition, offer and partnership compositions with editable labels, badge and swipe affordance | Plus Jakarta Sans |
| Community Poster | Original paper texture, monumental condensed heading, vertical ribbon, floating badges and speech-bubble metadata | Bebas Neue / Anton |

Start with one polished composition per family for all ten brands: 80 masters, with widget/curiosity variations added only after the main set passes visual review. Reinterpret each family by sector rather than making every brand sell apps, food or events.

## 3. Brand adaptation and library organisation
- Keep the ten existing workspaces and leave PLAYBAAQ untouched.
- Tailor copy fields and image slots to agency production, studio bookings, experiences, fashion, catering, interiors, SaaS, food discovery, community and holding-company positioning.
- Use verified contacts and approved logo assets. Brand-accent colours come from approved kits; reference red/orange/purple is not silently imposed on every brand. Unapproved logo-derived palettes remain proposals.
- Names stay visible as **[Brand Name] — [Template Name]**, including in the gallery.
- Put the new collection in Trending, searchable by brand, family, objective, category and format.
- Set `favorite: true` in each new master’s metadata and merge its ID into the requesting staff member’s existing favourites without removing their other favourites. Allow unfavouriting afterward; do not re-add stars on reload.
- Move only the system-generated older curated masters into a Legacy collection. Preserve their editable documents, personal drafts, custom masters, existing uses and revisions. Never overwrite an edited master with a newly generated recipe.

## 4. Artwork and editable content
- Build original vector device frames, curves, stopwatch parts, UI widgets and badges as editable Fabric objects. This is dimensional illustration, not a new 3D editor.
- Keep headlines, services, highlighted keywords, calls to action and footer text editable, with wrapping, fitting limits and overflow warnings.
- Use authorised brand screenshots/photos when available. Empty replacement slots remain explicit where source imagery is missing; do not fabricate app screens, products, discounts, dates or testimonials.
- Do not cut the competitor’s laptop, food, scooter, people, handshake, logos or artwork out of the uploaded references. If realistic photographic staging is needed, request the appropriate approved source asset.

## 5. Implementation and verification sequence
1. Complete the font registry and shared primitives. Build and compare Yomi Visuals masters against all eight references at full size before expanding.
2. Verify a complete journey: choose → edit text/keyword → undo → save → reopen → download actual PNG. Check fonts, dimensions, paths, shadows, clipping and thumbnail parity.
3. Apply the reviewed families to the other nine brands; seed saved masters explicitly and idempotently, organise Legacy and initialise favourites.
4. Verify all ten brands, repeat seeding without duplicates, favourite persistence and unfavourite behaviour, independent template clones, existing-source preservation and PLAYBAAQ exclusion.
5. Inspect library/editor on desktop and 320/375/390/430px screens; run studio tests and confirm real PNG/JPEG/PDF output. PDFs remain RGB raster.

## Technical approach
Keep `resources.ts` as the central font/recipe registry and `buildRecipe` entry point; use focused browser-safe family builders for complex compositions. Reuse the current document model, Fabric editor, private assets, `studio_projects` templates, `studio_preferences` own-row favourites and revision/export records. Prefer Fabric’s existing serialised properties rather than inventing a second scene model or asset database. Version new recipes so old masters cannot suppress the redesigned collection or be overwritten accidentally.

This scope redesigns static templates and their reliable editing/export path. It does not add external publishing, a hosted video renderer or automatic scraping of inspiration sources.