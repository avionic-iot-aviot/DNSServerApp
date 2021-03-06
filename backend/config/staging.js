// config.js
module.exports = {
  env: {
    envFilename: `.env.staging`
  },
  arp: {
    interface: "edge0",
    entry_interface: "iface"
  },
  watcher_apr: {
    path_to_watch: "/proc/net/arp"
  },
  watcher_leases: {
    path_to_watch: "/var/lib/misc/dnsmasq.leases",
    refresh_time: 30 * 1000, // 30 seconds
  },
  general: {
    ipDnsServer: process.env.IPDNSSERVER,
    ipBackend: process.env.IPDBAPP,
    portBackend: "4000",
    portGwApp: "3800",
    hostsFolder: "/root/n2n_hosts_dir"
  }
};