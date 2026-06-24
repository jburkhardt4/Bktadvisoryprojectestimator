# BKT Advisory — Project Estimator — Claude Code Operating Rules

> Sibling of the BKT Advisory portfolio. React + Vite + Tailwind v4,
> **JavaScript (no TypeScript), no test runner** — deploys static to Replit.
> The validation ceiling here is `npm run build`.

## Stack

- React (Vite), Tailwind CSS v4, Supabase (`@jsr/supabase__supabase-js`)
- **No TypeScript, no tests** (a separate future track)

## Working style

- Start with a plan before edits.
- Prefer minimal diffs over large refactors; preserve existing architecture.
- Name affected files before editing them; always state verification steps.

## UI rules

- Dark mode anchors: slate-950 family; light mode anchors: slate-50 family.
- Royal-blue brand accent; match the portfolio's design system and brand voice.
- Validate phone-size layouts after UI changes.

## Required verification

- `npm run build` — the only automated gate (no typecheck/lint/tests yet).
- Visual verification in the Replit/preview.

## Ported AI agent kit + institutional knowledge

Vendors the **minimal** BKT agent/skill kit from the hub (`bkt-ai-apply`,
canonical). `.claude/` and `.knowledge-vendor/` are **flat, hash-locked copies** —
do NOT hand-edit them; edit in the hub and re-sync (`sync-claude-kit.mjs` / `kb:sync`).

@.knowledge-vendor/INDEX.md

- **Skills:** design-taste-frontend, emil-design-eng, high-end-visual-design, redesign-existing-projects. **Agents:** ui-ux, emil-design-eng, feature-dev. The `bkt-knowledge` skill explains the memory layers.
- **Toolchain mapping:** where a ported agent says `pnpm validate`, run `npm run build` here.
- **Knowledge paths:** ported agents reference hub paths (`docs/...`); here the portable subset is `.knowledge-vendor/` and brand truth is `.knowledge-vendor/positioning.md`. Treat missing hub-only docs as not-applicable — do not HOLD on them.

## Never do

- Do not hand-edit vendored `.claude/` or `.knowledge-vendor/` files — re-sync from the hub.
- Do not introduce TypeScript or test infra ad hoc (separate future track).
- Do not change Supabase/auth behavior without tracing the full flow.
