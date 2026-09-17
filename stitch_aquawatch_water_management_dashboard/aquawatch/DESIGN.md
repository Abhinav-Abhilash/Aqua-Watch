---
name: AquaWatch
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#dfe8ff'
  surface-container-highest: '#d9e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#424654'
  inverse-surface: '#273143'
  inverse-on-surface: '#ecf0ff'
  outline: '#737786'
  outline-variant: '#c2c6d7'
  surface-tint: '#0056d0'
  primary: '#0055ce'
  on-primary: '#ffffff'
  primary-container: '#2f6fed'
  on-primary-container: '#ffffff'
  inverse-primary: '#b1c5ff'
  secondary: '#565e71'
  on-secondary: '#ffffff'
  secondary-container: '#dbe2f9'
  on-secondary-container: '#5c6477'
  tertiary: '#006c3c'
  on-tertiary: '#ffffff'
  tertiary-container: '#00884c'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a0'
  secondary-fixed: '#dbe2f9'
  secondary-fixed-dim: '#bfc6dc'
  on-secondary-fixed: '#141b2c'
  on-secondary-fixed-variant: '#3f4759'
  tertiary-fixed: '#70fda7'
  tertiary-fixed-dim: '#51df8e'
  on-tertiary-fixed: '#00210e'
  on-tertiary-fixed-variant: '#00522c'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d9e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-metric:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  metric-tabular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system embodies modern, utility-grade precision merged with the high polish of premier fintech analytics. Engineered for real-time domestic fluid dynamics, telemetry monitoring, and smart home conservation, the brand communicates vigilance, analytical clarity, and effortless control.

The visual direction follows a Modern Corporate & FinTech aesthetic:
- **Calm, High-Information Density:** White structured cards floating over a soft cool-grey substrate ensure sustained legibility during prolonged monitoring.
- **Instrument Precision:** Crisp borders, sharp numeric hierarchies, and micro-badges replicate high-reliability trading terminal metrics while remaining inviting to modern homeowners.
- **Vigilant Restraint:** Dynamic status-driven accents (flow alerts, normal operations, automated valve shutoffs) cut through a disciplined cool-slate foundation to direct focus where intervention is critical.

## Colors
The palette balances technical utility with high-contrast functional signaling. All color applications comply with strict WCAG AA/AAA standards across data visualizations and monitoring widgets.

### Base Canvas & Surfaces
- **App Canvas:** `#F5F7FA` (Soft cool-grey background for all dashboards and nested views).
- **Surface Level 1 (Card & Modal Fill):** `#FFFFFF`.
- **Surface Level 2 (Subtle Inset / Neutral Hover):** `#F8FAFC`.
- **Primary Text:** `#101828` (High-contrast slate black for titles, primary readings, and table cells).
- **Muted & Secondary Text:** `#667085` (Neutral slate for metadata, axis marks, labels, and timestamps).
- **Subtle Borders:** `#E4E7EC` (Crisp container separation and table row dividers).

### Brand & Interactive Tints
- **Primary Hydro Accent:** `#2F6FED` (Active nav states, primary CTAs, active telemetry traces).
- **Primary Subdued:** `#EFF4FE` (Focus rings, selected row highlights, active primary pill tabs).
- **Primary Deep Hover:** `#2152B5`.

### Status & Telemetry Signaling
- **Success / Optimal Flow:** `#12B76A` with background `#ECFDF3` and border `#A6F4C5`.
- **Critical Alert / Leak Detected:** `#F04438` with background `#FEF3F2` and border `#FECDCA`.
- **Warning / Flow Anomaly:** `#F79009` with background `#FFFAEB` and border `#FEDF89`.

## Typography
Typographic scale and hierarchy rely on **Inter** with native OpenType features enabled: `cv02`, `cv03`, `cv04` for technical glyph clarity, and `tnum` (tabular numbers) across all numerical metrics, gauge readouts, and table cells.

- **KPI Numerical Display:** Gallon volumes, flow rates (GPM), and pressure readings (PSI) employ `headline-metric` or `display-lg` with tight negative tracking (`-0.02em` to `-0.03em`) and tabular numerals to prevent layout shifting during real-time streaming updates.
- **Labels & Subtitles:** Secondary telemetry metadata and table headers use `label-sm` in all caps or bold sentence-case paired with `#667085`.

## Layout & Spacing
The layout follows a persistent vertical navigation shell with a responsive dashboard canvas.

### Layout Model
- **Left Navigation Rail:** Fixed width of `260px` on desktop viewport (`>= 1280px`), collapsing into an icon rail (`72px`) on tablet (`768px - 1279px`), and converting into an off-canvas drawer with sticky mobile topbar on devices (`< 768px`).
- **Main Canvas Grid:** 12-column fluid grid within the main viewport container, constrained to a maximum content width of `1600px`. Column gutter standard is `1.5rem` (`24px`).
- **Outer Canvas Margins:** `2rem` (`32px`) on desktop viewports; `1.5rem` on tablet; `1rem` on mobile.

