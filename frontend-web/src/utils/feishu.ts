/**
 * 飞书 SDK 集成工具
 */

// 飞书 JS SDK 类型定义
declare global {
  interface Window {
    Feishu?: any;
  }
}

/**
 * 初始化飞书 SDK
 */
export async function initFeishuSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已在飞书环境中
    if (window.Feishu) {
      console.log('Feishu SDK already loaded');
      resolve();
    } else {
      // 动态加载飞书 JS SDK
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lark-base-open/js-sdk/dist/index.umd.js';
      script.onload = () => {
        console.log('Feishu SDK loaded');
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Feishu SDK'));
      };
      document.head.appendChild(script);
    }
  });
}

/**
 * 获取飞书用户信息
 */
export async function getFeishuUserInfo(): Promise<any> {
  try {
    // 等待 SDK 初始化
    await initFeishuSDK();
    
    // 调用飞书 API 获取用户信息
    // 注意：实际使用时需要根据飞书 SDK 文档调用正确的 API
    if (window.Feishu && window.Feishu.api) {
      const userInfo = await window.Feishu.api.getUserInfo();
      return userInfo;
    }
    
    // 开发环境返回模拟数据
    if (import.meta.env.VITE_ENV === 'development') {
      return {
        userId: 'dev_user_001',
        name: '开发用户',
        email: 'dev@example.com',
        avatar: '',
      };
    }
    
    throw new Error('Feishu SDK not available');
  } catch (error) {
    console.error('Failed to get Feishu user info:', error);
    throw error;
  }
}

/**
 * 检查是否在飞书环境中
 */
export function isInFeishu(): boolean {
  // 通过 User-Agent 判断
  const ua = navigator.userAgent;
  return /Feishu/i.test(ua) || /Lark/i.test(ua);
}

/**
 * 在飞书中打开链接
 */
export function openInFeishu(url: string): void {
  if (window.Feishu && window.Feishu.api && window.Feishu.api.openLink) {
    window.Feishu.api.openLink({ url });
  } else {
    window.open(url, '_blank');
  }
}

/**
 * 关闭飞书窗口
 */
export function closeFeishuWindow(): void {
  if (window.Feishu && window.Feishu.api && window.Feishu.api.closeWindow) {
    window.Feishu.api.closeWindow();
  } else {
    window.close();
  }
}
