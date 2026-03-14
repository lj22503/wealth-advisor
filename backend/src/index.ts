import express from 'express';
import cors from 'cors';
import { ClientService } from './services/client-service';
import { DiagnosisService } from './services/diagnosis-service';
// import { HoldingService } from './services/holding-service';
import { initDatabase } from './db';

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 服务实例
const clientService = new ClientService();
const diagnosisService = new DiagnosisService();
// const holdingService = new HoldingService();

// 初始化数据库
initDatabase().then(() => {
  console.log('数据库初始化完成');
}).catch(error => {
  console.error('数据库初始化失败:', error);
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 客户管理API
app.get('/api/clients', async (req, res) => {
  try {
    const filter = req.query;
    const clients = await clientService.getClients(filter);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: '获取客户列表失败' });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await clientService.getClient(req.params.id);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: '客户不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '获取客户失败' });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: '创建客户失败' });
  }
});

// 持仓诊断API
app.get('/api/clients/:id/diagnosis', async (req, res) => {
  try {
    const diagnosis = await diagnosisService.diagnoseClient(req.params.id);
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ error: '持仓诊断失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`理财经理投顾系统后端服务运行在 http://localhost:${port}`);
  console.log(`健康检查: http://localhost:${port}/health`);
});