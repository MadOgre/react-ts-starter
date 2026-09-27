# 01: Walking skeleton: Home and NotFound Pages served by `pnpm dev`

**What to build:** A developer runs `pnpm install && pnpm dev` on the Host and sees the Home Page at the root URL; any unknown URL shows the NotFound Page. The app starts from Vite's React + TypeScript template with every scaffold demo file removed except one small favicon. Node 22 LTS and the pnpm version are pinned, text files are normalised to LF, and a sensible `.gitignore` is in place. Routing uses React Router in data mode from a single routes module. Each Page lives in its own folder and is exported (named export) through a barrel for the pages area. The `@/` alias points at the source root for both Vite and TypeScript. The components area exists with a `.gitkeep`. Initialise git with `master` as the only branch and commit this ticket's work, so it can be reviewed against the one before. Every ticket commits its work in the same way, and ticket 06 squashes all of them into the single initial commit. See the spec in this feature folder and `CONTEXT.md` for terms.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] `pnpm install && pnpm dev` serves the Home Page at `/`
- [x] An unknown URL renders the NotFound Page
- [x] Editing the Home Page updates the browser through HMR without a full reload
- [x] Node 22 is pinned in the version-manager file and the package manifest's engines field; pnpm is pinned in `packageManager`
- [x] Git attributes normalise text files to LF; `.gitignore` covers Node, Vite build output, editor and OS files, and `.env*.local`
- [x] No Vite demo files remain (sample App component, sample CSS, logo assets, template README); one small favicon is kept
- [x] Pages are named exports imported via the pages barrel using the `@/` alias
- [x] The components area contains only `.gitkeep`
- [x] Runtime dependencies at this point are React, React DOM and React Router only

## Comments

**2026-09-27, implementation notes:**
- React Router **v8** (8.4.0) is used rather than v7: it's the current major, keeps the same data-mode API (`createBrowserRouter`, `RouterProvider` from the DOM entry), and requires Node ≥ 22.22, so the engines pin is `^22.22.0`.
- The current Vite React TS template ships **oxlint** rather than ESLint; it was removed along with its `lint` script. Ticket 02 adds ESLint and the `lint` script back.
- `pnpm-lock.yaml` is generated and must be committed; ticket 06 lists it in `FILES.md`.
- `.gitignore` already allows `.vscode/settings.json` and `.vscode/extensions.json` (ticket 02) and ignores `.vagrant/` (ticket 05).
- Verified: `pnpm build` passes, including the type-check. A render check with a throwaway script confirmed `/` renders Home and an unknown URL renders NotFound. The dev server logged an HMR update, not a full reload, when Home was edited. Not checked in a real browser.
- Switched to per-ticket commits (option b): git was initialised on `master`, this ticket was committed and reviewed with `/code-review` against the empty tree. No `/tdd`, because testing is out of scope.

**2026-09-27, review fixes:** after `/code-review`, `@types/node` was aligned with the Node 22 pin, `packageManager` was set to the current pnpm (12.6.0, which also regenerated the lockfile), a misleading tsconfig comment and an unexplained setting (`allowArbitraryExtensions`) were fixed or removed, unused `.gitignore` entries were trimmed, the 9 KB Vite favicon was replaced with a small plain one, and the routes comment was shortened. The HMR box is unticked until someone checks it in a browser.
- pnpm 12 needs a recent corepack. Corepack 0.36.0, bundled with Node 22.23, works. The older standalone corepack shim from 2024 (`/usr/bin/pnpm` on the planning machine) fails with `Cannot find module …/bin/pnpm.cjs`.

**2026-09-27, pnpm pin corrected:** the 12.6.0 pin broke `pnpm dev` for the user in WSL. Their `pnpm` is an older corepack shim that can only launch pnpm ≤ 10 (11 and 12 changed their package layout). The pin is now **pnpm 10.34.5**, the newest 10.x, and the lockfile was regenerated with it. A template others will clone must not require the newest corepack. Revisit when older corepack shims have aged out.

**2026-09-27, human verification:** the user confirmed in a real browser that HMR updates the Home Page without a full reload. Every box on this ticket is now ticked.
