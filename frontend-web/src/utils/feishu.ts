/**
 * 飞书 SDK 完整集成
 * 包含：身份认证、用户信息、消息通知、环境检测
 */

declare global {
  interface Window {
    Feishu?: any;
    fs?: any;
  }
}

/**
 * 飞书用户信息
 */
export interface FeishuUser {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  mobile?: string;
}

/**
 * 初始化飞书 SDK
 */
export async function initFeishuSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已在飞书环境中
    if (window.Feishu || window.fs) {
      console.log('✅ Feishu SDK already loaded');
      resolve();
      return;
    }

    // 动态加载飞书 JS SDK
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lark-base-open/js-sdk/dist/index.umd.js';
    script.onload = () => {
      console.log('✅ Feishu SDK loaded');
      resolve();
    };
    script.onerror = () => {
      console.warn('⚠️ Failed to load Feishu SDK, using mock mode');
      resolve(); // 即使加载失败也继续（开发环境）
    };
    document.head.appendChild(script);
  });
}

/**
 * 获取飞书用户信息
 */
export async function getFeishuUserInfo(): Promise<FeishuUser> {
  try {
    await initFeishuSDK();

    // 尝试调用飞书 API
    if (window.Feishu && window.Feishu.api) {
      const userInfo = await window.Feishu.api.getUserInfo();
      return {
        userId: userInfo.user_id || userInfo.userId,
        name: userInfo.name || userInfo.nick_name,
        email: userInfo.email || '',
        avatar: userInfo.avatar || '',
        department: userInfo.department || '',
        mobile: userInfo.mobile || '',
      };
    }

    // 开发环境返回模拟数据
    if (import.meta.env.VITE_ENV === 'development') {
      return {
        userId: 'dev_user_001',
        name: '开发用户',
        email: 'dev@example.com',
        avatar: '',
        department: '技术部',
        mobile: '138****0000',
      };
    }

    throw new Error('Feishu SDK not available');
  } catch (error) {
    console.error('❌ Failed to get Feishu user info:', error);
    throw error;
  }
}

/**
 * 检查是否在飞书环境中
 */
export function isInFeishu(): boolean {
  const ua = navigator.userAgent;
  return /Feishu/i.test(ua) || /Lark/i.test(ua) || !!(window.Feishu || window.fs);
}

/**
 * 在飞书中打开链接
 */
export function openInFeishu(url: string, options?: { external?: boolean }): void {
  if (window.Feishu && window.Feishu.api && window.Feishu.api.openLink) {
    window.Feishu.api.openLink({ 
      url, 
      external: options?.external || false 
    });
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

/**
 * 发送飞书消息
 */
export async function sendFeishuMessage(
  userId: string, 
  content: string, 
  type: 'text' | 'post' = 'text'
): Promise<void> {
  try {
    await initFeishuSDK();

    if (window.Feishu && window.Feishu.api && window.Feishu.api.sendMessage) {
      await window.Feishu.api.sendMessage({
        userId,
        msgType: type,
        content: type === 'text' ? { text: content } : content,
      });
    } else {
      console.warn('Feishu SDK not available, message not sent');
    }
  } catch (error) {
    console.error('Failed to send Feishu message:', error);
    throw error;
  }
}

/**
 * 显示飞书通知
 */
export function showFeishuNotification(
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): void {
  if (window.Feishu && window.Feishu.api && window.Feishu.api.showNotification) {
    window.Feishu.api.showNotification({
      title,
      message,
      type,
    });
  } else {
    // 降级到浏览器通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️',
      });
    } else {
      console.log(`${title}: ${message}`);
    }
  }
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notifications permission denied');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * 获取飞书应用配置
 */
export function getFeishuAppConfig() {
  return {
    appId: import.meta.env.VITE_FEISHU_APP_ID || '',
    appSecret: import.meta.env.VITE_FEISHU_APP_SECRET || '',
    redirectUri: import.meta.env.VITE_FEISHU_REDIRECT_URI || window.location.origin,
  };
}

/**
 * 飞书 OAuth 登录
 */
export async function feishuOAuthLogin(): Promise<string> {
  const config = getFeishuAppConfig();
  
  if (!config.appId) {
    throw new Error('Feishu App ID not configured');
  }

  const authUrl = `https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=${config.appId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&state=login`;
  
  // 在飞书环境中直接跳转
  if (isInFeishu()) {
    openInFeishu(authUrl, { external: true });
  } else {
    window.location.href = authUrl;
  }

  // 等待回调（实际应用中需要在回调页面处理）
  return new Promise((resolve) => {
    // 这里简化处理，实际应用需要监听回调
    resolve('');
  });
}

/**
 * 刷新飞书访问令牌
 */
export async function refreshFeishuToken(refreshToken: string): Promise<string> {
  // 实际应用中需要调用后端 API 刷新令牌
  console.log('Refreshing Feishu token...');
  return Promise.resolve('new_access_token');
}

/**
 * 登出飞书
 */
export function feishuLogout(): void {
  if (window.Feishu && window.Feishu.api && window.Feishu.api.logout) {
    window.Feishu.api.logout();
  } else {
    // 清除本地状态
    localStorage.removeItem('feishu_token');
    localStorage.removeItem('feishu_user');
  }
}
