---
name: artPetShop Premium
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#4a4455'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#635b6e'
  on-secondary: '#ffffff'
  secondary-container: '#e9def5'
  on-secondary-container: '#696174'
  tertiary: '#524584'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a5d9e'
  on-tertiary-container: '#eae1ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#e9def5'
  secondary-fixed-dim: '#cdc2d9'
  on-secondary-fixed: '#1e1929'
  on-secondary-fixed-variant: '#4a4456'
  tertiary-fixed: '#e7deff'
  tertiary-fixed-dim: '#ccbeff'
  on-tertiary-fixed: '#1e0e4e'
  on-tertiary-fixed-variant: '#4a3d7c'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system focuses on a **Premium Modern** aesthetic that balances high-end retail sophistication with a warm, pet-centric approachability. The brand personality is professional yet deeply affectionate toward animals, aiming to evoke trust and delight.

The style leverages a mix of **Minimalism** and **Glassmorphism**. High-quality whitespace ensures product photography remains the focal point, while subtle translucent layers and soft purple gradients provide a sense of depth and modern tech-savviness. The interface avoids visual clutter, favoring purposeful movement and a tactile, friendly feel through generous rounding.

## Colors
The palette is anchored by a **Rich Purple** primary color, symbolizing quality and creativity. Lavender and Soft Purple gradients are used for interactive states and background depth, preventing the UI from feeling static or cold.

- **Primary:** Used for main actions, active states, and branding.
- **Secondary/Surface:** Soft Lavenders create a gentle contrast against pure white backgrounds.
- **Status Colors:** Applied strictly to stock levels and functional feedback. Use high-saturation versions for text and low-saturation backgrounds for "In-Stock" or "Limited" badges to maintain readability.

## Typography
The system utilizes **Inter** for its exceptional legibility and neutral, systematic character, allowing product imagery to carry the emotional weight. 

- **Weight Usage:** Stick to Medium (500) for UI labels and Semi-Bold (600) for product titles.
- **Scale:** The hierarchy is compact but readable. Display sizes are reserved for marketing hero sections, while body text is locked at a comfortable 16px to ensure accessibility for pet owners of all ages.
- **Case:** Use sentence case for headlines and labels to maintain a friendly, conversational tone.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict 8px-based spacing increments to ensure visual harmony. 

- **Desktop:** 12-column grid with 24px gutters. Use a centered container for shop pages to prevent eye strain on ultra-wide monitors.
- **Mobile:** Single column with 16px side margins. Horizontal scrolling "ribbons" are encouraged for product categories and "Recently Viewed" items.
- **Sticky Header:** The header should use a backdrop-blur (12px) effect with a 1px subtle Lavender border-bottom to remain persistent without feeling heavy.

## Elevation & Depth
This design system uses **Ambient Shadows** and **Tonal Layers** to create a premium, tactile feel.

- **Level 1 (Default):** Flat surfaces with a 1px Soft Purple border (`#F3E8FF`) for cards.
- **Level 2 (Hover/Active):** An extra-diffused shadow (`0 10px 25px -5px rgba(124, 58, 237, 0.1)`) that makes elements appear to lift toward the user.
- **Glassmorphism:** Use semi-transparent white (80% opacity) for floating navigation and modal backdrops to maintain context and light.

## Shapes
Shapes are defined by the **Rounded (2)** setting, specifically utilizing a range of 12px to 16px for primary containers.

- **Buttons & Chips:** Use 12px (`rounded-lg`) for a soft, approachable look.
- **Product Cards:** Use 16px (`rounded-xl`) to soften the edges of photography.
- **Input Fields:** 12px rounding to match button styling for a cohesive form experience.
- **Selection Indicators:** Circular (pill-shaped) for quantity selectors and radio buttons.

## Components
Consistent component styling reinforces the "artPetShop" premium identity:

- **Buttons:** Primary buttons use a Rich Purple to Soft Purple gradient. Secondary buttons use a Lavender background with Purple text. All buttons have a 200ms ease-in-out transition on hover, slightly increasing shadow depth.
- **Product Cards:** White background, minimal 1px border. On hover, the card lifts (Level 2 shadow) and the product image scales slightly (1.05x).
- **Status Badges:** Compact, rounded-full shapes with a subtle background and bold colored text (e.g., Green background at 10% opacity for "In Stock").
- **Inputs:** Soft gray background (`#F9FAFB`) with a 1px border that turns Rich Purple on focus.
- **Sticky Header:** Compact height (64px) featuring a search bar with a subtle Lavender focus state.
- **Cart Drawer:** Slides from the right with a backdrop blur, using Level 1 elevation to separate it from the main shop floor.