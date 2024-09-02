FROM node:20-alpine3.18 AS builder

WORKDIR /build

COPY package*.json ./

RUN yarn install --forzen-lockfile

COPY . .

COPY .env.production ./.env

RUN yarn build

FROM node:20-alpine3.18 AS runner

WORKDIR /app

# COPY package*.json ./

# COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./.next/public
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package*.json ./

EXPOSE 3000

# CMD [ "top" ]
CMD [ "node","./server.js" ]
