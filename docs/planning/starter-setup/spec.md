Status: ready-for-agent

# Spec: react-ts-starter

## Problem Statement

I want to start new full-stack web apps quickly, without rebuilding the same React + TypeScript foundation every time. Setting one up by hand means choosing and wiring a bundler, a router, data fetching, styling, linting and editor integration, and each new project drifts a little from the last. My collaborators use Windows, macOS and Linux. Native binaries differ between operating systems, and WSL on Windows is unreliable, so "it works on my machine" problems are likely. Scaffold tools also leave behind demo files and unexplained leftovers that someone has to clean up before real work starts.

I need a clean, well-documented starting point that anyone can clone and run straight away, on their own machine or in an identical VM, and that works both as a reusable template and as the first commit of a real app.

## Solution

A template repository called **react-ts-starter**. It's a Vite-based React + TypeScript app with React Router, React Query and axios already wired up. It has a clear source layout (Pages, Shared Components, API Functions, API Hooks, interfaces) and a small working example built around a sample resource called **Item**.

There are two supported ways to run it, and both use the same `pnpm dev` command:

- **On the Host:** install the dependencies and run the dev server directly.
- **In the Dev VM:** `vagrant up` provisions an identical Linux environment on any Host. The Working Copy lives inside the Dev VM, you edit it through VS Code Remote-SSH, and the app is served to the Host's browser.

ESLint (type-aware, with stylistic rules) and TypeScript check the code in the editor and during serve. SCSS and SCSS modules work out of the box. Every committed file is explained in `FILES.md`, and there are no unexplained leftovers. The repo is a single `master` branch with one commit, ready to push to GitHub and build on.

## User Stories

### Getting started

1. As a developer, I want to clone the repo and have a working app with one install and one serve command, so that I can start building features right away.
2. As a developer, I want a README that explains both ways to run the project, so that I can choose the one that suits my machine.
3. As a developer, I want to run the app directly on my Host with `pnpm install` and `pnpm dev`, so that I can skip Vagrant when I don't need it.
4. As a developer, I want `pnpm dev` to be the only serve command, on the Host and in the Dev VM alike, so that there's nothing extra to remember.
5. As a developer, I want the Node version pinned in the project, so that my version manager and the Dev VM use the same Node 22 LTS.
6. As a developer, I want the pnpm version pinned in the project, so that everyone installs dependencies with the same package manager version.
7. As a developer, I want pnpm to be the default package manager, so that installs are fast and consistent.
8. As a developer, I want line endings in the repo normalised to LF, so that Windows checkouts don't produce noisy diffs or broken scripts.
9. As a developer, I want a sensible `.gitignore` for Node, Vite, editor and OS files, so that build output and local files never get committed.

### Dev VM

10. As a developer on any Host OS, I want `vagrant up` to provision a ready-to-use Linux Dev VM, so that my environment matches everyone else's.
11. As a developer on Windows, I want the Dev VM to run without WSL, so that I avoid WSL's reliability problems.
12. As a developer on an Apple Silicon Mac, I want the same Vagrantfile to pick an ARM box automatically, so that I'm not left out.
13. As a developer, I want the README to list the minimum Vagrant and VirtualBox versions, and to say that Apple Silicon is untested, so that I know what to expect before I start.
14. As a developer, I want the first `vagrant up` to copy my Host checkout into the Dev VM as my Working Copy, so that I don't need GitHub credentials during setup.
15. As a developer, I want any Host `node_modules` or build output that got copied in to be discarded and reinstalled inside the Dev VM, so that only Linux binaries are used there.
16. As a developer, I want provisioning to install only what the project needs (git, curl, Node 22, pnpm), so that `vagrant up` stays quick.
17. As a developer, I want the README to explain how to upgrade the VM's OS packages manually, so that I can patch it when I choose to.
18. As a developer, I want the Dev VM's CPU and memory set in one obvious place with a comment, so that I can adjust them for my machine.
19. As a developer, I want the Dev VM to have a readable name, so that my SSH and VS Code host entries are easy to recognise.
20. As a developer, I want the README to show how to add the Dev VM to my SSH config, so that VS Code Remote-SSH can connect to it.
21. As a developer, I want to open the Working Copy in VS Code through Remote-SSH, so that the editor, ESLint and TypeScript run in the same environment as the app.
22. As a developer, I want the dev server port forwarded from the Dev VM to my Host, so that I can open the app in my Host browser.
23. As a developer, I want the dev server reachable from outside the Dev VM only when it's running inside the Dev VM, so that on my Host it stays private to my machine.
24. As a developer, I want my Host git config copied into the Dev VM, so that my commits there carry my name and email.
25. As a developer, I want SSH agent forwarding enabled, so that I can push from the Dev VM with my Host's GitHub key without copying the key into the VM.
26. As a developer, I want the README to state plainly that the Working Copy lives inside the Dev VM and that `vagrant destroy` deletes unpushed work, so that I push often.
27. As a developer, I want HMR inside the Dev VM to be as fast as native, so that the VM workflow isn't a compromise.

