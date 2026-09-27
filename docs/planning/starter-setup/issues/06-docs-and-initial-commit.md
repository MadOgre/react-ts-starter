# 06: Documentation, FILES.md and the initial commit

**What to build:** The template is documented and published locally as a single-commit repo.
- README covers: what the project is and how to start a new app from it (including renaming); both ways to run it (Host-native and Dev VM); Dev VM prerequisites and minimum versions (Vagrant 2.4+, VirtualBox 7.1+ on Apple Silicon, 7.2 recommended) and the "Apple Silicon untested" note; Remote-SSH setup; the Working Copy warning that `vagrant destroy` deletes unpushed work; the manual OS upgrade command; the commands to push to a new GitHub repo; where a future backend would go; the barrels vs. lazy-loading note; that `CONTEXT.md` can be deleted to start fresh; that Item is a sample resource to rename or replace.
- `FILES.md` explains the purpose of every committed file, dotfiles included, excluding only `.git`, `node_modules` and build output. It covers the glossary, the ADR, `CLAUDE.md`, the agent docs, and every file in the planning folder (intent, grilling rounds, spec, tickets).
- Squash all the per-ticket commits on `master` into exactly one initial commit containing everything (git is initialised in ticket 01, and each ticket commits so it can be reviewed).

**Blocked by:** 02, 03, 04, 05

**Status:** ready-for-agent

- [x] README covers every point listed above, using the glossary's terms
- [x] Every file reported by `git ls-files` has an entry in `FILES.md`, and `FILES.md` lists no file that isn't tracked
- [x] No unexplained or leftover files exist in the repo (`.gitkeep` placeholders excepted)
- [x] `git branch` shows only `master`, and `git log` shows exactly one commit

## Comments

**2026-09-27, from ticket 05 human testing: README requirements for the Dev VM section.** The details and reasons are in ticket 05's comments.
- **Remote-SSH setup:**
  - Append `vagrant ssh-config` to `~/.ssh/config`. In cmd or Git Bash, use `>>`. PowerShell 5.1's `>>` writes UTF-16, so there use `| Out-File -Append -Encoding ascii`. Or paste the output in through **Remote-SSH: Open SSH Configuration File…**.
  - Remove old entries that reach the same port, for example a `Host vagrant` block from an earlier Vagrant setup. A password prompt means VS Code isn't using the generated entry.
  - Replace the entry after `vagrant destroy` and `vagrant up`, because the port and key change.
  - Remote-SSH asks for the platform once for each new entry: choose Linux. It can be preset with `"remote.SSH.remotePlatform": { "react-ts-starter": "linux" }`.
  - Install the ESLint extension **in the SSH window**. Otherwise there are no squiggles and no fix-on-save. Tip: `"remote.SSH.defaultExtensions": ["dbaeumer.vscode-eslint"]` in the Host's user settings.
- **Pushing from the Dev VM (agent forwarding).** Make it OS-agnostic: one check that works on every OS, then a short fix for each OS.
  1. **No SSH key for GitHub yet?** Many developers use HTTPS on the Host and have none. Generate one on the Host with `ssh-keygen -t ed25519 -C "you@example.com"` (accept the default path; a passphrase is recommended). Add the `.pub` contents on GitHub under **Settings → SSH and GPG keys → New SSH key**. Link GitHub's docs on generating a key and adding it.
  2. **Check:** run `ssh-add -l` on the Host. It should list the key.
  3. **Fix for each OS if it doesn't:**
     - **Windows:** the OpenSSH Authentication Agent service is off by default. In an admin cmd, run `sc config ssh-agent start= auto` and `net start ssh-agent`. Then run `ssh-add %USERPROFILE%\.ssh\id_ed25519`.
     - **macOS:** `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`.
     - **Linux:** a desktop agent is usually running, so just `ssh-add ~/.ssh/id_ed25519`. With no agent, run `eval "$(ssh-agent -s)"` first.
     - **Optional:** `AddKeysToAgent yes` under `Host *` in `~/.ssh/config`.
  4. **Confirm in the Dev VM:** `ssh-add -l` lists the same key. Reconnect Remote-SSH if the key was loaded after connecting. Then `ssh -T git@github.com` should answer "Hi <you>! You've successfully authenticated, but GitHub does not provide shell access." Say that this wording **is** success. The "no shell access" part is normal.
  5. Explain briefly why an agent is used: the key never leaves the Host, and nothing secret is lost on `vagrant destroy`.
- **Provisioning:**
  - `vagrant up` can time out waiting for the Dev VM to boot (seen on a Windows Host with Hyper-V on; see the note on slow boots below). Running `vagrant up` again continues, and provisioning still runs, because Vagrant marks a machine provisioned only after it boots. In `lib/vagrant/action/builtin/provision.rb` (v2.4.3), the `action_provision` marker is written after `@app.call(env)`, which boots the machine, and before the provisioners run.
  - If provisioning itself fails partway, retry with `vagrant provision`, not `vagrant up`.
  - Vagrant names the VirtualBox VM `<folder>_react-ts-starter_<timestamp>_<random>`, not `react-ts-starter`.
