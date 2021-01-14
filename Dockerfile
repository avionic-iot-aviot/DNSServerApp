FROM alpine:latest

RUN apk update
RUN apk add nano
RUN apk add iputils
RUN apk add nodejs
RUN apk add redis
RUN apk add bridge-utils
RUN apk add autoconf
RUN apk add g++ make libressl-dev
RUN apk add net-tools
RUN apk add xz
RUN apk add tcpdump
RUN apk add unzip
RUN apk add git
RUN apk add autoconf
RUN apk add net-tools
RUN apk add alien libaio unixodbc
RUN apk add npm
RUN npm install npm@latest -g
RUN node -v
RUN apk add curl
RUN apk add python3 #RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apk add nodejs
RUN node -v
RUN npm install -g typescript
RUN npm install pm2 -g
RUN npm install knex -g

RUN apk add openrc

COPY ["deploy.sh" , "/root/"]

WORKDIR /root
#CMD ["/bin/bash", "./deploy.sh"]
CMD ["sleep", "infinity"]

