---
name: Octave Architectural Acoustics
colors:
  surface: '#290807'
  surface-dim: '#290807'
  surface-bright: '#572d2a'
  surface-container-lowest: '#220404'
  surface-container-low: '#33100f'
  surface-container: '#381412'
  surface-container-high: '#451f1c'
  surface-container-highest: '#522926'
  on-surface: '#ffdad6'
  on-surface-variant: '#dac2b0'
  inverse-surface: '#ffdad6'
  inverse-on-surface: '#4d2522'
  outline: '#a28d7d'
  outline-variant: '#544436'
  surface-tint: '#ffb778'
  primary: '#ffb778'
  on-primary: '#4c2700'
  primary-container: '#e88c2b'
  on-primary-container: '#572e00'
  inverse-primary: '#8e4e00'
  secondary: '#ffb4a7'
  on-secondary: '#611209'
  secondary-container: '#80291d'
  on-secondary-container: '#ff9a89'
  tertiary: '#e2bebc'
  on-tertiary: '#412b29'
  tertiary-container: '#bb9a98'
  on-tertiary-container: '#4a3231'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc1'
  primary-fixed-dim: '#ffb778'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6c3a00'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a7'
  on-secondary-fixed: '#400100'
  on-secondary-fixed-variant: '#80291d'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#e2bebc'
  on-tertiary-fixed: '#2a1615'
  on-tertiary-fixed-variant: '#5a403f'
  background: '#290807'
  on-background: '#ffdad6'
  surface-variant: '#522926'
typography:
  headline-xl:
    fontFamily: Epilogue
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Epilogue
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: '1.15'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 2.5rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Epilogue
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: '1.35'
    letterSpacing: 0em
  body-lg:
    fontFamily: Manrope
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.45'
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Manrope
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Mono
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Mono
    fontSize: 0.625rem
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an ultra-premium, nocturnal audio streaming experience. The aesthetic merges the tactile, editorial curation of classical sound engineering with modern computational audio design. Built for audiophiles, producers, and exacting music enthusiasts, the interface invokes an intimate listening lounge infused with master-control architectural precision.

The visual signature is driven by dark wine glassmorphism, dynamic amber glow fields, and micro-caliper precision lines. Interfaces are treated as tuned physical instruments: ultra-fine 1px acoustic guide-lines, concentric vinyl grooving patterns, and subtle engineering caliper marks lend technical rigor to rich, atmospheric depth. Translucent surfaces layer over deep maroon voids, warmed by localized amber bokeh halos that pulse and react to acoustic dynamics.

## Colors

The palette is anchored in nocturnal vinous depth, paired with resonant amber frequencies and warm archival cream text.

- **Primary (`#E88C2B` / Orange Grove):** The interaction and energy axis. Applied to playback states, active frequency peaks, scrubber handles, focused track titles, and live playback glow nodes.
- **Secondary (`#4E0401` / Deep Maroon):** Structural elevation color. Defines container fills, highlighted track rows, active playhead stems, and warm gradient undertones.
- **Tertiary (`#C8A6A4` / Muted Rose Ash):** Secondary typography, metadata, track duration, calipers, and inactive progress bars. Its deeper counterpart, `#8E6563`, handles inactive structural strokes, acoustic division ticks, and grid crosshairs.
- **Neutral (`#1C0202` / Deep Wine Void):** The canvas foundation. Accompanied by `#2B0303` for lower-tier background paneling and `#3A0302` for elevated card surfaces.
- **Active & Typography (`#FEFBF3` / Calming White):** Primary typography, high-priority icons, and pure soundwave peaks, providing razor-sharp legibility over low-luminance substrates.

### Semantic Tones & Glass Fills
- **Glass Overlay Deep:** `rgba(28, 2, 2, 0.72)` with 24px backdrop blur.
- **Glass Overlay Surface:** `rgba(58, 3, 2, 0.45)` with 16px backdrop blur and 1px border of `rgba(200, 166, 164, 0.12)`.
- **Amber Glow Node:** Radial gradient from `rgba(232, 140, 43, 0.35)` to `transparent` across 120px to 320px soft-radius fields.

## Typography

The typographic hierarchy balances editorial expression with technical specification.

- **Headlines (Epilogue):** Distinctive, geometric, and authoritative. Epilogue brings weight and acoustic character to artist names, release titles, and hero track declarations. Tight tracking (-0.02em to -0.03em) produces an editorial, poster-like impact.
- **Body Text (Manrope):** Balanced, modern, and transparent. Manrope ensures effortless legibility across album credits, lyrics, reviews, and track listings against deep maroon backdrops.
- **Labels & Calipers (Space Mono):** Used for precise telemetry: sample rate indicators (e.g., `24-BIT / 192kHz LOSSLESS`), track timers (`03:42.18`), dynamic range markers, soundwave coordinates, and engineering calipers. All metadata badges and status tokens render strictly in uppercase Space Mono.
