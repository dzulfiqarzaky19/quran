# Design System Specification: High-Precision Editorial

 

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Sacred Lens."** 

 

Moving beyond a standard utility app, we are crafting a high-precision digital sanctuary. The design rejects the "boxed" nature of traditional mobile interfaces in favor of a **High-End Editorial** experience. By utilizing the glassmorphism and depth principles projected for WWDC 2025/2026, we create an environment where the sacred text feels suspended in a luminous, multi-dimensional space. 

 

The system breaks the "template" look through **intentional asymmetry** (e.g., placing verse markers in unconventional but balanced gutters) and **high-contrast typography scales** that prioritize the beauty of the script as much as its readability. We treat every screen as a gallery wall: quiet, intentional, and premium.

 

---

 

## 2. Colors & Surface Philosophy

The palette is rooted in deep, sophisticated neutrals (`surface`) contrasted against vibrant, high-energy accents (`primary`, `tertiary`).

 

### The "No-Line" Rule

**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions. 

- Use `surface-container-low` sitting on a `surface` background to denote a section.

- Use `surface-container-high` for interactive elements to create natural prominence.

 

### Surface Hierarchy & Nesting

Treat the UI as a series of physical layers—like stacked sheets of frosted glass.

*   **Base:** `surface-dim` (#131315) for the main reading environment.

*   **The Reading Plane:** `surface-container` (#1F1F21) for content blocks.

*   **The Focused Element:** `surface-container-highest` (#353437) for active verse selection or playback controls.

 

### The "Glass & Gradient" Rule

To achieve a "Pro" signature, use **Glassmorphism** for floating navigation and overlays.

- **Recipe:** Use `surface-bright` at 60% opacity with a `backdrop-filter: blur(20px)`.

- **Signature Textures:** For primary CTAs (e.g., "Start Khatam"), apply a subtle linear gradient from `primary` (#C2C1FF) to `primary-container` (#5E5CE6) at a 135-degree angle. This provides a "visual soul" that flat colors lack.

 

---

 

## 3. Typography

The typography is the voice of the system. We use a pairing that balances technical precision with editorial authority.

 

*   **Display & Headlines (SF Pro Display / Inter):** Used for Surah titles and Juz headings. The `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to create a "bold architectural" feel.

*   **Body & Reading (Inter / SF Pro Text):** The `body-lg` (1rem) is the workhorse. In a Quranic context, line-height must be increased to 1.6x the font size to allow the complex script and diacritics to breathe.

*   **Label & Metadata:** `label-sm` (0.6875rem) should be set in all-caps with increased letter-spacing (+0.05em) when used for navigation labels or verse numbers to maintain a "Pro" technical aesthetic.

 

---

 

## 4. Elevation & Depth

Depth is achieved through **Tonal Layering**, not structural lines.

 

### The Layering Principle

Depth must be achieved by "stacking" the surface-container tiers. For example, place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.

 

### Ambient Shadows

For floating elements (like a "Jump to Verse" menu), use **Ambient Shadows**:

- **Blur:** 40px to 60px.

- **Opacity:** 6% of the `on-surface` color.

- **Offset:** Y: 12px.

- This mimics natural, diffused light rather than a harsh digital shadow.

 

### The "Ghost Border" Fallback

If a border is required for accessibility, it must be a **Ghost Border**:

- Use `outline-variant` (#464554) at **15% opacity**.

- 100% opaque, high-contrast borders are forbidden.

 

---

 

## 5. Components

 

### Buttons

*   **Primary:** High-contrast `primary` container. Subtle rounding (`md`: 0.75rem). No pill shapes.

*   **Secondary:** `surface-container-high` background with `on-surface` text.

*   **Interaction:** On tap, use a subtle "scale-down" (0.98) transform rather than a simple color change.

 

### Cards & Lists

*   **Constraint:** Forbid divider lines.

*   **Separation:** Separate Surahs or verses using vertical white space (use 24px or 32px from the scale) or a shift from `surface-container-low` to `surface-container-lowest`.

 

### Input Fields

*   **Style:** Minimalist. No bounding box; use a `surface-container-highest` bottom-weighted fill.

*   **Focus:** Transition the "Ghost Border" from 15% opacity to 40% `primary` color.

 

### Key Contextual Components

*   **The Reading Scrubber:** A thin, high-precision horizontal line using `secondary-container` to track progress through a Juz.

*   **Verse Focus Overlay:** A glassmorphic bottom sheet (`surface-bright` with 80% opacity and blur) that appears when a verse is long-pressed, blurring the background text to focus the soul.

 

---

 

## 6. Do’s and Don'ts

 

### Do

*   **Do** use extreme white space. If you think there is enough padding, add 8px more.

*   **Do** use `primary` (#C2C1FF) sparingly. It should feel like a "beacon" in the dark UI.

*   **Do** ensure the Arabic script is rendered at a minimum of `title-lg` (1.375rem) for clarity.

 

### Don't

*   **Don't** use pure black (#000000). Use `surface` (#131315) to maintain tonal depth.

*   **Don't** use standard iOS "Pill" buttons. Use the `md` (0.75rem) or `lg` (1rem) rounding for a more custom, architectural feel.

*   **Don't** use 100% opaque separators. They "cut" the screen and break the immersive experience.