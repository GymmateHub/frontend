# Multi-stage build for React/Vite application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build arguments and environment variables
ARG VITE_API_URL=https://api.gymmatehub.com/api
ENV VITE_API_URL=$VITE_API_URL

# Ensure .env.production is used for Docker build
RUN if [ -f .env.production ]; then cp .env.production .env; fi

# Build the application
RUN npm run build

# Runtime stage with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
