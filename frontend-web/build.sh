#!/bin/bash

# Wealth Advisor 前端生产构建脚本

set -e

echo "🚀 开始构建 Wealth Advisor 前端..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
echo "Node.js 版本：$NODE_VERSION"

# 检查依赖
if [ ! -d "node_modules" ]; then
  echo "⚠️  未检测到 node_modules，正在安装依赖..."
  npm install
fi

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
rm -rf dist

# 构建生产版本
echo "📦 开始构建..."
npm run build

# 检查构建结果
if [ -d "dist" ]; then
  echo "✅ 构建成功！"
  echo ""
  echo "📂 构建文件位置：dist/"
  echo "📊 文件大小:"
  du -sh dist/*
  echo ""
  echo "🚀 部署命令:"
  echo "   # Vercel"
  echo "   vercel deploy --prod"
  echo ""
  echo "   # 自有服务器"
  echo "   scp -r dist/* user@server:/var/www/wealth-advisor"
else
  echo "❌ 构建失败！"
  exit 1
fi
