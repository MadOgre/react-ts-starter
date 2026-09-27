# Round 5: Dev VM details

Research findings (verified against primary sources on 2026-09-27):

- **VirtualBox 7.1+ officially supports Apple Silicon Macs**, for ARM Linux VMs only (the current version is 7.2.20). The documented limits are guest additions, graphics, sound and storage, which means **shared folders on Mac are unreliable**.
- **`bento/ubuntu-24.04`** comes in both Intel (`amd64`) and ARM (`arm64`) builds for VirtualBox.
- **Vagrant 2.4+** automatically downloads the box build that matches the Host (`box_architecture = :auto`).
- esbuild, rollup and sass-embedded all include ARM Linux binaries.

**What this means for us:** because we chose "code inside the VM, no shared folder", the one real Apple Silicon risk (shared folders) doesn't affect us. One Vagrantfile, with no per-platform code, should run on Windows, Linux and Apple Silicon Macs. It has never been tested on a real Mac, and the README will say so.

Still open: **Q30** in `round_4_questions.md`, and **Q20–Q27** in `round_3_questions.md`.

---

## Q33 - Support Apple Silicon in the Dev VM?

Based on the findings above: the Vagrantfile supports it without any per-platform code. The README lists the minimum versions: **Vagrant ≥ 2.4 on every Host, and VirtualBox ≥ 7.1 on Apple Silicon Macs** (7.2 recommended). It also says Apple Silicon hasn't been tested yet, and that anyone blocked can fall back to Host-native `pnpm dev`.

**Recommended:** Yes, as described. Nobody is excluded, and it costs nothing extra.

**Answer:**
Go with recommended
---

## Q34 - Should provisioning upgrade the whole OS?

The newest box build is about 11 months old. A full `apt upgrade` on first `vagrant up` adds several minutes but patches everything. Skipping it gives a faster first boot, and you install only what the project needs.

**Recommended:** Skip the full upgrade. Install only `git`, `curl`, Node 22 (NodeSource) and pnpm (corepack). It's a dev VM, not a server, and `vagrant up` stays quick. The README says how to run the upgrade manually.

**Answer:**
Go with recommended
---

## Q35 - How much CPU and memory does the VM get?

Vite + TypeScript + type-aware ESLint + VS Code's remote server all run inside the VM. Type-aware ESLint is the most memory-hungry of these.

**Recommended:** 2 CPUs and 4 GB RAM, set in one obvious place at the top of the Vagrantfile with a comment on how to change it.

**Answer:**
Go with recommended
---

## Q36 - How does git inside the VM know who you are?

You commit and push from inside the VM. That needs two things:

- **Pushing:** SSH agent forwarding lends the VM your Host's GitHub key. Nothing is copied into the VM.
- **Commit author:** `user.name` and `user.email` have to be set inside the VM. The options:
  - **(a)** Provisioning copies your Host's `~/.gitconfig` into the VM.
  - **(b)** The README tells you to run two `git config` commands once in the VM.
  - **(c)** Vagrant reads your Host's git name and email and sets them in the VM.

**Recommended:** Agent forwarding for pushing, plus **(a)**: copy `~/.gitconfig` if it exists. It's one line, and it brings your aliases along. If there's no `~/.gitconfig`, the README fallback is (b).

**Answer:**
Go with recommended
---

## Q37 - How does VS Code connect to the VM?

VS Code Remote-SSH needs an SSH host entry. The options:

- **(a)** The README says to run `vagrant ssh-config` once and paste the output into `~/.ssh/config`, then connect to the host `default` (or a name we choose).
- **(b)** Add a script that writes that entry automatically. That's another script per OS.

Also, Vagrant forwards port 5173 so the Host browser can reach `pnpm dev` even without VS Code. When VS Code is connected, it forwards the port automatically too.

**Recommended:** (a), with the VM's name set to `react-ts-starter` so the SSH host has a readable name. Vagrant also forwards port 5173.

**Answer:**
Go with recommended → *Superseded: the dev server port is 9000, not 5173 (spec).*