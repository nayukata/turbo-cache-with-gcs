#!/bin/bash
# プラットフォーム固有のキャッシュ検証スクリプト

echo "🧪 Turborepo プラットフォーム固有キャッシュ検証"
echo "=================================================="

# 現在のプラットフォーム情報を表示
echo "📋 現在のプラットフォーム情報:"
echo "プラットフォーム: $(uname -s)"
echo "アーキテクチャ: $(uname -m)"
echo "Node.js: $(node --version)"
echo "OS詳細: $(uname -a)"
echo ""

# Sharp ネイティブバイナリの場所を確認
echo "📦 Sharp ネイティブバイナリ情報:"
SHARP_PATH=$(find node_modules -name "*.node" -path "*sharp*" 2>/dev/null | head -5)
if [ -n "$SHARP_PATH" ]; then
    echo "Sharpバイナリを検出:"
    echo "$SHARP_PATH" | while read -r line; do
        echo "  - $line"
        if command -v file >/dev/null 2>&1; then
            echo "    $(file "$line")"
        fi
    done
else
    echo "  Sharp .nodeバイナリが見つかりません"
fi
echo ""

# ビルドを実行してハッシュを確認
echo "🔨 Turborepoでビルド実行中（キャッシュハッシュを観察）..."
echo "環境変数:"
echo "  TURBO_TELEMETRY_DISABLED: ${TURBO_TELEMETRY_DISABLED:-未設定}"
echo "  NODE_ENV: ${NODE_ENV:-未設定}"
echo ""

# verboseモードでビルド実行
pnpm dlx turbo@latest run build --filter=web --verbosity=2 2>&1 | tee build-output.log

echo ""
echo "🔍 ビルドログからハッシュ情報を抽出中..."
# 複数のパターンでハッシュを検索
HASH=$(grep -E "(web#build hash is|web:build.*executing)" build-output.log | grep -o "[a-f0-9]\{16\}" | tail -1)
if [ -n "$HASH" ]; then
    echo "検出されたビルドハッシュ: $HASH"

    # プラットフォーム情報とハッシュを記録
    echo "$(date): $(uname -s)-$(uname -m) -> $HASH" >> platform-hash-log.txt
    echo "プラットフォーム固有のハッシュを platform-hash-log.txt に記録しました"
else
    echo "ビルド出力からハッシュを抽出できませんでした"
fi

echo ""
echo "📊 プラットフォームハッシュ履歴:"
if [ -f platform-hash-log.txt ]; then
    cat platform-hash-log.txt
else
    echo "過去のハッシュ記録が見つかりません"
fi

echo ""
echo "✅ 検証完了!"