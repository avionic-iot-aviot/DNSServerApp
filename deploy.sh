#Setting the iptables masquerade
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

#PROJECT_FOLDER="DNSServerApp"

#echo 'Scarico da Github'
#rm -rf $PROJECT_FOLDER
#git clone https://github.com/avionic-iot-aviot/DNSServerApp

echo 'Avvio di deploy'

pm2 delete 0
cd ~/$PROJECT_FOLDER/backend
npm install
npm run be:build
cd ~/$PROJECT_FOLDER/backend
cat << EOF > ecosystem.config.js
module.exports = {
  apps : [
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
EOF
pm2 start ecosystem.config.js && cd ~/ && pm2 startup openrc > pm2_startup_output &&
tail -n 1 pm2_startup_output > pm2_startup.sh && chmod a+rwx pm2_startup.sh && ./pm2_startup.sh && pm2 save
pm2 stop 0
pm2 start 0 & pm2 logs 0

