<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep image project types and marketing-use assignments independent of case-study brand attribution, so imagery can be reused without implying client identity or rights clearance.
- Serve visitor image analysis through a streaming public server route with validated uploads; keep prompts, model configuration and provider access state server-only.

- Keep studio sources and master templates in the existing studio_projects table with explicit is_template metadata; clone sources into independent projects and link format variants through source_project_id so edits never mutate their originals.
- Store studio business information in studio_brands.information and user preferences in staff-only own-row studio_preferences; preserve kit revisions through studio_kit_versions so identity changes remain auditable.
- Render studio graphics and PDF/ZIP bundles in the browser from structured Fabric scenes; store completed binaries in private studio storage and report browser-renderer/RGB limitations rather than claiming hosted jobs or CMYK output.

- Keep studio creation deterministic and hide technical controls behind Advanced; preserve a simple first-time workflow without AI dependencies.
- Handle username credential verification server-side and return a session only after Auth verifies the password; never expose username-to-email mappings publicly.
- Manage team permissions through an administrator-checked RPC that prevents self-demotion and owner modification; retain real emails for recovery.
- Reuse studio_exports for external render jobs; keep render credentials server-only, validate brand-owned approved assets and store an actual MP4 before marking complete.
- Paginate studio project reads so expanding master-template catalogues never hide later brand records at the API row limit.

- Keep studio fonts, original curated recipes and business applicability in one browser-safe registry; reuse studio_assets metadata for reference provenance and keep references out of production pickers and renders.
- Store reviewed campaign groups and internal calendar plans in existing studio_projects metadata; preview batches locally and persist only selected drafts after explicit review, never imply external publishing.
