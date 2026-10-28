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
- Viewer/finish state is a tiny external store (src/lib/design-store.ts) so pages like Materials can apply finishes before the viewer mounts.
- The 3D viewer is lazy-loaded behind ClientOnly (LazyViewer) to keep three.js out of SSR and first paint.
- The site is local-only: no network submission unless SITE_CONFIG endpoints are explicitly configured.
