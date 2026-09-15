window.Orbit = window.Orbit || {};
window.Orbit.filters = {
  priorityRank: { Critical: 4, High: 3, Medium: 2, Low: 1 },
  search(tasks, query) { const value = query.trim().toLowerCase(); if (!value) return tasks; return tasks.filter(task => [task.title, task.category, task.description].some(field => (field || '').toLowerCase().includes(value))); },
  sort(tasks, value) { return [...tasks].sort((a, b) => { if (value === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt); if (value === 'priority') return this.priorityRank[b.priority] - this.priorityRank[a.priority]; if (value === 'due') return (a.dueDate || '9999') .localeCompare(b.dueDate || '9999'); return new Date(b.createdAt) - new Date(a.createdAt); }); },
  byPriority(tasks, priority) { return priority ? tasks.filter(task => task.priority === priority) : tasks; },
  byCategory(tasks, category) { return category ? tasks.filter(task => task.category === category) : tasks; }
};
