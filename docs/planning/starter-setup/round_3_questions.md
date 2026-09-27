# Round 3

Settled in Round 2: code on the Host, shared into the Dev VM, with `node_modules` on the VM's own disk and polling HMR (to revisit if refresh gets slow) *(later superseded: the code lives inside the VM, see Round 4)* · `vagrant up` only provisions · `pnpm dev` is the only serve command · `packageManager` + corepack + `.gitattributes` LF · folder per component · `@/` alias · type-aware ESLint · `CONTEXT.md` is committed, and the README says it can be deleted.

New terms in `CONTEXT.md`: **API Function** and **API Hook**.

---

## Q20 - Does the Item API Hook replace `useGreeting`?

In Round 2 we put a local `useGreeting` query in the Home folder. Now there's a real API layer, so having both means two ways to fetch data in a starter that's meant to show one.

**Recommended:** Drop `useGreeting`. Home uses the Item API Hook (`useItems`) and shows the list, with a plain loading line and a plain error line. That single path demonstrates React Query, axios and the API layer together.

**Answer:** Go with recommended.

---

## Q21 - How is the Item request mocked?

- **(a)** The API Function skips axios and returns `Promise.resolve(items)`. It's the simplest option, but axios never runs, so the setup isn't proven to work.
- **(b)** The API Function makes a real axios call on the shared axios instance and passes a per-request mock `adapter` that returns the local data. Everything else (base URL, instance config, response typing) runs for real. To switch to a real backend, you delete one option at the call site.
- **(c)** MSW (Mock Service Worker). This is the industry standard, but it adds a dependency, a generated service-worker file in `public/`, and startup wiring. That's over-engineering for one route.
- **(d)** A static `public/api/items.json` file that axios fetches over real HTTP. There are no mocks at all, but the URL (`/api/items.json`) won't match a real API later.

**Recommended:** (b). The mock is visible at the call site and marked with a comment, it exercises axios, and removing it is a one-line change.

**Answer:** Go with recommended.

---

## Q22 - What does the API layer look like?

My proposal:

```
src/
  api/
    client.ts        # the shared axios instance (baseURL from env)
    items.ts         # Item type + getItems() API Function (mocked)
  apiHooks/
    useItems.ts      # useQuery wrapper around getItems()
```

Sub-decisions:
- **Folder names:** `api/` + `apiHooks/`, or `api/` + `api/hooks/`?
- **Where does the `Item` type live?** Next to its API Function in `items.ts`, or in a separate `types/` folder?
- **Scope:** only the list (`GET /items`), or also a detail route (`GET /items/:id`) and a mutation?

**Recommended:** Two sibling folders, `api/` + `apiHooks/`, matching your wording. The type lives next to its API Function. List only, since you asked for one route. *(Overridden by the answer below and by Round 6.)*

**Answer:** Two sibling folders, `api/` + `apiHooks/`. Types go in a separate `src/interfaces/` folder. Mock all 5 basic CRUD routes but don't implement them; leave them to be expanded later. Use barrel imports wherever possible. Use comments in the code, concise and only where something needs explaining to a developer picking this up. → follow-ups in Round 6.

---

## Q23 - How is the API base URL configured?

The axios instance needs a base URL. Vite's convention is to commit a `.env` file with safe defaults and gitignore `.env.local`, which holds per-developer overrides.

**Recommended:** Commit `.env` with `VITE_API_BASE_URL=/api`, and have `client.ts` read `import.meta.env.VITE_API_BASE_URL`. Type it in `vite-env.d.ts`, and gitignore `.env*.local`. No dev proxy until a backend exists.

**Answer:** Go with recommended.

---

## Q24 - Should the mock simulate latency?

With no delay, the loading state flashes by too fast to see, and you can't tell whether it works.

**Recommended:** Yes, a fixed ~500 ms delay inside the mock adapter only.

**Answer:** Go with recommended.

---

## Q25 - Which type-aware ESLint preset?

- `recommendedTypeChecked`: catches floating promises, unsafe `any` flows and misused promises. Sensible.
- `strictTypeChecked`: much noisier, for example banning non-null assertions and flagging "unnecessary" conditions.
- Optionally add `stylisticTypeChecked`, which is opinionated: it enforces `interface` over `type` and prefers `??`.

**Recommended:** `recommendedTypeChecked` only, plus the stylistic rules we already agreed (double quotes, trailing commas, semicolons, 2-space indent, `prefer-destructuring`). This fits "not too strict, very sensible".

**Answer:** Go with recommended.

---

## Q26 - Include React Query Devtools?

`@tanstack/react-query-devtools` adds a floating panel that shows the query cache. It is removed from production builds automatically, and it's a dev-only helper, not a library you code against.

**Recommended:** Include it.

**Answer:** Include it.

---

## Q27 - Is testing explicitly out of scope?

Your intent says you don't want files that "force testing on you". So: no Vitest, no Testing Library, no `*.test.tsx` files, and no `test` script. The README can say where tests would go later.

**Recommended:** Out of scope. Nothing test-related ships.

**Answer:** Yes, out of scope.

## Q28 - Record the Dev VM decision as an ADR?

The Q12 decision is hard to undo once people build on it: code on the Host, shared into the VM, `node_modules` on the VM's own disk, and polling HMR. A future reader will also wonder why `node_modules` is mounted over and why HMR polls. And it was a real trade-off against keeping the code inside the VM. That meets the bar for an ADR: one short file at `docs/adr/0001-dev-vm-shared-folder.md`, listed in `FILES.md`, which also records the "revisit if refresh is slow" note.

**Recommended:** Yes, write it.

**Answer:** Yes, write it. → Written as `docs/adr/0001-dev-vm-working-copy-inside-vm.md`, recording the final decision (code inside the VM) rather than the original shared-folder plan.