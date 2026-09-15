# Build Stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
# We expect variables like VITE_API_URL to be passed as build args or env vars
RUN npm run build

# We will not run the Nginx proxy here; 
# We'll map the dist folder to the main reverse proxy in docker-compose
CMD ["echo", "Client built!"]
