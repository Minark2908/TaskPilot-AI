import { Task } from '../types';

export const exportToCsv = (tasks: Task[]): void => {
  const headers = ['ID', 'Description', 'Owner', 'Due Date', 'Priority', 'Status', 'Created At'];
  
  const rows = tasks.map(task => [
    task.id,
    `"${task.description.replace(/"/g, '""')}"`,
    `"${task.owner.replace(/"/g, '""')}"`,
    task.due_date || 'N/A',
    task.priority,
    task.status,
    task.created_at,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `taskpilot_tasks_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
