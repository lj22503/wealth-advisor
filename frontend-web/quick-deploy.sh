#!/bin/bash

# 🚀 一键部署脚本（Vercel）
# 适合完全不懂技术的小白

set -e

echo ""
echo "========================================"
echo "🚀 Wealth Advisor 一键部署脚本"
echo "========================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js："
    echo "  Windows/Mac: 访问 https://nodejs.org 下载安装包"
    echo "  安装完成后重新运行此脚本"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"
echo ""

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm"
    echo "请重新安装 Node.js"
    exit 1
fi

echo "✅ npm 版本：$(npm -v)"
echo ""

# 安装依赖
echo "📦 正在安装依赖..."
npm install --silent

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装完成"
else
    echo "❌ 依赖安装失败"
    echo "请检查网络连接，或手动运行：npm install"
    exit 1
fi

echo ""

# 构建
echo "🏗️  正在构建..."
npm run build --silent

if [ $? -eq 0 ]; then
    echo "✅ 构建完成"
else
    echo "❌ 构建失败"
    echo "请检查错误信息，或手动运行：npm run build"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ 本地构建完成！"
echo "========================================"
echo ""
echo "📂 构建文件位置：dist/"
echo ""
echo "🚀 下一步：部署到 Vercel"
echo ""
echo "方法 1: 使用 Vercel CLI（推荐）"
echo "   1. 安装：npm install -g vercel"
echo "   2. 登录：vercel login"
echo "   3. 部署：vercel deploy --prod"
echo ""
echo "方法 2: 使用 Vercel 网页（最简单）"
echo "   1. 打开：https://vercel.com/new"
echo "   2. 导入你的 GitHub 仓库"
echo "   3. 点击 Deploy"
echo ""
echo "方法 3: 手动上传 dist 文件夹"
echo "   1. 压缩 dist 文件夹为 zip"
echo "   2. 上传到你的服务器"
echo "   3. 用 Nginx 托管"
echo ""
echo "========================================"
echo ""
