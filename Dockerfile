# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run expects the container to listen on port 8080
# We modify the default configuration to listen on 8080 instead of 80
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Optional: Add try_files $uri /index.html for SPA routing support
# This replaces the default location / block
RUN sed -i '/location \/ {/,/}/c\    location / {\n        root   /usr/share/nginx/html;\n        index  index.html index.htm;\n        try_files $uri $uri/ /index.html;\n    }' /etc/nginx/conf.d/default.conf

# Copy env script for runtime injection
COPY env.sh /
RUN chmod +x /env.sh

EXPOSE 8080

ENTRYPOINT ["/env.sh"]
CMD ["nginx", "-g", "daemon off;"]
