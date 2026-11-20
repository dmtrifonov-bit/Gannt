import { useMemo } from 'react';
import { Task } from '../types';

interface GanttChartProps {
  tasks: Task[];
  viewMode: 'day' | 'week' | 'month';
}

export default function GanttChart({ tasks, viewMode }: GanttChartProps) {
  const { timeline, projectStart, projectEnd, totalDays } = useMemo(() => {
    const dates = tasks.flatMap((t) => [new Date(t.startDate), new Date(t.endDate)]);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Add padding
    const start = new Date(minDate);
    start.setDate(start.getDate() - 3);
    const end = new Date(maxDate);
    end.setDate(end.getDate() + 3);

    const total = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const timelineItems: { date: Date; label: string; isHighlight: boolean }[] = [];
    const current = new Date(start);

    while (current <= end) {
      let label = '';
      let isHighlight = false;

      if (viewMode === 'day') {
        label = current.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        isHighlight = current.getDay() === 0 || current.getDay() === 6;
      } else if (viewMode === 'week') {
        label = current.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        isHighlight = current.getDay() === 0 || current.getDay() === 6;
      } else {
        label = current.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        isHighlight = false;
      }

      timelineItems.push({ date: new Date(current), label, isHighlight });

      if (viewMode === 'day') {
        current.setDate(current.getDate() + 1);
      } else if (viewMode === 'week') {
        current.setDate(current.getDate() + 1);
      } else {
        current.setDate(current.getDate() + 3);
      }
    }

    return {
      timeline: timelineItems,
      projectStart: start,
      projectEnd: end,
      totalDays: total,
    };
  }, [tasks, viewMode]);

  const getBarPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startOffset = (start.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` };
  };

  const today = new Date();
  const todayPosition = useMemo(() => {
    const offset = (today.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24);
    return (offset / totalDays) * 100;
  }, [projectStart, totalDays]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Timeline Header */}
        <div className="flex border-b border-slate-700/50">
          <div className="w-56 min-w-56 px-4 py-2 text-xs font-medium text-slate-400 border-r border-slate-700/50">
            Задача
          </div>
          <div className="flex-1 relative">
            <div className="flex">
              {timeline.map((item, i) => {
                const cellWidth = viewMode === 'day' ? '32px' : viewMode === 'week' ? '16px' : '24px';
                return (
                  <div
                    key={i}
                    className={`flex-shrink-0 text-center text-[10px] py-2 border-r border-slate-700/30 ${
                      item.isHighlight ? 'bg-slate-700/20 text-slate-500' : 'text-slate-500'
                    }`}
                    style={{ width: cellWidth }}
                  >
                    {viewMode === 'day' || (viewMode === 'week' && i % 3 === 0) || (viewMode === 'month' && i % 2 === 0)
                      ? item.label
                      : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Rows */}
        {tasks.map((task, index) => {
          const barPos = getBarPosition(task.startDate, task.endDate);
          return (
            <div
              key={task.id}
              className={`flex border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
                index % 2 === 0 ? 'bg-slate-800/30' : ''
              }`}
            >
              {/* Task Name */}
              <div className="w-56 min-w-56 px-4 py-3 flex items-center gap-3 border-r border-slate-700/50">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: task.color }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-200 truncate">{task.name}</div>
                  <div className="text-xs text-slate-500">{task.category}</div>
                </div>
              </div>

              {/* Bar Area */}
              <div className="flex-1 relative py-3">
                {/* Background grid */}
                <div className="absolute inset-0 flex">
                  {timeline.map((item, i) => {
                    const cellWidth = viewMode === 'day' ? '32px' : viewMode === 'week' ? '16px' : '24px';
                    return (
                      <div
                        key={i}
                        className={`flex-shrink-0 border-r border-slate-700/20 ${
                          item.isHighlight ? 'bg-slate-700/10' : ''
                        }`}
                        style={{ width: cellWidth }}
                      />
                    );
                  })}
                </div>

                {/* Task Bar */}
                <div
                  className="absolute top-2 h-7 rounded-md overflow-hidden cursor-pointer group transition-all hover:h-8 hover:shadow-lg"
                  style={{
                    left: barPos.left,
                    width: barPos.width,
                    backgroundColor: task.color + '30',
                    border: `1px solid ${task.color}80`,
                  }}
                >
                  {/* Progress fill */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-md transition-all"
                    style={{
                      width: `${task.progress}%`,
                      backgroundColor: task.color,
                      opacity: 0.8,
                    }}
                  />
                  {/* Label */}
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-[10px] font-medium text-white truncate drop-shadow-sm">
                      {task.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Today Line */}
        {todayPosition > 0 && todayPosition < 100 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500/70 z-10 pointer-events-none"
            style={{ left: `calc(224px + ${todayPosition}% * (100% - 224px) / 100)` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
