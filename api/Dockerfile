FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm run prisma:generate

# Build the application
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install production dependencies only
RUN pnpm install --prod

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
# Copy Prisma generated files - entire node_modules to ensure all generated files are included
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3001

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run the application
CMD ["pnpm", "run", "start:prod"] 