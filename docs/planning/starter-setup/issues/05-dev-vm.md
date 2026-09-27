# 05: Dev VM: `vagrant up` to a working `pnpm dev` from the Host browser

**What to build:** A developer on Windows, Linux or macOS (including Apple Silicon) runs `vagrant up`, connects VS Code through Remote-SSH, runs `pnpm dev` in the Working Copy inside the Dev VM, and uses the app from the Host browser with native-speed HMR. Follow ADR 0001 (Working Copy inside the Dev VM, no shared folder).
- Vagrant with VirtualBox; the bento Ubuntu 24.04 box with automatic architecture selection; 2 CPUs and 4 GB RAM set at the top of the Vagrantfile with a comment; a readable VM name matching the project.
- The default shared folder is disabled. On first provision only, the Host checkout (with git metadata) is copied into the VM user's home folder, if that folder doesn't exist yet; any copied `node_modules` and build output are deleted, then dependencies are installed inside the VM.
- Provisioning installs git, curl, Node 22 (NodeSource) and pnpm (corepack, at the pinned version), without a full OS upgrade. It copies the Host's git config if one exists and sets a shell environment variable that makes Vite listen on all interfaces.
- SSH agent forwarding is on; port 9000 is forwarded to the Host.
- Vite's server host reads that environment variable and falls back to localhost, so the Host-native dev server stays private.

This ticket needs a human with Vagrant and VirtualBox installed to verify it; it cannot be checked from the WSL environment used for planning.

**Blocked by:** 01

**Status:** ready-for-human

- [x] `vagrant up` completes on a fresh clone and the Working Copy exists inside the VM with its git remote intact (no remote exists yet: verified as git metadata intact)
- [x] Host `node_modules` copied into the VM are replaced by a Linux install
- [x] `vagrant ssh-config` output lets VS Code Remote-SSH connect to the VM by its readable name
- [x] `pnpm dev` inside the VM serves the app to the Host browser on port 9000, and edits update through HMR without polling
- [x] A commit made inside the VM carries the Host's git name and email; `git push` works through agent forwarding (no remote to push to yet: verified with `ssh -T git@github.com`)
- [x] `pnpm dev` on the Host listens on localhost only
- [x] Re-running provisioning does not overwrite an existing Working Copy

## Comments

**2026-09-27, from ticket 01:** `packageManager` pins pnpm 10.34.5. It runs under both current and older corepack versions (pnpm 11 and later need a recent corepack, which is why the pin was lowered from 12.6.0). Enable it through the corepack bundled with the NodeSource Node 22 install.

**2026-09-27, implementation notes:**
- **Files:** a new `Vagrantfile` at the repo root; `vite.config.ts` sets `server.host`.
- **Env variable:** `DEV_SERVER_HOST`, not `VITE_DEV_HOST` as sketched in Q43 (`round_6_questions.md`). Vite passes every `VITE_`-prefixed process variable through to client code, and this one is only for the dev server. `vite.config.ts` falls back to `localhost`. Provisioning writes `DEV_SERVER_HOST=0.0.0.0` to `/etc/environment` rather than a shell rc file. PAM loads it into every SSH session, including VS Code Remote-SSH's server and non-interactive shells, which `~/.bashrc` would miss.
- **Dev VM name:** `config.vm.define "react-ts-starter"` makes `vagrant ssh-config` print `Host react-ts-starter` instead of `Host default`. The hostname matches. The VirtualBox VM name is left to Vagrant, because a fixed one is unique across the whole Host, so a second clone of the template would fail `vagrant up`.
- **Copying the Working Copy:** VirtualBox shared folders are off, so the checkout goes in through Vagrant's file provisioner. It uploads each top-level entry of the Host checkout except `node_modules`, `dist` and `.vagrant` (which holds the Dev VM's private key) to `/tmp/app-copy`. Excluding them on the Host side avoids uploading Host-built binaries at all. A second shell provisioner, run as the `vagrant` user, acts only if `~/app` doesn't exist. It deletes `node_modules` and `dist` in the upload anyway, runs `pnpm install` there, and only then moves it to `~/app`, so a failed install is retried on the next provision. It always deletes the upload afterwards. Re-provisioning uploads the checkout again, but then discards it.
- **Provisioning:** `apt-get install git curl` with no upgrade; Node 22 from NodeSource (skipped if Node 22 is already installed); `corepack enable`; `pnpm install` with `COREPACK_ENABLE_DOWNLOAD_PROMPT=0` so corepack fetches the pinned pnpm without asking. The Host's `~/.gitconfig`, when it exists, is uploaded and moved into place only if the Dev VM has no `~/.gitconfig` yet, so git config set inside the Dev VM survives re-provisioning.
- **Port 9000** is forwarded to `127.0.0.1` on the Host, so the forwarded dev server isn't exposed to the Host's network either. `Vagrant.require_version ">= 2.4.0"` matches the spec's minimum.
- **Verified here:**
  - `tsc -b`, `pnpm lint` and `pnpm build` pass.
  - `pnpm dev` lists only `Local: localhost:9000`; with `DEV_SERVER_HOST=0.0.0.0` it also lists Network addresses.
  - Both inline provisioning scripts pass `bash -n`.
  - The Working Copy script, run in a sandbox with a stub `pnpm`:
    - A failed install leaves no `~/app`.
    - The retry installs, moves the upload into place without the Host `node_modules` or `dist`, copies the git config and cleans up.
    - A third run leaves the Working Copy and a git config edited inside the Dev VM untouched.
  - A real `pnpm install` in one directory, then moved to another (as staging moves to `~/app`), keeps working: `.modules.yaml` records the virtual store as the relative `.pnpm`, and a later `pnpm install`, `pnpm build` and `pnpm lint` succeed in the new location.
