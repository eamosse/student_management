FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
USER node

EXPOSE 5000
CMD ["node", "server.js"]