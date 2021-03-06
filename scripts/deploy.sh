PROJECT_FOLDER="$DNSServerApp"
DB_NAME="$staging.sqlite3"
ENV_FILE="$.env.staging"
cd ~/
if [ ! -d $PROJECT_FOLDER ] ; then
echo 'NOT Exists'
else
echo 'Already Exists'
pm2 stop dnsserverapp
mv ~/DNSServerApp/backend/src/db/staging.sqlite3 ~/staging.sqlite3
mv ~/DNSServerApp/backend/env/.env.staging ~/.env.staging

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



cd ~/
if [ -f staging.sqlite3 ] ; then
echo 'Move DB'
mv ~/staging.sqlite3 ~/DNSServerApp/backend/src/db/staging.sqlite3
else
echo 'missing DB file, will create empty one'
fi

if [ -f .env.staging ] ; then
 echo 'Move env file'
 mv ~/.env.staging ~/DNSServerApp/backend/env/.env.staging
else
 echo 'missing env file, please create one, using example.env. EXITING'
 exit 1 
fi

cd ~/DNSServerApp/backend;
NODE_ENV=staging pm2 start dist/main.js --name "dnsserverapp" && cd ~/ && pm2 startup > pm2_startup_output;
tail -n 1 pm2_startup_output > pm2_startup.sh && chmod u+rwx pm2_startup.sh && ./pm2_startup.sh && pm2 save

cd ~/DNSServerApp/backend;
echo 'Migration'
NODE_ENV=staging knex migrate:latest
NODE_ENV=staging npm run execute:seeds

