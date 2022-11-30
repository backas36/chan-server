FROM node:16

WORKDIR /usr/src/chan-server

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]