- **Not verified:** everything that needs Vagrant, VirtualBox or Ruby, none of which are installed here. That includes parsing the Vagrantfile itself, and every checkbox on this ticket.
- **Known trade-offs:**
  - The file provisioner opens an SSH command for each file it uploads, so the first copy takes longer as `.git` grows.
  - A Windows checkout's `.git/config` comes along with Windows-only settings such as `core.filemode=false` and `core.ignorecase=true`; the latter can hide case-only renames on Linux. The same is true of a Host `~/.gitconfig` that sets, for example, `credential.helper=manager`. Both are harmless for SSH pushes.

**2026-09-27, human testing on a Windows Host (in progress):**
- `vagrant up` completed. `pnpm dev` in the Working Copy serves the app to the Host browser on port 9000. ESLint errors show in the serve terminal and the browser overlay.
- **For the README (ticket 06), Remote-SSH section:**
  - A password prompt when connecting means VS Code isn't using the `vagrant ssh-config` entry. The generated entry sets the Dev VM's key and `PasswordAuthentication no`. Here the cause was a `Host vagrant` entry left over from an earlier Vagrant setup, which reached the same port without this key. Remove old entries and append a fresh one. Don't use PowerShell 5.1's `>>`, which writes UTF-16 that SSH can't read. `>>` in cmd or Git Bash works. PowerShell needs `| Out-File -Append -Encoding ascii`. Or paste the output through **Remote-SSH: Open SSH Configuration File…**. After `vagrant destroy` and `vagrant up`, the port and key can change, so replace the entry again.
  - Remote-SSH asks for the remote platform the first time it connects to each SSH config entry. Choose Linux, or preset `"remote.SSH.remotePlatform": { "react-ts-starter": "linux" }` in the Host's user settings.
  - The editor showed no ESLint squiggles and did no fix-on-save until the ESLint extension was installed **in the SSH window**. Extensions run inside the Dev VM, and a Host install doesn't carry over. Tip: `"remote.SSH.defaultExtensions": ["dbaeumer.vscode-eslint"]` in the Host's user settings installs it for every Remote-SSH connection.
- The first provision was slow to copy the checkout. See the next entry.

**2026-09-27, the checkout goes in as one archive:**
- **What changed:** the Vagrantfile packs the checkout into `.vagrant/app-copy.tar.gz` on the Host. It uses Ruby's standard library (`Gem::Package::TarWriter` and `Zlib`), which ships inside Vagrant, so no Host needs `tar`. `node_modules`, `dist` and `.vagrant` are still left out. One file provisioner uploads the archive. The Working Copy provisioner extracts it to `/tmp/app-copy`, runs `pnpm install` and moves it to `~/app`, as before.
  - `node_modules` and `dist` are never in the archive, so the `rm -rf` of them in the Dev VM is gone.
  - If `~/app` is missing and no archive was uploaded, provisioning stops with an error that says to run `vagrant provision`. That can happen when the VM was deleted outside Vagrant, or when `VAGRANT_DOTFILE_PATH` moves Vagrant's state.
  - Broken symlinks in the checkout are skipped, so they can't abort the build.
  - Vagrant writes `action_provision` before the provisioners run. So if the first provision fails, a plain `vagrant up` won't retry it. The README (ticket 06) should say to run `vagrant provision` instead.
