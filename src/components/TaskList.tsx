import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <div className="text-slate-500 text-sm">Нет задач. Добавьте первую задачу!</div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-700/30">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="px-5 py-3 flex items-center gap-4 hover:bg-slate-700/20 transition-colors group"
        >
          {/* Color indicator */}
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: task.color }}
          />

          {/* Task info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-200 truncate">
                {task.name}
              </span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-700 text-slate-400 flex-shrink-0">
                {task.category}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-500">
                {new Date(task.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                {' — '}
                {new Date(task.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-xs text-slate-500">
                {Math.ceil((new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24))} дн.
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-24 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor: task.color,
                  }}
                />
              </div>
              <span className="text-xs text-slate-400 w-8 text-right">{task.progress}%</span>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex-shrink-0">
            {task.progress === 100 ? (
              <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                Завершено
              </span>
            ) : task.progress > 0 ? (
              <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                В процессе
              </span>
            ) : (
              <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                Ожидает
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors"
              title="Редактировать"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
              title="Удалить"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
