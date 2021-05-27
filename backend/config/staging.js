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
    path_to_watch: "/var/lib/misc/dnsmasq.leases"
  },
  general: {
    ipDnsServer: process.env.IPDNSSERVER,
    ipBackend: process.env.IPDBAPP,
    portBackend: "4000",
    portGwApp: "3800",
    hostsFolder: "/root/n2n_hosts_dir"
  },
  static_ips: {
    "10.11.0.2": "roscore",
    "10.11.0.3": "janus",
    "10.11.0.4": "rosnodejs",
    "10.11.0.5": "mlvpn"
  }
};