export function encodeShare(poem, objectID) {
  const payload = JSON.stringify({ poem, objectID })
  const encoded = btoa(unescape(encodeURIComponent(payload)))
  return `${window.location.origin}/result?share=${encoded}`
}

export function decodeShare(searchString) {
  const params = new URLSearchParams(searchString)
  const encoded = params.get('share')
  if (!encoded) return null
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))))
  } catch {
    return null
  }
}
