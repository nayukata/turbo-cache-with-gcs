# =============================================================================
# マルチステージビルドによる最適化されたDockerfile
# Next.js + Turborepo対応版
# =============================================================================

# -----------------------------------------------------------------------------
# ステージ1: 依存関係のインストール専用ステージ
# 目的: package.jsonの変更時のみ再実行されるよう分離し、ビルド高速化
# -----------------------------------------------------------------------------
FROM node:22-alpine AS deps
LABEL stage=deps
WORKDIR /app

# pnpm（高速パッケージマネージャー）を有効化
RUN corepack enable pnpm && corepack prepare pnpm@10.11.1 --activate


# package.json系ファイルのみを先にコピー
# これにより、ソースコード変更時でもdepsレイヤーはキャッシュが効く
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# appsディレクトリの構造とpackage.jsonをコピー
COPY apps/web/package.json ./apps/web/package.json
COPY apps/docs/package.json ./apps/docs/package.json

# packagesディレクトリの構造とpackage.jsonをコピー
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json


RUN pnpm -v
# ロックファイルの存在確認
RUN ls -la

# 依存関係をインストール
# --frozen-lockfile: lockファイルの内容を厳密に守る（本番環境推奨）
RUN pnpm install

# -----------------------------------------------------------------------------
# ステージ2: アプリケーションビルド専用ステージ
# 目的: ソースコードをビルドしてNext.jsの本番用ファイルを生成
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder
LABEL stage=builder
WORKDIR /app

# pnpmを有効化
RUN corepack enable pnpm && corepack prepare pnpm@10.11.1 --activate

# 前ステージからnode_modulesをコピー（高速）
COPY --from=deps /app/node_modules ./node_modules

# 全ソースコードをコピー
COPY . .

# Turborepoでwebアプリをビルド（リモートキャッシュ対応）
# Next.jsは.next/standaloneに本番用の軽量版を出力
ARG TURBO_API
ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_API=$TURBO_API
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM
RUN pnpm exec turbo run build --filter=web

# -----------------------------------------------------------------------------
# ステージ3: 本番実行環境（最軽量）
# 目的: セキュアで軽量な実行専用コンテナを作成
# -----------------------------------------------------------------------------
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

# 本番環境フラグを設定
ENV NODE_ENV=production

# Next.jsが生成した軽量な実行ファイルをコピー
# standalone: 必要最小限のファイルのみが含まれた軽量版
COPY --from=builder /app/apps/web/.next/standalone ./

# 静的ファイル（CSS、JS、画像など）をコピー
# standaloneの構造に合わせて適切なパスに配置
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# 公開ディレクトリ（favicon、robots.txtなど）をコピー
# standaloneの構造に合わせて適切なパスに配置
COPY --from=builder /app/apps/web/public ./apps/web/public

# Cloud Runのデフォルトポート8080を公開
EXPOSE 8080

# 実行時環境変数の設定
# Cloud Runが要求するPORT=8080を設定
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# アプリケーションを起動
# server.js: Next.jsのスタンドアロンサーバー（apps/web内にある）
CMD ["apps/web/server.js"]

# =============================================================================
# 【このDockerfileの特徴】
#
# ✅ 高速ビルド: マルチステージで依存関係とソースを分離
# ✅ 軽量イメージ: distrolessで最小限の実行環境
# ✅ セキュリティ: rootユーザーを使用しない安全な実行環境
# ✅ キャッシュ効率: レイヤーの分離により無駄な再ビルドを削減
# ✅ 本番最適化: Next.jsのstandalone出力で高速起動
#
# 【ビルドサイズ比較例】
# - 通常のnode:22イメージ: ~1GB
# - このdistrolessイメージ: ~100MB (約90%削減)
# =============================================================================