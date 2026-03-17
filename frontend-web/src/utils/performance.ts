/**
 * 性能优化工具
 * 包含：懒加载、代码分割、缓存、防抖节流
 */

import { lazy, Suspense, ComponentType } from 'react';

/**
 * 组件懒加载（带错误处理）
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await importFunc();
    } catch (error) {
      // 如果是网络错误，尝试刷新页面
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        window.location.reload();
      }
      throw error;
    }
  });
}

/**
 * 图片懒加载组件
 */
export function LazyImage({ 
  src, 
  alt, 
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZzwvdGV4dD48L3N2Zz4=' 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  placeholder?: string;
}) {
  return (
    <img
      src={placeholder}
      data-src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onLoad={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = target.dataset.src || src;
      }}
    />
  );
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 本地存储缓存
 */
export class Cache<T> {
  private prefix: string;
  private ttl: number; // 缓存时间（毫秒）

  constructor(prefix: string, ttl: number = 5 * 60 * 1000) {
    this.prefix = prefix;
    this.ttl = ttl;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  set(key: string, value: T): void {
    const item = {
      value,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  get(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.getKey(key));
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      // 检查是否过期
      if (now - item.timestamp > this.ttl) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.warn('Cache remove failed:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }
}

/**
 * API 响应缓存
 */
export const apiCache = new Cache<any>('api', 2 * 60 * 1000); // 2 分钟缓存

/**
 * 预加载资源
 */
export function preloadResources(resources: string[]): void {
  resources.forEach((src) => {
    if (src.endsWith('.js')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      document.head.appendChild(link);
    } else if (src.endsWith('.css')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = src;
      document.head.appendChild(link);
    } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/.test(src)) {
      const img = new Image();
      img.src = src;
    }
  });
}

/**
 * 分析页面性能
 */
export function reportWebVitals(onPerfEntry?: (metric: any) => void): void {
  if (window.performance && window.performance.getEntriesByType) {
    const entries = window.performance.getEntriesByType('navigation');
    const navTiming = entries[0] as PerformanceNavigationTiming;

    const metrics = {
      dns: navTiming.domainLookupEnd - navTiming.domainLookupStart,
      tcp: navTiming.connectEnd - navTiming.connectStart,
      ttfb: navTiming.responseStart - navTiming.requestStart,
      domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
      load: navTiming.loadEventEnd - navTiming.fetchStart,
    };

    console.log('📊 Performance Metrics:', metrics);

    if (onPerfEntry) {
      onPerfEntry(metrics);
    }
  }
}

/**
 * 虚拟列表（大数据优化）
 */
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  const visibleItems = items.slice(startIndex, startIndex + visibleCount);

  const handleScroll = (scrollTop: number) => {
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    if (newStartIndex !== startIndex) {
      setStartIndex(newStartIndex);
    }
  };

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    handleScroll,
  };
}

import { useState } from 'react';
