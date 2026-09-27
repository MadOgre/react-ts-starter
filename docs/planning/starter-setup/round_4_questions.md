# Round 4: reopening Q12 (Dev VM code location)

Settled: speed and complexity are both reasons to drop option (a). Simplicity is what decides this.

Round 3 Q20–Q27 are still open and don't depend on this round. Q28 (the ADR) waits for this round.

---

## Q29 - Is "code survives `vagrant destroy` without pushing" a requirement?

This is the one thing option (a) gives you that (b) doesn't. With (b), the working copy lives on the VM's disk. It survives `vagrant halt` and Host reboots, but `vagrant destroy` wipes it.

**Recommended:** Nice to have, not a requirement. "Push often" goes in the README, and you run `vagrant destroy` on purpose, not by accident.

**Answer:** Not a requirement. Ideally everything is pushed. → Q12 settled as **(b) code inside the VM**.

---

## Q30 - How does the code get into the VM?

You clone the repo on the Host (that's how you get the Vagrantfile). The question is how it gets from there into the VM.

- **(a)** The first `vagrant up` copies the Host checkout, including `.git`, into `~/app` inside the VM, only if `~/app` doesn't already exist. The default two-way shared folder is turned off. It needs no GitHub credentials during setup, works for private repos, and keeps the `origin` remote. After that, the VM copy is the one you work in, and the Host clone is only the launcher.
- **(b)** Provisioning runs `git clone <origin>` inside the VM. That needs GitHub access (keys or a token) during `vagrant up`, and the Vagrantfile has to know the repo URL, which is awkward for a template that gets cloned under new names.

**Recommended:** (a). The README says plainly: "After `vagrant up`, your working copy is `~/app` in the VM. Open it with VS Code Remote-SSH. The folder you cloned on your Host is only used to start the VM." SSH agent forwarding is on, so `git push` from the VM uses your Host's GitHub key.

**Answer:** Go with recommended (a), and also provide a way to skip Vagrant and just serve locally. → see Q43.

---

## Q31 - Are your Mac developers on Apple Silicon?

On M-series Macs, VirtualBox support is recent and limited, and there are few arm64 Vagrant boxes for it. If some are, the options are:

- **(a)** The README says Apple Silicon is unsupported for the Dev VM; those developers use the Host-native `pnpm install && pnpm dev`.
- **(b)** The Vagrantfile also supports a second provider for Mac (for example Parallels). That's more config, but I would need to research and verify it before building on it.
- **(c)** Unknown or not a concern yet: target VirtualBox on x86 only and note it in the README.

**Recommended:** (c) for now, with a README note. It's easy to add (b) later without changing anything else.

**Answer:** Nobody I know is on Apple Silicon, but I don't want to exclude anyone. → Researching whether one Vagrantfile can cover Apple Silicon too.

---

## Q32 - Are Dev Containers off the table?

VS Code Dev Containers (Docker) are the other mainstream way to get "the same environment on every OS". On Windows, Docker Desktop runs on WSL2 behind the scenes, though you never work inside WSL yourself. Is Docker ruled out, or should I weigh it against Vagrant?

**Recommended:** Stay with Vagrant. It's what you asked for, it keeps Windows fully clear of WSL, and switching would reopen the whole environment branch.

**Answer:** It didn't come up, and I'm worried it adds complexity. → Settled: **stay with Vagrant**, no Dev Containers.
