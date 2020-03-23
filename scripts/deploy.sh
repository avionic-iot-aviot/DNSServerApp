PROJECT_FOLDER="$DNSServerApp"

if [ ! -d PROJECT_FOLDER ] ; then
    git clone https://github.com/avionic-iot-aviot/DNSServerApp.git
else
echo 'Already Exists'
fi
# cd DNSServerApp/backend/;
# npm install
# npm run be:build
# NODE_ENV=staging npm run be:start:dev
