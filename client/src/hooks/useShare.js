import { useState } from 'react'
import { encodeShare, decodeShare } from '../lib/share.js'

export function useShare() {
  const [copied, setCopied] = useState(false)

  const share = async (poem, objectID) => {
    const url = encodeShare(poem, objectID)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback: prompt the user manually
      window.prompt('Copy this link:', url)
    }
  }

  return { share, copied, decodeShare }
}
