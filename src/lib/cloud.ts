import { createClient, type Session } from '@supabase/supabase-js'
import type { AppData } from '../types'
import { parseBackup } from './storage'

// Chave publicável (anon): é pública por natureza; a proteção vem do RLS no Supabase.
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
 auth: { persistSession: true, autoRefreshToken: true, storageKey: 'tia-ci-auth' }
})

// Metadados da sincronização guardados no aparelho.
// dirty=true: há alterações locais que ainda não foram enviadas à nuvem.
type SyncMeta = { dirty: boolean; localUpdatedAt: string; remoteUpdatedAt?: string }
const META_KEY = 'tia-ci-sync-v1'
export function readMeta(): SyncMeta { try { return JSON.parse(localStorage.getItem(META_KEY) || 'null') || { dirty: false, localUpdatedAt: '' } } catch { return { dirty: false, localUpdatedAt: '' } } }
export function writeMeta(m: SyncMeta) { try { localStorage.setItem(META_KEY, JSON.stringify(m)) } catch { /* sem espaço: ignora */ } }
export function markDirty() { writeMeta({ ...readMeta(), dirty: true, localUpdatedAt: new Date().toISOString() }) }

export async function currentSession(): Promise<Session | null> { const { data } = await supabase.auth.getSession(); return data.session }

export async function pullRemote(userId: string): Promise<{ data: AppData; updatedAt: string } | null> {
 const { data, error } = await supabase.from('app_state').select('data,updated_at').eq('user_id', userId).maybeSingle()
 if (error) throw error
 if (!data) return null
 return { data: parseBackup(JSON.stringify(data.data)), updatedAt: data.updated_at }
}

export async function pushRemote(userId: string, appData: AppData): Promise<string> {
 const updatedAt = new Date().toISOString()
 const { error } = await supabase.from('app_state').upsert({ user_id: userId, data: appData, updated_at: updatedAt })
 if (error) throw error
 writeMeta({ dirty: false, localUpdatedAt: updatedAt, remoteUpdatedAt: updatedAt })
 return updatedAt
}

const isEmpty = (d: AppData) => !d.pets.length && !d.budgets.length && !d.vaccines.length && !d.incidents.length

// Decide qual versão vale ao abrir o app:
// - nuvem vazia → envia os dados do aparelho (migração inicial);
// - alterações locais não enviadas e mais novas que a nuvem → envia o aparelho;
// - caso contrário → usa a nuvem.
export async function reconcile(userId: string, local: AppData): Promise<AppData> {
 const remote = await pullRemote(userId)
 const meta = readMeta()
 if (!remote || isEmpty(remote.data)) { if (!isEmpty(local)) await pushRemote(userId, local); else writeMeta({ dirty: false, localUpdatedAt: '', remoteUpdatedAt: remote?.updatedAt }); return local }
 if (meta.dirty && meta.localUpdatedAt > remote.updatedAt && !isEmpty(local)) { await pushRemote(userId, local); return local }
 writeMeta({ dirty: false, localUpdatedAt: remote.updatedAt, remoteUpdatedAt: remote.updatedAt })
 return remote.data
}
