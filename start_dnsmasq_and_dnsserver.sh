#Setting the iptables masquerade
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

#Setup dnsmasq server
mkdir n2n_hosts_dir
touch n2n_hosts_dir/dhcpserver.agri
echo "$N2N_IP_DNSSERVERAPP dhcpserver.$TENANT_ID" >> n2n_hosts_dir/dhcpserver.agri;
echo "$N2N_IP_DNSSERVERAPP dhcpserver" >> n2n_hosts_dir/dhcpserver.agri;
# dnsmasq --bind-interfaces --no-hosts --hostsdir=./n2n_hosts_dir --listen-address=$N2N_IP_DNSSERVERAPP --dhcp-mac=set:broadtag,*:*:*:*:*:* --dhcp-broadcast=tag:broadtag --dhcp-range=edge0,10.11.0.100,10.11.0.200,5m --domain=$TENANT_ID;

PROJECT_FOLDER="DNSServerApp"

#echo 'Scarico da Github'
#rm -rf $PROJECT_FOLDER
#git clone https://github.com/avionic-iot-aviot/DNSServerApp

echo 'Avvio di deploy e dnsmasq'

# pm2 delete 0
# cd ~/$PROJECT_FOLDER/backend
# npm install
# npm run be:build
# pm2 start ecosystem.config.js && cd ~/ && pm2 startup openrc > pm2_startup_output &&
# tail -n 1 pm2_startup_output > pm2_startup.sh && chmod a+rwx pm2_startup.sh && ./pm2_startup.sh && pm2 save
# pm2 stop 0
# pm2 start 0 & pm2 logs 0

cd ~/$PROJECT_FOLDER/backend && \
pm2 start ecosystem.config.js && \
# dnsmasq --bind-interfaces --no-hosts \
# --hostsdir=./n2n_hosts_dir --listen-address=$N2N_IP_DNSSERVERAPP \
# --dhcp-mac=set:broadtag,*:*:*:*:*:* --dhcp-broadcast=tag:broadtag \
# --dhcp-range=edge0,10.11.0.100,10.11.0.200,5m --domain=$TENANT_ID && \

dnsmasq \
--local-service \
--listen-address=10.11.0.1 \
--dhcp-mac=set:broadtag,*:*:*:*:*:* --dhcp-broadcast=tag:broadtag --dhcp-range=edge0,10.11.0.100,10.11.0.200,5m \
--no-hosts --hostsdir=/root/n2n_hosts_dir \
--no-resolv --local=/$TENANT_ID/127.0.0.1 \
-q --log-facility=$DNSMASQ_LOGS_FILE

sleep infinity

