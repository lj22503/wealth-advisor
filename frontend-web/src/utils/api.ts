import axios from 'axios';
import type { ApiResponse } from '@/types';

// 创建 API 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加飞书身份验证信息
    // const token = getFeishuToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    // 统一错误处理
    if (error.response) {
      // 服务端返回错误
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，跳转登录
          // handleUnauthorized();
          break;
        case 403:
          // 无权限
          // handleForbidden();
          break;
        case 404:
          // 资源不存在
          // handleNotFound();
          break;
        case 500:
          // 服务器错误
          // handleServerError();
          break;
        default:
          // 其他错误
          // handleGenericError(data);
          break;
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('Network Error: No response received');
    } else {
      // 请求配置出错
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
