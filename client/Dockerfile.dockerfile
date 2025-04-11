# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Add package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Update packages and clean cache
RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash && \
    rm -rf /var/cache/apk/*

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Provide a basic security-focused nginx configuration 
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Make sure the config directory exists (create a placeholder if you don't have one)
RUN mkdir -p /etc/nginx/conf.d/

# Create a default security-enhanced nginx config if none exists
RUN if [ ! -f /etc/nginx/conf.d/default.conf ]; then \
    echo 'server { \
    listen 80; \
    server_name _; \
    server_tokens off; \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    root /usr/share/nginx/html; \
    index index.html; \
    # Security headers \
    add_header X-Content-Type-Options "nosniff"; \
    add_header X-XSS-Protection "1; mode=block"; \
    add_header X-Frame-Options "SAMEORIGIN"; \
    add_header Content-Security-Policy "default-src '\''self'\''; connect-src '\''self'\'' '\'${REACT_APP_API_URL}'\''"; \
    # Handle React Router \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 30d; \
        add_header Cache-Control "public, no-transform"; \
    } \
}' > /etc/nginx/conf.d/default.conf; \
fi

# Create a non-root nginx user
RUN adduser -D -u 1000 -g 'nginx' nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]