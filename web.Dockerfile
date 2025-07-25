FROM node:18-alpine

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copy package files with proper ownership and read-only permissions
COPY --chown=nodeuser:nodejs package*.json ./

# Install dependencies with --ignore-scripts for security and set read-only permissions
RUN chmod 444 package*.json && \
    npm ci --only=production --ignore-scripts

# Copy source code with proper ownership, excluding sensitive files
COPY --chown=nodeuser:nodejs src/ ./src/

# Set read-only permissions on source files
RUN chmod -R 444 ./src/

# Switch to non-root user
USER nodeuser

EXPOSE 80

CMD ["npm", "start"]
