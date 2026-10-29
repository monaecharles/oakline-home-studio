# Oakline Home Studio

Build a complete premium website for **Oakline Custom Homes**, an Atlanta-area custom home design-and-build studio. Tagline: “Built around the way you live.” Hero: “Your home, considered from every angle.” Primary action: “Explore the home in 3D.” Secondary action: “View residences.” Write about 2,200–3,000 useful words excluding tool data. The voice is grounded, architectural and welcoming, with useful details rather than vague luxury claims.

## An architectural studio, with a material library at its heart

Use warm limestone #ECE8E0, deep forest #263C32, walnut #76543B, warm black #252522 and muted brass #AD9270. Pair a restrained architectural serif such as Libre Caslon Display with Manrope. Create an original open-corner floor-plan SVG mark and a carefully spaced wordmark.

Desktop navigation should be a narrow left rail about 210px wide, separated from the page by a thin forest border; the main content occupies the rest of the screen. Convert it into a compact top bar/drawer below 1024px. Home opens with a framed architectural photograph and an inset solid bordered introduction panel, then moves directly into two uneven project spreads. Use measured horizontal rules, shared-edge editorial panels, material swatches and architectural annotations. Do not make this look like the travel journal, a software dashboard or a bike store. Keep the rail readable without squeezing the 3D canvas; offer a distraction-free viewer expansion that retains an accessible way back.

## Exactly eight routes and their content

- **Home** `/`: Hero, clickable 3D preview that loads only when activated, two residence previews, a compact materials strip, design/build philosophy and project inquiry invitation. Frame photo captions and grouped copy with fine borders. Use no fake completed-project counts.
- **Residences** `/residences`: Three design studies, kept on this page: The Alder House, a warm contemporary family home; The Courtyard Residence, an indoor/outdoor concept; and The Ridge Retreat, a compact wooded-site home. Give each 150–220 words, planning priorities, image gallery and named room anchors. Describe them as “Design study” where a status label is needed, not completed client commissions. Use filters by style and living priority. No invented customer testimonials.
- **Explore in 3D** `/explore-home`: The full rotatable house, clickable rooms, actual room interiors, synchronized plan and finish tools described below. This is a required centerpiece, not an optional future phase.
- **Materials & Finishes** `/materials`: A tactile library of oak/walnut flooring, ivory/greige/sage wall colors, oak/walnut/forest cabinetry, quartz/charcoal stone counters and brass/black hardware. Every compatible “Apply in room” control opens or updates the 3D viewer with the selected room/material. Explain texture, maintenance considerations in general terms and visual differences. No unverified product manufacturer or warranty claims.
- **Design & Build** `/design-build`: Named phases: Conversation, Site & Scope, Design Development, Build Coordination, Final Walkthrough. Describe deliverables, client decisions and scope changes, using a compact horizontal or vertical text-led timeline with no decorative numerals. Include custom homes, major additions and comprehensive interior renovations, with budgets by consultation rather than invented fixed construction prices.
- **Our Studio** `/studio`: Founder/design director **Julian Mercer**, project lead **Nadia Brooks**, materials coordinator **Evan Cole**. Give credible 60–90-word biographies about approach, not unverified architect/contractor credentials. Use architecture and material photos rather than assigning real stock people fictitious names.
- **Homeowner Guide** `/homeowner-guide`: Substantial FAQs on initial planning, site information, design decisions, budget changes, construction scheduling and preparing for consultation. Add a real downloadable project brief .txt and print-friendly checklist, not a dead PDF link. Include a finishes comparison slider as described below.
- **Start Your Home** `/contact`: Fields: name, email, optional phone, city/neighborhood, project type, property status, preferred timeframe, broad investment range, priorities and message. Do not ask for private property documents or exact home address. Display **studio@oaklinecustomhomes.com**, **(678) 555-0148**, Atlanta, Marietta, Roswell and nearby communities; Monday–Friday 9 a.m.–5 p.m. Eastern, studio conversations by appointment. CTA “Save project brief.”

## Repositories and required working tools

