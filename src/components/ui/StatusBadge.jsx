import Badge from './Badge';

const TONE_MAP = {
  paid: 'success', success: 'success', open: 'success', Open: 'success',
  pending: 'warning', 'Almost Full': 'warning',
  partial: 'info', upcoming: 'info',
  failed: 'danger', cancelled: 'danger', Cancelled: 'danger', Canceled: 'danger', Full: 'danger',
  refunded: 'neutral', draft: 'neutral', completed: 'neutral',
};

export default function StatusBadge({ status }) {
  const tone = TONE_MAP[status] || TONE_MAP[String(status).toLowerCase()] || 'neutral';
  return <Badge tone={tone}>{status || 'unknown'}</Badge>;
}
