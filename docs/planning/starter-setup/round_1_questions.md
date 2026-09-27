# Round 1

Facts checked before this round: WSL1, with the project on `/mnt/c` · Node 22 / npm 10 / git installed · VirtualBox installed on Windows · Vagrant not found in WSL or on Windows · `gh` not installed.

---

## Q1 - What is the Vagrant VM for?

The intent says two things that pull against each other: "the VM is where the code serves and runs" and "HMR works seamlessly and fast". On a Windows host, VirtualBox shared folders don't pass file-change events into the VM. So a Vite dev server inside the VM has to fall back to polling, which is slower, uses more CPU and sometimes misses changes. The options:

- **(a)** The VM is the main dev runtime. You edit on Windows, Vite runs in the VM with polling, and the browser on Windows opens a forwarded port. It works, but HMR is noticeably slower.
- **(b)** Local `npm run dev` is the main dev loop, with native and fast HMR. The VM is an optional, reproducible Linux environment that looks like the future AWS box, for running the dev server or `vite build && vite preview`.
- **(c)** The code lives inside the VM (rsync or cloned into it) and you edit it through VS Code Remote-SSH. HMR is fast, but editing is less straightforward.

**Recommended:** (b). It meets "HMR fast" and still gives you the `vagrant up` story. The VM still runs the dev server (with polling) for anyone who wants it.

**Answer:** The Vagrant VM is for consistency. Some developers might pull this on a Mac, some on Windows, some on Linux, and I want a consistent development environment for all. Some libraries are compiled differently for each operating system, and I want to eliminate those inconsistencies. Also, WSL is fraught with problems, and I really would not like to serve inside it. So I want a Vagrantfile where you run `vagrant up` and then serve the application. I was picturing sharing a code folder you can designate: the code stays local, and the VM accesses it. This could be something we argue about. The code could be either entirely on the VM, or in a local folder accessed through the VM. I would use something like the Remote-SSH extension in VS Code to access it and work in it. But the main reason is to eliminate issues with WSL. → *Code location settled in Round 4: the code lives inside the VM (Q29/Q30).*

---

## Q2 - Where do you run `vagrant up`?

You're in WSL1 and the project is on `C:`. Vagrant from WSL1 driving Windows VirtualBox needs `VAGRANT_WSL_ENABLE_WINDOWS_ACCESS` and is fragile. The options: Windows PowerShell or CMD with Windows Vagrant; WSL; or "the README covers any host (Windows, macOS or Linux) with VirtualBox".

**Recommended:** The README targets any host with VirtualBox + Vagrant installed natively, and you run it from PowerShell on this machine. The WSL caveat is documented rather than designed around.

**Answer:** There are two ways to run the application. You can do a plain install and serve it in your own environment, whatever that is. And **I want pnpm to be the default, not npm.** I also want to provide a Vagrantfile for consistency, which always works. The README should say: if you want to do it that way, make sure Vagrant is installed on your host machine, then run `vagrant up`. It should share the code folder with the VM and make it all seamless. → *Superseded: the first `vagrant up` copies the code into the VM instead of sharing it (Q30). Host-native serving stays a first-class option (Q43).*

---

## Q3 - What does "GitHub repository exists" mean?

Is it **(a)** a local git repo with one branch, `master`, and one initial commit, which you push yourself? Or **(b)** should I also create the remote on GitHub? That needs `gh` or a token, and I don't have either.

**Recommended:** (a), and the README includes the two commands to push it.

**Answer:** (a), and the README includes the two commands to push it.

---

## Q4 - Is this a template or a project?

The Thoughts section says "used to template other projects". Should the repo be a generic template, with a placeholder name like `react-ts-starter`, a README written for "clone this to start a new app" and marked as a GitHub Template Repository? Or is it a specific app's first commit?

**Recommended:** A generic template. Name it `react-ts-starter` unless you give me a name.

**Answer:** A generic template, named `react-ts-starter`. And yes, the README should say "clone this to start a new app". But I also want that one commit to work as the start of the new app. It should be written so it can be the start of a new project.

---

## Q5 - What counts as "only libraries"?

