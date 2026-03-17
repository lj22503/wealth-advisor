#!/bin/bash

# Wealth Advisor 前端开发启动脚本

echo "🚀 启动 Wealth Advisor 前端开发服务器..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
echo "Node.js 版本：$NODE_VERSION"

# 检查依赖
if [ ! -d "node_modules" ]; then
  echo "⚠️  未检测到 node_modules，正在安装依赖..."
  npm install
fi

# 检查环境配置
if [ ! -f ".env.local" ]; then
  echo "⚠️  未检测到 .env.local，从 .env.example 复制..."
  cp .env.example .env.local
  echo "✅ 已创建 .env.local，请根据需要修改配置"
fi

# 启动开发服务器
echo ""
echo "✅ 准备就绪！"
echo "📍 访问地址：http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
