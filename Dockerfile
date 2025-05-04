FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY proxy.js .
EXPOSE 8080
CMD ["node", "proxy.js"]
