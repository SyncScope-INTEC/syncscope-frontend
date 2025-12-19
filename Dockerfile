# Base image with Node.js
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Accept build arguments for public environment variables
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GATEWAY_URL
ARG NEXT_PUBLIC_DEV_MODE
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG STRIPE_PRICE_STARTER
ARG STRIPE_PRICE_GROWTH
ARG STRIPE_PRICE_ENTERPRISE
ARG STRIPE_SECRET_KEY

# Make them available during build time
ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GATEWAY_URL=$NEXT_PUBLIC_GATEWAY_URL
ENV NEXT_PUBLIC_DEV_MODE=$NEXT_PUBLIC_DEV_MODE
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
ENV STRIPE_PRICE_STARTER=$STRIPE_PRICE_STARTER
ENV STRIPE_PRICE_GROWTH=$STRIPE_PRICE_GROWTH
ENV STRIPE_PRICE_ENTERPRISE=$STRIPE_PRICE_ENTERPRISE
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

# Build Next.js application
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Railway dynamically assigns the PORT, so we don't hardcode it
# EXPOSE directive is just documentation, the app will bind to $PORT
EXPOSE 8080

ENV HOSTNAME="0.0.0.0"

# Stripe secret environment variables (set at runtime via Railway)
# These will be overridden by Railway environment variables


# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
# The PORT environment variable will be provided by Railway
CMD ["node", "server.js"]
