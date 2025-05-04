FROM node:20-alpine
WORKDIR /app

# copy only the manifests first
COPY package*.json ./

# regular install (no lock-file needed) & skip dev-deps
RUN npm install --omit=dev          # ☚ reproducible and lighter :contentReference[oaicite:3]{index=3}

COPY proxy.js .
EXPOSE 8080
CMD ["node", "proxy.js"]
