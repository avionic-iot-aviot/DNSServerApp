
 #!//bin/ash
 #reboot.sh
sudo /home/ubuntu/n2n/edge -a 10.10.0.1 -s 255.255.255.0 -m 82:c7:cc:4e:cd:ef -c community_aviot -k aviotkey -l 18.188.136.98:7654
sudo /home/ubuntu/dnsmasq-2.80/src/dnsmasq --interface=edge0 --except-interface=lo --bind-interfaces --listen-address=10.10.0.1 --dhcp-option=3 --dhcp-mac=set:broadtag,*:*:*:*:*:* --dhcp-broadcast=tag:broadtag --dhcp-range=edge0,10.10.0.100,10.10.0.200,5m
#cd /home/ubuntu/DNSServerApp/backend/
#NODE_ENV=staging npm run be:start:dev