- https://github.com/motiondivision/motion — `motion` for restrained image/panel transitions and camera-adjacent UI transitions; reduced-motion settings must disable visual choreography.
- https://github.com/react-hook-form/react-hook-form — `react-hook-form` for the project brief and validation.
- https://github.com/nerdyman/react-compare-slider — `react-compare-slider` for a real draggable finish comparison. Use two captures from the SAME generated 3D room/camera, differing only in finishes. Label them “Warm oak” and “Deep walnut.” Do not pretend unrelated stock photographs show the same renovation. Capture with a controlled render/screenshot pipeline, or render two synchronized room views if capture is unavailable; use the library with actual comparable scenes.
- https://github.com/BetterTyped/react-zoom-pan-pinch — `react-zoom-pan-pinch` for a zoomable original SVG floor plan with keyboard-accessible room selection and zoom/reset buttons. This library provides zoom/pan, not the floor plan or room logic; build both.
- https://github.com/pmndrs/react-three-fiber — `@react-three/fiber` with a compatible `three` version; use appropriate documented helpers such as `@react-three/drei` as needed for orbit controls, HTML hotspots and contact shadows. This must be a true interactive WebGL scene. A photograph, video, rotating CSS rectangle, empty GLB loader or fake play button does not satisfy the requirement.

## Required 3D home architecture and interactions

Build an original attractive single-level furnished home as procedural Three.js geometry, so it works without an unavailable external GLB. Think of a detailed architectural dollhouse: correctly proportioned walls, cut-out door/window openings, glazing, floors, sloped or flat roof volumes, cabinet runs, counters, sofas, beds, lights and patio elements. Use sensible reusable components for walls/openings and furniture. A polished procedural model is acceptable; an empty block with a roof is not. Use neutral scene lighting, soft shadows, physically plausible material settings and warm color balance. Roof on/off, cutaway and plan modes must expose the furnished interiors without destroying selection.

Use a shared room data model, stable IDs and shared coordinates for the 3D scene and SVG floor plan: Living Room at x[-4,0], z[-3,1]; Kitchen at x[0,4], z[-3,1]; Primary Bedroom at x[-4,0], z[1,4]; Bathroom at x[0,2], z[1,4]; Studio at x[2,4], z[1,4]. Adapt dimensions cleanly if walls need thickness, but preserve the same room mapping everywhere. Doors must connect rooms plausibly. Include at least these five furnished/selectable rooms.

On desktop the default viewer uses roughly 65% canvas and 35% bordered controls; on mobile use a 300–420px tall canvas followed by room and finish controls in normal flow. Provide pointer-drag rotation, pinch/wheel zoom, touch-safe gestures, “Rotate left,” “Rotate right,” zoom buttons, “Reset view,” and “View full screen.” Do not enable continuous auto-rotation by default. Prevent a click after a drag from accidentally entering a room; handle event propagation for nested room meshes. Raycast selection should select the intended room, not the roof or decorative object.

Hover or focus can highlight a room, but selection must work by tap/click and through a visible HTML room list. Clicking a named hotspot or room must do all of the following: select the correct ID, update the plan highlight, update the bordered details panel, reveal that room's finishes, and move the camera smoothly to a genuine interior viewpoint. “Enter room” must place the camera inside or just at a cutaway view that clearly shows the room's furniture and surfaces. Do not open only a stock photo and call it 3D. Provide “Back to whole home,” a room name breadcrumb without numbering, and a room photo tab as a complementary inspiration view. Respect reduced motion by snapping camera transitions when requested. Store camera targets per room and avoid crossing walls during transitions where possible; fade or cut away occluding walls in room mode.

Finish changes must modify actual named mesh materials in the selected room immediately: flooring oak/walnut/limestone; walls ivory/greige/sage; kitchen cabinetry oak/walnut/forest; counters ivory quartz/charcoal stone; fixtures brass/black. Show only controls relevant to that room. Each room preserves its own choices when another room is selected. Swatches need visible names, selected borders/checkmarks and keyboard support. Material variation must have texture or procedural grain variation as well as color; no vendor-specific texture dependency is required. Include daylight/evening preview and a comparison toggle. Finishes are visual approximations; add a discreet “Colors vary by display and lighting” note near swatches.

