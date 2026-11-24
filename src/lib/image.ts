// Reduz fotos da câmera (vários MB) para no máximo 1280px em JPEG, para caber no armazenamento do aparelho e na nuvem.
export function compressImage(file: File, max = 1280, quality = .75): Promise<string> {
 return new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file), img = new Image()
  img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); const g = c.getContext('2d')!; g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); resolve(c.toDataURL('image/jpeg', quality)) }
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Não foi possível ler a imagem.')) }
  img.src = url
 })
}
