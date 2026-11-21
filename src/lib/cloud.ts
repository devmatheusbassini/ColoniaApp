import { createClient, type Session } from '@supabase/supabase-js'
import type { AppData } from '../types'
import { parseBackup } from './storage'

// Chave publicável (anon): é pública por natureza; a proteção vem do RLS no Supabase.
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
 auth: { persistSession: true, autoRefreshToken: true, storageKey: 'tia-ci-auth' }
})

// dirty=true: há alterações locais que ainda não foram enviadas à nuvem.
type SyncMeta = { dirty: boolean; localUpdatedAt: string; remoteUpdatedAt?: string }
const META_KEY = 'tia-ci-sync-v1'
export function readMeta(): SyncMeta { try { return JSON.parse(localStorage.getItem(META_KEY) || 'null') || { dirty: false, localUpdatedAt: '' } } catch { return { dirty: false, localUpdatedAt: '' } } }
export function writeMeta(m: SyncMeta) { try { localStorage.setItem(META_KEY, JSON.stringify(m)) } catch {} }
export function markDirty() { writeMeta({ ...readMeta(), dirty: true, localUpdatedAt: new Date().toISOString() }) }

export async function currentSession(): Promise<Session | null> { const { data } = await supabase.auth.getSession(); return data.session }

export async function pullRemote(userId: string): Promise<{ data: AppData; updatedAt: string } | null> {
 const { data, error } = await supabase.from('app_state').select('data,updated_at').eq('user_id', userId).maybeSingle()
 if (error) throw error
 if (!data) return null
 return { data: parseBackup(JSON.stringify(data.data)), updatedAt: data.updated_at }
}

const KEYS=['pets','vaccines','budgets','incidents'] as const
// Junta dois estados por id. Nada é apagado, a não ser o que foi excluído de propósito (deleted).
export function mergeData(base: AppData, other: AppData, preferOther: boolean): AppData {
 const deleted = { ...(base.deleted || {}), ...(other.deleted || {}) }
 const out: any = { deleted }
 for (const k of KEYS) {
  const map = new Map<string, any>()
  for (const x of (base as any)[k] || []) map.set(x.id, x)
  for (const x of (other as any)[k] || []) if (preferOther || !map.has(x.id)) map.set(x.id, x)
  out[k] = [...map.values()].filter(x => !deleted[x.id])
 }
 return out as AppData
}
const sig = (d: AppData) => JSON.stringify(d)
export const sameData = (a: AppData, b: AppData) => sig(a) === sig(b)

// Envia juntando com o que já está na nuvem, para nunca sobrescrever dados de outro aparelho.
export async function pushRemote(userId: string, local: AppData): Promise<{ data: AppData; updatedAt: string }> {
 const remote = await pullRemote(userId)
 const merged = remote ? mergeData(remote.data, local, true) : local
 const updatedAt = new Date().toISOString()
 const { error } = await supabase.from('app_state').upsert({ user_id: userId, data: merged, updated_at: updatedAt })
 if (error) throw error
 writeMeta({ dirty: false, localUpdatedAt: updatedAt, remoteUpdatedAt: updatedAt })
 return { data: merged, updatedAt }
}

const isEmpty = (d: AppData) => !d.pets.length && !d.budgets.length && !d.vaccines.length && !d.incidents.length

export async function reconcile(userId: string, local: AppData): Promise<AppData> {
 const remote = await pullRemote(userId)
 if (!remote) { if (!isEmpty(local)) return (await pushRemote(userId, local)).data; return local }
 const merged = mergeData(remote.data, local, readMeta().dirty)
 if (!sameData(merged, remote.data)) return (await pushRemote(userId, merged)).data
 writeMeta({ dirty: false, localUpdatedAt: remote.updatedAt, remoteUpdatedAt: remote.updatedAt })
 return merged
}
