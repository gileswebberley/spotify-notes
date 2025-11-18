//send either a Date object or an ISO date string to be formatted as Mon DD, YYYY, HH:MM AM/PM
export function formatDate(date) {
  const dateStr = typeof date === 'string' ? date : date.toISOString();
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}
