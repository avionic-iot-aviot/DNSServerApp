#Setting the iptables masquerade
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

#Setting up MAC env
echo "export MAC_ADDRESS_DNSSERVERAPP=\"$(ifconfig edge0 | grep 'HWaddr ' | awk '{ print $5}')\"" >> /etc/profile;
. /etc/profile

#Setup dnsmasq server
mkdir n2n_hosts_dir
touch n2n_hosts_dir/dhcpserver.$TENANT_ID
echo "$N2N_IP_DNSSERVERAPP dhcpserver.$TENANT_ID" >> n2n_hosts_dir/dhcpserver.agri;
echo "$N2N_IP_DNSSERVERAPP dhcpserver" >> n2n_hosts_dir/dhcpserver.agri;

echo "nameserver 127.0.0.1" >> ${CUSTOM_RESOLV_FILE}
echo $(head -n 1 /etc/resolv.conf) >> ${CUSTOM_RESOLV_FILE}
echo "domain ${TENANT_ID}" >> ${CUSTOM_RESOLV_FILE}

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

dnsmasq \
--local-service \
--listen-address=10.11.0.1 \
--dhcp-mac=set:broadtag,*:*:*:*:*:* --dhcp-broadcast=tag:broadtag --dhcp-range=edge0,10.11.0.100,10.11.0.200,2m \
--no-hosts --hostsdir=/root/n2n_hosts_dir \
--no-resolv --resolv-file=$CUSTOM_RESOLV_FILE \
--server=1.1.1.1 \
--domain-needed --bogus-priv \
--domain=$TENANT_ID --local=/$TENANT_ID/ \
-q --log-facility=$DNSMASQ_LOGS_FILE;

sleep infinity

