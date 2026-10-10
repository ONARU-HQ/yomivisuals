# Yomi Visuals shared creative studio

## Existing system to preserve
- The existing admin studio already has ten brand workspaces, editable graphics/scenes, private assets, saved revisions, independent format variants and real image/PDF/ZIP exports.
- The previous verification recorded 600 draft starter templates. Source inspection shows these reuse five general compositions across 12 categories; this is not yet a curated, business-specific library.
- Fonts are duplicated in editor/identity controls. Only Inter and Instrument Serif are explicitly web-loaded; Arial and Georgia rely on the device.
- Inspiration capture and a content calendar are absent. Campaign tools currently create a storyboard or resized variants, not a reviewed multi-asset campaign.
- Background video export has an integration boundary but no configured rendering service. Successful hosted MP4 export cannot yet be claimed.

## Phase 1 — shared resources and curated templates
Deliver one reliable workflow before expanding: **choose brand → Trending template → customise → save → reopen → download**.

- Keep one source of truth for brand identity, assets, templates, formats and font definitions, with a unified searchable resource view. Reuse existing records rather than a second asset database.
- Load open-license font matches suitable for the references, including bold geometric, neutral grotesk and condensed display styles; label them as matches, not exact identified fonts. Preserve approved typography.
- Sample colours from each selected original logo and present a draft palette for explicit approval. Never overwrite approved identity or saved designs automatically.
- Create a small curated Trending collection inspired by the uploaded references: keyword-led editorial, service list, oversized trust message, photo-led conversion, time-led campaign, artist announcement, SaaS showcase, partnership carousel and food-discovery promotion.
- Use real editable text/shapes and actual approved brand-logo assets. Photographic areas use replaceable image layers or clearly marked empty slots until authorised imagery is supplied. Do not extract other creators’ people, logos, illustrations or proprietary graphics from the reference posters.
- Assign templates by actual business positioning: agency/studio/experiences, fashion, catering/food, interiors, SaaS/community and holding-company thought leadership. Preserve existing templates; do not silently delete or recolour them.
- Add brand, objective, category, destination and style filters, plus a prominent plain-language brief and deterministic template recommendations. Missing offers, prices, testimonials and contact fields stay empty or editable placeholders.

## Phase 2 — inspiration to editable source
- Add Inspiration with saved public/Pinterest links, uploaded images, title, attribution, notes, tags, intended brand and review status.
- Save links even when automatic import is unavailable; offer manual image upload. No unauthorised Pinterest scraping.
- Keep inspiration separate from reusable production assets and link its provenance to new templates.
- Create original editable layouts from selected design characteristics, preview before saving, and optionally analyse references with AI after verifying the supported model and protocol.
- Verify the full inspiration → template → populated design → save/reopen → real export journey before starting the next phase.

## Phase 3 — copy, adaptation and reviewed batches
- Add structured copy fields and keyword replacement with before/after preview, undo, character limits and overflow warnings.
- Extend the existing central format presets for remaining destinations; preserve image/logo proportions and create independently editable variants.
- Build a campaign proposal/review screen from one brief, then persist confirmed native designs linked to a campaign. No automatic external publishing.
- Add an internal brand content calendar linked to saved designs, approvals and exports; distinguish planned dates from actual platform scheduling.

## Phase 4 — motion and substantial exports
- Preserve the shared editable scene/layer model when converting static designs to motion.
- Extend existing motion presets and contextual controls incrementally; only expose supported effects and truthful previews.
- Reuse existing export jobs for a configured asynchronous rendering service, with real status, recoverable failures and validated stored MP4 output.
- Keep licensed/user-authorised audio and optional narration behind explicit user actions. Do not treat browser playback as a completed export.

## Technical implementation
- Existing `studio_brands` remains authoritative for approved identity and verified contacts; `studio_assets` for files; `studio_projects` for native templates/designs and lineage; existing revision/export tables for history and output.
- Extend metadata and add only necessary supporting fields/relations for inspiration, campaign review and calendar—not duplicate graphics or asset stores.
- Centralise font definitions, destination presets, resource classifications and business applicability; editor, previews and exporters consume the same registries.
- Keep staff-only access and private storage. Reference assets are never automatically approved for marketing reuse.
- Test concrete business rules, brand isolation, logo approval, recommendation relevance, copy replacement, source immutability and persistence. Verify real downloads and saved designs through the running app across multiple brands and formats.

## Dependencies and honest limits
- You chose closest open-license font matches; exact reference fonts remain unidentified.
- Exact copies of other brands’ finished artwork are not the deliverable; original reusable interpretations are.
- Approved brand imagery, final copy and palette approval are required before drafts become publish-ready.
- Pinterest automatic import requires an authorised integration; manual capture works without it.
- Hosted MP4 needs a rendering service and credentials. Advanced masks/path keyframes, long-video reliability and audio must be verified separately.
- Existing PDFs are RGB raster outputs, not CMYK or editable-vector print documents.

## Completion gates
Each phase ends with a working saved/reopened design and real output, not just a screen. PLAYBAAQ remains untouched throughout. Later phases are not reported complete until their own persistent workflows and files pass verification.