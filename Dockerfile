# syntax=docker/dockerfile:1

# --- Frontend (shell + chat micro-apps) ---
FROM node:22-bookworm-slim AS frontend
WORKDIR /frontend
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
COPY frontend/packages/shell/package.json packages/shell/
COPY frontend/packages/chat-app/package.json packages/chat-app/
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=/
ENV VITE_CHAT_ENTRY=/child/chat/
RUN pnpm run build
RUN mkdir -p /static/shell /static/chat \
    && cp -r packages/shell/dist/* /static/shell/ \
    && cp -r packages/chat-app/dist/* /static/chat/

# --- API ---
FROM python:3.12-slim AS api
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*
COPY pyproject.toml README.md alembic.ini ./
COPY configs ./configs
COPY migrations ./migrations
COPY scripts ./scripts
COPY src ./src
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir .
EXPOSE 8000
CMD ["uvicorn", "src.api.app:app", "--host", "0.0.0.0", "--port", "8000"]

# --- Nginx + static assets ---
FROM nginx:1.27-alpine AS nginx
COPY --from=frontend /static/shell/ /usr/share/nginx/html/
COPY --from=frontend /static/chat/ /usr/share/nginx/html/child/chat/
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
