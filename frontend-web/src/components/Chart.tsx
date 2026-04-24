import { useEffect, useRef } from 'react';

/**
 * 轻量饼图组件（纯 Canvas，零依赖）
 */

export interface PieDataItem {
  name: string;
  value: number;
}

export interface ECOption {
  color?: string[];
  tooltip?: any;
  graphic?: any[];
  series?: Array<{
    type: 'pie';
    radius?: [string, string];
    data: PieDataItem[];
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface ChartProps {
  option: ECOption;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Chart({ option, width = '100%', height = '300px', className = '' }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // 清空
    ctx.clearRect(0, 0, w, h);

    const series = option.series?.[0];
    if (!series || series.type !== 'pie' || !series.data?.length) return;

    const colors = option.color || ['#00b42a', '#165dff', '#f77234', '#f53f3f', '#86909c'];
    const data = series.data;
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return;

    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(w, h) * 0.35;
    const innerR = outerR * 0.6;

    // 绘制饼图
    let startAngle = -Math.PI / 2;
    const slices: Array<{ startAngle: number; endAngle: number; midAngle: number; item: PieDataItem; color: string }> = [];

    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      const color = colors[i % colors.length];

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // 白色边框
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      slices.push({
        startAngle,
        endAngle,
        midAngle: startAngle + sliceAngle / 2,
        item,
        color,
      });

      startAngle = endAngle;
    });

    // 绘制标签
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textBaseline = 'middle';

    slices.forEach(({ midAngle, item, color }) => {
      const pct = ((item.value / total) * 100).toFixed(1);
      const labelR = outerR + 24;
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;

      ctx.fillStyle = '#4e5969';
      ctx.textAlign = midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5 ? 'right' : 'left';
      ctx.fillText(`${item.name} ${pct}%`, lx, ly);

      // 引导线
      const lineStartR = outerR + 4;
      const lineEndR = outerR + 16;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(midAngle) * lineStartR, cy + Math.sin(midAngle) * lineStartR);
      ctx.lineTo(cx + Math.cos(midAngle) * lineEndR, cy + Math.sin(midAngle) * lineEndR);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 中心文字
    const graphics = option.graphic || [];
    graphics.forEach((g: any) => {
      if (g.type === 'text' && g.style?.text) {
        ctx.textAlign = 'center';
        ctx.fillStyle = g.style.fill || '#1d2129';
        ctx.font = `${g.style.fontWeight || 'normal'} ${g.style.fontSize || 14}px -apple-system, BlinkMacSystemFont, sans-serif`;

        const textY = g.top === '42%' ? cy - 8 : g.top === '52%' ? cy + 12 : cy;
        ctx.fillText(g.style.text, cx, textY);
      }
    });

    // resize handler
    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      if (newRect.width !== w || newRect.height !== h) {
        // 触发重绘
        canvas.dispatchEvent(new Event('chart-resize'));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [option]);

  return (
    <div
      ref={containerRef}
      style={{ width, height, position: 'relative' }}
      className={className}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
