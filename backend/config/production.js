// config.js
module.exports = {
  env: {
    envFilename: `.env.production`
  },
  arp: {
    interface: "edge0",
    entry_interface: "iface"
  },
  watcher: {
    path_to_watch: "/var/lib/misc/dnsmasq.leases"
  }
};
