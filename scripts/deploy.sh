PROJECT_FOLDER="$DNSServerApp"
if [ ! -d PROJECT_FOLDER ] ; then
    git clone https://github.com/avionic-iot-aviot/DNSServerApp.git
    
else
echo 'Already Exists'
fi
cd ~/DNSServerApp/backend;
npm install
npm run be:build
cd ~/DNSServerApp/backend
NODE_ENV=staging pm2 start dist/main.js --name "gatewayapp" && cd ~/ && pm2 startup > pm2_startup_output;
tail -n 1 pm2_startup_output > pm2_startup.sh && chmod u+rwx pm2_startup.sh && ./pm2_startup.sh && pm2 save