### App shell and routing

28. As a developer, I want a basic Home Page served at the root URL, so that I can see the app working immediately.
29. As a developer, I want a NotFound Page for unknown URLs, so that routing is shown working end to end.
30. As a developer, I want routes declared in one routes module using React Router's data mode, so that I have one place to add Pages and can use loaders later.
31. As a developer, I want every Page in its own folder under the pages area, so that each Page keeps its component and styles together.
32. As a developer, I want a components area reserved for Shared Components, so that I know where reusable parts go.
33. As a developer, I want the empty components area kept in git with a placeholder file, so that the structure is there from the first commit.

### Data access

34. As a developer, I want one shared axios instance configured from an environment variable, so that every API Function uses the same base URL.
35. As a developer, I want the API base URL set in a committed `.env` with a safe default, plus gitignored local override files, so that I can point at a different backend without changing code.
36. As a developer, I want the environment variable typed, so that TypeScript catches typos when I use it.
37. As a developer, I want the five CRUD API Functions for Item (list, get one, create, update, delete), so that the API layer shows every basic operation.
38. As a developer, I want each Item API Function mocked through axios with a per-request adapter, so that the real axios path runs while no backend exists.
39. As a developer, I want the mock visibly marked where it's used, so that I know exactly what to delete when a real backend arrives.
40. As a developer, I want the mocks to return fixed responses without storing anything, so that nobody mistakes them for a working backend.
41. As a developer, I want the mock to add a short, fixed delay, so that I can see loading states work.
42. As a developer, I want the five Item API Hooks built on React Query, so that components never call API Functions directly.
43. As a developer, I want the create, update and delete API Hooks to refresh the Item list after they succeed, so that the correct refresh pattern is already in place.
44. As a developer, I want the Home Page to list Items through the list API Hook, with a plain loading line and a plain error line, so that React Query, axios and the API layer are shown working together.
45. As a developer, I want the React Query client defined in its own module, so that its defaults are easy to find and change.
46. As a developer, I want React Query Devtools available during development and left out of production builds, so that I can inspect the query cache.

### Types, imports and exports

47. As a developer, I want shared types in a dedicated interfaces area, one file per type, so that types are easy to find.
48. As a developer, I want Item's create and update input types derived from the Item type, so that they can't drift apart.
49. As a developer, I want a barrel file in each top-level source folder, so that imports are short and consistent.
50. As a developer, I want named exports everywhere except where a tool requires a default export, so that barrels work and each thing has one name.
51. As a developer, I want an `@/` import alias for the source root, so that I don't write long relative paths.

### Styling

52. As a developer, I want SCSS working with no extra setup, so that I can write styles right away.
53. As a developer, I want a styles folder containing `global.scss`, loaded once at startup, so that global styles have one home.
54. As a developer, I want SCSS modules working next to the components that use them, so that styles are scoped per component.

### Linting, type checking and formatting

