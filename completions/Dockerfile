# --- Create a smaller production image ---
FROM node:21-alpine AS builder
WORKDIR /app
# Copy only the built artifacts from the builder stage
COPY mcp-tools-server/src ./src
COPY mcp-tools-server/package* .
# RUN npm install
# RUN npm run build

# immitate build whilst no internet connection available
COPY mcp-tools-server/node_modules ./node_modules
COPY mcp-tools-server/build ./build

FROM python:3.11-slim
WORKDIR /app
RUN pip install mcpo uv

# Copy app from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package* .

# Install Node.js 21 directly in Python container (more reliable)
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_21.x | bash - \
    && apt-get install -y nodejs=21.* \
    && rm -rf /var/lib/apt/lists/*

# # Expose the port the app listens on
EXPOSE 8000
 
CMD ["uvx", "mcpo", "--host", "0.0.0.0", "--port", "8000", "--", "node", "./build/mcp-server-stdio.js"]