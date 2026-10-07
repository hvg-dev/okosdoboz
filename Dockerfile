FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY shell/package.json shell/package-lock.json ./shell/
RUN npm ci --prefix shell --no-audit --no-fund

COPY shell/ ./shell/
COPY lessons/ ./lessons/

ARG LESSONS_PREFIX=/lessons
RUN LESSONS_PREFIX="${LESSONS_PREFIX}" npm run build --prefix shell \
    && LESSONS_PREFIX="${LESSONS_PREFIX}" npm test --prefix shell

FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:101 /app/shell/dist/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/shell-config.json || exit 1

CMD ["nginx", "-g", "daemon off;"]