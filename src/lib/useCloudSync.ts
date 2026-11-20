import { useEffect, useRef, useState } from 'react'
import type { AppData } from '../types'
import { markDirty, pushRemote, readMeta, reconcile } from './cloud'
import { loadData, saveData } from './storage'

export type SyncStatus = 'sincronizado' | 'enviando' | 'offline' | 'erro'

const PUSH_DELAY_MS = 1200

export function useCloudSync(userId: string) {
 const [data, setData] = useState<AppData>(loadData)
 const [ready, setReady] = useState(false)
 const [sync, setSync] = useState<SyncStatus>('sincronizado')
 const fromCloud = useRef(true), pushTimer = useRef<number | undefined>(undefined), latest = useRef(data), saveWarned = useRef(false)
 latest.current = data

 const push = async () => {
  if (!navigator.onLine) { setSync('offline'); return }
  setSync('enviando')
  try { await pushRemote(userId, latest.current); setSync('sincronizado') } catch { setSync('erro') }
 }

 useEffect(() => {
  let alive = true
  reconcile(userId, loadData())
   .then(d => { if (!alive) return; fromCloud.current = true; setData(d); setSync('sincronizado') })
   .catch(() => { if (alive) setSync(navigator.onLine ? 'erro' : 'offline') })
   .finally(() => alive && setReady(true))
  const online = () => { if (readMeta().dirty) push() }
  window.addEventListener('online', online)
  return () => { alive = false; window.removeEventListener('online', online) }
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
