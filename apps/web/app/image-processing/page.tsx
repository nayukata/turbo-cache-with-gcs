/**
 * 画像処理ページ - sharpライブラリを使用してnative binaryの動作を検証
 * プラットフォーム固有のキャッシュ管理をテストするためのページ
 */
import sharp from 'sharp';

// サーバーサイドでの画像処理関数
async function processImage(): Promise<{
  platform: string;
  arch: string;
  sharpVersion: string;
  processedAt: string;
  imageBuffer?: Buffer;
}> {
  try {
    // 1x1ピクセルの赤いPNG画像を生成（native処理）
    const imageBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 100, b: 100 }
      }
    })
    .png()
    .toBuffer();

    return {
      platform: process.platform,
      arch: process.arch,
      sharpVersion: sharp.versions.sharp,
      processedAt: new Date().toISOString(),
      imageBuffer
    };
  } catch (error) {
    console.error('Sharp processing error:', error);
    return {
      platform: process.platform,
      arch: process.arch,
      sharpVersion: sharp.versions.sharp,
      processedAt: new Date().toISOString()
    };
  }
}

// React Server Component
export default async function ImageProcessingPage() {
  const result = await processImage();
  
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Sharp ネイティブバイナリ テストページ
      </h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          プラットフォーム情報
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium text-gray-600">プラットフォーム:</span>
            <span className="ml-2 text-gray-800">{result.platform}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium text-gray-600">アーキテクチャ:</span>
            <span className="ml-2 text-gray-800">{result.arch}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium text-gray-600">Sharpバージョン:</span>
            <span className="ml-2 text-gray-800">{result.sharpVersion}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium text-gray-600">処理時刻:</span>
            <span className="ml-2 text-gray-800">{new Date(result.processedAt).toLocaleString('ja-JP')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Sharpネイティブ処理テスト
        </h2>
        <div className="text-gray-600">
          {result.imageBuffer ? (
            <div>
              <p className="mb-3">✅ Sharpがネイティブバイナリを使用して画像処理に成功しました</p>
              <p className="text-sm">100x100 PNG画像を生成しました（{result.imageBuffer.length} バイト）</p>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800">
                  これは、Sharpのネイティブバイナリがこのプラットフォームで正しく動作していることを証明しています。
                  異なるプラットフォーム（macOS、Linux、Windows）では異なるネイティブバイナリが使用され、
                  結果的にTurborepoの異なるキャッシュハッシュが生成されるはずです。
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800">❌ Sharp処理に失敗しました</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">
          キャッシュ検証手順
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>異なるプラットフォーム（macOS、Linux、Windows）でこのプロジェクトをビルドする</li>
          <li>Turborepoキャッシュログで異なるハッシュ値を確認する</li>
          <li>各プラットフォームが独自のキャッシュエントリを生成することを確認する</li>
          <li>ネイティブバイナリが適切に分離されていることを確認する</li>
        </ol>
      </div>
    </div>
  );
}