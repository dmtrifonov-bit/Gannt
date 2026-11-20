import { useState, useMemo } from 'react';
import { Task } from './types';
import GanttChart from './components/GanttChart';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const initialTasks: Task[] = [
  {
    id: '1',
    name: 'Анализ требований',
    startDate: '2026-01-05',
    endDate: '2026-01-15',
    progress: 100,
    color: '#6366f1',
    category: 'Планирование',
  },
  {
    id: '2',
    name: 'Проектирование архитектуры',
    startDate: '2026-01-12',
    endDate: '2026-01-25',
    progress: 100,
    color: '#8b5cf6',
    category: 'Планирование',
  },
  {
    id: '3',
    name: 'Разработка backend',
    startDate: '2026-01-20',
    endDate: '2026-02-15',
    progress: 75,
    color: '#06b6d4',
    category: 'Разработка',
  },
  {
    id: '4',
    name: 'Разработка frontend',
    startDate: '2026-01-25',
    endDate: '2026-02-20',
    progress: 60,
    color: '#10b981',
    category: 'Разработка',
  },
  {
    id: '5',
    name: 'Интеграционное тестирование',
    startDate: '2026-02-10',
    endDate: '2026-02-28',
    progress: 30,
    color: '#f59e0b',
    category: 'Тестирование',
  },
  {
    id: '6',
    name: 'Документация',
    startDate: '2026-02-01',
    endDate: '2026-03-05',
    progress: 20,
    color: '#ef4444',
    category: 'Документация',
  },
  {
    id: '7',
    name: 'Деплой и запуск',
    startDate: '2026-03-01',
    endDate: '2026-03-10',
    progress: 0,
    color: '#ec4899',
    category: 'Релиз',
  },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
    setShowForm(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.progress === 100).length;
    const inProgress = tasks.filter((t) => t.progress > 0 && t.progress < 100).length;
    const avgProgress = total > 0 ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / total) : 0;
    return { total, completed, inProgress, avgProgress };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Диаграмма Ганта
              </h1>
              <p className="text-xs text-slate-400">Планировщик проектов</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              {(['day', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    viewMode === mode
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === 'day' ? 'День' : mode === 'week' ? 'Неделя' : 'Месяц'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/25"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить задачу
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-indigo-400">{stats.total}</div>
            <div className="text-xs text-slate-400 mt-1">Всего задач</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-xs text-slate-400 mt-1">Завершено</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-amber-400">{stats.inProgress}</div>
            <div className="text-xs text-slate-400 mt-1">В процессе</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-400">{stats.avgProgress}%</div>
            <div className="text-xs text-slate-400 mt-1">Средний прогресс</div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm mb-6">
          <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="font-semibold text-slate-200 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Временная шкала проекта
            </h2>
            <span className="text-xs text-slate-500">Янв — Мар 2026</span>
          </div>
          <GanttChart tasks={tasks} viewMode={viewMode} />
        </div>

        {/* Task List */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="px-5 py-3 border-b border-slate-700/50">
            <h2 className="font-semibold text-slate-200 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Список задач
            </h2>
          </div>
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </main>

      {/* Modal Form */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
