# =============================================================================
# Turborepo公式推奨：turbo prune最適化Dockerfile
# =============================================================================

FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable pnpm && corepack prepare pnpm@10.11.1 --activate

# -----------------------------------------------------------------------------
# Pruner: webアプリに必要なファイルのみを抽出
# -----------------------------------------------------------------------------
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@latest prune web --docker

# -----------------------------------------------------------------------------
# Installer: 依存関係のみインストール（最大限キャッシュ活用）
# -----------------------------------------------------------------------------
FROM base AS installer

# pruneされたlockfileとpackage.jsonのみコピー（高速キャッシュ）
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# pruneされたソースコードをコピーしてビルド
COPY --from=pruner /app/out/full/ .

# リモートキャッシュ設定
ARG TURBO_API
ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_API=$TURBO_API
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM
ENV NODE_ENV=production
ENV TURBO_TELEMETRY_DISABLED=1

# webアプリをビルド（pruneされた依存関係のみ）
RUN pnpm dlx turbo@latest run build --filter=web...

# -----------------------------------------------------------------------------
# Runner: 本番実行環境（最軽量）
# -----------------------------------------------------------------------------
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Next.jsスタンドアロン出力をコピー
COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer /app/apps/web/public ./apps/web/public

EXPOSE 8080
CMD ["apps/web/server.js"]

# =============================================================================
# 【turbo prune最適化の効果】
# ✅ 不要な依存関係を除外（ビルド高速化）
# ✅ lockfileを最適化（node_modules削減）
# ✅ ソースコード変更時のキャッシュ効率最大化
# ✅ 大規模モノレポでの劇的な性能向上
# =============================================================================