You listed React, React Router, React Query and TypeScript as the only preinstalled libraries. Can I read that as the only **runtime** dependencies? The project still needs **dev** tooling: `sass-embedded` for SCSS, `typescript-eslint`, ESLint plugins, and `vite-plugin-checker` to show ESLint and TypeScript errors during serve. Also, SCSS modules need no extra package: Vite supports `*.module.scss` natively once `sass-embedded` is installed.

**Recommended:** Yes: those are the only runtime deps, and dev tooling is added only where an acceptance criterion needs it.

**Answer:** Yes. Other things will obviously need to be installed, like Vite plugins. I meant these are the only runtime libraries: the ones a developer on the project actually works with. Don't read it as "never install anything else". Definitely install whatever those libraries need.

---

## Q6 - Which React Router mode?

React Router v7 has three modes. **Framework mode** (formerly Remix) replaces the plain Vite setup and adds SSR concepts. **Data mode** uses `createBrowserRouter` and loaders. **Declarative mode** uses `<BrowserRouter>` and `<Routes>`.

**Recommended:** Data mode. It's still plain Vite, it scales, and it fits well with React Query.

**Answer:** Data mode. It's still plain Vite, it scales, and it fits well with React Query.

---

## Q7 - Formatting: Prettier or ESLint only?

You want double quotes and trailing commas enforced, and "be structuring" reads as **destructuring** (`prefer-destructuring`). Should ESLint do formatting through `@stylistic/eslint-plugin`, which means one tool and auto-fix on save? Or should Prettier handle formatting and ESLint handle correctness, which means two tools and an extra dev dependency?

**Recommended:** ESLint + `@stylistic`, with `.vscode/settings.json` so ESLint fixes on save. Airbnb is dead on flat config, so the base is `typescript-eslint` recommended + react-hooks + react-refresh + a small stylistic set.

**Answer:** ESLint + `@stylistic`. I generally like your recommendation. I don't much care for Prettier.

---

## Q8 - What goes in the backend folder?

Git doesn't track empty folders, and a placeholder file breaks the "no hanging files" rule. Options: **(a)** leave it out and note in the README where it would go; **(b)** add `server/README.md` with one line explaining the folder; **(c)** set up npm workspaces (`client/` + `server/`) now. Also, should `components/` start with at least one real component?

**Recommended:** (a).

**Answer:** No folder; just document it in the README. There should be a routes file, a `pages` folder for full-page components, and a `components` folder for common, large or shared components. Hanging files are OK if they're clearly placeholders; you can name them `.gitkeep`, and they don't need documenting. There should be at least one component in `pages`, and that should be the home page.

---

## Q9 - Which files does FILES.md cover?

Hidden *folders* (`.git`, `.vscode`?) and `node_modules` are excluded. What about hidden *files* at the root, like `.gitignore` and `.nvmrc`? And `.vscode/` is part of the "editor linting works" criterion.

**Recommended:** Document every committed file, dotfiles and `.vscode/` included, and exclude only `.git/`, `node_modules/` and `dist/`.

**Answer:** Document every committed file, dotfiles and `.vscode/` included, and exclude only `.git/`, `node_modules/` and `dist/`. When I said "each file is documented or removed", I meant the files Vite tends to include that serve no real purpose, like little hanging files that push testing on you and aren't explained anywhere. So either explain them (preferred), or remove them if they do nothing for this project and don't help meet any requirement.

---

## Q10 - What proves the libraries are "working"?

Proposal: two pages (`Home`, `NotFound`) through the router, and Home runs one `useQuery` against a local function (no network) that returns a greeting.

**Recommended:** Two pages and one tiny query, with no fake API client or extra layers.

**Answer:** Your proposal is perfect: Home and NotFound, plus a small `useQuery` test. → *The query was later replaced by the Item API Hook (Q20).*

---

## Q11 - Which Node version, and how is it pinned?

**Recommended:** Node 22 LTS, pinned in `.nvmrc` and in `package.json` `engines`. The Vagrant box (Ubuntu 24.04) installs the same version through NodeSource.

**Answer:** Good recommendation: Node 22 LTS, pinned in `.nvmrc` and in `package.json` `engines`. The Vagrant box (Ubuntu 24.04) installs the same version through NodeSource.
