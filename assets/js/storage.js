window.Orbit = window.Orbit || {};
(function (Orbit) {
  const TASKS_KEY = 'tasks';
  const ACTIVITY_KEY = 'taskActivity';
  const THEME_KEY = 'orbitTheme';
  const seedTasks = [
    { id: 1, title: 'Map Q4 product priorities', description: 'Align the roadmap with the latest customer signals.', category: 'Planning', priority: 'High', dueDate: new Date().toISOString().slice(0, 10), dueTime: '10:30', estimatedHours: '2', status: 'Pending', createdAt: new Date().toISOString(), completedAt: '' },
    { id: 2, title: 'Review onboarding flow', description: 'Leave notes on the new activation journey.', category: 'Design', priority: 'Medium', dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), dueTime: '14:00', estimatedHours: '1', status: 'Pending', createdAt: new Date().toISOString(), completedAt: '' },
    { id: 3, title: 'Send launch recap', description: 'Share the launch numbers with the growth team.', category: 'Communication', priority: 'Low', dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10), dueTime: '16:00', estimatedHours: '1', status: 'Completed', createdAt: new Date(Date.now() - 172800000).toISOString(), completedAt: new Date(Date.now() - 86400000).toISOString() }
  ];
  Orbit.storage = {
    getTasks() { const raw = localStorage.getItem(TASKS_KEY); if (raw) { try { return JSON.parse(raw); } catch (error) { return []; } } localStorage.setItem(TASKS_KEY, JSON.stringify(seedTasks)); return seedTasks; },
    saveTasks(tasks) { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); return tasks; },
    addTask(task) { const tasks = this.getTasks(); tasks.unshift(task); this.saveTasks(tasks); this.logActivity('Task added', task.title); return task; },
    updateTask(id, changes) { const tasks = this.getTasks().map(task => task.id === id ? { ...task, ...changes } : task); this.saveTasks(tasks); return tasks.find(task => task.id === id); },
    deleteTask(id) { const task = this.getTasks().find(item => item.id === id); this.saveTasks(this.getTasks().filter(item => item.id !== id)); if (task) this.logActivity('Task deleted', task.title); },
    clearTasks() { localStorage.removeItem(TASKS_KEY); localStorage.removeItem(ACTIVITY_KEY); },
    getActivity() { try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]'); } catch (error) { return []; } },
    logActivity(action, title) { const items = this.getActivity(); items.unshift({ action, title, at: new Date().toISOString() }); localStorage.setItem(ACTIVITY_KEY, JSON.stringify(items.slice(0, 20))); },
    getTheme() { return localStorage.getItem(THEME_KEY) || 'light'; },
    setTheme(theme) { localStorage.setItem(THEME_KEY, theme); }
  };
})(window.Orbit);
