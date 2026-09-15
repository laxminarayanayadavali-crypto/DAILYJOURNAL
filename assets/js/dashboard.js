window.Orbit = window.Orbit || {};
(function (Orbit) {
  const today = () => new Date().toISOString().slice(0, 10);
  const currentDateTime = () => new Date().toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  const stats = tasks => ({
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'Pending').length,
    completed: tasks.filter(task => task.status === 'Completed').length,
    today: tasks.filter(task => task.dueDate === today()).length,
    high: tasks.filter(task => ['High', 'Critical'].includes(task.priority) && task.status !== 'Completed').length,
    overdue: tasks.filter(Orbit.tasks.isOverdue).length
  });
  const statCards = values => [['Total tasks', values.total, '◌', 'rgba(79,70,229,.5)'], ['Today', values.today, '◷', 'rgba(6,182,212,.5)'], ['Pending', values.pending, '◒', 'rgba(245,158,11,.5)'], ['Completed', values.completed, '✓', 'rgba(34,197,94,.5)'], ['High priority', values.high, '!', 'rgba(239,68,68,.5)']].map(item => `<div class="stat-card card animate-in" style="--accent:${item[3]}"><div class="stat-top"><span>${item[0]}</span><span class="stat-icon">${item[2]}</span></div><strong class="stat-value">${item[1]}</strong><span class="stat-trend">${item[0] === 'Completed' ? `${values.percent}% completion rate` : item[0] === 'Pending' ? `${values.overdue} overdue` : 'Across your workspace'}</span></div>`).join('');
  const taskRows = tasks => tasks.length ? tasks.map(task => `<div class="task-row"><button class="check ${task.status === 'Completed' ? 'done' : ''}" data-dashboard-complete="${task.id}">${task.status === 'Completed' ? '✓' : ''}</button><div class="task-row-main"><div class="task-title">${Orbit.escape(task.title)}</div><div class="task-meta"><span>${task.dueTime || 'Anytime'}</span><span>·</span><span>${Orbit.escape(task.category || 'General')}</span></div></div><span class="badge ${Orbit.tasks.priorityClass(task.priority)}">${task.priority}</span></div>`).join('') : '<div class="empty-state"><div class="empty-icon">✦</div><div>No tasks due today.</div></div>';
  Orbit.dashboard = {
    stats,
    render() {
      const tasks = Orbit.storage.getTasks();
      const values = stats(tasks);
      values.percent = values.total ? Math.round(values.completed / values.total * 100) : 0;
      const dueToday = tasks.filter(task => task.dueDate === today()).slice(0, 4);
      const upcoming = tasks.filter(task => task.status !== 'Completed' && task.dueDate && task.dueDate >= today()).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
      const recent = tasks.slice(0, 4);
      return `<div class="page-heading"><div><div class="eyebrow">${currentDateTime()}</div><h1>Good morning, Alex.</h1><p class="muted">Here is the pulse of your workday.</p></div><a class="btn btn-primary" href="pages/add-task.html">＋ Add task</a></div><section class="stats-grid">${statCards(values)}</section><div class="dashboard-grid"><div class="dashboard-column"><section class="widget card"><div class="widget-heading"><div><h2>Today’s tasks</h2><span class="muted">Your next small wins</span></div><a class="btn btn-soft" href="pages/all-tasks.html">View all</a></div><div id="today-tasks" class="task-list">${taskRows(dueToday)}</div></section><section class="widget card"><div class="widget-heading"><div><h2>Recent activity</h2><span class="muted">The latest movement in your workspace</span></div></div><div class="task-list">${recent.length ? recent.map(task => `<div class="task-row"><span class="check ${task.status === 'Completed' ? 'done' : ''}">${task.status === 'Completed' ? '✓' : '•'}</span><div class="task-row-main"><div class="task-title">${Orbit.escape(task.title)}</div><div class="task-meta"><span>${task.status === 'Completed' ? 'Completed' : 'Created'} · ${Orbit.tasks.formatDate((task.completedAt || task.createdAt).slice(0, 10))}</span></div></div></div>`).join('') : '<div class="empty-state">Nothing here yet.</div>'}</div></section></div><div class="dashboard-column"><section class="widget card"><div class="widget-heading"><div><h2>Progress</h2><span class="muted">Keep the momentum going</span></div><strong>${values.percent}%</strong></div><div class="progress-meta"><span>Workspace completion</span><span>${values.completed}/${values.total}</span></div><div class="progress-track"><div class="progress-fill" style="width:${values.percent}%"></div></div><p class="muted">${values.overdue ? `${values.overdue} task${values.overdue > 1 ? 's are' : ' is'} overdue. Clear the runway.` : 'You are on track. Nice work.'}</p></section><section class="widget card"><div class="widget-heading"><div><h2>Upcoming</h2><span class="muted">Deadlines on your radar</span></div><span>→</span></div>${upcoming.length ? upcoming.map(task => `<div class="deadline"><div><strong>${Orbit.escape(task.title)}</strong><div class="muted">${Orbit.escape(task.category || 'General')}</div></div><span class="deadline-date">${Orbit.tasks.formatDate(task.dueDate)}</span></div>`).join('') : '<div class="empty-state">No upcoming deadlines.</div>'}</section></div></div>`;
    }
  };
})(window.Orbit);
