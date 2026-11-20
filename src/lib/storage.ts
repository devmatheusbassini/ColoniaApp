import type { AppData } from '../types'
const KEY='tia-ci-data-v1'
const empty:AppData={pets:[],vaccines:[],budgets:[],incidents:[]}
export function loadData():AppData { try { const raw=JSON.parse(localStorage.getItem(KEY)||'null')||empty; return {pets:raw.pets||[],vaccines:raw.vaccines||[],budgets:(raw.budgets||[]).map((b:any)=>({...b,payments:b.payments||[]})),incidents:raw.incidents||[]} } catch { return empty } }
export function saveData(data:AppData){ localStorage.setItem(KEY,JSON.stringify(data)) }
export const uid=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`
