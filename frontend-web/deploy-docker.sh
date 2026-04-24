#!/bin/bash

# Wealth Advisor 前端部署脚本（Docker）

set -e

echo "🐳 开始 Docker 构建..."

# Docker 镜像名称
IMAGE_NAME="wealth-advisor-frontend"
VERSION="2.0.0"

# 构建 Docker 镜像
echo "📦 构建 Docker 镜像..."
docker build -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest .

echo "✅ Docker 镜像构建完成！"
echo ""
echo "📊 镜像信息:"
docker images | grep ${IMAGE_NAME}
echo ""
echo "🚀 运行容器:"
echo "   docker run -d -p 80:80 ${IMAGE_NAME}:${VERSION}"
echo ""
echo "📤 推送到镜像仓库:"
echo "   docker tag ${IMAGE_NAME}:${VERSION} registry.your-domain.com/${IMAGE_NAME}:${VERSION}"
echo "   docker push registry.your-domain.com/${IMAGE_NAME}:${VERSION}"
