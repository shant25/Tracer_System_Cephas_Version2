# Multi-stage build to minimize attack surface
# Stage 1: Build dependencies
FROM node:lts-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Stage 2: Runtime with minimal footprint
FROM gcr.io/distroless/nodejs:18

# Copy from builder stage
WORKDIR /app
COPY --from=builder /app /app

# Set environment variable defaults
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]