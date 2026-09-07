export function formatYouTubeEmbedUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  // youtube.com/embed/ID
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i)
  if (embedMatch) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`
  }

  // youtu.be/ID
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/i)
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`
  }

  // youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/(?:[?&]v=)([a-zA-Z0-9_-]{11})/i)
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`
  }

  // youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i)
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`
  }

  // Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`
  }

  return trimmed
}
