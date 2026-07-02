// GitHub 风格学习热力图
import React, { useMemo } from 'react';

interface HeatmapCalendarProps {
  /** 日期->活跃度 映射，活跃度 0-4 */
  activityData: Record<string, number>;
  /** 显示周数 */
  weeks?: number;
  className?: string;
}

const intensityColors = [
  'bg-white/[0.04]',
  'bg-cyber-green/15',
  'bg-cyber-green/30',
  'bg-cyber-green/50',
  'bg-cyber-green/70',
];

const DAY_LABELS = ['', '一', '', '三', '', '五', ''];

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  activityData,
  weeks = 12,
  className = '',
}) => {
  const { grid, months } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = weeks * 7;
    // 找到起始日期（上周日）
    const startDay = new Date(today);
    startDay.setDate(startDay.getDate() - startDay.getDay() - (weeks - 1) * 7);

    const grid: { date: string; dayOfWeek: number; weekIndex: number; intensity: number }[] = [];
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDay);
      d.setDate(d.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayOfWeek = d.getDay();
      const weekIndex = Math.floor(i / 7);

      const intensity = d > today ? -1 : (activityData[dateStr] ?? 0);

      grid.push({ date: dateStr, dayOfWeek, weekIndex, intensity });

      if (d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth();
        monthLabels.push({ label: `${d.getMonth() + 1}月`, col: weekIndex });
      }
    }
    return { grid, months: monthLabels };
  }, [activityData, weeks]);

  const cellSize = 13;
  const gap = 3;

  return (
    <div className={`select-none ${className}`}>
      {/* 月份标签 */}
      <div className="flex mb-1" style={{ paddingLeft: 24 }}>
        {months.map((m, i) => (
          <span
            key={i}
            className="text-[10px] text-gray-600"
            style={{ width: (cellSize + gap) * 1, marginRight: (cellSize + gap) * (m.col - (months[i - 1]?.col ?? 0) - 1), marginLeft: i === 0 ? m.col * (cellSize + gap) : 0 }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-1">
        {/* 星期标签 */}
        <div className="flex flex-col gap-[3px] mr-1 pt-[2px]">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="text-[10px] text-gray-600 leading-none" style={{ height: cellSize }}>
              {label}
            </div>
          ))}
        </div>

        {/* 格子网格 */}
        <div className="flex gap-[3px]">
          {Array.from({ length: weeks }, (_, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {[0, 1, 2, 3, 4, 5, 6].map(dow => {
                const cell = grid.find(g => g.weekIndex === wi && g.dayOfWeek === dow);
                if (!cell) return <div key={dow} style={{ width: cellSize, height: cellSize }} />;
                const colorClass = cell.intensity < 0
                  ? 'bg-transparent'
                  : intensityColors[Math.min(cell.intensity, 4)];
                const tooltip = cell.intensity >= 0
                  ? `${cell.date} · 活跃度 ${cell.intensity}`
                  : cell.date;
                return (
                  <div
                    key={dow}
                    title={tooltip}
                    className={`rounded-sm transition-colors duration-200 ${colorClass}`}
                    style={{ width: cellSize, height: cellSize }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-2 mt-2 justify-end">
        <span className="text-[10px] text-gray-600">少</span>
        {intensityColors.map((c, i) => (
          <div key={i} className={`rounded-sm ${c}`} style={{ width: cellSize, height: cellSize }} />
        ))}
        <span className="text-[10px] text-gray-600">多</span>
      </div>
    </div>
  );
};
