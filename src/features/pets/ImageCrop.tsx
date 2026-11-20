import { useEffect, useRef, useState } from 'react'
import { Check, Minus, Plus, RotateCcw, RotateCw } from 'lucide-react'
import { Modal } from '../../ui/common'

const MAX_ZOOM = 4

// ox/oy: deslocamento do centro da imagem, em fração do lado do recorte.
type View = { zoom: number; ox: number; oy: number; rot: number }

function fitted(img: HTMLImageElement, rot: number) {
 const turned = rot % 180 !== 0
 return { w: turned ? img.height : img.width, h: turned ? img.width : img.height }
}

// Mantém a imagem cobrindo todo o recorte, sem sobrar borda branca.
function clamp(img: HTMLImageElement, v: View): View {
 const { w, h } = fitted(img, v.rot), base = Math.max(1 / w, 1 / h) * v.zoom
 const mx = Math.max(0, (w * base - 1) / 2), my = Math.max(0, (h * base - 1) / 2)
 return { ...v, ox: Math.min(mx, Math.max(-mx, v.ox)), oy: Math.min(my, Math.max(-my, v.oy)) }
}

function draw(ctx: CanvasRenderingContext2D, img: HTMLImageElement, size: number, v: View) {
 const { w, h } = fitted(img, v.rot), scale = Math.max(size / w, size / h) * v.zoom
 ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, size, size)
 ctx.save(); ctx.translate(size / 2 + v.ox * size, size / 2 + v.oy * size); ctx.rotate(v.rot * Math.PI / 180)
 ctx.drawImage(img, -img.width * scale / 2, -img.height * scale / 2, img.width * scale, img.height * scale); ctx.restore()
}

export function ImageCrop({ image, close, save }: { image: string, close: () => void, save: (s: string) => void }) {
 const [img, setImg] = useState<HTMLImageElement | null>(null)
 const [view, setView] = useState<View>({ zoom: 1, ox: 0, oy: 0, rot: 0 })
 const canvas = useRef<HTMLCanvasElement>(null), pointers = useRef(new Map<number, { x: number; y: number }>()), pinch = useRef(0)
 useEffect(() => { const i = new Image(); i.onload = () => setImg(i); i.src = image }, [image])
 useEffect(() => { const c = canvas.current; if (!c || !img) return; c.width = c.height = 600; draw(c.getContext('2d')!, img, 600, view) }, [img, view])

 const update = (f: (v: View) => View) => img && setView(v => clamp(img, f(v)))
 const setZoom = (z: number) => update(v => ({ ...v, zoom: Math.min(MAX_ZOOM, Math.max(1, z)) }))
 const distance = () => { const [a, b] = [...pointers.current.values()]; return Math.hypot(a.x - b.x, a.y - b.y) }

 function down(e: React.PointerEvent<HTMLCanvasElement>) { e.currentTarget.setPointerCapture(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.current.size === 2) pinch.current = distance() }
 function move(e: React.PointerEvent<HTMLCanvasElement>) {
  const prev = pointers.current.get(e.pointerId); if (!prev) return
  pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pointers.current.size === 2) { const d = distance(); if (pinch.current) update(v => ({ ...v, zoom: Math.min(MAX_ZOOM, Math.max(1, v.zoom * d / pinch.current)) })); pinch.current = d; return }
  const side = e.currentTarget.getBoundingClientRect().width
  update(v => ({ ...v, ox: v.ox + (e.clientX - prev.x) / side, oy: v.oy + (e.clientY - prev.y) / side }))
 }
 function up(e: React.PointerEvent<HTMLCanvasElement>) { pointers.current.delete(e.pointerId); pinch.current = 0 }

 function crop() { if (!img) return; const c = document.createElement('canvas'); c.width = c.height = 500; draw(c.getContext('2d')!, img, 500, view); save(c.toDataURL('image/jpeg', .9)) }

 return <Modal title="Recortar foto do hóspede" close={close}>
  <div className="cropStage"><canvas ref={canvas} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={e => setZoom(view.zoom * (e.deltaY < 0 ? 1.1 : 0.9))} /></div>
  <p className="cropHint">Arraste a foto para posicionar · use dois dedos para aproximar</p>
  <div className="cropZoom"><button type="button" aria-label="Diminuir zoom" onClick={() => setZoom(view.zoom - .25)}><Minus /></button><input type="range" aria-label="Zoom" min="1" max={MAX_ZOOM} step=".01" value={view.zoom} onChange={e => setZoom(+e.target.value)} /><button type="button" aria-label="Aumentar zoom" onClick={() => setZoom(view.zoom + .25)}><Plus /></button></div>
  <div className="cropTools"><button type="button" onClick={() => update(v => ({ ...v, rot: (v.rot + 90) % 360 }))}><RotateCw />Girar</button><button type="button" onClick={() => setView({ zoom: 1, ox: 0, oy: 0, rot: 0 })}><RotateCcw />Recomeçar</button></div>
  <button className="primary cropSave" disabled={!img} onClick={crop}><Check />Usar esta foto</button>
 </Modal>
}