- **When the archive is built:** only for commands that will provision:
  - `provision`;
  - `up` or `reload` given `--provision` or `--provision-with`;
  - `up` or `reload` before the first provision. Vagrant writes `.vagrant/machines/react-ts-starter/virtualbox/action_provision` then, and afterwards plain `up` and `reload` don't provision.

  Every other command skips the build and doesn't define the upload. Defining it would fail validation, because the file provisioner checks that its source exists. So `vagrant up` on a provisioned Dev VM no longer uploads anything. `vagrant provision` still uploads the checkout, now as a single file, and the Dev VM discards it when `~/app` exists.
- **Verified here:** no Ruby or Vagrant is installed, so Ubuntu's `ruby3.0` and `libruby3.0` packages were unpacked into the scratchpad without root. The Vagrantfile was then loaded under a stub of Vagrant's configure API, against a copy of the repo that also had `node_modules`, `dist` and `.vagrant`.
  - It parses. The archive is built, and the `checkout` provisioner is defined, for exactly the cases listed above. That includes `up --provision-with`. They aren't for `up` or `reload` after provisioning, `up --no-provision`, `ssh`, `status`, `halt` or `destroy`.
  - The archive takes about 0.2 s to build and is 418 KB. Its 526 entries match the checkout exactly, including `.git`, with none of the excluded folders.
  - With a broken symlink both at the top level and inside `src`, the archive still builds, and both symlinks are left out. The first version crashed on the top-level one, because `Find.find` rejects a missing starting path.
  - The rendered Working Copy script, run in a sandbox against that archive with a stub `pnpm`, behaves as intended:
    - With no archive, it stops with the error.
    - A failed install leaves no `~/app`.
    - The retry extracts, installs and moves into place. In the result, `git status` shows exactly the Host's uncommitted changes and `git fsck` is clean.
    - A re-provision keeps both the Working Copy and a git config edited inside the Dev VM.
  - Both rendered inline scripts pass `bash -n`.
- **Not verified:** a real `vagrant up` with the archive, including how long it takes. Vagrant bundles a newer Ruby than 3.0, but the APIs used here are unchanged.

**2026-09-27, human verification:** the user confirmed every check on a Windows Host (VirtualBox, Vagrant, VS Code Remote-SSH), using the single-archive Vagrantfile after a `vagrant destroy`:
- `vagrant up` created the Working Copy at `~/app`, with its git history. The repo has no remote yet, so "remote intact" was checked as git metadata intact.
- A marker placed in the Host's `node_modules` was absent in the Dev VM, `dist` was absent, and `node_modules` held Linux binaries.
- `vagrant ssh-config` printed `Host react-ts-starter`, and Remote-SSH connected with the Dev VM's key and no password, once an old `Host vagrant` entry was removed.
- `pnpm dev` in the Dev VM served the app to the Host browser on port 9000:
  - the Home Page and NotFound Page;
  - HMR without a full reload;
  - lint and type errors in the overlay;
  - ESLint in the editor, once the extension was installed in the SSH window.
- Commits in the Dev VM carried the Host's git name and email. `ssh -T git@github.com` authenticated through agent forwarding, once the Windows ssh-agent service was started and the key added. There's no remote to push to yet.
- With the Dev VM halted, `pnpm dev` on the Host listed only `Local: http://localhost:9000/`.
- After `vagrant provision`, a file in `~/app` and a git setting made in the Dev VM both survived.

Every box on this ticket is now ticked.

**Findings from testing, now handled:**
- The first provision was slow; fixed by the single archive.
- Boots were slow and sometimes timed out on this Host because Windows' hypervisor was on, making VirtualBox run on top of Hyper-V (green turtle icon). The Vagrantfile now sets `boot_timeout` to 600 s, double the default, so a slow boot doesn't fail. It doesn't make boots faster. The Windows-side fix and its costs are recorded for the README in ticket 06's comments, along with the other README items this testing turned up.
- The Host's `node_modules` was later reinstalled from Windows with a global pnpm 9.12.0 rather than the pinned 10.34.5, because corepack isn't enabled on that Host. That's recorded for the README in ticket 06. The lockfile was unchanged.
