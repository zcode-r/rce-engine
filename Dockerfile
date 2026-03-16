FROM alpine:latest
RUN apk add --no-cache python3 g++

WORKDIR /app
RUN adduser -D runner
USER runner