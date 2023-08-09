FROM node:18

WORKDIR /fitwaydb
COPY package.json .
RUN npm install

COPY . .
CMD npm start 