# Round 6: API layer, barrels and exports

Settled in Round 3: Home uses `useItems` (no `useGreeting`) · mocks go through an axios per-request `adapter` · `api/` + `apiHooks/` + `interfaces/` · `.env` has `VITE_API_BASE_URL=/api` · ~500 ms mock delay · `recommendedTypeChecked` · React Query Devtools included · no testing setup · barrel imports wherever possible · short comments only where they help.

New term in `CONTEXT.md`: **Item** (the sample resource, meant to be renamed or replaced).

Still open: **Q30** (`round_4_questions.md`) and **Q33–Q37** (`round_5_questions.md`).

---

## Q38 - What do the 5 CRUD routes return, and which get API Hooks?

"Mock them but don't implement them" can mean two things:

- **(a)** All 5 API Functions exist: `getItems`, `getItem(id)`, `createItem(data)`, `updateItem(id, data)` and `deleteItem(id)`. Each one returns a fixed mock response without storing anything: create echoes back the input with a new id, update echoes back the merged data, and delete returns nothing. So calling `createItem` doesn't make `getItems` return one more Item.
- **(b)** Only `getItems` returns mock data. The other four are real axios calls with no mock, so they fail until a backend exists.

And which API Hooks ship:

- **(c)** All 5: `useItems`, `useItem`, `useCreateItem`, `useUpdateItem` and `useDeleteItem`. The three mutation hooks refresh the Items list after they succeed (one line each). That's the pattern people usually get wrong, so it's worth showing once.
- **(d)** Only `useItems`, and the others get added when they're needed.

**Recommended:** (a) + (c). Everything can be called and has the right types, only `useItems` is used on a Page, and nothing pretends to store data.

**Answer:**
Go with recommended
---

## Q39 - How are the files grouped?

- **By resource:** `api/items.ts` holds the 5 API Functions, and `apiHooks/items.ts` holds the 5 API Hooks.
- **One file per function or hook:** `api/getItems.ts`, `apiHooks/useItems.ts` and so on, which is 10 files for one resource.

Also, the Item mock data and the mock `adapter` helper:

- The helper goes in `api/mockAdapter.ts` (a small function that returns a fake axios response after the delay) and is reused by all 5.
- The mock data sits at the top of `api/items.ts` under a `// Mock data - remove when the real API exists` comment.

**Recommended:** Group by resource, and put the helper and mock data where described above. When the real backend arrives, you delete `mockAdapter.ts`, the mock data block and the `adapter` options.

**Answer:**
Go with recommended
---

## Q40 - Named exports or default exports?

Barrels (`export * from "./Home/Home"`) only work cleanly with **named** exports. With default exports, every barrel line becomes `export { default as Home } from ...`, and different files can end up importing the same thing under different names.

**Recommended:** Named exports everywhere (`export function Home()`). The only exceptions are files whose tools require a default export: `vite.config.ts` and `eslint.config.js`. An ESLint rule enforces it, so the choice doesn't drift.

**Answer:**
Go with recommended
---

## Q41 - Where do barrels go?

- **(a)** One `index.ts` per top-level folder: `pages/`, `components/`, `api/`, `apiHooks/` and `interfaces/`. You then import `import { Home, NotFound } from "@/pages"`, and component folders (`pages/Home/`) have no `index.ts` of their own.
- **(b)** Also an `index.ts` in every component folder. That doubles the number of barrels for little gain.

Two more details:

- **`components/` starts empty.** Should it hold `.gitkeep` (no barrel yet), or an empty `index.ts` barrel that's ready for the first component? An empty barrel counts as a "hanging file" by your rule unless it has a one-line comment.
- **Barrels vs. lazy-loaded routes:** barrels make it harder to load Pages on demand later. That doesn't matter at this size, and the README will mention it.

**Recommended:** (a). `components/` holds `.gitkeep` and gets its `index.ts` when the first Shared Component is added. Your rule was ".gitkeep placeholders are fine", and it's the more honest option.

**Answer:**
Go with recommended
---

## Q42 - Interfaces: one file per type, and what does an Item look like?

- Is it `interfaces/Item.ts` + `interfaces/index.ts` (one file per type), or a single `interfaces/index.ts` holding all types?
- For create and update inputs, derive them from `Item` (`Omit<Item, "id">`, `Partial<...>`) or write separate interfaces?
- What fields does an Item have?

**Recommended:** One file per type plus the barrel. Inputs are derived types that sit next to `Item` in the same file (`ItemInput = Omit<Item, "id">`). Fields: `id: string`, `name: string`, `description: string`. That's the minimum that shows the pattern.

**Answer:**
Go with recommended
---

## Q43 - How does `pnpm dev` behave on the Host vs. in the Dev VM?

Following Q30: running without Vagrant is a first-class path. The README has two equal setups, **"Run on your machine"** (`pnpm install && pnpm dev`) and **"Run in the Dev VM"** (`vagrant up` → Remote-SSH → `pnpm dev`). Nothing in the repo requires Vagrant.

There is one difference between the two. Inside the VM, Vite has to listen on all network interfaces (`0.0.0.0`) so that Vagrant's port forward can reach it from the Host. On the Host, doing the same exposes your dev server to your local network, including café Wi-Fi, and Vite's dev server has had file-disclosure security bugs in the past. Options:

- **(a)** Always listen on `0.0.0.0` (`server.host: true`). It's the simplest, but it exposes the Host-native dev server to the local network.
- **(b)** The VM's provisioning sets an environment variable (e.g. `VITE_DEV_HOST=0.0.0.0`) in the VM user's shell profile, and `vite.config.ts` uses it, falling back to `localhost`. The command is the same everywhere and the Host stays private. It's one line in each file, plus a comment.
- **(c)** Add a separate `pnpm dev:vm` script that runs `vite --host`. That makes two commands to remember.

**Recommended:** (b).

**Answer:**
B unless issus are discovered later