# The Dev VM: an identical Linux environment on any Host. See docs/adr/0001 for why the
# Working Copy lives inside the Dev VM (~/app) instead of in a shared folder.

require "fileutils"
require "find"
require "rubygems/package"
require "zlib"

# Resources for the Dev VM. Change these to suit your machine, then run `vagrant reload`.
VM_CPUS = 2
VM_MEMORY_MB = 4096

VM_NAME = "react-ts-starter"
VAGRANT_DIR = File.join(__dir__, ".vagrant")
# Keep in sync with server.port in vite.config.ts.
DEV_SERVER_PORT = 9000

# Host entries that are never copied into the Dev VM: Host-built binaries and Vagrant's own state.
COPY_EXCLUDES = ["node_modules", "dist", File.basename(VAGRANT_DIR)]
HOST_COPY_ARCHIVE = File.join(VAGRANT_DIR, "app-copy.tar.gz")
COPY_ARCHIVE_UPLOAD = "/tmp/app-copy.tar.gz"
COPY_STAGING_DIR = "/tmp/app-copy"
HOST_GITCONFIG_UPLOAD = "/tmp/host-gitconfig"

# Packs the Host checkout, including .git, into one archive. Vagrant uploads a folder file by file,
# with SSH round trips for each one, which is slow for a whole repo.
build_copy_archive = lambda do
  FileUtils.mkdir_p(VAGRANT_DIR)
  Zlib::GzipWriter.open(HOST_COPY_ARCHIVE) do |gzip|
    Gem::Package::TarWriter.new(gzip) do |tar|
      entries = Dir.children(__dir__).reject { |entry| COPY_EXCLUDES.include?(entry) }.map { |entry| File.join(__dir__, entry) }
      # Skip broken symlinks, which have nothing to copy (Find.find raises on one passed to it directly).
      Find.find(*entries.select { |entry| File.exist?(entry) }) do |path|
        next unless File.exist?(path)

        name = path.delete_prefix("#{__dir__}/")
        stat = File.stat(path)
        if stat.directory?
          tar.mkdir(name, stat.mode & 0o777)
        elsif stat.file?
          tar.add_file_simple(name, stat.mode & 0o777, stat.size) do |io|
            File.open(path, "rb") { |file| IO.copy_stream(file, io) }
          end
        end
      end
    end
  end
end

# Only commands that will provision need the archive. Vagrant writes action_provision on the first
# provision; after that, `up` and `reload` provision only when given --provision or --provision-with.
command = ARGV.find { |arg| !arg.start_with?("-") }
already_provisioned = File.exist?(File.join(VAGRANT_DIR, "machines", VM_NAME, "virtualbox", "action_provision"))
provision_flag = ARGV.any? { |arg| arg.start_with?("--provision") }
will_provision = command == "provision" ||
  (["up", "reload"].include?(command) && (!already_provisioned || provision_flag))

Vagrant.require_version ">= 2.4.0"

Vagrant.configure("2") do |config|
  # Naming the machine makes `vagrant ssh-config` print `Host react-ts-starter`, not `Host default`.
  config.vm.define VM_NAME do |vm_config|
    vm_config.vm.box = "bento/ubuntu-24.04"
    vm_config.vm.box_architecture = :auto
    vm_config.vm.hostname = VM_NAME
    # Double Vagrant's default: on Windows Hosts with Hyper-V on, VirtualBox boots far more slowly.
    vm_config.vm.boot_timeout = 600

    vm_config.vm.provider "virtualbox" do |vb|
      vb.cpus = VM_CPUS
      vb.memory = VM_MEMORY_MB
    end

    # No shared folder: the Working Copy is copied in once, below.
    vm_config.vm.synced_folder ".", "/vagrant", disabled: true

    # Bound to the Host's localhost, so the dev server isn't exposed to the Host's network.
    vm_config.vm.network "forwarded_port", guest: DEV_SERVER_PORT, host: DEV_SERVER_PORT, host_ip: "127.0.0.1"

    # Lends the Host's SSH keys to git inside the Dev VM, so `git push` works without copying keys in.
    vm_config.ssh.forward_agent = true

    vm_config.vm.provision "system", type: "shell", inline: <<~SHELL
      set -euo pipefail
      export DEBIAN_FRONTEND=noninteractive

      # Only what the project needs, with no full OS upgrade: run `sudo apt-get upgrade` yourself when you want one.
      apt-get update
      apt-get install -y git curl

      if ! command -v node >/dev/null || ! node --version | grep -q '^v22\\.'; then
        curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
        apt-get install -y nodejs
      fi

      corepack enable

      # Makes Vite listen on all interfaces inside the Dev VM only (read by vite.config.ts).
      # /etc/environment applies to every SSH session, including VS Code Remote-SSH.
      grep -q '^DEV_SERVER_HOST=' /etc/environment || echo 'DEV_SERVER_HOST=0.0.0.0' >> /etc/environment

      # Clear anything a failed earlier run left behind, so the uploads below start clean.
      rm -rf #{COPY_STAGING_DIR} #{COPY_ARCHIVE_UPLOAD} #{HOST_GITCONFIG_UPLOAD}
    SHELL

    if will_provision
      build_copy_archive.call
      vm_config.vm.provision "checkout", type: "file", source: HOST_COPY_ARCHIVE, destination: COPY_ARCHIVE_UPLOAD
    end

    host_gitconfig = File.expand_path("~/.gitconfig")
    if File.exist?(host_gitconfig)
      vm_config.vm.provision "gitconfig", type: "file", source: host_gitconfig, destination: HOST_GITCONFIG_UPLOAD
    end

    vm_config.vm.provision "working-copy", type: "shell", privileged: false, inline: <<~SHELL
      set -euo pipefail

      # First provision only: never overwrite an existing Working Copy.
      if [ ! -d "$HOME/app" ]; then
        if [ ! -f #{COPY_ARCHIVE_UPLOAD} ]; then
          echo 'The Host checkout was not uploaded. Run "vagrant provision" from the Host checkout.' >&2
          exit 1
        fi
        mkdir #{COPY_STAGING_DIR}
        tar -xzf #{COPY_ARCHIVE_UPLOAD} -C #{COPY_STAGING_DIR}
        cd #{COPY_STAGING_DIR}
        COREPACK_ENABLE_DOWNLOAD_PROMPT=0 pnpm install
        # Moved into place only once the install succeeds, so a failed install is retried next provision.
        cd "$HOME"
        mv #{COPY_STAGING_DIR} "$HOME/app"
      fi

      # Never overwrite git config made inside the Dev VM.
      if [ -f #{HOST_GITCONFIG_UPLOAD} ] && [ ! -f "$HOME/.gitconfig" ]; then
        mv #{HOST_GITCONFIG_UPLOAD} "$HOME/.gitconfig"
      fi

      rm -rf #{COPY_STAGING_DIR} #{COPY_ARCHIVE_UPLOAD} #{HOST_GITCONFIG_UPLOAD}
    SHELL
  end
end
