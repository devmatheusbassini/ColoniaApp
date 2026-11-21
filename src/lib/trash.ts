import type { AppData } from '../types'
export const TRASH_DAYS = 30
const has = (arr: { id: string }[], id: string) => arr.some(x => x.id === id)
const trashedIds = (d: AppData) => new Set(d.pets.filter(p => p.trashedAt).map(p => p.id))
// O que as telas veem: sem os pets da lixeira (e sem as vacinas/ocorrências deles).
export function visible(d: AppData): AppData { const t = trashedIds(d); return { ...d, pets: d.pets.filter(p => !p.trashedAt), vaccines: d.vaccines.filter(v => !t.has(v.petId)), incidents: d.incidents.filter(i => !t.has(i.petId)) } }
// Ao salvar a partir das telas, devolve os itens escondidos para não serem apagados.
export function unhide(full: AppData, d: AppData): AppData {
 const t = trashedIds(full)
 return { ...d, pets: [...d.pets, ...full.pets.filter(p => p.trashedAt && !has(d.pets, p.id))], vaccines: [...d.vaccines, ...full.vaccines.filter(v => t.has(v.petId) && !has(d.vaccines, v.id))], incidents: [...d.incidents, ...full.incidents.filter(i => t.has(i.petId) && !has(d.incidents, i.id))] }
}
export function purgePet(d: AppData, id: string): AppData { return { ...d, pets: d.pets.filter(p => p.id !== id), vaccines: d.vaccines.filter(v => v.petId !== id), incidents: d.incidents.filter(i => i.petId !== id) } }
export function expired(at?: string) { return !!at && Date.now() - new Date(at).getTime() > TRASH_DAYS * 864e5 }
export function daysLeft(at: string) { return Math.max(0, TRASH_DAYS - Math.floor((Date.now() - new Date(at).getTime()) / 864e5)) }
const BK = 'tia-ci-last-backup'
export const lastBackup = () => { try { return localStorage.getItem(BK) || '' } catch { return '' } }
export const markBackup = () => { try { localStorage.setItem(BK, new Date().toISOString()) } catch {} }
export const backupDue = () => { const l = lastBackup(); return !l || Date.now() - new Date(l).getTime() > 7 * 864e5 }
