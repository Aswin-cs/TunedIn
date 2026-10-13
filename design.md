---
name: TunedIn
colors:
  surface: '#220d0d'
  surface-dim: '#220d0d'
  surface-bright: '#4d3231'
  surface-container-lowest: '#1c0808'
  surface-container-low: '#2b1515'
  surface-container: '#301919'
  surface-container-high: '#3c2423'
  surface-container-highest: '#482e2d'
  on-surface: '#ffdad8'
  on-surface-variant: '#dac2b0'
  inverse-surface: '#ffdad8'
  inverse-on-surface: '#432a29'
  outline: '#a28d7d'
  outline-variant: '#544436'
  surface-tint: '#ffb778'
  primary: '#ffb778'
  on-primary: '#4c2700'
  primary-container: '#e88c2b'
  on-primary-container: '#572e00'
  inverse-primary: '#8e4e00'
  secondary: '#ffb86d'
  on-secondary: '#492900'
  secondary-container: '#ce7e14'
  on-secondary-container: '#402300'
  tertiary: '#ffb4a7'
  on-tertiary: '#611209'
  tertiary-container: '#f4816e'
  on-tertiary-container: '#6c1b10'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc1'
  primary-fixed-dim: '#ffb778'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6c3a00'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#ffb86d'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#683c00'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a7'
  on-tertiary-fixed: '#400100'
  on-tertiary-fixed-variant: '#80291d'
  background: '#220d0d'
  on-background: '#ffdad8'
  surface-variant: '#482e2d'
typography:
  display-hero:
    fontFamily: Epilogue
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 46px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Epilogue
    fontSize: 19px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 17px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 15px
    letterSpacing: 0.03em
  label-mono:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
  space-2xl: 3rem
---

## Brand & Style

This design system drives a premier, high-fidelity music streaming service crafted for discerning audiophiles, creators, and everyday listeners. The product identity balances effortless discovery with the tactile gravitas of high-end analog audio equipment and the precision of native desktop desktop software. 

The aesthetic marries deep ambient atmospheric lighting with native macOS-inspired structural restraint. It rejects flat utilitarianism in favor of volumetric glassmorphism, glowing luminescence, and deep, dark maroon tonal depths. The interface evokes late-night listening sessions, backstage green rooms, and vinyl mastering suites: intimate, immersive, focused, and acoustically resonant.

Key aesthetic pillars:
- **Atmospheric Depths:** Dark, rich maroons blending into obsidian charcoals, preventing dead-black screen fatigue while anchoring content.
- **Luminous Radiance:** Vibrant warm amber and orange grove accents evoke vacuum tubes, analog VU needles, and stage lighting.
- **Native Precision:** Strict spatial proportion, pristine typographic hierarchies, and translucent glass tiers providing clear visual separation across 3-column listening dashboards.

## Colors

The palette leverages a dark-mode architecture defined by dark maroon wine undertones, dark charcoal groundings, and radiant amber-orange acoustics.

### Surface Hierarchy & Backgrounds
- **Canvas Base:** `#120303` (Deep Charcoal Black) provides the base canvas.
- **Ambient Floor:** Radial and linear gradations transition from `#4E0401` (Rich Dark Maroon) into `#160505` across major structural containers, establishing continuous auditory depth.
- **Glass Surfaces:**
  - `Surface-Glass-Low`: `rgba(22, 5, 5, 0.55)` with 24px backdrop blur.
  - `Surface-Glass-Medium`: `rgba(78, 4, 1, 0.28)` layered over `rgba(18, 3, 3, 0.65)` with 32px backdrop blur.
  - `Surface-Glass-High`: `rgba(254, 251, 243, 0.08)` for elevated active states, modals, and hovering player docks.

### Accent & Interaction
- **Primary Brand / Action:** `#E88C2B` (Radiant Orange Grove) for primary playback buttons, active scrubber heads, and focal calls to action.
- **Secondary Highlight:** `#FFA73F` (Warm Amber) for active track indicators, focus halos, and volume gradients.
- **Subtle Accent Wash:** `rgba(232, 140, 43, 0.15)` for row selections, hover back-glows, and badge fills.

### Typography & Content Contrast
- **Text-High:** `#FEFBF3` (Calming White) for headers, active track titles, and critical actions.
- **Text-Medium:** `rgba(254, 251, 243, 0.70)` for secondary metadata, artist names, and structural headings.
- **Text-Muted:** `rgba(254, 251, 243, 0.45)` for durations, release years, timestamps, and inactive controls.
- **Text-Disabled:** `rgba(254, 251, 243, 0.24)`.

