export function formatLiveTimestamp(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `${new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  }).format(date)} PKT`
}

export function formatRelativeTime(timestamp: string | Date | number | undefined | null): string {
  if (!timestamp) return 'just now'
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return 'just now'
  }

  const now = Date.now()
  const diffMs = now - date.getTime()
  if (diffMs < 0) return 'just now'

  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 45) return 'just now'
  if (diffSec < 90) return '1 min ago'

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} min ago`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} wk${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatExactDateTime(timestamp: string | Date | number | undefined | null): string {
  if (!timestamp) return 'Unknown date'
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return String(timestamp)
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}