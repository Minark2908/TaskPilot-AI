---
name: Professional Editorial
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#3c4947'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#6c7a77'
  outline-variant: '#bbcac6'
  surface-tint: '#006b5f'
  primary: '#006b5f'
  on-primary: '#ffffff'
  primary-container: '#14b8a6'
  on-primary-container: '#00423b'
  inverse-primary: '#4fdbc8'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#e49200'
  on-tertiary-container: '#543300'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#71f8e4'
  primary-fixed-dim: '#4fdbc8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  headline-xl:
    fontFamily: Chivo
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  max-width: 1280px
---

## Brand & Style
The brand personality is authoritative yet accessible, designed to evoke a sense of clarity, precision, and intellectual rigor. The target audience includes professionals, researchers, and decision-makers who value high-density information presented with structural elegance.

The design style is **Minimalist with Editorial influence**. It prioritizes heavy whitespace to reduce cognitive load, utilizing a sophisticated color palette to guide focus rather than decorate. The aesthetic balances the functional clarity of Swiss design with the warmth of modern digital typography, ensuring the UI feels like a high-end digital publication rather than a standard utility.

## Colors
The palette is built on a foundation of professional stability and vibrant intentionality.

- **Primary Teal (#14B8A6):** Used for primary call-to-actions, active states, and brand signatures. It provides a modern, energetic contrast to the deeper tones.
- **Dark Slate (#1E293B):** Reserved for headers, sidebars, and structural elements requiring high visual weight.
- **Amber (#F59E0B):** An accent color used sparingly for highlights, status indicators, or critical notifications to draw immediate attention.
- **Surface & Background:** The layout utilizes **Background Light Gray (#F8FAFC)** for the page canvas, while **White (#FFFFFF)** is used for elevated cards and content containers to create clear modularity.
- **Primary Text (#334155):** Ensures optimal legibility with a softer, more sophisticated contrast than pure black.

## Typography
The typography system is designed for deep reading and clear hierarchy. 

**Chivo** is used for headlines to provide a sharp, confident, and contemporary voice. Its geometric precision works best in larger formats with slightly tighter letter spacing. **Source Sans 3** serves as the primary body face, chosen for its exceptional legibility and neutral character, ensuring long-form content is easy to digest. **Inter** is utilized for labels and UI metadata to maintain a systematic, functional feel in tight spaces.

Scale headlines down appropriately for mobile devices to maintain a clean vertical rhythm without overwhelming the viewport.

## Layout & Spacing
This design system employs a **fixed grid model** for desktop and a **fluid grid** for mobile. 

- **Desktop:** A 12-column grid with a maximum content width of 1280px. Gutters are fixed at 24px to ensure ample breathing room between content blocks.
- **Mobile:** A 4-column fluid grid with 20px side margins.
- **Spacing Rhythm:** All margins and paddings must follow a 4px (1 unit) base increment. Generous vertical spacing (32px, 48px, or 64px) should be used between major sections to emphasize the editorial narrative.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Background):** Background Light Gray (#F8FAFC).
- **Level 1 (Surface):** White (#FFFFFF) containers with a 1px border in a lightened version of Dark Slate (at 10% opacity) to define boundaries without adding visual noise.
- **Level 2 (Interactive):** Elements like dropdowns or active cards use an ambient, extra-diffused shadow (Blur: 12px, Y: 4px, 5% opacity of Dark Slate) to suggest hoverability.
- **Overlay:** High-contrast Dark Slate is used for navigation bars to anchor the layout at the highest visual priority.

## Shapes
The design system uses a **Soft (1)** shape language. This subtle rounding maintains a professional and structured appearance while removing the "harshness" of sharp corners.

- **Small Components:** Checkboxes and small tags use 4px (0.25rem) corners.
- **Buttons and Inputs:** Standard radius of 4px.
- **Cards and Containers:** Use `rounded-lg` at 8px (0.5rem) to provide a gentle containerization of content.

## Components
- **Buttons:** Primary buttons use a solid Teal fill with white text. Secondary buttons use a Dark Slate outline with Dark Gray text. Ghost buttons use Teal text with no background.
- **Input Fields:** Use White backgrounds with a 1px border of Slate (20% opacity). On focus, the border shifts to Teal with a soft 2px Teal glow.
- **Chips/Tags:** Use a very light tint of Teal (5% opacity) with Teal text for positive attributes, and Amber for warnings.
- **Cards:** White surfaces with 8px rounding and a subtle 1px border. No shadows in the default state; apply a soft ambient shadow on hover.
- **Lists:** Clean dividers using 1px lines in light Slate. List items should have generous 16px vertical padding to maintain the editorial feel.
- **Navigation:** Use Dark Slate for the top navigation bar with White or Teal text for high-contrast visibility.