### Density & Rhythms
- Layout rhythm adheres strictly to an 8px spatial interval (`0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2rem`).
- Internal card padding is standardized to `1.5rem` (`24px`) for KPI tiles and chart cards, reducing to `1rem` (`16px`) for micro-widgets and condensed list groups.

## Elevation & Depth
Visual hierarchy is defined by soft, diffused shadows paired with faint structural borders, avoiding deep skeuomorphism while creating tactile, separated card surfaces.

### Surface Treatment & Elevation Tiers
- **Canvas Base:** Non-elevated flat `#F5F7FA`.
- **Level 1 (KPI Metrics, Chart Cards, Table Containers):** Pure `#FFFFFF` fill with a `1px` continuous border of `#E4E7EC` and an ambient shadow: `0 1px 3px 0 rgba(16, 24, 40, 0.05), 0 1px 2px -1px rgba(16, 24, 40, 0.05)`.
- **Level 2 (Interactive Floating Elements, Dropdowns, Date-Range Pickers):** Pure `#FFFFFF` fill, `1px` border `#E4E7EC`, supported by an elevated shadow: `0 4px 6px -2px rgba(16, 24, 40, 0.03), 0 12px 16px -4px rgba(16, 24, 40, 0.08)`.
- **Level 3 (Modals, Critical Shutoff Dialogs):** `#FFFFFF` surface with `0 8px 8px -4px rgba(16, 24, 40, 0.03), 0 20px 24px -4px rgba(16, 24, 40, 0.08)`, centered over an overlay backdrop of `rgba(16, 24, 40, 0.6)`.

## Shapes
The design language adopts a balanced `1rem` (`16px`) corner radius for all primary cards, establishing an approachable, refined SaaS feel consistent with modern fintech dashboards.

- **Primary Cards & Containers:** Standardized at `16px` (`rounded-lg`).
- **Interactive Controls (Buttons, Form Inputs):** Standardized at `8px` (`0.5rem`) for crisp precision and high clickability.
- **Pill Badges & Telemetry Status Tags:** Fully rounded pill radius (`9999px`) to distinguish meta chips from structural cards.
- **Table Outlines:** Outer wrapper curved to `16px` with internal borders clipped by overflow masking.

## Components

### Buttons
- **Primary:** `#2F6FED` solid fill with `#FFFFFF` text, `8px` border radius, `0.625rem 1rem` padding (`14px` label). Hover: `#2152B5`. Active: `#1B4497`. Focus ring: `4px` ring `#EFF4FE`.
- **Secondary / Outline:** `#FFFFFF` fill, `1px` solid `#E4E7EC` border, `#101828` text. Hover: `#F8FAFC` surface with border `#D0D5DD`.
- **Destructive (Valve Shutoff / Leak Alarm):** `#F04438` solid fill with `#FFFFFF` text. Focus ring: `4px` ring `#FEF3F2`.

### Status Badges & Chips
- Fully curved pill components (`9999px`) with `0.25rem 0.625rem` padding, font `label-sm`.
- **Normal / Low Flow:** `#12B76A` text on `#ECFDF3` fill with a `6px` solid `#12B76A` circle indicator dot.
- **Warning / Unattended Draw:** `#F79009` text on `#FFFAEB` fill with a `6px` solid `#F79009` indicator dot.
- **Alert / Burst Detected:** `#F04438` text on `#FEF3F2` fill with a pulsing `6px` solid `#F04438` indicator dot.

### Telemetry KPI Cards
- Standard `#FFFFFF` fill, `16px` border radius, `1px` border `#E4E7EC`, Level 1 ambient shadow.
- Header row containing label (`#667085`) and status badge or delta chip.
- Primary number displayed in `headline-metric` (`#101828`, tabular numbers) with inline unit (`gal`, `gpm`, `psi`) styled in `#667085` at `14px` medium.
- Bottom sparkline or micro-comparison subtitle ("vs 2.4 gpm benchmark").

### Telemetry Tables
- Wrapped in Level 1 card surfaces with clipped `16px` borders.
- **Header Row:** Height `44px`, background `#F8FAFC`, bottom border `1px` solid `#E4E7EC`, text `label-sm` in `#667085`.
- **Data Rows:** Height `56px`, background `#FFFFFF`, bottom border `1px` solid `#F2F4F7`, text `body-md` in `#101828`. Hover: `#F8FAFC`. Tabular numbers (`tnum`) applied across timestamps, volumes, and durations.

### Form Inputs & Selectors
- Standard height `40px`, background `#FFFFFF`, border `1px` solid `#D0D5DD`, `8px` border radius, `0.5rem 0.875rem` padding.
- Text in `body-md` `#101828`, placeholder in `#667085`.
- Active/Focused: Border `#2F6FED`, box-shadow `0 0 0 3px #EFF4FE`.

### Checkboxes & Toggle Switches
- **Checkboxes:** `18px × 18px`, `4px` border radius, border `1px` solid `#D0D5DD`. Checked: `#2F6FED` background with white check mark.
- **Toggles (Remote Valve Control):** Width `44px`, height `24px`, background `#E4E7EC`. Active state: `#2F6FED`. Sliding knob: `20px` circle in `#FFFFFF` with Level 1 shadow.