#!/bin/bash

# Wealth Advisor 前端部署脚本（Vercel）

set -e

echo "🚀 开始部署到 Vercel..."

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "⚠️  Vercel CLI 未安装，正在安装..."
  npm install -g vercel
fi

# 检查登录状态
echo "🔐 检查 Vercel 登录状态..."
vercel whoami || {
  echo "❌ 未登录 Vercel，请先运行：vercel login"
  exit 1
}

# 构建
echo "📦 构建生产版本..."
npm run build

# 部署
echo "🌐 部署到 Vercel..."
vercel deploy --prod

echo "✅ 部署完成！"