- **Security note:** the `vagrant` user's password is `vagrant` (box default), and `sudo` needs none. The Dev VM's ports are bound to the Host's localhost only.

**2026-09-27, from ticket 05 human testing: two more README requirements.**
- **Slow Dev VM boots on Windows (Hyper-V):** on a Windows Host, every boot of the Dev VM hung at "SSH auth method: private key" and sometimes timed out. VirtualBox showed a green turtle icon: Windows' hypervisor was on, so VirtualBox fell back to running on top of Hyper-V, which is much slower. The README's Dev VM section needs a short "Slow boots on Windows" note:
  - **Symptom:** `vagrant up` sits at "Waiting for machine to boot" for minutes or times out, and the Dev VM's VirtualBox window shows a green turtle in the bottom-right corner. Confirm with `systeminfo | findstr /i "hypervisor"` ("A hypervisor has been detected").
  - **Cause:** Windows 11 often switches the hypervisor on even without WSL2 or Docker, for example through Core Isolation's **Memory integrity**. It can also come from the Hyper-V, Virtual Machine Platform, Windows Hypervisor Platform or Windows Sandbox features. This is a VirtualBox-on-Windows limitation, not something the repo can change.
  - **Fix (needs a reboot; the hypervisor can't be switched off in a running Windows session):**
    - Turn off Windows Security → Device security → Core isolation → Memory integrity.
    - Or run `bcdedit /set hypervisorlaunchtype off` in an admin cmd. `bcdedit /set hypervisorlaunchtype auto` undoes it.
    - If the turtle remains after the reboot, check the features above in `optionalfeatures.exe`.
  - **Cost, stated plainly:** Memory integrity is a real security feature, and with the hypervisor off, WSL2, Docker Desktop and Windows Sandbox stop working. WSL1 is unaffected. `wsl -l -v` shows which version each distro uses.
  - **If you keep the hypervisor on:** boot rarely. Use `vagrant suspend` / `vagrant resume` instead of `vagrant halt` / `vagrant up`: resume restores the running Dev VM without booting it. Or run on the Host for day-to-day work.
- **Pinned pnpm on the Host needs corepack:** a Windows Host with a globally installed pnpm (9.12.0) ignored `packageManager` and installed with that version instead of 10.34.5. The lockfile came out identical that time, but it isn't guaranteed. The "Run on your machine" section must say to enable corepack first:
  - On Windows: `npm rm -g pnpm` (if pnpm was installed globally), then `corepack enable` in an admin cmd, because Node's install folder needs admin rights.
  - On macOS and Linux: `corepack enable`, with `sudo` if Node is installed system-wide.
  - Check: `pnpm --version` in the project folder prints the pinned version.
  - The Dev VM already does this in provisioning.
- **One OS per checkout:** `node_modules` holds OS-specific binaries. Running `pnpm install` in the same folder from Windows and from WSL (or any second OS) replaces the other's install. The Dev VM doesn't have this problem, because it installs into its own Working Copy.

**2026-09-27, from ticket 05 wrap-up:**
- **Pinned Node on the Host:** the Windows Host had Node 24.21.0 installed, not the pinned 22 (`.nvmrc`, `engines`). The "Run on your machine" section should recommend a version manager that reads `.nvmrc`, such as fnm (all OSes) or nvm / nvm-windows, and say to check `node --version` for v22.x. The Dev VM installs Node 22 itself.
- **State of the shared checkout:** after ticket 05, `node_modules` was reinstalled from WSL (Linux binaries, pnpm 10.34.5) so that the agent can run `pnpm lint` and `pnpm build`. Host-native `pnpm dev` therefore runs from WSL, not from a Windows prompt, until someone reinstalls there. Run the final lint and build from WSL before the squash.

**2026-09-27, implementation notes:**
- **Files:** a new `README.md` and `FILES.md` at the repo root. `CLAUDE.md` gains the working rules (keep the build green, review until clean, code conventions, grilling sessions).
- **README:** covers every point above and every comment on this ticket. It also adds:
  - which files to rename, and that `VM_NAME` must be renamed before the first `vagrant up`;
  - a table of everyday Vagrant commands;
  - the port 9000 clash: a running Dev VM holds port 9000 on the Host, so Host-native `pnpm dev` fails until the Dev VM is halted or suspended. The verification run below hit exactly this.
- **`FILES.md`:** one entry per file, grouped by folder. A script compared its entries with `git ls-files` plus the two new files: they match exactly.
- **Squash:** after the review loop, the per-ticket commits are squashed into one root commit with `git reset --soft` to the root commit and `git commit --amend`.

**2026-09-27, review round 1 fixes:**
- **README accuracy:**
  - the Node check says `v22.22` or a later `v22`, matching `engines`;
  - the port 9000 note says `vagrant halt` or `vagrant suspend`;
  - `interfaces/` holds one file per type and the types derived from it.
- **Planning folder:** the README says to move the code conventions into `CLAUDE.md` before deleting the planning folder, because `CLAUDE.md` points at `spec.md` for them.
- **Working rules:** at the developer's decision, they ship in the template. The README and `FILES.md` say the section can be deleted.
- **Intent document:** `docs/agents/issue-tracker.md` now matches the developer's new `/project-kickoff` skill. Every feature folder starts from an `INTENT.md`, which skills read first; when it's missing, they create it from the template and stop until the developer fills it in. `CLAUDE.md`'s Agent skills pointer says the same.

**2026-09-27, review round 2 fixes:** the Spec review found nothing. From the Standards review: the feature-folder placeholder is `<feature-slug>` in both `CLAUDE.md` and `docs/agents/issue-tracker.md`; `FILES.md` calls `INTENT.md` the developer's own words, as the tracker doc does; and the README's step 4 says to keep Code conventions when deleting the Working rules, if the conventions were moved there.

**2026-09-27, review round 3 and the squash:** both agents reported nothing to fix. Two optional Standards points were left as they are: the `CLAUDE.md` row in `FILES.md` is a summary and the README holds the full deletion advice, and `<effort>` is the wayfinder skill's own word. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start passed from WSL, then the per-ticket commits were squashed into one initial commit on `master`. Every box on this ticket is now ticked.

**2026-09-27, after the squash, at the developer's request:**
- `files.md` and `intent.md` were renamed to `FILES.md` and `INTENT.md`, and every reference to them was updated, including in the planning record. The `/project-kickoff` skill's templates use the new names too.
- The Review until clean rule in `CLAUDE.md` now says a re-review is usually unnecessary when the only fixes are wording changes, unless one changes a fact, an instruction or the meaning.
- There was no agent re-review. The rename is mechanical and was verified by a search that finds no old name left and by comparing `FILES.md` with `git ls-files` again. The rule text is the developer's own. The checks passed again, and the change was squashed into the initial commit.

**2026-09-27, `INTENT.md` acceptance criteria check, at the developer's request:** every criterion is met and ticked. The evidence:
- **GitHub repository, only branch `master`:** a local git repo with one commit on `master`. Creating the GitHub remote was left to the developer (round 1, Q3); the README has the push commands.
- **`.gitignore`:** it covers Node, build output, local env files, editors, OS files and Vagrant state.
- **Vite template for TypeScript and ESLint:** the project starts from Vite's React + TypeScript template. That template now ships oxlint, so ESLint was added in ticket 02.
- **React, React Router, React Query:** installed and working (tickets 01 and 04). axios is the one other runtime library, and it was chosen in round 3.
- **Vagrantfile:** a human verified it from a fresh `vagrant up` (ticket 05).
- **Serve script:** `pnpm dev`, on the Host and in the Dev VM alike (round 2, Q14).
- **Home Page:** served at `/` (ticket 01).
- **SCSS:** `src/styles/global.scss` and SCSS modules, human-verified (ticket 03).
- **`FILES.md`:** it lists every committed file, including hidden ones, matching `git ls-files` exactly.
- **ESLint and TypeScript in VS Code and during serve:** human-verified in ticket 02, and in the Dev VM in ticket 05.
- **HMR:** human-verified on the Host (tickets 01 and 03) and in the Dev VM (ticket 05).
- **Polished, sensible folder structure:** no demo files or leftovers, and the layout is described in the README.
- **Double quotes, enforced by ESLint:** `@stylistic/quotes` is set to `double`, and `pnpm lint` passes. Every string in the TypeScript, JavaScript, SCSS, HTML and JSON files uses double quotes. Single quotes appear only in comments (as apostrophes), inside a double-quoted ESLint selector (`[exported.name='default']`), and in the shell commands the Vagrantfile runs. There they are shell quoting that keeps `$`, `^` and `\` literal. Raised with the developer.
- **Sensible ESLint ruleset:** typescript-eslint recommended type-checked, with the React Hooks, React Refresh and stylistic rules.

**2026-09-28, README split, at the developer's request:** the full README was too long to read. It moved to `GUIDE.md` unchanged, apart from its title, a pointer back to the README, the real clone URL, and `GUIDE.md` added to the rename list. The new `README.md` is a short quick start: prerequisites, clone and run, the Dev VM in brief, scripts, and the main caveats (`vagrant destroy`, the port 9000 clash, one OS per checkout, slow boots on Windows). It links into `GUIDE.md` for the rest. Every README requirement in this ticket is now covered by `GUIDE.md`. `FILES.md` lists both files.
