/**
 * 错误处理工具
 */

/**
 * 错误代码枚举
 */
export enum ErrorCode {
  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // 数据库错误
  DATABASE_ERROR = 'DATABASE_ERROR',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  
  // 业务错误
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_TRANSACTION = 'INVALID_TRANSACTION',
  FUND_NOT_AVAILABLE = 'FUND_NOT_AVAILABLE',
  
  // 文件处理错误
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  FILE_PARSE_ERROR = 'FILE_PARSE_ERROR',
  FILE_SIZE_EXCEEDED = 'FILE_SIZE_EXCEEDED',
  
  // 网络错误
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // 配置错误
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  ENVIRONMENT_ERROR = 'ENVIRONMENT_ERROR'
}

/**
 * 自定义应用错误类
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: any;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    code: ErrorCode,
    message: string,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    
    // 保持正确的原型链
    Object.setPrototypeOf(this, AppError.prototype);
    
    // 捕获堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * 转换为JSON格式
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      isOperational: this.isOperational,
      stack: this.stack
    };
  }

  /**
   * 转换为字符串
   */
  toString() {
    return `[${this.code}] ${this.message}`;
  }
}

/**
 * 验证错误类
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.VALIDATION_ERROR, message, details);
    this.name = 'ValidationError';
  }
}

/**
 * 未找到错误类
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `${resource} "${id}" 不存在`
      : `${resource} 不存在`;
    
    super(ErrorCode.NOT_FOUND, message, { resource, id });
    this.name = 'NotFoundError';
  }
}

/**
 * 数据库错误类
 */
export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.DATABASE_ERROR, message, details);
    this.name = 'DatabaseError';
  }
}

/**
 * 授权错误类
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权访问') {
    super(ErrorCode.UNAUTHORIZED, message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 禁止访问错误类
 */
export class ForbiddenError extends AppError {
  constructor(message: string = '禁止访问') {
    super(ErrorCode.FORBIDDEN, message);
    this.name = 'ForbiddenError';
  }
}

/**
 * 文件处理错误类
 */
export class FileError extends AppError {
  constructor(code: ErrorCode, message: string, details?: any) {
    super(code, message, details);
    this.name = 'FileError';
  }
}

/**
 * 网络错误类
 */
export class NetworkError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.NETWORK_ERROR, message, details);
    this.name = 'NetworkError';
  }
}

/**
 * 错误处理工具函数
 */

/**
 * 检查是否为应用错误
 */
export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

/**
 * 检查是否为操作错误（可恢复）
 */
export function isOperationalError(error: any): boolean {
  return isAppError(error) && error.isOperational;
}

/**
 * 将未知错误转换为应用错误
 */
export function normalizeError(error: any): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      ErrorCode.UNKNOWN_ERROR,
      error.message,
      { originalError: error },
      false
    );
  }

  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    String(error),
    { originalError: error },
    false
  );
}

/**
 * 创建错误响应
 */
export function createErrorResponse(error: any) {
  const normalizedError = normalizeError(error);
  
  return {
    success: false,
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
      details: normalizedError.details,
      timestamp: normalizedError.timestamp.toISOString()
    }
  };
}

/**
 * 断言函数
 */
export function assert(condition: any, message: string, code: ErrorCode = ErrorCode.VALIDATION_ERROR): asserts condition {
  if (!condition) {
    throw new AppError(code, message);
  }
}

/**
 * 断言非空
 */
export function assertNotNull<T>(value: T | null | undefined, message: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, message);
  }
}

/**
 * 断言字符串非空
 */
export function assertNotEmpty(value: string, message: string): asserts value is string {
  if (!value || value.trim().length === 0) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, message);
  }
}

/**
 * 断言数字范围
 */
export function assertNumberRange(value: number, min: number, max: number, message: string): void {
  if (value < min || value > max) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, message);
  }
}

/**
 * 错误处理器中间件
 */
export function errorHandler(err: any, req: any, res: any, next: any) {
  const error = normalizeError(err);
  
  // 记录错误日志
  console.error(`[${error.timestamp.toISOString()}] ${error.code}: ${error.message}`);
  if (error.details?.originalError?.stack) {
    console.error('原始错误堆栈:', error.details.originalError.stack);
  }
  
  // 设置HTTP状态码
  let statusCode = 500;
  switch (error.code) {
    case ErrorCode.VALIDATION_ERROR:
      statusCode = 400;
      break;
    case ErrorCode.UNAUTHORIZED:
      statusCode = 401;
      break;
    case ErrorCode.FORBIDDEN:
      statusCode = 403;
      break;
    case ErrorCode.NOT_FOUND:
      statusCode = 404;
      break;
    case ErrorCode.DUPLICATE_ENTRY:
    case ErrorCode.CONSTRAINT_VIOLATION:
      statusCode = 409;
      break;
    default:
      statusCode = 500;
  }
  
  // 发送错误响应
  res.status(statusCode).json(createErrorResponse(error));
}

/**
 * 异步错误包装器
 */
export function asyncHandler(fn: Function) {
  return function(req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}