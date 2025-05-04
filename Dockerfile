FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev          # normal install, no lock-file needed

COPY proxy.js .
EXPOSE 8080
CMD ["node", "proxy.js"]
