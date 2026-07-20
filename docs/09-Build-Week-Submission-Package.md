# OpenAI Build Week Submission Package

## Submission Status

- Project: SmeAIHub
- Recommended category: Work & Productivity
- Official deadline: July 21, 2026 at 5:00 PM PDT
- Package status: Copy complete; external submission requirements remain
- Submission platform: [OpenAI Build Week on Devpost](https://openai.devpost.com/)

## Required Pre-Submission Actions

The following items must be completed or confirmed before submitting:

- [x] Upload the Demo video as a public, under-three-minute YouTube video.
- [x] Add the public YouTube URL to the submission package and README.
- [ ] Retrieve and enter the primary Codex `/feedback` Session ID.
- [x] Verify the core build Session model as GPT-5.6 Sol from its recorded `turn_context` history.
- [x] Align the Hero badge, cover, README, video narration, and submission copy to `GPT-5.6 Sol`.
- [ ] Choose and add an appropriate repository license before public judging.
- [ ] Confirm that the repository is public, or share the private repository with the official judging addresses.
- [ ] Confirm that the live website and `/demo` are publicly reachable without credentials.
- [ ] Complete the Devpost eligibility, team, and official-rules declarations.

Do not submit until every item above has been resolved. The official challenge requires a working project, category, description, public Demo video, repository, README, and primary Codex Session ID.

## Devpost Basics

### Project name

SmeAIHub

### One-line pitch

SmeAIHub turns service-business challenges into practical, industry-specific AI automation opportunities and implementation next steps.

### Short description

SmeAIHub helps restaurants, hotels, spas, and other service businesses discover where AI can create measurable operational and growth value—without requiring owners to understand models, prompts, or automation tooling first.

### Category

Work & Productivity

### Tags

- artificial-intelligence
- small-business
- workflow-automation
- customer-experience
- productivity
- codex

## Project Description

### Inspiration

Small and medium-sized service businesses lose time and revenue to repetitive customer questions, fragmented booking workflows, inconsistent follow-up, and manual operations. Most AI products begin with models, prompts, or integrations, which creates another layer of complexity for already-busy owners.

SmeAIHub begins with the business problem. It translates a business profile, industry, operational challenge, and growth goal into a practical AI opportunity assessment that an owner can understand and act on.

### What it does

SmeAIHub provides a complete AI Business Diagnosis journey:

1. A business shares its industry, number of locations, biggest challenge, and improvement goal.
2. A dedicated analysis state communicates the diagnosis workflow.
3. The product returns an industry-specific AI readiness score and prioritized opportunities.
4. The report estimates potential time savings and growth impact.
5. The visitor can book a strategy session or start another diagnosis.

The current prototype includes tailored results for restaurants, hotels, and spa and wellness businesses. It also includes secure lead delivery, client and server validation, consent-controlled analytics, responsive design, production metadata, and a complete submission-ready product experience.

### How we built it

SmeAIHub is built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Lucide React. The marketing and metadata layers are server-rendered, while the interactive diagnosis is isolated inside a focused Client Component boundary.

The diagnosis request passes through client validation, a same-origin server endpoint, server validation, payload limits, honeypot protection, and HTML escaping. Valid leads are delivered through Resend. Google Analytics and Microsoft Clarity load only after explicit consent.

The current public diagnosis uses a deterministic, industry-specific recommendation layer. It does not send submitted business information to an OpenAI model at runtime. This makes the Build Week prototype predictable, reviewable, and privacy-conscious while validating the complete product workflow.

### How Codex accelerated the build

Codex worked as an active product and engineering collaborator across the full development cycle. It helped:

- sharpen the product positioning from a generic automation platform to AI Agents for Service Businesses;
- review the information architecture and first-screen product story;
- design the Form → Thinking → Results interaction model;
- plan small, independently testable implementation steps;
- implement and review responsive React and TypeScript components;
- diagnose state, validation, build, and browser issues;
- create the Hero, personalized results, supporting states, metadata, screenshots, README, and submission assets;
- maintain the roadmap, changelog, design reviews, and decision history;
- validate the production build and desktop/mobile product experience.

The project preserves these decisions in its Git history and documentation rather than presenting Codex as a one-off code generator.

### GPT-5.6 Sol usage statement

> The core SmeAIHub experience was built with GPT-5.6 Sol through Codex as an active product and engineering collaborator. GPT-5.6 Sol supported product reasoning, interaction design, implementation planning, code iteration, debugging, review, and submission preparation. The current public diagnosis runtime remains deterministic; the next product milestone will use the OpenAI Responses API and Structured Outputs for live, explainable reports.

The local Codex Session record identifies the current task as `019f7dce-ba9d-7da2-8433-0f1e496f2ba7` and records `gpt-5.6-sol` for every saved turn context. Confirm the same identifier through `/feedback` before pasting it into Devpost.

### Challenges we encountered

- Turning an abstract “AI automation” idea into a product story understandable within seconds.
- Adding a convincing AI interaction without breaking the working lead and email flow.
- Personalizing results while keeping the first public prototype deterministic and reviewable.
- Preserving responsive behavior while adding more information to the Hero and Demo.
- Communicating OpenAI's role transparently without claiming a runtime model integration that does not yet exist.
- Producing a submission package that is technically accurate, visually coherent, and safe to demonstrate.

### Accomplishments

- Converted a marketing form into a complete Form → Thinking → Personalized Results workflow.
- Created different readiness scores, opportunities, and impact estimates for restaurants, hotels, and spas.
- Preserved API submission, email delivery, analytics consent, validation, and security protections.
- Built a results-aware supporting sidebar and restart path.
- Produced a responsive, production-ready site with a clean build and browser review.
- Created a complete Build Week asset set: cover, screenshots, README, Demo video, captions, and submission copy.

### What we learned

The strongest AI product experience is not defined by how often it says “AI.” It is defined by how clearly it translates intelligence into a useful decision. For service businesses, a prioritized opportunity, expected impact, and understandable next step are more valuable than a generic chatbot.

We also learned that Codex is most effective when treated as a persistent collaborator across product reasoning, implementation, verification, and documentation—not only as a code-completion tool.

### What's next

The next runtime milestone is an OpenAI-powered diagnosis service using:

- the OpenAI Responses API for business analysis;
- Structured Outputs for reliable scores, opportunities, and implementation priorities;
- explicit data minimization and user control;
- deterministic validation and guardrails around generated recommendations;
- traceable explanations for why each opportunity was recommended;
- streaming progress and downloadable implementation roadmaps.

Longer term, SmeAIHub will become a workspace where service businesses can move from diagnosis to deploying and managing an AI workforce.

## Judging-Criteria Alignment

### Technological implementation

- Working Next.js product with real validation, API, email, analytics-consent, security, SEO, and responsive behavior.
- Non-trivial multi-state diagnosis flow with industry-specific results.
- Codex used throughout product design, implementation, debugging, review, and documentation.

### Design

- Coherent end-to-end experience rather than a disconnected proof of concept.
- Five-second Hero story, clear primary action, visible analysis state, readable results, and conversion next step.
- Desktop and mobile browser review completed.

### Potential impact

- Targets a specific audience: restaurants, hotels, spas, and other service businesses.
- Addresses concrete operational pain: bookings, customer questions, follow-up, marketing, and staff productivity.
- Translates AI adoption into understandable opportunities and business-impact estimates.

### Quality of the idea

- Starts with business diagnosis instead of requiring model or automation expertise.
- Connects discovery, prioritization, impact, and implementation in one workflow.
- Establishes a credible path from a deterministic prototype to explainable, structured OpenAI-generated reports.

## Submission Links

- Live website: https://smeaihub.ai
- Live Demo: https://smeaihub.ai/demo
- Repository: https://github.com/uandai27/SmeAIHub
- Public YouTube Demo: https://youtu.be/iRyJbM6pD50
- Primary Codex `/feedback` Session ID: `[CODEX_SESSION_ID]`

## Media Checklist

- Cover image: `public/submission/build-week-cover.jpg`
- Hero screenshot: `public/submission/hero-build-week.jpg`
- Results screenshot: `public/submission/ai-diagnosis-results.jpg`
- Demo video source: `public/submission/smeaihub-build-week-demo.mp4`
- Demo captions: `public/submission/smeaihub-build-week-demo.srt`

## Final Review Checklist

- [ ] Project works from the public website.
- [ ] Public Demo completes without unintended email or analytics test data.
- [x] YouTube video is public, under three minutes, and has intelligible audio.
- [x] Video audio accurately covers verified Codex and GPT-5.6 Sol usage.
- [ ] Repository access and license satisfy the official requirements.
- [ ] README includes setup instructions and explains how Codex accelerated the build.
- [ ] `/feedback` Session ID is correct.
- [ ] All Devpost links open in a signed-out browser.
- [ ] Submission copy does not overstate the current deterministic runtime.
- [ ] Category is Work & Productivity.
- [ ] Final preview has no placeholders.
- [ ] Submission is completed before July 21, 2026 at 5:00 PM PDT.
