# -*- mode: ruby -*-
# vi: set ft=ruby :

$private_ip       = '192.168.33.10'
$hostname         = 'wp-framework-site'
$hostname_alias   = 'wp-framework.local'

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/xenial64"

  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true
  config.hostmanager.ignore_private_ip = false
  config.hostmanager.include_offline = true
  config.vm.define $hostname do |node|
    node.vm.provision :shell, :path => "scripts/provision.sh"
    node.vm.hostname = $hostname
    node.vm.network :private_network, ip: $private_ip
    node.hostmanager.aliases = $hostname_alias
  end

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder ".", "/vagrant", nfs: true

  # Use vagrant-bindfs to re-mount folder
  config.bindfs.bind_folder "/vagrant", "/vagrant", :owner => 'ubuntu', :group => 'ubuntu'

  config.vm.provider "virtualbox" do |v|
    host = RbConfig::CONFIG['host_os']

    # Give VM 1/4 system memory & access to all cpu cores on the host
    cpus = `sysctl -n hw.ncpu`.to_i
    # sysctl returns Bytes and we need to convert to MB
    mem = `sysctl -n hw.memsize`.to_i / 1024 / 1024 / 4

    v.customize ["modifyvm", :id, "--memory", mem]
    v.customize ["modifyvm", :id, "--cpus", cpus]
    v.name = $hostname
  end

  # Restart PHP and nginx after up to make sure symlinked config files are read
  config.trigger.after [:up, :reload] do
    run_remote "service php7.0-fpm restart && service nginx restart"
  end

end
