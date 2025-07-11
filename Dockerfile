# This Dockerfile is generated based on sample in the following document
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci
# Install type definitions
RUN npm install --save-dev @types/node @types/react @types/markdown-it

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# 硬编码环境变量，不再依赖构建参数
ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDdgngT2YKtd1jyAloNqFLFRTNr9aty6zA
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=handi-62f09.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=handi-62f09
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=handi-62f09.firebasestorage.app
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=657064704852
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:657064704852:web:269f87d273bc06dff3e6c1
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-TMT9VT26P5
ENV NEXT_PUBLIC_BACKEND_API_URL=https://handi-gpt-backend-657064704852.australia-southeast2.run.app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js