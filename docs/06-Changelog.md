# v0.5.0 (In Progress)

## Added

- Central site configuration
- Production metadata
- SEO foundation
- robots.txt
- sitemap.xml
- Web App Manifest
- Branded 404 page

## Improved

- Production readiness
- Search engine compatibility
- Website maintainability
- Brand consistency

Added Platform Preview

Added Dashboard Preview

Added Capability Grid

Improved Mobile Hero

Improved Responsive Layout

Added AI Insight

Refined Dashboard Metrics
v0.3.0

Added Trusted By section.

Introduced Early Partner cards.

Added graceful logo placeholder system.

Improved landing page trust signals.
Business Workflow Section
Workflow Cards
Responsive support
Icon visual polish
Hover interaction improvements
## 2026-07-17

### Milestone 3.3 — Industries

Added the Industries section to the landing page.

Highlights:
- Introduced industry-focused solution cards
- Added Restaurants, Hotels, and Spas & Wellness
- Added AI use cases for each industry
- Refined information hierarchy and spacing
- Improved product messaging toward industry solutions
## 2026-07-17

### Milestone 3.4 — Pricing

Enhanced the Pricing section to better reflect SmeAIHub's enterprise-focused positioning.

Highlights:
- Refined pricing copy and messaging
- Renamed "Multi-location" plan to "Enterprise"
- Improved plan hierarchy (Starter → Growth → Enterprise)
- Refined enterprise positioning and descriptions
- Updated pricing footer messaging
## 2026-07-17

### Milestone 3.5 — About

Introduced the About section to communicate SmeAIHub's brand philosophy.

Highlights:
- Added About section
- Introduced responsive two-column layout
- Added three core principles with supporting descriptions
- Improved brand messaging and information hierarchy
## 2026-07-18

### Added

- Official SmeAIHub Logo Mark
- Production SVG brand asset
- Navbar brand integration
- Footer brand integration
- 404 page branding
- PWA application icons
- Unified typography for brand identity

### Improved

- Consistent branding across production pages
- Footer messaging
- Brand spacing and visual consistency

### Build

- ESLint passed
- TypeScript passed
- Production build passed
# Changelog

## 2026-07-19

### Milestone 5.1 — OpenAI Build Week Submission

#### Step 2 — Hero Highlights

**Added**

- Added AI capability highlights beneath the Hero call-to-action section.
- Introduced four key product value indicators:
  - GPT-powered Business Diagnosis
  - Industry-specific AI Agents
  - Personalized Automation Roadmap
  - Ready in under 2 minutes
- Added Lucide icons to improve readability and visual scanning.
- Implemented responsive grid layout for desktop and mobile devices.

**Improved**

- Strengthened Hero messaging for OpenAI Build Week.
- Reinforced AI-first product positioning without changing the overall page structure.
- Improved user understanding of the platform's core capabilities within the first screen.

**Quality**

- ESLint: Passed
- TypeScript: Passed
- Production Build: Passed

## 2026-07-20

### Milestone 5.2 — AI Diagnosis Results Experience

**Added**

- Added an AI Thinking experience between form submission and results.
- Added AI readiness score, top opportunities, estimated time savings, and growth potential.
- Added personalized diagnosis results for restaurants, hotels, and spa and wellness businesses.
- Added a strategy-session conversion path and Start Another Diagnosis action.
- Added a state-aware sidebar for form, thinking, and results phases.

**Improved**

- Replaced the generic success confirmation with a complete AI diagnosis experience.
- Improved Demo information hierarchy and Build Week product storytelling.
- Preserved the existing lead API, analytics tracking, and email delivery behavior.
- Removed unreachable legacy success-state markup.

**Quality**

- ESLint: Passed
- TypeScript: Passed
- Production Build: Passed
- Desktop browser review: Passed at 1440 px
- Mobile browser review: Passed at 390 px
- Browser console: No errors or warnings

### Milestone 5.3 — Submission Assets

#### Step 1 — Hero Screenshot

**Added**

- Added a 1440 × 1000 Build Week Hero screenshot.
- Captured the GPT-5.6 Sol positioning, primary CTA, AI capability highlights, product dashboard, and AI opportunity snapshot in one submission-ready frame.
- Saved the reusable asset at `public/submission/hero-build-week.jpg` for README, cover design, and demo-video use.

#### Step 2 — AI Diagnosis Results Screenshot

**Added**