Save selections locally under `oakline:design:v1`, with room/version validation. Generate a real downloadable finish schedule .json and printable summary with room names and choices. “Use this design in my inquiry” prepopulates the project brief with a readable room-by-room summary, never a giant opaque JSON blob in public text. Provide reset room/reset home controls with confirmations only for loss of saved choices.

The original SVG floor plan should use the same room IDs and dimensions; support room selection, zoom/pan and reset. Selecting a room in the plan changes the 3D camera and finishes. Toggling between Plan and 3D preserves the current room. Every 3D action must have a useful HTML equivalent. Detect WebGL absence, context loss or loading failure and show an interactive SVG plan, real room photos and working finish selections with an honest “3D view unavailable on this device” notice. Do not silently replace working 3D on supported devices with this fallback. Dispose of geometry/materials, clamp device pixel ratio, lazy-load the heavy viewer and pause rendering when idle/offscreen. No external hosting of 3D assets is required to make the core feature work.

## Original hero recreation specification

Photorealistic architectural photograph, landscape 3:2: contemporary Georgia living room connected to a kitchen, oak cabinetry/floor, warm ivory walls, pale quartz island, forest upholstery, black window frames and natural morning daylight. Believable room geometry and construction details, straight verticals, tactile materials, no people, text, watermark or collage. Manifest fallback: living-room or contemporary-exterior photo. The generated hero is inspiration and marketing photography; the actual 3D model remains separately built and interactive.

## Business-specific acceptance cases

Rotate the whole home with mouse and touch; select each of five rooms via hotspot and HTML button; see genuine furnished room views. Change kitchen cabinets, enter the bedroom, return and verify kitchen choices remain. Change a wall, floor and fixture and verify the correct mesh updates. Select a room from the plan and confirm the same camera/details/swatches update. Toggle roof/cutaway, reset camera, compare matched finishes, export valid schedule, transfer choices to inquiry and reload restoration. Test WebGL-unavailable fallback, keyboard controls and reduced-motion camera behavior. Report any missing required 3D behavior privately; do not claim completion if room selection only swaps static images.

## Visual rules that must be implemented

Create finished pages, written copy, images and working interactions in this build. Do not stop at a landing page or a plan. This business must have its own visual identity and navigation rather than sharing a layout with the other portfolio businesses.

Use clear 1px borders around meaningful text groupings: hero copy panels, service descriptions, image captions, feature explanations, result summaries, FAQs and form areas. Put a heading and its related paragraph together inside one well-composed bordered panel, with 18–28px internal desktop padding and 16–20px on mobile. Do not outline individual words, surround every sentence with a separate box, or make every panel the same size. Use occasional divided editorial rows, fine rules and image-caption frames to vary the composition. Body text on photographs needs a solid or sufficiently opaque readable panel. Borders must be visible, not so faint that they disappear.

Keep the layout compact, polished and comfortable. Set maximum content width about 1240–1360px; normal desktop section padding 44–64px and mobile 28–40px. Use 16–28px grid gaps, 8–12px heading-to-description gaps, and 16–24px between related elements. Keep reading columns about 55–72 characters. Body type at least 16px with line-height around 1.5–1.65; control labels at least 14px. No huge blank bands, repeated full-screen sections, 160px vertical gaps, giant empty cards, overly tall hero or artificial scroll length. A desktop hero should generally allow the next content to begin near the fold. Do not compensate by crowding controls or reducing touch targets below 44px.

Do not add decorative numbering: no 01/02/03 section labels, oversized numeral backgrounds, numbered service cards, numbered headings or numbered navigation. Use descriptive names and text labels. Numbers belong only where useful, such as actual prices, dates, dimensions, ranges and itinerary days. A quiz may show a compact progress bar; it does not need a giant question number. Avoid nested card grids, generic icon-card walls, scrolling logo marquees, fake urgency, excessive pill labels and repeated CTA sections.

Write specific, natural copy in the business's voice. Use real-sounding fictional personal names provided below, but do not claim actual endorsements, certifications, awards, partnerships, customer counts or verified performance. Do not copy a real brand's logo or use real customer logos. Present service approaches and planning information instead of fake five-star testimonials. The public website must not contain the words “demo,” “sample,” “example,” “placeholder,” “fake,” or “fictional,” nor developer instructions, GitHub names, Rise Digital prices or package sales copy. Scenario tools may use accurate labels such as “Planning projection” or “Design study” where needed to describe what their outputs mean.

