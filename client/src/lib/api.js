async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

export function generatePoem(style, mood) {
  return request('/api/poem', {
    method: 'POST',
    body: JSON.stringify({ style, mood }),
  })
}

export function fetchArtworkByMood(mood) {
  return request(`/api/artwork?mood=${encodeURIComponent(mood)}`)
}

export function fetchArtworkById(objectID) {
  return request(`/api/artwork/${objectID}`)
}
