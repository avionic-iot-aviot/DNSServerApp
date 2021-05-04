// config.js
module.exports = {
  env: {
    envFilename: `.env.development`
  },
  general: {
    appName: "DNSServerAPP",
    environment: process.env.NODE_ENV || "development",
    port: process.env.APP_PORT || 3880,
    restClientTimeout: 10000
  },
  arp: {
    interface: "en0",
    entry_interface: "ifname",
    check_file: "arp_object"
  },
  default_tenant: "edge0",
  jwt: {
    expiresIn: "1h",
    jwtSecret: "vtDnSsRVrai"
  },
  general: {
    ipDnsServer: process.env.IPDNSSERVER,
    hostsFolder: "~/n2n_hosts_dir"
  }
};
