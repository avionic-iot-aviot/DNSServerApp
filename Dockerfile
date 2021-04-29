# We use node 12 because knex is not compatible with node v13 and higher. 
FROM node:12.22.1-alpine3.11

ENV PROJECT_FOLDER="DNSServerApp"

RUN apk update
RUN apk add nano
RUN apk add iputils
RUN apk add redis
RUN apk add bridge-utils
RUN apk add autoconf
RUN apk add g++ make libressl-dev
RUN apk add net-tools
RUN apk add xz
RUN apk add tcpdump
RUN apk add unzip
RUN apk add git
RUN apk add alien libaio unixodbc
RUN apk add curl
RUN apk add python3 

RUN npm install -g typescript
RUN npm install pm2 -g
RUN npm install knex -g

RUN apk add openrc
RUN apk add iptables

RUN apk add dnsmasq

RUN git clone https://github.com/avionic-iot-aviot/DNSServerApp /root/${PROJECT_FOLDER}


COPY ["start_dnsmasq_and_dnsserver.sh" , "/root/"]

WORKDIR /root
CMD [ "/bin/ash", "./start_dnsmasq_and_dnsserver.sh" ]