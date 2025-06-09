/**
 * 画像情報API - sharpライブラリの詳細情報を返す
 * プラットフォーム固有のnative binaryの動作を確認
 */
import sharp from 'sharp'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // sharpのプラットフォーム情報を取得
    const sharpInfo = {
      // Node.jsプロセス情報
      process: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        pid: process.pid,
      },

      // sharpライブラリ情報
      sharp: {
        version: sharp.versions.sharp,
        libvips: sharp.versions.vips,

        // 利用可能なフォーマット（native依存）
        formats: sharp.format,
      },

      // メタデータ
      meta: {
        timestamp: new Date().toISOString(),
      },
    }

    // 簡単な画像処理テスト（native処理を確実に実行）
    const testImage = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 0, g: 255, b: 0 },
      },
    })
      .resize(5, 5) // リサイズ処理（native処理）
      .png()
      .toBuffer()

    return NextResponse.json({
      ...sharpInfo,
      test: {
        success: true,
        imageSize: testImage.length,
        message: 'ネイティブ画像処理が成功しました',
      },
    })
  } catch (error) {
    console.error('Sharp API error:', error)

    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        },
        process: {
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
        },
        test: {
          success: false,
          message: 'ネイティブ画像処理に失敗しました',
        },
      },
      { status: 500 }
    )
  }
}
