FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi
# RUN yarn --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1
ARG MONGO_URL=18.01

ENV MONGO_URL $MONGO_URL
RUN echo $MONGO_URL

ARG HOST_NAME=https://teslo-shop.pelsmi11.website

ENV HOST_NAME $HOST_NAME
RUN echo $HOST_NAME


ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID=AXBkCWUN37KBY8A_Eg8isVWRYCl3INxAEIRZ3CkuasNReY410trintdb8f62UR1DWgR_Qq1JqVy-S57z

ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID $NEXT_PUBLIC_PAYPAL_CLIENT_ID
RUN echo $NEXT_PUBLIC_PAYPAL_CLIENT_ID

ARG PAYPAL_SECRET=18.01

ENV PAYPAL_SECRET $PAYPAL_SECRET
RUN echo $PAYPAL_SECRET

ARG PAYPAL_OAUTH_URL=https://api-m.sandbox.paypal.com/v1/oauth2/token

ENV PAYPAL_OAUTH_URL $PAYPAL_OAUTH_URL
RUN echo $PAYPAL_OAUTH_URL

ARG PAYPAL_ORDERS_URL=https://api.sandbox.paypal.com/v2/checkout/orders

ENV PAYPAL_ORDERS_URL $PAYPAL_ORDERS_URL
RUN echo $PAYPAL_ORDERS_URL

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]