- Added a 1200 × 1036 AI Diagnosis Results screenshot.
- Captured the restaurant-specific diagnosis, AI readiness score, top opportunities, business-impact metrics, and recommended next steps.
- Used the API honeypot path to render the authentic result flow without sending an email or creating a test lead.
- Saved the reusable asset at `public/submission/ai-diagnosis-results.jpg`.

#### Step 3 — Build Week Cover and OG Image

**Added**

- Added a 1200 × 630 Build Week submission cover using the official brand mark and authentic AI Diagnosis Results.
- Added a clear five-second product story covering the audience, product value, supported industries, and OpenAI GPT-5.6 Sol positioning.
- Configured the cover as the default Open Graph and Twitter summary image.
- Saved the reusable asset at `public/submission/build-week-cover.jpg`.

#### Step 4 — README Submission Edition

**Improved**

- Replaced the default Next.js README with a complete Build Week product narrative.
- Added the submission cover, homepage screenshot, and AI Diagnosis Results screenshot.
- Documented the problem, product flow, current capabilities, architecture, technology, local setup, quality checks, and roadmap.
- Added a transparent OpenAI section that distinguishes GPT-5.6 Sol/Codex-assisted development from the current deterministic runtime prototype.
- Documented the planned OpenAI Responses API and Structured Outputs integration without overstating current repository capabilities.

#### Step 5 — Demo Video Planning and Script

**Added**

- Added a production-ready storyboard for a two-minute Build Week demo video.
- Added an exact voiceover script covering the problem, product flow, diagnosis result, OpenAI usage, and product vision.
- Added fictional Restaurant demo data with expected personalized result values.
- Added safe local recording guidance that avoids test lead delivery, analytics events, personal data, and secrets.
- Added recording, editing, and acceptance checklists for a consistent 1080p submission.

**Clarified**

- Described GPT-5.6 Sol through Codex as a build-time product and engineering collaborator.
- Described the current diagnosis runtime as deterministic and industry-specific.
- Positioned the OpenAI Responses API and Structured Outputs as the next runtime milestone.
- Kept the actual Demo video marked as pending until recording and final export are complete.

#### Step 6 — Final Demo Video

**Added**

- Added a 1 minute 40 second Build Week product demo at `public/submission/smeaihub-build-week-demo.mp4`.
- Added synchronized English narration and a companion SRT caption file.
- Presented the complete product story across the problem, Hero, diagnosis form, AI Thinking state, industry-specific results, OpenAI roadmap, and closing vision.
- Added the final Demo video and captions to the README submission experience.

**Quality**

- Resolution: 1920 × 1080
- Frame rate: 30 fps
- Video: H.264
- Audio: AAC
- Duration: 1 minute 40 seconds
- Key-frame visual review: Passed
- Audio and video stream validation: Passed

### Milestone 5.4 — Submission Package

#### Step 1 — Devpost Submission Copy

**Added**

- Added a complete Devpost-ready Submission Package with a one-line pitch, short description, category, tags, and long-form project narrative.
- Added Inspiration, What It Does, How We Built It, Codex Usage, Challenges, Accomplishments, Learnings, and What's Next sections.
- Added direct alignment with the official technological implementation, design, potential impact, and idea-quality judging criteria.
- Added official submission requirements, media inventory, links, and final review checklist.

**Identified**

- The final Demo must be uploaded as a public, under-three-minute YouTube video.
- The submission must include a primary Codex `/feedback` Session ID.
- GPT-5.6 Sol usage must be verified from the Codex Session record before updating model-specific claims across the product and submission assets.

#### Step 2 — GPT-5.6 Sol Evidence and Positioning

**Verified**

- Verified `gpt-5.6-sol` in every saved turn context for the primary Build Week Codex Session.
- Identified the local Session ID as `019f7dce-ba9d-7da2-8433-0f1e496f2ba7`, pending confirmation through `/feedback` before Devpost submission.

**Updated**

- Standardized the product Hero, README, submission package, video script, and submission documentation on GPT-5.6 Sol.
- Regenerated the Hero screenshot, Build Week cover, Demo Video, narration, and captions with the verified model name.
- Preserved the distinction between GPT-5.6 Sol/Codex-assisted development and the current deterministic diagnosis runtime.
- The repository requires an explicit license choice and confirmed public or judge access.

#### Step 3 — Public YouTube Demo

**Published**

- Published the final 1 minute 40 second Build Week Demo as a public YouTube video.
- Added the canonical public URL, `https://youtu.be/iRyJbM6pD50`, to the README and Submission Package.
- Marked the public-video upload and YouTube-link requirements as complete.
