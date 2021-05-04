module.exports = {
    apps: [
        {
            name: "dnsserverapp",
            script: "./dist/main.js",
            watch: true,
            instance_var: 'INSTANCE_ID',
            env: {
                "NODE_ENV": "staging"
            }
        }
    ]
}