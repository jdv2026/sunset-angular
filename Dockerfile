# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG APP_VERSION=dev
RUN sed -i "s/version: '[^']*'/version: '${APP_VERSION}'/g" src/environments/environment.ts

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app
COPY --from=builder /app/dist/vex /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
