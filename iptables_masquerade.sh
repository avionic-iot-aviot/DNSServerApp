iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sleep infinity