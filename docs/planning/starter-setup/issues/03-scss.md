# 03: SCSS: global styles and SCSS modules

**What to build:** Developers can write SCSS immediately. `sass-embedded` is installed as a dev dependency. A styles folder holds `global.scss`, imported once at the entry point. The Home Page has its own SCSS module next to it, relying on Vite's built-in CSS Modules support, to show scoped styles working.

**Blocked by:** 01

**Status:** ready-for-agent

- [x] A rule in `global.scss` visibly applies across the app
- [x] A rule in the Home Page's SCSS module visibly applies to the Home Page only (scoped class name)
- [x] Editing either stylesheet updates the browser through HMR without a full reload
- [x] No extra CSS Modules package is installed

## Comments

**2026-09-27, implementation notes:**
- `sass-embedded` 1.105 is a dev dependency. The lockfile also lists `sass` 1.105, but only as an optional fallback for platforms without a native `sass-embedded` binary; it isn't installed here. pnpm printed a harmless "Failed to create bin ... sass" warning because of this.
- `src/styles/global.scss` (box-sizing reset, body margin, padding and font) is imported once in `main.tsx` with a side-effect import. `styles` has no barrel: it holds only a stylesheet, and there's nothing to re-export. The spec's barrel rule now names `styles` as an exception.
- `src/pages/Home/Home.module.scss` defines `.intro`, used by the Home Page's paragraph through `styles.intro`. The `vite/client` types already declare `*.module.scss`, so no extra declaration file was needed.
- Verified from the command line: `pnpm lint` and `pnpm build` pass. The built CSS contains the global rules and the scoped `._intro_88cph_1` class. During dev, a WebSocket HMR client got `update` messages (not `full-reload`) when either stylesheet was edited: the module update is accepted by `Home.tsx` through React Refresh, and `global.scss` accepts itself.
- Once during dev, Sass failed with `spawn ENOMEM` while compiling. The Host was nearly out of RAM (about 2 GB free, on WSL1). Later runs with the same config compiled every time. See the follow-up comment below.
- **Not verified:** the styles as they actually look in a browser, and HMR as seen in a real browser. Those boxes stay unticked for a human to check. A dev server started before `sass-embedded` was installed has to be restarted first.

**2026-09-27, review fixes:** the spec's barrel rule now names `styles` as an exception. The comment in `global.scss` no longer names the file that imports it, and the comment in `Home.module.scss` was removed, because the `.module.scss` name already says the styles are scoped. The lockfile was checked: `sass` is only a dependency of `sass-embedded-all-unknown` and `sass-embedded-unknown-all`, which install only on unsupported CPUs and OSes. Vite lists it as an optional peer, so it isn't installed on any supported platform. The `$font-stack` variable stays, because it shows Sass syntax compiling.

**2026-09-27, blank page and the `sass-embedded` decision:**
- After this commit, the user got a blank page ("waiting for localhost"). Their dev server had been running since before `sass-embedded` was installed. Dependencies were installed and `main.tsx` was edited while it ran, and test servers rebuilt the shared `node_modules/.vite` cache underneath it. The server ended up as a WSL1 zombie process, with a defunct `dart:sass` child, that still held port 5173 and never answered. `wsl --shutdown` cleared it, and the page now serves normally.
- The `spawn ENOMEM` above happened in a freshly started server, so concurrent changes don't explain it. It's a real, intermittent `sass-embedded` failure under low memory on WSL1.
- **Decision (user):** keep `sass-embedded` as the spec says. If `spawn ENOMEM` or a hung SCSS compile comes back in normal use, revisit switching to `sass`, the pure-JavaScript compiler that runs inside Vite's own process. It avoids the separate Sass program but compiles more slowly on large projects.
- **Process:** stop the dev server before installing or removing dependencies.

**2026-09-27, human verification:** the user confirmed the remaining checks in a real browser at `localhost:9000`. Global styles apply on both the Home and NotFound Pages. The Home Page's `.intro` style is scoped: the generated class name appears only on the Home Page. Edits to either stylesheet update through HMR without a full reload. Every box on this ticket is now ticked.

**2026-09-28, one slow build:** a single `pnpm build` in WSL1 took 8.3 s, and Vite's timing report put 7.6 s of it in the SCSS step (`vite:css transform`). Normal builds take about 1.2 s. It succeeded, and three builds straight afterwards took 1.21 to 1.24 s, with about 7.5 GB of memory free. Like the `spawn ENOMEM` above, it points to a slow `sass-embedded` start while memory is short, not to anything in the project. If slow SCSS builds become routine, revisit switching to `sass`.
