# react-ts-starter

A ready-to-build React + TypeScript app on Vite, with React Router, React Query, axios, SCSS and ESLint wired up.

For every detail, see **[GUIDE.md](GUIDE.md)**.

## Prerequisites

- **Node 22.22 or later 22.x.** It's pinned in `.nvmrc`, so [fnm](https://github.com/Schniz/fnm) or nvm picks it up.
- **pnpm through corepack.** Run `corepack enable` once. On Windows, remove any global pnpm first (`npm rm -g pnpm`), then run `corepack enable` in an admin prompt.

## Quick start

```sh
git clone https://github.com/MadOgre/react-ts-starter.git my-app
cd my-app
pnpm install
pnpm dev
```

Open **<http://localhost:9000>**.

Starting a real app? Follow the [rename checklist](GUIDE.md#start-a-new-app-from-this-template) first.

## Or run it in the Dev VM

An identical Linux environment on any Host. You need Vagrant 2.4+, VirtualBox (7.1+ on Apple Silicon, which is untested) and VS Code with Remote-SSH.

```sh
vagrant up
vagrant ssh-config >> ~/.ssh/config
```

Then connect VS Code to **`react-ts-starter`**, open `/home/vagrant/app` and run `pnpm dev`. The app opens at the same <http://localhost:9000> in your Host's browser. On Windows, see the [Remote-SSH setup](GUIDE.md#connect-vs-code-with-remote-ssh) for the right command.

## Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Serves with HMR, and shows lint and type errors in the browser |
| `pnpm build` | Type-checks, then builds into `dist/` |
| `pnpm lint` | Runs ESLint |
| `pnpm preview` | Serves the production build |

## Caveats

> [!WARNING]
> **`vagrant destroy` deletes the Dev VM's Working Copy**, including every commit you haven't pushed. Push often.

- **Port 9000 is fixed.** A running Dev VM holds it on the Host, so `vagrant halt` or `vagrant suspend` before running `pnpm dev` on the Host.
- **One OS per checkout.** `node_modules` holds binaries for a single OS, so don't install from both Windows and WSL in the same folder.
- **Slow `vagrant up` on Windows?** The hypervisor is probably on. See [Slow boots on Windows](GUIDE.md#slow-boots-on-windows).

## More

- [GUIDE.md](GUIDE.md): full setup, the Dev VM, pushing to GitHub, project layout
- [FILES.md](FILES.md): what every file is for
- [CONTEXT.md](CONTEXT.md): the project's terms
