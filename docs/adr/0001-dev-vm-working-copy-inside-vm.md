# The Dev VM keeps its Working Copy on its own disk, not in a shared folder

The Dev VM exists so every developer gets the same Linux runtime whether their Host is Windows, macOS or Linux, without depending on WSL. We keep the Working Copy inside the VM (`~/app`, copied from the Host checkout on the first `vagrant up`) and edit it through VS Code Remote-SSH, instead of sharing the Host folder into the VM. The goal is to keep setup simple and HMR fast.

## Considered Options

- **Host folder shared into the VM** (rejected). VirtualBox shared folders don't deliver file-change events, so Vite would have to poll, which makes HMR slower. They also refuse pnpm's symlinks on Windows Hosts, which would need a VM-local `node_modules` mount as a workaround. And on Apple Silicon Macs, shared folders are unreliable because VirtualBox's guest additions are limited there. That's too much machinery for a starter meant to be simple.
- **Dev Containers** (rejected). They would add Docker, which on Windows runs on WSL2, the dependency we wanted to avoid, and reopen the environment design for no clear gain.

## Consequences

- `vagrant destroy` deletes any work that hasn't been pushed. Pushing often is expected; git pushes from the VM through SSH agent forwarding.
- The Host checkout is used only to start the VM. Developers who don't want the VM run `pnpm install && pnpm dev` on the Host instead.
- Vite listens on all network interfaces only inside the VM, where an environment variable set by provisioning turns it on. On the Host it stays on `localhost`.
- Revisit this if the Remote-SSH workflow proves painful. Shared folders plus polling are the fallback.
