import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ClientListPage from '@/pages/ClientListPage';
import ClientDetailPage from '@/pages/ClientDetailPage';
import HoldingDiagnosisPage from '@/pages/HoldingDiagnosisPage';
import ReportPage from '@/pages/ReportPage';
import SettingsPage from '@/pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 首页 */}
          <Route index element={<HomePage />} />
          
          {/* 客户管理 */}
          <Route path="clients" element={<ClientListPage />} />
          <Route path="clients/:clientId" element={<ClientDetailPage />} />
          
          {/* 持仓诊断 */}
          <Route path="diagnosis" element={<HoldingDiagnosisPage />} />
          
          {/* 报告 */}
          <Route path="reports" element={<ReportPage />} />
          
          {/* 设置 */}
          <Route path="settings" element={<SettingsPage />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
