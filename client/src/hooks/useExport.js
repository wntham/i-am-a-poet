import { toPng } from 'html-to-image'

export function useExport() {
  const exportImage = async (ref, style, mood) => {
    if (!ref.current) return

    const node = ref.current

    // Temporarily add export class for border/padding styling
    node.classList.add('export-mode')

    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
      })

      const link = document.createElement('a')
      link.download = `poem-${style.toLowerCase()}-${mood.toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    } finally {
      node.classList.remove('export-mode')
    }
  }

  return { exportImage }
}
