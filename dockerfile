FROM node:12.13-alpine

LABEL maintainer="wongbp@gmail.com"

WORKDIR /app/

ADD package.json package.json
RUN npm install

ADD src/ src/
ADD storage/ storage/
ADD docker/startup.sh startup.sh
ADD docker/build-config.js build-config.js

RUN echo $(date +'%Y%m%d-%H%M') > /release

VOLUME /app/storage/

EXPOSE 1883/tcp
EXPOSE 1883/udp

EXPOSE 8883/tcp
EXPOSE 8883/udp

CMD ["sh", "startup.sh"]
