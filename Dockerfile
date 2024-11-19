FROM public.ecr.aws/docker/library/node:lts-alpine AS builder

WORKDIR /app

COPY ./src ./src

COPY ./common-proto ./common-proto

COPY package*.json tsconfig*.json nest-cli*.json ./

RUN npm install

RUN npm run build

FROM public.ecr.aws/docker/library/node:lts-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

# Copy env file for local containers
COPY .env ./

RUN chown node:node ./

USER node

ENV PORT=50051

EXPOSE 50051

ENTRYPOINT ["node","./dist/main"]