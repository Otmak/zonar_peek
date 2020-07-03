FROM node:current-slim

WORKDIR /home/apps/zonar/zpeek
COPY package.json .
RUN npm install

CMD ["npm", "start"]
COPY . .

