// config.js
module.exports = {
    env: {
        envFilename: `.env.development`
    },
    general: {
        appName: 'DNSServerAPP',
        environment: process.env.NODE_ENV || 'development',
        port: process.env.APP_PORT || 3800,
        restClientTimeout: 10000
    },
    arp: {
        interface: 'en0'
    }     
};