55. As a developer, I want ESLint with a sensible, not-too-strict ruleset, so that common mistakes are caught without constant friction.
56. As a developer, I want type-aware lint rules, so that problems like unhandled promises are caught.
57. As a developer, I want double quotes enforced by ESLint, so that quote style is always consistent.
58. As a developer, I want trailing commas, semicolons and 2-space indentation enforced, so that formatting is consistent without a separate formatter.
59. As a developer, I want destructuring encouraged by a lint rule, so that code stays concise.
59a. As a developer, I want arrow functions used wherever possible and enforced by lint, so that function style is consistent across the codebase.
59b. As a developer, I want every component typed with `FC` or `FC<ComponentNameProps>`, so that component contracts are explicit and consistent.
60. As a developer, I want the React hooks rules and the Fast Refresh rules enabled, so that hook bugs and HMR-breaking exports are flagged.
61. As a developer, I want default exports rejected by lint (except in tool config files), so that the named-export convention holds.
62. As a developer, I want ESLint and TypeScript errors shown in my editor, so that I catch problems as I type.
63. As a developer, I want ESLint to fix problems on save in VS Code, so that formatting takes no effort.
64. As a developer, I want VS Code to recommend the right extensions, so that editor integration works the first time.
65. As a developer, I want ESLint and TypeScript errors shown in the browser overlay during `pnpm dev`, so that nothing slips through while I'm serving.
66. As a developer, I want a lint script and a build script that also type-checks, so that I can check the whole project from the command line.

### Hot reload

67. As a developer, I want HMR to apply my edits instantly without a full reload, so that my feedback loop stays fast.

### Documentation and hygiene

68. As a developer, I want `FILES.md` to list and explain every committed file (dotfiles included; `.git`, `node_modules` and build output excluded), so that nothing in the repo is a mystery.
69. As a developer, I want Vite's scaffold demo files removed, keeping only a small favicon, so that there's no leftover sample code.
70. As a developer, I want no test runner or test files shipped, so that the template doesn't impose a testing setup I didn't choose.
71. As a developer, I want short comments only where the code needs explaining, so that the code stays readable without clutter.
72. As a developer, I want the README to say where a future backend would go, so that the structure has room to grow without an empty placeholder folder.
73. As a developer, I want the glossary (`CONTEXT.md`) committed, with a README note that it can be deleted to start fresh, so that the project's terms are clear but optional.
74. As a developer, I want the Dev VM architecture decision recorded as an ADR, so that nobody "fixes" the Working Copy location without knowing why it was chosen.
75. As a developer, I want the planning history (intent, grilling rounds, this spec) committed under the planning docs, so that the reasoning behind the template is preserved.
76. As a developer, I want the agent-skills configuration committed, so that AI-assisted workflows know where issues, specs and domain docs live.

### Repository and template use

77. As a developer, I want the project to be a git repo with a single `master` branch and one initial commit, so that it's ready to push and build on.
78. As a developer, I want the README to include the commands for pushing to a new GitHub repo, so that publishing it is quick.
79. As a template user, I want the README to explain how to clone the repo and start a new app from it (including renaming), so that each new app starts cleanly.
80. As a template user, I want the Item resource to be clearly marked as a sample, so that I know to rename or replace it.
81. As a template user, I want only the runtime libraries I asked for (React, React Router, React Query, axios) plus the tooling they need, so that nothing unexpected ships in my app.

## Implementation Decisions

### Environments

- There are two first-class ways to run the project: Host-native, and the Dev VM. Nothing in the repo requires Vagrant.
- **Dev VM:** Vagrant with the VirtualBox provider, using the Ubuntu 24.04 box from the bento project with automatic architecture selection (Intel or ARM builds). Minimum versions: Vagrant 2.4 or newer everywhere, and VirtualBox 7.1 or newer on Apple Silicon Macs (7.2 recommended). Resources: 2 CPUs and 4 GB RAM by default, set at the top of the Vagrantfile. The VM has a readable name matching the project.
- **Working Copy location (see ADR 0001):** the default two-way shared folder is disabled. On first provision only, the Host checkout, including git metadata, is copied into the VM user's home folder, and only if that folder doesn't already exist. Any copied `node_modules` and build output are deleted, then dependencies are installed inside the VM. After that, the copy in the VM is the Working Copy; the Host checkout only launches the VM.
- **Provisioning** installs git, curl, Node 22 (from NodeSource) and pnpm (through corepack, at the version pinned in the package manifest). It skips the full OS upgrade. It copies the Host's git config if one exists. It sets a shell environment variable that makes Vite listen on all network interfaces.
- **SSH agent forwarding is enabled** so git can push from the VM. The dev server port (9000) is forwarded to the Host. VS Code connects through Remote-SSH using the entry from Vagrant's SSH config, which the README documents.
- **Dev server port** is fixed at 9000, chosen because it's easy to remember, with `strictPort` so Vite fails instead of silently moving to another port.
- **Vite server host** comes from that environment variable. When it isn't set (on the Host), Vite stays on localhost. File watching is native in both environments: no polling.
- **Pinning:** Node 22 LTS in the version-manager file and the package manifest's engines field. pnpm is set in the package manifest's `packageManager` field. Git attributes normalise text files to LF.

