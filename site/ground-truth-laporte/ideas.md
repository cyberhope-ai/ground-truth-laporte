# Ground Truth LaPorte — Design Ideas

## Context

A community action resource about the Microsoft data center in La Porte, Indiana. Powered by PrecognitionOS (CyberHopeAI). Must resemble cyberhopeai.com (dark-committed, gold accent, evidence-chain aesthetic). The handoff document mandates: **dark-only**, brand tokens sampled from the live site, and **the thermometer as the signature element** with empty gauges as a feature.

## Three stylistic approaches

### Approach A — "The Ledger" (forensic civic record)
- **Intro**: A dark, instrument-grade evidence interface. Mono-spaced data labels, hash seals, receipt drill-downs, and the thermometer gauges as the hero. Feels like a public ledger crossed with a mission-control dashboard.
- **Probability**: 0.06

### Approach B — "Newsroom Noir" (editorial investigative)
- **Intro**: Dark editorial magazine with serif headlines, pull quotes, and timeline storytelling. More journalistic, softer, narrative-first.
- **Probability**: 0.03

### Approach C — "Blueprint / Infrastructure" (technical drawing)
- **Intro**: Dark blueprint aesthetic with grid lines, annotation marks, and technical-drawing motifs evoking the physical infrastructure being tracked.
- **Probability**: 0.02

## Chosen: Approach A — "The Ledger"

This matches the CyberHopeAI brand exactly (dark, gold, mono labels, "Evidence. Not Excuses."), honors the handoff mandate (thermometer signature, dark-only), and fits the product truth: this IS an evidence engine doing its work in public.

### Design Movement
Instrument-grade civic forensics — a public evidence ledger rendered like precision instrumentation. Dark-committed, receipt-driven, zero decoration that doesn't carry information.

### Core Principles
1. **Every number carries its receipt** — receipt affordances (document + page, video + timestamp) are part of the UI language everywhere.
2. **Empty gauges are the feature** — "No independent measurement exists" is a first-class, beautifully rendered state, never an error.
3. **Dark-only** — no light variant, matching cyberhopeai.com's commitment.
4. **Symmetry** — company-favorable and community-favorable findings rendered with identical visual weight.

### Color Philosophy
Sampled from live cyberhopeai.com: deep ink backgrounds (#0a0d14, #141b26 panels) signal seriousness and let the gold (#d1a84b) read as "sealed/verified" — like a wax seal on a document. Verified green (#31d296) is reserved strictly for independently confirmed states. Amber (#d9ab45) for pending. Muted slate for "no measurement exists." Red used sparingly for corrections/missed deadlines.

### Layout Paradigm
Asymmetric editorial-ledger hybrid: a persistent left-rail section index on content pages, wide 1040-1120px reading measure, full-bleed dark hero with radial gold/green glows (matching cyberhopeai.com), horizontal gauge rows as the structural spine of the tracker. Cards are flat panels with 1px lines — no heavy shadows, no rounded-everything.

### Signature Elements
1. **The Thermometer** — horizontal commitment gauges with three fill states (verified gradient, pending hatch, empty track).
2. **Receipt chips** — mono-font chips showing `DOC p.4` or `VID 0:14:13` that expand into full provenance panels.
3. **Hash seals** — truncated sha256 fingerprints rendered as mono microcopy on evidence artifacts.

### Interaction Philosophy
Interactions are forensic: hover reveals provenance, click expands the receipt. Nothing bounces or plays. Motion is a 200-300ms ease-out reveal — the feeling of a document being unsealed.

### Animation
- Gauge fills animate width on scroll-into-view (600ms ease-out), respecting prefers-reduced-motion.
- Receipt panels expand with height/opacity transitions (~250ms).
- Section entrances: subtle 12px rise + fade, staggered 60ms.
- A single pulsing "sealed" dot on live status pills (as on the reference preview).

### Typography System
- Display: **Space Grotesk 700** — headlines, gauge names, big numbers.
- Body: **IBM Plex Sans 400/500/600** — prose, UI.
- Mono: **IBM Plex Mono 400/500** — eyebrows, labels, receipts, hashes, data. All caps with 0.14-0.19em tracking for eyebrows.

### Brand Essence
Ground Truth LaPorte is the shared, checkable record underneath the community's biggest infrastructure debate — for residents, officials, reporters, and the company itself. Personality: **precise, fair-minded, unafraid.**

### Brand Voice
Short, declarative sentences. No adjectives where a number exists. Never "we believe" — always "the record shows."
- Example headline: "What was promised. What actually arrived."
- Example CTA: "Show the receipts" / "See where this number comes from"

### Wordmark & Logo
Wordmark: "Ground Truth" in Space Grotesk 700 with "LAPORTE" as a mono eyebrow above it; the "G" mark is a gauge arc inside a rounded square seal — a thermometer/gauge glyph that doubles as a location pin silhouette. Gold on dark.

### Signature Brand Color
**Seal gold #d1a84b** — unmistakably the color of a verified seal against the ink-dark ground.
