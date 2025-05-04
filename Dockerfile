FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production         # use install, not ci, so lockfile isn’t required
COPY . .
EXPOSE 8080
CMD ["node","server.js"]
