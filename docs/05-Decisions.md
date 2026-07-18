Code can evolve, but decisions should be documented.
Decision-007

Platform Preview adopts component composition.

PlatformPreview

↓

DashboardPreview

↓

CapabilityGrid

↓

MetricCard

↓

ActivityFeed

↓

AIInsightCard
---

# Decision 2026-07-16 — Milestone Development Workflow

## Status

Accepted ✅

## Background

As the SmeAIHub project grows, every milestone should follow a consistent engineering workflow to ensure code quality, documentation quality, and maintainable Git history.

## Decision

Every milestone should follow the workflow below:

```text
Architecture
        ↓
Implementation
        ↓
Compile Clean
        ↓
Responsive Testing
        ↓
Product Review
        ↓
Git Commit (Feature)
        ↓
Git Tag (Milestone)
        ↓
Documentation
        ↓
Git Commit (Docs)
```

## Rationale

This workflow ensures:

- Features are reviewed before release.
- Documentation stays synchronized with implementation.
- Git history remains clean and easy to understand.
- Milestones can be traced through Git Tags.
- Product quality improves through structured reviews rather than ad-hoc changes.

## Notes

- Every feature milestone should have a dedicated Feature Commit.
- Every milestone should have a Git Tag after the feature is complete.
- Documentation updates should be committed separately whenever practical.
- Repository refactoring should use independent `refactor:` commits and should not be mixed with feature development.
## Development Environment

To ensure a stable and reproducible development workflow:

- Always start each development session from the project root.
- Verify the current working directory before running development tools.
- Use a dedicated terminal for project development tasks (Codex, Git, npm).
- Keep separate terminals for system administration, SSH, or unrelated commands.
- Complete all development work within the project workspace to avoid accidental modifications outside the repository.
## Trust Building Principles

SmeAIHub only displays verifiable trust signals.

- Partner information must represent confirmed business relationships.
- Do not publish fabricated testimonials, customer counts, ratings, or business outcomes.
- Official partner logos should only be used after receiving the appropriate brand assets and permission.
- Until official assets are available, the interface must remain production-ready using graceful placeholders.

Visual hierarchy over visual quantity.
## Decision — Early Partner Logo Display

Real customer logos should always preserve their original aspect ratio.

Guidelines:
- SVG preferred whenever available.
- PNG with transparent background is acceptable.
- Never stretch or crop customer logos.
- Keep logo presentation consistent by constraining the display area rather than modifying the logo itself.

This ensures visual consistency while respecting each partner's brand identity.