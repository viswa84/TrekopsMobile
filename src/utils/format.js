export function formatINR(n) {
  if (n == null || isNaN(n)) return '₹0';
  const num = Number(n);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)} K`;
  return `₹${num.toLocaleString('en-IN')}`;
}

export function formatCompactNumber(n) {
  if (n == null || isNaN(n)) return '0';
  const num = Number(n);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

export function formatDate(input) {
  if (!input) return '—';
  try {
    const d = new Date(typeof input === 'string' && /^\d+$/.test(input) ? Number(input) : input);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

export function formatDateTime(input) {
  if (!input) return '—';
  try {
    const d = new Date(typeof input === 'string' && /^\d+$/.test(input) ? Number(input) : input);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function formatTime(input) {
  if (!input) return '';
  try {
    const d = new Date(typeof input === 'string' && /^\d+$/.test(input) ? Number(input) : input);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function relativeTime(input) {
  if (!input) return '';
  try {
    const d = new Date(typeof input === 'string' && /^\d+$/.test(input) ? Number(input) : input);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(input);
  } catch {
    return '';
  }
}

export function initials(name) {
  if (!name) return '?';
  return name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
}

export function maskPhone(phone) {
  if (!phone) return '';
  const s = String(phone);
  if (s.length < 4) return s;
  return `${s.slice(0, 2)} ${s.slice(2, s.length - 4)} ${s.slice(-4)}`;
}
