# Base image with Node.js LTS and OpenJDK for OpenAPI Generator CLI
FROM node:26-bookworm-slim

# Install OpenJDK 17, Python 3, Git, and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jre-headless \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Set working directory
WORKDIR /workspace

# Copy package manifests first for efficient caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Install workspace dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy repository source
COPY . .

# Default command: validate and lint specifications
CMD ["pnpm", "run", "lint:openapi"]