### Borders & Borders Lighting
- **Specular Border Subtle:** `rgba(254, 251, 243, 0.08)` creates a crisp 1px specular light refraction on card edges.
- **Specular Border Accent:** `rgba(232, 140, 43, 0.35)` used on highlighted cards and focused states.

## Typography

The type pairing pairs **Epilogue** for display and expressive editorial weight with **Inter** for clinical data density, tracklists, and system chrome.

- **Epilogue (Headlines & Editorial Focus):** Selected for its geometric stance, high character personality, and contemporary punch. Used across album hero headers, marquee carousels, and artist page showcases to convey acoustic energy.
- **Inter (Body, Lists, Navigation & Technical Labels):** Provides clean legibility in data-dense table layouts (sample rates, audio formats, bitrates, duration readouts).
- **Tabular Numerals & Timecodes:** All audio time-trackers, scrub counters, and table indices utilize OpenType tabular figures (`tnum`) to eliminate micro-jittering during live playback updates.
- **Technical Badges:** `label-mono` formats metadata tokens (e.g., `FLAC`, `HI-RES LOSSLESS`, `DOLBY ATMOS`, `MASTER`) set in uppercase with increased letter spacing for crisp rendering.

## Layout & Spacing

The layout architecture implements a modular, high-density 3-column macOS desktop studio layout that smoothly scales into single-view adaptive canvas modes for smaller viewports.

### Multi-Column Desktop Architecture (> 1200px)
- **Left Column (Primary Navigation & Library Hub):** Fixed 260px - 280px width. Houses brand mark, global navigation, user playlists, and pinned audio collections.
- **Center Canvas (Dynamic Studio / Stage):** Fluid grid spanning remaining horizontal space. Utilizes a 12-column sub-grid system with dynamic media scaling for album covers, curated shelves, search tables, and editorial narratives.
- **Right Column (Contextual Studio Inspector):** Collapsible 300px - 340px column displaying current track artwork, audio queue, lossless format specs, active session participants, and synchronized lyrics.
- **Fixed Persistent Bottom Dock (Player Control):** 84px fixed height anchored along the viewport floor, straddling all three columns with edge-to-edge frosted glass.

### Responsive Reflow & Breakpoints
- **Mobile (< 768px):** Single-column stacked canvas with 1rem edge margins. Sidebars tuck into bottom sheet trays and slide-over drawers. The bottom player collapses into a floating mini-player bar (56px) positioned 12px above the mobile navigation bar.
- **Tablet (768px - 1199px):** 2-column layout. Left navigation collapses into an icon rail (68px) or fixed drawer; right contextual pane becomes an overlay modal; central stage takes primary precedence with 1.5rem margins and 1.25rem gutters.
- **Desktop (>= 1200px):** Full 3-column architecture enabled with 2rem side margins and 1.75rem layout gutters.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows. Instead, it relies on light transmission, edge specular reflection, and physical material layering.

### Surface Elevation Layers
- **Ground 0 (Base Canvas):** Solid foundational depth (`#120303`) layered with ambient, wide-angle radial color gradients (`#4E0401` maroons) diffused across top-left corners.
- **Level 1 (Structural Sidebars & Background Shelves):** Translucent glass panes using `rgba(22, 5, 5, 0.45)`, 24px backdrop blur, bordered by a soft top and trailing 1px line (`rgba(254, 251, 243, 0.05)`).
- **Level 2 (Interactive Floating Cards & Content Tiles):** `rgba(78, 4, 1, 0.18)` over `rgba(22, 5, 5, 0.65)` with 28px blur. Edge defined by a 1px continuous specular outline (`rgba(254, 251, 243, 0.09)`).
- **Level 3 (Floating Persistent Player & Modals):** `rgba(26, 7, 7, 0.82)` with 36px backdrop blur, elevated by an ambient shadow: `0 16px 40px -8px rgba(0, 0, 0, 0.75)`, paired with a warm golden-orange back-glow (`0 0 24px -4px rgba(232, 140, 43, 0.12)`).

### Atmospheric Glow & Active Depth
- **Acoustic Radiant Halos:** Hovering or playing album artwork generates dynamic pseudo-underglows matching the track's dominant palette or the default brand glow (`box-shadow: 0 12px 32px -6px rgba(232, 140, 43, 0.35)`).
- **Edge Specular Treatment:** All glass panels display an inner highlight (`inset 0 1px 0 0 rgba(254, 251, 243, 0.12)`) simulating the beveled rim of polished glass.

