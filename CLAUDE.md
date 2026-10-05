## Agent skills

### Issue tracker

Issues and specs are local markdown files under `docs/planning/`, one folder per feature, each starting from an `INTENT.md`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Working rules

### Workflow

A feature moves through `INTENT.md` → `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement`, one stage at a time. The developer starts each stage; finish the current one and wait for them to start the next. `/implement` reviews with `/code-review`, and its commit follows Review until clean below. Prompt the developer to clear the context and to review the spec and tickets manually when running implement.

### Keep the build green

Before every commit, run `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start with the same `pnpm` and Node the developer uses. Commit only when all of them pass: chain the checks and the commit with `&&`.

- A check that passes only through a workaround (another binary, an env var, a manual step) has failed. Report it and agree the fix with the developer before committing. Version bumps to dependencies or tooling must run with the developer's existing tools.
- Every failure seen while verifying is real, including a one-off that looks environmental. Resolve it with the developer before calling the work done.
- Ask the developer to stop their `pnpm dev` before installing or removing dependencies. Start a test dev server only while theirs is stopped: every Vite server shares `node_modules/.vite/deps`.

### Review until clean

After `/code-review`, repeat: fix the findings, verify as above, then have both the Standards and the Spec agents review again. Commit once both report nothing to fix. When the only fixes are wording changes, a re-review is usually unnecessary: use judgement, and re-review when a wording fix changes a fact, an instruction or the meaning. Tell the developer which round a change is on.

### Code conventions

Lint enforces style (`eslint.config.js`). Review also checks the conventions lint can't, such as `FC` component typing and generics only with a reason. They are listed under Implementation Decisions in `docs/planning/starter-setup/spec.md`.

### Grilling sessions

Write each round's questions to `docs/planning/<feature-slug>/round_<N>_questions.md`, with an empty **Answer:** under each question, and give only a short pointer in chat. A grilling session produces documents only (the round files, `CONTEXT.md`, ADRs) and ends with the shared-understanding summary; implementation starts separately.
