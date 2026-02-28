export function timeAgo(date) {
  if (!date) return '';
  const d = new Date(date);
  const sec = Math.floor((Date.now() - d) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hr`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} days`;
  return d.toLocaleDateString();
}
