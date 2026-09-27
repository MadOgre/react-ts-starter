# 02: Linting and type checks in the editor, during serve and on the command line

**What to build:** ESLint and TypeScript catch problems everywhere a developer works: in VS Code as they type (with fix-on-save), in the browser overlay while `pnpm dev` runs, and from the command line. ESLint uses flat config with typescript-eslint's recommended type-checked preset (no strict or stylistic-type-checked presets), the React Hooks and React Refresh plugins, and `@stylistic` rules for double quotes, multiline trailing commas, semicolons and 2-space indentation. It also enables `prefer-destructuring` and bans default exports everywhere except tool config files. There is no Prettier. A Vite checker plugin shows lint and type errors in the overlay. Committed VS Code workspace settings enable ESLint fix-on-save and recommend the ESLint and Remote-SSH extensions. The build script type-checks before bundling.

**Blocked by:** 01

**Status:** ready-for-agent

- [x] `pnpm lint` and `pnpm build` finish with no errors on the codebase
- [x] A single-quoted string, a missing multiline trailing comma and a default export are each reported by `pnpm lint`, in the VS Code editor and in the browser overlay during `pnpm dev`
- [x] A TypeScript type error appears in the browser overlay during `pnpm dev` and fails `pnpm build`
- [x] Saving a file in VS Code auto-fixes stylistic issues
- [x] Default exports are allowed only in tool config files
- [x] Scripts available: `dev`, `build`, `lint`, `preview`; no test script

## Comments

**2026-09-27, implementation notes:**
- Versions: ESLint 10.11, typescript-eslint 8.70 (supports TypeScript up to 6.1), react-hooks 7.1, react-refresh 0.5, `@stylistic` 5.10, vite-plugin-checker 0.14.5.
- JS files (only `eslint.config.js`) use typescript-eslint's `disableTypeChecked`, because they're in no tsconfig. Default exports are allowed only in `*.config.{js,ts}`.
- `prefer-destructuring` is on for objects only; array destructuring (`const [first] = list`) isn't forced.
- The checker runs only during `pnpm dev` (`enableBuild: false`), because `pnpm build` already type-checks and `pnpm lint` is separate.
- VS Code workspace settings turn off format-on-save (ESLint is the formatter), fix ESLint problems on save, and use the workspace TypeScript version.
- Verified from the command line with a throwaway file: `pnpm lint` reports a single-quoted string, a missing multiline trailing comma, a default export and non-destructured object access. A type error fails `pnpm build`. During `pnpm dev`, the checker reports all of them and injects its overlay runtime into the browser page.
- **Not verified:** the VS Code editor squiggles and fix-on-save, and the overlay as it actually appears in a browser. There's no editor or browser here, so those boxes stay unticked for a human to check.

**2026-09-27, review fixes and arrow functions:**
- Comments reworded: tool config files *may* use default exports, and named exports give barrels a single name for each export.
- Tool config files (`**/*.config.{js,mjs,cjs,ts}`) get Node globals instead of browser globals. The JS-only override also covers `.mjs` and `.cjs`.
- The overlay box is unticked: only the build half was verified.
- **Arrow functions wherever possible**, at the user's request: `func-style: expression`, `prefer-arrow-callback` and `arrow-body-style: as-needed`. The Home and NotFound Pages were converted to `export const X = () => (...)`. `prefer-destructuring` stays objects-only.

**2026-09-27, component typing convention:** at the user's request, components are typed with `FC` (no props) or `FC<ComponentNameProps>`, with props interfaces named `<ComponentName>Props`. Generic components are the exception. This is checked at code review, not by lint. Home and NotFound were converted.

**2026-09-27, editor indentation:** at the user's request, the VS Code workspace settings set 2-space indentation with spaces (`editor.tabSize: 2`, `editor.insertSpaces: true`). They also turn off `editor.detectIndentation`, so VS Code doesn't switch a file to tabs or 4 spaces based on its existing content. This matches the `@stylistic/indent` rule.

**2026-09-27, human verification:** the user confirmed the remaining checks in VS Code and a real browser: lint errors show in the editor and the browser overlay, fix-on-save works, and a type error appears in the overlay. Every box on this ticket is now ticked.

**2026-09-27, after the initial commit:** VS Code flagged two workspace settings as deprecated. They are renamed to their replacements, as VS Code's `typescript-language-features` source declares them: `typescript.tsdk` becomes `js/ts.tsdk.path`, and `typescript.enablePromptUseWorkspaceTsdk` becomes `js/ts.tsdk.promptToUseWorkspaceVersion`. The behaviour is unchanged: VS Code offers the project's own TypeScript version.
