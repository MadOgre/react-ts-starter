# Round 2

## Q12 - Where does the code live when you use the Dev VM?

You described two options. Here is what each costs once pnpm is involved:

- **(a) Code on the Host, shared into the VM.** This has three problems:
  1. **pnpm symlinks.** pnpm builds `node_modules` out of symlinks, and VirtualBox shared folders on a Windows Host refuse to create them unless VirtualBox runs as admin. So `pnpm install` fails in the shared folder.
  2. **Native binaries.** esbuild, rollup and sass-embedded ship binaries for each OS. If the VM installs into the shared folder, the Host's editor ends up with Linux binaries, which is the same kind of mismatch you're trying to avoid.
  3. **HMR.** The VM never gets file-change events from the Host, so Vite has to poll.

  The fix is to mount a folder on the VM's own disk over `node_modules` inside the VM. The VM gets its own Linux `node_modules`, the Host keeps its own, and pnpm symlinks work. Polling is switched on only inside the VM.
- **(b) Code only inside the VM.** You clone it on the VM's disk and edit through VS Code Remote-SSH. HMR is instant and there are no symlink or binary problems. The downside: the code isn't on your Host, so `vagrant destroy` loses anything you haven't pushed.

**Recommended:** (a) with the `node_modules` fix, and VS Code connects through Remote-SSH so ESLint and TypeScript run in the VM. That keeps your "code stays local" model. HMR will poll, which I expect to be around 100–300 ms for a project this size. That's acceptable, but it isn't the native speed you'd get running directly on the Host.

**Answer:** The recommendation is good. More flexibility is better, but we may have to re-evaluate later if refresh speed becomes a problem. → *Later reopened and changed to (b), code inside the VM; see Round 4.*

---

## Q13 - What does `vagrant up` do?

- **(a)** Provision only: install Node 22 and pnpm, then run `pnpm install`. You then run `vagrant ssh` and `pnpm dev`, or run it from a Remote-SSH terminal.
- **(b)** The same, plus the dev server starts automatically as a background service. Logs and the error overlay are then harder to see.

**Recommended:** (a). Port 5173 is forwarded, and Vite listens on `0.0.0.0` inside the VM so the Host browser can reach it.

**Answer:** Go with recommendation. → *Refined by Q43: Vite listens on `0.0.0.0` only inside the VM, via an environment variable. Port later changed to 9000 (spec).*

---

## Q14 - What does "a script exists for easy local serving" mean now?

With pnpm, is `pnpm dev` enough (it works on the Host and in the VM)? Or do you want a wrapper script? A wrapper means `.sh` plus `.ps1` for Windows.

**Recommended:** `pnpm dev` is enough. No wrapper scripts: they would add a second way to do the same thing.

**Answer:** Go with recommended.

---

## Q15 - How are pnpm and line endings pinned?

Put the pnpm version in `package.json` `packageManager`, and have the VM enable it through corepack. And since the team will be on Windows, macOS and Linux, add `.gitattributes` with `* text=auto eol=lf` so Windows checkouts don't turn line endings into CRLF.

**Recommended:** Yes to both.

**Answer:** Go with recommended.

---

## Q16 - How are files inside `src/` organized?

You settled on `routes.tsx`, `pages/` and `components/`. There are still three choices:

- **Folder per component** (`pages/Home/Home.tsx` + `Home.module.scss`) or **flat** (`pages/Home.tsx` + `pages/Home.module.scss`)?
- **Where does the React Query client live?** Options are `main.tsx`, or its own `src/queryClient.ts`.
- **Where does the Home query live?** It could sit inside the Home Page, or in a `src/queries/` folder.

**Recommended:** Folder per component. `queryClient.ts` gets its own file. The query stays inside the Home folder (`pages/Home/useGreeting.ts`) until something else needs it. `components/` starts with only `.gitkeep`.

**Answer:** Folder per component. `queryClient.ts` gets its own file. The query stays inside the Home folder (`pages/Home/useGreeting.ts`) until something else needs it. `components/` starts with only `.gitkeep`. Also add an `api` folder and an `apiHooks` folder. The `api` folder holds functions that access the JSON API using axios (another dependency), and `apiHooks` holds ready-made hooks using React Query. Add one test API route; call the resource Item or whatever you like. It goes in `api`, and there should be a mock API request function that either returns local data instead of calling axios, or uses axios with a mocked response. → *`useGreeting` later replaced by `useItems` (Q20).*

---

## Q17 - Should imports use a `@/` path alias?

It lets you write `import X from "@/components/X"` instead of `../../components/X`. It costs one line in `vite.config.ts` and one in `tsconfig.app.json`.

**Recommended:** Yes. It's cheap, and new apps built from this will want it.

**Answer:** Absolutely! Love this idea.

---

## Q18 - Should ESLint use type-aware rules?

`typescript-eslint`'s type-checked presets catch unhandled promises, which is useful with React Query. They also make linting slower and noticeably stricter.

**Recommended:** No. Use plain `recommended` + react-hooks + react-refresh + stylistic (double quotes, trailing commas, semicolons, 2-space indent) + `prefer-destructuring`. That fits "not too strict".

**Answer:** Yes, use type-aware rules.

---

## Q19 - Should `CONTEXT.md` be committed?

I created it as part of this session. It's a short glossary (Host, Dev VM, Page, Shared Component). Should it ship in the template, and be listed in `FILES.md`? Or should I delete it once we finish, as a planning artifact?

**Recommended:** Commit it. It helps future AI-assisted work in apps built from the template.

**Answer:** Commit it, but note in the README that it can be deleted to start fresh.
