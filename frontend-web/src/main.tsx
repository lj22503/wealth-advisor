import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import App from './App';
import './index.css';

// 配置 Arco Design 主题
const arcoTheme = {
  // 可以在这里自定义主题色
  // primaryColor: '#165dff',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={arcoTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
