# Builder Image
# =============
# Download tools, install and compile dependencies.
FROM node:10.21.0-alpine as builder

WORKDIR /usr/src/app

# Create non-privileged psychoquiz user & group.
RUN addgroup -S psychoquiz && \
    adduser -S -G psychoquiz psychoquiz && \
    chown psychoquiz:psychoquiz /usr/src/app

USER psychoquiz:psychoquiz

# Install dependencies.
COPY --chown=psychoquiz:psychoquiz package.json package-lock.json /usr/src/app/
RUN npm ci

# Make a static build.
COPY --chown=psychoquiz:psychoquiz ./ /usr/src/app/
RUN ./node_modules/@angular/cli/bin/ng build --env=prod -prod -aot

# Production Image
# ================
FROM nginx:1.19.0-alpine

WORKDIR /usr/src/app

# Create non-privileged psychoquiz user & group.
RUN addgroup -S psychoquiz && \
    adduser -S -G psychoquiz psychoquiz && \
    chown psychoquiz:psychoquiz /usr/src/app

COPY nginx.conf /etc/nginx/nginx.conf

COPY --chown=psychoquiz:psychoquiz --from=builder /usr/src/app/dist/ /usr/src/app/