### Application structure

- **Scaffold:** Vite's React + TypeScript template, with every demo file (sample component, sample CSS, logo assets and the template README) removed. One small favicon is kept.
- **Runtime dependencies:** React, React DOM, React Router, TanStack React Query and axios. **Dev dependencies:** the TypeScript and ESLint toolchain, `sass-embedded`, a Vite checker plugin for lint and type errors during serve, and React Query Devtools.
- **Top-level source areas:**
  - Entry point, routes module and React Query client module.
  - `pages`: one folder per Page.
  - `components`: Shared Components; starts empty with a `.gitkeep`.
  - `api`: the shared axios instance, the mock adapter helper and the Item API Functions.
  - `apiHooks`: the Item API Hooks.
  - `interfaces`: shared types.
  - `styles`: `global.scss`.
- **Barrels:** each top-level area has an index barrel, except `components`, which gets one when its first Shared Component is added, and `styles`, which holds only stylesheets and has nothing to re-export. Page and component folders don't get their own barrels. Barrels make it harder to lazy-load routes later; the README mentions this.
- **Named exports only.** Default exports are allowed only in tool config files, and lint enforces this.
- **Components are typed with `FC`.** Use `FC` for components without props and `FC<ComponentNameProps>` for components with props. Props interfaces are named `<ComponentName>Props`, never a bare `Props`, because barrels re-export with `export *` and bare names would collide. Import `FC` as a type-only import. The one exception is generic components, which annotate their props parameter instead. This is a code-review convention, not a lint rule.
- **No generics without a reason.** Add a generic type parameter only when it actually links or constrains types that callers rely on. If a type would be erased downstream, or only inferred from the argument and never checked, use `unknown` or a concrete type instead. This is a code-review convention, not a lint rule.
- **Path alias:** `@/` maps to the source root and is configured for both Vite and TypeScript.
- **Routing:** React Router in data mode. The router has Home at the root and a NotFound catch-all.
- **Item interface:** `id`, `name` and `description`, all strings. The create input is Item without `id`; the update input is a partial of the create input. Both are derived in the same file as Item.
- **API Functions:** one Item module with five functions: list, get by id, create, update, delete. Each uses the shared axios instance and passes a per-request mock adapter, marked with a comment. The mock adapter helper returns a fixed, well-formed axios response after about 500 ms. The Item mock data sits at the top of the Item module under a removal comment. Mocks don't store anything: create echoes its input with a new id, update echoes the merged data, delete returns nothing.
- **API Hooks:** one Item module with five hooks: two queries (list, and one by id) and three mutations. Each mutation refreshes the Item list after it succeeds. Only the list hook is used by a Page, the Home Page.
- **Environment config:** the committed `.env` sets the API base URL to `/api`, the variable is typed, and local env override files are gitignored. No dev proxy until a backend exists.
- **React Query Devtools** are mounted in the app shell and are left out of production builds automatically.

### Styling

- SCSS is compiled by `sass-embedded`. `global.scss` is imported once at the entry point. SCSS modules sit next to their component and rely on Vite's built-in CSS Modules support.

### Linting and editor

