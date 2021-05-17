# We use node 12 because knex is not compatible with node v13 and higher. 
FROM node:12.22.1-alpine3.11

ENV PROJECT_FOLDER="DNSServerApp"
ENV DNSMASQ_LOGS_FILE="/root/dnsmasq-logs"
ENV CUSTOM_RESOLV_FILE="/root/resolv-custom.com"

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
ADD start_dnsmasq_and_dnsserver.sh /root/

# we create the logs file for dnsmasq
RUN touch ${DNSMASQ_LOGS_FILE}
RUN touch ${CUSTOM_RESOLV_FILE}

# We need to allow dnsmasq to be able to access the folder
RUN chmod 755 /root/ 

RUN git clone https://github.com/avionic-iot-aviot/DNSServerApp /root/${PROJECT_FOLDER}

RUN cd /root/${PROJECT_FOLDER}/backend && npm install && npm run be:build


WORKDIR /root
CMD [ "/bin/ash", "./start_dnsmasq_and_dnsserver.sh" ]