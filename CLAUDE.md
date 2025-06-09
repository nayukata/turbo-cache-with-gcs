# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このプロジェクトは、TurborepoとGoogle Cloud Storage (GCS)を活用したモノレポ構成のNext.jsアプリケーションです。リモートキャッシュ機能により、ビルド成果物をチーム間で共有し、CI/CDパイプラインを高速化します。

## 開発コマンド

### 基本コマンド（ルートディレクトリで実行）

```bash
# 開発サーバー起動（すべてのアプリ）
pnpm dev

# ビルド
pnpm build

# リント
pnpm lint

# 型チェック
pnpm check-types

# コードフォーマット
pnpm format
```

### 特定アプリのみ操作

```bash
# webアプリのみ開発
pnpm dev --filter=web

# docsアプリのみビルド
pnpm build --filter=docs
```

## アーキテクチャ

### モノレポ構成
- **apps/web**: メインWebアプリケーション（ポート3000）
- **apps/docs**: ドキュメントサイト（ポート3001）
- **packages/**: 共有パッケージ
  - `@repo/ui`: 共有UIコンポーネント
  - `@repo/eslint-config`: ESLint設定
  - `@repo/typescript-config`: TypeScript設定

### リモートキャッシュ構成
- **GCS (Google Cloud Storage)**: キャッシュストレージ
- **Cloud Run**: Turborepoプロキシサーバー
- **GitHub Actions**: CI/CDでキャッシュを活用

### 技術スタック
- **Turborepo**: モノレポ管理、並列ビルド、キャッシュ
- **Next.js 15.3.0**: Reactフレームワーク
- **React 19.1.0**: UIライブラリ
- **TypeScript 5.8.2**: 型安全性
- **pnpm 10.11.1**: 高速パッケージマネージャー

## 開発時の注意点

1. **Server Components優先**: デフォルトでServer Componentsを使用し、必要な場合のみClient Componentsを使用
2. **型安全性**: `any`の使用を避け、厳格な型付けを維持
3. **コード品質**: 関数は10行以内、ネストは3レベル以内を目指す
4. **キャッシュ**: 開発時はキャッシュが無効化されるため、本番環境の動作確認にはビルドが必要

### 必要な環境変数
- `TURBO_API`: プロキシサーバーのURL
- `TURBO_TOKEN`: 認証トークン
- `TURBO_TEAM`: チーム名（デフォルト: turbo-demo）