/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker用のstandalone出力を有効化
  // 本番環境で必要最小限のファイルのみを含む軽量版を生成
  output: 'standalone',
}

export default nextConfig