## Shapes

The design uses Rounded geometry (`roundedness: 2`). This brings native application refinement without veering into toy-like circles or clinical sharp corners.

- **Base Radius (0.5rem / 8px):** Used on track row hovers, control buttons, dropdown menus, context menus, and micro badges.
- **Medium Radius (0.75rem / 12px):** Used on album artwork containers, audio playback scrubber thumbs, and secondary utility cards.
- **Large Radius (`rounded-lg`, 1rem / 16px):** Applied to major dashboard content panels, featured playlist cards, and search banners.
- **Extra Large Radius (`rounded-xl`, 1.5rem / 24px):** Applied to full modals, large hero marketing banners, and floating glass sheets.
- **Full Pill (`9999px`):** Reserved strictly for master Play/Pause action circles, volume knobs, search input bars, and genre filter chips.

## Components

### Buttons
- **Primary Play / Action Button:** Solid `#E88C2B` background with `#120303` high-contrast iconography/text. Hover transitions to `#FFA73F` with an ambient glow (`0 0 20px rgba(232, 140, 43, 0.45)`). Pressed state scales to `0.97`.
- **Secondary Glass Button:** `rgba(254, 251, 243, 0.06)` fill, 1px specular border `rgba(254, 251, 243, 0.12)`, text `#FEFBF3`. On hover, fill shifts to `rgba(254, 251, 243, 0.12)`.
- **Ghost / Icon Audio Controls:** No initial border or background. Icon color set to `rgba(254, 251, 243, 0.7)`. On hover, color transitions to `#FEFBF3` with an icon scale of `1.08`. Active toggle states (e.g., Shuffle, Repeat) glow `#E88C2B` with a small active indicator pip.

### Chips & Filter Tags
- Pill-shaped (`rounded-full`), padding `0.375rem 1rem`.
- Inactive: Frosted translucent fill `rgba(22, 5, 5, 0.6)` with `rgba(254, 251, 243, 0.08)` border and `rgba(254, 251, 243, 0.7)` text.
- Active: Radiant gradient wash (`#E88C2B` to `#FFA73F`) with `#120303` bold typography.

### Input Fields (Search & Filtering)
- Fully rounded pill or 8px input field with height of 40px.
- Background: `rgba(22, 5, 5, 0.65)` with inset shadow and 1px border `rgba(254, 251, 243, 0.1)`.
- Leading icon (magnifying glass) in `rgba(254, 251, 243, 0.45)`.
- Active / Focus: Border transitions to `#E88C2B` accompanied by a 3px outer glow ring in `rgba(232, 140, 43, 0.25)`.

### Track Lists & Data Tables
- Header row with uppercase `label-mono` type (`#`, `TITLE`, `ALBUM`, `DATE ADDED`, duration clock icon).
- Rows use 8px rounded corners, padding `0.5rem 0.75rem`, spaced with 2px vertical gaps.
- Hover: Subtle `rgba(254, 251, 243, 0.05)` glass tint with track number swapping seamlessly to an inline play icon.
- Playing State: Track title illuminates in `#FFA73F`, accompanied by an animated 3-bar audio equalizer graphic in place of the index number.

### Scrubbers & Sliders (Audio & Volume)
- Track Rail: 4px height, background `rgba(254, 251, 243, 0.15)`, rounded-full.
- Progress Fill: Solid `#E88C2B` or subtle gradient to `#FFA73F`.
- Scrubber Head (Thumb): 12px circular handle, invisible during passive listening, smoothly fades in on rail hover with white fill and amber halo. Rail height expands from 4px to 6px on hover.

### Media Cards (Albums, Playlists, Artists)
- Structural card with `rounded-lg` (16px), padding `1rem`, resting on `Surface-Glass-Low`.
- Artwork uses 12px roundedness, 1:1 aspect ratio, with a subtle top-lit inner border.
- Floating Play Button overlay appears in the bottom-right corner of the artwork on hover, translating upwards by 4px with an immediate amber box-shadow.

### Persistent Player Bar (Bottom Dock)
- Height: 84px. Edge-to-edge floating glass bar with a 1px frosted separator (`rgba(254, 251, 243, 0.08)`).
- Left Section: 56px album thumbnail, track title (`title-sm`), artist name (`body-sm`), and favorite heart toggle.
- Center Section: Transport controls (Shuffle, Prev, Play/Pause, Next, Repeat) centered over a horizontal progress rail spanning 420px.
- Right Section: Volume slider, output device switcher (AirPlay/Cast), lyrics toggle, queue list toggle.