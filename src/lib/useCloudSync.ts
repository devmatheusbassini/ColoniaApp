import { useEffect, useRef, useState } from 'react'
import type { AppData } from '../types'
import { markDirty, mergeData, pullRemote, pushRemote, readMeta, reconcile, sameData, writeMeta } from './cloud'
import { loadData, saveData } from './storage'

export type SyncStatus = 'sincronizado' | 'enviando' | 'offline' | 'erro'

const PUSH_DELAY_MS = 1200, POLL_MS = 5000
const KEYS = ['pets', 'vaccines', 'budgets', 'incidents'] as const

// Aplica só o que a tela mudou em relação ao que ela via (base), por cima do estado mais recente (prev).
// Assim, o que chegou da nuvem enquanto a tela estava aberta não é sobrescrito nem marcado como excluído.
export function applyChange(prev: AppData, base: AppData, next: AppData): AppData {
 const now = new Date().toISOString(), gone: Record<string, string> = {}, out: any = {}
 for (const k of KEYS) {
  const before = new Map<string, any>(((base as any)[k] || []).map((x: any) => [x.id, x]))
  const after = new Map<string, any>(((next as any)[k] || []).map((x: any) => [x.id, x]))
  for (const id of before.keys()) if (!after.has(id)) gone[id] = now
  const changed = [...after.values()].filter(x => !before.has(x.id) || JSON.stringify(before.get(x.id)) !== JSON.stringify(x))
  const byId = new Map<string, any>(changed.map(x => [x.id, x]))
  const kept = ((prev as any)[k] || []).filter((x: any) => !gone[x.id])
  const keptIds = new Set(kept.map((x: any) => x.id))
  out[k] = [...kept.map((x: any) => byId.get(x.id) || x), ...changed.filter(x => !keptIds.has(x.id))]
 }
 out.deleted = { ...(prev.deleted || {}), ...(next.deleted || {}), ...gone }
 return out as AppData
}

export function useCloudSync(userId: string) {
 const [data, setRaw] = useState<AppData>(loadData)
 const [ready, setReady] = useState(false)
 const [sync, setSync] = useState<SyncStatus>('sincronizado')
 const fromCloud = useRef(true), pushTimer = useRef<number | undefined>(undefined), latest = useRef(data), saveWarned = useRef(false), busy = useRef(false)
 latest.current = data

 const setData = (d: AppData) => { const base = latest.current; setRaw(prev => applyChange(prev, base, d)) }
 const applyCloud = (d: AppData) => { if (sameData(d, latest.current)) return; fromCloud.current = true; setRaw(d) }

 const push = async () => {
  if (!navigator.onLine) { setSync('offline'); return }
  busy.current = true; setSync('enviando')
  try { const r = await pushRemote(userId, latest.current); if (!readMeta().dirty) applyCloud(r.data); setSync('sincronizado') } catch { setSync('erro') } finally { busy.current = false }
 }

 useEffect(() => {
  let alive = true
  reconcile(userId, loadData())
   .then(d => { if (!alive) return; fromCloud.current = true; setRaw(d); setSync('sincronizado') })
   .catch(() => { if (alive) setSync(navigator.onLine ? 'erro' : 'offline') })
   .finally(() => alive && setReady(true))
  const poll = async () => {
   if (busy.current || !navigator.onLine || document.visibilityState !== 'visible') return
   const meta = readMeta(); if (meta.dirty) { push(); return }
   try {
    busy.current = true
    const r = await pullRemote(userId)
    if (!r || r.updatedAt === meta.remoteUpdatedAt || readMeta().dirty) return
    writeMeta({ dirty: false, localUpdatedAt: r.updatedAt, remoteUpdatedAt: r.updatedAt })
    const merged = mergeData(latest.current, r.data, true)
    if (alive) applyCloud(merged)
    if (!sameData(merged, r.data)) { busy.current = false; markDirty(); push() }
   } catch {} finally { busy.current = false }
  }
  const timer = window.setInterval(poll, POLL_MS)
  const online = () => { if (readMeta().dirty) push() }
  window.addEventListener('online', online)
  document.addEventListener('visibilitychange', poll)
  return () => { alive = false; clearInterval(timer); window.removeEventListener('online', online); document.removeEventListener('visibilitychange', poll) }
 }, [userId])

 useEffect(() => {
  if (saveData(data)) saveWarned.current = false
  else if (!saveWarned.current) { saveWarned.current = true; alert('Atenção: não foi possível salvar as últimas alterações porque o armazenamento do aparelho está cheio. Faça um backup em Menu › Financeiro e remova fotos ou anexos grandes.') }
  if (fromCloud.current) { fromCloud.current = false; return }
  markDirty()
  clearTimeout(pushTimer.current)
  pushTimer.current = window.setTimeout(push, PUSH_DELAY_MS)
 }, [data])

 return { data, setData, ready, sync, retry: push }
}