## Portfolio behavior, contact details and integration boundaries

This is an offline-capable portfolio concept with working browser interactions, not a live business operation. Treat all contact details, biographies, products, prices and projects as fixtures. Email addresses below are invented, unverified display text only: do not make mailto links, send emails, check ownership, contact those domains or automatically add them as service endpoints. Use the supplied reserved 555 telephone numbers as display text, with no call-triggering controls. Do not invent street addresses or geocode a fictional storefront. Give only the city/service region and “Visits by appointment” where appropriate. Do not add fabricated social profiles. Build social icons as an optional configuration slot, rendered only when real URLs exist; omit empty icons from the public page.

Use React Hook Form for contact forms with clear labels, accessible validation, optional phone, a consent checkbox explaining local storage, clear errors and a review screen. Primary action is “Save inquiry” or the business-specific equivalent below. Save to a namespaced localStorage key only after consent, show “Saved on this device. Nothing has been sent.” and offer edit, copy summary, download .txt and delete. Do not send personal data anywhere, require login, provision Supabase, add a database, or pretend a submission was delivered. If storage is unavailable, preserve state in memory and explain that it will disappear when the page closes. Catch malformed JSON and storage quota exceptions. Provide “Clear saved information” and do not persist contact fields without explicit consent. Tool preference state can be saved locally with a clear control to reset it.

Scheduling means selecting a preferred date or time window and saving it in the inquiry. Do not display fake available appointment slots, live confirmations or “booking confirmed.” Use “Request a consultation” or “Plan a test ride.” Dates must be future-valid and timezone labels explicit. If a user opens the site much later, no hard-coded past dates should appear.

Prepare exactly two optional existing-service connection slots in a private configuration module: BOOKING_URL for an approved external booking page or supported embed, and INQUIRY_FORM_ENDPOINT for an approved existing form service. Leave both empty by default; with empty settings everything still works locally. Never invent live destinations. Future endpoint submission needs explicit configuration, validation and a real successful response before any sent state. These slots are preparation, not claims of completed integration. Do not clone or self-host a scheduling backend. The previously investigated https://github.com/calcom/cal.com now redirects to https://github.com/calcom/cal.diy; exclude it from production booking dependencies. A supported hosted booking link can be connected later. No payments, checkout, subscriptions, account system, live inventory or custom booking backend.

## Premium delivery requirements

Build exactly the eight content routes specified below, including Contact. Any tool-result state is a panel/modal on its existing page; do not create additional content routes. Put privacy and photo credits in accessible footer dialogs so they do not increase the page total. Include a distinct logo/wordmark in SVG, favicon, complete responsive navigation, service or product showcase, rich galleries, substantial About content, contact form, thoughtful animation and meaningful interactive sections. Optional social-link settings and the two existing-service settings above must be ready for later connection.

Implement unique titles and meta descriptions, one meaningful H1 per route, semantic headings, descriptive image alt text, Open Graph tags, canonical-base configuration and a route manifest ready for a sitemap. Until an actual domain is supplied, do not publish invented canonical URLs or structured data describing a real registered business. Default to noindex for this portfolio build; record the setting privately. Domain connection, HTTPS and publication are launch tasks: prepare a private checklist but do not claim they happened or publish automatically. Three consolidated revision rounds and a seven-day original-work technical warranty are Rise Digital's service terms, not website widgets: note them only in the private handoff. Do not claim these custom advanced tools are automatically included in every $2,499 project; their final scope is separately agreed.

Use responsive image sizes and reserved aspect ratios. Preload only the actual hero/LCP image; lazy-load below-fold media and 3D code. Render useful page content before WebGL loads. Compress any locally imported media without losing visual quality. Load fonts responsibly with fallbacks and font-display swap. Avoid autoplay video and unbounded animations. Motion must respect prefers-reduced-motion. Ensure keyboard navigation, visible focus, sensible focus return from dialogs, Escape dismissal, contrast, accessible field errors, touch controls and no hover-only information. SVG hotspots and 3D tools need equivalent HTML controls. Never trap scroll inside a viewer on mobile.

