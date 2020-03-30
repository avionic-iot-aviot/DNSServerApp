PROJECT_FOLDER="$DNSServerApp"
DB_NAME="$staging.sqlite3"

if [ ! -d $PROJECT_FOLDER ] ; then
echo 'NOT Exists'
else
echo 'Already Exists'
pm2 stop dnsserverapp
mv ~/DNSServerApp/backend/src/db/staging.sqlite3 ~/$DB_NAME
sudo rm -rf ~/DNSServerApp
fi

git clone https://github.com/avionic-iot-aviot/DNSServerApp.git
cd ~/


cd ~/DNSServerApp/frontend;
npm install
npm run build
cd ~/DNSServerApp/backend;
npm install
npm run be:build
cd ~/DNSServerApp/frontend
npm install
npm run build
cd ~/DNSServerApp/backend
if [ -f $DB_NAME ] ; then
echo 'Move DB'
mv ~/$DB_NAME ~/DNSServerApp/backend/src/db/staging.sqlite3
fi

echo 'Migration'
NODE_ENV=staging knex migrate:latest
NODE_ENV=staging npm run execute:seeds
NODE_ENV=staging pm2 start dist/main.js --name "dnsserverapp" && cd ~/ && pm2 startup > pm2_startup_output;
tail -n 1 pm2_startup_output > pm2_startup.sh && chmod u+rwx pm2_startup.sh && ./pm2_startup.sh && pm2 save