- ESLint uses flat config and typescript-eslint's **recommended type-checked** preset, with no strict or stylistic-type-checked presets. It adds the React Hooks and React Refresh plugins and `@stylistic` for double quotes, trailing commas (multiline), semicolons and 2-space indentation. It enables `prefer-destructuring` (objects only), requires arrow functions wherever possible (`func-style: expression`, `prefer-arrow-callback`, `arrow-body-style: as-needed`), and bans default exports, except in config files. There is no Prettier.
- The Vite checker plugin runs ESLint and TypeScript during `pnpm dev` and shows errors in the browser overlay.
- The committed VS Code workspace settings turn on ESLint fix-on-save. The recommended extensions are ESLint and Remote-SSH.
- **Scripts:** `dev`, `build` (type-check, then bundle), `lint` and `preview`. No test script and no wrapper shell scripts.

### Documentation and repository

- **README** covers:
  - what the project is and how to use it as a template, including renaming
  - both ways to run it
  - Dev VM prerequisites and minimum versions
  - the Apple Silicon "untested" note
  - the Remote-SSH setup
  - the Working Copy warning about `vagrant destroy`
  - the manual OS upgrade command
  - pushing to GitHub
  - where a future backend would go
  - the barrels vs. lazy-loading note
  - a note that `CONTEXT.md` can be deleted
- **`FILES.md`** documents every committed file except `.git`, `node_modules` and build output. That includes dotfiles, VS Code settings, the glossary, the ADR, the agent-skills config and every planning file.
- **Also committed:** the glossary, ADR 0001, the agent-skills configuration (`CLAUDE.md` and the agent docs) and the planning folder for this feature (intent, the seven grilling rounds, this spec).
- **Git:** one branch named `master`, with one initial commit.

## Testing Decisions

- **No automated tests and no test tooling ship with the template.** This was an explicit requirement: no test runner, no test files, no test script.
- **Instead, the build is verified manually at three checkpoints, each checking only behaviour you can observe from outside:**
  1. **Host-native app.** After a fresh install and `pnpm dev`:
     - The Home Page shows a loading line, then the Item list.
     - An unknown URL shows the NotFound Page.
     - Editing a Page updates the browser through HMR without a full reload.
     - A deliberate lint or type error appears in the browser overlay.
     - SCSS global styles and a module style both apply.
  2. **Dev VM app.** After `vagrant up`, connect with Remote-SSH and run `pnpm dev` in the Working Copy. Then:
     - The checks from checkpoint 1 pass in the Host browser through the forwarded port.
     - A commit made in the VM carries the Host git identity.
     - The dev server on the Host isn't exposed to the network.
  3. **Command line.**
     - `pnpm lint` and `pnpm build` finish without errors.
     - `pnpm lint` flags a single-quoted string, a missing trailing comma and a default export.
     - `FILES.md` lists every committed file.
- **Prior art:** none; the repo has no code yet.

## Out of Scope

- A backend or server folder. The README only says where one would go.
- Real API integration, a dev proxy, or mocks that store data (for example MSW or in-memory CRUD).
- Automated testing of any kind, including test runners, Testing Library and end-to-end tools.
- Prettier or any formatter other than ESLint stylistic rules.
- The strict type-checked ESLint presets.
- Dev Containers or Docker.
- A two-way shared folder between the Host and the Dev VM, and polling-based file watching.
- Automatic dev server start on `vagrant up`, and wrapper serve scripts for each OS.
- Other Vagrant providers such as Parallels or VMware, and verifying the setup on real Apple Silicon hardware.
- Creating the GitHub remote or pushing to it, and marking the repo as a GitHub Template Repository.
- Deployment to AWS or anywhere else, and CI.
- Lazy-loaded routes and code splitting.
- A Layout or navigation Shared Component.

## Further Notes

- The Working Copy location was reconsidered during planning. Code on the Host shared into the VM was rejected because of HMR speed and complexity (pnpm symlinks, per-OS native binaries, polling, and unreliable shared folders on Apple Silicon). ADR 0001 records this. It should be revisited only if the Remote-SSH workflow proves painful.
- Apple Silicon support is based on vendor documentation (VirtualBox 7.1+ supports ARM Linux guests on Apple Silicon Macs, and the bento Ubuntu 24.04 box has both Intel and ARM builds), not on a test run. The newest box build is about 11 months old.
- The full decision trail is in the grilling rounds in this feature's planning folder. Superseded answers are marked inline.
- Use the glossary's terms throughout the code and docs: Host, Dev VM, Working Copy, Page, Shared Component, API Function, API Hook, Item.