## Photography included in this prompt

Use the direct image URLs in the manifest below immediately. They are actual assets, not requests for the user to attach pictures. Create a central photo registry with URL, descriptive alt, focal point and intended placement. Use all twelve distinct photographs across the eight routes, with at least four on Home and image-rich inner pages; reuse the hero only sparingly. Include image/caption frames and varied large, medium and detail crops. Do not replace photos with gradients, emoji or empty blocks. Do not blindly crop faces, bike wheels or important architectural details. Confirm the actual subject of each image before writing its caption: contextual titles below are placement guidance, not proof of the location or product identity. Do not label generic mountain scenery as a specific destination or a stock office as an actual client site. Keep stock bicycle imagery in lifestyle/editorial placements; original configured products must use the procedural model or consistent branded imagery.

If a direct URL fails in the deployed browser, choose another relevant working URL from this manifest and report the substitution privately. Never use an unrelated image to satisfy image count. Do not fabricate photographer names or source pages; resolve genuine credit links from image metadata where available, record source/license in a private asset manifest and use an unobtrusive “Photography” footer dialog for confirmed credits. The photo license reference is https://unsplash.com/license . Do not claim the license endorses the fictional company or that stock subjects work for it. Never scrape arbitrary Google Images, use watermarked previews, paid Unsplash+ assets or hotlink competitor portfolios.

An original custom hero has also been created outside Lovable; its recreation specification is included below. The current text prompt must work without any attachment. If the current Lovable environment has image generation, generate a new original image from that specification and use it; do not claim it is the exact external file. If generation is unavailable, use the specified manifest hero immediately. Do not stop and request uploads. Keep a private optional customHeroUrl setting, empty by default, for the separately delivered original asset if it is hosted later. This text does not itself host or transfer the external image file.

## Implementation and verification

Use React and TypeScript with the compatible UI stack already in the Lovable project. Install the relevant published packages from the listed repositories; do not blindly clone whole monorepos or paste README examples unchanged. Check current package documentation, React peer dependencies and license notices before pinning versions. Favor the MIT/BSD core libraries. Paid Pro examples and subscriptions are not assumed. Only include libraries this site's features actually use; the four prompts collectively cover the entire researched shortlist.

All visible buttons must perform the stated action. No dead # links, empty detail pages, fabricated network success, missing images, inert comparison buttons or static screenshots standing in for interactive tools. Build the full tool state, data models, reset behavior and empty states. Reusable UI is appropriate within this business, but its composition must follow this brand brief.

Before finishing, verify all eight direct routes, navigation/back behavior, 360px, 390px, 768px, 1280px and 1440px layouts; keyboard and touch flows; image load/error states; console errors; reduced motion; local storage denied; reload restoration; and all business-specific acceptance cases. Run available build/type checks and targeted interaction tests. Test in actual available browsers and report which browsers were used; do not claim Safari/Firefox testing if unavailable. Produce a PRIVATE handoff summarizing routes, installed packages/versions and licenses, photos, local-only behavior, optional service settings, checks actually completed, remaining issues and launch checklist. Public visitors should see the finished business website, never this handoff.


## Direct photo manifest — use these URLs now

- **Living room** · asset key `oakline-01`
  https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85
- **Contemporary exterior** · asset key `oakline-02`
  https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85
- **Residential architecture** · asset key `oakline-03`
  https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85
- **Bright interior** · asset key `oakline-04`
  https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85
- **Contemporary exterior detail** · asset key `oakline-05`
  https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85
- **Kitchen** · asset key `oakline-06`
  https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=85
- **Kitchen cabinetry** · asset key `oakline-07`
  https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1600&q=85
- **Entry console and materials** · asset key `oakline-08`
  https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85
- **Living and dining** · asset key `oakline-09`
  https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85
- **Woodland residence exterior** · asset key `oakline-10`
  https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85
- **Bathroom** · asset key `oakline-11`
  https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=85
- **Living details** · asset key `oakline-12`
  https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=85

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3e329dd1-6a95-4afb-b2ce-6b9922b91019).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
