/**
 * ID生成器
 */

/**
 * 生成唯一ID
 * @param prefix ID前缀
 * @returns 生成的ID
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * 生成客户ID
 */
export function generateClientId(): string {
  return generateId('client');
}

/**
 * 生成持仓ID
 */
export function generateHoldingId(): string {
  return generateId('holding');
}

/**
 * 生成报告ID
 */
export function generateReportId(): string {
  return generateId('report');
}

/**
 * 生成交易ID
 */
export function generateTransactionId(): string {
  return generateId('tx');
}

/**
 * 生成文件ID（用于上传文件）
 */
export function generateFileId(originalName: string): string {
  const extension = originalName.split('.').pop() || '';
  const name = originalName.replace(`.${extension}`, '').replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  
  return `${name}_${timestamp}_${random}.${extension}`;
}

/**
 * 生成短ID（用于URL等场景）
 */
export function generateShortId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * 生成订单号
 */
export function generateOrderNo(): string {
  const date = new Date();
  const year = date.getFullYear().toString().substring(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `ORD${year}${month}${day}${random}`;
}

/**
 * 生成验证码
 */
export function generateVerificationCode(length: number = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

/**
 * 生成邀请码
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉了容易混淆的字符
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${code.substring(0, 4)}-${code.substring(4)}`;
}

/**
 * 检查ID格式是否有效
 */
export function isValidId(id: string, prefix?: string): boolean {
  if (!id) return false;
  
  if (prefix) {
    if (!id.startsWith(`${prefix}_`)) return false;
  }
  
  // 检查格式：prefix_timestamp_random
  const parts = id.split('_');
  if (parts.length < 3) return false;
  
  // 检查时间戳部分是否为有效的36进制数
  const timestamp = parts[1];
  if (!/^[0-9a-z]+$/i.test(timestamp)) return false;
  
  // 检查随机部分
  const random = parts.slice(2).join('_');
  if (!random || random.length < 4) return false;
  
  return true;
}

/**
 * 从ID中提取时间戳
 */
export function extractTimestampFromId(id: string): number | null {
  try {
    const parts = id.split('_');
    if (parts.length < 2) return null;
    
    const timestampStr = parts[1];
    return parseInt(timestampStr, 36);
  } catch (error) {
    return null;
  }
}

/**
 * 批量生成ID
 */
export function generateBatchIds(prefix: string, count: number): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  
  while (ids.length < count) {
    const id = generateId(prefix);
    if (!seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }
  
  return ids;
}

/**
 * 生成带校验位的ID（防止输入错误）
 */
export function generateIdWithChecksum(prefix: string): string {
  const baseId = generateId(prefix);
  const checksum = calculateChecksum(baseId);
  return `${baseId}_${checksum}`;
}

/**
 * 计算ID的校验和
 */
function calculateChecksum(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  return (sum % 36).toString(36);
}

/**
 * 验证带校验位的ID
 */
export function validateIdWithChecksum(id: string): boolean {
  const parts = id.split('_');
  if (parts.length < 4) return false;
  
  const checksum = parts.pop()!;
  const baseId = parts.join('_');
  const expectedChecksum = calculateChecksum(baseId);
  
  return checksum === expectedChecksum;
}