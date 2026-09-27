# Round 7: last loose ends

These three came up in the closing summary and haven't been answered yet. Once they are, every decision is recorded in the round files, `CONTEXT.md` or the ADR.

---

## Q44 - What if `node_modules` gets copied into the VM?

If a developer runs `pnpm install` on the Host before `vagrant up`, the one-time copy into `~/app` brings their Windows or macOS `node_modules` with it, and possibly `dist/`.

**Recommended:** Provisioning deletes `~/app/node_modules` and `~/app/dist` after the copy, then runs `pnpm install` inside the VM.

**Answer:**
Go with recommended
---

## Q45 - What happens to Vite's scaffold demo files?

`pnpm create vite` generates `App.tsx`, `App.css`, `index.css`, `src/assets/react.svg`, `public/vite.svg` and its own README.

**Recommended:** Delete them all, except keep one small `public/favicon.svg` (documented in `FILES.md`) so browsers don't log a 404 for a missing favicon. `global.scss` replaces `index.css`, and the project README replaces Vite's.

**Answer:**
Go with recommended
---

## Q46 - What happens to the planning files?

That's `INTENT.md`, `round_1_questions.md` … `round_7_questions.md`, and the spec that to-spec will produce.

- **(a)** Move them to `docs/planning/` and commit them. They're then listed in `FILES.md` and ship in the template.
- **(b)** Keep them out of the repo: move them outside the project folder, or gitignore them.
- **(c)** Commit only the spec (e.g. `docs/spec.md`), and keep the intent and round files out of the repo.

**Recommended:** (c). The spec is the useful record. The round files are the discussion that led to it, and the template should start clean for new apps.

**Answer:** (a), but for all of them: move `INTENT.md`, every `round_*_questions.md` file and the to-spec output into `docs/planning/`, commit them, and list them in `FILES.md`. → *Refined during `/setup-matt-pocock-skills`: they go in the feature folder `docs/planning/starter-setup/`.*
