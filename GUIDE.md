# react-ts-starter guide

The full reference: setup on every OS, the Dev VM, troubleshooting and starting a new app. For the short version, see [`README.md`](README.md).

A starter for React + TypeScript web apps, built on Vite, with React Router, React Query and axios already wired up. ESLint and TypeScript check the code in the editor, in the browser overlay while the dev server runs, and on the command line. SCSS and SCSS modules work out of the box.

The repo is one `master` branch with one commit. That commit is both a reusable template and the first commit of the app you build from it.

There are two ways to run it, and both use the same `pnpm dev`:

- **[Run on your machine](#run-on-your-machine):** install the dependencies on your Host and serve from there.
- **[Run in the Dev VM](#run-in-the-dev-vm):** `vagrant up` gives every developer the same Linux environment, whatever their Host. You edit the Working Copy inside the Dev VM through VS Code Remote-SSH, and open the app in your Host's browser.

The terms used here (Host, Dev VM, Working Copy, Page, Shared Component, API Function, API Hook, Item) are defined in [`CONTEXT.md`](CONTEXT.md). Every committed file is explained in [`FILES.md`](FILES.md).

## Start a new app from this template

1. Clone the template into a folder named after your app:

   ```sh
   git clone https://github.com/MadOgre/react-ts-starter.git my-app
   cd my-app
   ```

2. Rename the project. Replace `react-ts-starter` with your app's name in:
   - `package.json`: `name`
   - `index.html`: `<title>`
   - `src/pages/Home/Home.tsx`: the heading
   - `Vagrantfile`: `VM_NAME`, which names the Dev VM and its SSH host entry. Rename it **before your first `vagrant up`**: Vagrant treats a renamed machine as a new one and leaves the old Dev VM behind. Two apps with the same `VM_NAME` would also clash in your `~/.ssh/config`.
   - `README.md`, `GUIDE.md` and `CONTEXT.md`: the titles, and the clone URL in `README.md` and `GUIDE.md`
3. Replace the sample resource. **Item** exists only to show the data path from a Page through an API Hook and an API Function to axios. Rename or replace it (`src/interfaces/Item.ts`, `src/api/items.ts`, `src/apiHooks/items.ts` and the Home Page) with your own resource. See [Mock data](#mock-data) for removing the mocks once a backend exists.
4. Decide what to keep:
   - `CONTEXT.md` is the glossary for this template. Edit it as your app's terms settle, or delete it to start fresh.
   - `docs/planning/starter-setup/` is the record of how the template was designed (intent, grilling rounds, spec and tickets), and `docs/adr/0001-…` records why the Working Copy lives inside the Dev VM. Keep them or delete them. `CLAUDE.md` points AI coding agents to the code conventions under Implementation Decisions in `docs/planning/starter-setup/spec.md`, so if you delete the planning folder, move those conventions into `CLAUDE.md` first.
   - `CLAUDE.md` has working rules for AI coding agents: keep the build green, re-review after fixes, the code conventions, and how grilling sessions are recorded. Delete its Working rules section if you don't want them, keeping Code conventions if you moved the conventions there.
   - If you delete or add files, update `FILES.md` to match.
5. Commit, then [push to a new GitHub repo](#push-to-a-new-github-repo).

## Run on your machine

You need **Node 22** and **pnpm** on your Host.

1. **Node 22.** The version is pinned in `.nvmrc` and in `engines` in `package.json`. Use a version manager that reads `.nvmrc`, such as [fnm](https://github.com/Schniz/fnm) (every OS), [nvm](https://github.com/nvm-sh/nvm) (macOS, Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows). Check with `node --version`: it should print `v22.22` or a later `v22`.
2. **pnpm, at the pinned version.** `packageManager` in `package.json` pins pnpm. Corepack, which ships with Node, runs exactly that version, but only once it's enabled. A globally installed pnpm ignores the pin and installs with its own version.
   - **Windows:** if pnpm is installed globally, remove it with `npm rm -g pnpm`. Then run `corepack enable` in a cmd opened as administrator, because Node's install folder needs admin rights.
   - **macOS and Linux:** run `corepack enable`, with `sudo` if Node is installed system-wide.
   - **Check:** `pnpm --version` in the project folder prints the pinned version.
3. Install and serve:

   ```sh
   pnpm install
   pnpm dev
   ```

   Open <http://localhost:9000>. On the Host, the dev server listens on localhost only, so it isn't reachable from your network.

**One OS per checkout.** `node_modules` holds binaries built for one OS. If you run `pnpm install` in the same folder from Windows and from WSL (or any second OS), each install replaces the other's. Pick one OS for each checkout. The Dev VM doesn't have this problem, because it installs into its own Working Copy.

**Port 9000 is fixed.** If it's taken, `pnpm dev` stops with an error rather than moving to another port. A running Dev VM holds port 9000 on the Host, so run `vagrant halt` or `vagrant suspend` before serving on the Host.

## Run in the Dev VM

The Dev VM is an Ubuntu 24.04 machine run by Vagrant and VirtualBox. It gives every developer the same Linux runtime and the same native binaries, on any Host and without WSL.

**How it works:** on the first `vagrant up`, your Host checkout (including its git history) is copied into the Dev VM at `~/app`, and dependencies are installed there. From then on, `~/app` is your **Working Copy**: you edit, commit and push there, through VS Code Remote-SSH. The Host checkout is only used to start the Dev VM, and later changes to it aren't copied in. [ADR 0001](docs/adr/0001-dev-vm-working-copy-inside-vm.md) explains why there is no shared folder.

> [!WARNING]
> **`vagrant destroy` deletes the Working Copy, including every commit you haven't pushed.** It lives only on the Dev VM's disk. Push often. `vagrant halt` and Host reboots are safe.

### Prerequisites

- **Vagrant 2.4 or newer**, on every Host. The Vagrantfile refuses older versions.
- **VirtualBox.** On Apple Silicon Macs, **7.1 or newer** is required (7.2 recommended).
- **VS Code** with the **Remote-SSH** extension, and an SSH client on the Host (built into Windows 10 and later, macOS and Linux).

> [!NOTE]
> **Apple Silicon is untested.** The Vagrantfile picks the ARM build of the box automatically, and VirtualBox 7.1+ supports ARM Linux VMs on Apple Silicon, but no one has run it on a real Mac yet. If it doesn't work for you, [run on your machine](#run-on-your-machine) instead.

### Start the Dev VM

From the Host checkout (the folder with the `Vagrantfile`):

```sh
vagrant up
```

The first run downloads the box, then provisions the Dev VM:
- It installs git, curl, Node 22 (from NodeSource) and pnpm (through corepack, at the pinned version). It doesn't upgrade the OS; see [OS upgrades](#os-upgrades).
- It copies your checkout to `~/app`, without the Host's `node_modules`, `dist` or `.vagrant`, and runs `pnpm install` there.
- It copies your Host's `~/.gitconfig`, if you have one, so commits in the Dev VM carry your name and email. Without one, run `git config --global user.name "…"` and `git config --global user.email "…"` in the Dev VM.

Later runs of `vagrant up` just start the Dev VM. Provisioning never overwrites an existing Working Copy or a git config you changed inside the Dev VM.

**If the first `vagrant up` fails:**
- **Timed out waiting for the machine to boot:** run `vagrant up` again. It carries on, and provisioning still runs, because Vagrant only marks the Dev VM provisioned after it has booted. On Windows, see [Slow boots on Windows](#slow-boots-on-windows).
- **Provisioning failed partway:** fix the cause (often the network), then run `vagrant provision`. A plain `vagrant up` won't retry, because Vagrant has already marked the Dev VM provisioned.

**Resources:** the Dev VM gets 2 CPUs and 4 GB of RAM. Change `VM_CPUS` and `VM_MEMORY_MB` at the top of the `Vagrantfile`, then run `vagrant reload`.

**In VirtualBox,** the Dev VM appears as `<folder>_react-ts-starter_<timestamp>_<random>`, not `react-ts-starter`. Vagrant chooses the name, so that two clones of the template can run side by side.

### Connect VS Code with Remote-SSH

1. **Add the Dev VM to your SSH config.** From the Host checkout, append the output of `vagrant ssh-config` to `~/.ssh/config`:
   - **macOS, Linux, Git Bash:** `vagrant ssh-config >> ~/.ssh/config`
   - **Windows cmd:** `vagrant ssh-config >> %USERPROFILE%\.ssh\config`
   - **Windows PowerShell:** `vagrant ssh-config | Out-File -Append -Encoding ascii $HOME\.ssh\config`. Don't use `>>` in PowerShell 5.1: it writes UTF-16, which SSH can't read.
   - **Or** paste the output in through **Remote-SSH: Open SSH Configuration File…** in VS Code.

   The entry is named `Host react-ts-starter` (your `VM_NAME`).
2. **Remove old entries that reach the same port,** such as a `Host vagrant` or `Host default` block from an earlier Vagrant setup. If VS Code asks for a password, it isn't using the generated entry, which logs in with the Dev VM's key.
3. **Connect:** run **Remote-SSH: Connect to Host…** and choose `react-ts-starter`. When asked for the platform, choose **Linux**. It asks once for each new entry.
4. **Open the Working Copy:** **File → Open Folder…** and choose `/home/vagrant/app`.
5. **Install the ESLint extension in the SSH window.** Extensions run inside the Dev VM, and one installed on the Host doesn't carry over. Without it you get no ESLint squiggles and no fix-on-save. VS Code offers the recommended extensions when you open the folder.

**After `vagrant destroy` and `vagrant up`,** the port and key change. Replace the entry in `~/.ssh/config` with fresh `vagrant ssh-config` output.

**Optional, in your Host's VS Code user settings:** skip the platform question and install ESLint on every Remote-SSH connection:

```json
"remote.SSH.remotePlatform": { "react-ts-starter": "linux" },
"remote.SSH.defaultExtensions": ["dbaeumer.vscode-eslint"]
```

### Serve

In a terminal in the Remote-SSH window (inside `~/app`):

```sh
pnpm dev
```

Open <http://localhost:9000> in your Host's browser. Vagrant forwards port 9000 from the Dev VM to the Host. HMR is as fast as on the Host, because the files live on the Dev VM's own disk and Vite sees changes natively.

### Push from the Dev VM

Git in the Dev VM pushes with your Host's SSH key through **SSH agent forwarding**: the Dev VM asks the SSH agent on your Host to sign in to GitHub. The key never leaves the Host, and there is nothing secret to lose on `vagrant destroy`. It needs an SSH key for GitHub, loaded into the agent on your Host.

1. **No SSH key for GitHub yet?** Many developers use HTTPS on the Host and have none. Create one on the Host, accepting the default path (a passphrase is recommended):

   ```sh
   ssh-keygen -t ed25519 -C "you@example.com"
   ```

   Then add the contents of the `.pub` file on GitHub under **Settings → SSH and GPG keys → New SSH key**. GitHub's guides: [generating a key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [adding it to your account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
2. **Check:** run `ssh-add -l` on the Host. It should list your key.
3. **If it doesn't:**
   - **Windows:** the OpenSSH Authentication Agent service is off by default. In a cmd opened as administrator, run `sc config ssh-agent start= auto` and `net start ssh-agent`. Then run `ssh-add %USERPROFILE%\.ssh\id_ed25519`.
   - **macOS:** `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`
   - **Linux:** a desktop agent is usually running, so `ssh-add ~/.ssh/id_ed25519` is enough. With no agent, run `eval "$(ssh-agent -s)"` first.
   - **Optional, every OS:** add `AddKeysToAgent yes` under `Host *` in `~/.ssh/config`, so the key is loaded when you first use it.
4. **Confirm in the Dev VM:** `ssh-add -l` lists the same key. If you loaded the key after connecting, reconnect Remote-SSH first. Then run `ssh -T git@github.com`. It should answer:

   ```
   Hi <you>! You've successfully authenticated, but GitHub does not provide shell access.
   ```

   **That is success.** The "no shell access" part is normal.

### Slow boots on Windows

- **Symptom:** while "Waiting for machine to boot", `vagrant up` sits at "SSH auth method: private key" for minutes, or times out. The Dev VM's VirtualBox window (**Show** in VirtualBox Manager) has a green turtle in its bottom-right corner. Confirm with `systeminfo | findstr /i "hypervisor"`, which prints "A hypervisor has been detected".
- **Cause:** Windows' hypervisor is on, so VirtualBox runs on top of Hyper-V, which is much slower. Windows 11 often switches it on even without WSL2 or Docker, for example through Core Isolation's **Memory integrity**. The Hyper-V, Virtual Machine Platform, Windows Hypervisor Platform and Windows Sandbox features can also switch it on. This is a limitation of VirtualBox on Windows; the repo can't change it. The Vagrantfile allows 10 minutes for a boot, double Vagrant's default, so slow boots don't fail, but they stay slow.
- **Fix,** which needs a reboot (the hypervisor can't be switched off in a running Windows session):
  - Turn off **Windows Security → Device security → Core isolation → Memory integrity**,
  - or run `bcdedit /set hypervisorlaunchtype off` in a cmd opened as administrator. `bcdedit /set hypervisorlaunchtype auto` undoes it.
  - If the turtle is still there after the reboot, turn off the features above in `optionalfeatures.exe`.
- **The cost:** Memory integrity is a real security feature. With the hypervisor off, WSL2, Docker Desktop and Windows Sandbox stop working. WSL1 is unaffected; `wsl -l -v` shows which version each distro uses.
- **If you keep the hypervisor on,** boot rarely. Use `vagrant suspend` and `vagrant resume` instead of `vagrant halt` and `vagrant up`: resume restores the running Dev VM without booting it. Or [run on your machine](#run-on-your-machine) day to day.

### OS upgrades

Provisioning installs only what the project needs and skips a full OS upgrade, so `vagrant up` stays quick. To patch the Dev VM's OS packages when you choose to, run this in the Dev VM:

```sh
sudo apt-get update && sudo apt-get upgrade -y
```

If the upgrade installs a new kernel, run `vagrant reload` from the Host to restart into it.

### Everyday Vagrant commands

Run these from the Host checkout.

| Command | What it does |
| --- | --- |
| `vagrant up` | Starts the Dev VM (and provisions it the first time). |
| `vagrant halt` | Shuts the Dev VM down. The Working Copy is kept. |
| `vagrant suspend` / `vagrant resume` | Pauses and resumes the running Dev VM, without a boot. |
| `vagrant reload` | Restarts the Dev VM, applying `Vagrantfile` changes such as CPUs and memory. |
| `vagrant provision` | Re-runs provisioning. It never overwrites an existing Working Copy. |
| `vagrant ssh` | Opens a shell in the Dev VM. |
| `vagrant destroy` | Deletes the Dev VM **and the Working Copy with any unpushed work**. |

### Security notes

- The `vagrant` user's password is `vagrant` (the box's default), and `sudo` needs no password. Don't keep secrets in the Dev VM.
- The forwarded port and the Dev VM's SSH port are bound to the Host's localhost, so they aren't reachable from your network.

## Push to a new GitHub repo

Create an empty repository on GitHub, without a README, license or `.gitignore`, so the first push doesn't conflict. Then, in your Working Copy (inside the Dev VM, or the Host checkout if you run on your machine):

```sh
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin master
```

If you cloned the template, `origin` already points at it: use `git remote set-url origin git@github.com:<you>/<repo>.git` instead of `git remote add`.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Serves the app at <http://localhost:9000> with HMR. TypeScript and ESLint errors show in the terminal and the browser overlay. |
| `pnpm build` | Type-checks, then builds for production into `dist/`. |
| `pnpm lint` | Runs ESLint over the project. |
| `pnpm preview` | Serves the production build from `dist/`. |

There is no test runner and no test script: add the testing setup you choose.

## Project layout

```
src/
  main.tsx          entry point: providers, router, global styles
  routes.tsx        every route, in React Router's data mode
  queryClient.ts    the React Query client and its defaults
  pages/            one folder per Page, e.g. pages/Home/Home.tsx + Home.module.scss
  components/       Shared Components (empty to start)
  api/              the shared axios instance and the API Functions
  apiHooks/         the API Hooks, built on React Query
  interfaces/       shared types, one file per type and the types derived from it
  styles/           global.scss, loaded once at startup
```

- **Imports** use the `@/` alias for `src/`, for example `import { Home } from "@/pages"`.
- **Named exports only.** Lint rejects default exports, except in tool config files.
- **Barrels:** each area except `components` and `styles` has an `index.ts` that re-exports it. Give `components` one when you add the first Shared Component.
- **Components** are typed with `FC`, or `FC<ComponentNameProps>` when they take props.
- **Environment variables** go in `.env` (committed, with safe defaults) and are typed in `src/vite-env.d.ts`. Override them in `.env.local`, which is gitignored. `VITE_API_BASE_URL` sets the base URL of the shared axios instance.

### Mock data

No backend exists yet, so each Item API Function passes a mock axios adapter, marked `// MOCK`, that answers with fixed data after 500 ms. The mocks store nothing. When a real backend is ready, follow the removal comments at the top of `src/api/items.ts` and in `src/api/mockAdapter.ts`.

### Barrels and lazy-loaded routes

Barrels keep imports short, but they make it harder to load Pages on demand later. A Page that should be lazy-loaded must be imported directly from its own file, such as `@/pages/Home/Home`, and nowhere through the `@/pages` barrel. Otherwise it stays in the main bundle. At this size it doesn't matter, so all routes are loaded up front.

## Adding a backend

There is no backend folder yet. When you add one, put it next to `src/` at the repo root, for example in `server/`. Once the repo holds more than one package, consider pnpm workspaces. Then:
- point `VITE_API_BASE_URL` at it, or add a dev proxy in `vite.config.ts`;
- remove the mocks (see [Mock data](#mock-data));
- forward its port in the `Vagrantfile` if you run it in the Dev VM.
