sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y install git
sudo apt -y install autoconf
sudo apt-get -y install build-essential libssl-dev
sudo apt-get -y install net-tools
sudo apt-get -y install xz-utils
sudo apt-get -y npm
git clone --single-branch --branch 2.6-stable https://github.com/ntop/n2n.git
mv n2n ~/n2n
cd ~/n2n
./autogen.sh
./configure
make
cd ../
sudo wget http://www.thekelleys.org.uk/dnsmasq/dnsmasq-2.80.tar.gz
tar -xf dnsmasq-2.80.tar.gz
cd dnsmasq-2.80/
make
npm install npm@latest -g
node -v
npm install -g typescript
npm install pm2 -g
npm install -g knex
# cd ../
#sudo wget https://www.kernel.org/pub/linux/utils/net/bridge-utils/bridge-utils-1.6.tar.xz
#tar -xzf bridge-utils-1.6.tar.xz.tar.gz
#cd bridge-utils-1.6
#autoconf
#./configure
#make
