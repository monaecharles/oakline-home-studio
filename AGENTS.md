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

## Oakline site
- Room IDs/coordinates live only in src/lib/rooms.ts; 3D scene, SVG plan and swatches all read from it so they stay in sync.
- Material inspiration choices use the existing external design store and browser storage to preserve room selections without connecting them to footage.
- Public home exploration uses the shared official YouTube walkthrough component with a persistent original-video link; legacy 3D modules are not mounted by content routes.
- The site is local-only: no network submission unless SITE_CONFIG endpoints are explicitly configured.

- Material photo sources are centralized in src/lib/material-photos.ts and imported through asset pointers so labels and attribution share one registry.
- Pre-optimize public hook-using control dependencies and reject outdated Vite dependency requests so a live preview cannot mix React dispatcher generations after edits.
