# 04: Item data path: Home lists Items through the API layer

**What to build:** The Home Page lists Items fetched through the full data access path: API Hook → API Function → shared axios instance → mock adapter. Build:
- The Item interface (`id`, `name`, `description`, all strings) in the interfaces area, with a create input derived as Item without `id` and an update input as a partial of that, all in the same file, exported through the interfaces barrel.
- A shared axios instance whose base URL comes from a typed environment variable set in a committed `.env` (default `/api`).
- A mock adapter helper that returns a well-formed axios response after about 500 ms.
- Five Item API Functions (list, get by id, create, update, delete) in one module. Each passes the mock adapter per request, marked with a comment; the Item mock data sits at the top of the module under a removal comment. Mocks store nothing: create echoes input with a new id, update echoes merged data, delete returns nothing.
- Five Item API Hooks in one module (list and by-id queries; create, update and delete mutations). Each mutation refreshes the Item list on success.
- The React Query client in its own module, the provider in the app shell, and React Query Devtools mounted for development only.
- The Home Page uses the list API Hook and shows a plain loading line, a plain error line, or the Items.
Barrels for the api and apiHooks areas; named exports only. Runtime dependencies added: TanStack React Query and axios; Devtools as a dev-only helper.

**Blocked by:** 01

**Status:** ready-for-agent

- [x] Loading the Home Page shows a loading line for about half a second, then the mock Items
- [x] React Query Devtools show the Item list query in development and are absent from a production build
- [x] All five Item API Functions and all five Item API Hooks exist, are typed, and are exported through their barrels
- [x] Calling the create, update or delete hook triggers a refetch of the Item list
- [x] The API base URL is read from the typed environment variable; `.env` is committed with `/api`
- [x] Removing the mock adapter option from an API Function is the only change needed for it to hit a real backend

## Comments

**2026-09-27, implementation notes:**
- New runtime dependencies are `@tanstack/react-query` 5.104 and `axios` 1.20. `@tanstack/react-query-devtools` 5.104 is a dev dependency. The dev server was stopped before installing.
- **Files:**
  - `src/interfaces/Item.ts`: `Item`, `CreateItemInput` (`Omit<Item, "id">`), `UpdateItemInput` (`Partial<CreateItemInput>`).
  - `src/api/apiClient.ts`: the shared axios instance.
  - `src/api/mockAdapter.ts`: the mock adapter helper.
  - `src/api/items.ts`: the API Functions `getItems`, `getItem`, `createItem`, `updateItem`, `deleteItem`.
  - `src/apiHooks/items.ts`: the API Hooks `useItems`, `useItem`, `useCreateItem`, `useUpdateItem`, `useDeleteItem`.
  - `src/queryClient.ts`, and `src/vite-env.d.ts` for env typing.
  - Barrels in `interfaces`, `api` and `apiHooks`.
- **Env:** `.env` sets `VITE_API_BASE_URL=/api`. `vite-env.d.ts` declares it and turns on Vite's `strictImportMetaEnv`, so a misspelled variable name is a type error. Verified with a throwaway file.
- **Mock:** `mockAdapter(data)` resolves with a 200 response after 500 ms. The mock block at the top of `items.ts` holds the data and a `findMockItem` helper, which returns the matching mock Item or a fixed one carrying the requested id. Get and update use it; update echoes it merged with the input. Each API Function's only mock code is its `adapter: … // MOCK` line.
- **Hooks:** the by-id query key is `["items", id]`, under the list key `["items"]`. Each mutation calls `useQueryClient()` and invalidates `["items"]` in `onSuccess`, so the list refetches, along with any cached single Items.
- **Devtools:** `<ReactQueryDevtools />` is mounted inside `QueryClientProvider` in `main.tsx`. The package's default entry renders nothing outside development.
- **Verified from the command line:**
  - All five API Functions, called through Vite's SSR loader, go through axios with base URL `/api`, take about 500 ms and return the expected data.
  - Removing any one `adapter` option leaves typecheck and lint clean.
  - The production bundle contains no Devtools code (no `tsqd` marker, which the dev bundle does contain).
  - `pnpm lint` and `pnpm build` pass.
  - `pnpm dev` starts on 9000 and serves every module.
- **Not verified:** the loading line and Item list as they appear in a browser, the Devtools panel in the browser, and a mutation triggering a list refetch (no Page calls a mutation yet). Those boxes are left for a human to check.

**2026-09-27, review fixes:**
- The mock no longer simulates errors. The first version gave `mockAdapter` a status parameter and returned a 404 for unknown ids. The spec asks for fixed responses, and that version also 404'd when updating an Item just returned by `createItem`. Every mock now answers 200. Delete answers 200 with no body.
- The mutations no longer pass a shared hook result as `onSuccess` (`onSuccess: useRefreshItems()`). Each one calls `useQueryClient()` and invalidates the list inline, the conventional pattern the template should teach.
- The comment in `queryClient.ts` was trimmed.
- **Left as is:**
  - Invalidating `["items"]` also refreshes cached single Items. That's useful after an update.
  - The "only change needed" box holds for each API Function on its own. Once the last `adapter` option in `items.ts` is gone, `mockItems`, `findMockItem` and the `mockAdapter` import become unused, and `noUnusedLocals` makes that a type error that fails `pnpm build`. The removal comment says to delete them at that point.
  - `id: string` isn't wrapped in its own type.

**2026-09-27, re-review fix:** the removal comment in `items.ts` said "delete this block", which didn't clearly cover `findMockItem` (it sits after a blank line), and it didn't mention the `mockAdapter` import. Following it exactly could leave unused code, which `noUnusedLocals` turns into a type error that fails `pnpm build`. The comment now names everything in `items.ts` to delete: `mockItems`, `findMockItem`, the import and every `adapter` option. `mockAdapter.ts` is shared by every resource's API Functions, so the instruction to delete it lives in that file ("once no API Function uses it"), not in the Item module. Verified by following the `items.ts` comment literally on a copy, and then deleting `mockAdapter.ts`: typecheck, lint and build pass after each step.

**2026-09-27, human verification:** the user confirmed the remaining checks in a real browser at `localhost:9000`:
- The Home Page shows the loading line for about half a second, then the mock Items.
- React Query Devtools show the `["items"]` query in development.
- With a throwaway Create button calling `useCreateItem`, a successful create sets the `["items"]` query to fetching and it refetches. The button was reverted afterwards.

Update and delete use the same invalidation code as create; only create was clicked. Devtools being absent from production was verified earlier from the command line. Every box on this ticket is now ticked.

**2026-09-27, no generic on `mockAdapter`:** at the user's request, `mockAdapter` takes `data: unknown` instead of a generic `<T>(data: T)`. The generic did nothing: axios's `AxiosAdapter` returns `AxiosPromise`, whose data type defaults to `any`, so `T` was erased, and no call site passed it explicitly. Response types come from the type argument on each axios call, such as `apiClient.get<Item[]>(…)`. Of the mock values, only `mockItems` is annotated (`Item[]`); `findMockItem`'s result, the create echo and the update merge are inferred. The spec now records the convention: no generics without an actual reason.
